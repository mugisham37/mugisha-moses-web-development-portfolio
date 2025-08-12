/**
 * Comprehensive performance monitoring and alerting system
 * Tracks Core Web Vitals, API performance, and system health
 */

import { db } from "./db";

// Performance thresholds based on Core Web Vitals
export const PERFORMANCE_THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 }, // Largest Contentful Paint
  FID: { good: 100, needsImprovement: 300 }, // First Input Delay
  CLS: { good: 0.1, needsImprovement: 0.25 }, // Cumulative Layout Shift
  FCP: { good: 1800, needsImprovement: 3000 }, // First Contentful Paint
  TTFB: { good: 800, needsImprovement: 1800 }, // Time to First Byte
  API_RESPONSE: { good: 200, needsImprovement: 1000 }, // API response time
  DATABASE_QUERY: { good: 100, needsImprovement: 500 }, // Database query time
} as const;

export type PerformanceMetricType = keyof typeof PERFORMANCE_THRESHOLDS;

export interface PerformanceMetric {
  type: PerformanceMetricType;
  value: number;
  url: string;
  userAgent?: string;
  connectionType?: string;
  timestamp: Date;
  sessionId?: string;
  userId?: string;
}

export interface SystemHealthMetrics {
  timestamp: Date;
  cpuUsage?: number;
  memoryUsage?: number;
  databaseConnections?: number;
  cacheHitRate?: number;
  errorRate?: number;
  responseTime?: number;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetric[] = [];
  private alertThresholds = new Map<string, number>();
  private isMonitoring = false;

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Start performance monitoring
  startMonitoring(): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;

    // Set up periodic health checks
    setInterval(() => {
      this.collectSystemMetrics();
    }, 60000); // Every minute

