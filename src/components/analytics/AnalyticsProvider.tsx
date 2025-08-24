/**
 * Analytics Provider Component
 * Initializes and manages analytics throughout the application
 */

"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { analytics, trackUserSession, trackError } from "@/utils/analytics";
import usePerformanceMonitor from "@/hooks/usePerformanceMonitor";

interface AnalyticsContextType {
  isInitialized: boolean;
  sessionId: string | null;
  trackingEnabled: boolean;
  setTrackingEnabled: (enabled: boolean) => void;
  performanceMonitoring: boolean;
  setPerformanceMonitoring: (enabled: boolean) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(
  undefined
);

interface AnalyticsProviderProps {
  children: ReactNode;
  enablePerformanceMonitoring?: boolean;
  enableErrorTracking?: boolean;
  enableUserSessionTracking?: boolean;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({
  children,
  enablePerformanceMonitoring = true,
  enableErrorTracking = true,
  enableUserSessionTracking = true,
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [trackingEnabled, setTrackingEnabled] = useState(true);
  const [performanceMonitoring, setPerformanceMonitoring] = useState(
    enablePerformanceMonitoring
  );

  // Initialize performance monitoring
  const { isMonitoring } = usePerformanceMonitor({
    enableWebVitals: performanceMonitoring,
    enableCustomMetrics: performanceMonitoring,
    enableMemoryMonitoring: performanceMonitoring,
  });

  // Initialize analytics on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check for user consent (GDPR compliance)
    const consent = localStorage.getItem("analytics_consent");
    const hasConsent = consent === "true" || consent === null; // Default to true if not set

    if (hasConsent && trackingEnabled) {
      try {
        // Initialize Google Analytics
        analytics.init();

        // Track user session if enabled
        if (enableUserSessionTracking) {
          const newSessionId = trackUserSession();
          setSessionId(newSessionId);
        }

        setIsInitialized(true);
        console.log("Analytics initialized successfully");
      } catch (error) {
        console.error("Failed to initialize analytics:", error);
        if (enableErrorTracking) {
          trackError(error as Error, "analytics_initialization");
        }
      }
    }
  }, [trackingEnabled, enableUserSessionTracking, enableErrorTracking]);

  // Handle consent changes
  useEffect(() => {
    const handleConsentChange = (event: CustomEvent) => {
      const { consent } = event.detail;
      setTrackingEnabled(consent);
      localStorage.setItem("analytics_consent", consent.toString());

      if (consent && !isInitialized) {
        analytics.init();
        setIsInitialized(true);
      }
    };

    window.addEventListener(
      "analytics-consent-change" as any,
      handleConsentChange
    );

    return () => {
      window.removeEventListener(
        "analytics-consent-change" as any,
        handleConsentChange
      );
    };
  }, [isInitialized]);

  // Track page visibility changes
  useEffect(() => {
    if (!isInitialized) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        analytics.trackEvent({
          action: "page_hidden",
          category: "engagement",
          custom_parameters: {
            session_id: sessionId,
            timestamp: Date.now(),
          },
        });
      } else if (document.visibilityState === "visible") {
        analytics.trackEvent({
          action: "page_visible",
          category: "engagement",
          custom_parameters: {
            session_id: sessionId,
            timestamp: Date.now(),
          },
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isInitialized, sessionId]);

  // Track connection changes
  useEffect(() => {
    if (
      !isInitialized ||
      typeof navigator === "undefined" ||
      !("connection" in navigator)
    )
      return;

    const connection = (navigator as any).connection;

    const handleConnectionChange = () => {
      analytics.trackEvent({
        action: "connection_change",
        category: "technical",
        custom_parameters: {
          connection_type: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          save_data: connection.saveData,
          session_id: sessionId,
        },
      });
    };

    connection.addEventListener("change", handleConnectionChange);

    return () => {
      connection.removeEventListener("change", handleConnectionChange);
    };
  }, [isInitialized, sessionId]);

  // Track device orientation changes
  useEffect(() => {
    if (!isInitialized) return;

    const handleOrientationChange = () => {
      analytics.trackEvent({
        action: "orientation_change",
        category: "user_interaction",
        custom_parameters: {
          orientation: screen.orientation?.type || "unknown",
          angle: screen.orientation?.angle || 0,
          session_id: sessionId,
        },
      });
    };

    screen.orientation?.addEventListener("change", handleOrientationChange);

    return () => {
      screen.orientation?.removeEventListener(
        "change",
        handleOrientationChange
      );
    };
  }, [isInitialized, sessionId]);

  // Global error boundary for analytics
  useEffect(() => {
    if (!enableErrorTracking) return;

    const handleError = (event: ErrorEvent) => {
      trackError(event.error, "global_error_boundary");
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      trackError(new Error(event.reason), "unhandled_promise_rejection");
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
    };
  }, [enableErrorTracking]);

  // Performance monitoring alerts
  useEffect(() => {
    if (!performanceMonitoring || !isMonitoring) return;

    // Monitor for performance issues and alert
    const checkPerformance = () => {
      const navigation = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;

      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.fetchStart;

        if (loadTime > 5000) {
          analytics.trackEvent({
            action: "slow_page_load",
            category: "performance",
            value: Math.round(loadTime),
            custom_parameters: {
              load_time: loadTime,
              dns_time:
                navigation.domainLookupEnd - navigation.domainLookupStart,
              connect_time: navigation.connectEnd - navigation.connectStart,
              ttfb: navigation.responseStart - navigation.requestStart,
              dom_ready:
                navigation.domContentLoadedEventEnd - navigation.fetchStart,
              session_id: sessionId,
            },
          });
        }
      }
    };

    // Check performance after page load
    if (document.readyState === "complete") {
      setTimeout(checkPerformance, 1000);
    } else {
      window.addEventListener("load", () => {
        setTimeout(checkPerformance, 1000);
      });
    }
  }, [performanceMonitoring, isMonitoring, sessionId]);

  const contextValue: AnalyticsContextType = {
    isInitialized,
    sessionId,
    trackingEnabled,
    setTrackingEnabled,
    performanceMonitoring,
    setPerformanceMonitoring,
  };

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
};

// Hook to use analytics context
export const useAnalytics = (): AnalyticsContextType => {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider");
  }
  return context;
};

// HOC for components that need analytics
export const withAnalytics = <P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> => {
  const WrappedComponent = (props: P) => {
    const analytics = useAnalytics();

    return <Component {...props} analytics={analytics} />;
  };

  WrappedComponent.displayName = `withAnalytics(${Component.displayName || Component.name})`;

  return WrappedComponent;
};

export default AnalyticsProvider;
