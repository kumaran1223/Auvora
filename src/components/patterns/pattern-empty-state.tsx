import Link from "next/link";

interface PatternEmptyStateProps {
  type: "no_history" | "history_ready" | "no_patterns_found";
  eligibleCount?: number;
  onAnalyzeClick?: () => void;
}

export function PatternEmptyState({
  type,
  eligibleCount = 0,
  onAnalyzeClick,
}: PatternEmptyStateProps) {
  if (type === "no_history") {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-8 sm:p-12 text-center space-y-5 max-w-xl mx-auto my-6">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 text-zinc-400 font-mono text-sm">
          {eligibleCount}/3
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">Not enough decision history yet.</h3>
          <p className="text-base text-zinc-400 leading-relaxed">
            Complete at least 3 decisions and record their real-world outcomes. Auvora will then
            look for recurring patterns across them.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400"
          >
            View Decisions
          </Link>
        </div>
      </div>
    );
  }

  if (type === "history_ready") {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-8 sm:p-12 text-center space-y-5 max-w-xl mx-auto my-6">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 font-bold text-sm">
          &#10003;
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">Your decision history is ready.</h3>
          <p className="text-base text-zinc-400 leading-relaxed">
            You have <strong className="text-white font-semibold">{eligibleCount}</strong> completed
            decisions with recorded outcomes. Analyze them to see whether recurring patterns emerge.
          </p>
        </div>

        <div className="pt-2 space-y-3">
          <button
            type="button"
            onClick={onAnalyzeClick}
            className="inline-flex items-center justify-center rounded-md bg-amber-500 px-6 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            Analyze My Decisions
          </button>
          <p className="text-base text-zinc-400">
            This uses one decision analysis from your current plan.
          </p>
        </div>
      </div>
    );
  }

  // type === 'no_patterns_found'
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-8 sm:p-12 text-center space-y-4 max-w-xl mx-auto my-6">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 text-zinc-400 text-lg font-mono">
        &Oslash;
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white">No recurring patterns emerged yet.</h3>
        <p className="text-base text-zinc-400 leading-relaxed">
          Auvora did not find enough consistent evidence across your current decision history to
          identify a reliable recurring pattern.
        </p>
      </div>

      <p className="text-sm text-zinc-400 max-w-md mx-auto pt-2">
        As you record more decision outcomes over time, recurring patterns will surface here automatically.
      </p>
    </div>
  );
}

