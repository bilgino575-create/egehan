import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import sharp from "sharp";
import { nanoid } from "nanoid";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-log";

export const runtime = "nodejs";

const EDITOR_ROLES = ["ADMIN", "EDITOR", "CONTENT_EDITOR"];

function sanitizeFolder(folder: string) {
  return folder.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-") || "genel";
}

function slugifyFilename(name: string) {
  const base = name.replace(/\.[^.]+$/, "");
  const map: Record<string, string> = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u", İ: "i" };
  return (
    base
      .toLowerCase()
      .replace(/[çğışöü İ]/g, (ch) => map[ch] ?? ch)
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-") || "dosya"
  );
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Oturum bulunamadı, lütfen tekrar giriş yapın." }, { status: 401 });
    }
    if (!EDITOR_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: "Bu işlem için yetkiniz yok." }, { status: 403 });
    }

    const formData = await request.formData();
    const files = formData.getAll("files").filter((f): f is File => f instanceof File);
    const folder = sanitizeFolder(String(formData.get("folder") ?? "genel"));

    if (files.length === 0) {
      return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 });
    }

    const created = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const originalName = slugifyFilename(file.name || "dosya");

      if (file.type.startsWith("image/")) {
        const { data, info } = await sharp(buffer)
          .rotate()
          .resize({ width: 2000, withoutEnlargement: true })
          .webp({ quality: 82 })
          .toBuffer({ resolveWithObject: true });

        const pathname = `${folder}/${nanoid()}.webp`;
        const blob = await put(pathname, data, { access: "public", contentType: "image/webp" });

        const media = await prisma.media.create({
          data: {
            filename: originalName,
            url: blob.url,
            pathname,
            folder,
            width: info.width,
            height: info.height,
            size: data.length,
            mimeType: "image/webp",
            uploadedById: session.user.id,
          },
        });
        created.push(media);
      } else {
        const ext = file.name.includes(".") ? file.name.slice(file.name.lastIndexOf(".")) : "";
        const pathname = `${folder}/${nanoid()}${ext}`;
        const blob = await put(pathname, buffer, {
          access: "public",
          contentType: file.type || "application/octet-stream",
        });

        const media = await prisma.media.create({
          data: {
            filename: originalName,
            url: blob.url,
            pathname,
            folder,
            size: buffer.length,
            mimeType: file.type || "application/octet-stream",
            uploadedById: session.user.id,
          },
        });
        created.push(media);
      }
    }

    await logActivity({
      userId: session.user.id,
      action: "media.upload",
      entityType: "Media",
      detail: { count: created.length, folder },
    });

    return NextResponse.json({ media: created });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Yükleme sırasında bir hata oluştu." }, { status: 500 });
  }
}
