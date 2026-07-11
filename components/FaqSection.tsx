import { Phone } from "lucide-react";
import Faq from "@/components/Faq";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { TEL_HREF, WHATSAPP_HREF } from "@/lib/site";

export default function FaqSection() {
  return (
    <section id="sss" className="scroll-mt-24 py-20 lg:py-24">
      <div className="container-x grid items-start gap-12 lg:grid-cols-[2fr_3fr]">
        <div className="flex flex-col gap-8 lg:sticky lg:top-28">
          <SectionHeading
            align="left"
            eyebrow="Sık Sorulan Sorular"
            title="Aklınıza Takılanlar"
            description="En çok merak edilen soruları sizin için yanıtladık. Farklı bir sorunuz varsa tek dokunuşla bize ulaşabilirsiniz."
          />
          <Reveal delay={0.1}>
            <div className="glass flex flex-col gap-4 rounded-3xl p-6">
              <p className="text-sm font-semibold text-navy-950 dark:text-white">
                Sorunuz mu var? Saniyeler içinde yanıtlayalım.
              </p>
              <div className="flex flex-col gap-2.5 sm:flex-row">
                <a
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25d366] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#25d366]/25 transition-transform hover:scale-[1.02]"
                >
                  <WhatsAppIcon className="size-4.5" />
                  WhatsApp&apos;tan Yazın
                </a>
                <a
                  href={TEL_HREF}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-navy-950 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-navy-950/25 transition-transform hover:scale-[1.02] dark:bg-white dark:text-navy-950"
                >
                  <Phone className="size-4.5" aria-hidden="true" />
                  Hemen Arayın
                </a>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.08}>
          <Faq />
        </Reveal>
      </div>
    </section>
  );
}
