"use client";

import { useState, useEffect } from "react";

const NAV_ITEMS = [
  { id: "overview", label: "Overview" },
  { id: "assumptions", label: "Assumption Map" },
  { id: "evidence", label: "Evidence Gaps" },
  { id: "blind-spots", label: "Blind Spots" },
  { id: "stakeholders", label: "Stakeholders" },
  { id: "risks", label: "Risk Analysis" },
  { id: "consequences", label: "Consequences" },
  { id: "scenarios", label: "Scenarios" },
  { id: "alternatives", label: "Alternatives" },
  { id: "kill-questions", label: "Kill Questions" },
  { id: "conclusion", label: "Final Stress Test" },
];

export function ReportNavigation() {
  const [activeId, setActiveId] = useState("overview");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveId(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveId(id);
    }
  };

  return (
    <nav className="sticky top-0 z-30 w-full border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center overflow-x-auto px-4 py-2.5 text-sm font-medium no-scrollbar space-x-1 sm:space-x-2">
        {NAV_ITEMS.map((item) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`whitespace-nowrap rounded-md px-3 py-1.5 transition ${
                isActive
                  ? "bg-zinc-800 text-white font-semibold shadow-sm"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

