import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  getHistoricalDecisionEvidence,
  savePatternReport,
  validateAndCanonicalizePatternReport,
} from "@/lib/db/decision-patterns";
import { normalizePatternInput } from "@/lib/ai/types";
import { runAuvoraPatternAnalysis } from "@/lib/ai/engine";
import { reserveAnalysisSlot, releaseAnalysisSlot } from "@/lib/entitlements";
import { checkAiRateLimit } from "@/lib/security/rate-limit";

export async function POST() {
  let reservedSlot = false;
  let userId = "";

  try {
    // 1. Authenticate using Supabase SSR authentication
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // 2. Handle unauthenticated request -> 401
    if (!user) {
      return NextResponse.json(
        { error: "Unauthenticated. Please log in." },
        { status: 401 }
      );
    }
    userId = user.id;

    // 3. Retrieve historical decision evidence
    const historyResult = await getHistoricalDecisionEvidence();

    // 4. Require minimum 3 completed decisions with recorded outcomes -> 422
    if (
      historyResult.status === "insufficient_history" ||
      historyResult.eligibleDecisionCount < 3
    ) {
      return NextResponse.json(
        {
          error:
            "Insufficient decision history for pattern analysis. At least 3 decisions with recorded outcomes are required.",
          eligibleDecisionCount: historyResult.eligibleDecisionCount,
          minimumRequired: 3,
        },
        { status: 422 }
      );
    }

    // 4.5. HTTP rate limit check (soft shield)
    const rateLimit = checkAiRateLimit(user.id);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many AI requests. Please try again shortly." },
        { 
          status: 429,
          headers: { "Retry-After": String(rateLimit.retryAfter || 60) }
        }
      );
    }

    // 5. Reserve monthly decision-analysis quota slot ONLY after history check passes
    const reservation = await reserveAnalysisSlot(user.id);
    if (!reservation.allowed) {
      return NextResponse.json(
        {
          error:
            reservation.error ||
            "Monthly analysis limit reached. Please upgrade your plan to analyze decision patterns.",
          limitReached: true,
          currentCount: reservation.current_count,
          limit: reservation.limit,
          plan: reservation.plan,
        },
        { status: 429 }
      );
    }
    reservedSlot = true;

    // 6. Normalize pattern input dataset
    const normalizedInput = normalizePatternInput(historyResult.decisions);

    // 7. Run exactly ONE OpenAI pattern analysis request
    const aiReport = await runAuvoraPatternAnalysis(normalizedInput);

    // 8. Validate & canonicalize AI output against server evidence ground truth
    const canonicalReport = validateAndCanonicalizePatternReport(
      aiReport,
      historyResult.decisions
    );

    // 9. Persist structured pattern report (upsert per user)
    let savedReport = null;
    let saveError = null;

    try {
      savedReport = await savePatternReport(
        user.id,
        historyResult.eligibleDecisionCount,
        canonicalReport
      );
    } catch (err) {
      saveError = err;
    }

    // 10. If persistence fails -> release reserved quota slot
    if (saveError || !savedReport) {
      if (reservedSlot && userId) {
        await releaseAnalysisSlot(userId);
        reservedSlot = false;
      }
      return NextResponse.json(
        { error: "Failed to persist decision pattern report." },
        { status: 500 }
      );
    }

    // 11. Return pattern report response
    return NextResponse.json(
      {
        success: true,
        message: "Decision pattern analysis generated successfully.",
        report: savedReport,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Pattern Analysis API error:", error);

    // 12. If AI execution or setup fails -> release reserved slot
    if (reservedSlot && userId) {
      try {
        await releaseAnalysisSlot(userId);
      } catch {
        // Ignore secondary release errors
      }
    }

    const isGlobalQuotaExhausted = error instanceof Error && error.name === "GlobalProviderQuotaExhaustedError";
    const isGlobalGuardError = error instanceof Error && error.name === "GlobalProviderGuardError";
    
    let errorMessage = error instanceof Error ? error.message : "Failed to generate decision pattern report. Please try again.";
    let statusCode = 500;
    
    if (isGlobalQuotaExhausted || isGlobalGuardError) {
      errorMessage = "Auvora's AI analysis is temporarily unavailable. Please try again later.";
      statusCode = 503;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}

