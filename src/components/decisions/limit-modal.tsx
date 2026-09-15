"use client";

import Link from "next/link";

interface LimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName?: string;
  limit?: number;
}

export function LimitModal({
  isOpen,
  onClose,
  planName = "Free",
  limit = 3,
}: LimitModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white">Monthly Analysis Limit Reached</h3>
          <p className="text-sm text-zinc-400">
            You&apos;ve used all <span className="font-semibold text-white">{limit} of {limit}</span> stress-test analyses included in your <span className="font-semibold text-white">{planName}</span> plan for this monthly period.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 space-y-2 text-xs text-zinc-300">
          <div className="font-semibold text-white">Upgrade to Pro ($19/mo) to unlock:</div>
          <ul className="space-y-1 text-zinc-400 list-disc list-inside">
            <li>30 AI stress-test analyses per month</li>
            <li>Kill question & blind spot auditing</li>
            <li>Priority AI engine processing</li>
          </ul>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/pricing"
            className="flex-1 inline-flex items-center justify-center rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
          >
            Upgrade Plan Now →
          </Link>
          <button
            onClick={onClose}
            className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

