interface AutopsyHeaderProps {
  decisionTitle: string;
  alignmentScore: number;
  outcomeStatus: string;
  recordedDate: string | null;
  replayCreatedAt?: string;
  onRunReplayClick: () => void;
  isLoading: boolean;
  isStale: boolean;
}

const OUTCOME_LABEL_MAP: Record<string, { label: string; style: string }> = {
  successful: {
    label: "Successful Outcome",
    style: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  partially_successful: {
    label: "Partially Successful",
    style: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  unsuccessful: {
    label: "Unsuccessful Outcome",
    style: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  },
  cancelled: {
    label: "Cancelled",
    style: "bg-zinc-800 text-zinc-400 border-zinc-700",
  },
  pending: {
    label: "Pending",
    style: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
};

export function AutopsyHeader({
  decisionTitle,
  alignmentScore,
  outcomeStatus,
  recordedDate,
  replayCreatedAt,
  onRunReplayClick,
  isLoading,
  isStale,
}: AutopsyHeaderProps) {
  const outcomeInfo = OUTCOME_LABEL_MAP[outcomeStatus] || {
    label: outcomeStatus,
    style: "bg-zinc-800 text-zinc-300 border-zinc-700",
  };

  const formattedDate = recordedDate
    ? new Date(recordedDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="space-y-6">
      {/* Top Header & Re-run Action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-zinc-800 pb-6">
        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
            DECISION AUTOPSY
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            What happened after the decision?
          </h2>
          <p className="max-w-2xl text-sm text-zinc-400 leading-relaxed">
            Compare Auvora&apos;s original stress test with the real-world outcome and capture what
            the decision taught you.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onRunReplayClick}
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-200 transition hover:bg-zinc-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-zinc-400 disabled:opacity-50"
          >
            {isLoading ? "Analyzing..." : isStale ? "Refresh Replay" : "Run Replay Again"}
          </button>
        </div>
      </div>

      {/* Decision Context Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400 bg-zinc-950/60 p-3.5 rounded-lg border border-zinc-800/80">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white">{decisionTitle}</span>
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border ${outcomeInfo.style}`}
          >
            {outcomeInfo.label}
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px] text-zinc-400">
          {formattedDate && <span>Outcome Recorded: {formattedDate}</span>}
          {replayCreatedAt && (
            <span>
              Latest Replay: {new Date(replayCreatedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {/* Prediction Alignment Card */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-300">
              Prediction Alignment
            </h3>
            <p className="text-xs text-zinc-400">
              How closely the reported outcome matched Auvora&apos;s original stress-test analysis.
            </p>
          </div>

          <div className="flex items-baseline space-x-1.5 shrink-0">
            <span className="text-4xl font-extrabold text-white tracking-tight">
              {alignmentScore}
            </span>
            <span className="text-sm font-medium text-zinc-400">/ 100</span>
          </div>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed italic">
          Prediction alignment measures how closely the reported outcome matched Auvora&apos;s
          original analysis. It does not measure whether the decision was successful.
        </p>
      </div>
    </div>
  );
}
