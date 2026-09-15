export function FeatureGrid() {
  const features = [
    {
      title: "Hidden Assumptions",
      subtitle: "What must be true for the decision to work?",
      desc: "Identifies explicit and unstated dependencies, classifying them into Known, Assumed, Unknown, and Needs Verification.",
    },
    {
      title: "Evidence Gaps",
      subtitle: "What don't you know yet?",
      desc: "Pinpoints vital missing data and suggests practical verification actions to check before committing capital.",
    },
    {
      title: "Blind Spots",
      subtitle: "What might you be overlooking?",
      desc: "Exposes strategic and operational issues easy to miss when emotionally invested in a preferred option.",
    },
    {
      title: "Risks",
      subtitle: "What could materially go wrong?",
      desc: "Evaluates probability, impact, and severity with preventive mitigations.",
    },
    {
      title: "Second-Order Consequences",
      subtitle: "What happens after the immediate result?",
      desc: "Traces multi-step cascading effects (1st, 2nd, and 3rd order impacts) across your organization.",
    },
    {
      title: "Alternative Paths",
      subtitle: "What other paths exist?",
      desc: "Compares your proposed decision against realistic alternative choices and do-nothing/delay options.",
    },
    {
      title: "Scenario Analysis",
      subtitle: "What could the future look like?",
      desc: "Simulates Best-Case, Most-Likely, and Worst-Case planning scenarios with early warning triggers.",
    },
    {
      title: "Kill Questions",
      subtitle: "What should you answer before committing?",
      desc: "Generates 3–7 deal-breaker questions designed to test decision viability.",
    },
  ];

  return (
    <section className="border-t border-zinc-800/80 bg-zinc-950 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-8 space-y-12">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Analysis Depth
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            What Auvora Looks For
          </h2>
          <p className="text-sm text-zinc-400">
            A comprehensive strategic stress test covering every dimension of your business decision.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-2 transition hover:bg-zinc-900/80"
            >
              <h3 className="text-base font-bold text-white">{f.title}</h3>
              <p className="text-xs font-medium text-amber-400">{f.subtitle}</p>
              <p className="text-xs text-zinc-400 leading-relaxed pt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

