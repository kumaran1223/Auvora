import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  getDecisionById,
  getDecisionReport,
  getDecisionOutcome,
  saveDecisionReplay,
} from "@/lib/db/decisions";
import { normalizeReplayContext } from "@/lib/ai/types";
import { runAuvoraReplay } from "@/lib/ai/engine";
import { reserveAnalysisSlot, releaseAnalysisSlot } from "@/lib/entitlements";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: decisionId } = await context.params;
  let reservedSlot = false;
  let userId = "";

  // 1. Validate decision ID format
  if (!decisionId || !UUID_REGEX.test(decisionId)) {
    return NextResponse.json(
      { error: "Invalid decision ID format." },
      { status: 400 }
    );
  }

  try {
    // 2. Authenticate using Supabase SSR authentication
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // 3. Handle unauthenticated request
    if (!user) {
      return NextResponse.json(
        { error: "Unauthenticated. Please log in." },
        { status: 401 }
      );
    }
    userId = user.id;

    // 4. Load decision & verify ownership
    const decision = await getDecisionById(decisionId);

    // 5. If decision does not belong to user -> 404
    if (!decision || decision.user_id !== user.id) {
      return NextResponse.json(
        { error: "Decision not found or unauthorized." },
        { status: 404 }
      );
    }

    // 6. Require completed decision status
    if (decision.status !== "completed") {
      return NextResponse.json(
        { error: "Decision stress-test analysis must be completed before generating a replay." },
        { status: 400 }
      );
    }

    // 7. Load original decision report
    const report = await getDecisionReport(decisionId);
    if (!report) {
      return NextResponse.json(
        { error: "Original decision stress-test report not found." },
        { status: 400 }
      );
    }

    // 8. Load recorded outcome
    const outcome = await getDecisionOutcome(decisionId);
    if (!outcome) {
      return NextResponse.json(
        { error: "A real-world outcome must be recorded before generating a Decision Replay." },
        { status: 400 }
      );
    }

    // 9. Reserve monthly decision-analysis quota slot ONLY after prerequisite checks pass
    const reservation = await reserveAnalysisSlot(user.id);
    if (!reservation.allowed) {
      return NextResponse.json(
        {
          error:
            reservation.error ||
            "Monthly analysis limit reached. Please upgrade your plan to generate replays.",
          limitReached: true,
          currentCount: reservation.current_count,
          limit: reservation.limit,
          plan: reservation.plan,
        },
        { status: 429 }
      );
    }
    reservedSlot = true;

    // 10. Normalize replay context
    const normalizedContext = normalizeReplayContext(decision, report, outcome);

    // 11. Run exactly ONE OpenAI replay request
    const replayData = await runAuvoraReplay(normalizedContext);

    // 12. Determine exact outcome_recorded_at timestamp for traceability
    const outcomeRecordedAt = outcome.recorded_at || outcome.created_at;

    // 13. Persist latest replay using upsert
    let replayRecord = null;
    let saveError = null;

    try {
      replayRecord = await saveDecisionReplay(
        decisionId,
        outcome.id,
        outcomeRecordedAt,
        replayData
      );
    } catch (err) {
      saveError = err;
    }

    // 14. If replay persistence fails -> release slot
    if (saveError || !replayRecord) {
      if (reservedSlot && userId) {
        await releaseAnalysisSlot(userId);
        reservedSlot = false;
      }
      return NextResponse.json(
        { error: "Failed to persist decision replay record." },
        { status: 500 }
      );
    }

    // 15. Success -> return replay (slot remains consumed)
    return NextResponse.json(
      {
        success: true,
        message: "Decision replay generated successfully.",
        replay: replayRecord,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Replay API error:", error);

    // 16. If AI execution or setup fails -> release reserved slot
    if (reservedSlot && userId) {
      try {
        await releaseAnalysisSlot(userId);
      } catch {
        // Ignore secondary release errors
      }
    }

    const isGlobalQuotaExhausted = error instanceof Error && error.name === "GlobalProviderQuotaExhaustedError";
    const errorMessage = isGlobalQuotaExhausted
      ? error.message
      : "Failed to generate decision replay. Please try again.";
    const statusCode = isGlobalQuotaExhausted ? 503 : 500;

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}

