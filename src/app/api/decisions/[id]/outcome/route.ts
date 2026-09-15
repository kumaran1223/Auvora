import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getDecisionById, saveDecisionOutcome } from "@/lib/db/decisions";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: decisionId } = await context.params;

  if (!decisionId || !UUID_REGEX.test(decisionId)) {
    return NextResponse.json(
      { error: "Invalid decision ID format." },
      { status: 400 }
    );
  }

  try {
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

    const decision = await getDecisionById(decisionId);

    if (!decision || decision.user_id !== user.id) {
      return NextResponse.json(
        { error: "Decision not found or unauthorized." },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { outcome_status, what_happened, what_surprised_you } = body;

    const validStatuses = ["successful", "partially_successful", "unsuccessful", "cancelled"];
    if (!outcome_status || !validStatuses.includes(outcome_status)) {
      return NextResponse.json(
        { error: "Invalid outcome status selected." },
        { status: 400 }
      );
    }

    if (!what_happened || typeof what_happened !== "string" || !what_happened.trim()) {
      return NextResponse.json(
        { error: "Please describe what actually happened after making this decision." },
        { status: 400 }
      );
    }

    if (what_happened.length > 5000) {
      return NextResponse.json(
        { error: "Outcome description is too long (maximum 5,000 characters)." },
        { status: 400 }
      );
    }

    if (what_surprised_you && typeof what_surprised_you === "string" && what_surprised_you.length > 5000) {
      return NextResponse.json(
        { error: "Surprise notes are too long (maximum 5,000 characters)." },
        { status: 400 }
      );
    }

    const outcomeRecord = await saveDecisionOutcome(decisionId, {
      outcome_status,
      what_happened: what_happened.trim(),
      what_surprised_you: typeof what_surprised_you === "string" ? what_surprised_you.trim() : "",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Decision outcome recorded successfully.",
        outcome: outcomeRecord,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Record outcome API error:", error);
    return NextResponse.json(
      { error: "Failed to record decision outcome." },
      { status: 500 }
    );
  }
}


