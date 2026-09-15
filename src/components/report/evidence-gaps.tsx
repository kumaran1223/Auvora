import type { AuvoraReportData } from "@/lib/ai/schemas";

interface EvidenceGapsProps {
  report: AuvoraReportData;
}

export function EvidenceGaps({ report }: EvidenceGapsProps) {
  const { evidence_gaps } = report;

  const impactStyles: Record<string, string> = {
    low: "text-zinc-400 border-zinc-700 bg-zinc-800",
    medium: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    high: "text-orange-400 border-orange-500/30 bg-orange-500/10",
    critical: "text-red-400 border-red-500/40 bg-red-500/20 font-bold",
  };

  return (
    <section id="evidence" className="scroll-mt-24 space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight text-white">Evidence Gaps</h2>
        <p className="text-xs text-zinc-400">
          What Auvora thinks you should verify before committing.
        </p>
      </div>

      <div className="space-y-4">
        {evidence_gaps.map((gap) => (
          <div
            key={gap.id}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-3 transition hover:bg-zinc-900/80"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-white">
                {gap.question}
              </h3>
              <span className={`rounded border px-2 py-0.5 text-[10px] uppercase tracking-wider ${impactStyles[gap.decision_impact] || ""}`}>
                {gap.decision_impact} Impact
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs pt-1">
              <div className="space-y-1">
                <span className="font-semibold text-zinc-400">Why it matters:</span>
                <p className="text-zinc-300">{gap.why_it_matters}</p>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-emerald-400">Recommended verification:</span>
                <p className="text-zinc-300">{gap.recommended_verification}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

