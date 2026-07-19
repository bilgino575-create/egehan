"use client";

import { useState, type FormEvent } from "react";
import { KeyRound, Pencil, Plus } from "lucide-react";
import type { Role, User } from "@/lib/generated/prisma/client";
import { createUser, resetUserPassword, updateUser } from "@/lib/actions/users";
import { useToast } from "@/components/admin/Toast";
import Modal from "@/components/admin/Modal";

const inputClass =
  "w-full rounded-xl border border-navy-950/15 bg-white px-3.5 py-2.5 text-sm text-navy-950 outline-none transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/25 dark:border-white/15 dark:bg-white/5 dark:text-white";
const labelClass = "mb-1.5 block text-xs font-bold uppercase tracking-wider text-navy-900/60 dark:text-white/55";

const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Yönetici",
  EDITOR: "Editör",
  SEO: "SEO Uzmanı",
  CONTENT_EDITOR: "İçerik Editörü",
  SUPPORT: "Destek",
};

const ROLE_OPTIONS = Object.keys(ROLE_LABELS) as Role[];

type UserRow = Pick<User, "id" | "name" | "email" | "role" | "active" | "lastLoginAt" | "createdAt">;

interface CreateFormState {
  name: string;
  email: string;
  password: string;
  role: Role;
}

const EMPTY_CREATE: CreateFormState = { name: "", email: "", password: "", role: "EDITOR" };

interface EditFormState {
  id: string;
  name: string;
  role: Role;
  active: boolean;
}

