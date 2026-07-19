"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/actions/session";
import { logActivity } from "@/lib/activity-log";

const EDITOR_ROLES = ["ADMIN", "EDITOR", "CONTENT_EDITOR"] as const;

const faqSchema = z.object({
  question: z.string().min(3).max(300),
  answer: z.string().min(3).max(3000),
  category: z.string().max(80).optional().nullable(),
  active: z.boolean().default(true),
});

export type FaqInput = z.infer<typeof faqSchema>;

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/admin/content/faq");
}

export async function createFaq(input: FaqInput) {
  const user = await requireUser([...EDITOR_ROLES]);
  const data = faqSchema.parse(input);
  const maxOrder = await prisma.faq.aggregate({ _max: { order: true } });
  const faq = await prisma.faq.create({
    data: { ...data, order: (maxOrder._max.order ?? -1) + 1 },
  });
  await logActivity({ userId: user.id, action: "faq.create", entityType: "Faq", entityId: faq.id });
  revalidateAll();
  return faq;
}

export async function updateFaq(id: string, input: FaqInput) {
  const user = await requireUser([...EDITOR_ROLES]);
  const data = faqSchema.parse(input);
  const faq = await prisma.faq.update({ where: { id }, data });
  await logActivity({ userId: user.id, action: "faq.update", entityType: "Faq", entityId: id });
  revalidateAll();
  return faq;
}

export async function deleteFaq(id: string) {
  const user = await requireUser([...EDITOR_ROLES]);
  await prisma.faq.delete({ where: { id } });
  await logActivity({ userId: user.id, action: "faq.delete", entityType: "Faq", entityId: id });
  revalidateAll();
}

export async function reorderFaqs(orderedIds: string[]) {
  const user = await requireUser([...EDITOR_ROLES]);
  await prisma.$transaction(
    orderedIds.map((id, index) => prisma.faq.update({ where: { id }, data: { order: index } }))
  );
  await logActivity({ userId: user.id, action: "faq.reorder" });
  revalidateAll();
}
