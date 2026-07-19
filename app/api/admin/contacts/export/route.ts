import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const STAFF_ROLES = ["ADMIN", "EDITOR", "SUPPORT"];

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Oturum bulunamadı, lütfen tekrar giriş yapın." }, { status: 401 });
  }
  if (!STAFF_ROLES.includes(session.user.role)) {
    return NextResponse.json({ error: "Bu işlem için yetkiniz yok." }, { status: 403 });
  }

  try {
    const submissions = await prisma.contactSubmission.findMany({
      where: { deleted: false },
      orderBy: { createdAt: "desc" },
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("İletişim Formları");

    sheet.columns = [
      { header: "Ad", key: "name", width: 22 },
      { header: "Telefon", key: "phone", width: 16 },
      { header: "E-posta", key: "email", width: 24 },
      { header: "Nereden", key: "fromCity", width: 16 },
      { header: "Nereye", key: "toCity", width: 16 },
      { header: "Hizmet", key: "service", width: 20 },
      { header: "Mesaj", key: "message", width: 40 },
      { header: "IP", key: "ip", width: 16 },
      { header: "Tarih", key: "createdAt", width: 20 },
      { header: "Okundu", key: "read", width: 10 },
      { header: "Yanıtlandı", key: "replied", width: 12 },
    ];

    sheet.getRow(1).font = { bold: true };

    for (const s of submissions) {
      sheet.addRow({
        name: s.name,
        phone: s.phone,
        email: s.email ?? "",
        fromCity: s.fromCity ?? "",
        toCity: s.toCity ?? "",
        service: s.service ?? "",
        message: s.message ?? "",
        ip: s.ip ?? "",
        createdAt: s.createdAt.toLocaleString("tr-TR"),
        read: s.read ? "Evet" : "Hayır",
        replied: s.replied ? "Evet" : "Hayır",
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="iletisim-formlari.xlsx"',
      },
    });
  } catch (err) {
    console.error("Export error:", err);
    return NextResponse.json({ error: "Dışa aktarma sırasında bir hata oluştu." }, { status: 500 });
  }
}
