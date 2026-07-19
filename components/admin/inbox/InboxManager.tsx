"use client";

import { Fragment, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Download, Mail, MailOpen, Trash2 } from "lucide-react";
import type { ContactSubmission } from "@/lib/generated/prisma/client";
import { deleteSubmission, markSubmissionRead, markSubmissionReplied } from "@/lib/actions/contact";
import { useToast } from "@/components/admin/Toast";

type FilterTab = "all" | "unread" | "unreplied";

const TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "Tümü" },
  { key: "unread", label: "Okunmamış" },
  { key: "unreplied", label: "Yanıtlanmamış" },
];

export default function InboxManager({
  initialSubmissions,
}: {
  initialSubmissions: ContactSubmission[];
}) {
  const { push } = useToast();
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [tab, setTab] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return submissions.filter((s) => {
      if (tab === "unread" && s.read) return false;
      if (tab === "unreplied" && s.replied) return false;
      if (search) {
        const q = search.toLowerCase();
        const haystack = [s.name, s.phone, s.email ?? "", s.message ?? ""].join(" ").toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [submissions, tab, search]);

  async function toggleRead(s: ContactSubmission) {
    const next = !s.read;
    setSubmissions((prev) => prev.map((x) => (x.id === s.id ? { ...x, read: next } : x)));
    try {
      await markSubmissionRead(s.id, next);
    } catch (err) {
      setSubmissions((prev) => prev.map((x) => (x.id === s.id ? { ...x, read: s.read } : x)));
      push("error", err instanceof Error ? err.message : "Güncellenemedi.");
    }
  }

  async function toggleReplied(s: ContactSubmission) {
    const next = !s.replied;
    setSubmissions((prev) => prev.map((x) => (x.id === s.id ? { ...x, replied: next } : x)));
    try {
      await markSubmissionReplied(s.id, next);
    } catch (err) {
      setSubmissions((prev) => prev.map((x) => (x.id === s.id ? { ...x, replied: s.replied } : x)));
      push("error", err instanceof Error ? err.message : "Güncellenemedi.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu talebi silmek istediğinize emin misiniz?")) return;
    try {
      await deleteSubmission(id);
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      push("success", "Talep silindi.");
    } catch (err) {
      push("error", err instanceof Error ? err.message : "Silinemedi.");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="glass flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                tab === t.key
                  ? "bg-orange-500 text-navy-950"
                  : "bg-navy-950/5 text-navy-900/60 hover:bg-navy-950/10 dark:bg-white/5 dark:text-white/60 dark:hover:bg-white/10"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ad, telefon, e-posta veya mesajda ara..."
            className="w-full rounded-xl border border-navy-950/15 bg-white px-3.5 py-2 text-sm text-navy-950 outline-none transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/25 dark:border-white/15 dark:bg-white/5 dark:text-white sm:w-64"
          />
          <a
            href="/api/admin/contacts/export"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-orange-500 px-3.5 py-2 text-xs font-bold text-navy-950 shadow-md shadow-orange-500/25 transition-colors hover:bg-orange-400"
          >
            <Download className="size-4" aria-hidden="true" />
            Excel&apos;e Aktar
          </a>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="glass rounded-2xl p-6 text-center text-sm text-muted">Kayıt bulunamadı.</p>
      ) : (
        <div className="glass overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-navy-950/10 text-left text-xs font-bold uppercase tracking-wide text-navy-900/60 dark:border-white/10 dark:text-white/55">
                  <th className="px-4 py-3">Ad</th>
                  <th className="px-4 py-3">Telefon</th>
                  <th className="px-4 py-3">Rota</th>
                  <th className="px-4 py-3">Hizmet</th>
                  <th className="px-4 py-3">Tarih</th>
                  <th className="px-4 py-3">Durum</th>
                  <th className="px-4 py-3 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => {
                  const expanded = expandedId === s.id;
                  return (
                    <Fragment key={s.id}>
                      <tr
                        onClick={() => setExpandedId(expanded ? null : s.id)}
                        className={`cursor-pointer border-b border-navy-950/5 transition-colors last:border-0 hover:bg-navy-950/[0.03] dark:border-white/5 dark:hover:bg-white/[0.03] ${
                          !s.read ? "border-l-2 border-l-orange-500" : ""
                        }`}
                      >
                        <td className={`px-4 py-3 ${!s.read ? "font-bold text-navy-950 dark:text-white" : "text-navy-900/80 dark:text-white/75"}`}>
                          {s.name}
                        </td>
                        <td className="px-4 py-3 text-navy-900/80 dark:text-white/75">{s.phone}</td>
                        <td className="px-4 py-3 text-navy-900/80 dark:text-white/75">
                          {s.fromCity || "-"} → {s.toCity || "-"}
                        </td>
                        <td className="px-4 py-3 text-navy-900/80 dark:text-white/75">{s.service || "-"}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-navy-900/80 dark:text-white/75">
                          {s.createdAt.toLocaleString("tr-TR")}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1.5">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                                s.read
                                  ? "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400"
                                  : "bg-amber-500/12 text-amber-600 dark:text-amber-400"
                              }`}
                            >
                              {s.read ? "Okundu" : "Okunmadı"}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                                s.replied
                                  ? "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400"
                                  : "bg-navy-950/10 text-navy-900/60 dark:bg-white/10 dark:text-white/50"
                              }`}
                            >
                              {s.replied ? "Yanıtlandı" : "Yanıtlanmadı"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => toggleRead(s)}
                              aria-label={s.read ? "Okunmadı olarak işaretle" : "Okundu olarak işaretle"}
                              title={s.read ? "Okunmadı olarak işaretle" : "Okundu olarak işaretle"}
                              className="grid size-8 place-items-center rounded-lg text-navy-900/60 hover:bg-navy-950/5 dark:text-white/60 dark:hover:bg-white/10"
                            >
                              {s.read ? <MailOpen className="size-4" aria-hidden="true" /> : <Mail className="size-4" aria-hidden="true" />}
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleReplied(s)}
                              title={s.replied ? "Yanıtlanmadı olarak işaretle" : "Yanıtlandı olarak işaretle"}
                              className={`rounded-lg px-2 py-1.5 text-[10px] font-bold uppercase transition-colors ${
                                s.replied
                                  ? "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400"
                                  : "bg-navy-950/5 text-navy-900/60 hover:bg-navy-950/10 dark:bg-white/5 dark:text-white/55 dark:hover:bg-white/10"
                              }`}
                            >
                              Yanıtlandı
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(s.id)}
                              aria-label="Sil"
                              className="grid size-8 place-items-center rounded-lg text-red-500/70 hover:bg-red-500/10 hover:text-red-600"
                            >
                              <Trash2 className="size-4" aria-hidden="true" />
                            </button>
                            <span className="grid size-8 place-items-center text-navy-900/40 dark:text-white/40">
                              {expanded ? <ChevronUp className="size-4" aria-hidden="true" /> : <ChevronDown className="size-4" aria-hidden="true" />}
                            </span>
                          </div>
                        </td>
                      </tr>
                      {expanded && (
                        <tr className="border-b border-navy-950/5 bg-navy-950/[0.02] last:border-0 dark:border-white/5 dark:bg-white/[0.02]">
                          <td colSpan={7} className="px-4 py-4">
                            <div className="flex flex-col gap-2 text-sm">
                              <div>
                                <p className="text-xs font-bold uppercase tracking-wide text-navy-900/50 dark:text-white/50">Mesaj</p>
                                <p className="mt-1 whitespace-pre-wrap text-navy-950 dark:text-white">
                                  {s.message || "Mesaj girilmemiş."}
                                </p>
                              </div>
                              {s.email && (
                                <div>
                                  <p className="text-xs font-bold uppercase tracking-wide text-navy-900/50 dark:text-white/50">E-posta</p>
                                  <p className="mt-1 text-navy-950 dark:text-white">{s.email}</p>
                                </div>
                              )}
                              <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted">
                                <span>IP: {s.ip || "bilinmiyor"}</span>
                                <span className="break-all">User-Agent: {s.userAgent || "bilinmiyor"}</span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
