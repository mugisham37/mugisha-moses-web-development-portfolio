"use client";

import { useEffect } from "react";
import { useAnalytics as useAnalyticsProvider } from "@/components/analytics/analytics-provider";
import type { AnalyticsEvent, AnalyticsMetadata } from "@/types/analytics";

export function useAnalytics() {
  const {
    trackEvent: providerTrackEvent,
    trackPageView: providerTrackPageView,
    trackConversion,
  } = useAnalyticsProvider();

  const trackEvent = async (eventData: AnalyticsEvent) => {
    try {
      // Use the provider's trackEvent method
      await providerTrackEvent(eventData.event, {
        postId: eventData.postId,
        ...eventData.metadata,
      });

      // Also send to legacy endpoint for backward compatibility
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

  const trackPageView = (path: string, metadata?: AnalyticsMetadata) => {
    providerTrackPageView(path, metadata);
  };

  const trackBlogView = (postId: string, metadata?: AnalyticsMetadata) => {
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

  const trackProjectView = (
    projectId: string,
    metadata?: AnalyticsMetadata
  ) => {
    trackEvent({
      event: "project_view",
      metadata: { projectId, ...metadata },
    });
  };

  const trackProjectLike = (
    projectId: string,
    metadata?: AnalyticsMetadata
  ) => {
    trackEvent({
      event: "project_like",
      metadata: { projectId, ...metadata },
    });
  };

  const trackContactFormSubmission = (
    type: string,
    metadata?: AnalyticsMetadata
  ) => {
    trackConversion("contact_form_submission", undefined, {
      type,
      ...metadata,
    });
  };

  const trackNewsletterSignup = (metadata?: AnalyticsMetadata) => {
    trackConversion("newsletter_signup", undefined, metadata);
  };

  const trackConsultationBooking = (metadata?: AnalyticsMetadata) => {
    trackConversion("consultation_booking", undefined, metadata);
  };

  return {
    trackEvent,
    trackPageView,
    trackBlogView,
    trackBlogShare,
    trackProjectView,
    trackProjectLike,
    trackContactFormSubmission,
    trackNewsletterSignup,
    trackConsultationBooking,
    trackConversion,
  };
}

export function usePageView(path: string, metadata?: AnalyticsMetadata) {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView(path, metadata);
  }, [path, trackPageView, metadata]);
}

export function useBlogView(postId: string, metadata?: AnalyticsMetadata) {
  const { trackBlogView } = useAnalytics();

  useEffect(() => {
    trackBlogView(postId, metadata);
  }, [postId, trackBlogView, metadata]);
}

export function useProjectView(
  projectId: string,
  metadata?: AnalyticsMetadata
) {
  const { trackProjectView } = useAnalytics();

  useEffect(() => {
    trackProjectView(projectId, metadata);
  }, [projectId, trackProjectView, metadata]);
}
