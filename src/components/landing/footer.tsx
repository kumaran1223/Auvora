import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800/80 bg-zinc-950 py-12 text-xs text-zinc-400">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="space-y-2">
          <span className="text-base font-extrabold tracking-tight text-white">Auvora</span>
          <p className="text-zinc-400">Think it through. Before reality does.</p>
        </div>

        <div className="flex flex-wrap gap-6 font-medium">
          <a href="#how-it-works" className="hover:text-white transition">
            How it works
          </a>
          <a href="#why-auvora" className="hover:text-white transition">
            Why Auvora
          </a>
          <a href="#pricing" className="hover:text-white transition">
            Pricing
          </a>
          <Link href="/login" className="hover:text-white transition">
            Sign in
          </Link>
          <span className="text-zinc-600 cursor-not-allowed">Terms (Coming soon)</span>
          <span className="text-zinc-600 cursor-not-allowed">Privacy (Coming soon)</span>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 md:px-8 pt-8 text-[11px] text-zinc-600">
        &copy; {new Date().getFullYear()} Auvora AI. All rights reserved.
      </div>
    </footer>
  );
}

