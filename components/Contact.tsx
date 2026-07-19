import { Clock3, MapPin, Phone } from "lucide-react";
import QuoteForm from "@/components/QuoteForm";
import Reveal from "@/components/Reveal";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { telHref, whatsappHref } from "@/lib/site";

export default function Contact({
  phoneE164,
  workingHours,
  serviceOptions,
}: {
  phoneE164: string;
  workingHours: string;
  serviceOptions: string[];
}) {
  const infoItems = [
    {
      icon: MapPin,
      title: "Hizmet Bölgesi",
      text: "Türkiye geneli — 81 ilin tamamına kapıdan kapıya nakliye",
    },
    {
      icon: Clock3,
      title: "Çalışma Saatleri",
      text: workingHours,
    },
  ];
  return (
    <section id="iletisim" className="scroll-mt-24 pb-20 lg:pb-24">
      <div className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-navy-950 px-6 py-12 sm:px-10 lg:px-14 lg:py-16 dark:bg-deep-900">
            {/* Dekor */}
            <div
              aria-hidden="true"
              className="absolute -right-24 -top-24 size-[360px] rounded-full bg-orange-500/20 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-32 -left-16 size-[320px] rounded-full bg-navy-600/40 blur-3xl"
            />

            <div className="relative grid items-center gap-12 lg:grid-cols-2">
              <div className="flex flex-col items-start gap-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-orange-400">
                  <span className="size-1.5 rounded-full bg-orange-500" aria-hidden="true" />
                  İletişim
                </span>
                <h2 className="text-balance text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Ücretsiz Keşif ve{" "}
                  <span className="text-orange-400">Net Teklif</span> Alın
                </h2>
                <p className="text-pretty leading-relaxed text-white/65">
                  Formu doldurun; bilgileriniz WhatsApp mesajı olarak hazırlansın,
                  size en kısa sürede dönüş yapalım. Dilerseniz tek dokunuşla
                  bizi arayın.
                </p>

                <div className="flex w-full flex-col gap-3 sm:flex-row">
                  <a
                    href={telHref(phoneE164)}
                    className="inline-flex flex-1 items-center justify-center gap-2.5 rounded-2xl bg-orange-500 px-6 py-4 text-base font-bold text-navy-950 shadow-xl shadow-orange-500/25 transition-all hover:bg-orange-400"
                  >
                    <Phone className="size-5" aria-hidden="true" />
                    Hemen Arayın
                  </a>
                  <a
                    href={whatsappHref(phoneE164)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2.5 rounded-2xl bg-[#25d366] px-6 py-4 text-base font-bold text-white shadow-xl shadow-[#25d366]/25 transition-transform hover:scale-[1.02]"
                  >
                    <WhatsAppIcon className="size-5" />
                    WhatsApp&apos;tan Yazın
                  </a>
                </div>

                <dl className="mt-2 grid w-full gap-4 sm:grid-cols-2">
                  {infoItems.map((item) => (
                    <div
                      key={item.title}
                      className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-orange-500/15 text-orange-400">
                        <item.icon className="size-5" aria-hidden="true" />
                      </span>
                      <div>
                        <dt className="text-sm font-bold text-white">
                          {item.title}
                        </dt>
                        <dd className="mt-0.5 text-xs leading-relaxed text-white/60">
                          {item.text}
                        </dd>
                      </div>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-2xl shadow-black/20 sm:p-8 dark:bg-deep-950 dark:ring-1 dark:ring-white/10">
                <h3 className="text-lg font-extrabold text-navy-950 dark:text-white">
                  Hızlı Teklif Formu
                </h3>
                <p className="mb-5 mt-1 text-sm text-muted">
                  1 dakikanızı ayırın, net teklifiniz hazırlansın.
                </p>
                <QuoteForm phoneE164={phoneE164} serviceOptions={serviceOptions} />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
