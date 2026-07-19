import "server-only";
import { prisma } from "@/lib/prisma";

/** Small FK set that can reference a Media row — cheap to scan at this scale. */
async function getUsedMediaIds(): Promise<Set<string>> {
  const [settings, hero, testimonials, seoMetas] = await Promise.all([
    prisma.settings.findUnique({ where: { id: "singleton" } }),
    prisma.heroContent.findUnique({ where: { id: "singleton" } }),
    prisma.testimonial.findMany({ where: { photoMediaId: { not: null } } }),
    prisma.seoMeta.findMany({ where: { ogImageMediaId: { not: null } } }),
  ]);

  const ids = new Set<string>();
  if (settings?.logoMediaId) ids.add(settings.logoMediaId);
  if (settings?.faviconMediaId) ids.add(settings.faviconMediaId);
  if (hero?.imageMediaId) ids.add(hero.imageMediaId);
  for (const t of testimonials) if (t.photoMediaId) ids.add(t.photoMediaId);
  for (const s of seoMetas) if (s.ogImageMediaId) ids.add(s.ogImageMediaId);
  return ids;
}

export async function listMedia(folder?: string) {
  const [media, usedIds] = await Promise.all([
    prisma.media.findMany({
      where: folder ? { folder } : undefined,
      orderBy: { createdAt: "desc" },
    }),
    getUsedMediaIds(),
  ]);

  return media.map((m) => ({ ...m, used: usedIds.has(m.id) }));
}

export async function listFolders(): Promise<string[]> {
  const rows = await prisma.media.findMany({
    distinct: ["folder"],
    select: { folder: true },
    orderBy: { folder: "asc" },
  });
  return rows.map((r) => r.folder);
}
