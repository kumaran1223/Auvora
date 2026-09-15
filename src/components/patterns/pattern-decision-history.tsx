import Link from "next/link";
import { HistoricalDecisionEvidence } from "@/lib/db/decision-patterns";

interface PatternDecisionHistoryProps {
  decisions: HistoricalDecisionEvidence[];
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

export function PatternDecisionHistory({ decisions }: PatternDecisionHistoryProps) {
  if (!decisions || decisions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 pt-6 border-t border-zinc-800">
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-white">Decisions included</h3>
        <p className="text-xs text-zinc-400">
          The eligible completed decisions and recorded outcomes included in this analysis scope.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {decisions.map((ev) => {
          const outcomeInfo = OUTCOME_LABEL_MAP[ev.outcome.status] || {
            label: ev.outcome.status,
            style: "bg-zinc-800 text-zinc-300 border-zinc-700",
          };

          let replayBadgeLabel = "Outcome only";
          let replayBadgeStyle = "bg-zinc-800 text-zinc-400 border-zinc-700";

          if (ev.replay?.available) {
            replayBadgeLabel = "Replay available";
            replayBadgeStyle = "bg-blue-500/10 text-blue-400 border-blue-500/20";
          } else if (ev.replay?.inconsistent) {
            replayBadgeLabel = "Replay unavailable";
            replayBadgeStyle = "bg-amber-500/10 text-amber-400 border-amber-500/20";
          }

          const createdDate = new Date(ev.decision.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });

          return (
            <div
              key={ev.decision.id}
              className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 space-y-3 flex flex-col justify-between transition hover:border-zinc-700"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono text-zinc-400">{createdDate}</span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${outcomeInfo.style}`}
                    >
                      {outcomeInfo.label}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${replayBadgeStyle}`}
                    >
                      {replayBadgeLabel}
                    </span>
                  </div>
                </div>

                <h4 className="text-sm font-semibold text-white leading-snug">
                  {ev.decision.title}
                </h4>
              </div>

              <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-xs">
                <span className="text-zinc-400 truncate max-w-[200px]">
                  {ev.decision.industry || "General"}
                </span>
                <Link
                  href={`/decisions/${ev.decision.id}`}
                  className="font-medium text-amber-400 hover:text-amber-300 transition hover:underline"
                >
                  View decision &rarr;
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

