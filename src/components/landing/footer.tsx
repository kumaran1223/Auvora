import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800/80 bg-zinc-950 py-12 text-sm text-zinc-400">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-4 md:flex-row md:items-center md:justify-between md:px-8">
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
          <Link href="/terms" className="hover:text-white transition">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-white transition">
            Privacy
          </Link>
          <Link href="/refund" className="hover:text-white transition">
            Refunds
          </Link>
          <Link href="/contact" className="hover:text-white transition">
            Contact
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 md:px-8 pt-8 text-xs text-zinc-600">
        &copy; {new Date().getFullYear()} Auvora AI. All rights reserved.
      </div>
    </footer>
  );
}

