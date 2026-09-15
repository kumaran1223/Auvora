"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CancelSubscriptionButtonProps {
  cancelAtPeriodEnd?: boolean;
}

export function CancelSubscriptionButton({ cancelAtPeriodEnd = false }: CancelSubscriptionButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel your subscription renewal? You will retain paid access until the end of your billing cycle.")) {
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch("/api/billing/cancel-subscription", {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to cancel subscription.");
        setLoading(false);
        return;
      }

      setMessage(data.message || "Subscription cancellation scheduled.");
      setLoading(false);
      router.refresh();
    } catch {
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  if (cancelAtPeriodEnd) {
    return (
      <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-300">
        Your subscription renewal is cancelled and will expire at the end of the current billing cycle.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleCancel}
        disabled={loading}
        className="rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-1.5 text-xs font-medium text-zinc-400 transition hover:bg-zinc-800 hover:text-white disabled:opacity-50"
      >
        {loading ? "Cancelling..." : "Cancel Subscription Renewal"}
      </button>

      {error && (
        <div className="text-[11px] text-red-400">{error}</div>
      )}
      {message && (
        <div className="text-[11px] text-emerald-400">{message}</div>
      )}
    </div>
  );
}

