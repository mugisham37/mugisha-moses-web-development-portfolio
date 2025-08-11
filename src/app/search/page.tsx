import { Suspense } from "react";
import { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Typography } from "@/components/ui/typography";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { StructuredData } from "@/components/seo/structured-data";

export const metadata: Metadata = generateSEOMetadata({
  title: "Search",
  description:
    "Search through projects, blog posts, and content on the developer portfolio.",
  keywords: ["search", "projects", "blog", "portfolio", "developer"],
  url: "/search",
  type: "website",
  noIndex: true, // Search pages typically shouldn't be indexed
});

interface SearchPageProps {
  searchParams: {
    q?: string;
    type?: string;
  };
}

function SearchResults({ query, type }: { query?: string; type?: string }) {
  if (!query) {
    return (
      <div className="py-12 text-center">
        <Typography variant="h3" className="mb-4 text-white">
          ENTER A SEARCH TERM
        </Typography>
        <Typography variant="body" className="text-gray-400">
          Use the search box above to find projects, blog posts, and other
          content.
        </Typography>
      </div>
    );
  }

  // This would be implemented with actual search functionality
  return (
    <div className="py-12 text-center">
      <Typography variant="h3" className="mb-4 text-white">
        SEARCH RESULTS FOR "{query.toUpperCase()}"
      </Typography>
      <Typography variant="body" className="text-gray-400">
        Search functionality will be implemented in a future update.
      </Typography>
    </div>
  );
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const { q: query, type } = searchParams;

  const breadcrumbs = [{ name: "Search", url: "/search", current: true }];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    name: "Search Results",
    description: "Search results for the developer portfolio",
    url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/search`,
    ...(query && {
      mainEntity: {
        "@type": "SearchAction",
        query: query,
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/search?q=${query}`,
        },
      },
    }),
  };

  return (
    <main className="min-h-screen bg-black pt-20">
      <StructuredData data={structuredData} />

      <Container>
        <Section className="py-12">
          <div className="space-y-8">
            <Breadcrumbs items={breadcrumbs} />

            <div className="space-y-4">
              <Typography variant="display" className="text-white">
                SEARCH
              </Typography>
              <Typography variant="h6" className="max-w-3xl text-gray-300">
                Find projects, blog posts, and other content across the
                portfolio.
              </Typography>
            </div>

            {/* Search Form */}
            <form method="GET" className="max-w-2xl">
              <div className="flex gap-4">
                <input
                  type="text"
                  name="q"
                  defaultValue={query}
                  placeholder="SEARCH PROJECTS, BLOG POSTS..."
                  className="flex-1 border-4 border-white bg-black px-4 py-3 font-mono text-white uppercase placeholder-gray-500 focus:border-yellow-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="border-4 border-yellow-400 bg-yellow-400 px-8 py-3 font-mono font-bold text-black uppercase transition-colors duration-200 hover:bg-black hover:text-yellow-400"
                >
                  SEARCH
                </button>
              </div>
            </form>

            {/* Search Results */}
            <Suspense
              fallback={
                <div className="py-12 text-center">
                  <Typography variant="body" className="text-gray-400">
                    SEARCHING...
                  </Typography>
                </div>
              }
            >
              <SearchResults query={query} type={type} />
            </Suspense>
          </div>
        </Section>
      </Container>
    </main>
  );
}
