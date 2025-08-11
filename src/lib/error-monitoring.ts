// Error monitoring and logging system

export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  url?: string;
  timestamp?: string;
  buildVersion?: string;
  environment?: string;
  additionalData?: Record<string, any>;
}

export interface ErrorReport {
  id: string;
  message: string;
  stack?: string;
  name: string;
  level: "error" | "warning" | "info" | "debug";
  context: ErrorContext;
  fingerprint: string;
  count: number;
  firstSeen: string;
  lastSeen: string;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: string;
  context?: Record<string, any>;
}

class ErrorMonitoringService {
  private errorQueue: ErrorReport[] = [];
  private performanceQueue: PerformanceMetric[] = [];
  private isOnline: boolean = true;
  private flushInterval: NodeJS.Timeout | null = null;
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeMonitoring();
    this.startPeriodicFlush();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeMonitoring(): void {
    if (typeof window === "undefined") return;

    // Monitor online/offline status
    window.addEventListener("online", () => {
      this.isOnline = true;
      this.flushErrors();
    });

    window.addEventListener("offline", () => {
      this.isOnline = false;
    });

    // Global error handler
    window.addEventListener("error", (event) => {
      this.captureError(event.error || new Error(event.message), {
        url: event.filename,
        additionalData: {
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener("unhandledrejection", (event) => {
      this.captureError(
        new Error(`Unhandled Promise Rejection: ${event.reason}`),
        {
          additionalData: {
            reason: event.reason,
            promise: event.promise,
          },
        }
      );
    });

    // Performance monitoring
    this.initializePerformanceMonitoring();
  }

  private initializePerformanceMonitoring(): void {
    if (typeof window === "undefined" || !window.performance) return;

    // Monitor Core Web Vitals
    this.observeWebVitals();

    // Monitor resource loading
    this.observeResourceTiming();

    // Monitor navigation timing
    this.observeNavigationTiming();
  }

  private observeWebVitals(): void {
    // Largest Contentful Paint (LCP)
    if ("PerformanceObserver" in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];

          this.capturePerformanceMetric({
            name: "LCP",
            value: lastEntry.startTime,
            unit: "ms",
            timestamp: new Date().toISOString(),
          });
        });

        lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
      } catch (error) {
        console.warn("LCP observer not supported:", error);
      }

      // First Input Delay (FID)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            this.capturePerformanceMetric({
              name: "FID",
              value: entry.processingStart - entry.startTime,
              unit: "ms",
              timestamp: new Date().toISOString(),
            });
          });
        });

        fidObserver.observe({ entryTypes: ["first-input"] });
      } catch (error) {
        console.warn("FID observer not supported:", error);
      }

      // Cumulative Layout Shift (CLS)
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });

          this.capturePerformanceMetric({
            name: "CLS",
            value: clsValue,
            unit: "score",
            timestamp: new Date().toISOString(),
          });
        });

        clsObserver.observe({ entryTypes: ["layout-shift"] });
      } catch (error) {
        console.warn("CLS observer not supported:", error);
      }
    }
  }

  private observeResourceTiming(): void {
    if (typeof window === "undefined" || !window.performance) return;

    // Monitor slow resources
    const resourceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        const duration = entry.responseEnd - entry.startTime;

        // Report slow resources (>2 seconds)
        if (duration > 2000) {
          this.capturePerformanceMetric({
            name: "slow_resource",
            value: duration,
            unit: "ms",
            timestamp: new Date().toISOString(),
            context: {
              name: entry.name,
              type: entry.initiatorType,
              size: entry.transferSize,
            },
          });
        }
      });
    });

    try {
      resourceObserver.observe({ entryTypes: ["resource"] });
    } catch (error) {
      console.warn("Resource observer not supported:", error);
    }
  }

  private observeNavigationTiming(): void {
    if (typeof window === "undefined" || !window.performance) return;

    window.addEventListener("load", () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType("navigation")[0] as any;

        if (navigation) {
          // Time to Interactive approximation
          const tti = navigation.domInteractive - navigation.navigationStart;
          this.capturePerformanceMetric({
            name: "TTI",
            value: tti,
            unit: "ms",
            timestamp: new Date().toISOString(),
          });

          // First Contentful Paint
          const fcp = navigation.responseStart - navigation.navigationStart;
          this.capturePerformanceMetric({
            name: "FCP",
            value: fcp,
            unit: "ms",
            timestamp: new Date().toISOString(),
          });
        }
      }, 0);
    });
  }

  public captureError(
    error: Error,
    context: Partial<ErrorContext> = {},
    level: ErrorReport["level"] = "error"
  ): void {
    const errorReport: ErrorReport = {
      id: this.generateErrorId(),
      message: error.message,
      stack: error.stack,
      name: error.name,
      level,
      context: {
        userId: this.getUserId(),
        sessionId: this.sessionId,
        userAgent:
          typeof window !== "undefined"
            ? window.navigator.userAgent
            : "unknown",
        url: typeof window !== "undefined" ? window.location.href : "unknown",
        timestamp: new Date().toISOString(),
        buildVersion: process.env.NEXT_PUBLIC_BUILD_VERSION || "unknown",
        environment: process.env.NODE_ENV || "unknown",
        ...context,
      },
      fingerprint: this.generateFingerprint(error),
      count: 1,
      firstSeen: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
    };

    // Check if we already have this error
    const existingError = this.errorQueue.find(
      (e) => e.fingerprint === errorReport.fingerprint
    );

    if (existingError) {
      existingError.count++;
      existingError.lastSeen = errorReport.lastSeen;
    } else {
      this.errorQueue.push(errorReport);
    }

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error captured:", errorReport);
    }

    // Flush immediately for critical errors
    if (level === "error") {
      this.flushErrors();
    }
  }

  public capturePerformanceMetric(metric: PerformanceMetric): void {
    this.performanceQueue.push(metric);

    // Log performance issues in development
    if (process.env.NODE_ENV === "development") {
      if (
        (metric.name === "LCP" && metric.value > 2500) ||
        (metric.name === "FID" && metric.value > 100) ||
        (metric.name === "CLS" && metric.value > 0.1)
      ) {
        console.warn("Performance issue detected:", metric);
      }
    }
  }

  public captureUserAction(action: string, data?: Record<string, any>): void {
    this.captureError(
      new Error(`User Action: ${action}`),
      {
        additionalData: {
          action,
          ...data,
        },
      },
      "info"
    );
  }

  private async flushErrors(): Promise<void> {
    if (!this.isOnline || this.errorQueue.length === 0) return;

    const errorsToFlush = [...this.errorQueue];
    this.errorQueue = [];

    try {
      await fetch("/api/errors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          errors: errorsToFlush,
          performance: this.performanceQueue,
          session: {
            id: this.sessionId,
            timestamp: new Date().toISOString(),
          },
        }),
      });

      this.performanceQueue = [];
    } catch (error) {
      // Put errors back in queue if flush failed
      this.errorQueue.unshift(...errorsToFlush);
      console.warn("Failed to flush errors:", error);
    }
  }

  private startPeriodicFlush(): void {
    this.flushInterval = setInterval(() => {
      this.flushErrors();
    }, 30000); // Flush every 30 seconds
  }

  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateFingerprint(error: Error): string {
    // Create a unique fingerprint for grouping similar errors
    const key = `${error.name}:${error.message}:${this.getStackTrace(error)}`;
    return this.hashString(key);
  }

  private getStackTrace(error: Error): string {
    if (!error.stack) return "";

    // Get the first few lines of stack trace for fingerprinting
    return error.stack
      .split("\n")
      .slice(0, 3)
      .map((line) => line.trim())
      .join("|");
  }

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  private getUserId(): string | undefined {
    // Try to get user ID from various sources
    if (typeof window === "undefined") return undefined;

    // Check localStorage
    try {
      const userId = localStorage.getItem("user_id");
      if (userId) return userId;
    } catch {
      // Ignore localStorage errors
    }

    // Check cookies
    try {
      const cookies = document.cookie.split(";");
      const userCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("user_id=")
      );
      if (userCookie) {
        return userCookie.split("=")[1];
      }
    } catch {
      // Ignore cookie errors
    }

    return undefined;
  }

  public destroy(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
  }
}

