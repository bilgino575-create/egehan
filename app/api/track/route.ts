import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const path = typeof body?.path === "string" ? body.path.slice(0, 300) : "/";
    const referrer = typeof body?.referrer === "string" ? body.referrer.slice(0, 300) : null;

    if (path.startsWith("/admin")) {
      return NextResponse.json({ ok: true });
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";
    const ua = request.headers.get("user-agent") ?? "unknown";
    const dayKey = new Date().toISOString().slice(0, 10);
    const sessionHash = createHash("sha256").update(`${ip}:${ua}:${dayKey}`).digest("hex");

    await prisma.pageView.create({ data: { path, referrer, sessionHash } });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
