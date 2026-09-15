import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PLANS } from "@/lib/entitlements";
import { LogoutButton } from "@/components/auth/logout-button";
import { RazorpayCheckoutButton } from "@/components/billing/razorpay-checkout-button";
import { CancelSubscriptionButton } from "@/components/billing/cancel-subscription-button";

export default async function PricingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userPlan = "free";
  let activeSubRecord: {
    id: string;
    status: string;
    plan: string;
    cancel_at_period_end: boolean;
  } | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.plan) {
      userPlan = profile.plan.toLowerCase();
    }

    const { data: sub } = await supabase
      .from("subscriptions")
      .select("id, status, plan, cancel_at_period_end")
      .eq("user_id", user.id)
      .in("status", ["active", "authenticated"])
      .maybeSingle();

    if (sub) {
      activeSubRecord = sub;
    }
  }

  const plansList = [PLANS.free, PLANS.pro, PLANS.business];

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12">
      <div className="mx-auto max-w-5xl space-y-12">
        {/* Header Bar */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800 pb-6">
          <div className="space-y-1">
            <Link href="/" className="text-2xl font-bold tracking-tight text-white hover:opacity-90">
              Auvora
            </Link>
            <p className="text-xs text-zinc-400">Think it through. Before reality does.</p>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-xs font-semibold text-zinc-300 hover:text-white"
                >
                  ← Back to Dashboard
                </Link>
                <LogoutButton />
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-xs font-semibold text-zinc-300 hover:text-white"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-zinc-950 hover:bg-zinc-200"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </header>

        {/* Hero Banner */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Decision Intelligence Plans
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Every plan includes Auvora&apos;s full decision-stress-testing model (assumptions, evidence gaps, blind spots, risks, consequences, scenarios, and alternatives). Choose the monthly capacity that matches your decision volume.
          </p>
        </div>

        {activeSubRecord && (
          <div className="mx-auto max-w-xl rounded-xl border border-zinc-800 bg-zinc-900/80 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Subscription Active (Razorpay Test Mode)
              </div>
              <div className="text-xs text-zinc-300">
                You are currently subscribed to the <strong className="text-white capitalize">{activeSubRecord.plan}</strong> plan.
              </div>
            </div>
            <CancelSubscriptionButton cancelAtPeriodEnd={activeSubRecord.cancel_at_period_end} />
          </div>
        )}

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {plansList.map((plan) => {
            const isCurrent = userPlan === plan.id;
            const isPopular = plan.id === "pro";

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between rounded-2xl border p-6 space-y-6 transition ${
                  isPopular
                    ? "border-zinc-500 bg-zinc-900/90 shadow-2xl ring-1 ring-zinc-500"
                    : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-white/20 bg-white px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-950 shadow-md">
                    Most Popular
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                    {isCurrent && (
                      <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                        Current Plan
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-baseline space-x-1">
                      <span className="text-3xl font-extrabold text-white">{plan.price}</span>
                    </div>
                    <p className="text-xs text-zinc-400">{plan.description}</p>
                  </div>

                  <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3 text-center">
                    <span className="text-xs font-semibold text-zinc-200">
                      <strong className="text-white font-bold">{plan.monthlyLimit}</strong> analyses / month
                    </span>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                      Included Capabilities:
                    </div>
                    <ul className="space-y-2 text-xs text-zinc-400">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <svg
                            className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4">
                  {plan.id === "free" ? (
                    isCurrent ? (
                      <button
                        disabled
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-800/50 py-2.5 text-xs font-semibold text-zinc-400 cursor-default text-center"
                      >
                        Active Plan
                      </button>
                    ) : (
                      <Link
                        href={user ? "/dashboard" : "/signup"}
                        className="block w-full rounded-lg border border-zinc-700 bg-zinc-800 py-2.5 text-xs font-semibold text-zinc-200 transition hover:bg-zinc-700 text-center"
                      >
                        Default Tier
                      </Link>
                    )
                  ) : user ? (
                    <RazorpayCheckoutButton
                      plan={plan.id as "pro" | "business"}
                      buttonText={isCurrent ? "Active Plan" : `Upgrade to ${plan.name}`}
                      isCurrentPlan={isCurrent}
                    />
                  ) : (
                    <Link
                      href="/signup"
                      className="block w-full rounded-lg bg-white py-2.5 text-xs font-semibold text-zinc-950 transition hover:bg-zinc-200 text-center"
                    >
                      Get Started with {plan.name}
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Plan FAQ / Information */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 space-y-6">
          <h2 className="text-lg font-bold text-white">How Auvora Subscriptions & Quotas Work</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-zinc-400">
            <div className="space-y-2">
              <h3 className="font-semibold text-zinc-200">What counts as an analysis?</h3>
              <p className="leading-relaxed">
                Each stress-test execution (initial stress-test or re-analysis) consumes 1 monthly analysis slot. Viewing existing reports or editing decision parameters does not consume quota.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-zinc-200">When do monthly limits reset?</h3>
              <p className="leading-relaxed">
                Analysis limits reset on the 1st of every calendar month at 00:00 UTC. Unused analyses do not roll over to subsequent months.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-zinc-200">What happens if an analysis fails?</h3>
              <p className="leading-relaxed">
                If an AI engine request or report save fails due to network issues, your quota reservation is automatically released back to your account immediately.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-zinc-200">Are payments secure?</h3>
              <p className="leading-relaxed">
                All subscriptions are authenticated via Razorpay (Test Mode). No card credentials or banking passwords are ever stored on Auvora servers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
