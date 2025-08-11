"use client";

import { useState, useEffect } from "react";
import { BlogCard } from "./blog-card";
import { BlogPagination } from "./blog-pagination";
import { BlogPost } from "@/lib/types";

interface BlogGridProps {
  searchParams: {
    page?: string;
    category?: string;
    tag?: string;
    search?: string;
  };
}

interface BlogResponse {
  posts: BlogPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export function BlogGrid({ searchParams }: BlogGridProps) {
  const [data, setData] = useState<BlogResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();

        if (searchParams.page) params.set("page", searchParams.page);
        if (searchParams.category)
          params.set("category", searchParams.category);
        if (searchParams.tag) params.set("tag", searchParams.tag);
        if (searchParams.search) params.set("search", searchParams.search);

        const response = await fetch(`/api/blog?${params.toString()}`);
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (error) {
        console.error("Failed to fetch blog posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse border-4 border-white p-6">
            <div className="mb-4 h-4 bg-gray-700"></div>
            <div className="mb-2 h-6 bg-gray-700"></div>
            <div className="mb-4 h-4 bg-gray-700"></div>
            <div className="h-20 bg-gray-700"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!data || data.posts.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="border-4 border-white p-12">
          <h2 className="mb-4 font-mono text-2xl font-bold text-white uppercase">
            NO POSTS FOUND
          </h2>
          <p className="font-mono text-gray-400">
            {searchParams.search
              ? `NO POSTS MATCH "${searchParams.search}"`
              : "NO BLOG POSTS AVAILABLE"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Featured Posts */}
      {data.posts.some((post) => post.featured) && (
        <div className="space-y-6">
          <h2 className="border-b-2 border-white pb-2 font-mono text-2xl font-bold text-white uppercase">
            FEATURED POSTS
          </h2>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {data.posts
              .filter((post) => post.featured)
              .slice(0, 2)
              .map((post) => (
                <BlogCard key={post.id} post={post} variant="featured" />
              ))}
          </div>
        </div>
      )}

      {/* All Posts */}
      <div className="space-y-6">
        <h2 className="border-b-2 border-white pb-2 font-mono text-2xl font-bold text-white uppercase">
          {searchParams.search ? "SEARCH RESULTS" : "ALL POSTS"}
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {data.posts
            .filter(
              (post) =>
                !post.featured ||
                data.posts.filter((p) => p.featured).length <= 2
            )
            .map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
        </div>
      </div>

      {/* Pagination */}
      {data.pagination.pages > 1 && (
        <BlogPagination
          currentPage={data.pagination.page}
          totalPages={data.pagination.pages}
          searchParams={searchParams}
        />
      )}
    </div>
  );
}
