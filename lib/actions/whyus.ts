"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/actions/session";
import { logActivity } from "@/lib/activity-log";

const EDITOR_ROLES = ["ADMIN", "EDITOR", "CONTENT_EDITOR"] as const;

const cardSchema = z.object({
  icon: z.string().min(1),
  title: z.string().min(2).max(120),
  description: z.string().min(2).max(600),
  active: z.boolean().default(true),
});

export type WhyUsCardInput = z.infer<typeof cardSchema>;

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/admin/content/why-us");
}

export async function createWhyUsCard(input: WhyUsCardInput) {
  const user = await requireUser([...EDITOR_ROLES]);
  const data = cardSchema.parse(input);
  const maxOrder = await prisma.whyUsCard.aggregate({ _max: { order: true } });
  const card = await prisma.whyUsCard.create({
    data: { ...data, order: (maxOrder._max.order ?? -1) + 1 },
  });
  await logActivity({ userId: user.id, action: "whyus.create", entityType: "WhyUsCard", entityId: card.id });
  revalidateAll();
  return card;
}

export async function updateWhyUsCard(id: string, input: WhyUsCardInput) {
  const user = await requireUser([...EDITOR_ROLES]);
  const data = cardSchema.parse(input);
  const card = await prisma.whyUsCard.update({ where: { id }, data });
  await logActivity({ userId: user.id, action: "whyus.update", entityType: "WhyUsCard", entityId: id });
  revalidateAll();
  return card;
}

export async function deleteWhyUsCard(id: string) {
  const user = await requireUser([...EDITOR_ROLES]);
  await prisma.whyUsCard.delete({ where: { id } });
  await logActivity({ userId: user.id, action: "whyus.delete", entityType: "WhyUsCard", entityId: id });
  revalidateAll();
}

export async function reorderWhyUsCards(orderedIds: string[]) {
  const user = await requireUser([...EDITOR_ROLES]);
  await prisma.$transaction(
    orderedIds.map((id, index) => prisma.whyUsCard.update({ where: { id }, data: { order: index } }))
  );
  await logActivity({ userId: user.id, action: "whyus.reorder" });
  revalidateAll();
}
