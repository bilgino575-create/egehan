"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/actions/session";
import { logActivity } from "@/lib/activity-log";

const EDITOR_ROLES = ["ADMIN", "EDITOR", "CONTENT_EDITOR"] as const;

const heroSchema = z.object({
  badgeLive: z.string().min(1).max(120),
  badgeVip: z.string().min(1).max(120),
  heading: z.string().min(2).max(200),
  headingHighlight: z.string().min(1).max(60),
  description: z.string().min(2).max(600),
  ctaPrimaryLabel: z.string().min(1).max(60),
  ctaSecondaryLabel: z.string().min(1).max(60),
  trustItems: z.array(z.string().min(1).max(80)).max(6),
  imageMediaId: z.string().optional().nullable(),
});

export type HeroInput = z.infer<typeof heroSchema>;

export async function updateHero(input: HeroInput) {
  const user = await requireUser([...EDITOR_ROLES]);
  const data = heroSchema.parse(input);

  const hero = await prisma.heroContent.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", ...data },
    update: data,
  });

  await logActivity({ userId: user.id, action: "hero.update", entityType: "HeroContent", entityId: "singleton" });
  revalidatePath("/");
  revalidatePath("/admin/content/hero");
  return hero;
}
