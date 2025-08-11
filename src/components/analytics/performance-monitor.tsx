"use client";

import { useEffect, useRef } from "react";

interface PerformanceMonitorProps {
  sessionId: string;
  hasConsent: boolean;
}

export function PerformanceMonitor({
  sessionId,
  hasConsent,
}: PerformanceMonitorProps) {
  const metricsRef = useRef<{
    lcp?: number;
    fid?: number;
    cls?: number;
    fcp?: number;
    ttfb?: number;
  }>({});

  useEffect(() => {
    if (!hasConsent) return;

    // Track Core Web Vitals
    const trackWebVitals = () => {
      // Largest Contentful Paint (LCP)
      if ("PerformanceObserver" in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1] as any;
            if (lastEntry) {
              metricsRef.current.lcp = lastEntry.startTime;
            }
          });
          lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

          // First Input Delay (FID)
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry: any) => {
              if (entry.processingStart && entry.startTime) {
                metricsRef.current.fid =
                  entry.processingStart - entry.startTime;
              }
            });
          });
          fidObserver.observe({ entryTypes: ["first-input"] });

          // Cumulative Layout Shift (CLS)
          let clsValue = 0;
          const clsObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry: any) => {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
                metricsRef.current.cls = clsValue;
              }
            });
          });
          clsObserver.observe({ entryTypes: ["layout-shift"] });

          // First Contentful Paint (FCP)
          const fcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry: any) => {
              if (entry.name === "first-contentful-paint") {
                metricsRef.current.fcp = entry.startTime;
              }
            });
          });
          fcpObserver.observe({ entryTypes: ["paint"] });
        } catch (error) {
          console.error("Error setting up performance observers:", error);
        }
      }

      // Navigation Timing API for additional metrics
      if ("performance" in window && "getEntriesByType" in performance) {
        const navigationEntries = performance.getEntriesByType(
          "navigation"
        ) as PerformanceNavigationTiming[];
        if (navigationEntries.length > 0) {
          const nav = navigationEntries[0];
          metricsRef.current.ttfb = nav.responseStart - nav.requestStart;
        }
      }
    };

    // Track connection information
    const getConnectionInfo = () => {
      const connection =
        (navigator as any).connection ||
        (navigator as any).mozConnection ||
        (navigator as any).webkitConnection;
      if (connection) {
        return {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
        };
      }
      return null;
    };

    // Send metrics to server
    const sendMetrics = () => {
      const metrics = { ...metricsRef.current };
      const connectionInfo = getConnectionInfo();

      if (Object.keys(metrics).length > 0) {
        fetch("/api/analytics/performance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            page: window.location.pathname,
            metrics,
            connectionInfo,
            timestamp: Date.now(),
          }),
        }).catch(console.error);
      }
    };

    // Initialize tracking
    trackWebVitals();

    // Send metrics when page is about to unload
    const handleBeforeUnload = () => {
      sendMetrics();
    };

    // Send metrics periodically
    const metricsInterval = setInterval(sendMetrics, 30000); // Every 30 seconds

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      clearInterval(metricsInterval);
    };
  }, [sessionId, hasConsent]);

  // Track page visibility changes
  useEffect(() => {
    if (!hasConsent) return;

    let startTime = Date.now();
    let isVisible = !document.hidden;

    const handleVisibilityChange = () => {
      const now = Date.now();

      if (document.hidden && isVisible) {
        // Page became hidden
        const timeOnPage = now - startTime;
        fetch("/api/analytics/engagement", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            page: window.location.pathname,
            event: "page_hidden",
            timeOnPage,
            timestamp: now,
          }),
        }).catch(console.error);
        isVisible = false;
      } else if (!document.hidden && !isVisible) {
        // Page became visible
        startTime = now;
        isVisible = true;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [sessionId, hasConsent]);

  // Track scroll depth
  useEffect(() => {
    if (!hasConsent) return;

    let maxScrollDepth = 0;
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollDepth = Math.round((scrollTop / documentHeight) * 100);

      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
      }

      // Debounce scroll tracking
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        fetch("/api/analytics/engagement", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            page: window.location.pathname,
            event: "scroll_depth",
            scrollDepth: maxScrollDepth,
            timestamp: Date.now(),
          }),
        }).catch(console.error);
      }, 1000);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [sessionId, hasConsent]);

  return null; // This component doesn't render anything
}
