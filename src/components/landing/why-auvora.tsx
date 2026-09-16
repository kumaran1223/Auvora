export function WhyAuvora() {
  return (
    <section id="why-auvora" className="scroll-mt-20 border-t border-zinc-800/80 bg-zinc-950 py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 space-y-12">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Product Philosophy
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl leading-tight">
            Don&apos;t ask AI what to do. <br />
            <span className="text-zinc-400 font-normal">Ask it to challenge why you&apos;re doing it.</span>
          </h2>
          <p className="text-base text-zinc-400 leading-relaxed">
            Generic AI chatbots generate quick answers and optimistic summaries. Auvora is designed to systematically interrogate the decision itself.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Generic AI Box */}
          <div className="rounded-xl border border-zinc-850 bg-zinc-900/30 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-zinc-400">Generic AI Chatbots</h3>
              <span className="text-[10px] font-mono text-zinc-500">Q&A Model</span>
            </div>
            <div className="space-y-2 text-sm text-zinc-400 font-mono">
              <div className="rounded bg-zinc-950 p-3">Question &rarr; Generated Answer</div>
              <p className="text-zinc-500 leading-relaxed pt-2">
                Provides plausible text without probing hidden dependencies, evidence gaps, or operational blind spots.
              </p>
            </div>
          </div>

          {/* Auvora Box */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-950/10 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <h3 className="text-sm font-bold text-white">Auvora Decision Intelligence</h3>
              <span className="text-[10px] font-bold text-amber-400 uppercase">Stress-Test Model</span>
            </div>
            <div className="space-y-2 text-sm text-zinc-200 font-mono">
              <div className="rounded border border-amber-500/20 bg-zinc-950 p-3 leading-relaxed">
                Decision &rarr; Assumptions &rarr; Evidence Gaps &rarr; Blind Spots &rarr; Risks &rarr; 2nd-Order Consequences &rarr; Scenarios &rarr; Alternatives &rarr; Stress Test
              </div>
              <p className="text-zinc-300 leading-relaxed pt-2">
                Systematically stress-tests business choices to expose missing facts before you commit capital.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

