"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { archiveDecisionAction } from "@/app/decisions/actions";
import type { DecisionStatus } from "@/types/database";

interface ArchiveButtonProps {
  decisionId: string;
  currentStatus: DecisionStatus;
}

export function ArchiveButton({ decisionId, currentStatus }: ArchiveButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isArchived = currentStatus === "archived";

  const handleArchive = async () => {
    setLoading(true);
    try {
      const res = await archiveDecisionAction(decisionId);
      if (res.success) {
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleArchive}
      disabled={loading}
      className="rounded-md border border-zinc-700 bg-zinc-800/80 px-3.5 py-1.5 text-sm font-medium text-zinc-200 transition hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 disabled:opacity-50"
    >
      {loading ? "Processing..." : isArchived ? "Unarchive" : "Archive"}
    </button>
  );
}

