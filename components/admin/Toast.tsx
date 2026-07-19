"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";

type ToastKind = "success" | "error" | "warning" | "info";

interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
}

interface ToastContextValue {
  push: (kind: ToastKind, message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const KIND_STYLES: Record<ToastKind, { icon: typeof CheckCircle2; className: string }> = {
  success: { icon: CheckCircle2, className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  error: { icon: XCircle, className: "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400" },
  warning: { icon: AlertTriangle, className: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  info: { icon: Info, className: "border-navy-500/30 bg-navy-500/10 text-navy-700 dark:text-navy-200" },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const push = useCallback((kind: ToastKind, message: string) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, kind, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismiss = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-100 flex flex-col items-center gap-2 px-4 sm:items-end sm:right-4 sm:left-auto">
        {toasts.map((t) => {
          const { icon: Icon, className } = KIND_STYLES[t.kind];
          return (
            <div
              key={t.id}
              role="status"
              className={`glass pointer-events-auto flex w-full max-w-sm items-start gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg ${className}`}
            >
              <Icon className="mt-0.5 size-4.5 shrink-0" aria-hidden="true" />
              <p className="flex-1 text-navy-950 dark:text-white">{t.message}</p>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Kapat"
                className="text-navy-950/50 hover:text-navy-950 dark:text-white/50 dark:hover:text-white"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast, ToastProvider içinde kullanılmalı.");
  return ctx;
}
