import type { AuvoraReportData } from "@/lib/ai/schemas";

interface ScenarioAnalysisProps {
  report: AuvoraReportData;
}

export function ScenarioAnalysis({ report }: ScenarioAnalysisProps) {
  const { scenarios } = report;

  const typeConfig: Record<string, { label: string; headerStyle: string; badgeStyle: string }> = {
    best: {
      label: "Best Case Scenario",
      headerStyle: "border-emerald-500/40 bg-emerald-950/20",
      badgeStyle: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    },
    likely: {
      label: "Most Likely Scenario",
      headerStyle: "border-blue-500/40 bg-blue-950/20",
      badgeStyle: "border-blue-500/30 bg-blue-500/10 text-blue-400",
    },
    worst: {
      label: "Worst Case Scenario",
      headerStyle: "border-red-500/40 bg-red-950/20",
      badgeStyle: "border-red-500/30 bg-red-500/10 text-red-400",
    },
  };

  return (
    <section id="scenarios" className="scroll-mt-24 space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight text-white">Three Possible Paths</h2>
        <p className="text-xs text-zinc-400">
          Planning scenarios (Best, Most Likely, Worst). Note: Probabilities represent planning estimates, not guaranteed predictions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {scenarios.map((sc, idx) => {
          const cfg = typeConfig[sc.type] || {
            label: sc.type,
            headerStyle: "border-zinc-800 bg-zinc-900",
            badgeStyle: "border-zinc-700 bg-zinc-800 text-zinc-300",
          };

          return (
            <div
              key={idx}
              className={`flex flex-col justify-between rounded-xl border p-5 space-y-4 transition ${cfg.headerStyle}`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className={`rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${cfg.badgeStyle}`}>
                    {cfg.label}
                  </span>
                  <span className="text-xs font-semibold text-zinc-300">
                    Prob: <strong className="text-white">{sc.probability}%</strong>
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white leading-snug">{sc.title}</h3>
                <p className="text-xs text-zinc-300 leading-relaxed">{sc.description}</p>

                <div className="space-y-2 pt-2 border-t border-zinc-800/80 text-xs">
                  <div>
                    <span className="font-semibold text-zinc-400">Impact:</span>
                    <p className="text-zinc-200">{sc.impact}</p>
                  </div>

                  {sc.triggers && sc.triggers.length > 0 && (
                    <div>
                      <span className="font-semibold text-amber-400">Triggers:</span>
                      <ul className="list-disc list-inside text-zinc-300 space-y-0.5">
                        {sc.triggers.map((t, i) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {sc.early_signals && sc.early_signals.length > 0 && (
                    <div>
                      <span className="font-semibold text-blue-400">Early Signals:</span>
                      <ul className="list-disc list-inside text-zinc-300 space-y-0.5">
                        {sc.early_signals.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3 text-xs space-y-1">
                <span className="font-semibold text-emerald-400">Planned Response:</span>
                <p className="text-zinc-300">{sc.response}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

