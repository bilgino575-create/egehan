"use client";

import { useState, type FormEvent } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type { NavItem } from "@/lib/generated/prisma/client";
import { createNavItem, deleteNavItem, reorderNavItems, updateNavItem } from "@/lib/actions/nav";
import { useToast } from "@/components/admin/Toast";
import Modal from "@/components/admin/Modal";
import SortableList from "@/components/admin/SortableList";

const inputClass =
  "w-full rounded-xl border border-navy-950/15 bg-white px-3.5 py-2.5 text-sm text-navy-950 outline-none transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/25 dark:border-white/15 dark:bg-white/5 dark:text-white";
const labelClass = "mb-1.5 block text-xs font-bold uppercase tracking-wider text-navy-900/60 dark:text-white/55";

interface FormState {
  id?: string;
  label: string;
  href: string;
  visible: boolean;
}

const EMPTY: FormState = {
  label: "",
  href: "",
  visible: true,
};

export default function NavManager({ initialItems }: { initialItems: NavItem[] }) {
  const { push } = useToast();
  const [items, setItems] = useState(initialItems);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);

  function openCreate() {
    setForm(EMPTY);
    setModalOpen(true);
  }

  function openEdit(item: NavItem) {
    setForm({
      id: item.id,
      label: item.label,
      href: item.href,
      visible: item.visible,
    });
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        label: form.label,
        href: form.href,
        visible: form.visible,
      };

      if (form.id) {
        const updated = await updateNavItem(form.id, payload);
        setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
        push("success", "Menü öğesi güncellendi.");
      } else {
        const created = await createNavItem(payload);
        setItems((prev) => [...prev, created]);
        push("success", "Menü öğesi eklendi.");
      }
      setModalOpen(false);
    } catch (err) {
      push("error", err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu menü öğesini silmek istediğinize emin misiniz?")) return;
    try {
      await deleteNavItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      push("success", "Menü öğesi silindi.");
    } catch (err) {
      push("error", err instanceof Error ? err.message : "Silinemedi.");
    }
  }

  async function handleReorder(orderedIds: string[]) {
    setItems((prev) => orderedIds.map((id) => prev.find((i) => i.id === id)!).filter(Boolean));
    try {
      await reorderNavItems(orderedIds);
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
          Yeni Menü Öğesi
        </button>
      </div>

      {items.length === 0 ? (
        <p className="glass rounded-2xl p-6 text-center text-sm text-muted">Henüz menü öğesi eklenmedi.</p>
      ) : (
        <SortableList items={items} getId={(i) => i.id} onReorder={handleReorder}>
          {(item, handle) => (
            <div className="glass flex items-center gap-3 rounded-2xl p-4">
              {handle}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-bold text-navy-950 dark:text-white">{item.label}</p>
                  {!item.visible && (
                    <span className="shrink-0 rounded-full bg-navy-950/10 px-2 py-0.5 text-[10px] font-bold uppercase text-navy-900/60 dark:bg-white/10 dark:text-white/50">
                      Gizli
                    </span>
                  )}
                </div>
                <p className="truncate text-xs text-muted">{item.href}</p>
              </div>
              <button
                type="button"
                onClick={() => openEdit(item)}
                aria-label="Düzenle"
                className="grid size-9 shrink-0 place-items-center rounded-lg text-navy-900/60 hover:bg-navy-950/5 dark:text-white/60 dark:hover:bg-white/10"
              >
                <Pencil className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                aria-label="Sil"
                className="grid size-9 shrink-0 place-items-center rounded-lg text-red-500/70 hover:bg-red-500/10 hover:text-red-600"
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </SortableList>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={form.id ? "Menü Öğesini Düzenle" : "Yeni Menü Öğesi"}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Etiket</label>
            <input
              required
              className={inputClass}
              value={form.label}
              onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelClass}>Bağlantı (href)</label>
            <input
              required
              className={inputClass}
              placeholder="/hizmetler"
              value={form.href}
              onChange={(e) => setForm((f) => ({ ...f, href: e.target.value }))}
            />
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-navy-900 dark:text-white">
              <input
                type="checkbox"
                checked={form.visible}
                onChange={(e) => setForm((f) => ({ ...f, visible: e.target.checked }))}
                className="size-4 accent-orange-500"
              />
              Görünür (menüde göster)
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
