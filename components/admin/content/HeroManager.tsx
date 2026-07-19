"use client";

import { useState, type FormEvent } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { City, HeroContent, Stat } from "@/lib/generated/prisma/client";
import { updateHero } from "@/lib/actions/hero";
import { createStat, deleteStat } from "@/lib/actions/stats";
import { createCity, deleteCity, toggleCityActive } from "@/lib/actions/cities";
import { useToast } from "@/components/admin/Toast";

const inputClass =
  "w-full rounded-xl border border-navy-950/15 bg-white px-3.5 py-2.5 text-sm text-navy-950 outline-none transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/25 dark:border-white/15 dark:bg-white/5 dark:text-white";
const labelClass = "mb-1.5 block text-xs font-bold uppercase tracking-wider text-navy-900/60 dark:text-white/55";

interface HeroFormState {
  badgeLive: string;
  badgeVip: string;
  heading: string;
  headingHighlight: string;
  description: string;
  ctaPrimaryLabel: string;
  ctaSecondaryLabel: string;
  trustItems: string;
}

function heroToForm(hero: HeroContent | null): HeroFormState {
  return {
    badgeLive: hero?.badgeLive ?? "",
    badgeVip: hero?.badgeVip ?? "",
    heading: hero?.heading ?? "",
    headingHighlight: hero?.headingHighlight ?? "",
    description: hero?.description ?? "",
    ctaPrimaryLabel: hero?.ctaPrimaryLabel ?? "",
    ctaSecondaryLabel: hero?.ctaSecondaryLabel ?? "",
    trustItems: (hero?.trustItems ?? []).join("\n"),
  };
}

