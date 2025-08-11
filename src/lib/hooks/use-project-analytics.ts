"use client";

import { useCallback } from "react";

interface AnalyticsEvent {
  event: string;
  metadata?: Record<string, any>;
}

export function useProjectAnalytics(projectId: string) {
  const trackEvent = useCallback(
    async (event: string, metadata?: Record<string, any>) => {
      try {
        const response = await fetch(`/api/projects/${projectId}/analytics`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            event,
            metadata,
          }),
        });

        if (!response.ok) {
          throw new Error(`Analytics tracking failed: ${response.statusText}`);
        }

        const result = await response.json();
        return result;
      } catch (error) {
        console.error("Failed to track analytics event:", error);
        // Don't throw error to avoid breaking user experience
        return null;
      }
    },
    [projectId]
  );

  const trackView = useCallback(
    (metadata?: Record<string, any>) => {
      return trackEvent("view", {
        ...metadata,
        timestamp: new Date().toISOString(),
        page: window.location.pathname,
      });
    },
    [trackEvent]
  );

  const trackClick = useCallback(
    (element: string, metadata?: Record<string, any>) => {
      return trackEvent("click", {
        element,
        ...metadata,
        timestamp: new Date().toISOString(),
        page: window.location.pathname,
      });
    },
    [trackEvent]
  );

  const trackShare = useCallback(
    (platform: string, metadata?: Record<string, any>) => {
      return trackEvent("share", {
        platform,
        ...metadata,
        timestamp: new Date().toISOString(),
        page: window.location.pathname,
      });
    },
    [trackEvent]
  );

  const trackDownload = useCallback(
    (resource: string, metadata?: Record<string, any>) => {
      return trackEvent("download", {
        resource,
        ...metadata,
        timestamp: new Date().toISOString(),
        page: window.location.pathname,
      });
    },
    [trackEvent]
  );

  const trackTimeSpent = useCallback(
    (duration: number, metadata?: Record<string, any>) => {
      return trackEvent("time_spent", {
        duration,
        ...metadata,
        timestamp: new Date().toISOString(),
        page: window.location.pathname,
      });
    },
    [trackEvent]
  );

  const trackScroll = useCallback(
    (percentage: number, metadata?: Record<string, any>) => {
      return trackEvent("scroll", {
        percentage,
        ...metadata,
        timestamp: new Date().toISOString(),
        page: window.location.pathname,
      });
    },
    [trackEvent]
  );

  return {
    trackEvent,
    trackView,
    trackClick,
    trackShare,
    trackDownload,
    trackTimeSpent,
    trackScroll,
  };
}