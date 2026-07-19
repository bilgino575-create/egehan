import { prisma } from "@/lib/prisma";
import HeroManager from "@/components/admin/content/HeroManager";

export default async function HeroAdminPage() {
  const [hero, stats, cities] = await Promise.all([
    prisma.heroContent.findUnique({ where: { id: "singleton" } }),
    prisma.stat.findMany({ orderBy: { order: "asc" } }),
    prisma.city.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-navy-950 dark:text-white">
          Ana Sayfa (Hero)
        </h1>
        <p className="mt-1 text-sm text-muted">
          Anasayfa giriş bölümünü, istatistikleri ve hizmet bölgelerini yönetin.
        </p>
      </div>
      <HeroManager initialHero={hero} initialStats={stats} initialCities={cities} />
    </div>
  );
}
