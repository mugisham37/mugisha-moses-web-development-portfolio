/**
 * Async Analytics Utility
 * Provides lightweight analytics tracking with performance optimization
 */

interface AnalyticsEvent {
  name: string;
  category: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

interface AnalyticsConfig {
  enabled: boolean;
  batchSize: number;
  flushInterval: number;
  maxRetries: number;
}

class AsyncAnalytics {
  private config: AnalyticsConfig = {
    enabled: true,
    batchSize: 10,
    flushInterval: 5000,
    maxRetries: 3,
  };

  private eventQueue: AnalyticsEvent[] = [];
  private flushTimer: NodeJS.Timeout | null = null;
  private isOnline = true;

  constructor() {
    // Check if we're in a browser environment
    if (typeof window !== "undefined") {
      // Monitor online status
      window.addEventListener("online", () => {
        this.isOnline = true;
        this.flush();
      });

      window.addEventListener("offline", () => {
        this.isOnline = false;
      });

      // Flush events before page unload
      window.addEventListener("beforeunload", () => {
        this.flush(true);
      });

      // Start the flush timer
      this.startFlushTimer();
    }
  }

  /**
   * Track an event
   */
  trackEvent(
    name: string,
    category: string,
    properties?: Record<string, any>
  ): void {
    if (!this.config.enabled) return;

    const event: AnalyticsEvent = {
      name,
      category,
      properties,
      timestamp: Date.now(),
    };

    this.eventQueue.push(event);

    // Auto-flush if batch size is reached
    if (this.eventQueue.length >= this.config.batchSize) {
      this.flush();
    }
  }

  /**
   * Track page view
   */
  trackPageView(path: string, title?: string): void {
    this.trackEvent("page_view", "navigation", {
      path,
      title,
      referrer: typeof document !== "undefined" ? document.referrer : undefined,
      userAgent:
        typeof navigator !== "undefined" ? navigator.userAgent : undefined,
    });
  }

  /**
   * Track user interaction
   */
  trackInteraction(
    element: string,
    action: string,
    properties?: Record<string, any>
  ): void {
    this.trackEvent("user_interaction", "engagement", {
      element,
      action,
      ...properties,
    });
  }

  /**
   * Track performance metrics
   */
  trackPerformance(metric: string, value: number, unit: string = "ms"): void {
    this.trackEvent("performance_metric", "performance", {
      metric,
      value,
      unit,
      timestamp: performance.now(),
    });
  }

  /**
   * Track errors
   */
  trackError(error: Error, context?: string): void {
    this.trackEvent("error", "error_tracking", {
      message: error.message,
      stack: error.stack,
      context,
      userAgent:
        typeof navigator !== "undefined" ? navigator.userAgent : undefined,
    });
  }

  /**
   * Flush events to analytics service
   */
  private async flush(immediate: boolean = false): Promise<void> {
    if (this.eventQueue.length === 0) return;

    const events = [...this.eventQueue];
    this.eventQueue = [];

    try {
      // In a real implementation, you would send events to your analytics service
      // For now, we'll just log them in development
      if (process.env.NODE_ENV === "development") {
        console.group("📊 Analytics Events");
        events.forEach((event) => {
          console.log(`${event.category}:${event.name}`, event.properties);
        });
        console.groupEnd();
      }

      // Simulate API call in production
      if (process.env.NODE_ENV === "production" && this.isOnline) {
        await this.sendEvents(events, immediate);
      }
    } catch (error) {
      console.warn("Failed to send analytics events:", error);
      // Re-queue events for retry (up to max retries)
      this.eventQueue.unshift(...events);
    }
  }

  /**
   * Send events to analytics service
   */
  private async sendEvents(
    events: AnalyticsEvent[],
    immediate: boolean = false
  ): Promise<void> {
    // This is a placeholder for actual analytics service integration
    // You would replace this with calls to Google Analytics, Mixpanel, etc.

    const payload = {
      events,
      timestamp: Date.now(),
      session_id: this.getSessionId(),
    };

    if (immediate && navigator.sendBeacon) {
      // Use sendBeacon for immediate sends (like page unload)
      navigator.sendBeacon("/api/analytics", JSON.stringify(payload));
    } else {
      // Use fetch for regular sends
      try {
        await fetch("/api/analytics", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      } catch (error) {
        // Silently fail in production, log in development
        if (process.env.NODE_ENV === "development") {
          console.warn("Analytics API not available:", error);
        }
      }
    }
  }

  /**
   * Get or create session ID
   */
  private getSessionId(): string {
    if (typeof window === "undefined") return "server-side";

    let sessionId = sessionStorage.getItem("analytics_session_id");
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem("analytics_session_id", sessionId);
    }
    return sessionId;
  }

  /**
   * Start the flush timer
   */
  private startFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.config.flushInterval);
  }

  /**
   * Configure analytics
   */
  configure(config: Partial<AnalyticsConfig>): void {
    this.config = { ...this.config, ...config };

    if (config.flushInterval) {
      this.startFlushTimer();
    }
  }

  /**
   * Enable/disable analytics
   */
  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;

    if (!enabled) {
      this.eventQueue = [];
      if (this.flushTimer) {
        clearInterval(this.flushTimer);
        this.flushTimer = null;
      }
    } else if (!this.flushTimer) {
      this.startFlushTimer();
    }
  }

  /**
   * Get current queue size
   */
  getQueueSize(): number {
    return this.eventQueue.length;
  }

  /**
   * Clear event queue
   */
  clearQueue(): void {
    this.eventQueue = [];
  }
}

// Create and export singleton instance
export const asyncAnalytics = new AsyncAnalytics();

// Export types for external use
export type { AnalyticsEvent, AnalyticsConfig };
