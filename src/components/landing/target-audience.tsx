export function TargetAudience() {
  const audiences = [
    {
      role: "Founders",
      question: "&ldquo;Should we raise capital now or extend runway?&rdquo;",
      desc: "Stress-test fundraising timing, valuation assumptions, and dilution risks.",
    },
    {
      role: "Business Owners",
      question: "&ldquo;Should we open a second location this quarter?&rdquo;",
      desc: "Expose cash flow vulnerabilities and operational headcount dependencies.",
    },
    {
      role: "Product Leaders",
      question: "&ldquo;Should we pivot our core product focus?&rdquo;",
      desc: "Map feature dependencies, churn risks, and customer migration challenges.",
    },
    {
      role: "Hiring Managers",
      question: "&ldquo;Should we hire senior executive talent now?&rdquo;",
      desc: "Examine payroll fixed-cost burdens and revenue ramp assumptions.",
    },
    {
      role: "Growth Teams",
      question: "&ldquo;Should we expand sales into a new territory?&rdquo;",
      desc: "Uncover CAC assumptions, local regulatory hurdles, and payback timelines.",
    },
  ];

  return (
    <section className="border-t border-zinc-800/80 bg-zinc-950 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-8 space-y-12">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Target Audience
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Built for people who have something at stake.
          </h2>
          <p className="text-sm text-zinc-400">
            Designed for business leaders making high-consequence decisions with real capital.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {audiences.map((a, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-3 transition hover:bg-zinc-900/80"
            >
              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  {a.role}
                </span>
                <h3
                  className="text-sm font-semibold text-white leading-snug"
                  dangerouslySetInnerHTML={{ __html: a.question }}
                />
                <p className="text-xs text-zinc-400 leading-relaxed pt-1">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

