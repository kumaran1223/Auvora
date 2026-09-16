interface PatternHistorySummaryProps {
  eligibleCount: number;
  analyzedCount?: number;
}

export function PatternHistorySummary({
  eligibleCount,
  analyzedCount,
}: PatternHistorySummaryProps) {
  const isEligible = eligibleCount >= 3;

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-6 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Eligibility & History Scope
          </span>
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
              isEligible
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
            }`}
          >
            {isEligible ? "Ready for Pattern Analysis" : `${eligibleCount} of 3 decisions needed`}
          </span>
        </div>

        <p className="text-base text-zinc-300">
          {isEligible ? (
            analyzedCount != null ? (
              <>
                <strong className="text-white font-semibold">{analyzedCount}</strong> completed decisions included in current analysis.
              </>
            ) : (
              <>
                <strong className="text-white font-semibold">{eligibleCount}</strong> completed decisions with recorded outcomes ready for pattern analysis.
              </>
            )
          ) : (
            "Pattern analysis becomes useful once Auvora has at least 3 completed decisions with recorded outcomes."
          )}
        </p>
      </div>

      {!isEligible && (
        <div className="text-sm font-mono text-zinc-400 bg-zinc-950 px-3 py-1.5 rounded-md border border-zinc-800 shrink-0">
          {3 - eligibleCount} more required
        </div>
      )}
    </div>
  );
}

