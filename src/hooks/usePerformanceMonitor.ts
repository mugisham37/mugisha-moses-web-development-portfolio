/**
 * Performance Monitoring Hook
 * Tracks Core Web Vitals and custom performance metrics
 */

import { useEffect, useRef, useState } from "react";
import {
  trackWebVitals,
  trackPerformanceIssue,
  WebVitalsMetric,
} from "@/utils/analytics";

interface PerformanceMetrics {
  // Core Web Vitals
  cls: number | null;
  fid: number | null;
  fcp: number | null;
  lcp: number | null;
  ttfb: number | null;

  // Custom metrics
  themeTransitionTime: number | null;
  animationFrameRate: number | null;
  memoryUsage: number | null;

  // Performance state
  isMonitoring: boolean;
  lastUpdate: number;
}

interface UsePerformanceMonitorOptions {
  enableWebVitals?: boolean;
  enableCustomMetrics?: boolean;
  enableMemoryMonitoring?: boolean;
  reportingInterval?: number;
  performanceBudget?: {
    lcp: number;
    fid: number;
    cls: number;
    fcp: number;
    ttfb: number;
  };
}

const defaultOptions: UsePerformanceMonitorOptions = {
  enableWebVitals: true,
  enableCustomMetrics: true,
  enableMemoryMonitoring: true,
  reportingInterval: 30000, // 30 seconds
  performanceBudget: {
    lcp: 2500,
    fid: 100,
    cls: 0.1,
    fcp: 1800,
    ttfb: 800,
  },
};

