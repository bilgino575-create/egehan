type LogoProps = {
  /** Lacivert zemin üzerinde (footer vb.) açık renk varyant. */
  onDark?: boolean;
};

export default function Logo({ onDark = false }: LogoProps) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        className={`grid size-10 shrink-0 place-items-center rounded-xl shadow-md ${
          onDark
            ? "bg-white/10 shadow-black/20 ring-1 ring-white/15"
            : "bg-navy-950 shadow-navy-950/25 dark:bg-white/10 dark:ring-1 dark:ring-white/15"
        }`}
      >
        <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
          <rect x="1.5" y="6" width="12.5" height="9" rx="1.6" fill="#ffffff" />
          <path
            d="M14 9h4.2a1 1 0 0 1 .78.37l2.3 2.83a1 1 0 0 1 .22.63V14a1 1 0 0 1-1 1H14V9Z"
            fill="#f97316"
          />
          <circle cx="6.5" cy="16.6" r="1.9" fill="#f97316" />
          <circle cx="6.5" cy="16.6" r="0.7" fill="#ffffff" />
          <circle cx="17.4" cy="16.6" r="1.9" fill="#f97316" />
          <circle cx="17.4" cy="16.6" r="0.7" fill="#ffffff" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`text-lg font-extrabold tracking-tight ${
            onDark ? "text-white" : "text-navy-950 dark:text-white"
          }`}
        >
          Egehan <span className="text-orange-500">Lojistik</span>
        </span>
        <span
          className={`mt-1 text-[9px] font-bold uppercase tracking-[0.22em] ${
            onDark ? "text-white/50" : "text-navy-900/50 dark:text-white/50"
          }`}
        >
          81 İlde Taşımacılık
        </span>
      </span>
    </span>
  );
}
