"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut, Menu, X } from "lucide-react";
import { ADMIN_NAV } from "@/components/admin/nav-config";
import ThemeToggle from "@/components/admin/ThemeToggle";
import type { Role } from "@/lib/generated/prisma/client";

const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Yönetici",
  EDITOR: "Editör",
  SEO: "SEO Uzmanı",
  CONTENT_EDITOR: "İçerik Editörü",
  SUPPORT: "Destek",
};

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarContent({ role, pathname, onNavigate }: { role: Role; pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-6 overflow-y-auto px-3 py-5">
      {ADMIN_NAV.map((group) => {
        const items = group.items.filter((item) => item.roles.includes(role));
        if (items.length === 0) return null;
        return (
          <div key={group.label}>
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-navy-900/40 dark:text-white/35">
              {group.label}
            </p>
            <ul className="mt-2 flex flex-col gap-0.5">
              {items.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                        active
                          ? "bg-orange-500 text-navy-950 shadow-md shadow-orange-500/25"
                          : "text-navy-900/75 hover:bg-navy-950/5 dark:text-navy-100/75 dark:hover:bg-white/10"
                      }`}
                    >
                      <item.icon className="size-4.5 shrink-0" aria-hidden="true" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}

export default function AdminShell({
  user,
  children,
}: {
  user: { name: string; email: string; role: Role };
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-navy-50/40 dark:bg-deep-950">
      {/* Masaüstü kenar çubuğu */}
      <aside className="glass fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r lg:flex">
        <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-navy-950/10 px-5 dark:border-white/10">
          <span className="grid size-8 place-items-center rounded-lg bg-orange-500 text-sm font-extrabold text-navy-950">
            EL
          </span>
          <span className="text-sm font-extrabold tracking-tight text-navy-950 dark:text-white">
            Egehan Admin
          </span>
        </div>
        <SidebarContent role={user.role} pathname={pathname} />
      </aside>

      {/* Mobil çekmece */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="glass absolute inset-y-0 left-0 flex w-72 flex-col border-r">
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-navy-950/10 px-5 dark:border-white/10">
              <span className="text-sm font-extrabold tracking-tight text-navy-950 dark:text-white">
                Egehan Admin
              </span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Menüyü kapat"
                className="grid size-9 place-items-center rounded-lg text-navy-900 hover:bg-navy-950/5 dark:text-white dark:hover:bg-white/10"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            <SidebarContent role={user.role} pathname={pathname} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="glass sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Menüyü aç"
            className="grid size-10 place-items-center rounded-xl text-navy-900 hover:bg-navy-950/5 lg:hidden dark:text-white dark:hover:bg-white/10"
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>

          <div className="hidden text-sm text-muted lg:block" />

          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <div className="hidden items-center gap-2.5 rounded-xl border border-navy-950/10 py-1.5 pl-1.5 pr-3 dark:border-white/15 sm:flex">
              <span className="grid size-8 place-items-center rounded-lg bg-navy-950 text-xs font-extrabold text-white dark:bg-white/10">
                {user.name.slice(0, 1).toUpperCase()}
              </span>
              <div className="leading-tight">
                <p className="text-xs font-bold text-navy-950 dark:text-white">{user.name}</p>
                <p className="text-[11px] text-muted">{ROLE_LABELS[user.role]}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              aria-label="Çıkış yap"
              title="Çıkış yap"
              className="grid size-10 place-items-center rounded-xl border border-navy-950/10 text-navy-900 transition-colors hover:bg-red-500/10 hover:text-red-600 dark:border-white/15 dark:text-navy-100 dark:hover:text-red-400"
            >
              <LogOut className="size-5" aria-hidden="true" />
            </button>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
