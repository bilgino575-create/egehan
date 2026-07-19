"use client";

import { useState, type FormEvent } from "react";
import { MessageSquarePlus, Send, Star } from "lucide-react";
import { createPublicTestimonial } from "@/lib/actions/testimonials";

const inputClass =
  "w-full rounded-xl border border-navy-950/15 bg-white px-4 py-3 text-sm text-navy-950 placeholder:text-navy-900/40 transition-colors focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/25 dark:border-white/15 dark:bg-white/5 dark:text-white dark:placeholder:text-white/35";

const labelClass =
  "mb-1.5 block text-xs font-bold uppercase tracking-wider text-navy-900/60 dark:text-white/55";

export interface ServiceOption {
  id: string;
  title: string;
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Puanınız">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-label={`${n} yıldız`}
          aria-checked={n === value}
          role="radio"
          className="rounded-md p-0.5 text-navy-900/25 transition-colors hover:text-orange-400 dark:text-white/25"
        >
          <Star
            className={`size-7 ${n <= value ? "fill-orange-500 text-orange-500" : ""}`}
            aria-hidden="true"
          />
        </button>
      ))}
    </div>
  );
}

export default function TestimonialForm({ serviceOptions }: { serviceOptions: ServiceOption[] }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      await createPublicTestimonial({
        name: String(data.get("name") ?? "").trim(),
        route: String(data.get("route") ?? "").trim(),
        serviceId: (String(data.get("service") ?? "") || null) as string | null,
        text: String(data.get("text") ?? "").trim(),
        rating,
      });
      setStatus("sent");
      form.reset();
      setRating(5);
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Gönderilemedi, lütfen tekrar deneyin.");
    }
  }

  if (!open) {
    return (
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group inline-flex items-center gap-2.5 rounded-2xl border border-navy-950/15 bg-white px-6 py-3.5 text-sm font-bold text-navy-950 shadow-sm transition-all hover:-translate-y-0.5 hover:border-orange-500/40 hover:shadow-lg dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
        >
          <MessageSquarePlus className="size-4.5 text-orange-500" aria-hidden="true" />
          Deneyiminizi Paylaşın
        </button>
      </div>
    );
  }

  if (status === "sent") {
    return (
      <div className="mx-auto max-w-lg rounded-3xl bg-white p-7 text-center shadow-sm ring-1 ring-navy-950/5 dark:bg-white/5 dark:ring-white/10">
        <p className="text-base font-bold text-navy-950 dark:text-white">
          Teşekkürler! Yorumunuz alındı.
        </p>
        <p className="mt-2 text-sm text-muted">
          İnceledikten sonra onaylanan yorumlar sitede yayınlanır.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Yorum bırakma formu"
      className="mx-auto flex max-w-lg flex-col gap-4 rounded-3xl bg-white p-7 shadow-sm ring-1 ring-navy-950/5 dark:bg-white/5 dark:ring-white/10"
    >
      <div className="text-center">
        <p className="text-base font-bold text-navy-950 dark:text-white">Deneyiminizi Paylaşın</p>
        <p className="mt-1 text-xs text-muted">
          Gönderdiğiniz yorum, incelendikten sonra sitede yayınlanır.
        </p>
      </div>

      <div>
        <label htmlFor="yorum-ad" className={labelClass}>
          Ad Soyad
        </label>
        <input id="yorum-ad" name="name" type="text" required maxLength={120} className={inputClass} />
      </div>

      <div>
        <label htmlFor="yorum-rota" className={labelClass}>
          Güzergah / Şehir
        </label>
        <input
          id="yorum-rota"
          name="route"
          type="text"
          required
          maxLength={160}
          placeholder="İstanbul → Ankara"
          className={inputClass}
        />
      </div>

      {serviceOptions.length > 0 && (
        <div>
          <label htmlFor="yorum-hizmet" className={labelClass}>
            Hizmet{" "}
            <span className="font-medium normal-case tracking-normal opacity-60">(isteğe bağlı)</span>
          </label>
          <select id="yorum-hizmet" name="service" className={inputClass}>
            <option value="">— Seçiniz —</option>
            {serviceOptions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className={labelClass}>Puanınız</label>
        <StarPicker value={rating} onChange={setRating} />
      </div>

      <div>
        <label htmlFor="yorum-metin" className={labelClass}>
          Yorumunuz
        </label>
        <textarea
          id="yorum-metin"
          name="text"
          required
          minLength={10}
          maxLength={1000}
          rows={4}
          placeholder="Deneyiminizi bizimle paylaşın..."
          className={`${inputClass} resize-none`}
        />
      </div>

      {status === "error" && errorMessage && (
        <p role="alert" className="rounded-lg bg-red-500/10 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400">
          {errorMessage}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="flex-1 rounded-xl border border-navy-950/15 px-5 py-3 text-sm font-bold text-navy-900 transition-colors hover:bg-navy-950/5 dark:border-white/15 dark:text-white dark:hover:bg-white/10"
        >
          Vazgeç
        </button>
        <button
          type="submit"
          disabled={status === "sending"}
          className="group inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-navy-950 shadow-lg shadow-orange-500/30 transition-all hover:bg-orange-400 disabled:opacity-60"
        >
          {status === "sending" ? "Gönderiliyor..." : "Gönder"}
          <Send className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}
