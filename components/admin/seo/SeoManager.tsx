"use client";

import { useMemo, useState, type FormEvent } from "react";
import { AlertTriangle } from "lucide-react";
import type { SeoMeta } from "@/lib/generated/prisma/client";
import { updateSeoMeta } from "@/lib/actions/seo";
import { computeSeoScore, type SeoScoreResult } from "@/lib/seo-score";
import { useToast } from "@/components/admin/Toast";

const inputClass =
  "w-full rounded-xl border border-navy-950/15 bg-white px-3.5 py-2.5 text-sm text-navy-950 outline-none transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/25 dark:border-white/15 dark:bg-white/5 dark:text-white";
const labelClass = "mb-1.5 block text-xs font-bold uppercase tracking-wider text-navy-900/60 dark:text-white/55";

interface FormState {
  title: string;
  description: string;
  keywords: string;
  canonicalPath: string;
  ogTitle: string;
  ogDescription: string;
  twitterCard: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
}

interface BaselineCounts {
  faqCount: number;
  serviceCount: number;
  imagesTotal: number;
  imagesWithAlt: number;
}

function toFormState(seoMeta: SeoMeta | null): FormState {
  return {
    title: seoMeta?.title ?? "",
    description: seoMeta?.description ?? "",
    keywords: seoMeta?.keywords.join("\n") ?? "",
    canonicalPath: seoMeta?.canonicalPath ?? "/",
    ogTitle: seoMeta?.ogTitle ?? "",
    ogDescription: seoMeta?.ogDescription ?? "",
    twitterCard: seoMeta?.twitterCard ?? "summary_large_image",
    robotsIndex: seoMeta?.robotsIndex ?? true,
    robotsFollow: seoMeta?.robotsFollow ?? true,
  };
}

function scoreColor(score: number) {
  if (score >= 80) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 50) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

function scoreRingColor(score: number) {
  if (score >= 80) return "bg-emerald-500/12";
  if (score >= 50) return "bg-amber-500/12";
  return "bg-red-500/12";
}

