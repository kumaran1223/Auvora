"use client";

import { useState } from "react";
import Link from "next/link";

interface NavbarProps {
  isAuthenticated: boolean;
}

export function Navbar({ isAuthenticated }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const ctaLink = isAuthenticated ? "/decisions/new" : "/signup";

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between p-6 md:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-extrabold tracking-tight text-white">Auvora</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-zinc-400">
          <Link href="/#how-it-works" className="transition hover:text-white">
            How it works
          </Link>
          <Link href="/#why-auvora" className="transition hover:text-white">
            Why Auvora
          </Link>
          <Link href="/#pricing" className="transition hover:text-white">
            Pricing
          </Link>
        </div>

        {/* Right Side Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="text-sm font-medium text-zinc-300 transition hover:text-white"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium text-zinc-300 transition hover:text-white"
            >
              Sign in
            </Link>
          )}

          <Link
            href={ctaLink}
            className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400"
          >
            Stress-test a decision
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-md p-1 text-zinc-400 hover:text-white focus:outline-none md:hidden"
        >
          <span className="sr-only">Toggle menu</span>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-zinc-800 bg-zinc-950 p-6 space-y-3 text-xs font-medium md:hidden">
          <Link
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-zinc-300 hover:text-white"
          >
            How it works
          </Link>
          <Link
            href="/#why-auvora"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-zinc-300 hover:text-white"
          >
            Why Auvora
          </Link>
          <Link
            href="/#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-zinc-300 hover:text-white"
          >
            Pricing
          </Link>

          <div className="pt-3 border-t border-zinc-850 flex flex-col gap-2">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center rounded-md border border-zinc-700 bg-zinc-900 py-2 text-zinc-200"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center rounded-md border border-zinc-700 bg-zinc-900 py-2 text-zinc-200"
              >
                Sign in
              </Link>
            )}
            <Link
              href={ctaLink}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center rounded-md bg-white py-2 font-semibold text-zinc-950"
            >
              Stress-test a decision
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

