import type { AuvoraReportData } from "@/lib/ai/schemas";

interface StakeholderAnalysisProps {
  report: AuvoraReportData;
}

export function StakeholderAnalysis({ report }: StakeholderAnalysisProps) {
  const { stakeholders } = report;

  const influenceStyles: Record<string, string> = {
    low: "text-zinc-400 border-zinc-700 bg-zinc-800",
    medium: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    high: "text-purple-400 border-purple-500/30 bg-purple-500/10 font-bold",
  };

  return (
    <section id="stakeholders" className="scroll-mt-24 space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-white">Who This Decision Affects</h2>
        <p className="text-base text-zinc-400">
          Key internal and external stakeholder groups, their concerns, and recommended mitigations.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {stakeholders.map((sh, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-3 transition hover:bg-zinc-900/80"
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-semibold text-white">{sh.name}</h3>
                <span className="text-sm font-mono text-zinc-400">{sh.role}</span>
              </div>
              <span className={`rounded border px-2 py-0.5 text-[10px] uppercase tracking-wider ${influenceStyles[sh.influence] || ""}`}>
                {sh.influence} Influence
              </span>
            </div>

            <div className="space-y-2 text-sm pt-1 border-t border-zinc-850">
              <div>
                <span className="font-semibold text-zinc-400">Likely Reaction:</span>
                <p className="text-zinc-300">{sh.likely_reaction}</p>
              </div>

              <div>
                <span className="font-semibold text-amber-400">Primary Concern:</span>
                <p className="text-zinc-300">{sh.concern}</p>
              </div>

              <div>
                <span className="font-semibold text-emerald-400">Recommended Mitigation:</span>
                <p className="text-zinc-300">{sh.mitigation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