export default function SeoManager({
  initialSeoMeta,
  initialScore,
  baselineCounts,
}: {
  initialSeoMeta: SeoMeta | null;
  initialScore: SeoScoreResult;
  baselineCounts: BaselineCounts;
}) {
  const { push } = useToast();
  const [form, setForm] = useState<FormState>(toFormState(initialSeoMeta));
  const [ogImageMediaId] = useState<string | null>(initialSeoMeta?.ogImageMediaId ?? null);
  const [saving, setSaving] = useState(false);

  // Recomputed live as the form changes; faq/service/media counts are fixed
  // (server-provided) since this form doesn't edit those.
  const score: SeoScoreResult = useMemo(() => {
    const keywords = form.keywords
      .split("\n")
      .map((k) => k.trim())
      .filter(Boolean);
    return computeSeoScore({
      title: form.title,
      description: form.description,
      canonicalPath: form.canonicalPath,
      keywords,
      ogImageMediaId,
      robotsIndex: form.robotsIndex,
      ...baselineCounts,
    });
  }, [form, ogImageMediaId, baselineCounts]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const keywords = form.keywords
        .split("\n")
        .map((k) => k.trim())
        .filter(Boolean);
      const updated = await updateSeoMeta({
        pageKey: "home",
        title: form.title,
        description: form.description,
        keywords,
        canonicalPath: form.canonicalPath,
        ogTitle: form.ogTitle || null,
        ogDescription: form.ogDescription || null,
        ogImageMediaId,
        twitterCard: form.twitterCard,
        robotsIndex: form.robotsIndex,
        robotsFollow: form.robotsFollow,
      });
      setForm(toFormState(updated));
      push("success", "SEO ayarları kaydedildi.");
    } catch (err) {
      push("error", err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  const siteUrlPreview = "https://egehanlojistik.com";

  return (
    <div className="flex flex-col gap-6">
      {/* SEO Skoru */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-extrabold text-navy-950 dark:text-white">SEO Skoru</h2>
          <span
            className={`grid size-14 shrink-0 place-items-center rounded-full text-lg font-extrabold ${scoreRingColor(score.score)} ${scoreColor(score.score)}`}
          >
            {score.score}
          </span>
        </div>
        {score.warnings.length > 0 ? (
          <ul className="mt-4 flex flex-col gap-2">
            {score.warnings.map((w) => (
              <li key={w} className="flex items-start gap-2 text-sm text-muted">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-500" aria-hidden="true" />
                {w}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-muted">Herhangi bir uyarı yok — harika görünüyor.</p>
        )}
      </div>

      {/* Google Önizleme */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-sm font-extrabold text-navy-950 dark:text-white">Google Önizleme</h2>
        <div className="mt-4 rounded-xl border border-navy-950/10 bg-white p-4 dark:border-white/10 dark:bg-white/5">
          <p className="truncate text-xs text-[#202124] dark:text-white/70">
            {siteUrlPreview}
            {form.canonicalPath.startsWith("/") ? form.canonicalPath : `/${form.canonicalPath}`}
          </p>
          <p className="mt-0.5 truncate text-lg text-[#1a0dab] dark:text-[#8ab4f8]">
            {form.title || "Sayfa başlığı"}
          </p>
          <p className="mt-0.5 line-clamp-2 text-sm text-[#4d5156] dark:text-white/60">
            {form.description || "Sayfa açıklaması burada görünecek."}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="glass flex flex-col gap-4 rounded-2xl p-6">
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className={labelClass}>Meta Başlık</label>
            <span className="text-xs font-semibold text-muted">{form.title.length}/60</span>
          </div>
          <input required className={inputClass} value={form.title} onChange={(e) => update("title", e.target.value)} />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className={labelClass}>Meta Açıklama</label>
            <span className="text-xs font-semibold text-muted">{form.description.length}/160</span>
          </div>
          <textarea
            required
            rows={3}
            className={`${inputClass} resize-none`}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Anahtar Kelimeler (her satıra bir tane)</label>
          <textarea
            rows={4}
            className={`${inputClass} resize-none`}
            value={form.keywords}
            onChange={(e) => update("keywords", e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Canonical Yol</label>
          <input
            required
            className={inputClass}
            placeholder="/"
            value={form.canonicalPath}
            onChange={(e) => update("canonicalPath", e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Open Graph Başlık (isteğe bağlı)</label>
          <input className={inputClass} value={form.ogTitle} onChange={(e) => update("ogTitle", e.target.value)} />
        </div>

        <div>
          <label className={labelClass}>Open Graph Açıklama (isteğe bağlı)</label>
          <textarea
            rows={2}
            className={`${inputClass} resize-none`}
            value={form.ogDescription}
            onChange={(e) => update("ogDescription", e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Twitter Kart Türü</label>
          <select className={inputClass} value={form.twitterCard} onChange={(e) => update("twitterCard", e.target.value)}>
            <option value="summary">summary</option>
            <option value="summary_large_image">summary_large_image</option>
          </select>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm font-semibold text-navy-900 dark:text-white">
            <input
              type="checkbox"
              checked={form.robotsIndex}
              onChange={(e) => update("robotsIndex", e.target.checked)}
              className="size-4 accent-orange-500"
            />
            Index (Google'da göster)
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-navy-900 dark:text-white">
            <input
              type="checkbox"
              checked={form.robotsFollow}
              onChange={(e) => update("robotsFollow", e.target.checked)}
              className="size-4 accent-orange-500"
            />
            Follow (bağlantıları takip et)
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-1 inline-flex items-center justify-center rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-navy-950 shadow-lg shadow-orange-500/30 transition-all hover:bg-orange-400 disabled:opacity-60"
        >
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </form>
    </div>
  );
}
