import { DecisionOutcome } from "@/types/database";

interface AutopsyOutcomeProps {
  outcome: DecisionOutcome;
}

const OUTCOME_LABEL_MAP: Record<string, { label: string; style: string }> = {
  successful: {
    label: "Successful",
    style: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  partially_successful: {
    label: "Partially Successful",
    style: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  unsuccessful: {
    label: "Unsuccessful",
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

export function AutopsyOutcome({ outcome }: AutopsyOutcomeProps) {
  const outcomeInfo = OUTCOME_LABEL_MAP[outcome.outcome_status] || {
    label: outcome.outcome_status,
    style: "bg-zinc-800 text-zinc-300 border-zinc-700",
  };

  const actualObj = (outcome.actual_outcome as {
    what_happened?: string;
    what_surprised_you?: string;
  }) || {};

  const whatHappened = actualObj.what_happened || outcome.outcome_notes || "No notes provided.";
  const whatSurprisedYou = actualObj.what_surprised_you || "None reported.";

  const recordedDate = (outcome.recorded_at || outcome.created_at)
    ? new Date(outcome.recorded_at || outcome.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold uppercase tracking-wider text-zinc-300">
              Real-World Outcome
            </span>
            <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              USER REPORTED
            </span>
          </div>
          <p className="text-base text-zinc-400">
            This is the real-world outcome recorded by you.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-semibold border ${outcomeInfo.style}`}
          >
            {outcomeInfo.label}
          </span>
          {recordedDate && (
            <span className="text-sm font-mono text-zinc-400">{recordedDate}</span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
            What Actually Happened
          </h4>
          <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">
            {whatHappened}
          </p>
        </div>

        {whatSurprisedYou && (
          <div className="space-y-1 pt-2 border-t border-zinc-800/60">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
              What Surprised You
            </h4>
            <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
              {whatSurprisedYou}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

