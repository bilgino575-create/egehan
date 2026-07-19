import { prisma } from "@/lib/prisma";
import WhyUsManager from "@/components/admin/content/WhyUsManager";

export default async function WhyUsAdminPage() {
  const cards = await prisma.whyUsCard.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-navy-950 dark:text-white">
          Neden Biz Kartları
        </h1>
        <p className="mt-1 text-sm text-muted">
          Ana sayfadaki &ldquo;Neden Biz&rdquo; bölümündeki kartları ekleyin, düzenleyin, sıralayın.
        </p>
      </div>
      <WhyUsManager initialCards={cards} />
    </div>
  );
}
