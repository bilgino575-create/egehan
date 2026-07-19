"use client";

import { useState, type FormEvent } from "react";
import { updateSettings, type SettingsInput } from "@/lib/actions/settings";
import type { getSettings } from "@/lib/data/settings";
import { useToast } from "@/components/admin/Toast";

const inputClass =
  "w-full rounded-xl border border-navy-950/15 bg-white px-3.5 py-2.5 text-sm text-navy-950 outline-none transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/25 dark:border-white/15 dark:bg-white/5 dark:text-white";
const labelClass = "mb-1.5 block text-xs font-bold uppercase tracking-wider text-navy-900/60 dark:text-white/55";

type InitialSettings = Awaited<ReturnType<typeof getSettings>>;

type FormState = SettingsInput;

function toFormState(settings: InitialSettings): FormState {
  return {
    siteName: settings.siteName,
    siteSlogan: settings.siteSlogan,
    siteDescription: settings.siteDescription,
    siteUrl: settings.siteUrl,
    phoneE164: settings.phoneE164,
    email: settings.email,
    addressLine: settings.addressLine,
    mapEmbedUrl: settings.mapEmbedUrl,
    workingHours: settings.workingHours,
    logoMediaId: settings.logoMediaId,
    faviconMediaId: settings.faviconMediaId,
    instagramUrl: settings.instagramUrl,
    facebookUrl: settings.facebookUrl,
    twitterUrl: settings.twitterUrl,
    linkedinUrl: settings.linkedinUrl,
    kvkkText: settings.kvkkText,
    cookieText: settings.cookieText,
    privacyText: settings.privacyText,
    themePrimaryHex: settings.themePrimaryHex,
    themeAccentHex: settings.themeAccentHex,
    headScripts: settings.headScripts,
    bodyScripts: settings.bodyScripts,
    footerScripts: settings.footerScripts,
    gaId: settings.gaId,
    gtmId: settings.gtmId,
    gscVerification: settings.gscVerification,
    merchantId: settings.merchantId,
    googleAdsId: settings.googleAdsId,
    businessProfileId: settings.businessProfileId,
    recaptchaSiteKey: settings.recaptchaSiteKey,
    recaptchaSecret: settings.recaptchaSecret,
  };
}

