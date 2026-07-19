import "server-only";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/data/settings";

export async function getHomePageData() {
  const [
    settings,
    heroRow,
    navItems,
    stats,
    cities,
    services,
    whyUsCards,
    processSteps,
    faqs,
    testimonialRows,
    seoMeta,
  ] = await Promise.all([
    getSettings(),
    prisma.heroContent.findUnique({ where: { id: "singleton" } }),
    prisma.navItem.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
    prisma.stat.findMany({ orderBy: { order: "asc" } }),
    prisma.city.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
    prisma.service.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
    prisma.whyUsCard.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
    prisma.processStep.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
    prisma.faq.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
    prisma.testimonial.findMany({
      where: { active: true, homepageVisible: true },
      orderBy: { order: "asc" },
      include: { service: { select: { title: true } } },
    }),
    prisma.seoMeta.findUnique({ where: { pageKey: "home" } }),
  ]);

  let heroImageUrl: string | null = null;
  if (heroRow?.imageMediaId) {
    const media = await prisma.media.findUnique({ where: { id: heroRow.imageMediaId } });
    heroImageUrl = media?.url ?? null;
  }

  const hero = heroRow
    ? {
        badgeLive: heroRow.badgeLive,
        badgeVip: heroRow.badgeVip,
        heading: heroRow.heading,
        headingHighlight: heroRow.headingHighlight,
        description: heroRow.description,
        ctaPrimaryLabel: heroRow.ctaPrimaryLabel,
        ctaSecondaryLabel: heroRow.ctaSecondaryLabel,
        trustItems: heroRow.trustItems,
        imageUrl: heroImageUrl,
      }
    : null;

  const testimonials = testimonialRows.map((t) => ({
    id: t.id,
    name: t.name,
    route: t.route,
    serviceName: t.service?.title ?? null,
    text: t.text,
    rating: t.rating,
  }));

  return {
    settings,
    hero,
    navItems,
    stats,
    cities,
    services,
    whyUsCards,
    processSteps,
    faqs,
    testimonials,
    seoMeta,
  };
}

export type HomePageData = Awaited<ReturnType<typeof getHomePageData>>;
