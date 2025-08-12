import { Suspense } from "react";
import { Metadata } from "next";
import {
  getProjects,
  getProjectCategories,
  getProjectTechnologies,
} from "@/lib/project-queries";
import { ProjectsPageClient } from "./projects-client";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Typography } from "@/components/ui/typography";
import { ProjectCardSkeleton } from "@/components/features/project-card";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { StructuredData } from "@/components/seo/structured-data";

export const metadata: Metadata = generateSEOMetadata({
  title: "Projects",
  description:
    "Explore my latest work and technical achievements in full-stack development, showcasing brutalist design principles and cutting-edge technologies.",
  keywords: [
    "projects",
    "portfolio",
    "web development",
    "full-stack",
    "react",
    "next.js",
    "typescript",
    "brutalist design",
  ],
  url: "/projects",
  type: "website",
});

interface ProjectsPageProps {
  searchParams: {
    search?: string;
    technologies?: string;
    categories?: string;
    status?: string;
    featured?: string;
    sort?: string;
    page?: string;
  };
}

async function ProjectsContent({ searchParams }: ProjectsPageProps) {
  // Parse search parameters
  const filters = {
    search: searchParams.search,
    technologies: searchParams.technologies?.split(",").filter(Boolean),
    categories: searchParams.categories?.split(",").filter(Boolean),
    status: searchParams.status?.split(",").filter(Boolean) as ("DRAFT" | "ACTIVE" | "ARCHIVED" | "FEATURED")[],
    featured: searchParams.featured === "true" ? true : undefined,
  };

  const sort = searchParams.sort
    ? (() => {
        const [field, direction] = searchParams.sort.split("-");
        return { field: field as "createdAt" | "updatedAt" | "viewCount" | "likeCount" | "title", direction: direction as "asc" | "desc" };
      })()
    : { field: "createdAt" as const, direction: "desc" as const };

  const page = parseInt(searchParams.page || "1", 10);
  const limit = 12;
  const offset = (page - 1) * limit;

  // Fetch data in parallel
  const [projectsResult, categories, technologies] = await Promise.all([
    getProjects({
      filters,
      sort,
      limit,
      offset,
    }),
    getProjectCategories(),
    getProjectTechnologies(),
  ]);

  return (
    <ProjectsPageClient
      initialProjects={projectsResult.projects}
      totalCount={projectsResult.totalCount}
      hasMore={projectsResult.hasMore}
      categories={categories}
      technologies={technologies}
      initialFilters={filters}
      initialSort={sort}
      currentPage={page}
    />
  );
}

function ProjectsLoading() {
  return (
    <Container>
      <Section>
        <div className="space-y-8">
          {/* Header skeleton */}
          <div className="space-y-4">
            <div className="h-12 w-64 animate-pulse bg-gray-800" />
            <div className="h-6 w-96 animate-pulse bg-gray-800" />
          </div>

          {/* Controls skeleton */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="h-10 w-80 animate-pulse bg-gray-800" />
            <div className="flex gap-2">
              <div className="h-10 w-32 animate-pulse bg-gray-800" />
              <div className="h-10 w-24 animate-pulse bg-gray-800" />
            </div>
          </div>

          {/* Grid skeleton */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <ProjectCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </Section>
    </Container>
  );
}

export default function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const breadcrumbs = [{ name: "Projects", url: "/projects", current: true }];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Projects",
    description:
      "Explore my latest work and technical achievements in full-stack development",
    url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/projects`,
    mainEntity: {
      "@type": "ItemList",
      name: "Developer Projects",
      description:
        "A collection of web development projects showcasing technical expertise",
    },
  };

  return (
    <main className="min-h-screen bg-black pt-20">
      <StructuredData data={structuredData} />

      {/* Page Header */}
      <Container>
        <Section className="py-12">
          <div className="space-y-6">
            <Breadcrumbs items={breadcrumbs} />
            <div className="space-y-4">
              <Typography variant="display" className="text-white">
                PROJECTS
              </Typography>
              <Typography variant="h6" className="max-w-3xl text-gray-300">
                Explore my latest work and technical achievements in full-stack
                development, showcasing brutalist design principles and
                cutting-edge technologies.
              </Typography>
            </div>
          </div>
        </Section>
      </Container>

      {/* Projects Content */}
      <Suspense fallback={<ProjectsLoading />}>
        <ProjectsContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
