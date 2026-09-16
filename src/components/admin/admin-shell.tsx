"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AdminShell({
  children,
  email,
}: {
  children: React.ReactNode;
  email?: string;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navigation = [
    { name: "Overview", href: "/admin", future: false },
    { name: "Users", href: "/admin/users", future: false },
    { name: "Decisions", href: "/admin/decisions", future: true },
    { name: "Billing", href: "/admin/billing", future: true },
    { name: "Analytics", href: "/admin/analytics", future: true },
    { name: "Health", href: "/admin/health", future: true },
    { name: "Feedback", href: "/admin/feedback", future: true },
  ];

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    }
  };

  const NavLinks = () => (
    <ul className="space-y-1">
      {navigation.map((item) => {
        const isActive = pathname === item.href;
        return (
          <li key={item.name}>
            {item.future ? (
              <div className="flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md text-zinc-500 cursor-not-allowed">
                <span>{item.name}</span>
                <span className="text-[10px] uppercase tracking-wider bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-600">Soon</span>
              </div>
            ) : (
              <Link
                href={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? "bg-zinc-800 text-zinc-100"
                    : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row bg-zinc-950 text-zinc-50 font-sans">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-950">
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-tight">Auvora</span>
          <span className="text-xs text-zinc-400">Admin Console</span>
        </div>
        <button
          type="button"
          className="p-2 -mr-2 text-zinc-400 hover:text-zinc-100"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden px-2 pt-2 pb-4 space-y-1 sm:px-3 border-b border-zinc-800 bg-zinc-950">
          <NavLinks />
          <div className="pt-4 mt-4 border-t border-zinc-800">
            {email && <div className="px-3 py-2 text-xs text-zinc-500 truncate">{email}</div>}
            <Link
              href="/dashboard"
              className="block px-3 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100"
            >
              Back to Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100"
            >
              Sign out
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-zinc-800 bg-zinc-950">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-6 mb-8 flex-col items-start">
            <span className="text-lg font-bold tracking-tight text-zinc-100">Auvora</span>
            <span className="text-sm text-zinc-400">Admin Console</span>
          </div>
          <nav className="flex-1 px-3 space-y-1">
            <NavLinks />
          </nav>
        </div>
        <div className="flex-shrink-0 flex flex-col p-4 border-t border-zinc-800 space-y-3">
          {email && (
            <div className="px-2 pb-2 text-xs font-medium text-zinc-500 truncate border-b border-zinc-800/50">
              {email}
            </div>
          )}
          <div className="space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center px-2 py-2 text-sm font-medium text-zinc-400 rounded-md hover:bg-zinc-800/50 hover:text-zinc-100 transition-colors"
            >
              Back to Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-2 py-2 text-sm font-medium text-zinc-400 rounded-md hover:bg-zinc-800/50 hover:text-zinc-100 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

