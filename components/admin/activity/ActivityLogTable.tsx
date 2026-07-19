"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { ActivityLog } from "@/lib/generated/prisma/client";

type ActivityLogRow = ActivityLog & { user: { name: string; email: string } | null };

const inputClass =
  "w-full rounded-xl border border-navy-950/15 bg-white px-3.5 py-2.5 text-sm text-navy-950 outline-none transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/25 dark:border-white/15 dark:bg-white/5 dark:text-white";

export default function ActivityLogTable({ logs }: { logs: ActivityLogRow[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return logs;
    return logs.filter((log) => {
      const userName = log.user?.name?.toLowerCase() ?? "";
      const userEmail = log.user?.email?.toLowerCase() ?? "";
      return log.action.toLowerCase().includes(q) || userName.includes(q) || userEmail.includes(q);
    });
  }, [logs, query]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-navy-900/40 dark:text-white/40" aria-hidden="true" />
        <input
          className={`${inputClass} pl-10`}
          placeholder="İşlem veya kullanıcı ara..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="glass rounded-2xl p-6 text-center text-sm text-muted">Kayıt bulunamadı.</p>
      ) : (
        <div className="glass flex flex-col divide-y divide-navy-950/5 rounded-2xl dark:divide-white/10">
          {filtered.map((log) => (
            <div key={log.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:gap-4">
              <span className="inline-flex w-fit shrink-0 items-center rounded-lg bg-navy-950/10 px-2.5 py-1 font-mono text-xs font-bold text-navy-900 dark:bg-white/10 dark:text-white/80">
                {log.action}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-navy-950 dark:text-white">
                  {log.user?.name ?? "Sistem"}
                </p>
                {log.detail != null && (
                  <details className="mt-1">
                    <summary className="cursor-pointer text-xs font-semibold text-orange-600 hover:text-orange-500 dark:text-orange-400">
                      Detay
                    </summary>
                    <pre className="mt-1 max-h-64 overflow-auto rounded-lg bg-navy-950/5 p-2.5 text-[11px] text-navy-900/80 dark:bg-white/5 dark:text-white/70">
                      {JSON.stringify(log.detail, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
              <span className="shrink-0 text-xs text-muted">{log.ip ?? "—"}</span>
              <span className="shrink-0 text-xs text-muted">{new Date(log.createdAt).toLocaleString("tr-TR")}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
