interface ReplayStaleStateProps {
  onRunReplayClick: () => void;
  isLoading: boolean;
}

export function ReplayStaleState({ onRunReplayClick, isLoading }: ReplayStaleStateProps) {
  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-amber-400">
          <span className="font-bold text-sm">&excl;</span>
          <h4 className="text-sm font-semibold text-white">Replay needs to be refreshed</h4>
        </div>
        <p className="text-sm text-amber-200/90 leading-relaxed">
          Your recorded outcome has changed since this replay was generated. Run the replay again to update the post-decision audit against your latest outcome.
        </p>
      </div>

      <button
        type="button"
        onClick={onRunReplayClick}
        disabled={isLoading}
        className="inline-flex items-center justify-center rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-50 shrink-0"
      >
        {isLoading ? "Analyzing..." : "Run Replay Again"}
      </button>
    </div>
  );
}

