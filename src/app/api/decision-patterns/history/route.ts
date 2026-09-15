import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getHistoricalDecisionEvidence } from "@/lib/db/decision-patterns";

export async function GET() {
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

    const historyResult = await getHistoricalDecisionEvidence();

    return NextResponse.json(historyResult, { status: 200 });
  } catch (error) {
    console.error("Historical evidence aggregation error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve historical decision evidence." },
      { status: 500 }
    );
  }
}

