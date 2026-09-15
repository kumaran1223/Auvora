import Link from "next/link";

interface PatternPageHeaderProps {
  eligibleCount: number;
  hasReport: boolean;
  isAnalyzing: boolean;
  onAnalyzeClick: () => void;
}

export function PatternPageHeader({
  eligibleCount,
  hasReport,
  isAnalyzing,
  onAnalyzeClick,
}: PatternPageHeaderProps) {
  const canAnalyze = eligibleCount >= 3;

  return (
    <header className="space-y-4 border-b border-zinc-800 pb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-500">
            Decision Patterns
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Learn how your decisions behave over time.
          </h1>
          <p className="max-w-3xl text-sm font-normal text-zinc-400 leading-relaxed">
            Auvora looks across completed decisions and real-world outcomes to identify recurring
            patterns, blind spots, and areas where your decision process may improve.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0 pt-2 sm:pt-0">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-md border border-zinc-800 bg-zinc-900/80 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          >
            Decision History
          </Link>

          {canAnalyze && (
            <button
              type="button"
              onClick={onAnalyzeClick}
              disabled={isAnalyzing}
              className="inline-flex items-center justify-center rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing
                ? "Analyzing..."
                : hasReport
                ? "Refresh Patterns"
                : "Analyze My Decisions"}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

