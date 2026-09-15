import Link from "next/link";

interface Counterexample {
  decision_id: string;
  title: string;
  evidence: string;
}

interface PatternCounterexamplesProps {
  counterexamples: Counterexample[];
}

export function PatternCounterexamples({ counterexamples }: PatternCounterexamplesProps) {
  if (counterexamples.length === 0) {
    return (
      <div className="space-y-1.5 pt-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Counterexamples
        </h4>
        <p className="text-xs text-zinc-400 italic">
          No clear counterexamples were identified in the available history.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 pt-2">
      <div className="space-y-1">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Counterexamples
        </h4>
        <p className="text-xs text-zinc-400 leading-relaxed">
          These decisions do not fully match the pattern and help prevent Auvora from overstating
          the conclusion.
        </p>
      </div>

      <div className="space-y-2">
        {counterexamples.map((item, idx) => (
          <div
            key={`${item.decision_id}-${idx}`}
            className="rounded-lg border border-zinc-800/60 bg-zinc-950/40 p-3 text-sm space-y-1"
          >
            <Link
              href={`/decisions/${item.decision_id}`}
              className="font-medium text-zinc-300 hover:text-white transition hover:underline"
            >
              {item.title}
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed">{item.evidence}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
