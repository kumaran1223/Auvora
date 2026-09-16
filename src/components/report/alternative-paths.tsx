import type { AuvoraReportData } from "@/lib/ai/schemas";

interface AlternativePathsProps {
  report: AuvoraReportData;
}

export function AlternativePaths({ report }: AlternativePathsProps) {
  const { alternatives } = report;

  const riskStyles: Record<string, string> = {
    low: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    medium: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    high: "text-orange-400 border-orange-500/30 bg-orange-500/10",
    critical: "text-red-400 border-red-500/40 bg-red-500/20 font-bold",
  };

  return (
    <section id="alternatives" className="scroll-mt-24 space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-white">Alternative Paths</h2>
        <p className="text-base text-zinc-400">
          Comparing the original decision against realistic alternative choices and delay/do-nothing options.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {alternatives.map((alt, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-4 transition hover:bg-zinc-900/80"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-zinc-400 uppercase tracking-wider">
                  Option #{idx + 1}
                </span>
                <span className={`rounded border px-2 py-0.5 text-[10px] uppercase tracking-wider ${riskStyles[alt.risk_level] || ""}`}>
                  {alt.risk_level} Risk
                </span>
              </div>

              <h3 className="text-sm font-bold text-white leading-snug">{alt.title}</h3>
              <p className="text-base text-zinc-300 leading-relaxed">{alt.description}</p>

              <div className="space-y-2 pt-2 border-t border-zinc-800/80 text-sm">
                {alt.advantages && alt.advantages.length > 0 && (
                  <div>
                    <span className="font-semibold text-emerald-400">Advantages:</span>
                    <ul className="list-disc list-inside text-zinc-300 space-y-0.5">
                      {alt.advantages.map((adv, i) => (
                        <li key={i}>{adv}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {alt.disadvantages && alt.disadvantages.length > 0 && (
                  <div>
                    <span className="font-semibold text-red-400">Disadvantages:</span>
                    <ul className="list-disc list-inside text-zinc-300 space-y-0.5">
                      {alt.disadvantages.map((dis, i) => (
                        <li key={i}>{dis}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3 text-sm space-y-1">
              <span className="font-semibold text-amber-400">When to choose this path:</span>
              <p className="text-zinc-300">{alt.when_to_choose}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

