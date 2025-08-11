import { BlogEditor } from "@/components/admin/blog-editor";

export default function NewBlogPostPage() {
  return (
    <div className="space-y-6">
      <div className="border-4 border-white p-6">
        <h1 className="mb-2 font-mono text-4xl font-bold tracking-wider text-white uppercase">
          CREATE BLOG POST
        </h1>
        <p className="font-mono text-gray-400">
          ADD NEW BLOG POST TO PORTFOLIO
        </p>
      </div>

      <BlogEditor />
    </div>
  );
}
