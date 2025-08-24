/**
 * Analytics and Performance Monitoring System
 * Implements Google Analytics 4, Core Web Vitals tracking, and custom events
 */

// Google Analytics 4 Configuration
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || "";

// Custom event types for portfolio tracking
export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

// Core Web Vitals metrics interface
export interface WebVitalsMetric {
  id: string;
  name: "CLS" | "FID" | "FCP" | "LCP" | "TTFB";
  value: number;
  delta: number;
  rating: "good" | "needs-improvement" | "poor";
  navigationType: string;
}

// Performance monitoring data structure
export interface PerformanceData {
  timestamp: number;
  url: string;
  userAgent: string;
  connectionType?: string;
  metrics: {
    webVitals: WebVitalsMetric[];
    customMetrics: Record<string, number>;
    errors: ErrorReport[];
  };
}

export interface ErrorReport {
  timestamp: number;
  message: string;
  stack?: string;
  url: string;
  lineNumber?: number;
  columnNumber?: number;
  userAgent: string;
  userId?: string;
}

// Initialize Google Analytics
export const initGA = (): void => {
  if (typeof window === "undefined" || !GA_TRACKING_ID) return;

  // Load gtag script
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag("js", new Date());
  window.gtag("config", GA_TRACKING_ID, {
    page_title: "Brutalist Portfolio",
    page_location: window.location.href,
    custom_map: {
      custom_parameter_1: "theme_mode",
      custom_parameter_2: "scroll_depth",
      custom_parameter_3: "interaction_type",
    },
  });

  console.log("Google Analytics 4 initialized");
};

// Track custom events
export const trackEvent = (event: AnalyticsEvent): void => {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("event", event.action, {
    event_category: event.category,
    event_label: event.label,
    value: event.value,
    ...event.custom_parameters,
  });

  // Also log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log("Analytics Event:", event);
  }
};

// Track page views
export const trackPageView = (url: string, title?: string): void => {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("config", GA_TRACKING_ID, {
    page_path: url,
    page_title: title || document.title,
  });
};

// Track theme changes
export const trackThemeChange = (
  theme: "extreme-brutalist" | "refined-brutalist",
  scrollProgress: number
): void => {
  trackEvent({
    action: "theme_change",
    category: "user_interaction",
    label: theme,
    value: Math.round(scrollProgress * 100),
    custom_parameters: {
      theme_mode: theme,
      scroll_depth: scrollProgress,
      interaction_type: "automatic",
    },
  });
};

// Track scroll depth milestones
export const trackScrollDepth = (depth: number): void => {
  const milestones = [25, 50, 75, 90, 100];
  const milestone = milestones.find((m) => Math.abs(depth - m) < 2);

  if (milestone) {
    trackEvent({
      action: "scroll_depth",
      category: "engagement",
      label: `${milestone}%`,
      value: milestone,
      custom_parameters: {
        scroll_depth: depth / 100,
        milestone: milestone,
      },
    });
  }
};

// Track CTA interactions
export const trackCTAClick = (
  ctaType: string,
  location: string,
  theme: string
): void => {
  trackEvent({
    action: "cta_click",
    category: "conversion",
    label: `${ctaType}_${location}`,
    custom_parameters: {
      cta_type: ctaType,
      cta_location: location,
      theme_mode: theme,
      interaction_type: "click",
    },
  });
};

// Track form interactions
export const trackFormInteraction = (
  formType: string,
  action: "start" | "complete" | "error",
  errorType?: string
): void => {
  trackEvent({
    action: `form_${action}`,
    category: "form_interaction",
    label: formType,
    custom_parameters: {
      form_type: formType,
      form_action: action,
      error_type: errorType,
      interaction_type: "form",
    },
  });
};

// Track resource downloads
export const trackDownload = (
  resourceType: string,
  resourceName: string
): void => {
  trackEvent({
    action: "download",
    category: "resource_engagement",
    label: `${resourceType}_${resourceName}`,
    custom_parameters: {
      resource_type: resourceType,
      resource_name: resourceName,
      interaction_type: "download",
    },
  });
};

// Track social media clicks
export const trackSocialClick = (platform: string, location: string): void => {
  trackEvent({
    action: "social_click",
    category: "social_engagement",
    label: `${platform}_${location}`,
    custom_parameters: {
      social_platform: platform,
      click_location: location,
      interaction_type: "social",
    },
  });
};

// Track performance issues
export const trackPerformanceIssue = (
  issueType: string,
  value: number,
  threshold: number
): void => {
  trackEvent({
    action: "performance_issue",
    category: "technical",
    label: issueType,
    value: Math.round(value),
    custom_parameters: {
      issue_type: issueType,
      measured_value: value,
      threshold_value: threshold,
      severity: value > threshold * 1.5 ? "high" : "medium",
    },
  });
};

