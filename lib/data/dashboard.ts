import "server-only";
import { prisma } from "@/lib/prisma";
import { computeSeoScore } from "@/lib/seo-score";

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export async function getDashboardData() {
  const now = new Date();
  const today = startOfDay(now);
  const weekAgo = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000);

  const [
    contactsToday,
    contactsWeek,
    contactsMonth,
    contactsTotal,
    contactsUnread,
    pageviewsToday,
    pageviewsWeek,
    pageviewsTotal,
    servicesCount,
    faqCount,
    testimonialsCount,
    mediaCount,
    mediaWithAlt,
    usersCount,
    lastLogin,
    seoMeta,
    recentContacts,
    recentActivity,
  ] = await Promise.all([
    prisma.contactSubmission.count({ where: { createdAt: { gte: today }, deleted: false } }),
    prisma.contactSubmission.count({ where: { createdAt: { gte: weekAgo }, deleted: false } }),
    prisma.contactSubmission.count({ where: { createdAt: { gte: monthAgo }, deleted: false } }),
    prisma.contactSubmission.count({ where: { deleted: false } }),
    prisma.contactSubmission.count({ where: { read: false, deleted: false } }),
    prisma.pageView.count({ where: { createdAt: { gte: today } } }),
    prisma.pageView.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.pageView.count(),
    prisma.service.count({ where: { active: true } }),
    prisma.faq.count({ where: { active: true } }),
    prisma.testimonial.count({ where: { active: true } }),
    prisma.media.count(),
    prisma.media.count({ where: { altText: { not: null } } }),
    prisma.user.count({ where: { active: true } }),
    prisma.user.findFirst({ where: { lastLoginAt: { not: null } }, orderBy: { lastLoginAt: "desc" }, select: { name: true, lastLoginAt: true } }),
    prisma.seoMeta.findUnique({ where: { pageKey: "home" } }),
    prisma.contactSubmission.findMany({
      where: { deleted: false },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { user: { select: { name: true } } },
    }),
  ]);

  const seoScore = seoMeta
    ? computeSeoScore({
        title: seoMeta.title,
        description: seoMeta.description,
        canonicalPath: seoMeta.canonicalPath,
        keywords: seoMeta.keywords,
        ogImageMediaId: seoMeta.ogImageMediaId,
        robotsIndex: seoMeta.robotsIndex,
        faqCount,
        serviceCount: servicesCount,
        imagesTotal: mediaCount,
        imagesWithAlt: mediaWithAlt,
      })
    : null;

  // Last 7 days pageview series for the chart.
  const pageviewRows = await prisma.pageView.findMany({
    where: { createdAt: { gte: weekAgo } },
    select: { createdAt: true },
  });
  const series: { date: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const day = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    const dayEnd = new Date(day.getTime() + 24 * 60 * 60 * 1000);
    const count = pageviewRows.filter((r) => r.createdAt >= day && r.createdAt < dayEnd).length;
    series.push({
      date: day.toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit" }),
      count,
    });
  }

  return {
    contacts: {
      today: contactsToday,
      week: contactsWeek,
      month: contactsMonth,
      total: contactsTotal,
      unread: contactsUnread,
    },
    pageviews: { today: pageviewsToday, week: pageviewsWeek, total: pageviewsTotal, series },
    content: { services: servicesCount, faq: faqCount, testimonials: testimonialsCount, media: mediaCount, users: usersCount },
    lastLogin,
    seoScore,
    recentContacts,
    recentActivity,
  };
}
