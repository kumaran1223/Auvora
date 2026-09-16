"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AuvoraReportData } from "@/lib/ai/schemas";
import { LimitModal } from "@/components/decisions/limit-modal";

interface StressTestButtonProps {
  decisionId: string;
  decisionStatus: string;
}

export function StressTestButton({ decisionId, decisionStatus }: StressTestButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<AuvoraReportData | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [limitInfo, setLimitInfo] = useState<{ planName: string; limit: number }>({
    planName: "Free",
    limit: 3,
  });
  const router = useRouter();

  const handleStressTest = async () => {
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
        return;
      }

      setReport(data.report as AuvoraReportData);
      setLoading(false);
      router.refresh();
    } catch {
      setError("An unexpected error occurred during analysis.");
      setLoading(false);
    }
  };

  const isAnalyzing = decisionStatus === "analyzing" || loading;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-sm font-semibold text-white">AI Stress-Test Engine</h2>
          <p className="text-sm text-zinc-400">
            Expose assumptions, blind spots, second-order consequences, and scenarios.
          </p>
        </div>
        <button
          onClick={handleStressTest}
          disabled={isAnalyzing}
          className="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400 disabled:opacity-50"
        >
          {isAnalyzing ? (
            <span className="flex items-center space-x-2">
              <svg className="animate-spin h-3.5 w-3.5 text-zinc-950" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>Analyzing decision...</span>
            </span>
          ) : (
            "Stress-test with Auvora"
          )}
        </button>
      </div>

      {error && (
        <div className="rounded-md border border-red-900/50 bg-red-950/40 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {report && (
        <div className="rounded-xl border border-emerald-900/40 bg-zinc-900/90 p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="font-bold text-emerald-400 uppercase tracking-wider text-xs">
              Developer Test Report — Analysis Complete
            </h3>
            <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
              Risk Score: {report.risk_score}/100
            </span>
          </div>

          <div className="space-y-1">
            <h4 className="font-semibold text-zinc-200">Overview Summary</h4>
            <p className="text-zinc-300 leading-relaxed">{report.summary.overview}</p>
          </div>

          <div className="space-y-1">
            <h4 className="font-semibold text-zinc-200">Key Recommendation</h4>
            <p className="text-zinc-300">
              <strong className="uppercase tracking-wider text-amber-400 font-bold">
                {report.final_stress_test.recommendation}
              </strong>{" "}
              — {report.final_stress_test.reasoning}
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="font-semibold text-zinc-200">Top Kill Questions</h4>
            <ul className="list-disc list-inside space-y-1 text-zinc-300">
              {report.kill_questions.map((q, idx) => (
                <li key={idx}>{q}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <LimitModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        planName={limitInfo.planName}
        limit={limitInfo.limit}
      />
    </div>
  );
}
