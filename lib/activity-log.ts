import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/lib/generated/prisma/client";

interface LogActivityInput {
  userId?: string | null;
  action: string;
  entityType?: string;
  entityId?: string;
  detail?: Prisma.InputJsonValue;
  ip?: string | null;
}

export async function logActivity(input: LogActivityInput) {
  try {
    await prisma.activityLog.create({
      data: {
        userId: input.userId ?? null,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        detail: input.detail,
        ip: input.ip ?? null,
      },
    });
  } catch {
    // Activity logging must never break the calling mutation.
  }
}
