/**
 * Site geneli sabitler — tek kaynak.
 *
 * ÖNEMLİ KURAL: Telefon numarası sitenin hiçbir yerinde METİN olarak
 * gösterilmez. Yalnızca tel: ve wa.me bağlantılarının href değerlerinde
 * kullanılır. Numara değişirse sadece bu dosyayı güncelleyin.
 */
const PHONE_E164 = "905530503951";

export const SITE_NAME = "Egehan Lojistik";
export const SITE_SLOGAN = "81 İlde Güvenli ve Profesyonel Taşımacılık";

/** Yayına alırken kendi alan adınızla güncelleyin. */
export const SITE_URL = "https://egehanlojistik.com";

export const SITE_DESCRIPTION =
  "Egehan Lojistik ile evden eve nakliyat, parça eşya taşıma ve ofis taşıma. " +
  "Türkiye'nin 81 iline sigortalı, hızlı ve profesyonel nakliye hizmeti. " +
  "Ücretsiz keşif ve net teklif için hemen ulaşın.";

export const TEL_HREF = `tel:+${PHONE_E164}`;
export const WHATSAPP_HREF = `https://wa.me/${PHONE_E164}`;

export function whatsappHrefWithMessage(message: string): string {
  return `${WHATSAPP_HREF}?text=${encodeURIComponent(message)}`;
}

export const NAV_ITEMS = [
  { label: "Hizmetler", href: "#hizmetler" },
  { label: "Neden Biz?", href: "#neden-biz" },
  { label: "Süreç", href: "#surec" },
  { label: "Yorumlar", href: "#yorumlar" },
  { label: "SSS", href: "#sss" },
  { label: "İletişim", href: "#iletisim" },
] as const;
