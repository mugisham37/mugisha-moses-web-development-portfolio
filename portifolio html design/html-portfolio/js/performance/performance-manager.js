/* ==========================================================================
   PERFORMANCE MANAGER
   Orchestrates all performance optimization systems
   ========================================================================== */

/**
 * Performance Manager Module
 * Coordinates all performance optimization systems
 */
class PerformanceManager {
  constructor() {
    this.systems = new Map();
    this.initialized = false;
    this.metrics = {
      loadStart: performance.now(),
      criticalResourcesLoaded: null,
      firstContentfulPaint: null,
      largestContentfulPaint: null,
      firstInputDelay: null,
      cumulativeLayoutShift: 0,
    };
  }

  /**
   * Initialize all performance systems
   */
  async init() {
    if (this.initialized) return;

    try {
      console.log("Initializing performance optimization systems...");

      // Initialize systems in order of priority
      await this.initializeSystems();

      // Set up performance monitoring
      this.setupPerformanceMonitoring();

      // Set up error handling
      this.setupErrorHandling();

      // Mark initialization complete
      this.initialized = true;
      this.metrics.initializationComplete = performance.now();

      console.log(
        `Performance systems initialized in ${(
          this.metrics.initializationComplete - this.metrics.loadStart
        ).toFixed(2)}ms`
      );

      // Report initial metrics
      this.reportMetrics();
    } catch (error) {
      console.error("Failed to initialize performance systems:", error);
    }
  }

  /**
   * Initialize all performance systems
   */
  async initializeSystems() {
    // 1. Critical CSS Inliner (highest priority)
    if (window.CriticalCSSInliner) {
      const criticalCSS = new CriticalCSSInliner();
      await criticalCSS.init();
      this.systems.set("criticalCSS", criticalCSS);
    }

    // 2. Font Loader (high priority)
    if (window.FontLoader) {
      const fontLoader = new FontLoader();
      fontLoader.init();
      this.systems.set("fontLoader", fontLoader);
    }

    // 3. Resource Prioritizer (high priority)
    if (window.ResourcePrioritizer) {
      const resourcePrioritizer = new ResourcePrioritizer();
      resourcePrioritizer.init();
      this.systems.set("resourcePrioritizer", resourcePrioritizer);
    }

    // 4. Image Optimizer (medium priority)
    if (window.ImageOptimizer) {
      const imageOptimizer = new ImageOptimizer();
      await imageOptimizer.init();
      this.systems.set("imageOptimizer", imageOptimizer);
    }

    // 5. Code Splitter (lower priority)
    if (window.CodeSplitter) {
      const codeSplitter = new CodeSplitter();
      codeSplitter.init();
      this.systems.set("codeSplitter", codeSplitter);
    }
  }

  /**
   * Setup performance monitoring
   */
  setupPerformanceMonitoring() {
    // Monitor Core Web Vitals
    this.monitorCoreWebVitals();

    // Monitor resource loading
    this.monitorResourceLoading();

    // Monitor JavaScript performance
    this.monitorJavaScriptPerformance();

    // Set up periodic reporting
    this.setupPeriodicReporting();
  }

