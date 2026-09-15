import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserDecisionsWithMeta } from "@/lib/db/decisions";
import { getUserUsageSummary } from "@/lib/entitlements";
import { LogoutButton } from "@/components/auth/logout-button";
import { UsageCard } from "@/components/dashboard/usage-card";
import { DecisionHistory } from "@/components/dashboard/decision-history";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [allDecisions, usage] = await Promise.all([
    getUserDecisionsWithMeta(),
    getUserUsageSummary(user.id),
  ]);

  // Metrics calculations
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const decisionsThisMonth = allDecisions.filter((d) => {
    const created = new Date(d.created_at);
    return created.getFullYear() === currentYear && created.getMonth() === currentMonth;
  }).length;

  const completedDecisions = allDecisions.filter((d) => d.status === "completed").length;
  const needingReview = allDecisions.filter((d) => d.status === "draft").length;

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Top Navbar */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800 pb-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-white">Auvora</h1>
            <p className="text-sm font-medium text-zinc-400">
              Think it through. Before reality does.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-xs text-zinc-400 hidden sm:inline-block font-mono">
              {user.email}
            </span>
            <LogoutButton />
          </div>
        </header>

        {/* Dashboard Actions Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Decision Intelligence Dashboard</h2>
            <p className="text-xs text-zinc-400">Stress-test choices, surface risks, and track outcomes.</p>
          </div>
          <Link
            href="/decisions/new"
            className="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400"
          >
            + New Decision
          </Link>
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
      </div>
    </main>
  );
}
