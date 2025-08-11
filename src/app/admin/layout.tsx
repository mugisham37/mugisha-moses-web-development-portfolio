import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

export const metadata: Metadata = {
  title: "Admin Dashboard | Brutalist Developer Portfolio",
  description: "Content management system",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex">
        <AdminSidebar />
        <div className="flex flex-1 flex-col">
          <AdminHeader user={session.user} />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
