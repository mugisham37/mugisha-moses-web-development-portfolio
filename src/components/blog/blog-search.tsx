"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BlogPost } from "@/lib/types";

interface SearchResult {
  posts: Array<
    Pick<
      BlogPost,
      "id" | "title" | "slug" | "excerpt" | "publishedAt" | "readingTime"
    > & {
      categories: Array<{ name: string; slug: string; color: string }>;
      tags: Array<{ name: string; slug: string }>;
    }
  >;
}

export function BlogSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") || "");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const searchPosts = async () => {
      if (query.length < 2) {
        setResults(null);
        setShowResults(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `/api/blog/search?q=${encodeURIComponent(query)}`
        );
        if (response.ok) {
          const data = await response.json();
          setResults(data);
          setShowResults(true);
        }
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchPosts, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const params = new URLSearchParams(searchParams);
      params.set("search", query.trim());
      params.delete("page"); // Reset to first page
      router.push(`/blog?${params.toString()}`);
      setShowResults(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults(null);
    setShowResults(false);
    const params = new URLSearchParams(searchParams);
    params.delete("search");
    params.delete("page");
    router.push(`/blog?${params.toString()}`);
    inputRef.current?.focus();
  };

  const handleResultClick = (slug: string) => {
    setShowResults(false);
    router.push(`/blog/${slug}`);
  };

  return (
    <div ref={searchRef} className="relative">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="SEARCH BLOG POSTS..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 font-mono uppercase"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button type="submit" disabled={!query.trim()}>
          SEARCH
        </Button>
      </form>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full right-0 left-0 z-50 mt-2 max-h-96 overflow-y-auto border-4 border-white bg-black">
          {loading ? (
            <div className="p-4 text-center font-mono text-gray-400">
              SEARCHING...
            </div>
          ) : results?.posts.length === 0 ? (
            <div className="p-4 text-center font-mono text-gray-400">
              NO RESULTS FOUND FOR &quot;{query}&quot;
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {results?.posts.map((post) => (
                <button
                  key={post.id}
                  onClick={() => handleResultClick(post.slug)}
                  className="w-full p-4 text-left transition-colors hover:bg-gray-900"
                >
                  <h3 className="mb-1 font-mono font-bold text-white uppercase">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="mb-2 font-mono text-sm text-gray-400">
                      {post.excerpt.substring(0, 100)}...
                    </p>
                  )}
                  <div className="flex items-center gap-4 font-mono text-xs text-gray-500">
                    <span>{post.readingTime} MIN READ</span>
                    {post.categories.length > 0 && (
                      <span>{post.categories[0].name}</span>
                    )}
                  </div>
                </button>
              ))}

              {results && results.posts.length > 0 && (
                <div className="border-t border-gray-800 p-4">
                  <button
                    onClick={() =>
                      handleSearch({ preventDefault: () => {} } as any)
                    }
                    className="w-full text-center font-mono text-yellow-400 uppercase hover:text-yellow-300"
                  >
                    VIEW ALL RESULTS FOR &quot;{query}&quot; →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
