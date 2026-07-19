"use server";

import { revalidatePath } from "next/cache";
import { del } from "@vercel/blob";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/actions/session";
import { logActivity } from "@/lib/activity-log";

const EDITOR_ROLES = ["ADMIN", "EDITOR", "CONTENT_EDITOR"] as const;

export async function deleteMedia(id: string) {
  const user = await requireUser([...EDITOR_ROLES]);
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) return;

  await del(media.pathname).catch(() => {});
  await prisma.media.delete({ where: { id } });

  await logActivity({ userId: user.id, action: "media.delete", entityType: "Media", entityId: id });
  revalidatePath("/admin/media");
}

const altSchema = z.object({ altText: z.string().max(300) });

export async function updateMediaAlt(id: string, altText: string) {
  const user = await requireUser([...EDITOR_ROLES]);
  const data = altSchema.parse({ altText });
  const media = await prisma.media.update({ where: { id }, data });
  await logActivity({ userId: user.id, action: "media.updateAlt", entityType: "Media", entityId: id });
  revalidatePath("/admin/media");
  return media;
}

export async function moveMediaFolder(id: string, folder: string) {
  const user = await requireUser([...EDITOR_ROLES]);
  const safeFolder = folder.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-") || "genel";
  const media = await prisma.media.update({ where: { id }, data: { folder: safeFolder } });
  await logActivity({ userId: user.id, action: "media.move", entityType: "Media", entityId: id });
  revalidatePath("/admin/media");
  return media;
}
