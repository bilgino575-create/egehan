import {
  ArrowRight,
  CheckCircle2,
  Crown,
  Headset,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import { CITIES, STATS } from "@/lib/content";
import { TEL_HREF } from "@/lib/site";

const TRUST_ITEMS = [
  "%100 Sigortalı Taşıma",
  "Sözleşmeli Hizmet",
  "Hasarsız Teslimat",
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-28 sm:pt-32 lg:pb-20 lg:pt-40">
      {/* Dekoratif zemin */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(75%_60%_at_50%_35%,black,transparent)]"
      />
      <div
        aria-hidden="true"
        className="absolute -top-32 right-[-10%] -z-10 size-[480px] rounded-full bg-orange-500/15 blur-3xl dark:bg-orange-500/10"
      />
      <div
        aria-hidden="true"
        className="absolute left-[-12%] top-40 -z-10 size-[420px] rounded-full bg-navy-500/15 blur-3xl dark:bg-navy-600/20"
      />

      <div className="container-x">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
          {/* Metin */}
          <div className="flex max-w-2xl flex-col items-start gap-6">
            <Reveal>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-2.5 rounded-full border border-navy-950/10 bg-white/70 px-4 py-2 text-xs font-bold text-navy-900 backdrop-blur dark:border-white/15 dark:bg-white/5 dark:text-navy-100">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-500 opacity-60" />
                    <span className="relative inline-flex size-2 rounded-full bg-orange-500" />
                  </span>
                  Türkiye Geneli — 81 İlde Aktif Hizmet
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-400 px-4 py-2 text-xs font-extrabold tracking-wider text-navy-950 shadow-lg shadow-orange-500/30">
                  <Crown className="size-4" aria-hidden="true" />
                  SİZE ÖZEL VİP SERVİS
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="text-balance text-4xl font-extrabold leading-[1.12] tracking-tight text-navy-950 sm:text-5xl lg:text-[3.4rem] dark:text-white">
                81 İlde{" "}
                <span className="relative inline-block text-orange-500">
                  Güvenli
                  <svg
                    viewBox="0 0 160 12"
                    aria-hidden="true"
                    className="absolute -bottom-1.5 left-0 h-3 w-full"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M3 9 C 45 3, 115 3, 157 8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="5"
                      strokeLinecap="round"
                      className="text-orange-400/70"
                    />
                  </svg>
                </span>{" "}
                ve Profesyonel Taşımacılık
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="text-pretty text-lg leading-relaxed text-muted">
                Evden eve nakliyattan ofis taşımaya kadar tüm eşyalarınız;
                uzman ekibimiz, sigortalı araç filomuz ve özenli paketleme
                sistemimizle yeni adresine sorunsuz ulaşır.
              </p>
            </Reveal>

            <Reveal delay={0.24} className="w-full">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="#iletisim"
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-7 py-4 text-base font-bold text-navy-950 shadow-xl shadow-orange-500/30 transition-all hover:bg-orange-400 hover:shadow-orange-500/40"
                >
                  Ücretsiz Teklif Alın
                  <ArrowRight
                    className="size-5 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </a>
                <a
                  href="#hizmetler"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-navy-950/15 bg-white/60 px-7 py-4 text-base font-bold text-navy-950 backdrop-blur transition-colors hover:bg-navy-950/5 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                >
                  Hizmetlerimiz
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.32}>
              <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
                {TRUST_ITEMS.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-1.5 text-sm font-semibold text-navy-900/75 dark:text-navy-100/75"
                  >
                    <CheckCircle2
                      className="size-4 text-orange-500"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Görsel alanı */}
          <Reveal delay={0.2}>
            <div className="animate-float-slow rounded-[2rem] border border-white/60 bg-white/70 p-3 shadow-2xl shadow-navy-950/10 backdrop-blur dark:border-white/10 dark:bg-white/5">
              <Image
                src="/silder.jpg"
                alt="Egehan Lojistik — size özel VIP servis aracı"
                width={835}
                height={335}
                priority
                className="h-auto w-full rounded-[1.4rem] object-cover"
              />
            </div>
            {/* Rozetler görselin altında buton olarak (slider'ı kapatmasın) */}
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <a
                href="#neden-biz"
                className="group flex items-center justify-center gap-2.5 rounded-2xl border border-navy-950/10 bg-white px-4 py-3 text-sm font-bold text-navy-950 shadow-md shadow-navy-950/5 transition-all hover:-translate-y-0.5 hover:border-orange-500/40 hover:shadow-lg dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-orange-500/15 text-orange-500">
                  <ShieldCheck className="size-5" aria-hidden="true" />
                </span>
                Sigortalı Taşıma
              </a>
              <a
                href={TEL_HREF}
                aria-label="7/24 destek hattını arayın"
                className="group flex items-center justify-center gap-2.5 rounded-2xl border border-navy-950/10 bg-white px-4 py-3 text-sm font-bold text-navy-950 shadow-md shadow-navy-950/5 transition-all hover:-translate-y-0.5 hover:border-orange-500/40 hover:shadow-lg dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-navy-950/10 text-navy-900 dark:bg-white/10 dark:text-white">
                  <Headset className="size-5" aria-hidden="true" />
                </span>
                7/24 Destek
              </a>
            </div>
          </Reveal>
        </div>

        {/* İstatistikler */}
        <Reveal delay={0.15}>
          <dl className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4 lg:mt-20">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="glass flex flex-col items-center gap-1 rounded-2xl px-4 py-6 text-center"
              >
                <dd className="text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl dark:text-white">
                  {stat.value}
                </dd>
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted sm:text-sm">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>

      {/* Şehir bandı */}
      <div
        aria-hidden="true"
        className="relative mt-14 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
      >
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap py-1">
          {[...CITIES, ...CITIES].map((city, i) => (
            <span
              key={`${city}-${i}`}
              className="flex items-center gap-2.5 text-sm font-bold uppercase tracking-wider text-navy-950/35 dark:text-white/30"
            >
              <span className="size-1.5 rounded-full bg-orange-500/60" />
              {city}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
