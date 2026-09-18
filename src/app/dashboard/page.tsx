export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserDecisionsWithMeta } from "@/lib/db/decisions";
import { getUserUsageSummary } from "@/lib/entitlements";
import { ProfileDropdown } from "@/components/auth/profile-dropdown";
import { UsageCard } from "@/components/dashboard/usage-card";
import { DecisionHistory } from "@/components/dashboard/decision-history";
import { isAdmin } from "@/lib/supabase/admin";
import { DeleteAccountModal } from "@/components/auth/delete-account-modal";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    throw new Error("Unable to verify onboarding status. Please try again.");
  }

  if (!profile?.onboarding_completed) {
    redirect("/onboarding");
  }

  const [allDecisions, usage, isUserAdmin] = await Promise.all([
    getUserDecisionsWithMeta(),
    getUserUsageSummary(user.id),
    isAdmin(),
  ]);

  console.log(`[AUTH_TRACE] route=/dashboard user_id=${user.id} plan=${usage.planName} timestamp=${new Date().toISOString()}`);

  // Metrics calculations
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const currentMonthDecisions = allDecisions.filter((d) => {
    const dDate = new Date(d.created_at);
    return dDate.getFullYear() === currentYear && dDate.getMonth() === currentMonth;
  });

  const decisionsThisMonth = currentMonthDecisions.length;
  const completedDecisions = allDecisions.filter((d) => d.status === "completed").length;
  const needingReview = allDecisions.filter((d) => d.status === "draft").length;

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12">
      <div className="mx-auto max-w-7xl space-y-8 animate-fade-in-up">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800 pb-6">
          <div className="space-y-1">
            <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
              <h1 className="text-3xl font-bold tracking-tight text-white">Auvora</h1>
            </Link>
            <p className="text-sm font-medium text-zinc-400">
              Think it through. Before reality does.
            </p>
          </div>
          <div className="flex items-center">
            <ProfileDropdown email={user.email} isAdmin={isUserAdmin} />
          </div>
        </header>

        {/* Dashboard Actions Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Decision Intelligence Dashboard</h2>
            <p className="text-sm text-zinc-400">Stress-test choices, surface risks, and track outcomes.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/patterns"
              className="inline-flex items-center justify-center rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400"
            >
              Decision Patterns
            </Link>
            <Link
              href="/decisions/new"
              className="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400"
            >
              + New Decision
            </Link>
          </div>
        </div>

        {/* Usage Entitlements Summary Card */}
        <UsageCard usage={usage} />

        {/* Summary Metrics Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-1">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Decisions this month
            </span>
            <div className="text-3xl font-bold text-white">{decisionsThisMonth}</div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-1">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Completed decisions
            </span>
            <div className="text-3xl font-bold text-white">{completedDecisions}</div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-1">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Needing review (Draft)
            </span>
            <div className="text-3xl font-bold text-white">{needingReview}</div>
          </div>
        </div>

        {/* Decision History Section */}
        <div className="space-y-4 pt-4 border-t border-zinc-800/80">
          <h3 className="text-base font-semibold text-zinc-200">Decision History & Outcomes</h3>
          <DecisionHistory decisions={allDecisions} />
        </div>

        {/* Account Settings / Danger Zone */}
        <div className="space-y-4 pt-8 border-t border-zinc-800/80">
          <h3 className="text-base font-semibold text-red-500">Account & Data Settings</h3>
          <div className="rounded-xl border border-red-900/30 bg-red-950/10 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 max-w-2xl">
              <h4 className="text-sm font-semibold text-zinc-200">Request Account & Data Deletion</h4>
              <p className="text-sm text-zinc-400 leading-relaxed">
                You can request the permanent deletion of your Auvora account and all associated decision data. Deletion requests are processed by our support team. Please note that this action is strictly irreversible.
              </p>
            </div>
            <DeleteAccountModal />
          </div>
        </div>
      </div>
    </main>
  );
}
