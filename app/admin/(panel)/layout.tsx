import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AdminShell from "@/components/admin/AdminShell";
import { ToastProvider } from "@/components/admin/Toast";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <ToastProvider>
      <AdminShell user={session.user}>{children}</AdminShell>
    </ToastProvider>
  );
}
