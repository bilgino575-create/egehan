"use client";

import { useState, type FormEvent } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type { ProcessStep } from "@/lib/generated/prisma/client";
import { createProcessStep, deleteProcessStep, reorderProcessSteps, updateProcessStep } from "@/lib/actions/process";
import { ICON_MAP } from "@/lib/icon-map";
import { useToast } from "@/components/admin/Toast";
import Modal from "@/components/admin/Modal";
import IconPicker from "@/components/admin/IconPicker";
import SortableList from "@/components/admin/SortableList";

const inputClass =
  "w-full rounded-xl border border-navy-950/15 bg-white px-3.5 py-2.5 text-sm text-navy-950 outline-none transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/25 dark:border-white/15 dark:bg-white/5 dark:text-white";
const labelClass = "mb-1.5 block text-xs font-bold uppercase tracking-wider text-navy-900/60 dark:text-white/55";

interface FormState {
  id?: string;
  icon: string;
  title: string;
  description: string;
  active: boolean;
}

const EMPTY: FormState = {
  icon: "Package",
  title: "",
  description: "",
  active: true,
};

export default function ProcessManager({ initialSteps }: { initialSteps: ProcessStep[] }) {
  const { push } = useToast();
  const [steps, setSteps] = useState(initialSteps);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);

  function openCreate() {
    setForm(EMPTY);
    setModalOpen(true);
  }

  function openEdit(step: ProcessStep) {
    setForm({
      id: step.id,
      icon: step.icon,
      title: step.title,
      description: step.description,
      active: step.active,
    });
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        icon: form.icon,
        title: form.title,
        description: form.description,
        active: form.active,
      };

      if (form.id) {
        const updated = await updateProcessStep(form.id, payload);
        setSteps((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
        push("success", "Adım güncellendi.");
      } else {
        const created = await createProcessStep(payload);
        setSteps((prev) => [...prev, created]);
        push("success", "Adım eklendi.");
      }
      setModalOpen(false);
    } catch (err) {
      push("error", err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu adımı silmek istediğinize emin misiniz?")) return;
    try {
      await deleteProcessStep(id);
      setSteps((prev) => prev.filter((s) => s.id !== id));
      push("success", "Adım silindi.");
    } catch (err) {
      push("error", err instanceof Error ? err.message : "Silinemedi.");
    }
  }

  async function handleReorder(orderedIds: string[]) {
    setSteps((prev) => orderedIds.map((id) => prev.find((s) => s.id === id)!).filter(Boolean));
    try {
      await reorderProcessSteps(orderedIds);
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
          Yeni Adım
        </button>
      </div>

      {steps.length === 0 ? (
        <p className="glass rounded-2xl p-6 text-center text-sm text-muted">Henüz adım eklenmedi.</p>
      ) : (
        <SortableList items={steps} getId={(s) => s.id} onReorder={handleReorder}>
          {(step, handle) => {
            const Icon = ICON_MAP[step.icon] ?? ICON_MAP.Package;
            return (
              <div className="glass flex items-center gap-3 rounded-2xl p-4">
                {handle}
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-navy-950 text-white dark:bg-white/10">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-bold text-navy-950 dark:text-white">{step.title}</p>
                    {!step.active && (
                      <span className="shrink-0 rounded-full bg-navy-950/10 px-2 py-0.5 text-[10px] font-bold uppercase text-navy-900/60 dark:bg-white/10 dark:text-white/50">
                        Pasif
                      </span>
                    )}
                  </div>
                  <p className="truncate text-xs text-muted">{step.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => openEdit(step)}
                  aria-label="Düzenle"
                  className="grid size-9 shrink-0 place-items-center rounded-lg text-navy-900/60 hover:bg-navy-950/5 dark:text-white/60 dark:hover:bg-white/10"
                >
                  <Pencil className="size-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(step.id)}
                  aria-label="Sil"
                  className="grid size-9 shrink-0 place-items-center rounded-lg text-red-500/70 hover:bg-red-500/10 hover:text-red-600"
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </button>
              </div>
            );
          }}
        </SortableList>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={form.id ? "Adımı Düzenle" : "Yeni Adım"}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Başlık</label>
            <input
              required
              className={inputClass}
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
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
          <div>
            <label className={labelClass}>İkon</label>
            <IconPicker value={form.icon} onChange={(icon) => setForm((f) => ({ ...f, icon }))} />
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
