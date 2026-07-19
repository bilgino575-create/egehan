import { prisma } from "@/lib/prisma";
import InboxManager from "@/components/admin/inbox/InboxManager";

export default async function InboxAdminPage() {
  const submissions = await prisma.contactSubmission.findMany({
    where: { deleted: false },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-navy-950 dark:text-white">
          Gelen Kutusu
        </h1>
        <p className="mt-1 text-sm text-muted">
          Web sitesinden gelen teklif taleplerini yönetin.
        </p>
      </div>
      <InboxManager initialSubmissions={submissions} />
    </div>
  );
}
