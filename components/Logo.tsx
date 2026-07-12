import Image from "next/image";

type LogoProps = {
  /** Lacivert zemin üzerinde (footer vb.) açık renk varyant. */
  onDark?: boolean;
};

export default function Logo({ onDark = false }: LogoProps) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        className={`grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl shadow-md ${
          onDark
            ? "bg-white/10 shadow-black/20 ring-1 ring-white/15"
            : "bg-white shadow-navy-950/15 dark:bg-white/10 dark:ring-1 dark:ring-white/15"
        }`}
      >
        <Image
          src="/logo.png"
          alt="Egehan Lojistik logo"
          width={44}
          height={44}
          className="h-full w-full object-contain"
        />
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
