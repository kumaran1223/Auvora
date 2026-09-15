"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { DecisionOutcome, DecisionReplay } from "@/types/database";
import { AutopsyHeader } from "./autopsy-header";
import { AutopsyVerdict } from "./autopsy-verdict";
import { OutcomeTraceability } from "./outcome-traceability";
import { RightVsDiffered } from "./right-vs-differed";
import { AssumptionAudit } from "./assumption-audit";
import { RiskAudit } from "./risk-audit";
import { BlindSpotAudit } from "./blind-spot-audit";
import { StrategicLessons } from "./strategic-lessons";
import { AutopsyOutcome } from "./autopsy-outcome";
import { ReplayStaleState } from "./replay-stale-state";
import { ReplayAgainDialog } from "./replay-again-dialog";
import { OutcomeModal } from "@/components/decisions/outcome-modal";

interface DecisionAutopsyProps {
  decisionId: string;
  decisionTitle: string;
  decisionCreatedAt: string;
  status: string;
  hasReport: boolean;
  outcome: DecisionOutcome | null;
  replay: DecisionReplay | null;
}

export function DecisionAutopsy({
  decisionId,
  decisionTitle,
  decisionCreatedAt,
  status,
  hasReport,
  outcome,
  replay: initialReplay,
}: DecisionAutopsyProps) {
  const [replay, setReplay] = useState<DecisionReplay | null>(initialReplay);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isOutcomeModalOpen, setIsOutcomeModalOpen] = useState(false);
  const [errorInfo, setErrorInfo] = useState<{ message: string; isQuota?: boolean } | null>(null);
  const router = useRouter();

  // Check if existing replay is stale (outcome edited after replay generation)
  const isStale = Boolean(
    outcome && replay && replay.outcome_id !== outcome.id
  );

  const handleOpenConfirmDialog = () => {
    if (!outcome || !hasReport || status !== "completed") return;

    if (replay) {
      setIsConfirmOpen(true);
    } else {
      executeReplay();
    }
  };

  const executeReplay = async () => {
    setIsConfirmOpen(false);
    setIsLoading(true);
    setErrorInfo(null);

    try {
      const res = await fetch(`/api/decisions/${decisionId}/replay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (res.status === 429) {
          setErrorInfo({
            message:
              data.error ||
              "You've reached your decision analysis limit for this period.",
            isQuota: true,
          });
        } else {
          setErrorInfo({
            message: data.error || "Failed to generate decision replay.",
          });
        }
        setIsLoading(false);
        return;
      }

      setReplay(data.replay);
      setIsLoading(false);
      router.refresh();
    } catch {
      setErrorInfo({
        message: "An unexpected error occurred while generating decision replay.",
      });
      setIsLoading(false);
    }
  };

  return (
    <section id="decision-autopsy" className="scroll-mt-20 border-t border-zinc-800/80 pt-12">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 md:p-8 space-y-8">
        {/* Replay Confirmation Modal */}
        <ReplayAgainDialog
          isOpen={isConfirmOpen}
          isLoading={isLoading}
          onConfirm={executeReplay}
          onCancel={() => setIsConfirmOpen(false)}
        />

        {/* Outcome Modal for State A */}
        <OutcomeModal
          isOpen={isOutcomeModalOpen}
          onClose={() => setIsOutcomeModalOpen(false)}
          decisionId={decisionId}
          existingOutcome={null}
        />

        {/* Error Notification Banner */}
        {errorInfo && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 flex items-start justify-between gap-3 text-xs text-rose-300">
            <div className="space-y-1">
              <h4 className="font-semibold text-rose-200">
                {errorInfo.isQuota ? "Monthly limit reached" : "Replay generation failed"}
              </h4>
              <p>{errorInfo.message}</p>
            </div>
            {errorInfo.isQuota && (
              <a
                href="/pricing"
                className="shrink-0 rounded bg-rose-500 px-3 py-1 font-semibold text-zinc-950 hover:bg-rose-400"
              >
                View plans
              </a>
            )}
          </div>
        )}

        {/* STATE A: No Outcome Recorded */}
        {!outcome ? (
          <div className="flex flex-col items-center justify-center py-8 text-center space-y-4 max-w-md mx-auto">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 font-bold text-sm">
              ?
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                DECISION AUTOPSY
              </span>
              <h3 className="text-lg font-bold text-white">Record what happened</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Record what happened before Auvora can compare the decision with reality and audit
                predictions against what actually occurred.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsOutcomeModalOpen(true)}
                className="rounded-md bg-white px-4 py-2 text-xs font-semibold text-zinc-950 transition hover:bg-zinc-200"
              >
                Record Outcome
              </button>
            </div>
          </div>
        ) : /* STATE B: Outcome Exists, No Replay Generated Yet */
        !replay ? (
          <div className="flex flex-col items-center justify-center py-8 text-center space-y-4 max-w-md mx-auto">
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                DECISION AUTOPSY
              </span>
              <h3 className="text-lg font-bold text-white">
                Compare predictions against reality
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                The outcome is recorded. Generate a Decision Replay to compare what Auvora expected
                with what actually happened.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenConfirmDialog}
              disabled={isLoading || !hasReport || status !== "completed"}
              className="inline-flex items-center justify-center rounded-md bg-white px-5 py-2.5 text-xs font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:opacity-50"
            >
              {isLoading ? "Generating Decision Replay..." : "Generate Decision Replay"}
            </button>

            {!hasReport && (
              <p className="text-[11px] text-amber-400">
                Original stress-test report must be completed before generating a replay.
              </p>
            )}
          </div>
        ) : (
          /* STATE C: Full Decision Autopsy Experience */
          <div className="space-y-8">
            {/* Stale Warning Banner if outcome was edited */}
            {isStale && (
              <ReplayStaleState onRunReplayClick={handleOpenConfirmDialog} isLoading={isLoading} />
            )}

            {/* Header & Alignment Hero */}
            <AutopsyHeader
              decisionTitle={decisionTitle}
              alignmentScore={replay.alignment_score}
              outcomeStatus={outcome.outcome_status}
              recordedDate={outcome.recorded_at || outcome.created_at}
              replayCreatedAt={replay.created_at}
              onRunReplayClick={handleOpenConfirmDialog}
              isLoading={isLoading}
              isStale={isStale}
            />

            {/* Overall Verdict */}
            <AutopsyVerdict
              overallVerdict={replay.overall_verdict}
              keyTakeaway={replay.key_takeaway}
            />

            {/* Lifecycle & Traceability Timeline */}
            <OutcomeTraceability
              decisionCreatedDate={decisionCreatedAt}
              outcomeRecordedDate={outcome.recorded_at || outcome.created_at}
              replayCreatedDate={replay.created_at}
              outcomeStatus={outcome.outcome_status}
            />

            {/* Where Auvora Was Right vs Where Reality Differed */}
            <RightVsDiffered
              assumptionResults={replay.assumption_results as Array<{ result: string }>}
              riskResults={replay.risk_results as Array<{ materialized: string }>}
              blindSpotResults={replay.blind_spot_results as Array<{ result: string }>}
            />

            {/* Assumption Audit */}
            <AssumptionAudit
              assumptionResults={
                (replay.assumption_results as Array<{
                  original_statement: string;
                  result: string;
                  explanation: string;
                }>) || []
              }
            />

            {/* Risk Audit */}
            <RiskAudit
              riskResults={
                (replay.risk_results as Array<{
                  risk_title: string;
                  materialized: string;
                  explanation: string;
                }>) || []
              }
            />

            {/* Blind Spot Audit */}
            <BlindSpotAudit
              blindSpotResults={
                (replay.blind_spot_results as Array<{
                  blind_spot_title: string;
                  result: string;
                  explanation: string;
                }>) || []
              }
            />

            {/* Strategic Lessons & Take This Forward */}
            <StrategicLessons lessonsLearned={(replay.lessons_learned as string[]) || []} />

            {/* Real-World User Outcome */}
            <AutopsyOutcome outcome={outcome} />
          </div>
        )}
      </div>
    </section>
  );
}