// Error tracking
export const trackError = (error: Error, context?: string): void => {
  const errorReport: ErrorReport = {
    timestamp: Date.now(),
    message: error.message,
    stack: error.stack,
    url: window.location.href,
    userAgent: navigator.userAgent,
    lineNumber: (error as any).lineno,
    columnNumber: (error as any).colno,
  };

  // Send to analytics
  trackEvent({
    action: "javascript_error",
    category: "technical",
    label: context || "unknown",
    custom_parameters: {
      error_message: error.message,
      error_context: context,
      error_stack: error.stack?.substring(0, 500), // Truncate for GA
      interaction_type: "error",
    },
  });

  // Store locally for debugging
  if (typeof window !== "undefined") {
    const errors = JSON.parse(localStorage.getItem("portfolio_errors") || "[]");
    errors.push(errorReport);
    // Keep only last 50 errors
    if (errors.length > 50) {
      errors.splice(0, errors.length - 50);
    }
    localStorage.setItem("portfolio_errors", JSON.stringify(errors));
  }

  console.error("Tracked Error:", errorReport);
};

// Core Web Vitals tracking
export const trackWebVitals = (metric: WebVitalsMetric): void => {
  // Send to Google Analytics
  window.gtag?.("event", metric.name, {
    event_category: "Web Vitals",
    event_label: metric.id,
    value: Math.round(
      metric.name === "CLS" ? metric.value * 1000 : metric.value
    ),
    non_interaction: true,
    custom_parameters: {
      metric_name: metric.name,
      metric_value: metric.value,
      metric_rating: metric.rating,
      navigation_type: metric.navigationType,
    },
  });

  // Track performance issues
  const thresholds = {
    CLS: 0.1,
    FID: 100,
    FCP: 1800,
    LCP: 2500,
    TTFB: 800,
  };

  if (metric.value > thresholds[metric.name]) {
    trackPerformanceIssue(metric.name, metric.value, thresholds[metric.name]);
  }

  console.log(`Web Vital ${metric.name}:`, metric.value, `(${metric.rating})`);
};

// User session tracking
export const trackUserSession = (): void => {
  const sessionStart = Date.now();
  const sessionId = `session_${sessionStart}_${Math.random().toString(36).substr(2, 9)}`;

  // Track session start
  trackEvent({
    action: "session_start",
    category: "engagement",
    custom_parameters: {
      session_id: sessionId,
      timestamp: sessionStart,
      user_agent: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`,
      connection_type:
        (navigator as any).connection?.effectiveType || "unknown",
    },
  });

  // Track session end on page unload
  const trackSessionEnd = () => {
    const sessionEnd = Date.now();
    const sessionDuration = sessionEnd - sessionStart;

    trackEvent({
      action: "session_end",
      category: "engagement",
      value: Math.round(sessionDuration / 1000), // Duration in seconds
      custom_parameters: {
        session_id: sessionId,
        session_duration: sessionDuration,
        timestamp: sessionEnd,
      },
    });
  };

  window.addEventListener("beforeunload", trackSessionEnd);
  window.addEventListener("pagehide", trackSessionEnd);

  return sessionId;
};

// Enhanced user engagement tracking
export const trackEngagement = (
  engagementType: string,
  details: Record<string, any>
): void => {
  trackEvent({
    action: "user_engagement",
    category: "engagement",
    label: engagementType,
    custom_parameters: {
      engagement_type: engagementType,
      ...details,
      interaction_type: "engagement",
    },
  });
};

// A/B test tracking (for future use)
export const trackABTest = (
  testName: string,
  variant: string,
  action: string
): void => {
  trackEvent({
    action: "ab_test_interaction",
    category: "experimentation",
    label: `${testName}_${variant}`,
    custom_parameters: {
      test_name: testName,
      test_variant: variant,
      test_action: action,
      interaction_type: "ab_test",
    },
  });
};

// Conversion funnel tracking
export const trackConversionStep = (
  funnelName: string,
  step: number,
  stepName: string
): void => {
  trackEvent({
    action: "conversion_step",
    category: "conversion",
    label: `${funnelName}_step_${step}`,
    value: step,
    custom_parameters: {
      funnel_name: funnelName,
      step_number: step,
      step_name: stepName,
      interaction_type: "conversion",
    },
  });
};

// Export analytics utilities
export const analytics = {
  init: initGA,
  trackEvent,
  trackPageView,
  trackThemeChange,
  trackScrollDepth,
  trackCTAClick,
  trackFormInteraction,
  trackDownload,
  trackSocialClick,
  trackError,
  trackWebVitals,
  trackUserSession,
  trackEngagement,
  trackABTest,
  trackConversionStep,
  trackPerformanceIssue,
};

// Global error handler
if (typeof window !== "undefined") {
  window.addEventListener("error", (event) => {
    trackError(event.error, "global_error_handler");
  });

  window.addEventListener("unhandledrejection", (event) => {
    trackError(new Error(event.reason), "unhandled_promise_rejection");
  });
}

// Type declarations for gtag
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
