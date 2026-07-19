"use client";

import { ICON_MAP, ICON_NAMES } from "@/lib/icon-map";

export default function IconPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (name: string) => void;
}) {
  return (
    <div className="grid grid-cols-6 gap-2 rounded-xl border border-navy-950/15 bg-white p-2.5 dark:border-white/15 dark:bg-white/5 sm:grid-cols-8">
      {ICON_NAMES.map((name) => {
        const Icon = ICON_MAP[name];
        const active = value === name;
        return (
          <button
            key={name}
            type="button"
            title={name}
            onClick={() => onChange(name)}
            className={`grid aspect-square place-items-center rounded-lg transition-colors ${
              active
                ? "bg-orange-500 text-navy-950"
                : "text-navy-900/60 hover:bg-navy-950/5 dark:text-white/60 dark:hover:bg-white/10"
            }`}
          >
            <Icon className="size-4.5" aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}
