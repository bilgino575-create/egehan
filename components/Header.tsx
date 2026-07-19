"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Menu, Moon, Sun, X } from "lucide-react";
import Logo from "@/components/Logo";

export interface NavItemData {
  label: string;
  href: string;
}

function ThemeToggle() {
  function toggleTheme() {
    const root = document.documentElement;
    const dark = root.classList.toggle("dark");
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {
      // localStorage kullanılamıyorsa tema yalnızca oturumluk değişir
    }
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Koyu veya açık temaya geç"
      className="grid size-10 place-items-center rounded-xl border border-navy-950/10 text-navy-900 transition-colors hover:bg-navy-950/5 dark:border-white/15 dark:text-navy-100 dark:hover:bg-white/10"
    >
      <Sun className="size-5 dark:hidden" aria-hidden="true" />
      <Moon className="hidden size-5 dark:block" aria-hidden="true" />
    </button>
  );
}

export default function Header({ navItems }: { navItems: NavItemData[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled || open
          ? "border-b border-navy-950/5 bg-white/80 shadow-sm shadow-navy-950/5 backdrop-blur-xl dark:border-white/10 dark:bg-deep-950/80"
          : "bg-transparent"
      }`}
    >
      <div className="container-x flex h-[4.5rem] items-center justify-between gap-4">
        <a href="#icerik" aria-label="Egehan Lojistik — ana sayfa">
          <Logo />
        </a>

        <nav aria-label="Ana menü" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="rounded-lg px-3.5 py-2 text-sm font-semibold text-navy-900/80 transition-colors hover:bg-navy-950/5 hover:text-navy-950 dark:text-navy-100/80 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <a
            href="#iletisim"
            className="group hidden items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-navy-950 shadow-lg shadow-orange-500/30 transition-all hover:bg-orange-400 hover:shadow-orange-500/40 sm:inline-flex"
          >
            Ücretsiz Teklif
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobil-menu"
            aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
            className="grid size-10 place-items-center rounded-xl border border-navy-950/10 text-navy-900 transition-colors hover:bg-navy-950/5 lg:hidden dark:border-white/15 dark:text-navy-100 dark:hover:bg-white/10"
          >
            {open ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobil-menu"
          className="border-t border-navy-950/5 bg-white/95 backdrop-blur-xl lg:hidden dark:border-white/10 dark:bg-deep-950/95"
        >
          <nav aria-label="Mobil menü" className="container-x py-4">
            <ul className="flex flex-col gap-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-4 py-3 text-base font-semibold text-navy-900/85 transition-colors hover:bg-navy-950/5 dark:text-navy-100/85 dark:hover:bg-white/10"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="#iletisim"
              onClick={() => setOpen(false)}
              className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3.5 text-base font-bold text-navy-950 shadow-lg shadow-orange-500/30"
            >
              Ücretsiz Teklif Alın
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
