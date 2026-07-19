import { prisma } from "@/lib/prisma";
import ServicesManager from "@/components/admin/content/ServicesManager";

export default async function ServicesAdminPage() {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-navy-950 dark:text-white">
          Hizmetler
        </h1>
        <p className="mt-1 text-sm text-muted">
          Ana sayfadaki hizmet kartlarını ekleyin, düzenleyin, sıralayın.
        </p>
      </div>
      <ServicesManager initialServices={services} />
    </div>
  );
}
