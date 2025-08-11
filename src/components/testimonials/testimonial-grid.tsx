"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TestimonialCard } from "./testimonial-card";
import { StarRating } from "./star-rating";
import type { Testimonial } from "@prisma/client";

interface TestimonialWithAuthor extends Testimonial {
  author?: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  } | null;
}

interface TestimonialGridProps {
  testimonials: TestimonialWithAuthor[];
  showFilters?: boolean;
  itemsPerPage?: number;
  className?: string;
}

type FilterType = "all" | "featured" | "video" | "5-star" | "recent";

export function TestimonialGrid({
  testimonials,
  showFilters = true,
  itemsPerPage = 9,
  className = "",
}: TestimonialGridProps) {
  const [currentFilter, setCurrentFilter] = useState<FilterType>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filters = [
    { key: "all" as FilterType, label: "All", count: testimonials.length },
    {
      key: "featured" as FilterType,
      label: "Featured",
      count: testimonials.filter((t) => t.featured).length,
    },
    {
      key: "video" as FilterType,
      label: "Video",
      count: testimonials.filter((t) => t.videoUrl).length,
    },
    {
      key: "5-star" as FilterType,
      label: "5 Star",
      count: testimonials.filter((t) => t.rating === 5).length,
    },
    {
      key: "recent" as FilterType,
      label: "Recent",
      count: testimonials.filter((t) => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return new Date(t.createdAt) > thirtyDaysAgo;
      }).length,
    },
  ];

  const filteredTestimonials = useMemo(() => {
    let filtered = testimonials;

    switch (currentFilter) {
      case "featured":
        filtered = testimonials.filter((t) => t.featured);
        break;
      case "video":
        filtered = testimonials.filter((t) => t.videoUrl);
        break;
      case "5-star":
        filtered = testimonials.filter((t) => t.rating === 5);
        break;
      case "recent":
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        filtered = testimonials.filter(
          (t) => new Date(t.createdAt) > thirtyDaysAgo
        );
        break;
      default:
        filtered = testimonials;
    }

    return filtered.sort((a, b) => {
      // Featured testimonials first
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;

      // Then by rating
      if (a.rating !== b.rating) return b.rating - a.rating;

      // Finally by date
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [testimonials, currentFilter]);

  const totalPages = Math.ceil(filteredTestimonials.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTestimonials = filteredTestimonials.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleFilterChange = (filter: FilterType) => {
    setCurrentFilter(filter);
    setCurrentPage(1);
  };

  if (testimonials.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="space-y-4">
          <div className="text-6xl">💬</div>
          <h3 className="text-2xl font-bold text-gray-400 uppercase">
            No Testimonials Yet
          </h3>
          <p className="text-gray-500">
            Be the first to experience our elite services and share your success
            story.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Filters */}
      {showFilters && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            {filters.map((filter) => (
              <Button
                key={filter.key}
                variant={currentFilter === filter.key ? "accent" : "secondary"}
                size="sm"
                onClick={() => handleFilterChange(filter.key)}
                className="font-mono text-xs tracking-wider uppercase"
              >
                {filter.label}
                <span className="ml-2 opacity-75">({filter.count})</span>
              </Button>
            ))}
          </div>

          {/* Filter Summary */}
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>
              Showing {paginatedTestimonials.length} of{" "}
              {filteredTestimonials.length} testimonials
            </span>
            <div className="flex items-center gap-2">
              <span>Average rating:</span>
              <StarRating
                rating={
                  filteredTestimonials.reduce((sum, t) => sum + t.rating, 0) /
                    filteredTestimonials.length || 0
                }
                size="sm"
              />
              <span className="font-mono">
                (
                {(
                  filteredTestimonials.reduce((sum, t) => sum + t.rating, 0) /
                    filteredTestimonials.length || 0
                ).toFixed(1)}
                )
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {paginatedTestimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              duration: 0.4,
              delay: index * 0.1,
              layout: { duration: 0.3 },
            }}
          >
            <TestimonialCard
              testimonial={testimonial}
              variant={testimonial.featured ? "featured" : "default"}
              showVideo={true}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="font-mono uppercase"
          >
            ← Previous
          </Button>

          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "accent" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="h-10 w-10 p-0 font-mono"
                >
                  {page}
                </Button>
              );
            })}
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className="font-mono uppercase"
          >
            Next →
          </Button>
        </div>
      )}
    </div>
  );
}
