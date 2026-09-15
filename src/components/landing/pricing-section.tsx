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
            Put your business decisions under the microscope. Transparent monthly quotas with no hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Free Tier */}
          <div className="flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Free Starter</h3>
                <span className="text-2xl font-bold text-white">$0</span>
              </div>
              <p className="text-xs text-zinc-400">
                Essential decision intelligence for early founders.
              </p>
              <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-2.5 text-center text-xs font-semibold text-zinc-300">
                <strong className="text-white font-bold">3</strong> analyses / month
              </div>
              <ul className="space-y-2 text-xs text-zinc-400">
                <li className="flex items-center space-x-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Full AI decision stress-testing engine</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Assumption & evidence gap discovery</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Scenario & alternative comparison</span>
                </li>
              </ul>
            </div>
            <div>
              <Link
                href={ctaLink}
                className="inline-flex w-full items-center justify-center rounded-md bg-white py-2.5 text-xs font-bold text-zinc-950 transition hover:bg-zinc-200"
              >
                Get Started Free
              </Link>
            </div>
          </div>

          {/* Pro Tier */}
          <div className="relative flex flex-col justify-between rounded-2xl border border-zinc-500 bg-zinc-900/90 p-6 space-y-6 shadow-2xl ring-1 ring-zinc-500">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-white/20 bg-white px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-950">
              Most Popular
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Pro</h3>
                <span className="text-2xl font-bold text-white">$19/mo</span>
              </div>
              <p className="text-xs text-zinc-400">
                Deep decision intelligence for active business owners.
              </p>
              <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-2.5 text-center text-xs font-semibold text-zinc-300">
                <strong className="text-white font-bold">30</strong> analyses / month
              </div>
              <ul className="space-y-2 text-xs text-zinc-400">
                <li className="flex items-center space-x-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>30 AI stress-tests per month</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Kill questions & blind spot audit</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Priority AI engine processing</span>
                </li>
              </ul>
            </div>
            <div>
              <Link
                href="/pricing"
                className="inline-flex w-full items-center justify-center rounded-md bg-white py-2.5 text-xs font-bold text-zinc-950 transition hover:bg-zinc-200"
              >
                View Plan Details
              </Link>
            </div>
          </div>

          {/* Business Tier */}
          <div className="flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Business</h3>
                <span className="text-2xl font-bold text-white">$79/mo</span>
              </div>
              <p className="text-xs text-zinc-400">
                High-volume decision intelligence for growing teams.
              </p>
              <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-2.5 text-center text-xs font-semibold text-zinc-300">
                <strong className="text-white font-bold">100</strong> analyses / month
              </div>
              <ul className="space-y-2 text-xs text-zinc-400">
                <li className="flex items-center space-x-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>100 AI stress-tests per month</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Multi-stakeholder impact matrix</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Dedicated high-speed AI processing</span>
                </li>
              </ul>
            </div>
            <div>
              <Link
                href="/pricing"
                className="inline-flex w-full items-center justify-center rounded-md bg-white py-2.5 text-xs font-bold text-zinc-950 transition hover:bg-zinc-200"
              >
                View Plan Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
