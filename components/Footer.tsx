import { BadgeCheck, Phone, ShieldCheck } from "lucide-react";
import Logo from "@/components/Logo";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { telHref, whatsappHref } from "@/lib/site";
import type { NavItemData } from "@/components/Header";

export default function Footer({
  navItems,
  serviceNames,
  cities,
  phoneE164,
  siteName,
  siteSlogan,
  siteDescription,
}: {
  navItems: NavItemData[];
  serviceNames: string[];
  cities: string[];
  phoneE164: string;
  siteName: string;
  siteSlogan: string;
  siteDescription: string;
}) {
  const year = new Date().getFullYear();
  const remainingCities = Math.max(cities.length - 8, 0);

  return (
    <footer className="relative bg-navy-950 text-white dark:bg-deep-950">
      <div
        aria-hidden="true"
        className="h-1 bg-gradient-to-r from-orange-500 via-orange-400 to-navy-600"
      />
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div className="flex flex-col items-start gap-5">
          <Logo onDark />
          <p className="max-w-sm text-sm leading-relaxed text-white/60">
            {siteDescription}
          </p>
          <ul className="flex flex-wrap gap-2">
            <li className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/75">
              <ShieldCheck className="size-3.5 text-orange-400" aria-hidden="true" />
              Sigortalı Taşıma
            </li>
            <li className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/75">
              <BadgeCheck className="size-3.5 text-orange-400" aria-hidden="true" />
              Sözleşmeli Hizmet
            </li>
          </ul>
        </div>

        <nav aria-label="Hızlı bağlantılar">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-white/90">
            Hızlı Bağlantılar
          </h3>
          <ul className="mt-4 flex flex-col gap-2.5">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-sm text-white/60 transition-colors hover:text-orange-400"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-white/90">
            Hizmetlerimiz
          </h3>
          <ul className="mt-4 flex flex-col gap-2.5">
            {serviceNames.map((service) => (
              <li key={service}>
                <a
                  href="#hizmetler"
                  className="text-sm text-white/60 transition-colors hover:text-orange-400"
                >
                  {service}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white/90">
              Hizmet Bölgeleri
            </h3>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {cities.slice(0, 8).map((city) => (
                <li
                  key={city}
                  className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/65"
                >
                  {city}
                </li>
              ))}
              {remainingCities > 0 && (
                <li className="rounded-full border border-orange-400/30 bg-orange-500/10 px-2.5 py-1 text-xs font-bold text-orange-400">
                  +{remainingCities} il daha
                </li>
              )}
            </ul>
          </div>
          <div className="flex gap-2.5">
            <a
              href={telHref(phoneE164)}
              aria-label="Bizi telefonla arayın"
              title="Hemen Arayın"
              className="grid size-11 place-items-center rounded-xl bg-white/10 text-white transition-colors hover:bg-orange-500 hover:text-navy-950"
            >
              <Phone className="size-5" aria-hidden="true" />
            </a>
            <a
              href={whatsappHref(phoneE164)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp üzerinden bize yazın"
              title="WhatsApp'tan Yazın"
              className="grid size-11 place-items-center rounded-xl bg-white/10 text-white transition-colors hover:bg-[#25d366]"
            >
              <WhatsAppIcon className="size-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 sm:flex-row">
          <p className="text-xs text-white/50">
            © {year} {siteName} — Tüm hakları saklıdır.
          </p>
          <p className="text-xs font-semibold text-white/50">{siteSlogan}</p>
        </div>
      </div>
    </footer>
  );
}
