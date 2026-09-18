import { createClient } from "@/lib/supabase/server";
import { getAdminSupabaseClient } from "@/lib/supabase/admin";
import {
  PlanConfig,
  PlanType,
  UserUsageSummary,
  ReserveAnalysisResult,
  ReleaseAnalysisResult,
} from "./types";

export const PLANS: Record<PlanType, PlanConfig> = {
  free: {
    id: "free",
    name: "Free",
    price: "$0",
    monthlyLimit: 3,
    description: "Essential decision stress-testing for early founders.",
    features: [
      "3 AI stress-test analyses per month",
      "Assumption & evidence gap discovery",
      "Second-order consequence mapping",
      "Full AI decision stress-testing engine",
      "Scenario comparison",
      "Standard support",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: "$19/mo",
    monthlyLimit: 30,
    description: "Deep decision intelligence for active business owners.",
    features: [
      "30 AI stress-test analyses per month",
      "Comprehensive risk & blind spot audit",
      "Kill question & assumption risk mapping",
      "Unlimited decision record storage",
      "Decision Replay against real outcomes",
      "Recurring Decision Patterns (Autopsy)",
      "Priority AI analysis execution",
    ],
  },
  business: {
    id: "business",
    name: "Business",
    price: "$79/mo",
    monthlyLimit: 100,
    description: "High-volume decision intelligence for growing teams.",
    features: [
      "100 AI stress-test analyses per month",
      "Multi-stakeholder impact matrix",
      "Advanced risk mitigation strategies",
      "Decision Replay against real outcomes",
      "Recurring Decision Patterns (Autopsy)",
      "Dedicated high-speed AI processing",
      "Premium founder support",
    ],
  },
};

export function getPlanConfig(planType: string | null | undefined): PlanConfig {
  const normalized = (planType?.toLowerCase() || "free") as PlanType;
  return PLANS[normalized] || PLANS.free;
}

export async function getUserUsageSummary(userId: string): Promise<UserUsageSummary> {
  const { isAdmin } = await import("@/lib/supabase/admin");
  const isUserAdmin = await isAdmin(userId);

  const supabase = await createClient();

  const now = new Date();

  // 1. Fetch effective plan from subscriptions or profile
  const { data: activeSub } = await supabase
    .from("subscriptions")
    .select("plan, status, current_period_end, cancel_at_period_end")
    .eq("user_id", userId)
    .in("status", ["active", "cancelled"])
    .order("created_at", { ascending: false })
    .maybeSingle();

  let effectivePlanStr = "free";

  if (activeSub) {
    if (activeSub.status === "active") {
      effectivePlanStr = activeSub.plan;
    } else if (
      activeSub.status === "cancelled" &&
      activeSub.cancel_at_period_end &&
      activeSub.current_period_end &&
      new Date(activeSub.current_period_end) > now
    ) {
      effectivePlanStr = activeSub.plan;
    }
  } else {
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", userId)
      .maybeSingle();
    if (profile?.plan) {
      effectivePlanStr = profile.plan;
    }
  }

  const planType = (effectivePlanStr.toLowerCase() || "free") as PlanType;
  const config = getPlanConfig(planType);

  // Calculate reset date (1st day of next month)
  const nextMonth = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1)
  );
  const resetDate = nextMonth.toISOString().split("T")[0] || "";

  if (isUserAdmin) {
    return {
      userId,
      plan: planType,
      planName: "Admin",
      monthlyLimit: null,
      usedCount: 0,
      remainingCount: null,
      percentageUsed: 0,
      resetDate,
      canAnalyze: true,
      isUnlimited: true,
    };
  }

  // 2. Determine current UTC period start (1st day of current month)
  const currentPeriodStart =
    new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
      .toISOString()
      .split("T")[0] || "";

  // 3. Fetch current monthly usage record
  const { data: usageRecord } = await supabase
    .from("decision_usage")
    .select("analysis_count")
    .eq("user_id", userId)
    .eq("period_start", currentPeriodStart)
    .maybeSingle();

  const usedCount = usageRecord?.analysis_count || 0;
  const remainingCount = Math.max(0, config.monthlyLimit - usedCount);
  const percentageUsed = Math.min(
    100,
    Math.round((usedCount / config.monthlyLimit) * 100)
  );

  return {
    userId,
    plan: planType,
    planName: config.name,
    monthlyLimit: config.monthlyLimit,
    usedCount,
    remainingCount,
    percentageUsed,
    resetDate,
    canAnalyze: remainingCount > 0,
    isUnlimited: false,
  };
}

export async function reserveAnalysisSlot(
  userId: string
): Promise<ReserveAnalysisResult> {
  const { isAdmin } = await import("@/lib/supabase/admin");
  const isUserAdmin = await isAdmin(userId);

  if (isUserAdmin) {
    return {
      allowed: true,
      current_count: 0,
      limit: null,
      plan: "free",
      isUnlimited: true,
    };
  }

  const adminClient = getAdminSupabaseClient();
  if (!adminClient) throw new Error("Missing admin client");

  const { data, error } = await adminClient.rpc("reserve_decision_analysis", {
    p_user_id: userId,
  });

  if (error) {
    console.error("RPC reserve_decision_analysis error:", error);
    return {
      allowed: false,
      current_count: 0,
      limit: 0,
      plan: "free",
      error: "Unable to process usage reservation.",
      isUnlimited: false,
    };
  }

  return { ...(data as ReserveAnalysisResult), isUnlimited: false };
}

export async function releaseAnalysisSlot(
  userId: string
): Promise<ReleaseAnalysisResult> {
  const { isAdmin } = await import("@/lib/supabase/admin");
  const isUserAdmin = await isAdmin(userId);

  if (isUserAdmin) {
    return { released: true, current_count: 0 };
  }

  const adminClient = getAdminSupabaseClient();
  if (!adminClient) throw new Error("Missing admin client");

  const { data, error } = await adminClient.rpc("release_decision_analysis", {
    p_user_id: userId,
  });

  if (error) {
    console.error("RPC release_decision_analysis error:", error);
    return { released: false, current_count: 0 };
  }

  return data as ReleaseAnalysisResult;
}





