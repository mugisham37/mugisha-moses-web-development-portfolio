"use client";

import { useBlogView } from "@/hooks/use-analytics";

interface BlogPostTrackerProps {
  postId: string;
}

export function BlogPostTracker({ postId }: BlogPostTrackerProps) {
  useBlogView(postId, {
    timestamp: new Date().toISOString(),
    userAgent: typeof window !== "undefined" ? navigator.userAgent : "",
  });

  return null; // This component doesn't render anything
}