    // Set up metric aggregation and cleanup
    setInterval(() => {
      this.aggregateAndCleanupMetrics();
    }, 300000); // Every 5 minutes
  }

  // Record performance metric
  async recordMetric(metric: PerformanceMetric): Promise<void> {
    try {
      // Store in memory for immediate analysis
      this.metrics.push(metric);

      // Store in database for long-term analysis
      await db.performanceMetric.create({
        data: {
          sessionId: metric.sessionId || "unknown",
          page: metric.url,
          lcp: metric.type === "LCP" ? metric.value : undefined,
          fid: metric.type === "FID" ? metric.value : undefined,
          cls: metric.type === "CLS" ? metric.value : undefined,
          fcp: metric.type === "FCP" ? metric.value : undefined,
          ttfb: metric.type === "TTFB" ? metric.value : undefined,
          connectionType: metric.connectionType,
        },
      });

      // Check for performance issues
      await this.checkPerformanceThresholds(metric);
    } catch (error) {
      console.error("Failed to record performance metric:", error);
    }
  }

  // Record API performance
  async recordAPIPerformance(
    endpoint: string,
    method: string,
    responseTime: number,
    statusCode: number,
    error?: string
  ): Promise<void> {
    const metric: PerformanceMetric = {
      type: "API_RESPONSE",
      value: responseTime,
      url: endpoint,
      timestamp: new Date(),
    };

    await this.recordMetric(metric);

    // Log slow API calls
    if (responseTime > PERFORMANCE_THRESHOLDS.API_RESPONSE.needsImprovement) {
      console.warn(
        `Slow API call detected: ${method} ${endpoint} - ${responseTime}ms`
      );
    }

    // Log API errors
    if (statusCode >= 400) {
      console.error(`API error: ${method} ${endpoint} - ${statusCode}`, error);
    }
  }

  // Record database query performance
  async recordDatabasePerformance(
    query: string,
    duration: number,
    error?: string
  ): Promise<void> {
    const metric: PerformanceMetric = {
      type: "DATABASE_QUERY",
      value: duration,
      url: query,
      timestamp: new Date(),
    };

    await this.recordMetric(metric);

    // Log slow queries
    if (duration > PERFORMANCE_THRESHOLDS.DATABASE_QUERY.needsImprovement) {
      console.warn(`Slow database query detected: ${query} - ${duration}ms`);
    }

    if (error) {
      console.error(`Database query error: ${query}`, error);
    }
  }

  // Get performance summary
  getPerformanceSummary(timeRange: number = 3600000): {
    metrics: Record<
      PerformanceMetricType,
      { avg: number; p95: number; count: number }
    >;
    alerts: Array<{ type: string; message: string; timestamp: Date }>;
  } {
    const cutoff = new Date(Date.now() - timeRange);
    const recentMetrics = this.metrics.filter((m) => m.timestamp > cutoff);

    const summary: Record<string, { values: number[]; count: number }> = {};
    const alerts: Array<{ type: string; message: string; timestamp: Date }> =
      [];

    // Group metrics by type
    for (const metric of recentMetrics) {
      if (!summary[metric.type]) {
        summary[metric.type] = { values: [], count: 0 };
      }
      summary[metric.type].values.push(metric.value);
      summary[metric.type].count++;
    }

    // Calculate statistics
    const metrics: Record<string, { avg: number; p95: number; count: number }> =
      {};

    for (const [type, data] of Object.entries(summary)) {
      const sorted = data.values.sort((a, b) => a - b);
      const avg =
        data.values.reduce((sum, val) => sum + val, 0) / data.values.length;
      const p95Index = Math.floor(sorted.length * 0.95);
      const p95 = sorted[p95Index] || 0;

      metrics[type] = { avg, p95, count: data.count };

      // Check for performance issues
      const threshold = PERFORMANCE_THRESHOLDS[type as PerformanceMetricType];
      if (threshold && p95 > threshold.needsImprovement) {
        alerts.push({
          type: "performance",
          message: `${type} P95 (${p95.toFixed(2)}) exceeds threshold (${threshold.needsImprovement})`,
          timestamp: new Date(),
        });
      }
    }

    return { metrics: metrics as any, alerts };
  }

  // Check performance thresholds and trigger alerts
  private async checkPerformanceThresholds(
    metric: PerformanceMetric
  ): Promise<void> {
    const threshold = PERFORMANCE_THRESHOLDS[metric.type];
    if (!threshold) return;

    if (metric.value > threshold.needsImprovement) {
      await this.triggerAlert({
        type: "performance_degradation",
        metric: metric.type,
        value: metric.value,
        threshold: threshold.needsImprovement,
        url: metric.url,
        timestamp: metric.timestamp,
      });
    }
  }

  // Trigger performance alert
  private async triggerAlert(alert: {
    type: string;
    metric: string;
    value: number;
    threshold: number;
    url: string;
    timestamp: Date;
  }): Promise<void> {
    // Log alert
    console.warn(
      `Performance Alert: ${alert.metric} (${alert.value}) exceeded threshold (${alert.threshold}) on ${alert.url}`
    );

    // In production, you might want to:
    // - Send to monitoring service (DataDog, New Relic, etc.)
    // - Send email/Slack notifications
    // - Store in database for dashboard

    try {
      // Store alert in database (you'd need to create this table)
      // await db.performanceAlert.create({
      //   data: {
      //     type: alert.type,
      //     metric: alert.metric,
      //     value: alert.value,
      //     threshold: alert.threshold,
      //     url: alert.url,
      //     timestamp: alert.timestamp,
      //   },
      // });
    } catch (error) {
      console.error("Failed to store performance alert:", error);
    }
  }

  // Collect system metrics
  private async collectSystemMetrics(): Promise<void> {
    try {
      const metrics: SystemHealthMetrics = {
        timestamp: new Date(),
      };

      // Memory usage (Node.js)
      if (typeof process !== "undefined" && process.memoryUsage) {
        const memUsage = process.memoryUsage();
        metrics.memoryUsage = memUsage.heapUsed / memUsage.heapTotal;
      }

      // Database connection health
      try {
        const startTime = Date.now();
        await db.$queryRaw`SELECT 1`;
        metrics.responseTime = Date.now() - startTime;
      } catch (error) {
        console.error("Database health check failed:", error);
      }

      // Cache hit rate (if using Redis or similar)
      // This would be implemented based on your caching solution

      console.log("System Health:", metrics);
    } catch (error) {
      console.error("Failed to collect system metrics:", error);
    }
  }

  // Aggregate and cleanup old metrics
  private aggregateAndCleanupMetrics(): void {
    const cutoff = new Date(Date.now() - 3600000); // Keep last hour in memory
    this.metrics = this.metrics.filter((m) => m.timestamp > cutoff);
  }

  // Get Core Web Vitals score
  getCoreWebVitalsScore(
    metrics: Record<
      PerformanceMetricType,
      { avg: number; p95: number; count: number }
    >
  ): {
    lcp: "good" | "needs-improvement" | "poor";
    fid: "good" | "needs-improvement" | "poor";
    cls: "good" | "needs-improvement" | "poor";
    overall: "good" | "needs-improvement" | "poor";
  } {
    const getScore = (
      value: number,
      thresholds: { good: number; needsImprovement: number }
    ) => {
      if (value <= thresholds.good) return "good";
      if (value <= thresholds.needsImprovement) return "needs-improvement";
      return "poor";
    };

    const lcp = metrics.LCP
      ? getScore(metrics.LCP.p95, PERFORMANCE_THRESHOLDS.LCP)
      : "good";
    const fid = metrics.FID
      ? getScore(metrics.FID.p95, PERFORMANCE_THRESHOLDS.FID)
      : "good";
    const cls = metrics.CLS
      ? getScore(metrics.CLS.p95, PERFORMANCE_THRESHOLDS.CLS)
      : "good";

    // Overall score is the worst of the three
    const scores = [lcp, fid, cls];
    const overall = scores.includes("poor")
      ? "poor"
      : scores.includes("needs-improvement")
        ? "needs-improvement"
        : "good";

    return { lcp, fid, cls, overall } as any;
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();

// Utility function to measure execution time
export function measureExecutionTime<T>(
  fn: () => Promise<T>,
  label: string
): Promise<T> {
  return new Promise(async (resolve, reject) => {
    const startTime = Date.now();

    try {
      const result = await fn();
      const duration = Date.now() - startTime;

      console.log(`${label} executed in ${duration}ms`);

      // Record performance metric
      await performanceMonitor.recordDatabasePerformance(label, duration);

      resolve(result);
    } catch (error) {
      const duration = Date.now() - startTime;
      await performanceMonitor.recordDatabasePerformance(
        label,
        duration,
        String(error)
      );
      reject(error);
    }
  });
}

// Middleware for API performance monitoring
export function withPerformanceMonitoring<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  name: string
) {
  return async (...args: T): Promise<R> => {
    return measureExecutionTime(() => fn(...args), name);
  };
}

// Initialize performance monitoring
if (typeof window === "undefined" && process.env.NODE_ENV === "production") {
  performanceMonitor.startMonitoring();
}
