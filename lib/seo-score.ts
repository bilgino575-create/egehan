export interface SeoScoreInput {
  title: string;
  description: string;
  canonicalPath: string;
  keywords: string[];
  ogImageMediaId: string | null | undefined;
  robotsIndex: boolean;
  faqCount: number;
  serviceCount: number;
  imagesTotal: number;
  imagesWithAlt: number;
}

export interface SeoScoreResult {
  score: number; // 0-100
  warnings: string[];
}

/**
 * Real, self-contained heuristic — no external API (PageSpeed/Search
 * Console) required. Each check is worth a fixed weight; warnings explain
 * exactly what to fix.
 */
export function computeSeoScore(input: SeoScoreInput): SeoScoreResult {
  const warnings: string[] = [];
  let score = 0;

  const titleLen = input.title.trim().length;
  if (titleLen >= 15 && titleLen <= 60) {
    score += 15;
  } else {
    warnings.push(
      titleLen === 0
        ? "Meta başlık boş."
        : `Meta başlık ${titleLen} karakter — 15-60 arası önerilir.`
    );
  }

  const descLen = input.description.trim().length;
  if (descLen >= 70 && descLen <= 160) {
    score += 15;
  } else {
    warnings.push(
      descLen === 0
        ? "Meta açıklama boş."
        : `Meta açıklama ${descLen} karakter — 70-160 arası önerilir.`
    );
  }

  if (input.canonicalPath.trim().length > 0) {
    score += 10;
  } else {
    warnings.push("Canonical URL tanımlı değil.");
  }

  if (input.keywords.length >= 3) {
    score += 10;
  } else {
    warnings.push("En az 3 anahtar kelime eklenmesi önerilir.");
  }

  if (input.ogImageMediaId) {
    score += 10;
  } else {
    warnings.push("Open Graph görseli eklenmemiş.");
  }

  if (input.robotsIndex) {
    score += 10;
  } else {
    warnings.push("Sayfa \"noindex\" olarak işaretli — Google'da görünmeyecek.");
  }

  if (input.faqCount >= 3) {
    score += 10;
  } else {
    warnings.push("SSS bölümünde en az 3 soru olması FAQ zengin sonuçları için önerilir.");
  }

  if (input.serviceCount >= 1) {
    score += 5;
  } else {
    warnings.push("Aktif hizmet bulunamadı.");
  }

  if (input.imagesTotal === 0) {
    warnings.push("Alt-metin kontrolü için görsel bulunamadı.");
  } else {
    const coverage = input.imagesWithAlt / input.imagesTotal;
    if (coverage >= 0.9) {
      score += 15;
    } else {
      score += Math.round(coverage * 15);
      warnings.push(
        `Görsellerin yalnızca %${Math.round(coverage * 100)}'inde alt-metin var.`
      );
    }
  }

  return { score: Math.min(100, score), warnings };
}
