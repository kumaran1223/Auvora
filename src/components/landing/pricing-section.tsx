import Link from "next/link";

interface PricingSectionProps {
  isAuthenticated: boolean;
}

export function PricingSection({ isAuthenticated }: PricingSectionProps) {
  const ctaLink = isAuthenticated ? "/decisions/new" : "/signup";

  return (
    <section id="pricing" className="scroll-mt-20 border-t border-zinc-800/80 bg-zinc-950 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-8 space-y-12">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Simple Pricing
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Start Stress-Testing Today
          </h2>
          <p className="text-sm text-zinc-400">
            Put your business decisions under the microscope with no credit card required to start.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 max-w-2xl">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Free Starter Plan</h3>
                <p className="text-xs text-zinc-400">Essential decision intelligence for founders & owners.</p>
              </div>
              <span className="text-3xl font-bold text-white">$0</span>
            </div>

            <ul className="space-y-3 text-xs text-zinc-300">
              <li className="flex items-center space-x-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Full Auvora AI decision stress-testing engine</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Assumption Risk Mapping & Evidence Gap discovery</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Second-Order Consequence Chains & 3 Planning Scenarios</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Kill Questions & Executive Recommendation</span>
              </li>
            </ul>

            <div>
              <Link
                href={ctaLink}
                className="inline-flex w-full items-center justify-center rounded-md bg-white py-3 text-xs font-bold text-zinc-950 transition hover:bg-zinc-200"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

