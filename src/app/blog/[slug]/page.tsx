import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getBlogPost } from "@/lib/blog-queries";
import { db } from "@/lib/db";
import { BlogPostContent } from "@/components/blog/blog-post-content";
import { BlogPostHeader } from "@/components/blog/blog-post-header";
import { BlogPostNavigation } from "@/components/blog/blog-post-navigation";
import { BlogPostSidebar } from "@/components/blog/blog-post-sidebar";
import { RelatedPosts } from "@/components/blog/related-posts";
import { BlogPostTracker } from "@/components/blog/blog-post-tracker";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import {
  generateMetadata as generateSEOMetadata,
  generateBlogPostJsonLd,
} from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { StructuredData } from "@/components/seo/structured-data";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
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
            categoryId: { in: categoryIds },
          },
        },
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
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
      },
      orderBy: { publishedAt: "desc" },
      take: 3,
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
    }));
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

  return generateSEOMetadata({
    title: post.metaTitle || post.title,
    description:
      post.metaDescription || post.excerpt || post.content.substring(0, 160),
    keywords: [
      ...post.tags.map((tag) => tag.name),
      ...post.categories.map((cat) => cat.name),
      "blog",
      "tutorial",
      "web development",
    ],
    image: post.ogImage,
    url: `/blog/${post.slug}`,
    type: "article",
    publishedTime: post.publishedAt?.toISOString(),
    modifiedTime: post.updatedAt.toISOString(),
    author: post.author.name || "Anonymous",
    section: post.categories[0]?.name || "Blog",
    tags: post.tags.map((tag) => tag.name),
  });
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

  const breadcrumbs = [
    { name: "Blog", url: "/blog" },
    { name: post.title, url: `/blog/${post.slug}`, current: true },
  ];

  const blogPostJsonLd = generateBlogPostJsonLd({
    ...post,
    excerpt: post.excerpt || undefined,
    publishedAt: post.publishedAt || undefined,
    categories: post.categories.map((cat) => ({
      name: cat.name,
      slug: cat.slug,
    })),
    tags: post.tags.map((tag) => ({ name: tag.name, slug: tag.slug })),
  });

  return (
    <main>
      <StructuredData data={blogPostJsonLd} />

      {/* Analytics Tracker */}
      <BlogPostTracker postId={post.id} />

      {/* Post Header */}
      <Section className="py-20">
        <Container>
          <div className="space-y-6">
            <Breadcrumbs items={breadcrumbs} />
            <BlogPostHeader post={post} />
          </div>
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
