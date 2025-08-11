import { Suspense } from "react";
import { Metadata } from "next";
import { BlogGrid } from "@/components/blog/blog-grid";
import { BlogSearch } from "@/components/blog/blog-search";
import { BlogFilters } from "@/components/blog/blog-filters";
import { NewsletterSignup } from "@/components/blog/newsletter-signup";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

export const metadata: Metadata = {
  title: "Blog | Developer Portfolio",
  description:
    "Latest insights on web development, technology, and software engineering",
  openGraph: {
    title: "Blog | Developer Portfolio",
    description:
      "Latest insights on web development, technology, and software engineering",
    type: "website",
  },
};

interface BlogPageProps {
  searchParams: {
    page?: string;
    category?: string;
    tag?: string;
    search?: string;
  };
}

export default function BlogPage({ searchParams }: BlogPageProps) {
  return (
    <main>
      {/* Hero Section */}
      <Section className="py-20">
        <Container>
          <div className="text-center">
            <h1 className="mb-6 font-mono text-6xl font-bold tracking-wider text-white uppercase">
              BLOG
            </h1>
            <p className="mx-auto max-w-2xl font-mono text-xl text-gray-400">
              INSIGHTS ON WEB DEVELOPMENT, TECHNOLOGY, AND SOFTWARE ENGINEERING
            </p>
          </div>
        </Container>
      </Section>

      {/* Search and Filters */}
      <Section className="border-t-4 border-white py-12">
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            <div className="lg:col-span-3">
              <BlogSearch />
            </div>
            <div className="space-y-8">
              <Suspense
                fallback={
                  <div className="font-mono text-white">LOADING FILTERS...</div>
                }
              >
                <BlogFilters />
              </Suspense>
              <NewsletterSignup />
            </div>
          </div>
        </Container>
      </Section>

      {/* Blog Posts */}
      <Section className="py-12">
        <Container>
          <Suspense
            fallback={
              <div className="py-12 text-center font-mono text-white">
                LOADING BLOG POSTS...
              </div>
            }
          >
            <BlogGrid searchParams={searchParams} />
          </Suspense>
        </Container>
      </Section>
    </main>
  );
}
