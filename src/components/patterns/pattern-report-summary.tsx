interface PatternReportSummaryProps {
  decisionCount: number;
  overallSummary: string;
  strongestPattern: string | null;
  recommendedChange: string | null;
}

export function PatternReportSummary({
  decisionCount,
  overallSummary,
  strongestPattern,
  recommendedChange,
}: PatternReportSummaryProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-6 space-y-5">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-white">Decision Pattern Summary</h2>
        <p className="text-sm text-zinc-400 font-mono">
          Across {decisionCount} completed decisions with recorded outcomes, Auvora observed:
        </p>
      </div>

      <p className="text-sm text-zinc-200 leading-relaxed bg-zinc-950/60 p-6 rounded-lg border border-zinc-800/80">
        {overallSummary}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {strongestPattern && (
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 space-y-1">
            <span className="text-xs font-medium uppercase tracking-wider text-amber-400">
              Strongest recurring pattern
            </span>
            <p className="text-sm font-semibold text-white">{strongestPattern}</p>
          </div>
        )}

        {recommendedChange && (
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-1">
            <span className="text-xs font-medium uppercase tracking-wider text-emerald-400">
              Recommended change
            </span>
            <p className="text-sm font-medium text-zinc-200">{recommendedChange}</p>
          </div>
        )}
      </div>
    </div>
  );
}

