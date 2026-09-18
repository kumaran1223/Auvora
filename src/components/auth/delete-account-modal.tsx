"use client";

import { useState } from "react";
import { deleteUserAccount } from "@/app/actions/user";

export function DeleteAccountModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState("");

  const handleDelete = async () => {
    if (confirmation !== "DELETE") return;
    setLoading(true);
    setError(null);
    try {
      const res = await deleteUserAccount();
      if (res?.error) {
        setError(res.error);
        setLoading(false);
      }
    } catch {
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setConfirmation("");
    setError(null);
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="inline-flex shrink-0 items-center justify-center rounded-md border border-red-900/50 bg-red-950/50 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-900/80 focus:outline-none focus:ring-2 focus:ring-red-500/50"
      >
        Delete Account
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md space-y-4 rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">Delete your account permanently?</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Your Auvora account and all associated application data will be permanently deleted. This includes all your decisions, reports, replays, and usage patterns. This action cannot be undone.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirm-delete" className="block text-sm font-medium text-zinc-300">
                Type <span className="font-bold text-red-400">DELETE</span> to confirm
              </label>
              <input
                id="confirm-delete"
                type="text"
                autoComplete="off"
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                placeholder="DELETE"
              />
            </div>

            {error && (
              <div className="rounded border border-red-900/50 bg-red-950/40 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={loading}
                className="rounded-md px-3.5 py-1.5 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading || confirmation !== "DELETE"}
                className="rounded-md bg-red-900 px-3.5 py-1.5 text-sm font-medium text-white transition hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Confirm Deletion"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

