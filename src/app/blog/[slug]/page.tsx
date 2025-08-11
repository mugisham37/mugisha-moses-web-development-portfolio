import { notFound } from "next/navigation";
import { Metadata } from "next";
import { db } from "@/lib/db";
import { BlogPostContent } from "@/components/blog/blog-post-content";
import { BlogPostHeader } from "@/components/blog/blog-post-header";
import { BlogPostNavigation } from "@/components/blog/blog-post-navigation";
import { BlogPostSidebar } from "@/components/blog/blog-post-sidebar";
import { RelatedPosts } from "@/components/blog/related-posts";
import { BlogPostTracker } from "@/components/blog/blog-post-tracker";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

async function getBlogPost(slug: string) {
  try {
    const post = await db.blogPost.findUnique({
      where: {
        slug,
        status: "PUBLISHED",
        publishedAt: {
          lte: new Date(),
        },
      },
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

async function getRelatedPosts(postId: string, categoryIds: string[]) {
  try {
    const posts = await db.blogPost.findMany({
      where: {
        id: { not: postId },
        status: "PUBLISHED",
        publishedAt: { lte: new Date() },
        categories: {
          some: {
            id: { in: categoryIds },
          },
        },
      },
      include: {
        author: {
          select: { name: true },
        },
        categories: true,
      },
      orderBy: { publishedAt: "desc" },
      take: 3,
    });

    return posts;
  } catch (error) {
    console.error("Failed to fetch related posts:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = await getBlogPost(params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.metaTitle || post.title,
    description:
      post.metaDescription || post.excerpt || post.content.substring(0, 160),
    openGraph: {
      title: post.metaTitle || post.title,
      description:
        post.metaDescription || post.excerpt || post.content.substring(0, 160),
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.author.name || "Anonymous"],
      images: post.ogImage ? [post.ogImage] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle || post.title,
      description:
        post.metaDescription || post.excerpt || post.content.substring(0, 160),
      images: post.ogImage ? [post.ogImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(
    post.id,
    post.categories.map((c) => c.id)
  );

  return (
    <main>
      {/* Analytics Tracker */}
      <BlogPostTracker postId={post.id} />

      {/* Post Header */}
      <Section className="py-20">
        <Container>
          <BlogPostHeader post={post} />
        </Container>
      </Section>

      {/* Post Content */}
      <Section className="border-t-4 border-white py-12">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
            <div className="lg:col-span-3">
              <BlogPostContent post={post} />
            </div>
            <div className="space-y-8">
              <BlogPostSidebar post={post} />
            </div>
          </div>
        </Container>
      </Section>

      {/* Post Navigation */}
      <Section className="border-t-4 border-white py-8">
        <Container>
          <BlogPostNavigation currentSlug={post.slug} />
        </Container>
      </Section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <Section className="border-t-4 border-white py-12">
          <Container>
            <RelatedPosts posts={relatedPosts} />
          </Container>
        </Section>
      )}
    </main>
  );
}
