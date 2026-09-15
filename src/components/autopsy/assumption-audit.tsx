interface AssumptionResult {
  original_statement: string;
  result: "validated" | "failed" | "inconclusive" | string;
  explanation: string;
}

interface AssumptionAuditProps {
  assumptionResults: AssumptionResult[];
}

const BADGE_MAP: Record<string, { label: string; style: string }> = {
  validated: {
    label: "Validated",
    style: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  failed: {
    label: "Failed",
    style: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  },
  inconclusive: {
    label: "Inconclusive",
    style: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
};

export function AssumptionAudit({ assumptionResults }: AssumptionAuditProps) {
  if (!assumptionResults || assumptionResults.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 pt-4 border-t border-zinc-800">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-300">
          Assumption Audit
        </h3>
        <p className="text-xs text-zinc-400">
          Which assumptions held up—and which did not?
        </p>
      </div>

      <div className="divide-y divide-zinc-800/60 rounded-xl border border-zinc-800 bg-zinc-950/60">
        {assumptionResults.map((item, idx) => {
          const badge = BADGE_MAP[item.result] || BADGE_MAP["inconclusive"]!;

          return (
            <div key={idx} className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <span className="text-xs font-semibold text-zinc-200 leading-snug">
                  &quot;{item.original_statement}&quot;
                </span>
                <span
                  className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${badge.style}`}
                >
                  {badge.label}
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">{item.explanation}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
