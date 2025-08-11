"use client";

import { useEffect } from "react";

interface AnalyticsEvent {
  event: string;
  postId?: string;
  metadata?: Record<string, any>;
}

export function useAnalytics() {
  const trackEvent = async (eventData: AnalyticsEvent) => {
    try {
      await fetch("/api/analytics/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });
    } catch (error) {
      console.error("Failed to track analytics event:", error);
    }
  };

  const trackPageView = (path: string, metadata?: Record<string, any>) => {
    trackEvent({
      event: "page_view",
      metadata: { path, ...metadata },
    });
  };

  const trackBlogView = (postId: string, metadata?: Record<string, any>) => {
    trackEvent({
      event: "blog_view",
      postId,
      metadata,
    });
  };

  const trackBlogShare = (postId: string, platform: string) => {
    trackEvent({
      event: "blog_share",
      postId,
      metadata: { platform },
    });
  };

  return {
    trackEvent,
    trackPageView,
    trackBlogView,
    trackBlogShare,
  };
}

export function usePageView(path: string, metadata?: Record<string, any>) {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView(path, metadata);
  }, [path, trackPageView, metadata]);
}

export function useBlogView(postId: string, metadata?: Record<string, any>) {
  const { trackBlogView } = useAnalytics();

  useEffect(() => {
    trackBlogView(postId, metadata);
  }, [postId, trackBlogView, metadata]);
}
