export function ProblemSection() {
  const problems = [
    {
      title: "Unexamined Assumptions",
      description: "We assume demand will be there, hiring will be easy, and cash flow will hold up without proving it.",
    },
    {
      title: "Superficial Risk Analysis",
      description: "We focus on obvious initial risks while overlooking subtle, critical blind spots that actually break the model.",
    },
    {
      title: "First-Order Thinking",
      description: "We optimize for immediate results without mapping second and third-order strategic consequences.",
    },
    {
      title: "Confirmation Bias",
      description: "Once we favor a decision path, we gather evidence that supports it and ignore warning signals.",
    },
  ];

  return (
    <section className="border-t border-zinc-800/80 bg-zinc-950 py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 space-y-12">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            The Problem
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl leading-tight">
            Most decisions don&apos;t fail because the answer was impossible to find.
          </h2>
          <p className="text-xl font-medium text-zinc-400">
            They fail because the wrong assumptions went unchallenged.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {problems.map((p, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-8 space-y-3 transition hover:bg-zinc-900/80"
            >
              <span className="text-xs font-mono text-amber-400 font-bold">0{idx + 1}</span>
              <h3 className="text-xl font-bold text-white">{p.title}</h3>
              <p className="text-base text-zinc-400 leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

