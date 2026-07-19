import { prisma } from "@/lib/prisma";
import NavManager from "@/components/admin/content/NavManager";

export default async function NavAdminPage() {
  const items = await prisma.navItem.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-navy-950 dark:text-white">
          Menü Yönetimi
        </h1>
        <p className="mt-1 text-sm text-muted">
          Site üst menüsündeki bağlantıları ekleyin, düzenleyin, sıralayın.
        </p>
      </div>
      <NavManager initialItems={items} />
    </div>
  );
}