// Singleton instance
export const errorMonitoring = new ErrorMonitoringService();

// React hook for error monitoring
export function useErrorMonitoring() {
  return {
    captureError: errorMonitoring.captureError.bind(errorMonitoring),
    capturePerformanceMetric:
      errorMonitoring.capturePerformanceMetric.bind(errorMonitoring),
    captureUserAction: errorMonitoring.captureUserAction.bind(errorMonitoring),
  };
}

// Export for React import
import React from "react";

// Higher-order component for error monitoring
export function withErrorMonitoring<P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string
) {
  return function MonitoredComponent(props: P) {
    const { captureError } = useErrorMonitoring();

    const handleError = (error: Error, errorInfo: any) => {
      captureError(error, {
        additionalData: {
          component: componentName || Component.name,
          props: JSON.stringify(props),
          errorInfo,
        },
      });
    };

    return React.createElement(
      SimpleErrorBoundary,
      { onError: handleError },
      React.createElement(Component, props)
    );
  };
}

// Simple error boundary for the HOC
class SimpleErrorBoundary extends React.Component<
  {
    children: React.ReactNode;
    onError: (error: Error, errorInfo: any) => void;
  },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    this.props.onError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return React.createElement(
        "div",
        { className: "p-4 border border-red-500 bg-red-50 text-red-900" },
        React.createElement("h3", null, "Component Error"),
        React.createElement(
          "p",
          null,
          "This component encountered an error and has been reported."
        )
      );
    }

    return this.props.children;
  }
}
