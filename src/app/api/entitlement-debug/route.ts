import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserUsageSummary } from "@/lib/entitlements";
import { isAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(_request: Request) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json(
      { authenticated: false },
      {
        headers: {
          "Cache-Control": "private, no-store",
        },
      }
    );
  }

  // 1. Fetch profile plan directly
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .maybeSingle();

  // 2. Fetch subscription directly
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plan, status")
    .eq("user_id", user.id)
    .in("status", ["active", "cancelled"])
    .order("created_at", { ascending: false })
    .maybeSingle();

  // 3. Admin status
  const isUserAdmin = await isAdmin(user.id);

  // 4. Entitlement Summary
  const usage = await getUserUsageSummary(user.id);

  return NextResponse.json(
    {
      authenticated: true,
      auth_user_id: user.id,
      profile_plan: profile?.plan || "free",
      is_admin: isUserAdmin,
      entitlement_plan: usage.planName,
      analysis_limit: usage.monthlyLimit,
      usage_used: usage.usedCount,
      usage_remaining: usage.remainingCount,
      subscription_status: sub?.status || null,
      subscription_plan: sub?.plan || null,
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "private, no-store",
      },
    }
  );
}
