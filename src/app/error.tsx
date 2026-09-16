"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    // console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-6 text-center text-zinc-100">
      <div className="mx-auto w-full max-w-md space-y-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 shadow-2xl backdrop-blur-sm">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Something went wrong</h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            An unexpected error occurred while trying to process your request. Please try again or return to the dashboard.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center pt-2">
          <button
            onClick={() => reset()}
            className="inline-flex h-10 w-full items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400 sm:w-auto"
          >
            Try again
          </button>
          <Link
            href="/dashboard"
            className="inline-flex h-10 w-full items-center justify-center rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400 sm:w-auto"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

