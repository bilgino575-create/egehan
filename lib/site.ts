/**
 * Saf, parametreli yardımcılar — site içerikleri artık veritabanından
 * (Settings modeli) geliyor, bkz. lib/data/settings.ts.
 *
 * ÖNEMLİ KURAL: Telefon numarası sitenin hiçbir yerinde METİN olarak
 * gösterilmez. Yalnızca tel: ve wa.me bağlantılarının href değerlerinde
 * kullanılır.
 */

export function telHref(phoneE164: string): string {
  return `tel:+${phoneE164}`;
}

export function whatsappHref(phoneE164: string): string {
  return `https://wa.me/${phoneE164}`;
}

export function whatsappHrefWithMessage(phoneE164: string, message: string): string {
  return `${whatsappHref(phoneE164)}?text=${encodeURIComponent(message)}`;
}