export default function UsersManager({ initialUsers }: { initialUsers: UserRow[] }) {
  const { push } = useToast();
  const [users, setUsers] = useState(initialUsers);

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CreateFormState>(EMPTY_CREATE);
  const [creating, setCreating] = useState(false);

  const [editForm, setEditForm] = useState<EditFormState | null>(null);
  const [editing, setEditing] = useState(false);

  const [resetTarget, setResetTarget] = useState<UserRow | null>(null);
  const [resetPassword, setResetPassword] = useState("");
  const [resetConfirm, setResetConfirm] = useState("");
  const [resetting, setResetting] = useState(false);

  function openCreate() {
    setCreateForm(EMPTY_CREATE);
    setCreateOpen(true);
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    if (createForm.password.length < 8) {
      push("error", "Şifre en az 8 karakter olmalı.");
      return;
    }
    setCreating(true);
    try {
      const created = await createUser(createForm);
      setUsers((prev) => [
        { ...created, active: true, lastLoginAt: null, createdAt: new Date() },
        ...prev,
      ]);
      push("success", "Kullanıcı oluşturuldu.");
      setCreateOpen(false);
    } catch (err) {
      push("error", err instanceof Error ? err.message : "Kullanıcı oluşturulamadı.");
    } finally {
      setCreating(false);
    }
  }

  function openEdit(user: UserRow) {
    setEditForm({ id: user.id, name: user.name, role: user.role, active: user.active });
  }

  async function handleEdit(e: FormEvent) {
    e.preventDefault();
    if (!editForm) return;
    setEditing(true);
    try {
      const updated = await updateUser(editForm.id, {
        name: editForm.name,
        role: editForm.role,
        active: editForm.active,
      });
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? { ...u, ...updated } : u)));
      push("success", "Kullanıcı güncellendi.");
      setEditForm(null);
    } catch (err) {
      push("error", err instanceof Error ? err.message : "Güncellenemedi.");
    } finally {
      setEditing(false);
    }
  }

  async function handleResetPassword(e: FormEvent) {
    e.preventDefault();
    if (!resetTarget) return;
    if (resetPassword.length < 8) {
      push("error", "Şifre en az 8 karakter olmalı.");
      return;
    }
    if (resetPassword !== resetConfirm) {
      push("error", "Şifreler eşleşmiyor.");
      return;
    }
    setResetting(true);
    try {
      await resetUserPassword(resetTarget.id, resetPassword);
      push("success", "Şifre sıfırlandı.");
      setResetTarget(null);
      setResetPassword("");
      setResetConfirm("");
    } catch (err) {
      push("error", err instanceof Error ? err.message : "Şifre sıfırlanamadı.");
    } finally {
      setResetting(false);
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
          Yeni Kullanıcı
        </button>
      </div>

      {users.length === 0 ? (
        <p className="glass rounded-2xl p-6 text-center text-sm text-muted">Henüz kullanıcı eklenmedi.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {users.map((user) => (
            <div key={user.id} className="glass flex flex-wrap items-center gap-3 rounded-2xl p-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-navy-950 text-xs font-extrabold text-white dark:bg-white/10">
                {user.name.slice(0, 1).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-sm font-bold text-navy-950 dark:text-white">{user.name}</p>
                  <span className="shrink-0 rounded-full bg-navy-950/10 px-2 py-0.5 text-[10px] font-bold uppercase text-navy-900/60 dark:bg-white/10 dark:text-white/50">
                    {ROLE_LABELS[user.role]}
                  </span>
                  {user.active ? (
                    <span className="shrink-0 rounded-full bg-emerald-500/12 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
                      Aktif
                    </span>
                  ) : (
                    <span className="shrink-0 rounded-full bg-red-500/12 px-2 py-0.5 text-[10px] font-bold uppercase text-red-600 dark:text-red-400">
                      Pasif
                    </span>
                  )}
                </div>
                <p className="truncate text-xs text-muted">{user.email}</p>
                <p className="truncate text-[11px] text-muted">
                  Son giriş: {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString("tr-TR") : "Hiç giriş yapmadı"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => openEdit(user)}
                aria-label="Düzenle"
                className="grid size-9 shrink-0 place-items-center rounded-lg text-navy-900/60 hover:bg-navy-950/5 dark:text-white/60 dark:hover:bg-white/10"
              >
                <Pencil className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setResetTarget(user);
                  setResetPassword("");
                  setResetConfirm("");
                }}
                aria-label="Şifre sıfırla"
                title="Şifre sıfırla"
                className="grid size-9 shrink-0 place-items-center rounded-lg text-navy-900/60 hover:bg-navy-950/5 dark:text-white/60 dark:hover:bg-white/10"
              >
                <KeyRound className="size-4" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Yeni kullanıcı */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Yeni Kullanıcı">
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Ad Soyad</label>
            <input
              required
              className={inputClass}
              value={createForm.name}
              onChange={(e) => setCreateForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelClass}>E-posta</label>
            <input
              required
              type="email"
              className={inputClass}
              value={createForm.email}
              onChange={(e) => setCreateForm((f) => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelClass}>Şifre (en az 8 karakter)</label>
            <input
              required
              type="password"
              minLength={8}
              className={inputClass}
              value={createForm.password}
              onChange={(e) => setCreateForm((f) => ({ ...f, password: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelClass}>Rol</label>
            <select
              className={inputClass}
              value={createForm.role}
              onChange={(e) => setCreateForm((f) => ({ ...f, role: e.target.value as Role }))}
            >
              {ROLE_OPTIONS.map((role) => (
                <option key={role} value={role}>
                  {ROLE_LABELS[role]}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={creating}
            className="mt-1 inline-flex items-center justify-center rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-navy-950 shadow-lg shadow-orange-500/30 transition-all hover:bg-orange-400 disabled:opacity-60"
          >
            {creating ? "Oluşturuluyor..." : "Oluştur"}
          </button>
        </form>
      </Modal>

      {/* Düzenle */}
      <Modal open={editForm !== null} onClose={() => setEditForm(null)} title="Kullanıcıyı Düzenle">
        {editForm && (
          <form onSubmit={handleEdit} className="flex flex-col gap-4">
            <div>
              <label className={labelClass}>Ad Soyad</label>
              <input
                required
                className={inputClass}
                value={editForm.name}
                onChange={(e) => setEditForm((f) => (f ? { ...f, name: e.target.value } : f))}
              />
            </div>
            <div>
              <label className={labelClass}>Rol</label>
              <select
                className={inputClass}
                value={editForm.role}
                onChange={(e) => setEditForm((f) => (f ? { ...f, role: e.target.value as Role } : f))}
              >
                {ROLE_OPTIONS.map((role) => (
                  <option key={role} value={role}>
                    {ROLE_LABELS[role]}
                  </option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm font-semibold text-navy-900 dark:text-white">
              <input
                type="checkbox"
                checked={editForm.active}
                onChange={(e) => setEditForm((f) => (f ? { ...f, active: e.target.checked } : f))}
                className="size-4 accent-orange-500"
              />
              Aktif
            </label>
            <button
              type="submit"
              disabled={editing}
              className="mt-1 inline-flex items-center justify-center rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-navy-950 shadow-lg shadow-orange-500/30 transition-all hover:bg-orange-400 disabled:opacity-60"
            >
              {editing ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </form>
        )}
      </Modal>

      {/* Şifre sıfırla */}
      <Modal open={resetTarget !== null} onClose={() => setResetTarget(null)} title="Şifre Sıfırla">
        {resetTarget && (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            <p className="text-sm text-muted">
              <strong className="text-navy-950 dark:text-white">{resetTarget.name}</strong> için yeni şifre belirleyin.
            </p>
            <div>
              <label className={labelClass}>Yeni Şifre (en az 8 karakter)</label>
              <input
                required
                type="password"
                minLength={8}
                className={inputClass}
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Yeni Şifre (tekrar)</label>
              <input
                required
                type="password"
                minLength={8}
                className={inputClass}
                value={resetConfirm}
                onChange={(e) => setResetConfirm(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={resetting}
              className="mt-1 inline-flex items-center justify-center rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-navy-950 shadow-lg shadow-orange-500/30 transition-all hover:bg-orange-400 disabled:opacity-60"
            >
              {resetting ? "Kaydediliyor..." : "Şifreyi Sıfırla"}
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
}
