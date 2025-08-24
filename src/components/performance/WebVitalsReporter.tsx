/**
 * Web Vitals Reporter Component
 * Monitors and reports Core Web Vitals metrics
 * Custom implementation to avoid build dependencies
 */

"use client";

import { useEffect } from "react";

interface WebVitalsMetric {
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
  id: string;
}

export function WebVitalsReporter() {
  useEffect(() => {
    const reportMetric = (metric: WebVitalsMetric) => {
      // Log to console in development
      if (process.env.NODE_ENV === "development") {
        console.log(`[Web Vitals] ${metric.name}:`, {
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
        });
      }

      // Send to Google Analytics if available
      if (window.gtag) {
        window.gtag("event", metric.name, {
          event_category: "Web Vitals",
          event_label: metric.id,
          value: Math.round(
            metric.name === "CLS" ? metric.value * 1000 : metric.value
          ),
          non_interaction: true,
          custom_map: {
            metric_rating: metric.rating,
          },
        });
      }

      // Send to custom analytics endpoint
      if (typeof window !== "undefined") {
        fetch("/api/analytics/web-vitals", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: metric.name,
            value: metric.value,
            rating: metric.rating,
            delta: metric.delta,
            id: metric.id,
            url: window.location.href,
            timestamp: Date.now(),
          }),
        }).catch((error) => {
          console.warn("Failed to send Web Vitals metric:", error);
        });
      }
    };

    // Custom Web Vitals measurement implementation
    const measureWebVitals = () => {
      if (typeof window === "undefined" || !("PerformanceObserver" in window)) {
        return;
      }

      // Measure LCP (Largest Contentful Paint)
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            const value = lastEntry.startTime;
            const rating =
              value <= 2500
                ? "good"
                : value <= 4000
                  ? "needs-improvement"
                  : "poor";
            reportMetric({
              name: "LCP",
              value,
              rating,
              delta: value,
              id: `lcp-${Date.now()}`,
            });
          }
        });
        lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
      } catch (error) {
        console.warn("LCP observer not supported");
      }

      // Measure FCP (First Contentful Paint)
      try {
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fcpEntry = entries.find(
            (entry) => entry.name === "first-contentful-paint"
          );
          if (fcpEntry) {
            const value = fcpEntry.startTime;
            const rating =
              value <= 1800
                ? "good"
                : value <= 3000
                  ? "needs-improvement"
                  : "poor";
            reportMetric({
              name: "FCP",
              value,
              rating,
              delta: value,
              id: `fcp-${Date.now()}`,
            });
          }
        });
        fcpObserver.observe({ entryTypes: ["paint"] });
      } catch (error) {
        console.warn("FCP observer not supported");
      }

      // Measure CLS (Cumulative Layout Shift)
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });

          const rating =
            clsValue <= 0.1
              ? "good"
              : clsValue <= 0.25
                ? "needs-improvement"
                : "poor";
          reportMetric({
            name: "CLS",
            value: clsValue,
            rating,
            delta: clsValue,
            id: `cls-${Date.now()}`,
          });
        });
        clsObserver.observe({ entryTypes: ["layout-shift"] });
      } catch (error) {
        console.warn("CLS observer not supported");
      }

      // Measure TTFB (Time to First Byte)
      try {
        const navigation = performance.getEntriesByType(
          "navigation"
        )[0] as PerformanceNavigationTiming;
        if (navigation) {
          const value = navigation.responseStart - navigation.fetchStart;
          const rating =
            value <= 800
              ? "good"
              : value <= 1800
                ? "needs-improvement"
                : "poor";
          reportMetric({
            name: "TTFB",
            value,
            rating,
            delta: value,
            id: `ttfb-${Date.now()}`,
          });
        }
      } catch (error) {
        console.warn("TTFB measurement not supported");
      }

      // Measure FID (First Input Delay) - approximation
      try {
        const fidObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry: any) => {
            const value = entry.processingStart - entry.startTime;
            const rating =
              value <= 100
                ? "good"
                : value <= 300
                  ? "needs-improvement"
                  : "poor";
            reportMetric({
              name: "FID",
              value,
              rating,
              delta: value,
              id: `fid-${Date.now()}`,
            });
          });
        });
        fidObserver.observe({ entryTypes: ["first-input"] });
      } catch (error) {
        console.warn("FID observer not supported");
      }
    };

    measureWebVitals();

    // Additional performance monitoring
    if (typeof window !== "undefined" && "PerformanceObserver" in window) {
      // Monitor Long Tasks
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.duration > 50) {
              console.warn(
                `[Performance] Long task detected: ${entry.duration}ms`
              );

              if (window.gtag) {
                window.gtag("event", "long_task", {
                  event_category: "Performance",
                  value: Math.round(entry.duration),
                  non_interaction: true,
                });
              }
            }
          });
        });
        longTaskObserver.observe({ entryTypes: ["longtask"] });
      } catch (error) {
        console.warn("Long task observer not supported");
      }

      // Monitor Resource Loading
      try {
        const resourceObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.duration > 1000) {
              console.warn(
                `[Performance] Slow resource: ${entry.name} (${entry.duration}ms)`
              );

              if (window.gtag) {
                window.gtag("event", "slow_resource", {
                  event_category: "Performance",
                  event_label: entry.name,
                  value: Math.round(entry.duration),
                  non_interaction: true,
                });
              }
            }
          });
        });
        resourceObserver.observe({ entryTypes: ["resource"] });
      } catch (error) {
        console.warn("Resource observer not supported");
      }
    }
  }, []);

  return null;
}

/**
 * Performance Budget Monitor
 * Monitors performance budgets and alerts when exceeded
 */
export function PerformanceBudgetMonitor() {
  useEffect(() => {
    const budgets = {
      LCP: 2500, // 2.5 seconds
      FID: 100, // 100 milliseconds
      CLS: 0.1, // 0.1
      FCP: 1800, // 1.8 seconds
      TTFB: 800, // 800 milliseconds
    };

    const checkBudgets = () => {
      if (typeof window !== "undefined" && window.performance) {
        const navigation = performance.getEntriesByType(
          "navigation"
        )[0] as PerformanceNavigationTiming;

        if (navigation) {
          const ttfb = navigation.responseStart - navigation.fetchStart;

          if (ttfb > budgets.TTFB) {
            console.warn(
              `[Performance Budget] TTFB exceeded: ${ttfb}ms (budget: ${budgets.TTFB}ms)`
            );

            if (window.gtag) {
              window.gtag("event", "budget_exceeded", {
                event_category: "Performance Budget",
                event_label: "TTFB",
                value: Math.round(ttfb),
                non_interaction: true,
              });
            }
          }
        }
      }
    };

    // Check budgets after page load
    if (document.readyState === "complete") {
      setTimeout(checkBudgets, 1000);
    } else {
      window.addEventListener("load", () => {
        setTimeout(checkBudgets, 1000);
      });
    }
  }, []);

  return null;
}

/**
 * Combined Performance Monitor
 */
export function PerformanceMonitor() {
  return (
    <>
      <WebVitalsReporter />
      <PerformanceBudgetMonitor />
    </>
  );
}
