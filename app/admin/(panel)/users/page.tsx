import { prisma } from "@/lib/prisma";
import UsersManager from "@/components/admin/users/UsersManager";

export default async function UsersAdminPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      lastLoginAt: true,
      createdAt: true,
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-navy-950 dark:text-white">
          Kullanıcılar
        </h1>
        <p className="mt-1 text-sm text-muted">
          Admin panel kullanıcılarını ve rollerini yönetin.
        </p>
      </div>
      <UsersManager initialUsers={users} />
    </div>
  );
}
