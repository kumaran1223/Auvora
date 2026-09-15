import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getDecisionById, updateDecision } from "@/lib/db/decisions";
import { normalizeDecisionContext } from "@/lib/ai/types";
import { runAuvoraAnalysis } from "@/lib/ai/engine";
import { reserveAnalysisSlot, releaseAnalysisSlot } from "@/lib/entitlements";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: decisionId } = await context.params;
  let reservedSlot = false;
  let userId = "";

  try {
    // 1. Authenticate user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthenticated. Please log in." },
        { status: 401 }
      );
    }
    userId = user.id;

    // 2. Load decision and verify ownership
    const decision = await getDecisionById(decisionId);

    if (!decision || decision.user_id !== user.id) {
      return NextResponse.json(
        { error: "Decision not found or unauthorized." },
        { status: 404 }
      );
    }

    // 3. Prevent duplicate concurrent requests if already analyzing
    if (decision.status === "analyzing") {
      return NextResponse.json(
        { error: "Decision is currently being analyzed." },
        { status: 409 }
      );
    }

    // 4. Reserve analysis slot (monthly quota check)
    const reservation = await reserveAnalysisSlot(user.id);
    if (!reservation.allowed) {
      return NextResponse.json(
        {
          error:
            reservation.error ||
            "Monthly analysis limit reached. Please upgrade your plan.",
          limitReached: true,
          currentCount: reservation.current_count,
          limit: reservation.limit,
          plan: reservation.plan,
        },
        { status: 429 }
      );
    }
    reservedSlot = true;

    // 5. Update status to 'analyzing'
    await updateDecision(decisionId, { status: "analyzing" });

    // 6. Normalize context & run AI analysis
    const normalizedContext = normalizeDecisionContext(decision);
    const reportData = await runAuvoraAnalysis(normalizedContext);

    // 7. Check for existing report
    const { data: existingReport } = await supabase
      .from("decision_reports")
      .select("id")
      .eq("decision_id", decisionId)
      .maybeSingle();

    const reportPayload = {
      decision_id: decisionId,
      user_id: user.id,
      risk_score: reportData.risk_score,
      summary: reportData.summary,
      assumptions: reportData.assumptions,
      evidence_gaps: reportData.evidence_gaps,
      blind_spots: reportData.blind_spots,
      stakeholders: reportData.stakeholders,
      consequences: {
        chains: reportData.consequences,
        risks: reportData.risks,
      },
      scenarios: reportData.scenarios,
      alternatives: reportData.alternatives,
      final_stress_test: {
        ...reportData.final_stress_test,
        kill_questions: reportData.kill_questions,
      },
    };

    let saveError = null;
    if (existingReport) {
      const { error } = await supabase
        .from("decision_reports")
        .update(reportPayload)
        .eq("id", existingReport.id);
      saveError = error;
    } else {
      const { error } = await supabase
        .from("decision_reports")
        .insert(reportPayload);
      saveError = error;
    }

    if (saveError) {
      // Rollback usage reservation & status to draft on DB save failure
      if (reservedSlot && userId) {
        await releaseAnalysisSlot(userId);
        reservedSlot = false;
      }
      await updateDecision(decisionId, { status: "draft" });
      return NextResponse.json(
        { error: "Failed to persist analysis report." },
        { status: 500 }
      );
    }

    // 8. Mark decision status as completed
    await updateDecision(decisionId, { status: "completed" });

    return NextResponse.json(
      {
        success: true,
        report: reportData,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    if (
      err &&
      typeof err === "object" &&
      ("issues" in err || (err as { name?: string }).name === "ZodError")
    ) {
      const zodErr = err as {
        name?: string;
        issues?: Array<{ path?: (string | number)[]; code?: string; message?: string }>;
      };
      console.error("[Analysis Error] ZodValidationFailure:", {
        name: zodErr.name || "ZodError",
        issues: zodErr.issues?.map((issue) => ({
          path: issue.path,
          code: issue.code,
          message: issue.message,
        })),
      });
    } else if (err instanceof Error) {
      console.error("[Analysis Error] Exception:", {
        name: err.name,
        message: err.message,
        stack: err.stack,
      });
    } else {
      console.error("[Analysis Error] UnknownType:", {
        error: String(err),
      });
    }

    // Failure rollback: release reserved usage slot & restore decision status to 'draft'
    if (reservedSlot && userId) {
      try {
        await releaseAnalysisSlot(userId);
      } catch {
        // Ignore secondary release errors
      }
    }

    try {
      await updateDecision(decisionId, { status: "draft" });
    } catch {
      // Ignore secondary rollback errors
    }

    const isGlobalQuotaExhausted = err instanceof Error && err.name === "GlobalProviderQuotaExhaustedError";
    const errorMessage = isGlobalQuotaExhausted
      ? err.message
      : "AI analysis failed. Please verify configuration and try again.";
    const statusCode = isGlobalQuotaExhausted ? 503 : 500;

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}
