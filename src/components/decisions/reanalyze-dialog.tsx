"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LimitModal } from "@/components/decisions/limit-modal";

interface ReanalyzeDialogProps {
  decisionId: string;
  hasExistingReport: boolean;
  onAnalysisSuccess?: () => void;
}

export function ReanalyzeDialog({
  decisionId,
  hasExistingReport,
  onAnalysisSuccess,
}: ReanalyzeDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [limitInfo, setLimitInfo] = useState<{ planName: string; limit: number }>({
    planName: "Free",
    limit: 3,
  });
  const router = useRouter();

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/decisions/${decisionId}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (res.status === 429 || data.limitReached) {
        setLoading(false);
        setIsOpen(false);
        setLimitInfo({
          planName: data.plan ? data.plan.toUpperCase() : "Free",
          limit: data.limit || 3,
        });
        setShowLimitModal(true);
        return;
      }

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to analyze decision.");
        setLoading(false);
        setIsOpen(false);
        return;
      }

      setLoading(false);
      setIsOpen(false);
      if (onAnalysisSuccess) {
        onAnalysisSuccess();
      }
      router.refresh();
    } catch {
      setError("An unexpected error occurred during analysis.");
      setLoading(false);
      setIsOpen(false);
    }
  };

  const handleButtonClick = () => {
    if (hasExistingReport) {
      setIsOpen(true);
    } else {
      runAnalysis();
    }
  };

  return (
    <>
      <div className="flex flex-col items-start sm:items-end gap-2">
        <button
          onClick={handleButtonClick}
          disabled={loading}
          className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400 disabled:opacity-50"
        >
          {loading
            ? "Stress-testing your decision..."
            : hasExistingReport
            ? "Stress-test again"
            : "Stress-test with Auvora"}
        </button>
        {error && (
          <div className="rounded border border-red-900/50 bg-red-950/40 px-3 py-1.5 text-sm text-red-400 max-w-xs text-left animate-in fade-in slide-in-from-top-1">
            {error}
          </div>
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md space-y-4 rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl text-left">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">Re-run Auvora Stress-Test?</h3>
              <p className="text-sm text-zinc-300">
                Running the AI stress-test again will update your existing report with a new analysis based on your current decision parameters.
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={loading}
                className="rounded-md border border-zinc-700 bg-zinc-800 px-3.5 py-1.5 text-sm font-medium text-zinc-300 hover:bg-zinc-700 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={runAnalysis}
                disabled={loading}
                className="rounded-md bg-white px-3.5 py-1.5 text-sm font-semibold text-zinc-950 hover:bg-zinc-200 disabled:opacity-50"
              >
                {loading ? "Analyzing..." : "Confirm & re-analyze"}
              </button>
            </div>
          </div>
        </div>
      )}

      <LimitModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        planName={limitInfo.planName}
        limit={limitInfo.limit}
      />
    </>
  );
}
