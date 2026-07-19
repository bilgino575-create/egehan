"use client";

import { useRef, useState, type DragEvent } from "react";
import { UploadCloud } from "lucide-react";
import { useToast } from "@/components/admin/Toast";
import type { Media } from "@/lib/generated/prisma/client";

type MediaWithUsed = Media & { used: boolean };

export default function UploadDropzone({
  onUploaded,
}: {
  onUploaded: (rows: MediaWithUsed[]) => void;
}) {
  const { push } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [folder, setFolder] = useState("genel");
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  async function uploadFiles(files: FileList | File[]) {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      for (const file of fileArray) formData.append("files", file);
      formData.append("folder", folder);

      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error ?? "Yükleme başarısız oldu.");
      }

      const rows = (data.media ?? []) as MediaWithUsed[];
      onUploaded(rows.map((m) => ({ ...m, used: false })));
      push("success", `${rows.length} dosya yüklendi.`);
    } catch (err) {
      push("error", err instanceof Error ? err.message : "Yükleme başarısız oldu.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
  }

  return (
    <div className="glass flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`flex flex-1 items-center gap-3 rounded-xl border-2 border-dashed px-4 py-6 transition-colors ${
          dragActive
            ? "border-orange-500 bg-orange-500/5"
            : "border-navy-950/15 dark:border-white/15"
        }`}
      >
        <UploadCloud className="size-6 shrink-0 text-navy-900/50 dark:text-white/50" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-navy-950 dark:text-white">
            {uploading ? "Yükleniyor..." : "Dosyaları buraya sürükleyin"}
          </p>
          <p className="text-xs text-muted">veya aşağıdaki butona tıklayarak seçin</p>
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="shrink-0 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-navy-950 shadow-md shadow-orange-500/25 transition-colors hover:bg-orange-400 disabled:opacity-60"
        >
          {uploading ? "Yükleniyor..." : "Dosya Seç"}
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => e.target.files && uploadFiles(e.target.files)}
        />
      </div>
      <div className="sm:w-40">
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-navy-900/60 dark:text-white/55">
          Klasör
        </label>
        <input
          value={folder}
          onChange={(e) => setFolder(e.target.value)}
          placeholder="genel"
          className="w-full rounded-xl border border-navy-950/15 bg-white px-3.5 py-2.5 text-sm text-navy-950 outline-none transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/25 dark:border-white/15 dark:bg-white/5 dark:text-white"
        />
      </div>
    </div>
  );
}
