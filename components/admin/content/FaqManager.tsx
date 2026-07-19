"use client";

import { useState, type FormEvent } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type { Faq } from "@/lib/generated/prisma/client";
import { createFaq, deleteFaq, reorderFaqs, updateFaq } from "@/lib/actions/faq";
import { useToast } from "@/components/admin/Toast";
import Modal from "@/components/admin/Modal";
import SortableList from "@/components/admin/SortableList";

const inputClass =
  "w-full rounded-xl border border-navy-950/15 bg-white px-3.5 py-2.5 text-sm text-navy-950 outline-none transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/25 dark:border-white/15 dark:bg-white/5 dark:text-white";
const labelClass = "mb-1.5 block text-xs font-bold uppercase tracking-wider text-navy-900/60 dark:text-white/55";

interface FormState {
  id?: string;
  question: string;
  answer: string;
  category: string;
  active: boolean;
}

const EMPTY: FormState = {
  question: "",
  answer: "",
  category: "",
  active: true,
};

export default function FaqManager({ initialFaqs }: { initialFaqs: Faq[] }) {
  const { push } = useToast();
  const [faqs, setFaqs] = useState(initialFaqs);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);

  function openCreate() {
    setForm(EMPTY);
    setModalOpen(true);
  }

  function openEdit(faq: Faq) {
    setForm({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      category: faq.category ?? "",
      active: faq.active,
    });
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        question: form.question,
        answer: form.answer,
        category: form.category.trim() ? form.category.trim() : null,
        active: form.active,
      };

      if (form.id) {
        const updated = await updateFaq(form.id, payload);
        setFaqs((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
        push("success", "Soru güncellendi.");
      } else {
        const created = await createFaq(payload);
        setFaqs((prev) => [...prev, created]);
        push("success", "Soru eklendi.");
      }
      setModalOpen(false);
    } catch (err) {
      push("error", err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu soruyu silmek istediğinize emin misiniz?")) return;
    try {
      await deleteFaq(id);
      setFaqs((prev) => prev.filter((f) => f.id !== id));
      push("success", "Soru silindi.");
    } catch (err) {
      push("error", err instanceof Error ? err.message : "Silinemedi.");
    }
  }

  async function handleReorder(orderedIds: string[]) {
    setFaqs((prev) => orderedIds.map((id) => prev.find((f) => f.id === id)!).filter(Boolean));
    try {
      await reorderFaqs(orderedIds);
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
          Yeni Soru
        </button>
      </div>

      {faqs.length === 0 ? (
        <p className="glass rounded-2xl p-6 text-center text-sm text-muted">Henüz soru eklenmedi.</p>
      ) : (
        <SortableList items={faqs} getId={(f) => f.id} onReorder={handleReorder}>
          {(faq, handle) => (
            <div className="glass flex items-center gap-3 rounded-2xl p-4">
              {handle}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-bold text-navy-950 dark:text-white">{faq.question}</p>
                  {faq.category && (
                    <span className="shrink-0 rounded-full bg-orange-500/15 px-2 py-0.5 text-[10px] font-bold uppercase text-orange-600 dark:text-orange-400">
                      {faq.category}
                    </span>
                  )}
                  {!faq.active && (
                    <span className="shrink-0 rounded-full bg-navy-950/10 px-2 py-0.5 text-[10px] font-bold uppercase text-navy-900/60 dark:bg-white/10 dark:text-white/50">
                      Pasif
                    </span>
                  )}
                </div>
                <p className="truncate text-xs text-muted">{faq.answer}</p>
              </div>
              <button
                type="button"
                onClick={() => openEdit(faq)}
                aria-label="Düzenle"
                className="grid size-9 shrink-0 place-items-center rounded-lg text-navy-900/60 hover:bg-navy-950/5 dark:text-white/60 dark:hover:bg-white/10"
              >
                <Pencil className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(faq.id)}
                aria-label="Sil"
                className="grid size-9 shrink-0 place-items-center rounded-lg text-red-500/70 hover:bg-red-500/10 hover:text-red-600"
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </SortableList>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={form.id ? "Soruyu Düzenle" : "Yeni Soru"}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Soru</label>
            <input
              required
              className={inputClass}
              value={form.question}
              onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelClass}>Cevap</label>
            <textarea
              required
              rows={4}
              className={`${inputClass} resize-none`}
              value={form.answer}
              onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelClass}>Kategori (opsiyonel)</label>
            <input
              className={inputClass}
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            />
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-navy-900 dark:text-white">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                className="size-4 accent-orange-500"
              />
              Aktif (sitede göster)
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
