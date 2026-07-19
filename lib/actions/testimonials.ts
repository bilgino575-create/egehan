"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/actions/session";
import { logActivity } from "@/lib/activity-log";
import { checkRateLimit } from "@/lib/rate-limit";

const EDITOR_ROLES = ["ADMIN", "EDITOR", "CONTENT_EDITOR"] as const;

const testimonialSchema = z.object({
  name: z.string().min(2).max(120),
  route: z.string().min(1).max(160),
  serviceId: z.string().optional().nullable(),
  text: z.string().min(3).max(2000),
  rating: z.number().int().min(1).max(5),
  photoMediaId: z.string().optional().nullable(),
  active: z.boolean().default(true),
  homepageVisible: z.boolean().default(true),
  approved: z.boolean().default(true),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/admin/content/testimonials");
}

export async function createTestimonial(input: TestimonialInput) {
  const user = await requireUser([...EDITOR_ROLES]);
  const data = testimonialSchema.parse(input);
  const maxOrder = await prisma.testimonial.aggregate({ _max: { order: true } });
  const testimonial = await prisma.testimonial.create({
    data: { ...data, order: (maxOrder._max.order ?? -1) + 1 },
  });
  await logActivity({ userId: user.id, action: "testimonial.create", entityType: "Testimonial", entityId: testimonial.id });
  revalidateAll();
  return testimonial;
}

export async function updateTestimonial(id: string, input: TestimonialInput) {
  const user = await requireUser([...EDITOR_ROLES]);
  const data = testimonialSchema.parse(input);
  const testimonial = await prisma.testimonial.update({ where: { id }, data });
  await logActivity({ userId: user.id, action: "testimonial.update", entityType: "Testimonial", entityId: id });
  revalidateAll();
  return testimonial;
}

export async function deleteTestimonial(id: string) {
  const user = await requireUser([...EDITOR_ROLES]);
  await prisma.testimonial.delete({ where: { id } });
  await logActivity({ userId: user.id, action: "testimonial.delete", entityType: "Testimonial", entityId: id });
  revalidateAll();
}

export async function reorderTestimonials(orderedIds: string[]) {
  const user = await requireUser([...EDITOR_ROLES]);
  await prisma.$transaction(
    orderedIds.map((id, index) => prisma.testimonial.update({ where: { id }, data: { order: index } }))
  );
  await logActivity({ userId: user.id, action: "testimonial.reorder" });
  revalidateAll();
}

const publicTestimonialSchema = z.object({
  name: z.string().min(2).max(120),
  route: z.string().min(1).max(160),
  serviceId: z.string().optional().nullable(),
  text: z.string().min(10).max(1000),
  rating: z.number().int().min(1).max(5),
});

export type PublicTestimonialInput = z.infer<typeof publicTestimonialSchema>;

/**
 * Public review submission — no auth. Always lands as `approved: false` so
 * it never appears on the site until an admin/editor approves it, no
 * matter what the client sends.
 */
export async function createPublicTestimonial(input: PublicTestimonialInput) {
  const parsed = publicTestimonialSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error("Lütfen tüm alanları eksiksiz doldurun.");
  }

  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? "unknown";

  const { allowed } = await checkRateLimit(`testimonial:ip:${ip}`, {
    max: 2,
    windowMs: 60 * 60 * 1000,
  });
  if (!allowed) {
    throw new Error("Çok fazla deneme yapıldı, lütfen daha sonra tekrar deneyin.");
  }

  const maxOrder = await prisma.testimonial.aggregate({ _max: { order: true } });
  const testimonial = await prisma.testimonial.create({
    data: {
      name: parsed.data.name,
      route: parsed.data.route,
      serviceId: parsed.data.serviceId || null,
      text: parsed.data.text,
      rating: parsed.data.rating,
      active: true,
      homepageVisible: true,
      approved: false,
      order: (maxOrder._max.order ?? -1) + 1,
    },
  });

  await logActivity({
    action: "testimonial.publicSubmit",
    entityType: "Testimonial",
    entityId: testimonial.id,
    ip,
  });
  revalidatePath("/admin/content/testimonials");
  return { ok: true };
}

export async function setTestimonialApproval(id: string, approved: boolean) {
  const user = await requireUser([...EDITOR_ROLES]);
  const testimonial = await prisma.testimonial.update({ where: { id }, data: { approved } });
  await logActivity({
    userId: user.id,
    action: approved ? "testimonial.approve" : "testimonial.reject",
    entityType: "Testimonial",
    entityId: id,
  });
  revalidateAll();
  return testimonial;
}
