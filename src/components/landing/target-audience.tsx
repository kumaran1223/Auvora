export function TargetAudience() {
  const audiences = [
    {
      role: "Founders",
      question: "“Should we raise capital now or extend runway?”",
      desc: "Stress-test fundraising timing, valuation assumptions, and dilution risks.",
    },
    {
      role: "Business Owners",
      question: "“Should we open a second location this quarter?”",
      desc: "Expose cash flow vulnerabilities and operational headcount dependencies.",
    },
    {
      role: "Product Leaders",
      question: "“Should we pivot our core product focus?”",
      desc: "Map feature dependencies, churn risks, and customer migration challenges.",
    },
    {
      role: "Hiring Managers",
      question: "“Should we hire senior executive talent now?”",
      desc: "Examine payroll fixed-cost burdens and revenue ramp assumptions.",
    },
    {
      role: "Growth Teams",
      question: "“Should we expand sales into a new territory?”",
      desc: "Uncover CAC assumptions, local regulatory hurdles, and payback timelines.",
    },
  ];

  return (
    <section className="border-t border-zinc-800/80 bg-zinc-950 py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 space-y-12">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Target Audience
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Built for people who have something at stake.
          </h2>
          <p className="text-lg text-zinc-400 leading-relaxed">
            Designed for business leaders making high-consequence decisions with real capital.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {audiences.map((a, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-900/40 p-8 space-y-3 transition hover:bg-zinc-900/80"
            >
              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  {a.role}
                </span>
                <h3 className="text-sm font-semibold text-white leading-snug">
                  {a.question}
                </h3>
                <p className="text-base text-zinc-400 leading-relaxed pt-1">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

