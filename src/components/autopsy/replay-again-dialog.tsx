import { useEffect, useRef } from "react";

interface ReplayAgainDialogProps {
  isOpen: boolean;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ReplayAgainDialog({
  isOpen,
  isLoading,
  onConfirm,
  onCancel,
}: ReplayAgainDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onCancel]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      aria-modal="true"
      role="dialog"
      aria-labelledby="replay-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        ref={dialogRef}
        className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6 space-y-5 shadow-2xl"
      >
        <div className="space-y-2">
          <h3 id="replay-dialog-title" className="text-lg font-bold text-white">
            Run Decision Replay again?
          </h3>
          <p className="text-base text-zinc-300 leading-relaxed">
            Your latest outcome will be compared with the original Auvora stress test again. This
            will use <strong className="text-white font-semibold">one decision analysis</strong> from
            your current plan.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-md border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-zinc-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-zinc-400 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400 disabled:opacity-50"
          >
            {isLoading ? "Generating Replay..." : "Run Replay"}
          </button>
        </div>
      </div>
    </div>
  );
}

