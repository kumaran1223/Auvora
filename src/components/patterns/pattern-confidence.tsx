import { PatternConfidenceEnum } from "@/lib/ai/schemas";
import { z } from "zod";

type ConfidenceType = z.infer<typeof PatternConfidenceEnum>;

interface PatternConfidenceProps {
  confidence: ConfidenceType;
}

const CONFIDENCE_CONFIG: Record<
  ConfidenceType,
  { label: string; style: string; explanation: string }
> = {
  early_signal: {
    label: "Early Signal",
    style: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    explanation: "An initial recurring signal.",
  },
  emerging: {
    label: "Emerging",
    style: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    explanation: "A pattern appearing consistently across multiple decisions.",
  },
  strong: {
    label: "Strong",
    style: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    explanation: "A repeatedly observed pattern across the available history.",
  },
};

export function PatternConfidence({ confidence }: PatternConfidenceProps) {
  const config = CONFIDENCE_CONFIG[confidence] || CONFIDENCE_CONFIG.early_signal;

  return (
    <div className="group relative inline-flex items-center">
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border ${config.style}`}
      >
        <span className="h-1.5 w-1.5 rounded-full fill-current" />
        {config.label}
      </span>
      <span className="ml-2 text-sm text-zinc-400 font-normal hidden sm:inline-block">
        — {config.explanation}
      </span>
    </div>
  );
}