  /**
   * Monitor Core Web Vitals
   */
  monitorCoreWebVitals() {
    // First Contentful Paint
    if ("PerformanceObserver" in window) {
      const fcpObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.name === "first-contentful-paint") {
            this.metrics.firstContentfulPaint = entry.startTime;
            console.log(`FCP: ${entry.startTime.toFixed(2)}ms`);
          }
        });
      });
      fcpObserver.observe({ entryTypes: ["paint"] });

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.largestContentfulPaint = lastEntry.startTime;
        console.log(`LCP: ${lastEntry.startTime.toFixed(2)}ms`);
      });
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (!entry.hadRecentInput) {
            this.metrics.cumulativeLayoutShift += entry.value;
          }
        });
      });
      clsObserver.observe({ entryTypes: ["layout-shift"] });

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.metrics.firstInputDelay =
            entry.processingStart - entry.startTime;
          console.log(`FID: ${this.metrics.firstInputDelay.toFixed(2)}ms`);
        });
      });
      fidObserver.observe({ entryTypes: ["first-input"] });
    }
  }

  /**
   * Monitor resource loading
   */
  monitorResourceLoading() {
    if (!("PerformanceObserver" in window)) return;

    const resourceObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        this.analyzeResourceTiming(entry);
      });
    });
    resourceObserver.observe({ entryTypes: ["resource"] });
  }

  /**
   * Analyze resource timing
   */
  analyzeResourceTiming(entry) {
    const duration = entry.responseEnd - entry.startTime;
    const resourceType = this.getResourceType(entry.name);

    // Log slow resources
    if (duration > 1000) {
      console.warn(
        `Slow ${resourceType}: ${entry.name} (${duration.toFixed(2)}ms)`
      );
    }

    // Track critical resource loading
    if (this.isCriticalResource(entry.name)) {
      if (!this.metrics.criticalResourcesLoaded) {
        this.metrics.criticalResourcesLoaded = entry.responseEnd;
      }
    }
  }

  /**
   * Monitor JavaScript performance
   */
  monitorJavaScriptPerformance() {
    // Monitor long tasks
    if ("PerformanceObserver" in window) {
      const longTaskObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          console.warn(`Long task detected: ${entry.duration.toFixed(2)}ms`);
        });
      });
      longTaskObserver.observe({ entryTypes: ["longtask"] });
    }

    // Monitor memory usage
    if ("memory" in performance) {
      setInterval(() => {
        const memory = performance.memory;
        if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
          console.warn("High memory usage detected");
        }
      }, 30000); // Check every 30 seconds
    }
  }

  /**
   * Setup periodic reporting
   */
  setupPeriodicReporting() {
    // Report metrics after page load
    window.addEventListener("load", () => {
      setTimeout(() => this.reportMetrics(), 1000);
    });

    // Report metrics periodically
    setInterval(() => {
      this.reportMetrics();
    }, 60000); // Every minute
  }

  /**
   * Setup error handling
   */
  setupErrorHandling() {
    // Handle JavaScript errors
    window.addEventListener("error", (event) => {
      console.error("JavaScript error:", event.error);
      this.reportError("javascript", event.error);
    });

    // Handle unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      console.error("Unhandled promise rejection:", event.reason);
      this.reportError("promise", event.reason);
    });

    // Handle resource loading errors
    document.addEventListener(
      "error",
      (event) => {
        if (event.target !== window) {
          console.error(
            "Resource loading error:",
            event.target.src || event.target.href
          );
          this.reportError("resource", event.target);
        }
      },
      true
    );
  }

  /**
   * Get resource type from URL
   */
  getResourceType(url) {
    if (url.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i)) return "image";
    if (url.match(/\.(css)$/i)) return "stylesheet";
    if (url.match(/\.(js)$/i)) return "script";
    if (url.match(/\.(woff|woff2|ttf|otf)$/i)) return "font";
    return "other";
  }

  /**
   * Check if resource is critical
   */
  isCriticalResource(url) {
    const criticalPatterns = [
      /critical\.css/,
      /main\.css/,
      /Space.*Mono/,
      /JetBrains.*Mono/,
      /Inter/,
      /hero.*\.(jpg|jpeg|png|webp)/i,
    ];

    return criticalPatterns.some((pattern) => pattern.test(url));
  }

  /**
   * Report performance metrics
   */
  reportMetrics() {
    const report = {
      timestamp: Date.now(),
      loadTime: performance.now() - this.metrics.loadStart,
      ...this.metrics,
      systems: this.getSystemsStatus(),
      coreWebVitals: this.getCoreWebVitalsStatus(),
    };

    console.log("Performance Report:", report);

    // Send to analytics if available
    if (typeof gtag !== "undefined") {
      this.sendToAnalytics(report);
    }

    return report;
  }

  /**
   * Get systems status
   */
  getSystemsStatus() {
    const status = {};

    this.systems.forEach((system, name) => {
      if (typeof system.getStatus === "function") {
        status[name] = system.getStatus();
      } else if (typeof system.getFontLoadingStatus === "function") {
        status[name] = system.getFontLoadingStatus();
      } else if (typeof system.getLoadingStatus === "function") {
        status[name] = system.getLoadingStatus();
      } else if (typeof system.getPrioritizationStatus === "function") {
        status[name] = system.getPrioritizationStatus();
      } else {
        status[name] = { initialized: system.initialized || true };
      }
    });

    return status;
  }

  /**
   * Get Core Web Vitals status
   */
  getCoreWebVitalsStatus() {
    return {
      fcp: {
        value: this.metrics.firstContentfulPaint,
        rating: this.getRating(this.metrics.firstContentfulPaint, [1800, 3000]),
      },
      lcp: {
        value: this.metrics.largestContentfulPaint,
        rating: this.getRating(
          this.metrics.largestContentfulPaint,
          [2500, 4000]
        ),
      },
      fid: {
        value: this.metrics.firstInputDelay,
        rating: this.getRating(this.metrics.firstInputDelay, [100, 300]),
      },
      cls: {
        value: this.metrics.cumulativeLayoutShift,
        rating: this.getRating(this.metrics.cumulativeLayoutShift, [0.1, 0.25]),
      },
    };
  }

  /**
   * Get rating for metric
   */
  getRating(value, thresholds) {
    if (value === null || value === undefined) return "unknown";
    if (value <= thresholds[0]) return "good";
    if (value <= thresholds[1]) return "needs-improvement";
    return "poor";
  }

  /**
   * Send metrics to analytics
   */
  sendToAnalytics(report) {
    // Send Core Web Vitals
    if (report.coreWebVitals.lcp.value) {
      gtag("event", "web_vitals", {
        event_category: "Performance",
        event_label: "LCP",
        value: Math.round(report.coreWebVitals.lcp.value),
      });
    }

    if (report.coreWebVitals.fid.value) {
      gtag("event", "web_vitals", {
        event_category: "Performance",
        event_label: "FID",
        value: Math.round(report.coreWebVitals.fid.value),
      });
    }

    if (report.coreWebVitals.cls.value) {
      gtag("event", "web_vitals", {
        event_category: "Performance",
        event_label: "CLS",
        value: Math.round(report.coreWebVitals.cls.value * 1000),
      });
    }
  }

  /**
   * Report error
   */
  reportError(type, error) {
    const errorReport = {
      type,
      message: error.message || error.toString(),
      stack: error.stack,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    // Send to error tracking service if available
    if (typeof gtag !== "undefined") {
      gtag("event", "exception", {
        description: errorReport.message,
        fatal: false,
      });
    }
  }

  /**
   * Get system by name
   */
  getSystem(name) {
    return this.systems.get(name);
  }

  /**
   * Get all systems
   */
  getAllSystems() {
    return Array.from(this.systems.entries());
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary() {
    return {
      initialized: this.initialized,
      systemsCount: this.systems.size,
      loadTime: performance.now() - this.metrics.loadStart,
      coreWebVitals: this.getCoreWebVitalsStatus(),
      systems: Array.from(this.systems.keys()),
    };
  }
}

// Initialize performance manager when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  window.performanceManager = new PerformanceManager();
  window.performanceManager.init();
});

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = PerformanceManager;
} else {
  window.PerformanceManager = PerformanceManager;
}
