import { PatternImpactEnum } from "@/lib/ai/schemas";
import { z } from "zod";

type ImpactType = z.infer<typeof PatternImpactEnum>;

interface PatternImpactProps {
  impact: ImpactType;
}

const IMPACT_CONFIG: Record<ImpactType, { label: string; style: string }> = {
  low: {
    label: "Low Impact",
    style: "bg-zinc-800 text-zinc-300 border-zinc-700",
  },
  medium: {
    label: "Medium Impact",
    style: "bg-blue-950/60 text-blue-300 border-blue-800/60",
  },
  high: {
    label: "High Impact",
    style: "bg-amber-950/60 text-amber-300 border-amber-800/60",
  },
  critical: {
    label: "Critical Impact",
    style: "bg-rose-950/60 text-rose-300 border-rose-800/60 font-semibold",
  },
};

export function PatternImpact({ impact }: PatternImpactProps) {
  const config = IMPACT_CONFIG[impact] || IMPACT_CONFIG.medium;

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs border ${config.style}`}
    >
      {config.label}
    </span>
  );
}
