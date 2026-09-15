"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteDecisionAction } from "@/app/decisions/actions";

interface DeleteModalProps {
  decisionId: string;
  decisionTitle: string;
}

export function DeleteModal({ decisionId, decisionTitle }: DeleteModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await deleteDecisionAction(decisionId);
      if (res.success) {
        setIsOpen(false);
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(res.error || "Failed to delete decision.");
        setLoading(false);
      }
    } catch {
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-md border border-red-900/60 bg-red-950/30 px-3.5 py-1.5 text-xs font-medium text-red-300 transition hover:bg-red-900/50 focus:outline-none focus:ring-2 focus:ring-red-600"
      >
        Delete
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md space-y-4 rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">Delete decision permanently?</h3>
              <p className="text-sm text-zinc-300 font-medium">
                &ldquo;{decisionTitle}&rdquo;
              </p>
              <p className="text-xs text-zinc-400">
                All associated reports, scenarios, and outcomes will also be permanently deleted. This action cannot be undone.
              </p>
            </div>

            {error && (
              <div className="rounded border border-red-900/50 bg-red-950/40 p-2 text-xs text-red-400">
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={loading}
                className="rounded-md border border-zinc-700 bg-zinc-800 px-3.5 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-700 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="rounded-md bg-red-600 px-3.5 py-1.5 text-xs font-medium text-white transition hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

