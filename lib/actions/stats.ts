"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/actions/session";
import { logActivity } from "@/lib/activity-log";

const EDITOR_ROLES = ["ADMIN", "EDITOR", "CONTENT_EDITOR"] as const;

const statSchema = z.object({
  value: z.string().min(1).max(30),
  label: z.string().min(1).max(80),
});

export type StatInput = z.infer<typeof statSchema>;

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/admin/content/hero");
}

export async function createStat(input: StatInput) {
  const user = await requireUser([...EDITOR_ROLES]);
  const data = statSchema.parse(input);
  const maxOrder = await prisma.stat.aggregate({ _max: { order: true } });
  const stat = await prisma.stat.create({ data: { ...data, order: (maxOrder._max.order ?? -1) + 1 } });
  await logActivity({ userId: user.id, action: "stat.create", entityType: "Stat", entityId: stat.id });
  revalidateAll();
  return stat;
}

export async function updateStat(id: string, input: StatInput) {
  const user = await requireUser([...EDITOR_ROLES]);
  const data = statSchema.parse(input);
  const stat = await prisma.stat.update({ where: { id }, data });
  await logActivity({ userId: user.id, action: "stat.update", entityType: "Stat", entityId: id });
  revalidateAll();
  return stat;
}

export async function deleteStat(id: string) {
  const user = await requireUser([...EDITOR_ROLES]);
  await prisma.stat.delete({ where: { id } });
  await logActivity({ userId: user.id, action: "stat.delete", entityType: "Stat", entityId: id });
  revalidateAll();
}