export default function HeroManager({
  initialHero,
  initialStats,
  initialCities,
}: {
  initialHero: HeroContent | null;
  initialStats: Stat[];
  initialCities: City[];
}) {
  const { push } = useToast();
  const [hero, setHero] = useState(initialHero);
  const [form, setForm] = useState<HeroFormState>(heroToForm(initialHero));
  const [saving, setSaving] = useState(false);

  const [stats, setStats] = useState(initialStats);
  const [statValue, setStatValue] = useState("");
  const [statLabel, setStatLabel] = useState("");
  const [statSaving, setStatSaving] = useState(false);

  const [cities, setCities] = useState(initialCities);
  const [cityName, setCityName] = useState("");
  const [citySaving, setCitySaving] = useState(false);

  async function handleHeroSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        badgeLive: form.badgeLive,
        badgeVip: form.badgeVip,
        heading: form.heading,
        headingHighlight: form.headingHighlight,
        description: form.description,
        ctaPrimaryLabel: form.ctaPrimaryLabel,
        ctaSecondaryLabel: form.ctaSecondaryLabel,
        trustItems: form.trustItems.split("\n").map((t) => t.trim()).filter(Boolean),
        imageMediaId: hero?.imageMediaId ?? null,
      };
      const updated = await updateHero(payload);
      setHero(updated);
      setForm(heroToForm(updated));
      push("success", "Hero bölümü güncellendi.");
    } catch (err) {
      push("error", err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  async function handleStatAdd(e: FormEvent) {
    e.preventDefault();
    if (!statValue.trim() || !statLabel.trim()) return;
    setStatSaving(true);
    try {
      const created = await createStat({ value: statValue.trim(), label: statLabel.trim() });
      setStats((prev) => [...prev, created]);
      setStatValue("");
      setStatLabel("");
      push("success", "İstatistik eklendi.");
    } catch (err) {
      push("error", err instanceof Error ? err.message : "Eklenemedi.");
    } finally {
      setStatSaving(false);
    }
  }

  async function handleStatDelete(id: string) {
    if (!confirm("Bu istatistiği silmek istediğinize emin misiniz?")) return;
    try {
      await deleteStat(id);
      setStats((prev) => prev.filter((s) => s.id !== id));
      push("success", "İstatistik silindi.");
    } catch (err) {
      push("error", err instanceof Error ? err.message : "Silinemedi.");
    }
  }

  async function handleCityAdd(e: FormEvent) {
    e.preventDefault();
    if (!cityName.trim()) return;
    setCitySaving(true);
    try {
      const created = await createCity({ name: cityName.trim(), active: true });
      setCities((prev) => [...prev, created]);
      setCityName("");
      push("success", "Şehir eklendi.");
    } catch (err) {
      push("error", err instanceof Error ? err.message : "Eklenemedi.");
    } finally {
      setCitySaving(false);
    }
  }

  async function handleCityDelete(id: string) {
    if (!confirm("Bu şehri silmek istediğinize emin misiniz?")) return;
    try {
      await deleteCity(id);
      setCities((prev) => prev.filter((c) => c.id !== id));
      push("success", "Şehir silindi.");
    } catch (err) {
      push("error", err instanceof Error ? err.message : "Silinemedi.");
    }
  }

  async function handleCityToggle(id: string, active: boolean) {
    setCities((prev) => prev.map((c) => (c.id === id ? { ...c, active } : c)));
    try {
      await toggleCityActive(id, active);
    } catch (err) {
      push("error", err instanceof Error ? err.message : "Güncellenemedi.");
      setCities((prev) => prev.map((c) => (c.id === id ? { ...c, active: !active } : c)));
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="glass rounded-2xl p-6">
        <form onSubmit={handleHeroSubmit} className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Canlı Rozet Metni</label>
              <input
                required
                className={inputClass}
                value={form.badgeLive}
                onChange={(e) => setForm((f) => ({ ...f, badgeLive: e.target.value }))}
              />
            </div>
            <div>
              <label className={labelClass}>VIP Rozet Metni</label>
              <input
                required
                className={inputClass}
                value={form.badgeVip}
                onChange={(e) => setForm((f) => ({ ...f, badgeVip: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Başlık</label>
            <input
              required
              className={inputClass}
              value={form.heading}
              onChange={(e) => setForm((f) => ({ ...f, heading: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelClass}>Vurgulanacak Kelime</label>
            <p className="mb-1.5 text-xs text-muted">
              Başlık metninin içinde birebir geçen bir alt metin olmalı; sitede altı çizili gösterilir. Örn. başlık
              &quot;81 İlde Güvenli ve Profesyonel Taşımacılık&quot; ise vurgu &quot;Güvenli&quot; olabilir.
            </p>
            <input
              required
              className={inputClass}
              value={form.headingHighlight}
              onChange={(e) => setForm((f) => ({ ...f, headingHighlight: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelClass}>Açıklama</label>
            <textarea
              required
              rows={3}
              className={`${inputClass} resize-none`}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Birincil Buton Metni</label>
              <input
                required
                className={inputClass}
                value={form.ctaPrimaryLabel}
                onChange={(e) => setForm((f) => ({ ...f, ctaPrimaryLabel: e.target.value }))}
              />
            </div>
            <div>
              <label className={labelClass}>İkincil Buton Metni</label>
              <input
                required
                className={inputClass}
                value={form.ctaSecondaryLabel}
                onChange={(e) => setForm((f) => ({ ...f, ctaSecondaryLabel: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Güven Unsurları (her satıra bir tane)</label>
            <textarea
              rows={3}
              className={`${inputClass} resize-none`}
              value={form.trustItems}
              onChange={(e) => setForm((f) => ({ ...f, trustItems: e.target.value }))}
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="mt-1 inline-flex items-center justify-center rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-navy-950 shadow-lg shadow-orange-500/30 transition-all hover:bg-orange-400 disabled:opacity-60 sm:self-start"
          >
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </form>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass flex flex-col gap-4 rounded-2xl p-6">
          <h2 className="text-sm font-extrabold text-navy-950 dark:text-white">İstatistikler</h2>
          <form onSubmit={handleStatAdd} className="flex flex-wrap gap-2">
            <input
              placeholder="Değer (örn. 15+)"
              className={`${inputClass} flex-1 basis-28`}
              value={statValue}
              onChange={(e) => setStatValue(e.target.value)}
            />
            <input
              placeholder="Etiket (örn. Yıllık Deneyim)"
              className={`${inputClass} flex-1 basis-40`}
              value={statLabel}
              onChange={(e) => setStatLabel(e.target.value)}
            />
            <button
              type="submit"
              disabled={statSaving}
              className="inline-flex items-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-navy-950 shadow-md shadow-orange-500/25 transition-colors hover:bg-orange-400 disabled:opacity-60"
            >
              <Plus className="size-4" aria-hidden="true" />
              Ekle
            </button>
          </form>
          {stats.length === 0 ? (
            <p className="rounded-xl bg-navy-950/5 p-4 text-center text-xs text-muted dark:bg-white/5">
              Henüz istatistik eklenmedi.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {stats.map((stat) => (
                <div key={stat.id} className="flex items-center gap-3 rounded-xl bg-navy-950/5 px-3.5 py-2.5 dark:bg-white/5">
                  <p className="min-w-0 flex-1 truncate text-sm font-semibold text-navy-950 dark:text-white">
                    <span className="font-extrabold text-orange-500">{stat.value}</span> — {stat.label}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleStatDelete(stat.id)}
                    aria-label="Sil"
                    className="grid size-8 shrink-0 place-items-center rounded-lg text-red-500/70 hover:bg-red-500/10 hover:text-red-600"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass flex flex-col gap-4 rounded-2xl p-6">
          <h2 className="text-sm font-extrabold text-navy-950 dark:text-white">Hizmet Bölgeleri</h2>
          <form onSubmit={handleCityAdd} className="flex gap-2">
            <input
              placeholder="Şehir adı"
              className={`${inputClass} flex-1`}
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
            />
            <button
              type="submit"
              disabled={citySaving}
              className="inline-flex items-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-navy-950 shadow-md shadow-orange-500/25 transition-colors hover:bg-orange-400 disabled:opacity-60"
            >
              <Plus className="size-4" aria-hidden="true" />
              Ekle
            </button>
          </form>
          {cities.length === 0 ? (
            <p className="rounded-xl bg-navy-950/5 p-4 text-center text-xs text-muted dark:bg-white/5">
              Henüz şehir eklenmedi.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {cities.map((city) => (
                <div key={city.id} className="flex items-center gap-3 rounded-xl bg-navy-950/5 px-3.5 py-2.5 dark:bg-white/5">
                  <p className="min-w-0 flex-1 truncate text-sm font-semibold text-navy-950 dark:text-white">{city.name}</p>
                  <button
                    type="button"
                    onClick={() => handleCityToggle(city.id, !city.active)}
                    className={`relative h-5.5 w-10 shrink-0 rounded-full transition-colors ${
                      city.active ? "bg-orange-500" : "bg-navy-950/20 dark:bg-white/20"
                    }`}
                    aria-label={city.active ? "Pasif yap" : "Aktif yap"}
                    aria-pressed={city.active}
                  >
                    <span
                      className={`absolute top-0.5 size-4.5 rounded-full bg-white shadow transition-transform ${
                        city.active ? "translate-x-4.5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCityDelete(city.id)}
                    aria-label="Sil"
                    className="grid size-8 shrink-0 place-items-center rounded-lg text-red-500/70 hover:bg-red-500/10 hover:text-red-600"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
