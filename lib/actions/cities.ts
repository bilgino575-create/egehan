"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/actions/session";
import { logActivity } from "@/lib/activity-log";

const EDITOR_ROLES = ["ADMIN", "EDITOR", "CONTENT_EDITOR"] as const;

const citySchema = z.object({
  name: z.string().min(2).max(60),
  active: z.boolean().default(true),
});

export type CityInput = z.infer<typeof citySchema>;

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/admin/content/hero");
}

export async function createCity(input: CityInput) {
  const user = await requireUser([...EDITOR_ROLES]);
  const data = citySchema.parse(input);
  const maxOrder = await prisma.city.aggregate({ _max: { order: true } });
  const city = await prisma.city.create({ data: { ...data, order: (maxOrder._max.order ?? -1) + 1 } });
  await logActivity({ userId: user.id, action: "city.create", entityType: "City", entityId: city.id });
  revalidateAll();
  return city;
}

export async function deleteCity(id: string) {
  const user = await requireUser([...EDITOR_ROLES]);
  await prisma.city.delete({ where: { id } });
  await logActivity({ userId: user.id, action: "city.delete", entityType: "City", entityId: id });
  revalidateAll();
}

export async function toggleCityActive(id: string, active: boolean) {
  const user = await requireUser([...EDITOR_ROLES]);
  const city = await prisma.city.update({ where: { id }, data: { active } });
  await logActivity({ userId: user.id, action: "city.toggle", entityType: "City", entityId: id });
  revalidateAll();
  return city;
}
