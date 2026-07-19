import { prisma } from "@/lib/prisma";
import FaqManager from "@/components/admin/content/FaqManager";

export default async function FaqAdminPage() {
  const faqs = await prisma.faq.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-navy-950 dark:text-white">
          Sık Sorulan Sorular
        </h1>
        <p className="mt-1 text-sm text-muted">
          Sık sorulan soruları ve cevaplarını ekleyin, düzenleyin, sıralayın.
        </p>
      </div>
      <FaqManager initialFaqs={faqs} />
    </div>
  );
}
