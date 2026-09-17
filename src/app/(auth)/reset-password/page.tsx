"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"initializing" | "idle" | "loading" | "success" | "error" | "invalid">("initializing");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    // Listen for the recovery event or session
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (mounted) {
        if (event === "PASSWORD_RECOVERY" || session) {
          setStatus("idle");
        }
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        if (session) {
          setStatus("idle");
        } else {
          setTimeout(() => {
            if (mounted) {
              setStatus((prev) => (prev === "initializing" ? "invalid" : prev));
            }
          }, 1500); // Give it time to fire the event
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!password || !confirmPassword) {
      setStatus("error");
      setMessage("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setStatus("error");
      setMessage("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }

    setStatus("loading");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setStatus("error");
        setMessage("We couldn't update your password. Please try again.");
        return;
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setMessage("We couldn't update your password. Please try again.");
    }
  };

  if (status === "initializing") {
    return (
      <main className="flex min-h-screen items-center justify-center p-6 bg-zinc-950 text-zinc-100">
        <div className="text-sm text-zinc-400">Verifying secure session...</div>
      </main>
    );
  }

  if (status === "invalid") {
    return (
      <main className="flex min-h-screen items-center justify-center p-6 bg-zinc-950 text-zinc-100">
        <div className="w-full max-w-md space-y-6 rounded-xl border border-zinc-800 bg-zinc-900/60 p-8 shadow-xl text-center">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">Invalid Link</h1>
            <p className="text-sm text-zinc-400">Your password reset link is invalid or has expired.</p>
          </div>
          <Link
            href="/forgot-password"
            className="block w-full rounded-md bg-white px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400"
          >
            Request a new reset link
          </Link>
        </div>
      </main>
    );
  }

  if (status === "success") {
    return (
      <main className="flex min-h-screen items-center justify-center p-6 bg-zinc-950 text-zinc-100">
        <div className="w-full max-w-md space-y-6 rounded-xl border border-zinc-800 bg-zinc-900/60 p-8 shadow-xl text-center">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">Password updated</h1>
            <p className="text-sm text-zinc-400">Your password has been updated.</p>
          </div>
          <Link
            href="/login"
            className="block w-full rounded-md bg-white px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400"
          >
            Continue to sign in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6 bg-zinc-950 text-zinc-100">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-zinc-800 bg-zinc-900/60 p-8 shadow-xl">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white">Reset Password</h1>
          <p className="text-sm text-zinc-400">Please enter your new password below.</p>
        </div>

        {status === "error" && message && (
          <div className="rounded-md border border-red-900/50 bg-red-950/40 p-3 text-sm text-red-400">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-300" htmlFor="password">
              New password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-300" htmlFor="confirmPassword">
              Confirm new password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="********"
              className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full rounded-md bg-white px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400 disabled:opacity-50"
          >
            {status === "loading" ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>
    </main>
  );
}
