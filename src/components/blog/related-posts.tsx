"use client";

import { BlogCard } from "./blog-card";
import { BlogPost } from "@/lib/types";

interface RelatedPostsProps {
  posts: Array<
    BlogPost & {
      author: { name: string | null };
      categories: Array<{ name: string; slug: string; color: string }>;
    }
  >;
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <div className="space-y-6">
      <h2 className="border-b-2 border-white pb-2 font-mono text-2xl font-bold text-white uppercase">
        RELATED POSTS
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard
            key={post.id}
            post={{
              ...post,
              tags: [], // Related posts don't need tags for display
            }}
            variant="compact"
          />
        ))}
      </div>
    </div>
  );
}
