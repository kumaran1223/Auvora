export function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Define",
      description: "Input your decision, objectives, budget, timeline, and what success looks like.",
    },
    {
      step: "02",
      title: "Expose",
      description: "Auvora categorizes information into Known, Assumed, Unknown, and Needs Verification.",
    },
    {
      step: "03",
      title: "Challenge",
      description: "It exposes critical blind spots, risk factors, stakeholder impacts, and 2nd-order consequence chains.",
    },
    {
      step: "04",
      title: "Compare",
      description: "Simulates Best, Likely, and Worst planning scenarios alongside realistic strategic alternatives.",
    },
    {
      step: "05",
      title: "Decide",
      description: "You receive a structured stress-test report with kill questions and clear go/no-go triggers.",
    },
  ];

  return (
    <section id="how-it-works" className="scroll-mt-20 border-t border-zinc-800/80 bg-zinc-950 py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 space-y-12">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Methodology
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            How Auvora Stress-Tests Your Decisions
          </h2>
          <p className="text-lg text-zinc-400 leading-relaxed">
            A 5-step systematic framework designed to interrogate business choices before you commit capital.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-900/40 p-8 space-y-4 transition hover:bg-zinc-900/80"
            >
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-amber-400">{s.step}</span>
                <h3 className="text-xl font-bold text-white">{s.title}</h3>
                <p className="text-base text-zinc-400 leading-relaxed">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

