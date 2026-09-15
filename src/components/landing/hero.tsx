import Link from "next/link";

interface HeroProps {
  isAuthenticated: boolean;
}

export function Hero({ isAuthenticated }: HeroProps) {
  const ctaLink = isAuthenticated ? "/decisions/new" : "/signup";

  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Text Column */}
          <div className="space-y-6 text-left lg:col-span-6">
            <div className="inline-flex items-center space-x-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
              <span>AI Decision-Intelligence for Business</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl leading-tight">
              Think it through. <br />
              <span className="text-zinc-400 font-normal">Before reality does.</span>
            </h1>

            <p className="max-w-xl text-base text-zinc-300 md:text-lg leading-relaxed">
              Auvora stress-tests important business decisions—exposing hidden assumptions, missing evidence, risks, and consequences before you commit capital.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
              <Link
                href={ctaLink}
                className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-bold text-zinc-950 transition hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400"
              >
                Stress-test a decision
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-md border border-zinc-700 bg-zinc-900 px-6 py-3 text-sm font-medium text-zinc-200 transition hover:bg-zinc-800"
              >
                See how it works
              </a>
            </div>
          </div>

          {/* Right Product Preview Mockup Column */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl space-y-4 text-xs relative">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    Interactive Product Preview
                  </span>
                  <h3 className="font-bold text-white text-sm">
                    &ldquo;Should we open our second location?&rdquo;
                  </h3>
                </div>
                <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400 uppercase">
                  Analysis Complete
                </span>
              </div>

              {/* Miniature Stats */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="rounded border border-zinc-800 bg-zinc-950 p-2">
                  <span className="block text-[9px] text-zinc-500 uppercase">Assumptions</span>
                  <strong className="text-white font-bold text-sm">7</strong>
                </div>
                <div className="rounded border border-zinc-800 bg-zinc-950 p-2">
                  <span className="block text-[9px] text-zinc-500 uppercase">Evidence Gaps</span>
                  <strong className="text-amber-400 font-bold text-sm">3</strong>
                </div>
                <div className="rounded border border-zinc-800 bg-zinc-950 p-2">
                  <span className="block text-[9px] text-zinc-500 uppercase">Blind Spots</span>
                  <strong className="text-red-400 font-bold text-sm">2</strong>
                </div>
                <div className="rounded border border-zinc-800 bg-zinc-950 p-2">
                  <span className="block text-[9px] text-zinc-500 uppercase">Consequences</span>
                  <strong className="text-purple-400 font-bold text-sm">4</strong>
                </div>
              </div>

              {/* Sample Consequence Chain */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                  Sample Consequence Chain
                </span>
                <div className="text-[11px] text-zinc-300 space-y-1 font-mono">
                  <div>1. Expansion <span className="text-zinc-500">&rarr;</span> 2. Higher Fixed Rent</div>
                  <div>3. Increased Revenue Burden <span className="text-zinc-500">&rarr;</span> 4. Potential Margin Compression</div>
                </div>
              </div>

              {/* Sample Recommendation */}
              <div className="rounded-xl border border-blue-500/30 bg-blue-950/20 p-3 text-[11px] space-y-1">
                <span className="font-bold text-blue-400 uppercase">Recommendation:</span>
                <p className="text-zinc-200">
                  Proceed with conditions — verify cash reserves cover 6 months before lease signing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

