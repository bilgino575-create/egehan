"use client";

import { useState, type FormEvent } from "react";
import { Pencil, Plus, Star, Trash2 } from "lucide-react";
import type { Testimonial } from "@/lib/generated/prisma/client";
import {
  createTestimonial,
  deleteTestimonial,
  reorderTestimonials,
  updateTestimonial,
} from "@/lib/actions/testimonials";
import { useToast } from "@/components/admin/Toast";
import Modal from "@/components/admin/Modal";
import SortableList from "@/components/admin/SortableList";

const inputClass =
  "w-full rounded-xl border border-navy-950/15 bg-white px-3.5 py-2.5 text-sm text-navy-950 outline-none transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/25 dark:border-white/15 dark:bg-white/5 dark:text-white";
const labelClass = "mb-1.5 block text-xs font-bold uppercase tracking-wider text-navy-900/60 dark:text-white/55";

type TestimonialWithService = Testimonial & { service: { title: string } | null };
type ServiceOption = { id: string; title: string };

interface FormState {
  id?: string;
  name: string;
  route: string;
  serviceId: string;
  text: string;
  rating: number;
  active: boolean;
  homepageVisible: boolean;
}

const EMPTY: FormState = {
  name: "",
  route: "",
  serviceId: "",
  text: "",
  rating: 5,
  active: true,
  homepageVisible: true,
};

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-label={`${n} yıldız`}
          className="rounded-md p-0.5 text-navy-900/30 hover:text-orange-400 dark:text-white/30"
        >
          <Star
            className={`size-5 ${n <= value ? "fill-orange-500 text-orange-500" : ""}`}
            aria-hidden="true"
          />
        </button>
      ))}
    </div>
  );
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`size-3.5 ${n <= rating ? "fill-orange-500 text-orange-500" : "text-navy-900/20 dark:text-white/20"}`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export default function TestimonialsManager({
  initialTestimonials,
  services,
}: {
  initialTestimonials: TestimonialWithService[];
  services: ServiceOption[];
}) {
  const { push } = useToast();
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);

  function openCreate() {
    setForm(EMPTY);
    setModalOpen(true);
  }

  function openEdit(testimonial: TestimonialWithService) {
    setForm({
      id: testimonial.id,
      name: testimonial.name,
      route: testimonial.route,
      serviceId: testimonial.serviceId ?? "",
      text: testimonial.text,
      rating: testimonial.rating,
      active: testimonial.active,
      homepageVisible: testimonial.homepageVisible,
    });
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        route: form.route,
        serviceId: form.serviceId || null,
        text: form.text,
        rating: form.rating,
        photoMediaId: null,
        active: form.active,
        homepageVisible: form.homepageVisible,
      };

      if (form.id) {
        const updated = await updateTestimonial(form.id, payload);
        const serviceTitle = services.find((s) => s.id === updated.serviceId)?.title ?? null;
        setTestimonials((prev) =>
          prev.map((t) => (t.id === updated.id ? { ...updated, service: serviceTitle ? { title: serviceTitle } : null } : t))
        );
        push("success", "Yorum güncellendi.");
      } else {
        const created = await createTestimonial(payload);
        const serviceTitle = services.find((s) => s.id === created.serviceId)?.title ?? null;
        setTestimonials((prev) => [...prev, { ...created, service: serviceTitle ? { title: serviceTitle } : null }]);
        push("success", "Yorum eklendi.");
      }
      setModalOpen(false);
    } catch (err) {
      push("error", err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu yorumu silmek istediğinize emin misiniz?")) return;
    try {
      await deleteTestimonial(id);
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      push("success", "Yorum silindi.");
    } catch (err) {
      push("error", err instanceof Error ? err.message : "Silinemedi.");
    }
  }

  async function handleReorder(orderedIds: string[]) {
    setTestimonials((prev) => orderedIds.map((id) => prev.find((t) => t.id === id)!).filter(Boolean));
    try {
      await reorderTestimonials(orderedIds);
    } catch {
      push("error", "Sıralama kaydedilemedi.");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-navy-950 shadow-md shadow-orange-500/25 transition-colors hover:bg-orange-400"
        >
          <Plus className="size-4.5" aria-hidden="true" />
          Yeni Yorum
        </button>
      </div>

      {testimonials.length === 0 ? (
        <p className="glass rounded-2xl p-6 text-center text-sm text-muted">Henüz yorum eklenmedi.</p>
      ) : (
        <SortableList items={testimonials} getId={(t) => t.id} onReorder={handleReorder}>
          {(testimonial, handle) => (
            <div className="glass flex items-center gap-3 rounded-2xl p-4">
              {handle}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-sm font-bold text-navy-950 dark:text-white">{testimonial.name}</p>
                  <StarDisplay rating={testimonial.rating} />
                  {!testimonial.active && (
                    <span className="shrink-0 rounded-full bg-navy-950/10 px-2 py-0.5 text-[10px] font-bold uppercase text-navy-900/60 dark:bg-white/10 dark:text-white/50">
                      Pasif
                    </span>
                  )}
                  {!testimonial.homepageVisible && (
                    <span className="shrink-0 rounded-full bg-navy-950/10 px-2 py-0.5 text-[10px] font-bold uppercase text-navy-900/60 dark:bg-white/10 dark:text-white/50">
                      Ana sayfada gizli
                    </span>
                  )}
                </div>
                <p className="truncate text-xs text-muted">
                  {testimonial.route}
                  {testimonial.service && ` · ${testimonial.service.title}`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => openEdit(testimonial)}
                aria-label="Düzenle"
                className="grid size-9 shrink-0 place-items-center rounded-lg text-navy-900/60 hover:bg-navy-950/5 dark:text-white/60 dark:hover:bg-white/10"
              >
                <Pencil className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(testimonial.id)}
                aria-label="Sil"
                className="grid size-9 shrink-0 place-items-center rounded-lg text-red-500/70 hover:bg-red-500/10 hover:text-red-600"
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </SortableList>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={form.id ? "Yorumu Düzenle" : "Yeni Yorum"}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Ad Soyad</label>
            <input
              required
              className={inputClass}
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelClass}>Güzergah</label>
            <input
              required
              placeholder="İstanbul → Ankara"
              className={inputClass}
              value={form.route}
              onChange={(e) => setForm((f) => ({ ...f, route: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelClass}>Hizmet</label>
            <select
              className={inputClass}
              value={form.serviceId}
              onChange={(e) => setForm((f) => ({ ...f, serviceId: e.target.value }))}
            >
              <option value="">— Hizmet seçilmedi —</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Yorum Metni</label>
            <textarea
              required
              rows={3}
              className={`${inputClass} resize-none`}
              value={form.text}
              onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelClass}>Puan</label>
            <StarPicker value={form.rating} onChange={(rating) => setForm((f) => ({ ...f, rating }))} />
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-navy-900 dark:text-white">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                className="size-4 accent-orange-500"
              />
              Aktif
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold text-navy-900 dark:text-white">
              <input
                type="checkbox"
                checked={form.homepageVisible}
                onChange={(e) => setForm((f) => ({ ...f, homepageVisible: e.target.checked }))}
                className="size-4 accent-orange-500"
              />
              Ana sayfada göster
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
      </Modal>
    </div>
  );
}
