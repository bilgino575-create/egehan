import { ArrowRight, Check } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { resolveIcon } from "@/lib/icon-map";

export interface ServiceData {
  id: string;
  icon: string;
  title: string;
  description: string;
  features: string[];
  popular: boolean;
}

export default function Services({ services }: { services: ServiceData[] }) {
  return (
    <section id="hizmetler" className="scroll-mt-24 py-20 lg:py-24">
      <div className="container-x flex flex-col gap-12">
        <SectionHeading
          eyebrow="Hizmetlerimiz"
          title="Size Uygun Taşıma Çözümü"
          description="İhtiyacınız ne olursa olsun; küçük bir koliden komple bir ofise kadar her taşıma işini aynı özenle planlıyor ve uyguluyoruz."
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service, i) => {
            const Icon = resolveIcon(service.icon);
            return (
            <Reveal key={service.id} delay={i * 0.08} className="h-full">
              <article className="group relative flex h-full flex-col rounded-3xl border border-navy-950/10 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-navy-950/10 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/[0.08]">
                {service.popular && (
                  <span className="absolute -top-3 right-6 rounded-full bg-orange-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-navy-950 shadow-md shadow-orange-500/30">
                    En Çok Tercih Edilen
                  </span>
                )}
                <div className="mb-5 grid size-14 place-items-center rounded-2xl bg-navy-950 text-white transition-colors duration-300 group-hover:bg-orange-500 group-hover:text-navy-950 dark:bg-white/10 dark:group-hover:bg-orange-500">
                  <Icon className="size-7" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-navy-950 dark:text-white">
                  {service.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted">
                  {service.description}
                </p>
                <ul className="mt-5 space-y-2.5">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2.5 text-sm font-medium text-navy-900/80 dark:text-navy-100/80"
                    >
                      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-orange-500/12 text-orange-600 dark:text-orange-400">
                        <Check className="size-3" aria-hidden="true" strokeWidth={3} />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href="#iletisim"
                  className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-bold text-orange-600 transition-colors hover:text-orange-500 dark:text-orange-400"
                >
                  Teklif Alın
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </a>
              </article>
            </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
