"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/actions/session";
import { logActivity } from "@/lib/activity-log";

const EDITOR_ROLES = ["ADMIN", "EDITOR", "CONTENT_EDITOR"] as const;

const stepSchema = z.object({
  icon: z.string().min(1),
  title: z.string().min(2).max(120),
  description: z.string().min(2).max(600),
  active: z.boolean().default(true),
});

export type ProcessStepInput = z.infer<typeof stepSchema>;

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/admin/content/process");
}

export async function createProcessStep(input: ProcessStepInput) {
  const user = await requireUser([...EDITOR_ROLES]);
  const data = stepSchema.parse(input);
  const maxOrder = await prisma.processStep.aggregate({ _max: { order: true } });
  const step = await prisma.processStep.create({
    data: { ...data, order: (maxOrder._max.order ?? -1) + 1 },
  });
  await logActivity({ userId: user.id, action: "process.create", entityType: "ProcessStep", entityId: step.id });
  revalidateAll();
  return step;
}

export async function updateProcessStep(id: string, input: ProcessStepInput) {
  const user = await requireUser([...EDITOR_ROLES]);
  const data = stepSchema.parse(input);
  const step = await prisma.processStep.update({ where: { id }, data });
  await logActivity({ userId: user.id, action: "process.update", entityType: "ProcessStep", entityId: id });
  revalidateAll();
  return step;
}

export async function deleteProcessStep(id: string) {
  const user = await requireUser([...EDITOR_ROLES]);
  await prisma.processStep.delete({ where: { id } });
  await logActivity({ userId: user.id, action: "process.delete", entityType: "ProcessStep", entityId: id });
  revalidateAll();
}

export async function reorderProcessSteps(orderedIds: string[]) {
  const user = await requireUser([...EDITOR_ROLES]);
  await prisma.$transaction(
    orderedIds.map((id, index) => prisma.processStep.update({ where: { id }, data: { order: index } }))
  );
  await logActivity({ userId: user.id, action: "process.reorder" });
  revalidateAll();
}
