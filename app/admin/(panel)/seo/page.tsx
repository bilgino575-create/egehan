import { prisma } from "@/lib/prisma";
import { computeSeoScore } from "@/lib/seo-score";
import SeoManager from "@/components/admin/seo/SeoManager";

export default async function SeoAdminPage() {
  const [seoMeta, faqCount, serviceCount, mediaCount, mediaWithAlt] = await Promise.all([
    prisma.seoMeta.findUnique({ where: { pageKey: "home" } }),
    prisma.faq.count({ where: { active: true } }),
    prisma.service.count({ where: { active: true } }),
    prisma.media.count(),
    prisma.media.count({ where: { altText: { not: null } } }),
  ]);

  const baselineCounts = {
    faqCount,
    serviceCount,
    imagesTotal: mediaCount,
    imagesWithAlt: mediaWithAlt,
  };

  const scoreResult = computeSeoScore({
    title: seoMeta?.title ?? "",
    description: seoMeta?.description ?? "",
    canonicalPath: seoMeta?.canonicalPath ?? "",
    keywords: seoMeta?.keywords ?? [],
    ogImageMediaId: seoMeta?.ogImageMediaId ?? null,
    robotsIndex: seoMeta?.robotsIndex ?? true,
    ...baselineCounts,
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-navy-950 dark:text-white">
          SEO Yönetimi
        </h1>
        <p className="mt-1 text-sm text-muted">
          Ana sayfa için meta bilgileri, sosyal önizleme ve SEO skorunu yönetin.
        </p>
      </div>
      <SeoManager initialSeoMeta={seoMeta} initialScore={scoreResult} baselineCounts={baselineCounts} />
    </div>
  );
}
