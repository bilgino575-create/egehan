"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQS } from "@/lib/content";

/** Erişilebilir akordeon; yükseklik animasyonu CSS grid ile yapılır. */
export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="flex flex-col gap-3">
      {FAQS.map((faq, i) => {
        const open = openIndex === i;
        return (
          <div
            key={faq.question}
            className={`rounded-2xl border transition-colors duration-300 ${
              open
                ? "border-orange-500/40 bg-orange-500/[0.04] dark:border-orange-400/30 dark:bg-orange-400/[0.06]"
                : "border-navy-950/10 bg-white dark:border-white/10 dark:bg-white/[0.03]"
            }`}
          >
            <h3>
              <button
                type="button"
                id={`sss-baslik-${i}`}
                aria-expanded={open}
                aria-controls={`sss-panel-${i}`}
                onClick={() => setOpenIndex(open ? null : i)}
                className="flex w-full items-center justify-between gap-4 rounded-2xl px-5 py-4 text-left sm:px-6 sm:py-5"
              >
                <span className="font-bold text-navy-950 dark:text-white">
                  {faq.question}
                </span>
                <span
                  className={`grid size-8 shrink-0 place-items-center rounded-full transition-all duration-300 ${
                    open
                      ? "rotate-180 bg-orange-500 text-navy-950"
                      : "bg-navy-950/5 text-navy-900 dark:bg-white/10 dark:text-white"
                  }`}
                >
                  <ChevronDown className="size-4" aria-hidden="true" />
                </span>
              </button>
            </h3>
            <div
              id={`sss-panel-${i}`}
              role="region"
              aria-labelledby={`sss-baslik-${i}`}
              className="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-sm leading-relaxed text-muted sm:px-6">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
