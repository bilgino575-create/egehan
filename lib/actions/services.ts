"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/actions/session";
import { logActivity } from "@/lib/activity-log";

const EDITOR_ROLES = ["ADMIN", "EDITOR", "CONTENT_EDITOR"] as const;

const serviceSchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Slug yalnızca küçük harf, rakam ve tire içerebilir."),
  icon: z.string().min(1),
  title: z.string().min(2).max(120),
  description: z.string().min(2).max(2000),
  features: z.array(z.string().min(1).max(160)).max(10),
  popular: z.boolean().default(false),
  active: z.boolean().default(true),
});

export type ServiceInput = z.infer<typeof serviceSchema>;

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/admin/content/services");
}

export async function createService(input: ServiceInput) {
  const user = await requireUser([...EDITOR_ROLES]);
  const data = serviceSchema.parse(input);

  const maxOrder = await prisma.service.aggregate({ _max: { order: true } });
  const service = await prisma.service.create({
    data: { ...data, order: (maxOrder._max.order ?? -1) + 1 },
  });

  await logActivity({
    userId: user.id,
    action: "service.create",
    entityType: "Service",
    entityId: service.id,
  });
  revalidateAll();
  return service;
}

export async function updateService(id: string, input: ServiceInput) {
  const user = await requireUser([...EDITOR_ROLES]);
  const data = serviceSchema.parse(input);

  const service = await prisma.service.update({ where: { id }, data });

  await logActivity({
    userId: user.id,
    action: "service.update",
    entityType: "Service",
    entityId: id,
  });
  revalidateAll();
  return service;
}

export async function deleteService(id: string) {
  const user = await requireUser([...EDITOR_ROLES]);
  await prisma.service.delete({ where: { id } });

  await logActivity({
    userId: user.id,
    action: "service.delete",
    entityType: "Service",
    entityId: id,
  });
  revalidateAll();
}

export async function reorderServices(orderedIds: string[]) {
  const user = await requireUser([...EDITOR_ROLES]);
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.service.update({ where: { id }, data: { order: index } })
    )
  );

  await logActivity({ userId: user.id, action: "service.reorder" });
  revalidateAll();
}
