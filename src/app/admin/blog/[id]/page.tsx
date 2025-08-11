import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { BlogEditor } from "@/components/admin/blog-editor";

interface EditBlogPostPageProps {
  params: {
    id: string;
  };
}

async function getBlogPost(id: string) {
  try {
    const post = await db.blogPost.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        categories: true,
        tags: true,
      },
    });

    return post;
  } catch (error) {
    console.error("Failed to fetch blog post:", error);
    return null;
  }
}

export default async function EditBlogPostPage({
  params,
}: EditBlogPostPageProps) {
  const post = await getBlogPost(params.id);

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="border-4 border-white p-6">
        <h1 className="mb-2 font-mono text-4xl font-bold tracking-wider text-white uppercase">
          EDIT BLOG POST
        </h1>
        <p className="font-mono text-gray-400">MODIFY EXISTING BLOG POST</p>
      </div>

      <BlogEditor post={post} />
    </div>
  );
}
