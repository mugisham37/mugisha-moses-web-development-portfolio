"use client";

import { formatDistanceToNow } from "date-fns";
import { Calendar, Clock, Eye, User, Star } from "lucide-react";
import { BlogPost } from "@/lib/types";

interface BlogPostHeaderProps {
  post: BlogPost & {
    author: { name: string | null };
    categories: Array<{ name: string; slug: string; color: string }>;
    tags: Array<{ name: string; slug: string }>;
  };
}

export function BlogPostHeader({ post }: BlogPostHeaderProps) {
  return (
    <div className="space-y-8">
      {/* Post Meta */}
      <div className="flex flex-wrap items-center gap-6 font-mono text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>
            {post.publishedAt
              ? formatDistanceToNow(new Date(post.publishedAt), {
                  addSuffix: true,
                })
              : "Draft"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{post.readingTime} MIN READ</span>
        </div>
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          <span>{post.viewCount.toLocaleString()} VIEWS</span>
        </div>
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span>BY {post.author.name?.toUpperCase() || "ANONYMOUS"}</span>
        </div>
        {post.featured && (
          <div className="flex items-center gap-2 text-yellow-400">
            <Star className="h-4 w-4 fill-current" />
            <span>FEATURED</span>
          </div>
        )}
      </div>

      {/* Title */}
      <h1 className="font-mono text-4xl leading-tight font-bold text-white uppercase md:text-6xl">
        {post.title}
      </h1>

      {/* Excerpt */}
      {post.excerpt && (
        <p className="max-w-4xl font-mono text-xl leading-relaxed text-gray-300">
          {post.excerpt}
        </p>
      )}

      {/* Categories and Tags */}
      <div className="space-y-4">
        {/* Categories */}
        {post.categories.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {post.categories.map((category) => (
              <span
                key={category.slug}
                className="cursor-pointer border-2 px-4 py-2 font-mono font-bold text-white uppercase transition-colors hover:bg-white hover:text-black"
                style={{ borderColor: category.color }}
              >
                {category.name}
              </span>
            ))}
          </div>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag.slug}
                className="cursor-pointer border border-gray-600 px-3 py-1 font-mono text-sm text-gray-400 uppercase transition-colors hover:border-white hover:text-white"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
