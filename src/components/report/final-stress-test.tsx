import type { AuvoraReportData } from "@/lib/ai/schemas";

interface FinalStressTestProps {
  report: AuvoraReportData;
}

export function FinalStressTest({ report }: FinalStressTestProps) {
  const { final_stress_test } = report;

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

  const rec = recommendationLabels[final_stress_test.recommendation] || {
    label: final_stress_test.recommendation,
    style: "border-zinc-700 bg-zinc-800 text-zinc-300",
  };

  return (
    <section id="conclusion" className="scroll-mt-24 space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Final Stress Test Conclusion
        </h2>
        <p className="text-xs text-zinc-400">
          Synthesis of overall strategic risk, decision viability, and immediate commitment criteria.
        </p>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-6">
        {/* Recommendation Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800 pb-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Strategic Recommendation
            </span>
            <div className="flex items-center space-x-3">
              <span className={`rounded-md border px-3 py-1 text-sm font-bold uppercase tracking-wider ${rec.style}`}>
                {rec.label}
              </span>
              <span className="text-xs text-zinc-400">
                Decision Strength: <strong className="text-white capitalize">{final_stress_test.decision_strength}</strong>
              </span>
            </div>
          </div>

          <div className="text-right text-xs text-zinc-400">
            <span>Analysis Confidence: </span>
            <strong className="text-white text-base">{final_stress_test.confidence}%</strong>
          </div>
        </div>

        {/* Reasoning */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Strategic Reasoning
          </h3>
          <p className="text-sm text-zinc-200 leading-relaxed">
            {final_stress_test.reasoning}
          </p>
        </div>

        {/* Top 3 Actions before commitment */}
        {final_stress_test.top_3_actions_before_commitment &&
          final_stress_test.top_3_actions_before_commitment.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Top 3 Actions Before Commitment
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-xs text-zinc-200">
                {final_stress_test.top_3_actions_before_commitment.map((act, i) => (
                  <li key={i} className="font-medium">
                    {act}
                  </li>
                ))}
              </ol>
            </div>
          )}

        {/* Key Highlights Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-4 border-t border-zinc-800 text-xs">
          <div className="space-y-1">
            <span className="font-semibold text-amber-400">Biggest Assumption:</span>
            <p className="text-zinc-300">{final_stress_test.biggest_assumption}</p>
          </div>

          <div className="space-y-1">
            <span className="font-semibold text-blue-400">Biggest Evidence Gap:</span>
            <p className="text-zinc-300">{final_stress_test.biggest_evidence_gap}</p>
          </div>

          <div className="space-y-1">
            <span className="font-semibold text-red-400">Biggest Blind Spot:</span>
            <p className="text-zinc-300">{final_stress_test.biggest_blind_spot}</p>
          </div>

          <div className="space-y-1">
            <span className="font-semibold text-emerald-400">Decision Trigger (Go / No-Go):</span>
            <p className="text-zinc-300">{final_stress_test.decision_trigger}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

