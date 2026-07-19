import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { resolveIcon } from "@/lib/icon-map";

export interface ProcessStepData {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export default function Process({ steps }: { steps: ProcessStepData[] }) {
  return (
    <section id="surec" className="scroll-mt-24 py-20 lg:py-24">
      <div className="container-x flex flex-col gap-14">
        <SectionHeading
          eyebrow="Çalışma Sürecimiz"
          title="4 Adımda Sorunsuz Taşınma"
          description="İlk görüşmeden anahtar teslimine kadar her aşama planlı ilerler; siz yalnızca yeni adresinizin keyfini çıkarın."
        />

        <ol className="relative grid gap-12 md:grid-cols-4 md:gap-6">
          {/* Bağlayıcı çizgi */}
          <div
            aria-hidden="true"
            className="absolute left-[12.5%] right-[12.5%] top-8 hidden border-t-2 border-dashed border-navy-200 md:block dark:border-white/10"
          />
          {steps.map((step, i) => {
            const Icon = resolveIcon(step.icon);
            return (
              <li key={step.id}>
                <Reveal
                  delay={i * 0.12}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="relative z-10 grid size-16 place-items-center rounded-2xl bg-white text-orange-500 shadow-lg shadow-navy-950/10 ring-1 ring-navy-950/10 dark:bg-navy-900 dark:ring-white/10">
                    <Icon className="size-8" aria-hidden="true" />
                    <span className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-orange-500 text-xs font-extrabold text-navy-950 shadow-md">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-navy-950 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-[30ch] text-sm leading-relaxed text-muted">
                    {step.description}
                  </p>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
