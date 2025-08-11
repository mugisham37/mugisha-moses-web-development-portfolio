"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationPost {
  title: string;
  slug: string;
  excerpt?: string;
}

interface BlogPostNavigationProps {
  currentSlug: string;
}

export function BlogPostNavigation({ currentSlug }: BlogPostNavigationProps) {
  const [prevPost, setPrevPost] = useState<NavigationPost | null>(null);
  const [nextPost, setNextPost] = useState<NavigationPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNavigation = async () => {
      try {
        // This would need a dedicated API endpoint for navigation
        // For now, we'll simulate it
        const response = await fetch(
          `/api/blog/navigation?current=${currentSlug}`
        );
        if (response.ok) {
          const data = await response.json();
          setPrevPost(data.prev);
          setNextPost(data.next);
        }
      } catch (error) {
        console.error("Failed to fetch navigation:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNavigation();
  }, [currentSlug]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="animate-pulse border-4 border-white p-6">
          <div className="mb-2 h-4 bg-gray-700"></div>
          <div className="h-6 bg-gray-700"></div>
        </div>
        <div className="animate-pulse border-4 border-white p-6">
          <div className="mb-2 h-4 bg-gray-700"></div>
          <div className="h-6 bg-gray-700"></div>
        </div>
      </div>
    );
  }

  if (!prevPost && !nextPost) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="border-b-2 border-white pb-2 font-mono text-2xl font-bold text-white uppercase">
        MORE POSTS
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Previous Post */}
        <div className="flex">
          {prevPost ? (
            <Link href={`/blog/${prevPost.slug}`} className="flex-1">
              <div className="group h-full border-4 border-white p-6 transition-colors hover:bg-white hover:text-black">
                <div className="mb-3 flex items-center gap-2">
                  <ChevronLeft className="h-4 w-4 text-gray-400 group-hover:text-black" />
                  <span className="font-mono text-sm text-gray-400 uppercase group-hover:text-black">
                    PREVIOUS POST
                  </span>
                </div>
                <h3 className="font-mono leading-tight font-bold text-white uppercase group-hover:text-black">
                  {prevPost.title}
                </h3>
                {prevPost.excerpt && (
                  <p className="mt-2 font-mono text-sm text-gray-400 group-hover:text-black">
                    {prevPost.excerpt.substring(0, 80)}...
                  </p>
                )}
              </div>
            </Link>
          ) : (
            <div className="flex-1 border-4 border-gray-600 p-6 opacity-50">
              <div className="mb-3 flex items-center gap-2">
                <ChevronLeft className="h-4 w-4 text-gray-600" />
                <span className="font-mono text-sm text-gray-600 uppercase">
                  NO PREVIOUS POST
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Next Post */}
        <div className="flex">
          {nextPost ? (
            <Link href={`/blog/${nextPost.slug}`} className="flex-1">
              <div className="group h-full border-4 border-white p-6 transition-colors hover:bg-white hover:text-black">
                <div className="mb-3 flex items-center justify-end gap-2">
                  <span className="font-mono text-sm text-gray-400 uppercase group-hover:text-black">
                    NEXT POST
                  </span>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-black" />
                </div>
                <h3 className="text-right font-mono leading-tight font-bold text-white uppercase group-hover:text-black">
                  {nextPost.title}
                </h3>
                {nextPost.excerpt && (
                  <p className="mt-2 text-right font-mono text-sm text-gray-400 group-hover:text-black">
                    {nextPost.excerpt.substring(0, 80)}...
                  </p>
                )}
              </div>
            </Link>
          ) : (
            <div className="flex-1 border-4 border-gray-600 p-6 opacity-50">
              <div className="mb-3 flex items-center justify-end gap-2">
                <span className="font-mono text-sm text-gray-600 uppercase">
                  NO NEXT POST
                </span>
                <ChevronRight className="h-4 w-4 text-gray-600" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
