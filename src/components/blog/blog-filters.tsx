"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  _count: { posts: number };
}

interface Tag {
  id: string;
  name: string;
  slug: string;
  _count: { posts: number };
}

export function BlogFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedCategory = searchParams.get("category");
  const selectedTag = searchParams.get("tag");

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [categoriesRes, tagsRes] = await Promise.all([
          fetch("/api/blog/categories"),
          fetch("/api/blog/tags"),
        ]);

        if (categoriesRes.ok && tagsRes.ok) {
          const [categoriesData, tagsData] = await Promise.all([
            categoriesRes.json(),
            tagsRes.json(),
          ]);

          setCategories(categoriesData.categories);
          setTags(tagsData.tags);
        }
      } catch (error) {
        console.error("Failed to fetch filters:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilters();
  }, []);

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.delete("page"); // Reset to first page
    router.push(`/blog?${params.toString()}`);
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("category");
    params.delete("tag");
    params.delete("page");
    router.push(`/blog?${params.toString()}`);
  };

  const hasActiveFilters = selectedCategory || selectedTag;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse border-4 border-white p-4">
          <div className="mb-4 h-6 bg-gray-700"></div>
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-700"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-white" />
          <h3 className="font-mono font-bold text-white uppercase">FILTERS</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-gray-400 hover:text-white"
          >
            <X className="mr-1 h-3 w-3" />
            CLEAR
          </Button>
        )}
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="border-4 border-white p-4">
          <h4 className="mb-4 font-mono font-bold text-white uppercase">
            CATEGORIES
          </h4>
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() =>
                  updateFilter(
                    "category",
                    selectedCategory === category.slug ? null : category.slug
                  )
                }
                className={`w-full p-2 text-left font-mono text-sm transition-colors ${
                  selectedCategory === category.slug
                    ? "bg-white text-black"
                    : "text-white hover:bg-gray-900"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="uppercase">{category.name}</span>
                  <span className="text-xs">({category._count.posts})</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="border-4 border-white p-4">
          <h4 className="mb-4 font-mono font-bold text-white uppercase">
            TAGS
          </h4>
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 20).map((tag) => (
              <button
                key={tag.id}
                onClick={() =>
                  updateFilter(
                    "tag",
                    selectedTag === tag.slug ? null : tag.slug
                  )
                }
                className={`border px-2 py-1 font-mono text-xs transition-colors ${
                  selectedTag === tag.slug
                    ? "border-yellow-400 bg-yellow-400 text-black"
                    : "border-gray-600 text-gray-400 hover:border-white hover:text-white"
                }`}
              >
                #{tag.name} ({tag._count.posts})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="border-2 border-yellow-400 p-4">
          <h4 className="mb-2 font-mono font-bold text-yellow-400 uppercase">
            ACTIVE FILTERS
          </h4>
          <div className="space-y-2">
            {selectedCategory && (
              <div className="flex items-center justify-between text-sm">
                <span className="font-mono text-white">
                  CATEGORY: {selectedCategory.toUpperCase()}
                </span>
                <button
                  onClick={() => updateFilter("category", null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            {selectedTag && (
              <div className="flex items-center justify-between text-sm">
                <span className="font-mono text-white">
                  TAG: #{selectedTag.toUpperCase()}
                </span>
                <button
                  onClick={() => updateFilter("tag", null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
