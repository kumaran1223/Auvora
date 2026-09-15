interface OutcomeTraceabilityProps {
  decisionCreatedDate?: string;
  outcomeRecordedDate?: string;
  replayCreatedDate?: string;
  outcomeStatus: string;
}

export function OutcomeTraceability({
  decisionCreatedDate,
  outcomeRecordedDate,
  replayCreatedDate,
  outcomeStatus,
}: OutcomeTraceabilityProps) {
  const formatDate = (d?: string) =>
    d
      ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : "Recorded";

  return (
    <div className="space-y-4 pt-2">
      <div className="space-y-1">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Decision Lifecycle & Traceability
        </h3>
        <p className="text-xs text-zinc-400">
          Trace how Auvora baseline predictions compare against user-reported outcomes.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {/* Step 1: Original Decision */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-zinc-400">STEP 01</span>
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
              {formatDate(decisionCreatedDate)}
            </span>
          </div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Original Decision
          </h4>
          <p className="text-[11px] text-zinc-400 leading-normal">
            Business context, time horizon, and success criteria documented.
          </p>
        </div>

        {/* Step 2: Original Auvora Stress Test */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-zinc-400">STEP 02</span>
            <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              ORIGINAL AUVORA ANALYSIS
            </span>
          </div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Auvora Stress Test
          </h4>
          <p className="text-[11px] text-zinc-400 leading-normal">
            Assumptions, evidence gaps, risks, and blind spots surfaced.
          </p>
        </div>

        {/* Step 3: Real-World Outcome */}
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-emerald-400">{formatDate(outcomeRecordedDate)}</span>
            <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              USER REPORTED
            </span>
          </div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Real-World Outcome
          </h4>
          <p className="text-[11px] text-zinc-300 leading-normal">
            Outcome ({outcomeStatus}) and unexpected factors recorded by user.
          </p>
        </div>

        {/* Step 4: Decision Replay */}
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-amber-400">{formatDate(replayCreatedDate)}</span>
            <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              REPLAY INFERENCE
            </span>
          </div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Decision Replay
          </h4>
          <p className="text-[11px] text-zinc-300 leading-normal">
            Prediction alignment and strategic lessons audited.
          </p>
        </div>
      </div>
    </div>
  );
}

