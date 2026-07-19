import { prisma } from "@/lib/prisma";
import TestimonialsManager from "@/components/admin/content/TestimonialsManager";

export default async function TestimonialsAdminPage() {
  const [testimonials, services] = await Promise.all([
    prisma.testimonial.findMany({
      orderBy: { order: "asc" },
      include: { service: { select: { title: true } } },
    }),
    prisma.service.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      select: { id: true, title: true },
    }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-navy-950 dark:text-white">
          Müşteri Yorumları
        </h1>
        <p className="mt-1 text-sm text-muted">
          Ana sayfada gösterilen müşteri yorumlarını yönetin, onaylayın, sıralayın.
        </p>
      </div>
      <TestimonialsManager initialTestimonials={testimonials} services={services} />
    </div>
  );
}
