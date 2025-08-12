import { db } from "./db";
import { BlogPost, BlogCategory, BlogTag, BlogAnalytics } from "./types";

// Extended blog post type for queries
export interface BlogPostWithRelations extends Omit<BlogPost, 'categories' | 'tags'> {
  author: {
    id: string;
    name: string | null;
    email: string;
  };
  categories: BlogCategory[];
  tags: BlogTag[];
  analytics?: BlogAnalytics[];
}

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
