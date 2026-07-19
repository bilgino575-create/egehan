import type { Role } from "@/lib/generated/prisma/client";

/** Route-prefix -> allowed roles. Checked in middleware.ts (Edge, JWT-only, no DB hit). */
export const ROUTE_ROLES: Record<string, Role[]> = {
  "/admin/users": ["ADMIN"],
  "/admin/settings": ["ADMIN"],
  "/admin/activity": ["ADMIN"],
  "/admin/seo": ["ADMIN", "SEO"],
  "/admin/inbox": ["ADMIN", "EDITOR", "SUPPORT"],
  "/admin/media": ["ADMIN", "EDITOR", "CONTENT_EDITOR"],
  "/admin/content": ["ADMIN", "EDITOR", "CONTENT_EDITOR"],
};

const ALL_ROLES: Role[] = ["ADMIN", "EDITOR", "SEO", "CONTENT_EDITOR", "SUPPORT"];

export function rolesAllowedForPath(pathname: string): Role[] {
  const match = Object.keys(ROUTE_ROLES)
    .filter((prefix) => pathname.startsWith(prefix))
    .sort((a, b) => b.length - a.length)[0];
  return match ? ROUTE_ROLES[match] : ALL_ROLES;
}

export class ForbiddenError extends Error {
  constructor(message = "Bu işlem için yetkiniz yok.") {
    super(message);
    this.name = "ForbiddenError";
  }
}

/** Use inside Server Actions to guard mutations by role. */
export function assertRole(role: Role, allowed: Role[]) {
  if (!allowed.includes(role)) {
    throw new ForbiddenError();
  }
}
