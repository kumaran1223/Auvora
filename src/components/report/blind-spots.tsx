"use client";

import { useState } from "react";
import type { AuvoraReportData } from "@/lib/ai/schemas";

interface BlindSpotsProps {
  report: AuvoraReportData;
}

export function BlindSpots({ report }: BlindSpotsProps) {
  const { blind_spots } = report;
  const [expandedId, setExpandedId] = useState<string | null>(
    blind_spots[0]?.id || null
  );

  const severityStyles: Record<string, string> = {
    low: "text-zinc-400 border-zinc-700 bg-zinc-800",
    medium: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    high: "text-orange-400 border-orange-500/30 bg-orange-500/10",
    critical: "text-red-400 border-red-500/40 bg-red-500/20 font-bold",
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="blind-spots" className="scroll-mt-24 space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight text-white">Blind Spots</h2>
        <p className="text-xs text-zinc-400">
          Factors that could materially affect the decision but may be easy to overlook.
        </p>
      </div>

      <div className="space-y-3">
        {blind_spots.map((spot) => {
          const isExpanded = expandedId === spot.id;

          return (
            <div
              key={spot.id}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden transition"
            >
              <button
                type="button"
                onClick={() => toggleExpand(spot.id)}
                className="flex w-full items-center justify-between p-4 text-left hover:bg-zinc-900/80"
              >
                <div className="flex items-center space-x-3">
                  <span className={`rounded border px-2 py-0.5 text-[10px] uppercase tracking-wider ${severityStyles[spot.severity] || ""}`}>
                    {spot.severity}
                  </span>
                  <h3 className="text-sm font-semibold text-white">
                    {spot.title}
                  </h3>
                </div>
                <span className="text-xs text-zinc-400 font-mono">
                  {isExpanded ? "−" : "+"}
                </span>
              </button>

              {isExpanded && (
                <div className="border-t border-zinc-800/80 bg-zinc-950/40 p-4 text-xs space-y-3">
                  <p className="text-zinc-300 leading-relaxed">{spot.explanation}</p>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-2 border-t border-zinc-900">
                    <div className="space-y-1">
                      <span className="font-semibold text-zinc-400">Why easy to overlook:</span>
                      <p className="text-zinc-300">{spot.why_it_may_be_overlooked}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="font-semibold text-amber-400">What to check:</span>
                      <p className="text-zinc-300">{spot.what_to_check}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

