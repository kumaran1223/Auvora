import type { AuvoraReportData } from "@/lib/ai/schemas";

interface ConsequenceChainsProps {
  report: AuvoraReportData;
}

export function ConsequenceChains({ report }: ConsequenceChainsProps) {
  const { consequences } = report;

  return (
    <section id="consequences" className="scroll-mt-24 space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-white">Second-Order Consequences</h2>
        <p className="text-base text-zinc-400">
          Look beyond the immediate result. Trace cascading strategic implications.
        </p>
      </div>

      <div className="space-y-6">
        {consequences.map((chain, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4"
          >
            <div className="flex items-center space-x-2 text-sm font-semibold text-amber-400 uppercase tracking-wider">
              <span>Consequence Chain #{idx + 1}</span>
            </div>

            {/* Vertical Flow Diagram */}
            <div className="relative pl-6 space-y-4 border-l-2 border-zinc-800">
              {/* Trigger */}
              <div className="relative space-y-1">
                <span className="absolute -left-[31px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-800 text-[9px] font-bold text-zinc-400">
                  1
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Initial Trigger
                </span>
                <p className="text-sm font-semibold text-white">{chain.trigger}</p>
              </div>

              {/* Immediate Effect */}
              <div className="relative space-y-1">
                <span className="absolute -left-[31px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-900 text-[9px] font-bold text-blue-300">
                  2
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  Immediate Effect (1st Order)
                </span>
                <p className="text-sm text-zinc-200">{chain.immediate_effect}</p>
              </div>

              {/* Second Order Effect */}
              <div className="relative space-y-1">
                <span className="absolute -left-[31px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-purple-900 text-[9px] font-bold text-purple-300">
                  3
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                  Second-Order Effect
                </span>
                <p className="text-sm font-medium text-purple-200">{chain.second_order_effect}</p>
              </div>

              {/* Potential Third Order Effect */}
              <div className="relative space-y-1">
                <span className="absolute -left-[31px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-900 text-[9px] font-bold text-amber-300">
                  4
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Potential Third-Order Effect
                </span>
                <p className="text-base text-zinc-300">{chain.potential_third_order_effect}</p>
              </div>
            </div>

            {/* Strategic Implication Callout */}
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm space-y-1">
              <span className="font-bold text-amber-400 uppercase tracking-wider text-xs">
                Strategic Implication
              </span>
              <p className="text-zinc-200 font-medium leading-relaxed">
                {chain.strategic_implication}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

