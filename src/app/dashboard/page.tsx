import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserDecisions } from "@/lib/db/decisions";
import { LogoutButton } from "@/components/auth/logout-button";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const allDecisions = await getUserDecisions();

  // Filter active (non-archived) and archived decisions
  const activeDecisions = allDecisions.filter((d) => d.status !== "archived");
  const recentDecisions = activeDecisions.slice(0, 10);

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

  const statusColors: Record<string, string> = {
    draft: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    analyzing: "border-blue-500/30 bg-blue-500/10 text-blue-400",
    completed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    archived: "border-zinc-700 bg-zinc-800 text-zinc-400",
  };

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

        {/* Recent Decisions Section */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-zinc-200">Recent Decisions</h3>

          {recentDecisions.length === 0 ? (
            /* Empty State */
            <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/20 p-8 text-center space-y-4">
              <div className="space-y-1">
                <h4 className="text-lg font-semibold text-white">No decisions yet.</h4>
                <p className="text-sm text-zinc-400">
                  Put your first important decision under the microscope.
                </p>
              </div>
              <Link
                href="/decisions/new"
                className="rounded-md bg-white px-4 py-2 text-xs font-semibold text-zinc-950 transition hover:bg-zinc-200"
              >
                Create your first decision
              </Link>
            </div>
          ) : (
            /* Decisions List */
            <div className="divide-y divide-zinc-800/60 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40">
              {recentDecisions.map((decision) => (
                <div
                  key={decision.id}
                  className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between transition hover:bg-zinc-900/80"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <Link
                        href={`/decisions/${decision.id}`}
                        className="font-semibold text-white hover:underline text-base"
                      >
                        {decision.title}
                      </Link>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                          statusColors[decision.status] || statusColors["draft"]
                        }`}
                      >
                        {decision.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-zinc-400">
                      {decision.industry && <span>Industry: {decision.industry}</span>}
                      <span>Created: {new Date(decision.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-2 sm:pt-0">
                    <Link
                      href={`/decisions/${decision.id}`}
                      className="rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-700"
                    >
                      View decision →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
