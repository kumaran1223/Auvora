import Link from "next/link";

interface SupportingDecision {
  decision_id: string;
  title: string;
  evidence: string;
}

interface PatternEvidenceProps {
  supportingDecisions: SupportingDecision[];
  evidenceCount: number;
  totalDecisions: number;
}

export function PatternEvidence({
  supportingDecisions,
  evidenceCount,
  totalDecisions,
}: PatternEvidenceProps) {
  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between border-t border-zinc-800/80 pt-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
          Supporting decisions
        </h4>
        <span className="text-sm font-mono text-zinc-400 bg-zinc-950 px-2.5 py-0.5 rounded border border-zinc-800">
          Appeared in {evidenceCount} of {totalDecisions} decisions
        </span>
      </div>

      <div className="space-y-2">
        {supportingDecisions.map((item, idx) => (
          <div
            key={`${item.decision_id}-${idx}`}
            className="rounded-lg border border-zinc-800/60 bg-zinc-950/50 p-3 text-sm space-y-1"
          >
            <div className="flex items-center justify-between">
              <Link
                href={`/decisions/${item.decision_id}`}
                className="font-medium text-amber-400 hover:text-amber-300 transition hover:underline"
              >
                {item.title}
              </Link>
            </div>
            <p className="text-base text-zinc-400 leading-relaxed">{item.evidence}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

