export function PatternLoadingState() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-12 text-center space-y-6 max-w-2xl mx-auto my-8">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/10">
        <svg
          className="h-6 w-6 animate-spin text-amber-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white">
          Examining your decision history...
        </h3>
        <p className="text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
          Auvora is comparing assumptions, evidence, risks, outcomes, and recurring signals across
          your historical decisions.
        </p>
      </div>

      <div className="flex justify-center items-center gap-1.5 pt-2">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse delay-150" />
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse delay-300" />
      </div>
    </div>
  );
}
