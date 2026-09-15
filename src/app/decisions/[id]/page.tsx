import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDecisionById } from "@/lib/db/decisions";
import { ArchiveButton } from "@/components/decisions/archive-button";
import { DeleteModal } from "@/components/decisions/delete-modal";

interface DecisionDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function DecisionDetailPage({ params }: DecisionDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const decision = await getDecisionById(id);

  if (!decision) {
    notFound();
  }

  const statusColors: Record<string, string> = {
    draft: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    analyzing: "border-blue-500/30 bg-blue-500/10 text-blue-400",
    completed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    archived: "border-zinc-700 bg-zinc-800 text-zinc-400",
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Navigation & Actions Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800 pb-6">
          <div className="space-y-1">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-xs font-medium text-zinc-400 hover:text-white"
            >
              ← Back to Dashboard
            </Link>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold tracking-tight text-white">{decision.title}</h1>
              <span
                className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                  statusColors[decision.status] || statusColors["draft"]
                }`}
              >
                {decision.status}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              href={`/decisions/${decision.id}/edit`}
              className="rounded-md border border-zinc-700 bg-zinc-800 px-3.5 py-1.5 text-xs font-medium text-zinc-200 transition hover:bg-zinc-700"
            >
              Edit
            </Link>

            <ArchiveButton decisionId={decision.id} currentStatus={decision.status} />

            <DeleteModal decisionId={decision.id} decisionTitle={decision.title} />
          </div>
        </div>

        {/* Stress Test Action Banner */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-white">AI Stress-Test Analysis</h2>
              <p className="text-xs text-zinc-400">
                Uncover assumptions, blind spots, evidence gaps, and scenario outcomes.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                disabled
                className="rounded-md bg-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-500 cursor-not-allowed opacity-60"
              >
                Stress-test with Auvora
              </button>
              <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400 uppercase tracking-wide">
                Coming next
              </span>
            </div>
          </div>
        </div>

        {/* Core Decision Details */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Description / What you are considering
            </h2>
            <div className="whitespace-pre-wrap rounded-lg border border-zinc-850 bg-zinc-900/40 p-4 text-sm text-zinc-200">
              {decision.description}
            </div>
          </div>

          {decision.success_definition && (
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Success Definition
              </h2>
              <div className="whitespace-pre-wrap rounded-lg border border-zinc-850 bg-zinc-900/40 p-4 text-sm text-zinc-200">
                {decision.success_definition}
              </div>
            </div>
          )}

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 rounded-xl border border-zinc-850 bg-zinc-900/30 p-5 sm:grid-cols-4">
            <div>
              <span className="block text-[11px] font-medium text-zinc-500 uppercase">Industry</span>
              <span className="text-xs font-semibold text-zinc-200">
                {decision.industry || "—"}
              </span>
            </div>

            <div>
              <span className="block text-[11px] font-medium text-zinc-500 uppercase">Company Size</span>
              <span className="text-xs font-semibold text-zinc-200">
                {decision.company_size || "—"}
              </span>
            </div>

            <div>
              <span className="block text-[11px] font-medium text-zinc-500 uppercase">Budget</span>
              <span className="text-xs font-semibold text-zinc-200">
                {decision.budget != null ? decision.budget.toLocaleString() : "—"}
              </span>
            </div>

            <div>
              <span className="block text-[11px] font-medium text-zinc-500 uppercase">Timeline</span>
              <span className="text-xs font-semibold text-zinc-200">
                {decision.timeline || "—"}
              </span>
            </div>
          </div>

          {/* Dates footer */}
          <div className="flex justify-between text-[11px] text-zinc-500 pt-2 border-t border-zinc-900">
            <span>Created: {new Date(decision.created_at).toLocaleDateString()}</span>
            <span>Last Updated: {new Date(decision.updated_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </main>
  );
}

