"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { DecisionOutcome } from "@/types/database";

interface OutcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  decisionId: string;
  existingOutcome?: DecisionOutcome | null;
  onSuccess?: () => void;
}

export function OutcomeModal({
  isOpen,
  onClose,
  decisionId,
  existingOutcome,
  onSuccess,
}: OutcomeModalProps) {
  const [outcomeStatus, setOutcomeStatus] = useState<
    "successful" | "partially_successful" | "unsuccessful" | "cancelled"
  >("successful");
  const [whatHappened, setWhatHappened] = useState("");
  const [whatSurprisedYou, setWhatSurprisedYou] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (existingOutcome) {
      setOutcomeStatus(
        (existingOutcome.outcome_status as
          | "successful"
          | "partially_successful"
          | "unsuccessful"
          | "cancelled") || "successful"
      );

      const actualObj = (existingOutcome.actual_outcome as {
        what_happened?: string;
        what_surprised_you?: string;
      }) || {};

      setWhatHappened(actualObj.what_happened || existingOutcome.outcome_notes || "");
      setWhatSurprisedYou(actualObj.what_surprised_you || "");
    } else {
      setOutcomeStatus("successful");
      setWhatHappened("");
      setWhatSurprisedYou("");
    }
  }, [existingOutcome, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatHappened.trim()) {
      setError("Please describe what actually happened after making this decision.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/decisions/${decisionId}/outcome`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          outcome_status: outcomeStatus,
          what_happened: whatHappened.trim(),
          what_surprised_you: whatSurprisedYou.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to record outcome.");
        setLoading(false);
        return;
      }

      setLoading(false);
      onClose();
      if (onSuccess) {
        onSuccess();
      }
      router.refresh();
    } catch {
      setError("An unexpected error occurred while saving outcome.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto space-y-5 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-white">
            {existingOutcome ? "Update Decision Outcome" : "Record Decision Outcome"}
          </h3>
          <p className="text-xs text-zinc-400">
            Document what actually happened after you made this decision to build your decision history.
          </p>
        </div>

        {error && (
          <div className="rounded-md border border-red-900/50 bg-red-950/40 p-3 text-xs text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Outcome Status Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-300">
              Outcome Status <span className="text-rose-400">*</span>
            </label>
            <select
              value={outcomeStatus}
              onChange={(e) =>
                setOutcomeStatus(
                  e.target.value as
                    | "successful"
                    | "partially_successful"
                    | "unsuccessful"
                    | "cancelled"
                )
              }
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs font-medium text-white focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            >
              <option value="successful">Successful — Decision achieved target goals</option>
              <option value="partially_successful">Partially Successful — Achieved some goals with unexpected trade-offs</option>
              <option value="unsuccessful">Unsuccessful — Missed key goals or encountered major issues</option>
              <option value="cancelled">Cancelled — Abandoned decision before full implementation</option>
            </select>
          </div>

          {/* What Actually Happened */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-300">
              What actually happened? <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={4}
              value={whatHappened}
              onChange={(e) => setWhatHappened(e.target.value)}
              placeholder="Describe what actually happened after you made this decision..."
              maxLength={5000}
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 p-3 text-xs text-zinc-200 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              required
            />
          </div>

          {/* What Surprised You */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-300">
              What surprised you? <span className="text-zinc-500 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={3}
              value={whatSurprisedYou}
              onChange={(e) => setWhatSurprisedYou(e.target.value)}
              placeholder="What happened differently from what you expected?"
              maxLength={5000}
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 p-3 text-xs text-zinc-200 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-md border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-700 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-xs font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center space-x-2">
                  <svg className="animate-spin h-3.5 w-3.5 text-zinc-950" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Saving outcome...</span>
                </span>
              ) : existingOutcome ? (
                "Update Outcome"
              ) : (
                "Record Outcome"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

