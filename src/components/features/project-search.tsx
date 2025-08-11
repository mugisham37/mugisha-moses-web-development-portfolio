"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";
import { ProjectWithRelations } from "@/lib/types";
import { searchProjects } from "@/lib/project-queries";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ProjectSearchProps {
  placeholder?: string;
  showRecentSearches?: boolean;
  showTrendingTechs?: boolean;
  onResultClick?: (project: ProjectWithRelations) => void;
  className?: string;
}

interface SearchResult {
  projects: ProjectWithRelations[];
  totalCount: number;
  hasMore: boolean;
}

const TRENDING_TECHNOLOGIES = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Python",
  "PostgreSQL",
  "Tailwind CSS",
  "Framer Motion",
];

export function ProjectSearch({
  placeholder = "SEARCH PROJECTS...",
  showRecentSearches = true,
  showTrendingTechs = true,
  onResultClick,
  className,
}: ProjectSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("project-search-recent");
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved));
        } catch (error) {
          console.error("Failed to parse recent searches:", error);
        }
      }
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setRecentSearches((prev) => {
      const updated = [
        searchQuery,
        ...prev.filter((s) => s !== searchQuery),
      ].slice(0, 5);
      if (typeof window !== "undefined") {
        localStorage.setItem("project-search-recent", JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  // Debounced search function
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults(null);
      return;
    }

    setLoading(true);
    try {
      const result = await searchProjects(searchQuery, {}, 8);
      setResults(result);
    } catch (error) {
      console.error("Search failed:", error);
      setResults({ projects: [], totalCount: 0, hasMore: false });
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle input change with debouncing
  const handleInputChange = useCallback(
    (value: string) => {
      setQuery(value);
      setSelectedIndex(-1);

      // Clear previous debounce
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      // Debounce search
      debounceRef.current = setTimeout(() => {
        performSearch(value);
      }, 300);
    },
    [performSearch]
  );

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showResults || !results) return;

      const totalItems = results.projects.length;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : prev));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && results.projects[selectedIndex]) {
            const project = results.projects[selectedIndex];
            saveRecentSearch(query);
            onResultClick?.(project);
            setShowResults(false);
            setQuery("");
          } else if (query.trim()) {
            saveRecentSearch(query);
            // Navigate to projects page with search
            window.location.href = `/projects?search=${encodeURIComponent(query)}`;
          }
          break;
        case "Escape":
          setShowResults(false);
          inputRef.current?.blur();
          break;
      }
    },
    [
      showResults,
      results,
      selectedIndex,
      query,
      saveRecentSearch,
      onResultClick,
    ]
  );

  // Handle click outside
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

  // Handle recent search click
  const handleRecentSearchClick = useCallback(
    (searchQuery: string) => {
      setQuery(searchQuery);
      performSearch(searchQuery);
      inputRef.current?.focus();
    },
    [performSearch]
  );

  // Handle trending tech click
  const handleTrendingTechClick = useCallback(
    (tech: string) => {
      setQuery(tech);
      performSearch(tech);
      inputRef.current?.focus();
    },
    [performSearch]
  );

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery("");
    setResults(null);
    setShowResults(false);
    inputRef.current?.focus();
  }, []);

  return (
    <div ref={searchRef} className={cn("relative", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setShowResults(true)}
          onKeyDown={handleKeyDown}
          className="pr-10 pl-10 font-mono uppercase placeholder:text-gray-500"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 left-0 z-50 mt-2"
          >
            <Card className="max-h-96 overflow-y-auto border-white bg-black">
              {loading ? (
                // Loading state
                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="border-accent h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                    <Typography
                      variant="sm"
                      className="font-mono text-gray-400"
                    >
                      SEARCHING...
                    </Typography>
                  </div>
                </div>
              ) : results && results.projects.length > 0 ? (
                // Search results
                <div className="p-2">
                  <div className="mb-2 px-2">
                    <Typography
                      variant="sm"
                      className="font-mono text-gray-400"
                    >
                      {results.totalCount} PROJECT
                      {results.totalCount !== 1 ? "S" : ""} FOUND
                    </Typography>
                  </div>
                  {results.projects.map((project, index) => (
                    <Link
                      key={project.id}
                      href={`/projects/${project.slug}`}
                      onClick={() => {
                        saveRecentSearch(query);
                        onResultClick?.(project);
                        setShowResults(false);
                        setQuery("");
                      }}
                      className={cn(
                        "block rounded p-3 transition-colors",
                        selectedIndex === index
                          ? "bg-accent text-black"
                          : "hover:bg-gray-900"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {project.thumbnail && (
                          <div className="h-12 w-12 flex-shrink-0 overflow-hidden bg-gray-800">
                            <img
                              src={project.thumbnail}
                              alt={project.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <Typography
                            variant="sm"
                            className={cn(
                              "line-clamp-1 font-bold",
                              selectedIndex === index
                                ? "text-black"
                                : "text-white"
                            )}
                          >
                            {project.title}
                          </Typography>
                          <Typography
                            variant="xs"
                            className={cn(
                              "mt-1 line-clamp-2",
                              selectedIndex === index
                                ? "text-black/70"
                                : "text-gray-400"
                            )}
                          >
                            {project.description}
                          </Typography>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {project.technologies.slice(0, 3).map((tech) => (
                              <span
                                key={tech}
                                className={cn(
                                  "px-1 py-0.5 font-mono text-xs",
                                  selectedIndex === index
                                    ? "bg-black/20 text-black"
                                    : "bg-gray-800 text-gray-300"
                                )}
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                  {results.hasMore && (
                    <div className="mt-2 px-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="w-full"
                      >
                        <Link
                          href={`/projects?search=${encodeURIComponent(query)}`}
                        >
                          VIEW ALL {results.totalCount} RESULTS
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              ) : query ? (
                // No results
                <div className="p-4 text-center">
                  <Typography
                    variant="sm"
                    className="mb-2 font-mono text-gray-400"
                  >
                    NO PROJECTS FOUND
                  </Typography>
                  <Typography variant="xs" className="text-gray-500">
                    Try different keywords or browse all projects
                  </Typography>
                  <Button variant="ghost" size="sm" asChild className="mt-2">
                    <Link href="/projects">BROWSE ALL PROJECTS</Link>
                  </Button>
                </div>
              ) : (
                // Default state with recent searches and trending
                <div className="space-y-4 p-4">
                  {/* Recent Searches */}
                  {showRecentSearches && recentSearches.length > 0 && (
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <Typography
                          variant="sm"
                          className="font-mono text-gray-400"
                        >
                          RECENT SEARCHES
                        </Typography>
                      </div>
                      <div className="space-y-1">
                        {recentSearches.map((search, index) => (
                          <button
                            key={index}
                            onClick={() => handleRecentSearchClick(search)}
                            className="block w-full rounded px-2 py-1 text-left text-sm text-gray-300 hover:bg-gray-900 hover:text-white"
                          >
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Trending Technologies */}
                  {showTrendingTechs && (
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-gray-400" />
                        <Typography
                          variant="sm"
                          className="font-mono text-gray-400"
                        >
                          TRENDING TECHNOLOGIES
                        </Typography>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {TRENDING_TECHNOLOGIES.map((tech) => (
                          <button
                            key={tech}
                            onClick={() => handleTrendingTechClick(tech)}
                            className="bg-gray-800 px-2 py-1 font-mono text-xs text-gray-300 hover:bg-gray-700 hover:text-white"
                          >
                            {tech.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
