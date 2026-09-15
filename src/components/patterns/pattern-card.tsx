import { DecisionPattern } from "@/types/database";
import { PatternConfidence } from "./pattern-confidence";
import { PatternImpact } from "./pattern-impact";
import { PatternEvidence } from "./pattern-evidence";
import { PatternCounterexamples } from "./pattern-counterexamples";

const TYPE_LABEL_MAP: Record<DecisionPattern["pattern_type"], string> = {
  assumption: "Assumption",
  evidence: "Evidence",
  risk: "Risk",
  blind_spot: "Blind Spot",
  timeline: "Timeline",
  financial: "Financial",
  operational: "Operational",
  strategic: "Strategic",
  stakeholder: "Stakeholder",
  outcome: "Outcome",
};

interface PatternCardProps {
  pattern: DecisionPattern;
  index: number;
}

export function PatternCard({ pattern, index }: PatternCardProps) {
  const typeLabel = TYPE_LABEL_MAP[pattern.pattern_type] || pattern.pattern_type;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-5 transition hover:border-zinc-700">
      {/* Header: Title & Badges */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/60 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-zinc-400">#0{index + 1}</span>
            <span className="inline-flex items-center rounded-md bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-300 border border-zinc-700">
              {typeLabel}
            </span>
            <PatternImpact impact={pattern.impact} />
          </div>

          <PatternConfidence confidence={pattern.confidence} />
        </div>

        <h3 className="text-lg font-bold text-white tracking-tight">{pattern.title}</h3>
      </div>

      {/* Description */}
      <div className="space-y-1">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Observed behavior
        </h4>
        <p className="text-sm text-zinc-300 leading-relaxed">{pattern.description}</p>
      </div>

      {/* Recommendation */}
      {pattern.recommendation && (
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 space-y-1">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            Process Recommendation
          </h4>
          <p className="text-sm text-zinc-200 leading-relaxed">{pattern.recommendation}</p>
        </div>
      )}

      {/* Supporting Decisions Evidence */}
      <PatternEvidence
        supportingDecisions={pattern.supporting_decisions}
        evidenceCount={pattern.evidence_count}
        totalDecisions={pattern.total_decisions}
      />

      {/* Counterexamples */}
      <PatternCounterexamples counterexamples={pattern.counterexamples} />
    </div>
  );
}
