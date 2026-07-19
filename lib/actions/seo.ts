"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/actions/session";
import { logActivity } from "@/lib/activity-log";

const seoSchema = z.object({
  pageKey: z.string().min(1).max(60),
  title: z.string().min(1).max(70),
  description: z.string().min(1).max(200),
  keywords: z.array(z.string().min(1).max(40)).max(20),
  canonicalPath: z.string().min(1).max(200),
  ogTitle: z.string().max(70).optional().nullable(),
  ogDescription: z.string().max(200).optional().nullable(),
  ogImageMediaId: z.string().optional().nullable(),
  twitterCard: z.string().max(40).default("summary_large_image"),
  robotsIndex: z.boolean().default(true),
  robotsFollow: z.boolean().default(true),
});

export type SeoInput = z.infer<typeof seoSchema>;

export async function updateSeoMeta(input: SeoInput) {
  const user = await requireUser(["ADMIN", "SEO"]);
  const data = seoSchema.parse(input);

  const seo = await prisma.seoMeta.upsert({
    where: { pageKey: data.pageKey },
    create: data,
    update: data,
  });

  await logActivity({ userId: user.id, action: "seo.update", entityType: "SeoMeta", entityId: data.pageKey });
  revalidatePath("/");
  revalidatePath("/admin/seo");
  return seo;
}
