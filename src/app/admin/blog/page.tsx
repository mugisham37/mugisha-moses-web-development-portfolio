import { Suspense } from "react";
import { BlogManagementInterface } from "@/components/admin/blog-management-interface";

export default function AdminBlogPage() {
  return (
    <div className="space-y-6">
      <div className="border-4 border-white p-6">
        <h1 className="mb-2 font-mono text-4xl font-bold tracking-wider text-white uppercase">
          BLOG MANAGEMENT
        </h1>
        <p className="font-mono text-gray-400">
          CREATE, EDIT, AND MANAGE BLOG POSTS
        </p>
      </div>

      <Suspense
        fallback={
          <div className="font-mono text-white">LOADING BLOG POSTS...</div>
        }
      >
        <BlogManagementInterface />
      </Suspense>
    </div>
  );
}
