"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { requireUser } from "@/lib/actions/session";
import { logActivity } from "@/lib/activity-log";

const submissionSchema = z.object({
  name: z.string().min(2).max(120),
  phone: z.string().min(6).max(30),
  email: z.string().email().max(160).optional().or(z.literal("")),
  fromCity: z.string().max(80).optional(),
  toCity: z.string().max(80).optional(),
  service: z.string().max(120).optional(),
  message: z.string().max(2000).optional(),
});

/**
 * Public submission from QuoteForm. Fire-and-forget from the client (never
 * awaited before opening WhatsApp) so a DB/network hiccup can't block the
 * working WhatsApp flow.
 */
export async function createContactSubmission(formData: FormData) {
  const raw = {
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    fromCity: String(formData.get("from") ?? ""),
    toCity: String(formData.get("to") ?? ""),
    service: String(formData.get("service") ?? ""),
    message: String(formData.get("note") ?? ""),
  };

  const parsed = submissionSchema.safeParse(raw);
  if (!parsed.success) return;

  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? "unknown";

  const { allowed } = await checkRateLimit(`contact:ip:${ip}`, {
    max: 3,
    windowMs: 10 * 60 * 1000,
  });
  if (!allowed) return;

  const submission = await prisma.contactSubmission.create({
    data: {
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email || null,
      fromCity: parsed.data.fromCity || null,
      toCity: parsed.data.toCity || null,
      service: parsed.data.service || null,
      message: parsed.data.message || null,
      ip,
      userAgent: h.get("user-agent"),
    },
  });

  await logActivity({ action: "contact.submit", entityType: "ContactSubmission", entityId: submission.id, ip });
}

const STAFF_ROLES = ["ADMIN", "EDITOR", "SUPPORT"] as const;

export async function markSubmissionRead(id: string, read: boolean) {
  const user = await requireUser([...STAFF_ROLES]);
  await prisma.contactSubmission.update({ where: { id }, data: { read } });
  await logActivity({ userId: user.id, action: "contact.markRead", entityType: "ContactSubmission", entityId: id });
  revalidatePath("/admin/inbox");
}

export async function markSubmissionReplied(id: string, replied: boolean) {
  const user = await requireUser([...STAFF_ROLES]);
  await prisma.contactSubmission.update({ where: { id }, data: { replied } });
  await logActivity({ userId: user.id, action: "contact.markReplied", entityType: "ContactSubmission", entityId: id });
  revalidatePath("/admin/inbox");
}

export async function deleteSubmission(id: string) {
  const user = await requireUser([...STAFF_ROLES]);
  await prisma.contactSubmission.update({ where: { id }, data: { deleted: true } });
  await logActivity({ userId: user.id, action: "contact.delete", entityType: "ContactSubmission", entityId: id });
  revalidatePath("/admin/inbox");
}
