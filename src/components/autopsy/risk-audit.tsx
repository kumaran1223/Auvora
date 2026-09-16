interface RiskResult {
  risk_title: string;
  materialized: "yes" | "no" | "partially" | "inconclusive" | string;
  explanation: string;
}

interface RiskAuditProps {
  riskResults: RiskResult[];
}

const BADGE_MAP: Record<string, { label: string; style: string }> = {
  yes: {
    label: "Materialized",
    style: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  },
  partially: {
    label: "Partially Materialized",
    style: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  no: {
    label: "Did Not Materialize",
    style: "bg-zinc-800 text-zinc-300 border-zinc-700",
  },
  inconclusive: {
    label: "Inconclusive",
    style: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
};

export function RiskAudit({ riskResults }: RiskAuditProps) {
  if (!riskResults || riskResults.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 pt-4 border-t border-zinc-800">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-300">
          Risk Audit
        </h3>
        <p className="text-base text-zinc-400">
          Which risks materialized in reality?
        </p>
      </div>

      <div className="divide-y divide-zinc-800/60 rounded-xl border border-zinc-800 bg-zinc-950/60">
        {riskResults.map((item, idx) => {
          const badge = BADGE_MAP[item.materialized] || BADGE_MAP["inconclusive"]!;

          return (
            <div key={idx} className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <span className="text-sm font-semibold text-zinc-200 leading-snug">
                  {item.risk_title}
                </span>
                <span
                  className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${badge.style}`}
                >
                  {badge.label}
                </span>
              </div>
              <p className="text-base text-zinc-400 leading-relaxed">{item.explanation}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
