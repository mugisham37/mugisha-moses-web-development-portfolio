import { Metadata } from "next/server";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { TestimonialManagement } from "@/components/admin/testimonial-management";

export const metadata: Metadata = {
  title: "Testimonial Management | Admin Dashboard",
  description: "Manage client testimonials, reviews, and social proof content.",
};

export default async function AdminTestimonialsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/signin");
  }

  return (
    <div className="space-y-8">
      <TestimonialManagement />
    </div>
  );
}
