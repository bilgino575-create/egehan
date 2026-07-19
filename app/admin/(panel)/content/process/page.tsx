import { prisma } from "@/lib/prisma";
import ProcessManager from "@/components/admin/content/ProcessManager";

export default async function ProcessAdminPage() {
  const steps = await prisma.processStep.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-navy-950 dark:text-white">
          Çalışma Süreci Adımları
        </h1>
        <p className="mt-1 text-sm text-muted">
          Ana sayfadaki çalışma süreci adımlarını ekleyin, düzenleyin, sıralayın.
        </p>
      </div>
      <ProcessManager initialSteps={steps} />
    </div>
  );
}
