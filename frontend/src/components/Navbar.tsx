// Navbar.tsx
"use client";

import { useTheme } from "@/hooks/useTheme";
import { LogOut, Sun, Moon, Code2 } from "lucide-react";
import Image from "next/image";
import { User } from "@/types";

interface NavbarProps {
  currentUser: User | null;
  onLogout: () => void;
  loading: boolean;
}

export default function Navbar({ currentUser, onLogout, loading }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 bg-[rgba(var(--surface),0.8)] dark:bg-[rgba(var(--bg),0.8)] backdrop-blur-lg border-b border-[rgb(var(--border))]">
      <div className="mx-auto max-w-4xl px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-[rgba(var(--accent),0.1)] text-[rgb(var(--accent))]">
              <Code2 />
            </div>
            <div>
              <div className="text-md font-bold text-[rgb(var(--text))]">DevThreads</div>
              <div className="text-xs text-muted">Professional Developer Discussions</div>
            </div>
          </div>
          {!loading &&
            <div className="flex items-center gap-2 sm:gap-4">
              {currentUser ? (
                <>
                  <div className="hidden md:block text-sm text-muted px-3 py-1.5 rounded-md bg-[rgba(var(--border),0.5)]">{currentUser.name}</div>
                  <Image
                    src={currentUser.avatar}
                    alt={currentUser.name || "User Avatar"}
                    width={36}
                    height={36}
                    className="rounded-full cursor-pointer"
                  />
                </>
              ) : (
                <div className="hidden md:block text-sm text-muted px-3 py-1.5 rounded-md bg-[rgba(var(--border),0.5)]">Not signed in</div>
              )}

              <button onClick={toggleTheme} aria-label="Toggle theme" className="p-2 h-10 w-10 flex items-center justify-center rounded-full transition-smooth hover:bg-[rgba(var(--border),0.5)] text-muted">
                {theme === "dark" ? <Sun size={18} className="theme-toggler" /> : <Moon size={18} className="theme-toggler" />}
              </button>

              <button onClick={onLogout} className="flex items-center gap-2 px-3 py-2 rounded-md btn-accent text-sm">
                <LogOut size={16} />
                <span className="hidden sm:inline">Log out</span>
              </button>
            </div>}
        </div>
      </div>
    </header>
  );
}