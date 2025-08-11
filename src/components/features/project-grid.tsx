"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Grid, List, LayoutGrid } from "lucide-react";
import {
  ProjectWithRelations,
  ProjectFilters,
  ProjectSortOptions,
} from "@/lib/types";
import { ProjectCard, ProjectCardSkeleton } from "./project-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

interface ProjectGridProps {
  projects: ProjectWithRelations[];
  loading?: boolean;
  viewMode?: "grid" | "masonry" | "list";
  showFilters?: boolean;
  showSearch?: boolean;
  showSort?: boolean;
  onFiltersChange?: (filters: ProjectFilters) => void;
  onSortChange?: (sort: ProjectSortOptions) => void;
  className?: string;
}

const SORT_OPTIONS: { label: string; value: ProjectSortOptions }[] = [
  { label: "NEWEST FIRST", value: { field: "createdAt", direction: "desc" } },
  { label: "OLDEST FIRST", value: { field: "createdAt", direction: "asc" } },
  { label: "MOST VIEWED", value: { field: "viewCount", direction: "desc" } },
  { label: "MOST LIKED", value: { field: "likeCount", direction: "desc" } },
  { label: "ALPHABETICAL", value: { field: "title", direction: "asc" } },
];

export function ProjectGrid({
  projects,
  loading = false,
  viewMode = "masonry",
  showFilters = true,
  showSearch = true,
  showSort = true,
  onFiltersChange,
  onSortChange,
  className,
}: ProjectGridProps) {
  const [localFilters, setLocalFilters] = useState<ProjectFilters>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentViewMode, setCurrentViewMode] = useState(viewMode);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Extract unique technologies and categories from projects
  const { technologies, categories } = useMemo(() => {
    const techSet = new Set<string>();
    const catMap = new Map<
      string,
      { name: string; slug: string; color: string }
    >();

    projects.forEach((project) => {
      project.technologies.forEach((tech) => techSet.add(tech));
      project.categories.forEach((cat) => {
        catMap.set(cat.slug, {
          name: cat.name,
          slug: cat.slug,
          color: cat.color,
        });
      });
    });

    return {
      technologies: Array.from(techSet).sort(),
      categories: Array.from(catMap.values()).sort((a, b) =>
        a.name.localeCompare(b.name)
      ),
    };
  }, [projects]);

  // Filter projects based on local filters and search
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.technologies.some((tech) =>
            tech.toLowerCase().includes(query)
          ) ||
          project.categories.some((cat) =>
            cat.name.toLowerCase().includes(query)
          );

        if (!matchesSearch) return false;
      }

      // Technology filter
      if (localFilters.technologies?.length) {
        const hasMatchingTech = localFilters.technologies.some((tech) =>
          project.technologies.includes(tech)
        );
        if (!hasMatchingTech) return false;
      }

      // Category filter
      if (localFilters.categories?.length) {
        const hasMatchingCategory = localFilters.categories.some((catSlug) =>
          project.categories.some((cat) => cat.slug === catSlug)
        );
        if (!hasMatchingCategory) return false;
      }

      // Status filter
      if (localFilters.status?.length) {
        if (!localFilters.status.includes(project.status)) return false;
      }

      // Featured filter
      if (localFilters.featured !== undefined) {
        if (project.featured !== localFilters.featured) return false;
      }

      return true;
    });
  }, [projects, localFilters, searchQuery]);

  const handleFilterChange = useCallback(
    (newFilters: ProjectFilters) => {
      setLocalFilters(newFilters);
      onFiltersChange?.(newFilters);
    },
    [onFiltersChange]
  );

  const toggleTechnology = useCallback(
    (tech: string) => {
      const currentTechs = localFilters.technologies || [];
      const newTechs = currentTechs.includes(tech)
        ? currentTechs.filter((t) => t !== tech)
        : [...currentTechs, tech];

      handleFilterChange({ ...localFilters, technologies: newTechs });
    },
    [localFilters, handleFilterChange]
  );

  const toggleCategory = useCallback(
    (catSlug: string) => {
      const currentCats = localFilters.categories || [];
      const newCats = currentCats.includes(catSlug)
        ? currentCats.filter((c) => c !== catSlug)
        : [...currentCats, catSlug];

      handleFilterChange({ ...localFilters, categories: newCats });
    },
    [localFilters, handleFilterChange]
  );

  const clearFilters = useCallback(() => {
    setLocalFilters({});
    setSearchQuery("");
    onFiltersChange?.({});
  }, [onFiltersChange]);

  const getGridClassName = () => {
    switch (currentViewMode) {
      case "list":
        return "space-y-6";
      case "grid":
        return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";
      case "masonry":
        return "columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6";
      default:
        return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header with search and controls */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}
        {showSearch && (
          <div className="relative max-w-md flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="SEARCH PROJECTS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 font-mono uppercase placeholder:text-gray-500"
            />
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex border border-white">
            <Button
              variant={currentViewMode === "grid" ? "accent" : "ghost"}
              size="sm"
              onClick={() => setCurrentViewMode("grid")}
              className="rounded-none border-r border-white"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={currentViewMode === "masonry" ? "accent" : "ghost"}
              size="sm"
              onClick={() => setCurrentViewMode("masonry")}
              className="rounded-none border-r border-white"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={currentViewMode === "list" ? "accent" : "ghost"}
              size="sm"
              onClick={() => setCurrentViewMode("list")}
              className="rounded-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Filter toggle */}
          {showFilters && (
            <Button
              variant={showFilterPanel ? "accent" : "secondary"}
              size="sm"
              onClick={() => setShowFilterPanel(!showFilterPanel)}
            >
              <Filter className="mr-2 h-4 w-4" />
              FILTERS
            </Button>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilterPanel && showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border border-white bg-black p-6"
          >
            <div className="space-y-6">
              {/* Active filters summary */}
              {(localFilters.technologies?.length ||
                localFilters.categories?.length ||
                localFilters.featured !== undefined) && (
                <div className="flex items-center justify-between">
                  <Typography variant="sm" className="font-mono text-gray-400">
                    ACTIVE FILTERS:{" "}
                    {(localFilters.technologies?.length || 0) +
                      (localFilters.categories?.length || 0) +
                      (localFilters.featured !== undefined ? 1 : 0)}
                  </Typography>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    CLEAR ALL
                  </Button>
                </div>
              )}

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Technologies */}
                <div>
                  <Typography variant="h6" className="text-accent mb-3">
                    TECHNOLOGIES
                  </Typography>
                  <div className="flex flex-wrap gap-2">
                    {technologies.map((tech) => (
                      <button
                        key={tech}
                        onClick={() => toggleTechnology(tech)}
                        className={cn(
                          "px-3 py-1 font-mono text-xs font-bold transition-colors",
                          localFilters.technologies?.includes(tech)
                            ? "bg-accent text-black"
                            : "bg-gray-800 text-white hover:bg-gray-700"
                        )}
                      >
                        {tech.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <Typography variant="h6" className="text-accent mb-3">
                    CATEGORIES
                  </Typography>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.slug}
                        onClick={() => toggleCategory(category.slug)}
                        className={cn(
                          "flex w-full items-center gap-2 px-3 py-2 text-left font-mono text-sm transition-colors",
                          localFilters.categories?.includes(category.slug)
                            ? "bg-accent text-black"
                            : "bg-gray-800 text-white hover:bg-gray-700"
                        )}
                      >
                        <div
                          className="h-3 w-3"
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Special filters */}
                <div>
                  <Typography variant="h6" className="text-accent mb-3">
                    SPECIAL
                  </Typography>
                  <div className="space-y-2">
                    <button
                      onClick={() =>
                        handleFilterChange({
                          ...localFilters,
                          featured:
                            localFilters.featured === true ? undefined : true,
                        })
                      }
                      className={cn(
                        "w-full px-3 py-2 text-left font-mono text-sm transition-colors",
                        localFilters.featured === true
                          ? "bg-accent text-black"
                          : "bg-gray-800 text-white hover:bg-gray-700"
                      )}
                    >
                      FEATURED ONLY
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results summary */}
      <div className="flex items-center justify-between">
        <Typography variant="sm" className="font-mono text-gray-400">
          {loading
            ? "LOADING..."
            : `${filteredProjects.length} PROJECT${filteredProjects.length !== 1 ? "S" : ""} FOUND`}
        </Typography>

        {/* Sort dropdown */}
        {showSort && !loading && (
          <select
            onChange={(e) => {
              const sortOption = SORT_OPTIONS.find(
                (opt) => opt.label === e.target.value
              );
              if (sortOption) {
                onSortChange?.(sortOption.value);
              }
            }}
            className="focus:border-accent border border-white bg-black px-3 py-1 font-mono text-sm text-white focus:outline-none"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.label} value={option.label}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Project Grid */}
      <div className={getGridClassName()}>
        {loading ? (
          // Loading skeletons
          Array.from({ length: 6 }).map((_, index) => (
            <ProjectCardSkeleton key={index} />
          ))
        ) : filteredProjects.length > 0 ? (
          // Project cards
          filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={cn(
                currentViewMode === "masonry" && "mb-6 break-inside-avoid"
              )}
            >
              <ProjectCard
                project={project}
                variant={currentViewMode === "list" ? "compact" : "default"}
                showMetrics={true}
                showCategories={true}
                interactive={true}
              />
            </motion.div>
          ))
        ) : (
          // Empty state
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <Typography variant="h4" className="mb-2 text-gray-600">
              NO PROJECTS FOUND
            </Typography>
            <Typography variant="body" className="mb-4 text-gray-500">
              Try adjusting your filters or search terms
            </Typography>
            <Button variant="secondary" onClick={clearFilters}>
              CLEAR FILTERS
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
