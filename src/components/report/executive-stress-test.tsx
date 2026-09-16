import type { AuvoraReportData } from "@/lib/ai/schemas";

interface ExecutiveStressTestProps {
  report: AuvoraReportData;
}

export function ExecutiveStressTest({ report }: ExecutiveStressTestProps) {
  const { final_stress_test, summary } = report;

  const recommendationLabels: Record<string, { label: string; style: string }> = {
    proceed: {
      label: "Proceed",
      style: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
    },
    proceed_with_conditions: {
      label: "Proceed with conditions",
      style: "border-blue-500/40 bg-blue-500/10 text-blue-400",
    },
    delay_and_verify: {
      label: "Delay & verify",
      style: "border-amber-500/40 bg-amber-500/10 text-amber-400",
    },
    reconsider: {
      label: "Reconsider",
      style: "border-red-500/40 bg-red-500/10 text-red-400",
    },
  };

  const riskColors: Record<string, string> = {
    low: "text-emerald-400",
    medium: "text-amber-400",
    high: "text-orange-400",
    critical: "text-red-400",
  };

  const rec = recommendationLabels[final_stress_test.recommendation] || {
    label: final_stress_test.recommendation,
    style: "border-zinc-700 bg-zinc-800 text-zinc-300",
  };

  return (
    <section id="overview" className="scroll-mt-24 space-y-6">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
          Executive Summary
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Executive Stress Test
        </h2>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 gap-4 rounded-xl border border-zinc-800 bg-zinc-900/80 p-6 sm:grid-cols-4">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Overall Risk
          </span>
          <div className={`text-xl font-bold capitalize ${riskColors[final_stress_test.overall_risk] || "text-white"}`}>
            {final_stress_test.overall_risk}
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Decision Strength
          </span>
          <div className="text-xl font-bold text-white capitalize">
            {final_stress_test.decision_strength}
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Confidence
          </span>
          <div className="text-xl font-bold text-white">
            {final_stress_test.confidence}%
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Recommendation
          </span>
          <div>
            <span className={`inline-block rounded-md border px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${rec.style}`}>
              {rec.label}
            </span>
          </div>
        </div>
      </div>

      {/* Summary Narrative */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-base font-semibold text-zinc-200">Overview Narrative</h3>
          <p className="text-base text-zinc-300 leading-relaxed">{summary.overview}</p>
        </div>

        {summary.key_points && summary.key_points.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-zinc-800/80">
            <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
              Core Strategic Takeaways
            </h4>
            <ul className="list-disc list-inside space-y-1.5 text-sm text-zinc-300">
              {summary.key_points.map((pt, i) => (
                <li key={i}>{pt}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-2 text-sm text-zinc-500 italic">
          Auvora&apos;s assessment is based on the information provided and identified uncertainties.
        </div>
      </div>
    </section>
  );
}

