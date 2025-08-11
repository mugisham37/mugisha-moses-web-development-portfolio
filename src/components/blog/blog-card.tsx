"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Calendar, Clock, Eye, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { BlogPost } from "@/lib/types";

interface BlogCardProps {
  post: BlogPost & {
    author: { name: string | null };
    categories: Array<{ name: string; slug: string; color: string }>;
    tags: Array<{ name: string; slug: string }>;
  };
  variant?: "default" | "featured" | "compact";
}

export function BlogCard({ post, variant = "default" }: BlogCardProps) {
  const isLarge = variant === "featured";
  const isCompact = variant === "compact";

  return (
    <Card
      variant={isLarge ? "elevated" : "default"}
      hover="lift"
      className={`group ${isLarge ? "lg:col-span-2" : ""}`}
    >
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="space-y-4 p-6">
          {/* Post Meta */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-4 text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span className="font-mono">
                  {post.publishedAt
                    ? formatDistanceToNow(new Date(post.publishedAt), {
                        addSuffix: true,
                      })
                    : "Draft"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span className="font-mono">{post.readingTime} MIN READ</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span className="font-mono">{post.viewCount}</span>
              </div>
            </div>
            {post.featured && (
              <Star className="h-4 w-4 fill-current text-yellow-400" />
            )}
          </div>

          {/* Title */}
          <h2
            className={`font-mono font-bold text-white uppercase transition-colors group-hover:text-yellow-400 ${
              isLarge ? "text-2xl" : isCompact ? "text-lg" : "text-xl"
            }`}
          >
            {post.title}
          </h2>

          {/* Excerpt */}
          {post.excerpt && !isCompact && (
            <p className="font-mono text-sm leading-relaxed text-gray-400">
              {post.excerpt}
            </p>
          )}

          {/* Categories */}
          {post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.categories.slice(0, isCompact ? 2 : 3).map((category) => (
                <span
                  key={category.slug}
                  className="border-2 border-white px-2 py-1 font-mono text-xs font-bold text-white uppercase transition-colors hover:bg-white hover:text-black"
                  style={{ borderColor: category.color }}
                >
                  {category.name}
                </span>
              ))}
            </div>
          )}

          {/* Tags */}
          {post.tags.length > 0 && !isCompact && (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag.slug}
                  className="border border-gray-600 px-2 py-1 font-mono text-xs text-gray-400 uppercase"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Author */}
          <div className="flex items-center justify-between border-t border-gray-800 pt-4">
            <div className="font-mono text-sm text-gray-400">
              BY {post.author.name?.toUpperCase() || "ANONYMOUS"}
            </div>
            <div className="font-mono text-xs text-gray-500 uppercase">
              READ MORE →
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}
