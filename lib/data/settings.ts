import "server-only";
import { prisma } from "@/lib/prisma";

const FALLBACK = {
  id: "singleton",
  siteName: "Egehan Lojistik",
  siteSlogan: "81 İlde Güvenli ve Profesyonel Taşımacılık",
  siteDescription:
    "Egehan Lojistik ile evden eve nakliyat, parça eşya taşıma ve ofis taşıma. Türkiye'nin 81 iline sigortalı, hızlı ve profesyonel nakliye hizmeti.",
  siteUrl: "https://egehanlojistik.com",
  phoneE164: "905530503951",
  email: null,
  addressLine: null,
  mapEmbedUrl: null,
  workingHours: null,
  logoMediaId: null,
  faviconMediaId: null,
  instagramUrl: null,
  facebookUrl: null,
  twitterUrl: null,
  linkedinUrl: null,
  kvkkText: null,
  cookieText: null,
  privacyText: null,
  themePrimaryHex: null,
  themeAccentHex: null,
  headScripts: null,
  bodyScripts: null,
  footerScripts: null,
  gaId: null,
  gtmId: null,
  gscVerification: null,
  merchantId: null,
  googleAdsId: null,
  businessProfileId: null,
  recaptchaSiteKey: null,
  recaptchaSecret: null,
  updatedAt: new Date(),
  updatedById: null,
} as const;

/** Cached per-request (React `cache`-free is fine here — one fetch per request via Next's data cache is enough). */
export async function getSettings() {
  const settings = await prisma.settings.findUnique({ where: { id: "singleton" } });
  return settings ?? FALLBACK;
}

export function telHref(phoneE164: string) {
  return `tel:+${phoneE164}`;
}

export function whatsappHref(phoneE164: string) {
  return `https://wa.me/${phoneE164}`;
}

export function whatsappHrefWithMessage(phoneE164: string, message: string) {
  return `${whatsappHref(phoneE164)}?text=${encodeURIComponent(message)}`;
}
