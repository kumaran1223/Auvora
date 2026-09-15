import type { AuvoraReportData } from "@/lib/ai/schemas";

interface KillQuestionsProps {
  report: AuvoraReportData;
}

export function KillQuestions({ report }: KillQuestionsProps) {
  const { kill_questions } = report;

  return (
    <section id="kill-questions" className="scroll-mt-24 space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight text-white">
          Questions You Should Answer Before You Commit
        </h2>
        <p className="text-xs text-zinc-400">
          Critical questions designed to challenge the decision and expose deal-breaker risks.
        </p>
      </div>

      <div className="space-y-3">
        {kill_questions.map((q, idx) => (
          <div
            key={idx}
            className="flex items-start space-x-4 rounded-xl border border-amber-500/30 bg-amber-950/10 p-4 transition hover:bg-amber-950/20"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-400">
              ?
            </span>
            <p className="text-sm font-semibold text-zinc-100 leading-snug pt-0.5">
              {q}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

