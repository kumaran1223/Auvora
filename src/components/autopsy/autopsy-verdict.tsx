interface AutopsyVerdictProps {
  overallVerdict: string;
  keyTakeaway: string;
}

export function AutopsyVerdict({ overallVerdict, keyTakeaway }: AutopsyVerdictProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
      <div className="space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Overall Verdict
        </span>
        <h3 className="text-lg font-bold text-white leading-snug">{overallVerdict}</h3>
      </div>

      <div className="space-y-1.5 pt-2 border-t border-zinc-800/80">
        <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
          Key Takeaway
        </span>
        <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-950/60 p-4 rounded-lg border border-zinc-800/60">
          {keyTakeaway}
        </p>
      </div>
    </div>
  );
}

