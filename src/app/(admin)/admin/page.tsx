import { getAdminSupabaseClient } from "@/lib/supabase/admin";

export default async function AdminOverviewPage() {
  const adminClient = getAdminSupabaseClient();
  
  if (!adminClient) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Overview</h1>
          <p className="mt-1 text-sm text-red-400">
            System configuration error: Admin client unavailable.
          </p>
        </div>
      </div>
    );
  }

  // Current UTC date format for ai_provider_usage (YYYY-MM-DD)
  const today = new Date().toISOString().split("T")[0];

  const [
    totalUsersResult,
    totalDecisionsResult,
    completedDecisionsResult,
    aiReportsResult,
    freePlanResult,
    proPlanResult,
    businessPlanResult,
    geminiUsageResult,
  ] = await Promise.allSettled([
    adminClient.from("profiles").select("id", { count: "exact", head: true }),
    adminClient.from("decisions").select("id", { count: "exact", head: true }),
    adminClient.from("decisions").select("id", { count: "exact", head: true }).eq("status", "completed"),
    adminClient.from("decision_reports").select("id", { count: "exact", head: true }),
    adminClient.from("profiles").select("id", { count: "exact", head: true }).eq("plan", "free"),
    adminClient.from("profiles").select("id", { count: "exact", head: true }).eq("plan", "pro"),
    adminClient.from("profiles").select("id", { count: "exact", head: true }).eq("plan", "business"),
    adminClient
      .from("ai_provider_usage")
      .select("request_count")
      .eq("provider", "gemini")
      .eq("usage_date", today)
      .maybeSingle(),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extractCount = (result: PromiseSettledResult<{ count: number | null, error: any }>) => {
    if (result.status === "fulfilled" && !result.value.error && result.value.count !== null) {
      return result.value.count;
    }
    return "Unavailable";
  };

  const totalUsers = extractCount(totalUsersResult);
  const totalDecisions = extractCount(totalDecisionsResult);
  const completedDecisions = extractCount(completedDecisionsResult);
  const aiReports = extractCount(aiReportsResult);
  
  const freeUsers = extractCount(freePlanResult);
  const proUsers = extractCount(proPlanResult);
  const businessUsers = extractCount(businessPlanResult);

  let geminiRequests: number | "Unavailable" = "Unavailable";
  if (geminiUsageResult.status === "fulfilled") {
    if (geminiUsageResult.value.error) {
      geminiRequests = "Unavailable";
    } else if (geminiUsageResult.value.data) {
      geminiRequests = geminiUsageResult.value.data.request_count;
    } else {
      // maybeSingle() returns data: null when no row is found
      geminiRequests = 0;
    }
  }

  const limitStr = process.env["AUVORA_GEMINI_DAILY_REQUEST_LIMIT"];
  let geminiLimit: number | "Unavailable" = "Unavailable";
  if (limitStr) {
    const parsed = parseInt(limitStr, 10);
    if (!isNaN(parsed)) {
      geminiLimit = parsed;
    }
  }

  let geminiRemaining: number | "Unavailable" = "Unavailable";
  if (typeof geminiRequests === "number" && typeof geminiLimit === "number") {
    geminiRemaining = Math.max(0, geminiLimit - geminiRequests);
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Overview</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Auvora administrative metrics and system status.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/20 p-5">
          <h3 className="text-sm font-medium text-zinc-400">Total Users</h3>
          <div className="mt-2 text-2xl font-semibold text-zinc-100">
            {totalUsers}
          </div>
        </div>
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/20 p-5">
          <h3 className="text-sm font-medium text-zinc-400">Total Decisions</h3>
          <div className="mt-2 text-2xl font-semibold text-zinc-100">
            {totalDecisions}
          </div>
        </div>
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/20 p-5">
          <h3 className="text-sm font-medium text-zinc-400">Completed Decisions</h3>
          <div className="mt-2 text-2xl font-semibold text-zinc-100">
            {completedDecisions}
          </div>
        </div>
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/20 p-5">
          <h3 className="text-sm font-medium text-zinc-400">AI Reports Generated</h3>
          <div className="mt-2 text-2xl font-semibold text-zinc-100">
            {aiReports}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/20 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-lg font-medium text-zinc-100">Plan Distribution</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-800/50">
              <span className="text-sm text-zinc-400">Free</span>
              <span className="text-sm font-medium text-zinc-100">{freeUsers}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-zinc-800/50">
              <span className="text-sm text-zinc-400">Pro</span>
              <span className="text-sm font-medium text-zinc-100">{proUsers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-400">Business</span>
              <span className="text-sm font-medium text-zinc-100">{businessUsers}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/20 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h3 className="text-lg font-medium text-zinc-100">Gemini Guard (UTC Today)</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-800/50">
              <span className="text-sm text-zinc-400">Today&apos;s Requests</span>
              <span className="text-sm font-medium text-zinc-100">{geminiRequests}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-zinc-800/50">
              <span className="text-sm text-zinc-400">Daily Limit</span>
              <span className="text-sm font-medium text-zinc-100">{geminiLimit}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-400">Remaining</span>
              <span className="text-sm font-medium text-zinc-100">{geminiRemaining}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
