"use client";

import Link from "next/link";
import { UserUsageSummary } from "@/lib/entitlements/types";

interface UsageCardProps {
  usage: UserUsageSummary;
}

export function UsageCard({ usage }: UsageCardProps) {
  const { planName, monthlyLimit, usedCount, remainingCount, percentageUsed, resetDate } = usage;

  // Determine bar color based on percentage used
  let barColorClass = "bg-emerald-500";
  let badgeColorClass = "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
  if (percentageUsed >= 100) {
    barColorClass = "bg-rose-500";
    badgeColorClass = "border-rose-500/30 bg-rose-500/10 text-rose-400";
  } else if (percentageUsed >= 70) {
    barColorClass = "bg-amber-500";
    badgeColorClass = "border-amber-500/30 bg-amber-500/10 text-amber-400";
  }

  const formattedResetDate = new Date(resetDate).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-semibold text-white">Monthly AI Analyses</span>
            <span
              className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${badgeColorClass}`}
            >
              {planName} Plan
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Resets on {formattedResetDate}
          </p>
        </div>

        <Link
          href="/pricing"
          className="inline-flex items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-1.5 text-xs font-medium text-zinc-200 transition hover:bg-zinc-700 hover:text-white"
        >
          {usage.plan === "business" ? "Manage Subscription" : "Upgrade Plan →"}
        </Link>
      </div>

      {/* Progress Bar & Stats */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-zinc-300">
            <span className="text-white font-bold">{usedCount}</span> of{" "}
            <span className="text-white font-bold">{monthlyLimit}</span> used
          </span>
          <span className="font-semibold text-zinc-400">
            {remainingCount} remaining
          </span>
        </div>

        <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-800">
          <div
            className={`h-full transition-all duration-500 ${barColorClass}`}
            style={{ width: `${percentageUsed}%` }}
          />
        </div>
      </div>

      {percentageUsed >= 100 && (
        <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-center justify-between">
          <span>You&apos;ve reached your monthly stress-test limit ({monthlyLimit}/{monthlyLimit}).</span>
          <Link href="/pricing" className="underline font-semibold ml-2 hover:text-white">
            Upgrade to Pro →
          </Link>
        </div>
      )}
    </div>
  );
}