const TABS = [
  { key: "genel", label: "Genel" },
  { key: "iletisim", label: "İletişim" },
  { key: "sosyal", label: "Sosyal Medya" },
  { key: "yasal", label: "Yasal Metinler" },
  { key: "tema", label: "Tema" },
  { key: "google", label: "Google & Entegrasyonlar" },
  { key: "script", label: "Script Enjeksiyonu" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function SettingsManager({ initialSettings }: { initialSettings: InitialSettings }) {
  const { push } = useToast();
  const [form, setForm] = useState<FormState>(toFormState(initialSettings));
  const [activeTab, setActiveTab] = useState<TabKey>("genel");
  const [saving, setSaving] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updateSettings(form);
      setForm(toFormState(updated));
      push("success", "Ayarlar kaydedildi.");
    } catch (err) {
      push("error", err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="glass flex flex-wrap gap-1 rounded-2xl p-1.5">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-colors ${
              activeTab === tab.key
                ? "bg-orange-500 text-navy-950 shadow-md shadow-orange-500/25"
                : "text-navy-900/70 hover:bg-navy-950/5 dark:text-white/65 dark:hover:bg-white/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "genel" && (
        <div className="glass flex flex-col gap-4 rounded-2xl p-6">
          <div>
            <label className={labelClass}>Site Adı</label>
            <input required className={inputClass} value={form.siteName} onChange={(e) => update("siteName", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Slogan</label>
            <input required className={inputClass} value={form.siteSlogan} onChange={(e) => update("siteSlogan", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Site Açıklaması</label>
            <textarea
              required
              rows={3}
              className={`${inputClass} resize-none`}
              value={form.siteDescription}
              onChange={(e) => update("siteDescription", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Site URL</label>
            <input
              required
              type="url"
              className={inputClass}
              value={form.siteUrl}
              onChange={(e) => update("siteUrl", e.target.value)}
            />
          </div>
        </div>
      )}

      {activeTab === "iletisim" && (
        <div className="glass flex flex-col gap-4 rounded-2xl p-6">
          <div>
            <label className={labelClass}>
              Telefon (uluslararası format, boşluksuz, + olmadan — örn. 905551234567)
            </label>
            <input
              required
              className={inputClass}
              value={form.phoneE164}
              onChange={(e) => update("phoneE164", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>E-posta</label>
            <input
              type="email"
              className={inputClass}
              value={form.email ?? ""}
              onChange={(e) => update("email", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Adres</label>
            <input
              className={inputClass}
              value={form.addressLine ?? ""}
              onChange={(e) => update("addressLine", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Harita Gömme URL (embed)</label>
            <input
              className={inputClass}
              value={form.mapEmbedUrl ?? ""}
              onChange={(e) => update("mapEmbedUrl", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Çalışma Saatleri</label>
            <input
              className={inputClass}
              value={form.workingHours ?? ""}
              onChange={(e) => update("workingHours", e.target.value)}
            />
          </div>
        </div>
      )}

      {activeTab === "sosyal" && (
        <div className="glass flex flex-col gap-4 rounded-2xl p-6">
          <div>
            <label className={labelClass}>Instagram URL</label>
            <input
              className={inputClass}
              value={form.instagramUrl ?? ""}
              onChange={(e) => update("instagramUrl", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Facebook URL</label>
            <input
              className={inputClass}
              value={form.facebookUrl ?? ""}
              onChange={(e) => update("facebookUrl", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Twitter / X URL</label>
            <input
              className={inputClass}
              value={form.twitterUrl ?? ""}
              onChange={(e) => update("twitterUrl", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>LinkedIn URL</label>
            <input
              className={inputClass}
              value={form.linkedinUrl ?? ""}
              onChange={(e) => update("linkedinUrl", e.target.value)}
            />
          </div>
        </div>
      )}

      {activeTab === "yasal" && (
        <div className="glass flex flex-col gap-4 rounded-2xl p-6">
          <div>
            <label className={labelClass}>KVKK Metni</label>
            <textarea
              rows={8}
              className={`${inputClass} resize-none`}
              value={form.kvkkText ?? ""}
              onChange={(e) => update("kvkkText", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Çerez Politikası Metni</label>
            <textarea
              rows={8}
              className={`${inputClass} resize-none`}
              value={form.cookieText ?? ""}
              onChange={(e) => update("cookieText", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Gizlilik Politikası Metni</label>
            <textarea
              rows={8}
              className={`${inputClass} resize-none`}
              value={form.privacyText ?? ""}
              onChange={(e) => update("privacyText", e.target.value)}
            />
          </div>
        </div>
      )}

      {activeTab === "tema" && (
        <div className="glass flex flex-col gap-4 rounded-2xl p-6">
          <div>
            <label className={labelClass}>Ana Renk (hex)</label>
            <div className="flex items-center gap-3">
              <span
                className="size-9 shrink-0 rounded-lg border border-navy-950/15 dark:border-white/15"
                style={{ background: form.themePrimaryHex || "transparent" }}
                aria-hidden="true"
              />
              <input
                className={inputClass}
                placeholder="#0f172a"
                value={form.themePrimaryHex ?? ""}
                onChange={(e) => update("themePrimaryHex", e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Vurgu Rengi (hex)</label>
            <div className="flex items-center gap-3">
              <span
                className="size-9 shrink-0 rounded-lg border border-navy-950/15 dark:border-white/15"
                style={{ background: form.themeAccentHex || "transparent" }}
                aria-hidden="true"
              />
              <input
                className={inputClass}
                placeholder="#f97316"
                value={form.themeAccentHex ?? ""}
                onChange={(e) => update("themeAccentHex", e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === "google" && (
        <div className="glass flex flex-col gap-4 rounded-2xl p-6">
          <p className="rounded-xl border border-dashed border-navy-950/15 bg-navy-950/[0.03] p-3 text-xs font-semibold text-muted dark:border-white/15 dark:bg-white/5">
            Bu alanlar sadece ID/anahtar saklar; canlı Google API entegrasyonu sonraki fazda eklenecektir.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Google Analytics ID</label>
              <input className={inputClass} value={form.gaId ?? ""} onChange={(e) => update("gaId", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Google Tag Manager ID</label>
              <input className={inputClass} value={form.gtmId ?? ""} onChange={(e) => update("gtmId", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Search Console Doğrulama</label>
              <input
                className={inputClass}
                value={form.gscVerification ?? ""}
                onChange={(e) => update("gscVerification", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Merchant ID</label>
              <input
                className={inputClass}
                value={form.merchantId ?? ""}
                onChange={(e) => update("merchantId", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Google Ads ID</label>
              <input
                className={inputClass}
                value={form.googleAdsId ?? ""}
                onChange={(e) => update("googleAdsId", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Business Profile ID</label>
              <input
                className={inputClass}
                value={form.businessProfileId ?? ""}
                onChange={(e) => update("businessProfileId", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>reCAPTCHA Site Key</label>
              <input
                className={inputClass}
                value={form.recaptchaSiteKey ?? ""}
                onChange={(e) => update("recaptchaSiteKey", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>reCAPTCHA Secret</label>
              <input
                className={inputClass}
                value={form.recaptchaSecret ?? ""}
                onChange={(e) => update("recaptchaSecret", e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === "script" && (
        <div className="glass flex flex-col gap-4 rounded-2xl p-6">
          <div>
            <p className="mb-1.5 text-xs font-semibold text-muted">
              <code>&lt;head&gt;</code> içine enjekte edilir — örn. Google Tag Manager (head) kodu.
            </p>
            <label className={labelClass}>Head Script</label>
            <textarea
              rows={6}
              className={`${inputClass} resize-none font-mono text-xs`}
              value={form.headScripts ?? ""}
              onChange={(e) => update("headScripts", e.target.value)}
            />
          </div>
          <div>
            <p className="mb-1.5 text-xs font-semibold text-muted">
              <code>&lt;body&gt;</code> açılışına enjekte edilir — örn. Google Tag Manager (noscript) kodu.
            </p>
            <label className={labelClass}>Body Başlangıç Script</label>
            <textarea
              rows={6}
              className={`${inputClass} resize-none font-mono text-xs`}
              value={form.bodyScripts ?? ""}
              onChange={(e) => update("bodyScripts", e.target.value)}
            />
          </div>
          <div>
            <p className="mb-1.5 text-xs font-semibold text-muted">
              <code>&lt;/body&gt;</code> kapanışından hemen önce enjekte edilir — örn. sohbet widget'ları.
            </p>
            <label className={labelClass}>Body Sonu Script</label>
            <textarea
              rows={6}
              className={`${inputClass} resize-none font-mono text-xs`}
              value={form.footerScripts ?? ""}
              onChange={(e) => update("footerScripts", e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-navy-950 shadow-lg shadow-orange-500/30 transition-all hover:bg-orange-400 disabled:opacity-60"
        >
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>
    </form>
  );
}
