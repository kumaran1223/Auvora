import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getDecisionById, updateDecision } from "@/lib/db/decisions";
import { normalizeDecisionContext } from "@/lib/ai/types";
import { runAuvoraAnalysis } from "@/lib/ai/engine";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: decisionId } = await context.params;

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

    // 4. Update status to 'analyzing'
    await updateDecision(decisionId, { status: "analyzing" });

    // 5. Normalize context & run AI analysis
    const normalizedContext = normalizeDecisionContext(decision);
    const reportData = await runAuvoraAnalysis(normalizedContext);

    // 6. Check for existing report
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
      // Rollback status to draft on DB save failure
      await updateDecision(decisionId, { status: "draft" });
      return NextResponse.json(
        { error: "Failed to persist analysis report." },
        { status: 500 }
      );
    }

    // 7. Mark decision status as completed
    await updateDecision(decisionId, { status: "completed" });

    return NextResponse.json(
      {
        success: true,
        report: reportData,
      },
      { status: 200 }
    );
  } catch {
    // Failure rollback: restore decision to 'draft'
    try {
      await updateDecision(decisionId, { status: "draft" });
    } catch {
      // Ignore secondary rollback errors
    }

    return NextResponse.json(
      { error: "AI analysis failed. Please verify configuration and try again." },
      { status: 500 }
    );
  }
}

