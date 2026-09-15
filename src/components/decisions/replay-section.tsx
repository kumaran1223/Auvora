"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { DecisionReplay } from "@/types/database";

interface ReplaySectionProps {
  decisionId: string;
  status: string;
  hasReport: boolean;
  hasOutcome: boolean;
  existingReplay: DecisionReplay | null;
}

export function ReplaySection({
  decisionId,
  status,
  hasReport,
  hasOutcome,
  existingReplay,
}: ReplaySectionProps) {
  const [replay, setReplay] = useState<DecisionReplay | null>(existingReplay);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleGenerateReplay = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/decisions/${decisionId}/replay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to generate decision replay.");
        setLoading(false);
        return;
      }

      setReplay(data.replay);
      setLoading(false);
      router.refresh();
    } catch {
      setError("An unexpected error occurred while generating replay.");
      setLoading(false);
    }
  };

  // Badges for assumption result
  const assumptionBadges: Record<string, { label: string; classNames: string }> = {
    validated: {
      label: "Validated",
      classNames: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    },
    failed: {
      label: "Failed",
      classNames: "border-rose-500/30 bg-rose-500/10 text-rose-400",
    },
    inconclusive: {
      label: "Inconclusive",
      classNames: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    },
  };

  // Badges for risk result
  const riskBadges: Record<string, { label: string; classNames: string }> = {
    yes: {
      label: "Materialized",
      classNames: "border-rose-500/30 bg-rose-500/10 text-rose-400",
    },
    partially: {
      label: "Partially Materialized",
      classNames: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    },
    no: {
      label: "Not Materialized",
      classNames: "border-zinc-700 bg-zinc-800 text-zinc-300",
    },
    inconclusive: {
      label: "Inconclusive",
      classNames: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    },
  };

  // Badges for blind spot result
  const blindSpotBadges: Record<string, { label: string; classNames: string }> = {
    surfaced: {
      label: "Surfaced",
      classNames: "border-rose-500/30 bg-rose-500/10 text-rose-400",
    },
    not_observed: {
      label: "Not Observed",
      classNames: "border-zinc-700 bg-zinc-800 text-zinc-300",
    },
    inconclusive: {
      label: "Inconclusive",
      classNames: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    },
  };

  // Format outcome recorded timestamp for traceability
  const formattedRecordedDate = replay?.outcome_recorded_at
    ? new Date(replay.outcome_recorded_at).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <section id="replay-section" className="scroll-mt-20 border-t border-zinc-800/80 pt-12">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 md:p-8 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Post-Mortem & Audit
            </span>
            <h2 className="text-xl font-bold text-white">Decision Replay</h2>
          </div>

          {hasOutcome && hasReport && status === "completed" && (
            <button
              onClick={handleGenerateReplay}
              disabled={loading}
              className="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-xs font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center space-x-2">
                  <svg className="animate-spin h-3.5 w-3.5 text-zinc-950" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Analyzing replay...</span>
                </span>
              ) : replay ? (
                "Re-run Replay"
              ) : (
                "Generate Decision Replay"
              )}
            </button>
          )}
        </div>

        {error && (
          <div className="rounded-md border border-red-900/50 bg-red-950/40 p-3 text-xs text-red-400">
            {error}
          </div>
        )}

        {/* STATE 1: No Outcome Recorded */}
        {!hasOutcome ? (
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-zinc-400">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="space-y-1 max-w-md">
              <h3 className="text-sm font-bold text-white">Record a real-world outcome first</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Record a real-world outcome before generating a Decision Replay. Once documented, Auvora will audit predictions against reality.
              </p>
            </div>
          </div>
        ) : /* STATE 2: Outcome exists but no replay generated yet */
        !replay ? (
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
            <div className="space-y-1 max-w-md">
              <h3 className="text-base font-bold text-white">Compare predictions against reality</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Compare Auvora&apos;s original stress test against what actually happened to identify validated assumptions, materialized risks, and key strategic lessons.
              </p>
            </div>
            <button
              onClick={handleGenerateReplay}
              disabled={loading}
              className="rounded-md bg-white px-4 py-2 text-xs font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:opacity-50"
            >
              {loading ? "Generating Decision Replay..." : "Generate Decision Replay"}
            </button>
          </div>
        ) : (
          /* STATE 3: Replay Exists */
          <div className="space-y-8">
            {/* Prediction Alignment Card */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Prediction Alignment
                  </span>
                  <p className="text-[11px] text-zinc-500 font-normal">
                    Prediction Alignment — Not a measure of business success
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-white">{replay.alignment_score}</span>
                  <span className="text-xs text-zinc-400">/ 100</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-semibold text-zinc-200">{replay.overall_verdict}</div>
                <p className="text-xs text-zinc-400 leading-relaxed">{replay.key_takeaway}</p>
              </div>
            </div>

            {/* Assumption Audit */}
            {replay.assumption_results && replay.assumption_results.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Assumption Audit
                </h3>
                <div className="divide-y divide-zinc-800/60 rounded-xl border border-zinc-800 bg-zinc-950/60">
                  {replay.assumption_results.map((item, idx) => {
                    const fallbackBadge = { label: "Inconclusive", classNames: "border-amber-500/30 bg-amber-500/10 text-amber-400" };
                    const badge = (item.result && assumptionBadges[item.result]) ? assumptionBadges[item.result]! : fallbackBadge;
                    return (
                      <div key={idx} className="p-4 space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-xs font-medium text-zinc-200">
                            &quot;{item.original_statement}&quot;
                          </span>
                          <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${badge.classNames}`}>
                            {badge.label}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed">{item.explanation}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Risk Audit */}
            {replay.risk_results && replay.risk_results.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Risk Audit
                </h3>
                <div className="divide-y divide-zinc-800/60 rounded-xl border border-zinc-800 bg-zinc-950/60">
                  {replay.risk_results.map((item, idx) => {
                    const fallbackBadge = { label: "Inconclusive", classNames: "border-amber-500/30 bg-amber-500/10 text-amber-400" };
                    const badge = (item.materialized && riskBadges[item.materialized]) ? riskBadges[item.materialized]! : fallbackBadge;
                    return (
                      <div key={idx} className="p-4 space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-xs font-medium text-zinc-200">
                            {item.risk_title}
                          </span>
                          <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${badge.classNames}`}>
                            {badge.label}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed">{item.explanation}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Blind Spot Audit */}
            {replay.blind_spot_results && replay.blind_spot_results.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Blind Spot Audit
                </h3>
                <div className="divide-y divide-zinc-800/60 rounded-xl border border-zinc-800 bg-zinc-950/60">
                  {replay.blind_spot_results.map((item, idx) => {
                    const fallbackBadge = { label: "Inconclusive", classNames: "border-amber-500/30 bg-amber-500/10 text-amber-400" };
                    const badge = (item.result && blindSpotBadges[item.result]) ? blindSpotBadges[item.result]! : fallbackBadge;
                    return (
                      <div key={idx} className="p-4 space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-xs font-medium text-zinc-200">
                            {item.blind_spot_title}
                          </span>
                          <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${badge.classNames}`}>
                            {badge.label}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed">{item.explanation}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Strategic Lessons Learned */}
            {replay.lessons_learned && replay.lessons_learned.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Strategic Lessons Learned
                </h3>
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-2">
                  <ul className="list-disc list-inside text-xs text-zinc-300 space-y-2 leading-relaxed">
                    {replay.lessons_learned.map((lesson, idx) => (
                      <li key={idx}>{lesson}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Outcome Traceability Footer */}
            {formattedRecordedDate && (
              <div className="pt-2 text-[11px] text-zinc-500 border-t border-zinc-800/60 font-mono">
                Replay based on outcome recorded on <strong className="text-zinc-400">{formattedRecordedDate}</strong>.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
