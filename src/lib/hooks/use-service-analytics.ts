"use client";

import { useCallback } from "react";

interface AnalyticsEvent {
  serviceId: string;
  event:
    | "view"
    | "inquiry"
    | "booking"
    | "conversion"
    | "feature_click"
    | "pricing_view"
    | "faq_expand"
    | "cta_click";
  metadata?: Record<string, any>;
}

export function useServiceAnalytics() {
  const trackEvent = useCallback(async (event: AnalyticsEvent) => {
    try {
      // Get session ID from localStorage or generate new one
      let sessionId = localStorage.getItem("analytics_session_id");
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
    (serviceId: string, metadata?: Record<string, any>) => {
      trackEvent({ serviceId, event: "view", metadata });
    },
    [trackEvent]
  );

  const trackServiceInquiry = useCallback(
    (serviceId: string, metadata?: Record<string, any>) => {
      trackEvent({ serviceId, event: "inquiry", metadata });
    },
    [trackEvent]
  );

  const trackServiceBooking = useCallback(
    (serviceId: string, metadata?: Record<string, any>) => {
      trackEvent({ serviceId, event: "booking", metadata });
    },
    [trackEvent]
  );

  const trackServiceConversion = useCallback(
    (serviceId: string, metadata?: Record<string, any>) => {
      trackEvent({ serviceId, event: "conversion", metadata });
    },
    [trackEvent]
  );

  const trackFeatureClick = useCallback(
    (serviceId: string, feature: string, metadata?: Record<string, any>) => {
      trackEvent({
        serviceId,
        event: "feature_click",
        metadata: { feature, ...metadata },
      });
    },
    [trackEvent]
  );

  const trackPricingView = useCallback(
    (serviceId: string, tier?: string, metadata?: Record<string, any>) => {
      trackEvent({
        serviceId,
        event: "pricing_view",
        metadata: { tier, ...metadata },
      });
    },
    [trackEvent]
  );

  const trackFAQExpand = useCallback(
    (serviceId: string, question: string, metadata?: Record<string, any>) => {
      trackEvent({
        serviceId,
        event: "faq_expand",
        metadata: { question, ...metadata },
      });
    },
    [trackEvent]
  );

  const trackCTAClick = useCallback(
    (serviceId: string, ctaType: string, metadata?: Record<string, any>) => {
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
