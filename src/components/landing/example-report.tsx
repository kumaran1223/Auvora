export function ExampleReport() {
  return (
    <section className="border-t border-zinc-800/80 bg-zinc-950 py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 space-y-12">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Interactive Product Preview
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            See what a decision looks like under the microscope.
          </h2>
          <p className="text-lg text-zinc-400 leading-relaxed">
            Example stress-test report for: <strong className="text-white">&ldquo;Should we open our second restaurant location?&rdquo;</strong>
          </p>
        </div>

        {/* Demo Report UI Box */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 md:p-8 space-y-8 shadow-2xl relative">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
            <div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                Demo Sample Report
              </span>
              <h3 className="text-lg font-bold text-white">
                Second Restaurant Location Expansion
              </h3>
            </div>
            <span className="rounded-md border border-blue-500/40 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-400 uppercase tracking-wider">
              Recommendation: Proceed with conditions
            </span>
          </div>

          {/* Assumption Risk Map Preview */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Assumption Risk Map
            </h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-red-500/40 bg-red-950/20 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="rounded bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-400 uppercase">
                    Needs Verification
                  </span>
                  <span className="text-sm text-zinc-400">Conf: <strong className="text-white">39%</strong></span>
                </div>
                <p className="text-sm font-semibold text-white">
                  Cash flow survives first 6 months
                </p>
                <span className="inline-block text-[10px] font-bold text-red-400 uppercase">
                  Impact: Critical
                </span>
              </div>

              <div className="rounded-xl border border-amber-500/30 bg-zinc-950/60 p-6 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400 uppercase">
                    Assumed
                  </span>
                  <span className="text-sm text-zinc-400">Conf: <strong className="text-white">48%</strong></span>
                </div>
                <p className="text-sm font-semibold text-white">
                  New location gets enough foot traffic
                </p>
                <span className="inline-block text-[10px] font-bold text-amber-400 uppercase">
                  Impact: Very High
                </span>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 uppercase">
                    Known
                  </span>
                  <span className="text-sm text-zinc-400">Conf: <strong className="text-white">81%</strong></span>
                </div>
                <p className="text-sm font-semibold text-white">
                  Staff hiring will be manageable
                </p>
                <span className="inline-block text-[10px] font-bold text-zinc-400 uppercase">
                  Impact: Medium
                </span>
              </div>
            </div>
          </div>

          {/* Evidence Gap & Blind Spot Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 space-y-2">
              <span className="font-bold text-blue-400 uppercase tracking-wider text-xs">
                Key Evidence Gap
              </span>
              <p className="font-semibold text-white">
                &ldquo;What empirical data supports projected foot traffic at the new site?&rdquo;
              </p>
              <p className="text-zinc-400">
                Recommended verification: Run 3-day foot traffic count at peak hours before signing lease.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 space-y-2">
              <span className="font-bold text-red-400 uppercase tracking-wider text-xs">
                Critical Blind Spot
              </span>
              <p className="font-semibold text-white">
                &ldquo;Expansion may cannibalize focus & operating performance of Location #1.&rdquo;
              </p>
              <p className="text-zinc-400">
                What to check: Ensure experienced manager is assigned to Location #1 to preserve existing cash flow.
              </p>
            </div>
          </div>

          {/* Consequence Chain Flow */}
          <div className="rounded-xl border border-purple-500/30 bg-purple-950/10 p-5 space-y-3 text-xs">
            <span className="font-bold text-purple-400 uppercase tracking-wider text-xs">
              Second-Order Consequence Chain
            </span>
            <div className="flex flex-wrap items-center gap-2 text-zinc-200 font-mono text-xs">
              <span className="rounded bg-zinc-800 px-2 py-1">Expansion</span>
              <span className="text-purple-400 font-bold">&rarr;</span>
              <span className="rounded bg-zinc-800 px-2 py-1">Higher fixed costs</span>
              <span className="text-purple-400 font-bold">&rarr;</span>
              <span className="rounded bg-zinc-800 px-2 py-1">Higher revenue requirement</span>
              <span className="text-purple-400 font-bold">&rarr;</span>
              <span className="rounded bg-zinc-800 px-2 py-1">Increased sales pressure</span>
              <span className="text-purple-400 font-bold">&rarr;</span>
              <span className="rounded bg-red-950 border border-red-500/40 text-red-300 px-2 py-1 font-bold">
                Potential margin compression
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

