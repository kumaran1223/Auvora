"use client";

import { useState } from "react";
import type { DecisionOutcome } from "@/types/database";
import { OutcomeModal } from "@/components/decisions/outcome-modal";

interface OutcomeSectionProps {
  decisionId: string;
  outcome: DecisionOutcome | null;
}

export function OutcomeSection({ decisionId, outcome }: OutcomeSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const statusBadges: Record<string, { label: string; classNames: string }> = {
    successful: {
      label: "Successful",
      classNames: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    },
    partially_successful: {
      label: "Partially Successful",
      classNames: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    },
    unsuccessful: {
      label: "Unsuccessful",
      classNames: "border-rose-500/30 bg-rose-500/10 text-rose-400",
    },
    cancelled: {
      label: "Cancelled",
      classNames: "border-zinc-700 bg-zinc-800 text-zinc-400",
    },
  };

  const actualObj = outcome?.actual_outcome
    ? (outcome.actual_outcome as { what_happened?: string; what_surprised_you?: string })
    : null;

  const currentBadge = outcome?.outcome_status
    ? statusBadges[outcome.outcome_status] || statusBadges["successful"]
    : null;

  const recordedDate = outcome?.recorded_at || outcome?.created_at;
  const formattedDate = recordedDate
    ? new Date(recordedDate).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <section id="outcome-section" className="scroll-mt-20 border-t border-zinc-800/80 pt-12">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 md:p-8 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Decision Reality Track
              </span>
              {currentBadge && (
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${currentBadge.classNames}`}
                >
                  {currentBadge.label}
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-white">Real-World Outcome</h2>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-xs font-semibold text-zinc-950 transition hover:bg-zinc-200"
          >
            {outcome ? "Edit Outcome" : "Record Outcome"}
          </button>
        </div>

        {outcome ? (
          <div className="space-y-6 text-xs">
            {formattedDate && (
              <div className="text-zinc-400">
                Recorded on <strong className="text-zinc-200">{formattedDate}</strong>
              </div>
            )}

            <div className="space-y-2">
              <h3 className="font-semibold text-zinc-200 uppercase tracking-wider text-[11px]">
                What Actually Happened
              </h3>
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-zinc-300 whitespace-pre-wrap leading-relaxed">
                {actualObj?.what_happened || outcome.outcome_notes || "No detailed outcome notes recorded."}
              </div>
            </div>

            {actualObj?.what_surprised_you && (
              <div className="space-y-2">
                <h3 className="font-semibold text-zinc-200 uppercase tracking-wider text-[11px]">
                  What Surprised You
                </h3>
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-zinc-300 whitespace-pre-wrap leading-relaxed">
                  {actualObj.what_surprised_you}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-zinc-400">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="space-y-1 max-w-md">
              <h3 className="text-base font-bold text-white">No outcome recorded yet</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                This decision has been analyzed by Auvora, but no real-world outcome has been recorded yet. Documenting what actually happened helps build your decision history.
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-md bg-white px-4 py-2 text-xs font-semibold text-zinc-950 transition hover:bg-zinc-200"
            >
              Record Outcome Now
            </button>
          </div>
        )}
      </div>

      <OutcomeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        decisionId={decisionId}
        existingOutcome={outcome}
      />
    </section>
  );
}
