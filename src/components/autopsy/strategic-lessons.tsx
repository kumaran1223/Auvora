interface StrategicLessonsProps {
  lessonsLearned: string[];
}

export function StrategicLessons({ lessonsLearned }: StrategicLessonsProps) {
  const hasLessons = lessonsLearned && lessonsLearned.length > 0;

  return (
    <div className="space-y-6 pt-4 border-t border-zinc-800">
      {/* Lessons Learned */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-300">
          Strategic Lessons Learned
        </h3>

        {hasLessons ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 space-y-3">
            <ul className="space-y-2.5">
              {lessonsLearned.map((lesson, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs text-zinc-200 leading-relaxed">
                  <span className="text-amber-400 font-bold shrink-0 mt-0.5">&bull;</span>
                  <span>{lesson}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 text-xs text-zinc-400 italic">
            No strategic lessons were identified from the available evidence.
          </div>
        )}
      </div>

      {/* Learning Loop: Take This Forward */}
      <div className="rounded-xl border border-amber-500/20 bg-gradient-to-r from-amber-500/5 to-transparent p-5 space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
          Take This Forward
        </span>
        <p className="text-xs text-zinc-300 leading-relaxed">
          The value of a decision isn&apos;t only whether it worked. It&apos;s what you learn before
          the next one.
        </p>
      </div>
    </div>
  );
}
