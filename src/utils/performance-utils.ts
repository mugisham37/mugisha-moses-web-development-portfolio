"use client";

// Performance monitoring and optimization utilities
export interface PerformanceMetrics {
  FCP?: number; // First Contentful Paint
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay
  CLS?: number; // Cumulative Layout Shift
  TTFB?: number; // Time to First Byte
  TTI?: number; // Time to Interactive
}

export interface BundleMetrics {
  name: string;
  size: number;
  loadTime: number;
  cached: boolean;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private bundles: BundleMetrics[] = [];
  private observers: PerformanceObserver[] = [];

  constructor() {
    if (typeof window !== "undefined") {
      this.initializeObservers();
      this.trackBundleLoading();
    }
  }

  private initializeObservers() {
    // Core Web Vitals Observer
    if ("PerformanceObserver" in window) {
      // LCP Observer
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
          startTime: number;
        };

        this.metrics.LCP = lastEntry.startTime;
        this.reportMetric("LCP", lastEntry.startTime);
      });

      try {
        lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
        this.observers.push(lcpObserver);
      } catch (e) {
        console.warn("[Perf] LCP observer not supported");
      }

      // FID Observer
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.metrics.FID = entry.processingStart - entry.startTime;
          this.reportMetric("FID", this.metrics.FID);
        });
      });

      try {
        fidObserver.observe({ entryTypes: ["first-input"] });
        this.observers.push(fidObserver);
      } catch (e) {
        console.warn("[Perf] FID observer not supported");
      }

      // CLS Observer
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries();

        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });

        this.metrics.CLS = clsValue;
        this.reportMetric("CLS", clsValue);
      });

      try {
        clsObserver.observe({ entryTypes: ["layout-shift"] });
        this.observers.push(clsObserver);
      } catch (e) {
        console.warn("[Perf] CLS observer not supported");
      }

      // Navigation Observer
      const navObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.metrics.TTFB = entry.responseStart - entry.requestStart;
          this.metrics.FCP = entry.loadEventEnd - entry.fetchStart;

          this.reportMetric("TTFB", this.metrics.TTFB);
          this.reportMetric("FCP", this.metrics.FCP);
        });
      });

      try {
        navObserver.observe({ entryTypes: ["navigation"] });
        this.observers.push(navObserver);
      } catch (e) {
        console.warn("[Perf] Navigation observer not supported");
      }
    }
  }

  private trackBundleLoading() {
    if ("PerformanceObserver" in window) {
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();

        entries.forEach((entry: any) => {
          if (entry.name.includes("/_next/static/chunks/")) {
            const bundleName = this.extractBundleName(entry.name);
            const bundleMetric: BundleMetrics = {
              name: bundleName,
              size: entry.transferSize || entry.encodedBodySize,
              loadTime: entry.responseEnd - entry.requestStart,
              cached: entry.transferSize === 0,
            };

            this.bundles.push(bundleMetric);
            this.reportBundleMetric(bundleMetric);
          }
        });
      });

      try {
        resourceObserver.observe({ entryTypes: ["resource"] });
        this.observers.push(resourceObserver);
      } catch (e) {
        console.warn("[Perf] Resource observer not supported");
      }
    }
  }

  private extractBundleName(url: string): string {
    const match = url.match(/chunks\/([^-]+)/);
    return match ? match[1] : "unknown";
  }

  private reportMetric(name: string, value: number) {
    console.log(
      `[Perf] ${name}: ${value.toFixed(2)}${name === "CLS" ? "" : "ms"}`
    );

    // Send to analytics
    this.sendToAnalytics(name, value);

    // Check against performance budget
    this.checkPerformanceBudget(name, value);
  }

  private reportBundleMetric(bundle: BundleMetrics) {
    const sizeKB = (bundle.size / 1024).toFixed(2);
    console.log(
      `[Bundle] ${bundle.name}: ${sizeKB}KB in ${bundle.loadTime.toFixed(2)}ms ${bundle.cached ? "(cached)" : ""}`
    );

    // Send bundle metrics to analytics
    this.sendBundleToAnalytics(bundle);
  }

  private sendToAnalytics(metric: string, value: number) {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "web_vitals", {
        metric_name: metric,
        metric_value: value,
        custom_parameter: "brutalist_portfolio",
      });
    }
  }

  private sendBundleToAnalytics(bundle: BundleMetrics) {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "bundle_performance", {
        bundle_name: bundle.name,
        bundle_size: bundle.size,
        load_time: bundle.loadTime,
        cached: bundle.cached,
      });
    }
  }

  private checkPerformanceBudget(metric: string, value: number) {
    const budgets = {
      FCP: 1500,
      LCP: 2500,
      FID: 100,
      CLS: 0.1,
      TTFB: 600,
    };

    const budget = budgets[metric as keyof typeof budgets];
    if (budget && value > budget) {
      console.warn(
        `[Perf] ${metric} (${value.toFixed(2)}) exceeds budget (${budget})`
      );

      // Send budget violation to analytics
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "performance_budget_violation", {
          metric_name: metric,
          metric_value: value,
          budget_value: budget,
        });
      }
    }
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public getBundleMetrics(): BundleMetrics[] {
    return [...this.bundles];
  }

  public generateReport(): string {
    const report = {
      timestamp: new Date().toISOString(),
      metrics: this.metrics,
      bundles: this.bundles,
      totalBundleSize: this.bundles.reduce(
        (total, bundle) => total + bundle.size,
        0
      ),
      averageLoadTime:
        this.bundles.reduce((total, bundle) => total + bundle.loadTime, 0) /
        this.bundles.length,
    };

    return JSON.stringify(report, null, 2);
  }

  public cleanup() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
  }
}

