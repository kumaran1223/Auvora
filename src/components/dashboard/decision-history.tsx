"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { DecisionWithMeta } from "@/lib/db/decisions";

interface DecisionHistoryProps {
  decisions: DecisionWithMeta[];
}

export function DecisionHistory({ decisions }: DecisionHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [outcomeFilter, setOutcomeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "updated">("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const statusColors: Record<string, string> = {
    draft: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    analyzing: "border-blue-500/30 bg-blue-500/10 text-blue-400",
    completed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    archived: "border-zinc-700 bg-zinc-800 text-zinc-400",
  };

  const outcomeColors: Record<string, { label: string; classNames: string }> = {
    successful: {
      label: "Successful",
      classNames: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    },
    partially_successful: {
      label: "Partially Successful",
      classNames: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    },
    unsuccessful: {
      label: "Unsuccessful",
      classNames: "border-rose-500/30 bg-rose-500/10 text-rose-400",
    },
    cancelled: {
      label: "Cancelled",
      classNames: "border-zinc-700 bg-zinc-800 text-zinc-400",
    },
  };

  // Filter & Sort Pipeline
  const filteredDecisions = useMemo(() => {
    return decisions
      .filter((d) => {
        // Search filter (title & description)
        if (searchTerm.trim()) {
          const query = searchTerm.toLowerCase();
          const matchTitle = d.title.toLowerCase().includes(query);
          const matchDesc = d.description.toLowerCase().includes(query);
          if (!matchTitle && !matchDesc) return false;
        }

        // Status filter
        if (statusFilter !== "all" && d.status !== statusFilter) {
          return false;
        }

        // Outcome filter
        if (outcomeFilter !== "all") {
          if (outcomeFilter === "needs_outcome") {
            // Decision is completed but has no outcome recorded
            if (d.status !== "completed" || d.outcome != null) return false;
          } else if (outcomeFilter === "not_recorded") {
            if (d.outcome != null) return false;
          } else {
            if (d.outcome?.outcome_status !== outcomeFilter) return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "oldest") {
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        }
        if (sortBy === "updated") {
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        }
        // Default: newest
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [decisions, searchTerm, statusFilter, outcomeFilter, sortBy]);

  // Pagination calculation
  const totalItems = filteredDecisions.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const activePage = Math.min(currentPage, totalPages);

  const paginatedDecisions = useMemo(() => {
    const startIdx = (activePage - 1) * pageSize;
    return filteredDecisions.slice(startIdx, startIdx + pageSize);
  }, [filteredDecisions, activePage, pageSize]);

  const startItem = totalItems === 0 ? 0 : (activePage - 1) * pageSize + 1;
  const endItem = Math.min(activePage * pageSize, totalItems);

  return (
    <div className="space-y-6">
      {/* Controls Bar: Search, Filters, Sort */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
        {/* Search Bar */}
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search decisions by title or keywords..."
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 pl-9 pr-4 py-2 text-sm text-white placeholder-zinc-500 transition-all duration-200 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 hover:border-zinc-700 motion-reduce:transition-none"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm font-medium text-zinc-200 transition-all duration-200 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 hover:border-zinc-700 motion-reduce:transition-none"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="analyzing">Analyzing</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>

          {/* Outcome Filter */}
          <select
            value={outcomeFilter}
            onChange={(e) => {
              setOutcomeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm font-medium text-zinc-200 transition-all duration-200 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 hover:border-zinc-700 motion-reduce:transition-none"
          >
            <option value="all">All Outcomes</option>
            <option value="needs_outcome">Needs Outcome</option>
            <option value="successful">Successful</option>
            <option value="partially_successful">Partially Successful</option>
            <option value="unsuccessful">Unsuccessful</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Sorting */}
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as "newest" | "oldest" | "updated");
              setCurrentPage(1);
            }}
            className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm font-medium text-zinc-200 transition-all duration-200 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 hover:border-zinc-700 motion-reduce:transition-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="updated">Recently Updated</option>
          </select>
        </div>
      </div>

      {/* Decision List */}
      {decisions.length === 0 ? (
        <div className="flex min-h-[260px] flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/40 p-8 text-center space-y-4 animate-fade-in-up">
          <div className="space-y-2 max-w-md">
            <h4 className="text-xl font-bold text-white">No decisions stress-tested yet</h4>
            <p className="text-base text-zinc-400 leading-relaxed">
              Auvora challenges your assumptions, exposes evidence gaps, and maps second-order consequences before you commit capital.
            </p>
          </div>
          <Link
            href="/decisions/new"
            className="inline-flex items-center justify-center rounded-md bg-white px-5 py-2.5 text-sm font-bold text-zinc-950 transition-all duration-200 hover:bg-zinc-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-zinc-950 active:scale-95 motion-reduce:transition-none motion-reduce:transform-none"
          >
            + Stress-test your first decision
          </Link>
        </div>
      ) : paginatedDecisions.length === 0 ? (
        <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/20 p-8 text-center space-y-3 animate-fade-in-up">
          <h4 className="text-lg font-semibold text-white">No matching decisions found</h4>
          <p className="text-sm text-zinc-400 max-w-sm">
            Try adjusting your search terms or filters to find what you&apos;re looking for.
          </p>
          {(searchTerm || statusFilter !== "all" || outcomeFilter !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setOutcomeFilter("all");
                setCurrentPage(1);
              }}
              className="text-sm font-semibold text-amber-400 transition-colors duration-200 hover:text-amber-300 hover:underline focus:outline-none focus:ring-2 focus:ring-amber-500/50 rounded-sm motion-reduce:transition-none"
            >
              Clear filters & reset view
            </button>
          )}
        </div>
      ) : (
        <div className="divide-y divide-zinc-800/60 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40">
          {paginatedDecisions.map((decision, idx) => {
            const outcomeBadge = decision.outcome?.outcome_status
              ? outcomeColors[decision.outcome.outcome_status]
              : null;
            const needsOutcome = decision.status === "completed" && !decision.outcome;

            return (
              <div
                key={decision.id}
                className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between transition-all duration-200 hover:bg-zinc-800/80 hover:shadow-lg motion-reduce:transition-none animate-fade-in-up" style={{ animationDelay: `${Math.min(idx * 60, 300)}ms` }}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Link
                      href={`/decisions/${decision.id}`}
                      className="font-bold text-white hover:underline text-base"
                    >
                      {decision.title}
                    </Link>

                    {/* Status Badge */}
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        statusColors[decision.status] || statusColors["draft"]
                      }`}
                    >
                      {decision.status}
                    </span>

                    {/* Risk Score Badge */}
                    {decision.risk_score != null && (
                      <span className="rounded-full border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold text-zinc-300">
                        Risk: {decision.risk_score}/100
                      </span>
                    )}

                    {/* Outcome Badge */}
                    {outcomeBadge ? (
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${outcomeBadge.classNames}`}
                      >
                        Outcome: {outcomeBadge.label}
                      </span>
                    ) : needsOutcome ? (
                      <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-400">
                        Needs Outcome
                      </span>
                    ) : null}
                  </div>

                  {/* Metadata Tags */}
                  <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-400">
                    {decision.industry && <span>Industry: <strong className="text-zinc-300">{decision.industry}</strong></span>}
                    {decision.timeline && <span>Horizon: <strong className="text-zinc-300">{decision.timeline}</strong></span>}
                    <span>Created: {new Date(decision.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <Link
                    href={`/decisions/${decision.id}`}
                    className="rounded-md border border-zinc-700 bg-zinc-800 px-3.5 py-1.5 text-sm font-semibold text-zinc-200 transition-all duration-200 hover:bg-zinc-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-950 active:scale-95 motion-reduce:transition-none motion-reduce:transform-none"
                  >
                    Open Decision →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Bar */}
      {totalItems > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-zinc-400 pt-2 border-t border-zinc-800">
          <div>
            Showing <strong className="text-white font-bold">{startItem}</strong> to{" "}
            <strong className="text-white font-bold">{endItem}</strong> of{" "}
            <strong className="text-white font-bold">{totalItems}</strong> decisions
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={activePage <= 1}
              className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm font-medium text-zinc-300 transition-all duration-200 hover:bg-zinc-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-950 active:scale-95 disabled:opacity-40 disabled:pointer-events-none motion-reduce:transition-none motion-reduce:transform-none"
            >
              ← Previous
            </button>

            <span className="px-2 font-medium text-zinc-400">
              Page {activePage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={activePage >= totalPages}
              className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm font-medium text-zinc-300 transition-all duration-200 hover:bg-zinc-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-950 active:scale-95 disabled:opacity-40 disabled:pointer-events-none motion-reduce:transition-none motion-reduce:transform-none"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

