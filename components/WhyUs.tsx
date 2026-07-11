import {
  ArrowRight,
  CalendarClock,
  Headset,
  PackageCheck,
  ShieldCheck,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const FEATURES: Feature[] = [
  {
    icon: ShieldCheck,
    title: "Sigortalı Taşımacılık",
    description:
      "Eşyalarınız yükleme anından teslimata kadar nakliyat sigortası güvencesi altındadır.",
  },
  {
    icon: Users,
    title: "Uzman ve Özenli Ekip",
    description:
      "Eğitimli, deneyimli ve güler yüzlü ekibimiz eşyalarınıza kendi eşyası gibi davranır.",
  },
  {
    icon: CalendarClock,
    title: "Zamanında Teslimat",
    description:
      "Belirlenen gün ve saatte adresinizdeyiz; planlarınız asla aksamaz.",
  },
  {
    icon: PackageCheck,
    title: "Profesyonel Paketleme",
    description:
      "Balonlu naylon, özel koli ve battaniyelerle her eşyaya özel koruma uygulanır.",
  },
  {
    icon: Wallet,
    title: "Şeffaf Fiyatlandırma",
    description:
      "Keşif sonrası net fiyat; sürpriz maliyet ve gizli ücret yoktur.",
  },
  {
    icon: Headset,
    title: "7/24 Canlı Destek",
    description:
      "Taşıma öncesinde, sırasında ve sonrasında bize her an ulaşabilirsiniz.",
  },
];

export default function WhyUs() {
  return (
    <section
      id="neden-biz"
      className="relative scroll-mt-24 overflow-hidden bg-navy-950 py-20 lg:py-24 dark:bg-deep-900/70"
    >
      {/* Dekor */}
      <div
        aria-hidden="true"
        className="absolute -right-32 -top-32 size-[420px] rounded-full bg-orange-500/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-40 -left-24 size-[380px] rounded-full bg-navy-600/30 blur-3xl"
      />

      <div className="container-x relative flex flex-col gap-12">
        <SectionHeading
          onDark
          eyebrow="Neden Egehan Lojistik?"
          title="Eşyanızı Gözünüz Arkada Kalmadan Emanet Edin"
          description="Binlerce ailenin ve işletmenin tercihi olmamızın arkasında; işimizi ciddiye almamız ve her taşımayı kendi eşyamız gibi sahiplenmemiz var."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <Reveal key={feature.title} delay={(i % 3) * 0.08} className="h-full">
              <article className="h-full rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors duration-300 hover:border-orange-500/30 hover:bg-white/10">
                <div className="mb-4 grid size-12 place-items-center rounded-xl bg-orange-500/15 text-orange-400">
                  <feature.icon className="size-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  {feature.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="flex justify-center">
          <a
            href="#iletisim"
            className="group inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-7 py-4 text-base font-bold text-navy-950 shadow-xl shadow-orange-500/25 transition-all hover:bg-orange-400"
          >
            Ücretsiz Keşif Planlayın
            <ArrowRight
              className="size-5 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
