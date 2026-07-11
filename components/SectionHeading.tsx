import type { ReactNode } from "react";
import Reveal from "@/components/Reveal";

type SectionHeadingProps = {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  /** Lacivert zeminli bölümlerde açık renk tipografi kullanılır. */
  onDark?: boolean;
  align?: "center" | "left";
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  onDark = false,
  align = "center",
}: SectionHeadingProps) {
  const alignment =
    align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <Reveal className={`flex flex-col gap-4 ${alignment}`}>
      <span
        className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] ${
          onDark
            ? "border-white/15 bg-white/5 text-orange-400"
            : "border-orange-500/25 bg-orange-500/5 text-orange-600 dark:border-orange-400/25 dark:bg-orange-400/10 dark:text-orange-400"
        }`}
      >
        <span className="size-1.5 rounded-full bg-orange-500" aria-hidden="true" />
        {eyebrow}
      </span>
      <h2
        className={`max-w-2xl text-balance text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[2.6rem] lg:leading-[1.15] ${
          onDark ? "text-white" : "text-navy-950 dark:text-white"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`max-w-2xl text-pretty text-base leading-relaxed ${
            onDark ? "text-white/60" : "text-muted"
          }`}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
