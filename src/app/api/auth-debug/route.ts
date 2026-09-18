import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserUsageSummary } from "@/lib/entitlements";

export const dynamic = "force-dynamic";

export async function GET(_request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      return NextResponse.json(
        {
          authenticated: false,
          error: "authentication_check_failed",
        },
        {
          status: 401,
          headers: {
            "Cache-Control": "private, no-store",
          },
        }
      );
    }

    if (!user) {
      return NextResponse.json(
        {
          authenticated: false,
        },
        {
          status: 401,
          headers: {
            "Cache-Control": "private, no-store",
          },
        }
      );
    }

    const usage = await getUserUsageSummary(user.id);

    return NextResponse.json(
      {
        authenticated: true,
        user_id: user.id,
        plan: usage.planName,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "private, no-store",
        },
      }
    );
  } catch {
    return NextResponse.json(
      {
        authenticated: false,
        error: "authentication_check_failed",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "private, no-store",
        },
      }
    );
  }
}
