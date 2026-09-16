import type { AuvoraReportData } from "@/lib/ai/schemas";

interface AssumptionRiskMapProps {
  report: AuvoraReportData;
}

export function AssumptionRiskMap({ report }: AssumptionRiskMapProps) {
  const { assumptions } = report;

  const classificationLabels: Record<string, { label: string; style: string }> = {
    known: { label: "Known Fact", style: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
    assumed: { label: "Assumed", style: "bg-blue-500/10 text-blue-400 border-blue-500/30" },
    unknown: { label: "Unknown", style: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
    needs_verification: { label: "Needs Verification", style: "bg-red-500/10 text-red-400 border-red-500/30" },
  };

  const impactStyles: Record<string, string> = {
    low: "text-zinc-400 border-zinc-700 bg-zinc-800",
    medium: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    high: "text-orange-400 border-orange-500/30 bg-orange-500/10",
    critical: "text-red-400 border-red-500/40 bg-red-500/20 font-bold",
  };

  return (
    <section id="assumptions" className="scroll-mt-24 space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-white">Assumption Risk Map</h2>
        <p className="text-base text-zinc-400">
          Every major decision depends on assumptions. Auvora identifies which ones could change the outcome.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {assumptions.map((item) => {
          const isHighPriority =
            (item.impact === "critical" || item.impact === "high") && item.confidence < 60;
          const classInfo = classificationLabels[item.classification] || {
            label: item.classification,
            style: "bg-zinc-800 text-zinc-300 border-zinc-700",
          };

          return (
            <div
              key={item.id}
              className={`rounded-xl border p-5 space-y-3 transition ${
                isHighPriority
                  ? "border-red-500/50 bg-red-950/20 shadow-md ring-1 ring-red-500/30"
                  : "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900/80"
              }`}
            >
              {/* Header Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className={`rounded border px-2 py-0.5 text-[10px] font-semibold ${classInfo.style}`}>
                  {classInfo.label}
                </span>

                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-zinc-400">Confidence: <strong className="text-white">{item.confidence}%</strong></span>
                  <span className={`rounded border px-2 py-0.5 uppercase tracking-wide text-[10px] ${impactStyles[item.impact] || ""}`}>
                    {item.impact}
                  </span>
                </div>
              </div>

              {/* Statement */}
              <h3 className="text-sm font-semibold text-white leading-snug">
                {item.statement}
              </h3>

              {/* Why it matters */}
              <div className="space-y-1 text-sm">
                <span className="font-semibold text-zinc-400">Why it matters:</span>
                <p className="text-zinc-300">{item.why_it_matters}</p>
              </div>

              {/* Verification Action */}
              <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3 text-sm space-y-1">
                <span className="font-semibold text-amber-400">Verify before committing:</span>
                <p className="text-zinc-300">{item.verification_action}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

