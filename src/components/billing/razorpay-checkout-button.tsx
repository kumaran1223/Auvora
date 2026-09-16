"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface RazorpayCheckoutButtonProps {
  plan: "pro" | "business";
  buttonText: string;
  isCurrentPlan: boolean;
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_subscription_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: new (options: {
      key: string;
      subscription_id: string;
      name: string;
      description?: string;
      theme?: { color: string };
      handler: (response: RazorpayResponse) => Promise<void>;
      modal?: { ondismiss: () => void };
    }) => { open: () => void };
  }
}

export function RazorpayCheckoutButton({
  plan,
  buttonText,
  isCurrentPlan,
}: RazorpayCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const router = useRouter();

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    if (isCurrentPlan) return;
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      // 1. Load Razorpay Checkout SDK script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError("Failed to load Razorpay Checkout SDK. Please check connection.");
        setLoading(false);
        return;
      }

      // 2. Create subscription on server API
      const res = await fetch("/api/billing/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Unable to initialize subscription.");
        setLoading(false);
        return;
      }

      const { subscriptionId, keyId } = data;

      if (!keyId) {
        setError("Razorpay key ID is unconfigured.");
        setLoading(false);
        return;
      }

      // 3. Configure and open Razorpay Checkout modal
      const options = {
        key: keyId,
        subscription_id: subscriptionId,
        name: "Auvora Decision Intelligence",
        description: `Auvora ${plan.toUpperCase()} Monthly Subscription (Test Mode)`,
        theme: { color: "#09090b" },
        handler: async function (response: RazorpayResponse) {
          setLoading(true);
          try {
            // Verify payment signature on server
            const verifyRes = await fetch("/api/billing/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              setSuccessMsg("Payment authorization submitted. Your subscription is activated!");
              router.refresh();
            } else {
              setError(verifyData.error || "Payment verification failed.");
            }
          } catch {
            setError("Error submitting payment verification.");
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch {
      setError("An unexpected error occurred launching checkout.");
      setLoading(false);
    }
  };

  if (isCurrentPlan) {
    return (
      <button
        disabled
        className="w-full rounded-lg border border-zinc-800 bg-zinc-800/50 py-2.5 text-sm font-semibold text-zinc-400 cursor-default text-center"
      >
        Active Plan
      </button>
    );
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full rounded-lg bg-white py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 text-center disabled:opacity-50"
      >
        {loading ? (
          <span className="flex items-center justify-center space-x-2">
            <svg className="animate-spin h-3.5 w-3.5 text-zinc-950" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span>Launching Checkout...</span>
          </span>
        ) : (
          buttonText
        )}
      </button>

      {error && (
        <div className="rounded border border-red-900/50 bg-red-950/40 p-2 text-xs text-red-400 text-center">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="rounded border border-emerald-900/50 bg-emerald-950/40 p-2 text-xs text-emerald-400 text-center">
          {successMsg}
        </div>
      )}
    </div>
  );
}

