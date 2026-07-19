import type { LucideIcon } from "lucide-react";

export default function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  accent = "orange",
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
  accent?: "orange" | "navy" | "emerald" | "red";
}) {
  const accentClass = {
    orange: "bg-orange-500/12 text-orange-600 dark:text-orange-400",
    navy: "bg-navy-500/12 text-navy-700 dark:text-navy-200",
    emerald: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400",
    red: "bg-red-500/12 text-red-600 dark:text-red-400",
  }[accent];

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <span className={`grid size-10 place-items-center rounded-xl ${accentClass}`}>
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-4 text-2xl font-extrabold tracking-tight text-navy-950 dark:text-white">
        {value}
      </p>
      <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}
