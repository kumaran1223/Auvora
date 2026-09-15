interface RightVsDifferedProps {
  assumptionResults?: Array<{ result: string }>;
  riskResults?: Array<{ materialized: string }>;
  blindSpotResults?: Array<{ result: string }>;
}

export function RightVsDiffered({
  assumptionResults = [],
  riskResults = [],
  blindSpotResults = [],
}: RightVsDifferedProps) {
  // Deterministic calculation of right vs differed items
  const validatedAssumptions = assumptionResults.filter((a) => a.result === "validated").length;
  const materializedRisks = riskResults.filter((r) => r.materialized === "yes" || r.materialized === "partially").length;
  const surfacedBlindSpots = blindSpotResults.filter((b) => b.result === "surfaced").length;

  const failedAssumptions = assumptionResults.filter((a) => a.result === "failed").length;
  const notMaterializedRisks = riskResults.filter((r) => r.materialized === "no").length;
  const notObservedBlindSpots = blindSpotResults.filter((b) => b.result === "not_observed").length;

  const rightPoints: string[] = [];
  if (validatedAssumptions > 0) {
    rightPoints.push(`${validatedAssumptions} key assumption${validatedAssumptions > 1 ? "s" : ""} validated in reality`);
  }
  if (materializedRisks > 0) {
    rightPoints.push(`${materializedRisks} predicted risk${materializedRisks > 1 ? "s" : ""} materialized as anticipated`);
  }
  if (surfacedBlindSpots > 0) {
    rightPoints.push(`${surfacedBlindSpots} identified blind spot${surfacedBlindSpots > 1 ? "s" : ""} surfaced in practice`);
  }

  const differedPoints: string[] = [];
  if (failedAssumptions > 0) {
    differedPoints.push(`${failedAssumptions} initial assumption${failedAssumptions > 1 ? "s" : ""} failed in reality`);
  }
  if (notMaterializedRisks > 0) {
    differedPoints.push(`${notMaterializedRisks} anticipated risk${notMaterializedRisks > 1 ? "s" : ""} did not materialize`);
  }
  if (notObservedBlindSpots > 0) {
    differedPoints.push(`${notObservedBlindSpots} potential blind spot${notObservedBlindSpots > 1 ? "s" : ""} were not observed`);
  }

  if (rightPoints.length === 0 && differedPoints.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
      {/* Where Auvora Was Right */}
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 font-bold text-sm">&#10003;</span>
          <h4 className="text-sm font-semibold text-white">Where Auvora Was Right</h4>
        </div>
        {rightPoints.length > 0 ? (
          <ul className="space-y-1.5 text-xs text-emerald-200/90 list-disc list-inside">
            {rightPoints.map((pt, idx) => (
              <li key={idx}>{pt}</li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-zinc-400 italic">No specific confirmed predictions logged.</p>
        )}
      </div>

      {/* Where Reality Differed */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-bold text-sm">&#8644;</span>
          <h4 className="text-sm font-semibold text-white">Where Reality Differed</h4>
        </div>
        {differedPoints.length > 0 ? (
          <ul className="space-y-1.5 text-xs text-amber-200/90 list-disc list-inside">
            {differedPoints.map((pt, idx) => (
              <li key={idx}>{pt}</li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-zinc-400 italic">No significant prediction divergences logged.</p>
        )}
      </div>
    </div>
  );
}
