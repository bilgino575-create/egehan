"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { whatsappHrefWithMessage } from "@/lib/site";
import { createContactSubmission } from "@/lib/actions/contact";

const inputClass =
  "w-full rounded-xl border border-navy-950/15 bg-white px-4 py-3 text-sm text-navy-950 placeholder:text-navy-900/40 transition-colors focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/25 dark:border-white/15 dark:bg-white/5 dark:text-white dark:placeholder:text-white/35";

const labelClass =
  "mb-1.5 block text-xs font-bold uppercase tracking-wider text-navy-900/60 dark:text-white/55";

/**
 * WhatsApp akışı (window.open) her zaman senkron ve garanti çalışır; DB
 * kaydı arka planda, awaitsiz gönderilir — ağ/DB sorunu WhatsApp'ı asla
 * engellemez.
 */
export default function QuoteForm({
  phoneE164,
  serviceOptions,
}: {
  phoneE164: string;
  serviceOptions: string[];
}) {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const lines = [
      "Merhaba, web siteniz üzerinden ücretsiz teklif almak istiyorum.",
      `• Ad Soyad: ${String(data.get("name") ?? "").trim()}`,
      `• Telefon: ${String(data.get("phone") ?? "").trim()}`,
      `• Nereden: ${String(data.get("from") ?? "").trim()}`,
      `• Nereye: ${String(data.get("to") ?? "").trim()}`,
      `• Hizmet: ${String(data.get("service") ?? "").trim()}`,
    ];
    const note = String(data.get("note") ?? "").trim();
    if (note) lines.push(`• Not: ${note}`);

    window.open(
      whatsappHrefWithMessage(phoneE164, lines.join("\n")),
      "_blank",
      "noopener,noreferrer"
    );
    setSent(true);

    void createContactSubmission(data);
    form.reset();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
      aria-label="Hızlı teklif formu"
    >
      <div>
        <label htmlFor="teklif-ad" className={labelClass}>
          Ad Soyad
        </label>
        <input
          id="teklif-ad"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Adınız ve soyadınız"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="teklif-telefon" className={labelClass}>
          Telefon
        </label>
        <input
          id="teklif-telefon"
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          placeholder="05XX XXX XX XX"
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="teklif-nereden" className={labelClass}>
            Nereden
          </label>
          <input
            id="teklif-nereden"
            name="from"
            type="text"
            required
            placeholder="İl / İlçe"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="teklif-nereye" className={labelClass}>
            Nereye
          </label>
          <input
            id="teklif-nereye"
            name="to"
            type="text"
            required
            placeholder="İl / İlçe"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="teklif-hizmet" className={labelClass}>
          Hizmet Türü
        </label>
        <select id="teklif-hizmet" name="service" className={inputClass}>
          {serviceOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="teklif-not" className={labelClass}>
          Eşya Bilgisi / Not{" "}
          <span className="font-medium normal-case tracking-normal opacity-60">
            (isteğe bağlı)
          </span>
        </label>
        <textarea
          id="teklif-not"
          name="note"
          rows={3}
          placeholder="Örn. 3+1 ev, 5. kat, asansör mevcut…"
          className={`${inputClass} resize-none`}
        />
      </div>

      <button
        type="submit"
        className="group mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 text-base font-bold text-navy-950 shadow-lg shadow-orange-500/30 transition-all hover:bg-orange-400 hover:shadow-orange-500/40"
      >
        WhatsApp ile Teklif İsteyin
        <Send
          className="size-4.5 transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </button>

      <p aria-live="polite" className="text-center text-xs text-muted">
        {sent
          ? "WhatsApp açıldı — hazırlanan mesajı göndermeniz yeterli."
          : "Bilgileriniz yalnızca teklif mesajınızı oluşturmak için kullanılır."}
      </p>
    </form>
  );
}
