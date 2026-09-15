import Link from "next/link";

interface FinalCtaProps {
  isAuthenticated: boolean;
}

export function FinalCta({ isAuthenticated }: FinalCtaProps) {
  const ctaLink = isAuthenticated ? "/decisions/new" : "/signup";

  return (
    <section className="border-t border-zinc-800/80 bg-zinc-950 py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-4 md:px-8 text-center space-y-8">
        <div className="space-y-4">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl leading-tight">
            Before you commit, <br />
            <span className="text-zinc-400 font-normal">pressure-test the decision.</span>
          </h2>
          <p className="max-w-xl mx-auto text-base text-zinc-300">
            Put your next important business decision under the microscope before committing capital and resources.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href={ctaLink}
            className="inline-flex items-center justify-center rounded-md bg-white px-8 py-3.5 text-sm font-bold text-zinc-950 transition hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400"
          >
            Stress-test a decision
          </Link>
        </div>
      </div>
    </section>
  );
}

