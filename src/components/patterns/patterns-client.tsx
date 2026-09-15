"use client";

import { useState } from "react";
import Link from "next/link";
import { DecisionPatternReport } from "@/types/database";
import { DecisionPatternsHistoryResult } from "@/lib/db/decision-patterns";
import { PatternPageHeader } from "./pattern-page-header";
import { PatternHistorySummary } from "./pattern-history-summary";
import { PatternReportSummary } from "./pattern-report-summary";
import { PatternCard } from "./pattern-card";
import { PatternDecisionHistory } from "./pattern-decision-history";
import { PatternEmptyState } from "./pattern-empty-state";
import { PatternLoadingState } from "./pattern-loading-state";
import { AnalyzePatternDialog } from "./analyze-pattern-dialog";

interface PatternsClientProps {
  initialHistory: DecisionPatternsHistoryResult;
  initialReport: DecisionPatternReport | null;
}

export function PatternsClient({ initialHistory, initialReport }: PatternsClientProps) {
  const [history, setHistory] = useState<DecisionPatternsHistoryResult>(initialHistory);
  const [report, setReport] = useState<DecisionPatternReport | null>(initialReport);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [errorInfo, setErrorInfo] = useState<{
    message: string;
    isQuota?: boolean;
  } | null>(null);

  const handleOpenAnalyzeDialog = () => {
    if (history.eligibleDecisionCount < 3) return;

    if (report) {
      // If report already exists, open confirmation dialog before re-analysis
      setIsConfirmOpen(true);
    } else {
      // Direct analysis trigger on first run
      executeAnalysis();
    }
  };

  const executeAnalysis = async () => {
    setIsConfirmOpen(false);
    setIsAnalyzing(true);
    setErrorInfo(null);

    try {
      const res = await fetch("/api/decision-patterns/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setErrorInfo({
            message:
              data.error ||
              "You've reached your decision analysis limit for this period.",
            isQuota: true,
          });
        } else if (res.status === 422) {
          setErrorInfo({
            message:
              data.error ||
              "Pattern analysis becomes useful once Auvora has at least 3 completed decisions with recorded outcomes.",
          });
        } else {
          setErrorInfo({
            message: data.error || "Failed to analyze decision patterns. Please try again.",
          });
        }
        return;
      }

      if (data.report) {
        setReport(data.report);

        // Optionally refresh history summary list in background
        fetch("/api/decision-patterns/history")
          .then((hRes) => hRes.json())
          .then((hData) => {
            if (hData && hData.decisions) {
              setHistory(hData);
            }
          })
          .catch(() => {});
      }
    } catch (err) {
      console.error("Pattern analysis error:", err);
      setErrorInfo({
        message: "An unexpected error occurred while analyzing patterns. Please try again.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const eligibleCount = history?.eligibleDecisionCount ?? 0;
  const hasReport = report != null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <PatternPageHeader
        eligibleCount={eligibleCount}
        hasReport={hasReport}
        isAnalyzing={isAnalyzing}
        onAnalyzeClick={handleOpenAnalyzeDialog}
      />

      {/* Confirmation Modal */}
      <AnalyzePatternDialog
        isOpen={isConfirmOpen}
        isAnalyzing={isAnalyzing}
        onConfirm={executeAnalysis}
        onCancel={() => setIsConfirmOpen(false)}
      />

      {/* Error Alert Box */}
      {errorInfo && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-5 space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-rose-400 font-bold text-lg">&excl;</span>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-rose-200">
                {errorInfo.isQuota
                  ? "Monthly analysis limit reached"
                  : "Analysis could not be completed"}
              </h4>
              <p className="text-xs text-rose-300 leading-relaxed">{errorInfo.message}</p>
            </div>
          </div>

          {errorInfo.isQuota && (
            <div className="pt-2">
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-md bg-rose-500 px-4 py-1.5 text-xs font-semibold text-zinc-950 transition hover:bg-rose-400"
              >
                View plans
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Loading State C */}
      {isAnalyzing ? (
        <PatternLoadingState />
      ) : (
        <>
          {/* Eligibility & Scope Summary */}
          <PatternHistorySummary
            eligibleCount={eligibleCount}
            analyzedCount={report?.decision_count}
          />

          {/* State A: Insufficient History (< 3 eligible decisions) */}
          {eligibleCount < 3 && <PatternEmptyState type="no_history" eligibleCount={eligibleCount} />}

          {/* State B: Eligible History Ready, No Existing Pattern Report */}
          {eligibleCount >= 3 && !report && (
            <PatternEmptyState
              type="history_ready"
              eligibleCount={eligibleCount}
              onAnalyzeClick={handleOpenAnalyzeDialog}
            />
          )}

          {/* State D: Pattern Report Available */}
          {report && (
            <div className="space-y-8 pt-2">
              {/* Executive Summary Card */}
              <PatternReportSummary
                decisionCount={report.decision_count}
                overallSummary={report.overall_summary}
                strongestPattern={report.strongest_pattern}
                recommendedChange={report.recommended_change}
              />

              {/* Recurring Patterns Section */}
              <div className="space-y-5">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Recurring Patterns
                  </h2>
                  <p className="text-xs text-zinc-400">
                    These patterns appeared across multiple decisions in your history. They describe
                    observed decision behavior, not personality traits.
                  </p>
                </div>

                {report.patterns.length > 0 ? (
                  <div className="space-y-6">
                    {report.patterns.map((pattern, idx) => (
                      <PatternCard key={`${pattern.title}-${idx}`} pattern={pattern} index={idx} />
                    ))}
                  </div>
                ) : (
                  <PatternEmptyState type="no_patterns_found" />
                )}
              </div>

              {/* Included Decision History List */}
              <PatternDecisionHistory decisions={history.decisions} />

              {/* Trust & Provenance Disclaimer Note */}
              <div className="rounded-lg border border-zinc-800/60 bg-zinc-950/40 p-4 text-center">
                <p className="text-xs text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                  Patterns are based on the decision history and outcomes you provided. They are
                  observations of past decision processes, not predictions or psychological
                  assessments.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
