"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  searchParams: {
    page?: string;
    category?: string;
    tag?: string;
    search?: string;
  };
}

export function BlogPagination({
  currentPage,
  totalPages,
  searchParams,
}: BlogPaginationProps) {
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();

    if (page > 1) params.set("page", page.toString());
    if (searchParams.category) params.set("category", searchParams.category);
    if (searchParams.tag) params.set("tag", searchParams.tag);
    if (searchParams.search) params.set("search", searchParams.search);

    const queryString = params.toString();
    return `/blog${queryString ? `?${queryString}` : ""}`;
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link href={createPageUrl(currentPage - 1)}>
          <Button variant="ghost" className="font-mono">
            <ChevronLeft className="mr-1 h-4 w-4" />
            PREV
          </Button>
        </Link>
      ) : (
        <Button variant="ghost" disabled className="font-mono">
          <ChevronLeft className="mr-1 h-4 w-4" />
          PREV
        </Button>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {visiblePages.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`dots-${index}`}
                className="px-3 py-2 font-mono text-gray-400"
              >
                ...
              </span>
            );
          }

          const pageNumber = page as number;
          const isActive = pageNumber === currentPage;

          return (
            <Link key={pageNumber} href={createPageUrl(pageNumber)}>
              <Button
                variant={isActive ? "primary" : "ghost"}
                size="sm"
                className={`min-w-[40px] font-mono ${
                  isActive
                    ? "border-2 border-white bg-white text-black"
                    : "text-white hover:bg-white hover:text-black"
                }`}
              >
                {pageNumber}
              </Button>
            </Link>
          );
        })}
      </div>

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link href={createPageUrl(currentPage + 1)}>
          <Button variant="ghost" className="font-mono">
            NEXT
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      ) : (
        <Button variant="ghost" disabled className="font-mono">
          NEXT
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
