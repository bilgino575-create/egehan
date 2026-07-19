"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/actions/session";
import { logActivity } from "@/lib/activity-log";

const EDITOR_ROLES = ["ADMIN", "EDITOR", "CONTENT_EDITOR"] as const;

const navSchema = z.object({
  label: z.string().min(1).max(60),
  href: z.string().min(1).max(200),
  visible: z.boolean().default(true),
});

export type NavItemInput = z.infer<typeof navSchema>;

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/admin/content/nav");
}

export async function createNavItem(input: NavItemInput) {
  const user = await requireUser([...EDITOR_ROLES]);
  const data = navSchema.parse(input);
  const maxOrder = await prisma.navItem.aggregate({ _max: { order: true } });
  const item = await prisma.navItem.create({ data: { ...data, order: (maxOrder._max.order ?? -1) + 1 } });
  await logActivity({ userId: user.id, action: "nav.create", entityType: "NavItem", entityId: item.id });
  revalidateAll();
  return item;
}

export async function updateNavItem(id: string, input: NavItemInput) {
  const user = await requireUser([...EDITOR_ROLES]);
  const data = navSchema.parse(input);
  const item = await prisma.navItem.update({ where: { id }, data });
  await logActivity({ userId: user.id, action: "nav.update", entityType: "NavItem", entityId: id });
  revalidateAll();
  return item;
}

export async function deleteNavItem(id: string) {
  const user = await requireUser([...EDITOR_ROLES]);
  await prisma.navItem.delete({ where: { id } });
  await logActivity({ userId: user.id, action: "nav.delete", entityType: "NavItem", entityId: id });
  revalidateAll();
}

export async function reorderNavItems(orderedIds: string[]) {
  const user = await requireUser([...EDITOR_ROLES]);
  await prisma.$transaction(
    orderedIds.map((id, index) => prisma.navItem.update({ where: { id }, data: { order: index } }))
  );
  await logActivity({ userId: user.id, action: "nav.reorder" });
  revalidateAll();
}
