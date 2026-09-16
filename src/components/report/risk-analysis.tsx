import type { AuvoraReportData } from "@/lib/ai/schemas";

interface RiskAnalysisProps {
  report: AuvoraReportData;
}

export function RiskAnalysis({ report }: RiskAnalysisProps) {
  const { risks } = report;

  const severityStyles: Record<string, string> = {
    low: "text-zinc-400 border-zinc-700 bg-zinc-800",
    medium: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    high: "text-orange-400 border-orange-500/30 bg-orange-500/10",
    critical: "text-red-400 border-red-500/40 bg-red-500/20 font-bold",
  };

  return (
    <section id="risks" className="scroll-mt-24 space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-white">Risk Analysis</h2>
        <p className="text-base text-zinc-400">
          Core risk factors, probability assessments, and preventive mitigations.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {risks.map((risk, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-3 transition hover:bg-zinc-900/80"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-semibold text-white">{risk.title}</h3>
              <span className={`rounded border px-2 py-0.5 text-[10px] uppercase tracking-wider ${severityStyles[risk.severity] || ""}`}>
                {risk.severity} Severity
              </span>
            </div>

            <p className="text-base text-zinc-300 leading-relaxed">{risk.description}</p>

            <div className="flex items-center justify-between text-sm text-zinc-400 pt-1 border-t border-zinc-850">
              <span>Likelihood: <strong className="text-white capitalize">{risk.likelihood}</strong></span>
              <span>Impact: <strong className="text-white capitalize">{risk.impact}</strong></span>
            </div>

            <div className="rounded-lg border border-zinc-850 bg-zinc-950/60 p-3 text-sm space-y-1">
              <span className="font-semibold text-emerald-400">Mitigation Strategy:</span>
              <p className="text-zinc-300">{risk.mitigation}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

