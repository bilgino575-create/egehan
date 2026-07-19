import { prisma } from "@/lib/prisma";
import ActivityLogTable from "@/components/admin/activity/ActivityLogTable";

export default async function ActivityAdminPage() {
  const logs = await prisma.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { user: { select: { name: true, email: true } } },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-navy-950 dark:text-white">
          Aktivite Günlüğü
        </h1>
        <p className="mt-1 text-sm text-muted">
          Panelde yapılan tüm işlemlerin kaydı.
        </p>
      </div>
      <ActivityLogTable logs={logs} />
    </div>
  );
}
