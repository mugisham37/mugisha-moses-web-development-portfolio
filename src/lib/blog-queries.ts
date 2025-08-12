import { db } from "./db";
import { BlogPostWithRelations, BlogAnalytics } from "./types";

export async function getAllBlogPosts(): Promise<BlogPostWithRelations[]> {
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
          select: { id: true, postId: true, event: true, metadata: true, createdAt: true },
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
      excerpt: post.excerpt || undefined,
      metaTitle: post.metaTitle || undefined,
      metaDescription: post.metaDescription || undefined,
      ogImage: post.ogImage || undefined,
      publishedAt: post.publishedAt || undefined,
      author: {
        id: post.author.id,
        name: post.author.name,
        email: post.author.email,
      },
      categories: post.categories.map((cat) => ({
        ...cat.category,
        description: cat.category.description || undefined,
      })),
      tags: post.tags.map((tag) => tag.tag),
      analytics: post.analytics as BlogAnalytics[],
    }));
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPostWithRelations | null> {
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
          select: { id: true, postId: true, event: true, metadata: true, createdAt: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!post) return null;

    return {
      ...post,
      excerpt: post.excerpt || undefined,
      metaTitle: post.metaTitle || undefined,
      metaDescription: post.metaDescription || undefined,
      ogImage: post.ogImage || undefined,
      publishedAt: post.publishedAt || undefined,
      author: {
        id: post.author.id,
        name: post.author.name,
        email: post.author.email,
      },
      categories: post.categories.map((cat) => ({
        ...cat.category,
        description: cat.category.description || undefined,
      })),
      tags: post.tags.map((tag) => tag.tag),
      analytics: post.analytics as BlogAnalytics[],
    };
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}

// Alias for backward compatibility
export const getBlogPost = getBlogPostBySlug;
