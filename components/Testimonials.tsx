import { MapPin, Star } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { TESTIMONIALS } from "@/lib/content";

function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toLocaleUpperCase("tr-TR");
}

export default function Testimonials() {
  return (
    <section
      id="yorumlar"
      className="scroll-mt-24 bg-navy-50/70 py-20 lg:py-24 dark:bg-white/[0.03]"
    >
      <div className="container-x flex flex-col gap-12">
        <SectionHeading
          eyebrow="Müşteri Yorumları"
          title="Bize Güvenenler Ne Diyor?"
          description="Türkiye'nin dört bir yanına taşıdığımız müşterilerimizin gerçek deneyimleri."
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={(i % 3) * 0.08} className="h-full">
              <figure className="flex h-full flex-col rounded-3xl bg-white p-7 shadow-sm ring-1 ring-navy-950/5 transition-shadow duration-300 hover:shadow-lg hover:shadow-navy-950/8 dark:bg-white/5 dark:ring-white/10">
                <div
                  className="flex items-center gap-1"
                  role="img"
                  aria-label="5 üzerinden 5 yıldız"
                >
                  {Array.from({ length: 5 }).map((_, star) => (
                    <Star
                      key={star}
                      className="size-4 fill-orange-400 text-orange-400"
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-navy-900/85 dark:text-navy-100/85">
                  &ldquo;{t.text}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="grid size-11 shrink-0 place-items-center rounded-full bg-navy-950 text-sm font-extrabold text-white dark:bg-orange-500 dark:text-navy-950"
                  >
                    {initials(t.name)}
                  </span>
                  <div>
                    <div className="text-sm font-bold text-navy-950 dark:text-white">
                      {t.name}
                    </div>
                    <div className="mt-0.5 flex items-center gap-1 text-xs text-muted">
                      <MapPin className="size-3 shrink-0" aria-hidden="true" />
                      {t.route} • {t.service}
                    </div>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
