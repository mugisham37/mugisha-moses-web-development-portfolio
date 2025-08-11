import { db } from "./db";
import { BlogPost, BlogCategory, BlogTag } from "./types";

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const posts = await db.blogPost.findMany({
      where: {
        status: "PUBLISHED",
      },
      include: {
        author: true,
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        analytics: {
          select: { event: true, metadata: true, createdAt: true },
          take: 5,
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: {
        publishedAt: "desc",
      },
    });

    return posts.map((post) => ({
      ...post,
      categories: post.categories.map((cat) => cat.category),
      tags: post.tags.map((tag) => tag.tag),
    }));
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  try {
    const post = await db.blogPost.findUnique({
      where: { slug },
      include: {
        author: true,
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        analytics: {
          select: { event: true, metadata: true, createdAt: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!post) return null;

    return {
      ...post,
      categories: post.categories.map((cat) => cat.category),
      tags: post.tags.map((tag) => tag.tag),
    };
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}