export const usePerformanceMonitor = (
  options: UsePerformanceMonitorOptions = {}
) => {
  const opts = { ...defaultOptions, ...options };
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    cls: null,
    fid: null,
    fcp: null,
    lcp: null,
    ttfb: null,
    themeTransitionTime: null,
    animationFrameRate: null,
    memoryUsage: null,
    isMonitoring: false,
    lastUpdate: Date.now(),
  });

  const observerRef = useRef<PerformanceObserver | null>(null);
  const frameCountRef = useRef(0);
  const lastFrameTimeRef = useRef(performance.now());
  const reportingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Web Vitals monitoring
  useEffect(() => {
    if (!opts.enableWebVitals || typeof window === "undefined") return;

    // Import web-vitals dynamically
    import("web-vitals")
      .then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        // Cumulative Layout Shift
        getCLS((metric) => {
          const webVital: WebVitalsMetric = {
            id: metric.id,
            name: "CLS",
            value: metric.value,
            delta: metric.delta,
            rating:
              metric.value <= 0.1
                ? "good"
                : metric.value <= 0.25
                  ? "needs-improvement"
                  : "poor",
            navigationType: metric.navigationType,
          };

          trackWebVitals(webVital);
          setMetrics((prev) => ({
            ...prev,
            cls: metric.value,
            lastUpdate: Date.now(),
          }));
        });

        // First Input Delay
        getFID((metric) => {
          const webVital: WebVitalsMetric = {
            id: metric.id,
            name: "FID",
            value: metric.value,
            delta: metric.delta,
            rating:
              metric.value <= 100
                ? "good"
                : metric.value <= 300
                  ? "needs-improvement"
                  : "poor",
            navigationType: metric.navigationType,
          };

          trackWebVitals(webVital);
          setMetrics((prev) => ({
            ...prev,
            fid: metric.value,
            lastUpdate: Date.now(),
          }));
        });

        // First Contentful Paint
        getFCP((metric) => {
          const webVital: WebVitalsMetric = {
            id: metric.id,
            name: "FCP",
            value: metric.value,
            delta: metric.delta,
            rating:
              metric.value <= 1800
                ? "good"
                : metric.value <= 3000
                  ? "needs-improvement"
                  : "poor",
            navigationType: metric.navigationType,
          };

          trackWebVitals(webVital);
          setMetrics((prev) => ({
            ...prev,
            fcp: metric.value,
            lastUpdate: Date.now(),
          }));
        });

        // Largest Contentful Paint
        getLCP((metric) => {
          const webVital: WebVitalsMetric = {
            id: metric.id,
            name: "LCP",
            value: metric.value,
            delta: metric.delta,
            rating:
              metric.value <= 2500
                ? "good"
                : metric.value <= 4000
                  ? "needs-improvement"
                  : "poor",
            navigationType: metric.navigationType,
          };

          trackWebVitals(webVital);
          setMetrics((prev) => ({
            ...prev,
            lcp: metric.value,
            lastUpdate: Date.now(),
          }));
        });

        // Time to First Byte
        getTTFB((metric) => {
          const webVital: WebVitalsMetric = {
            id: metric.id,
            name: "TTFB",
            value: metric.value,
            delta: metric.delta,
            rating:
              metric.value <= 800
                ? "good"
                : metric.value <= 1800
                  ? "needs-improvement"
                  : "poor",
            navigationType: metric.navigationType,
          };

          trackWebVitals(webVital);
          setMetrics((prev) => ({
            ...prev,
            ttfb: metric.value,
            lastUpdate: Date.now(),
          }));
        });

        setMetrics((prev) => ({ ...prev, isMonitoring: true }));
      })
      .catch((error) => {
        console.warn("Failed to load web-vitals library:", error);
      });
  }, [opts.enableWebVitals]);

  // Custom performance metrics monitoring
  useEffect(() => {
    if (!opts.enableCustomMetrics || typeof window === "undefined") return;

    // Monitor animation frame rate
    const measureFrameRate = () => {
      const now = performance.now();
      frameCountRef.current++;

      if (now - lastFrameTimeRef.current >= 1000) {
        const fps = Math.round(
          (frameCountRef.current * 1000) / (now - lastFrameTimeRef.current)
        );

        setMetrics((prev) => ({
          ...prev,
          animationFrameRate: fps,
          lastUpdate: Date.now(),
        }));

        // Track performance issues for low FPS
        if (fps < 30) {
          trackPerformanceIssue("low_fps", fps, 60);
        }

        frameCountRef.current = 0;
        lastFrameTimeRef.current = now;
      }

      requestAnimationFrame(measureFrameRate);
    };

    requestAnimationFrame(measureFrameRate);
  }, [opts.enableCustomMetrics]);

  // Memory usage monitoring
  useEffect(() => {
    if (!opts.enableMemoryMonitoring || typeof window === "undefined") return;

    const measureMemoryUsage = () => {
      if ("memory" in performance) {
        const memory = (performance as any).memory;
        const usedMB = Math.round(memory.usedJSHeapSize / 1048576);

        setMetrics((prev) => ({
          ...prev,
          memoryUsage: usedMB,
          lastUpdate: Date.now(),
        }));

        // Track high memory usage
        if (usedMB > 100) {
          trackPerformanceIssue("high_memory_usage", usedMB, 100);
        }
      }
    };

    // Measure immediately and then every 10 seconds
    measureMemoryUsage();
    const interval = setInterval(measureMemoryUsage, 10000);

    return () => clearInterval(interval);
  }, [opts.enableMemoryMonitoring]);

  // Performance budget monitoring
  useEffect(() => {
    if (!opts.performanceBudget) return;

    const budget = opts.performanceBudget;

    // Check LCP budget
    if (metrics.lcp !== null && metrics.lcp > budget.lcp) {
      trackPerformanceIssue("lcp_budget_exceeded", metrics.lcp, budget.lcp);
    }

    // Check FID budget
    if (metrics.fid !== null && metrics.fid > budget.fid) {
      trackPerformanceIssue("fid_budget_exceeded", metrics.fid, budget.fid);
    }

    // Check CLS budget
    if (metrics.cls !== null && metrics.cls > budget.cls) {
      trackPerformanceIssue("cls_budget_exceeded", metrics.cls, budget.cls);
    }

    // Check FCP budget
    if (metrics.fcp !== null && metrics.fcp > budget.fcp) {
      trackPerformanceIssue("fcp_budget_exceeded", metrics.fcp, budget.fcp);
    }

    // Check TTFB budget
    if (metrics.ttfb !== null && metrics.ttfb > budget.ttfb) {
      trackPerformanceIssue("ttfb_budget_exceeded", metrics.ttfb, budget.ttfb);
    }
  }, [metrics, opts.performanceBudget]);

  // Periodic reporting
  useEffect(() => {
    if (!opts.reportingInterval) return;

    reportingIntervalRef.current = setInterval(() => {
      console.log("Performance Metrics Report:", {
        timestamp: new Date().toISOString(),
        metrics: {
          webVitals: {
            cls: metrics.cls,
            fid: metrics.fid,
            fcp: metrics.fcp,
            lcp: metrics.lcp,
            ttfb: metrics.ttfb,
          },
          custom: {
            fps: metrics.animationFrameRate,
            memory: metrics.memoryUsage,
            themeTransition: metrics.themeTransitionTime,
          },
        },
      });
    }, opts.reportingInterval);

    return () => {
      if (reportingIntervalRef.current) {
        clearInterval(reportingIntervalRef.current);
      }
    };
  }, [metrics, opts.reportingInterval]);

  // Theme transition performance measurement
  const measureThemeTransition = (startTime: number, endTime: number) => {
    const transitionTime = endTime - startTime;

    setMetrics((prev) => ({
      ...prev,
      themeTransitionTime: transitionTime,
      lastUpdate: Date.now(),
    }));

    // Track slow theme transitions
    if (transitionTime > 1000) {
      trackPerformanceIssue("slow_theme_transition", transitionTime, 600);
    }
  };

  // Get performance score based on Web Vitals
  const getPerformanceScore = (): number => {
    const scores = [];

    if (metrics.lcp !== null) {
      scores.push(metrics.lcp <= 2500 ? 100 : metrics.lcp <= 4000 ? 50 : 0);
    }

    if (metrics.fid !== null) {
      scores.push(metrics.fid <= 100 ? 100 : metrics.fid <= 300 ? 50 : 0);
    }

    if (metrics.cls !== null) {
      scores.push(metrics.cls <= 0.1 ? 100 : metrics.cls <= 0.25 ? 50 : 0);
    }

    if (metrics.fcp !== null) {
      scores.push(metrics.fcp <= 1800 ? 100 : metrics.fcp <= 3000 ? 50 : 0);
    }

    if (metrics.ttfb !== null) {
      scores.push(metrics.ttfb <= 800 ? 100 : metrics.ttfb <= 1800 ? 50 : 0);
    }

    return scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;
  };

  // Get performance status
  const getPerformanceStatus = ():
    | "excellent"
    | "good"
    | "needs-improvement"
    | "poor" => {
    const score = getPerformanceScore();

    if (score >= 90) return "excellent";
    if (score >= 75) return "good";
    if (score >= 50) return "needs-improvement";
    return "poor";
  };

  // Export performance data
  const exportPerformanceData = () => {
    const data = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      metrics,
      score: getPerformanceScore(),
      status: getPerformanceStatus(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `performance-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return {
    metrics,
    measureThemeTransition,
    getPerformanceScore,
    getPerformanceStatus,
    exportPerformanceData,
    isMonitoring: metrics.isMonitoring,
  };
};

export default usePerformanceMonitor;
