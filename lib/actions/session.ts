import "server-only";
import { headers } from "next/headers";
import { auth } from "@/auth";
import type { Role } from "@/lib/generated/prisma/client";
import { ForbiddenError } from "@/lib/rbac";

export async function requireUser(allowedRoles?: Role[]) {
  const session = await auth();
  if (!session?.user) {
    throw new ForbiddenError("Oturum bulunamadı, lütfen tekrar giriş yapın.");
  }
  if (allowedRoles && !allowedRoles.includes(session.user.role)) {
    throw new ForbiddenError();
  }
  return session.user;
}

export async function requestIp(): Promise<string | null> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    null
  );
}
