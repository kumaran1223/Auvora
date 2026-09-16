import Link from "next/link";
import { Footer } from "@/components/landing/footer";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 p-6 md:px-12 md:py-6 flex justify-between items-center bg-zinc-950 sticky top-0 z-10">
        <Link href="/" className="text-xl font-bold tracking-tight text-white hover:opacity-90">
          Auvora
        </Link>
        <Link href="/dashboard" className="text-sm font-medium text-zinc-400 hover:text-white transition">
          Dashboard
        </Link>
      </header>
      <main className="flex-1 p-6 md:p-12 md:py-16">
        <div className="mx-auto max-w-3xl space-y-6 text-sm text-zinc-300 leading-relaxed">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}

