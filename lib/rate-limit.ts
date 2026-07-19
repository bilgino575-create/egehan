import { prisma } from "@/lib/prisma";

/**
 * DB-backed sliding-window rate limit. In-memory counters don't work on
 * Vercel — each request can land on a different serverless instance with no
 * shared memory — so Postgres is the only state actually shared across them.
 */
export async function checkRateLimit(
  key: string,
  opts: { max: number; windowMs: number }
): Promise<{ allowed: boolean; remaining: number }> {
  const since = new Date(Date.now() - opts.windowMs);

  const count = await prisma.rateLimitEvent.count({
    where: { key, createdAt: { gte: since } },
  });

  if (count >= opts.max) {
    return { allowed: false, remaining: 0 };
  }

  await prisma.rateLimitEvent.create({ data: { key } });

  // Best-effort cleanup of old events for this key so the table doesn't grow unbounded.
  prisma.rateLimitEvent
    .deleteMany({ where: { key, createdAt: { lt: since } } })
    .catch(() => {});

  return { allowed: true, remaining: opts.max - count - 1 };
}
