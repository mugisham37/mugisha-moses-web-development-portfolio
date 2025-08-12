"use client";

import { useCallback } from "react";
import {
  AnalyticsMetadata,
  ServiceAnalyticsEvent,
} from "@/lib/types/analytics";

export function useServiceAnalytics() {
  const trackEvent = useCallback(async (event: ServiceAnalyticsEvent) => {
    try {
      // Get session ID from localStorage or generate new one
      let sessionId = localStorage.getItem("analytics_session_id");
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
        localStorage.setItem("analytics_session_id", sessionId);
      }

      const response = await fetch("/api/services/analytics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...event,
          sessionId,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to track analytics event");
      }

      const result = await response.json();

      // Update session ID if provided by server
      if (result.sessionId) {
        localStorage.setItem("analytics_session_id", result.sessionId);
      }
    } catch (error) {
      // Fail silently for analytics - don't break user experience
      console.warn("Analytics tracking failed:", error);
    }
  }, []);

  // Convenience methods for common events
  const trackServiceView = useCallback(
    (serviceId: string, metadata?: AnalyticsMetadata) => {
      trackEvent({ serviceId, event: "view", metadata });
    },
    [trackEvent]
  );

  const trackServiceInquiry = useCallback(
    (serviceId: string, metadata?: AnalyticsMetadata) => {
      trackEvent({ serviceId, event: "inquiry", metadata });
    },
    [trackEvent]
  );

  const trackServiceBooking = useCallback(
    (serviceId: string, metadata?: AnalyticsMetadata) => {
      trackEvent({ serviceId, event: "booking", metadata });
    },
    [trackEvent]
  );

  const trackServiceConversion = useCallback(
    (serviceId: string, metadata?: AnalyticsMetadata) => {
      trackEvent({ serviceId, event: "conversion", metadata });
    },
    [trackEvent]
  );

  const trackFeatureClick = useCallback(
    (serviceId: string, feature: string, metadata?: AnalyticsMetadata) => {
      trackEvent({
        serviceId,
        event: "feature_click",
        metadata: { feature, ...metadata },
      });
    },
    [trackEvent]
  );

  const trackPricingView = useCallback(
    (serviceId: string, tier?: string, metadata?: AnalyticsMetadata) => {
      trackEvent({
        serviceId,
        event: "pricing_view",
        metadata: { tier, ...metadata },
      });
    },
    [trackEvent]
  );

  const trackFAQExpand = useCallback(
    (serviceId: string, question: string, metadata?: AnalyticsMetadata) => {
      trackEvent({
        serviceId,
        event: "faq_expand",
        metadata: { question, ...metadata },
      });
    },
    [trackEvent]
  );

  const trackCTAClick = useCallback(
    (serviceId: string, ctaType: string, metadata?: AnalyticsMetadata) => {
      trackEvent({
        serviceId,
        event: "cta_click",
        metadata: { ctaType, ...metadata },
      });
    },
    [trackEvent]
  );

  return {
    trackEvent,
    trackServiceView,
    trackServiceInquiry,
    trackServiceBooking,
    trackServiceConversion,
    trackFeatureClick,
    trackPricingView,
    trackFAQExpand,
    trackCTAClick,
  };
}
