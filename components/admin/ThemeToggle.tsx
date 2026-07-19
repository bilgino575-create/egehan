"use client";

import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  function toggleTheme() {
    const root = document.documentElement;
    const dark = root.classList.toggle("dark");
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {
      // localStorage yoksa tema yalnızca oturumluk değişir
    }
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Koyu veya açık temaya geç"
      className="grid size-10 shrink-0 place-items-center rounded-xl border border-navy-950/10 text-navy-900 transition-colors hover:bg-navy-950/5 dark:border-white/15 dark:text-navy-100 dark:hover:bg-white/10"
    >
      <Sun className="size-5 dark:hidden" aria-hidden="true" />
      <Moon className="hidden size-5 dark:block" aria-hidden="true" />
    </button>
  );
}
