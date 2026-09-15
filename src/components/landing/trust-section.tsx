export function TrustSection() {
  const categories = [
    {
      label: "KNOWN",
      color: "border-emerald-500/30 bg-emerald-950/20 text-emerald-400",
      description: "Verified facts, data points, and explicit inputs provided in your decision scope.",
    },
    {
      label: "ASSUMED",
      color: "border-amber-500/30 bg-amber-950/20 text-amber-400",
      description: "Implicit premises, market hypotheses, and baseline predictions requiring scrutiny.",
    },
    {
      label: "UNKNOWN",
      color: "border-rose-500/30 bg-rose-950/20 text-rose-400",
      description: "External dependencies, competitor moves, macro risks, and unquantified variables.",
    },
    {
      label: "NEEDS VERIFICATION",
      color: "border-blue-500/30 bg-blue-950/20 text-blue-400",
      description: "Targeted kill questions and empirical tests to complete before committing capital.",
    },
  ];

  return (
    <section id="trust" className="scroll-mt-20 border-t border-zinc-800/80 bg-zinc-950 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-8 space-y-12">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Trust & Transparency
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Built on Rigorous Categorization, Not Unchecked Hype
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Generic AI generates plausible answers. Auvora separates hard evidence from hidden assumptions so you make decisions based on reality.
          </p>
        </div>

        {/* 4 Categories Framework Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4 transition hover:bg-zinc-900/80"
            >
              <div className="space-y-3">
                <span
                  className={`inline-block rounded-md border px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${cat.color}`}
                >
                  {cat.label}
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed">{cat.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Fiduciary / Decision Support Disclaimer Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 md:p-8 space-y-3">
          <div className="flex items-center space-x-2 text-amber-400">
            <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Decision-Support Disclaimer & Principle
            </h3>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed max-w-4xl">
            Auvora is an AI decision-intelligence and stress-testing platform designed to challenge business choices, expose blind spots, and map second-order consequences. It does not replace human judgment, legal counsel, financial auditing, or fiduciary responsibility. Auvora highlights risks and evidence gaps to empower founders, but the final choice and ultimate responsibility always remain yours.
          </p>
        </div>
      </div>
    </section>
  );
}