// Singleton instance
let performanceMonitor: PerformanceMonitor | null = null;

export function initializePerformanceMonitoring(): PerformanceMonitor {
  if (!performanceMonitor && typeof window !== "undefined") {
    performanceMonitor = new PerformanceMonitor();
  }
  return performanceMonitor!;
}

export function getPerformanceMonitor(): PerformanceMonitor | null {
  return performanceMonitor;
}

// Bundle size analysis utilities
export const bundleAnalysis = {
  // Analyze bundle composition
  analyzeBundles: () => {
    const monitor = getPerformanceMonitor();
    if (!monitor) return null;

    const bundles = monitor.getBundleMetrics();
    const analysis = {
      totalSize: bundles.reduce((total, bundle) => total + bundle.size, 0),
      bundleCount: bundles.length,
      largestBundle: bundles.reduce(
        (largest, bundle) => (bundle.size > largest.size ? bundle : largest),
        bundles[0]
      ),
      cachedBundles: bundles.filter((bundle) => bundle.cached).length,
      averageLoadTime:
        bundles.reduce((total, bundle) => total + bundle.loadTime, 0) /
        bundles.length,
    };

    return analysis;
  },

  // Check if bundles are within size limits
  checkBundleSizes: () => {
    const monitor = getPerformanceMonitor();
    if (!monitor) return [];

    const bundles = monitor.getBundleMetrics();
    const limits = {
      framework: 50 * 1024, // 50KB
      vendor: 100 * 1024, // 100KB
      main: 30 * 1024, // 30KB
      animations: 80 * 1024, // 80KB
    };

    const violations = bundles.filter((bundle) => {
      const limit = limits[bundle.name as keyof typeof limits];
      return limit && bundle.size > limit;
    });

    return violations;
  },

  // Generate optimization recommendations
  getOptimizationRecommendations: () => {
    const analysis = bundleAnalysis.analyzeBundles();
    const violations = bundleAnalysis.checkBundleSizes();

    if (!analysis) return [];

    const recommendations = [];

    if (analysis.totalSize > 300 * 1024) {
      // 300KB total
      recommendations.push(
        "Consider code splitting to reduce total bundle size"
      );
    }

    if (violations.length > 0) {
      recommendations.push(`${violations.length} bundles exceed size limits`);
    }

    if (analysis.cachedBundles / analysis.bundleCount < 0.5) {
      recommendations.push("Improve caching strategy for better performance");
    }

    if (analysis.averageLoadTime > 200) {
      recommendations.push("Bundle load times are high, consider optimization");
    }

    return recommendations;
  },
};

// Performance optimization utilities
export const performanceOptimization = {
  // Preload critical resources
  preloadCriticalResources: () => {
    const criticalResources = [
      "/_next/static/css/app/layout.css",
      "/_next/static/chunks/framework.js",
      "/hero-portrait.webp",
    ];

    criticalResources.forEach((resource) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = resource;
      link.as = resource.endsWith(".css")
        ? "style"
        : resource.endsWith(".js")
          ? "script"
          : "image";
      document.head.appendChild(link);
    });
  },

  // Optimize images for performance
  optimizeImages: () => {
    const images = document.querySelectorAll("img[data-optimize]");

    images.forEach((img: any) => {
      // Add loading="lazy" for below-the-fold images
      if (!img.hasAttribute("loading")) {
        img.loading = "lazy";
      }

      // Add decoding="async" for better performance
      if (!img.hasAttribute("decoding")) {
        img.decoding = "async";
      }
    });
  },

  // Reduce layout shifts
  preventLayoutShifts: () => {
    // Add aspect ratio containers for images
    const images = document.querySelectorAll("img:not([width]):not([height])");

    images.forEach((img: any) => {
      img.addEventListener("load", () => {
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        img.style.aspectRatio = aspectRatio.toString();
      });
    });
  },

  // Optimize animations for performance
  optimizeAnimations: () => {
    // Reduce motion for users who prefer it
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.style.setProperty(
        "--animation-duration",
        "0.01ms"
      );
      document.documentElement.style.setProperty(
        "--transition-duration",
        "0.01ms"
      );
    }

    // Use transform and opacity for animations
    const animatedElements = document.querySelectorAll("[data-animate]");

    animatedElements.forEach((element: any) => {
      element.style.willChange = "transform, opacity";
    });
  },
};

export default {
  initializePerformanceMonitoring,
  getPerformanceMonitor,
  bundleAnalysis,
  performanceOptimization,
};
