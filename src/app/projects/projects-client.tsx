"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ProjectWithRelations,
  ProjectFilters,
  ProjectSortOptions,
  ProjectCategory,
} from "@/lib/types";
import { ProjectGrid } from "@/components/features/project-grid";
import { ProjectSearch } from "@/components/features/project-search";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

interface ProjectsPageClientProps {
  initialProjects: ProjectWithRelations[];
  totalCount: number;
  hasMore: boolean;
  categories: (ProjectCategory & { _count?: { projects: number } })[];
  technologies: string[];
  initialFilters: ProjectFilters;
  initialSort: ProjectSortOptions;
  currentPage: number;
}

export function ProjectsPageClient({
  initialProjects,
  totalCount,
  hasMore,
  categories,
  technologies,
  initialFilters,
  initialSort,
  currentPage,
}: ProjectsPageClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Update URL with new search parameters
  const updateURL = useCallback(
    (newFilters: ProjectFilters, newSort?: ProjectSortOptions, page = 1) => {
      const params = new URLSearchParams();

      // Add filters to URL
      if (newFilters.search) params.set("search", newFilters.search);
      if (newFilters.technologies?.length) {
        params.set("technologies", newFilters.technologies.join(","));
      }
      if (newFilters.categories?.length) {
        params.set("categories", newFilters.categories.join(","));
      }
      if (newFilters.status?.length) {
        params.set("status", newFilters.status.join(","));
      }
      if (newFilters.featured !== undefined) {
        params.set("featured", newFilters.featured.toString());
      }

      // Add sort to URL
      const sortToUse = newSort || initialSort;
      if (sortToUse.field !== "createdAt" || sortToUse.direction !== "desc") {
        params.set("sort", `${sortToUse.field}-${sortToUse.direction}`);
      }

      // Add page to URL
      if (page > 1) {
        params.set("page", page.toString());
      }

      // Navigate to new URL
      const newURL = `/projects${params.toString() ? `?${params.toString()}` : ""}`;
      router.push(newURL);
    },
    [router, initialSort]
  );

  const handleFiltersChange = useCallback(
    (filters: ProjectFilters) => {
      setLoading(true);
      updateURL(filters, undefined, 1);
    },
    [updateURL]
  );

  const handleSortChange = useCallback(
    (sort: ProjectSortOptions) => {
      setLoading(true);
      updateURL(initialFilters, sort, 1);
    },
    [updateURL, initialFilters]
  );

  const handleSearchResultClick = useCallback(
    (project: ProjectWithRelations) => {
      router.push(`/projects/${project.slug}`);
    },
    [router]
  );

  return (
    <Container>
      <Section className="space-y-8">
        {/* Search Bar */}
        <div className="mx-auto max-w-2xl">
          <ProjectSearch
            placeholder="SEARCH PROJECTS BY NAME, TECHNOLOGY, OR CATEGORY..."
            showRecentSearches={true}
            showTrendingTechs={true}
            onResultClick={handleSearchResultClick}
          />
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
          <div className="border border-white bg-black p-6">
            <Typography variant="h3" className="text-accent font-mono">
              {totalCount}
            </Typography>
            <Typography variant="sm" className="font-mono text-gray-400">
              TOTAL PROJECTS
            </Typography>
          </div>
          <div className="border border-white bg-black p-6">
            <Typography variant="h3" className="text-accent font-mono">
              {technologies.length}
            </Typography>
            <Typography variant="sm" className="font-mono text-gray-400">
              TECHNOLOGIES
            </Typography>
          </div>
          <div className="border border-white bg-black p-6">
            <Typography variant="h3" className="text-accent font-mono">
              {categories.length}
            </Typography>
            <Typography variant="sm" className="font-mono text-gray-400">
              CATEGORIES
            </Typography>
          </div>
          <div className="border border-white bg-black p-6">
            <Typography variant="h3" className="text-accent font-mono">
              {initialProjects.filter((p) => p.featured).length}
            </Typography>
            <Typography variant="sm" className="font-mono text-gray-400">
              FEATURED
            </Typography>
          </div>
        </div>

        {/* Project Grid */}
        <ProjectGrid
          projects={initialProjects}
          loading={loading}
          viewMode="masonry"
          showFilters={true}
          showSearch={true}
          showSort={true}
          onFiltersChange={handleFiltersChange}
          onSortChange={handleSortChange}
        />

        {/* Pagination */}
        {(currentPage > 1 || hasMore) && (
          <div className="flex items-center justify-center gap-4">
            {currentPage > 1 && (
              <Button
                variant="secondary"
                onClick={() => {
                  setLoading(true);
                  updateURL(initialFilters, initialSort, currentPage - 1);
                }}
                disabled={loading}
              >
                PREVIOUS PAGE
              </Button>
            )}

            <Typography variant="sm" className="font-mono text-gray-400">
              PAGE {currentPage}
            </Typography>

            {hasMore && (
              <Button
                variant="secondary"
                onClick={() => {
                  setLoading(true);
                  updateURL(initialFilters, initialSort, currentPage + 1);
                }}
                disabled={loading}
              >
                NEXT PAGE
              </Button>
            )}
          </div>
        )}

        {/* Categories Overview */}
        {categories.length > 0 && (
          <div className="space-y-6">
            <Typography variant="h4" className="text-white">
              PROJECT CATEGORIES
            </Typography>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    const newFilters = {
                      ...initialFilters,
                      categories: [category.slug],
                    };
                    handleFiltersChange(newFilters);
                  }}
                  className="group hover:border-accent border border-white bg-black p-6 text-left transition-colors"
                >
                  <div className="mb-2 flex items-center gap-3">
                    <div
                      className="h-4 w-4"
                      style={{ backgroundColor: category.color }}
                    />
                    <Typography
                      variant="h6"
                      className="group-hover:text-accent text-white transition-colors"
                    >
                      {category.name.toUpperCase()}
                    </Typography>
                  </div>
                  {category.description && (
                    <Typography variant="sm" className="mb-2 text-gray-400">
                      {category.description}
                    </Typography>
                  )}
                  <Typography variant="xs" className="font-mono text-gray-500">
                    {category._count?.projects || 0} PROJECT
                    {(category._count?.projects || 0) !== 1 ? "S" : ""}
                  </Typography>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Technologies Cloud */}
        {technologies.length > 0 && (
          <div className="space-y-6">
            <Typography variant="h4" className="text-white">
              TECHNOLOGIES USED
            </Typography>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech) => (
                <button
                  key={tech}
                  onClick={() => {
                    const newFilters = {
                      ...initialFilters,
                      technologies: [tech],
                    };
                    handleFiltersChange(newFilters);
                  }}
                  className="hover:bg-accent bg-gray-800 px-3 py-2 font-mono text-sm text-white transition-colors hover:text-black"
                >
                  {tech.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        )}
      </Section>
    </Container>
  );
}
