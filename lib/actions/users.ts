"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/actions/session";
import { logActivity } from "@/lib/activity-log";
import { ForbiddenError } from "@/lib/rbac";

const roleEnum = z.enum(["ADMIN", "EDITOR", "SEO", "CONTENT_EDITOR", "SUPPORT"]);

const createSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(160),
  password: z.string().min(8).max(200),
  role: roleEnum,
});

export async function createUser(input: z.infer<typeof createSchema>) {
  const admin = await requireUser(["ADMIN"]);
  const data = createSchema.parse(input);

  const existing = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
  if (existing) throw new Error("Bu e-posta ile zaten bir kullanıcı var.");

  const passwordHash = await bcrypt.hash(data.password, 12);
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash,
      role: data.role,
    },
  });

  await logActivity({ userId: admin.id, action: "user.create", entityType: "User", entityId: user.id });
  revalidatePath("/admin/users");
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

const updateSchema = z.object({
  name: z.string().min(2).max(120),
  role: roleEnum,
  active: z.boolean(),
});

export async function updateUser(id: string, input: z.infer<typeof updateSchema>) {
  const admin = await requireUser(["ADMIN"]);
  const data = updateSchema.parse(input);

  if (admin.id === id && (!data.active || data.role !== "ADMIN")) {
    throw new ForbiddenError("Kendi hesabınızın yetkisini/durumunu düşüremezsiniz.");
  }

  const user = await prisma.user.update({ where: { id }, data });
  await logActivity({ userId: admin.id, action: "user.update", entityType: "User", entityId: id });
  revalidatePath("/admin/users");
  return user;
}

export async function resetUserPassword(id: string, password: string) {
  const admin = await requireUser(["ADMIN"]);
  if (password.length < 8) throw new Error("Şifre en az 8 karakter olmalı.");

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.update({ where: { id }, data: { passwordHash } });
  await logActivity({ userId: admin.id, action: "user.resetPassword", entityType: "User", entityId: id });
  revalidatePath("/admin/users");
}
