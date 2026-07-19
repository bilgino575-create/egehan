"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

export default function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="glass relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between border-b border-navy-950/10 px-5 py-4 dark:border-white/10">
          <h2 className="text-base font-extrabold text-navy-950 dark:text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="grid size-8 place-items-center rounded-lg text-navy-900/60 hover:bg-navy-950/5 dark:text-white/60 dark:hover:bg-white/10"
          >
            <X className="size-4.5" aria-hidden="true" />
          </button>
        </div>
        <div className="overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}
