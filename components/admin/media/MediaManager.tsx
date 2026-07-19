"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { File as FileIcon, Trash2 } from "lucide-react";
import type { Media } from "@/lib/generated/prisma/client";
import { deleteMedia, moveMediaFolder, updateMediaAlt } from "@/lib/actions/media";
import { useToast } from "@/components/admin/Toast";
import UploadDropzone from "@/components/admin/media/UploadDropzone";

type MediaWithUsed = Media & { used: boolean };

const inputClass =
  "w-full rounded-lg border border-navy-950/15 bg-white px-2 py-1 text-xs text-navy-950 outline-none transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/25 dark:border-white/15 dark:bg-white/5 dark:text-white";

export default function MediaManager({
  initialMedia,
  folders,
}: {
  initialMedia: MediaWithUsed[];
  folders: string[];
}) {
  const { push } = useToast();
  const [media, setMedia] = useState(initialMedia);
  const [allFolders, setAllFolders] = useState(folders);
  const [folderFilter, setFolderFilter] = useState("");
  const [search, setSearch] = useState("");
  const [onlyUnused, setOnlyUnused] = useState(false);

  function handleUploaded(rows: MediaWithUsed[]) {
    setMedia((prev) => [...rows, ...prev]);
    setAllFolders((prev) => {
      const set = new Set(prev);
      rows.forEach((r) => set.add(r.folder));
      return Array.from(set).sort();
    });
  }

  const filtered = useMemo(() => {
    return media.filter((m) => {
      if (folderFilter && m.folder !== folderFilter) return false;
      if (onlyUnused && m.used) return false;
      if (search && !m.filename.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [media, folderFilter, onlyUnused, search]);

  async function handleDelete(id: string) {
    if (!confirm("Bu dosyayı silmek istediğinize emin misiniz?")) return;
    try {
      await deleteMedia(id);
      setMedia((prev) => prev.filter((m) => m.id !== id));
      push("success", "Dosya silindi.");
    } catch (err) {
      push("error", err instanceof Error ? err.message : "Silinemedi.");
    }
  }

  async function handleAltBlur(id: string, altText: string) {
    try {
      await updateMediaAlt(id, altText);
    } catch (err) {
      push("error", err instanceof Error ? err.message : "Alt metin kaydedilemedi.");
    }
  }

  async function handleFolderChange(id: string, folder: string) {
    try {
      const updated = await moveMediaFolder(id, folder);
      setMedia((prev) => prev.map((m) => (m.id === id ? { ...m, folder: updated.folder } : m)));
      push("success", "Klasör güncellendi.");
    } catch (err) {
      push("error", err instanceof Error ? err.message : "Klasör güncellenemedi.");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <UploadDropzone onUploaded={handleUploaded} />

      <div className="glass flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:gap-4">
        <select
          value={folderFilter}
          onChange={(e) => setFolderFilter(e.target.value)}
          className={`${inputClass} sm:w-44`}
        >
          <option value="">Tümü</option>
          {allFolders.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Dosya adına göre ara..."
          className={`${inputClass} flex-1`}
        />
        <label className="flex shrink-0 items-center gap-2 text-xs font-semibold text-navy-900 dark:text-white">
          <input
            type="checkbox"
            checked={onlyUnused}
            onChange={(e) => setOnlyUnused(e.target.checked)}
            className="size-4 accent-orange-500"
          />
          Yalnızca kullanılmayanlar
        </label>
      </div>

      {filtered.length === 0 ? (
        <p className="glass rounded-2xl p-6 text-center text-sm text-muted">Görsel bulunamadı.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {filtered.map((m) => (
            <div key={m.id} className="glass group flex flex-col gap-2 rounded-2xl p-2">
              <div className="relative aspect-square overflow-hidden rounded-xl bg-navy-950/5 dark:bg-white/5">
                {m.mimeType.startsWith("image/") ? (
                  <Image
                    src={m.url}
                    alt={m.altText ?? m.filename}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <FileIcon className="size-8 text-navy-900/40 dark:text-white/40" aria-hidden="true" />
                  </div>
                )}
                {!m.used && (
                  <span className="absolute left-1.5 top-1.5 rounded-full bg-amber-500/90 px-2 py-0.5 text-[10px] font-bold uppercase text-navy-950 shadow">
                    Kullanılmıyor
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(m.id)}
                  aria-label="Sil"
                  className="absolute right-1.5 top-1.5 grid size-7 place-items-center rounded-lg bg-navy-950/60 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                >
                  <Trash2 className="size-3.5" aria-hidden="true" />
                </button>
              </div>
              <p className="truncate text-[11px] font-semibold text-navy-950 dark:text-white" title={m.filename}>
                {m.filename}
              </p>
              <input
                defaultValue={m.altText ?? ""}
                placeholder="Alt metin"
                onBlur={(e) => handleAltBlur(m.id, e.target.value)}
                className={inputClass}
              />
              <select
                value={m.folder}
                onChange={(e) => handleFolderChange(m.id, e.target.value)}
                className={inputClass}
              >
                {(allFolders.includes(m.folder) ? allFolders : [...allFolders, m.folder]).map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
