"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";

interface ErrorLog {
  id: string;
  message: string;
  stack?: string;
  url: string;
  userAgent: string;
  critical: boolean;
  timestamp: string;
  count: number;
}

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  timestamp: string;
}

interface ErrorStats {
  totalErrors: number;
  criticalErrors: number;
  errorRate: number;
  topErrors: ErrorLog[];
  performanceIssues: PerformanceMetric[];
}

export function ErrorMonitoringDashboard() {
  const [errorStats, setErrorStats] = useState<ErrorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"1h" | "24h" | "7d" | "30d">(
    "24h"
  );

  useEffect(() => {
    fetchErrorStats();
  }, [timeRange]);

  const fetchErrorStats = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would fetch from your error monitoring API
      // For now, we'll simulate the data
      const mockStats: ErrorStats = {
        totalErrors: Math.floor(Math.random() * 100) + 10,
        criticalErrors: Math.floor(Math.random() * 10) + 1,
        errorRate: Math.random() * 5,
        topErrors: [
          {
            id: "1",
            message: "TypeError: Cannot read property 'map' of undefined",
            url: "/projects",
            userAgent: "Mozilla/5.0...",
            critical: false,
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            count: 15,
          },
          {
            id: "2",
            message: "Network Error: Failed to fetch GitHub data",
            url: "/dashboard",
            userAgent: "Mozilla/5.0...",
            critical: true,
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            count: 8,
          },
          {
            id: "3",
            message: "ChunkLoadError: Loading chunk failed",
            url: "/blog",
            userAgent: "Mozilla/5.0...",
            critical: false,
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            count: 5,
          },
        ],
        performanceIssues: [
          {
            id: "1",
            name: "LCP",
            value: 3200,
            unit: "ms",
            timestamp: new Date().toISOString(),
          },
          {
            id: "2",
            name: "FID",
            value: 150,
            unit: "ms",
            timestamp: new Date().toISOString(),
          },
        ],
      };

      setErrorStats(mockStats);
    } catch (error) {
      console.error("Failed to fetch error stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const getErrorSeverityColor = (critical: boolean) => {
    return critical ? "text-red-400" : "text-yellow-400";
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <Typography variant="h3" className="mb-4">
          LOADING ERROR MONITORING DATA
        </Typography>
        <div className="animate-pulse">
          <div className="bg-muted mb-2 h-4 rounded"></div>
          <div className="bg-muted mb-2 h-4 rounded"></div>
          <div className="bg-muted h-4 rounded"></div>
        </div>
      </Card>
    );
  }

  if (!errorStats) {
    return (
      <Card className="p-8 text-center">
        <Typography variant="h3" className="mb-4 text-red-400">
          ERROR MONITORING UNAVAILABLE
        </Typography>
        <Button onClick={fetchErrorStats} variant="primary">
          RETRY
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Typography variant="h2">ERROR MONITORING</Typography>
        <div className="flex gap-2">
          {(["1h", "24h", "7d", "30d"] as const).map((range) => (
            <Button
              key={range}
              onClick={() => setTimeRange(range)}
              variant={timeRange === range ? "primary" : "ghost"}
              className="text-xs"
            >
              {range.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="p-4">
          <Typography variant="h4" className="text-accent mb-2">
            TOTAL ERRORS
          </Typography>
          <Typography variant="display" className="text-2xl">
            {errorStats.totalErrors}
          </Typography>
        </Card>

        <Card className="p-4">
          <Typography variant="h4" className="mb-2 text-red-400">
            CRITICAL ERRORS
          </Typography>
          <Typography variant="display" className="text-2xl">
            {errorStats.criticalErrors}
          </Typography>
        </Card>

        <Card className="p-4">
          <Typography variant="h4" className="mb-2 text-yellow-400">
            ERROR RATE
          </Typography>
          <Typography variant="display" className="text-2xl">
            {errorStats.errorRate.toFixed(2)}%
          </Typography>
        </Card>

        <Card className="p-4">
          <Typography variant="h4" className="mb-2 text-green-400">
            UPTIME
          </Typography>
          <Typography variant="display" className="text-2xl">
            99.{Math.floor(Math.random() * 9) + 1}%
          </Typography>
        </Card>
      </div>

      {/* Top Errors */}
      <Card className="p-6">
        <Typography variant="h3" className="mb-4">
          TOP ERRORS
        </Typography>
        <div className="space-y-4">
          {errorStats.topErrors.map((error) => (
            <Card key={error.id} className="bg-muted p-4">
              <div className="mb-2 flex items-start justify-between">
                <div className="flex-1">
                  <Typography
                    variant="h4"
                    className={getErrorSeverityColor(error.critical)}
                  >
                    {error.critical ? "🚨 CRITICAL" : "⚠️ ERROR"}
                  </Typography>
                  <Typography variant="body" className="mt-1 break-all">
                    {error.message}
                  </Typography>
                </div>
                <div className="text-right">
                  <Typography variant="caption" className="text-accent">
                    {error.count} occurrences
                  </Typography>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                <div>
                  <Typography
                    variant="caption"
                    className="text-muted-foreground"
                  >
                    URL:
                  </Typography>
                  <Typography variant="caption" className="ml-2 break-all">
                    {error.url}
                  </Typography>
                </div>
                <div>
                  <Typography
                    variant="caption"
                    className="text-muted-foreground"
                  >
                    Last Seen:
                  </Typography>
                  <Typography variant="caption" className="ml-2">
                    {formatTimestamp(error.timestamp)}
                  </Typography>
                </div>
              </div>

              {error.stack && (
                <details className="mt-4">
                  <summary className="text-accent cursor-pointer text-sm">
                    View Stack Trace
                  </summary>
                  <pre className="bg-background mt-2 max-h-40 overflow-auto rounded p-2 text-xs">
                    {error.stack}
                  </pre>
                </details>
              )}
            </Card>
          ))}
        </div>
      </Card>

      {/* Performance Issues */}
      <Card className="p-6">
        <Typography variant="h3" className="mb-4">
          PERFORMANCE ISSUES
        </Typography>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {errorStats.performanceIssues.map((metric) => (
            <Card key={metric.id} className="bg-muted p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="h4" className="text-yellow-400">
                    {metric.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    className="text-muted-foreground"
                  >
                    {formatTimestamp(metric.timestamp)}
                  </Typography>
                </div>
                <div className="text-right">
                  <Typography variant="display" className="text-xl">
                    {metric.value}
                  </Typography>
                  <Typography
                    variant="caption"
                    className="text-muted-foreground"
                  >
                    {metric.unit}
                  </Typography>
                </div>
              </div>

              <div className="mt-2">
                <div className="bg-background h-2 w-full rounded-full">
                  <div
                    className={`h-2 rounded-full ${
                      metric.value > getThreshold(metric.name)
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}
                    style={{
                      width: `${Math.min(
                        (metric.value / getThreshold(metric.name)) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
                <Typography
                  variant="caption"
                  className="text-muted-foreground mt-1"
                >
                  Threshold: {getThreshold(metric.name)}
                  {metric.unit}
                </Typography>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Actions */}
      <Card className="p-6">
        <Typography variant="h3" className="mb-4">
          MONITORING ACTIONS
        </Typography>
        <div className="flex flex-wrap gap-4">
          <Button onClick={fetchErrorStats} variant="primary">
            REFRESH DATA
          </Button>
          <Button
            onClick={() => window.open("/api/errors", "_blank")}
            variant="secondary"
          >
            VIEW ERROR API
          </Button>
          <Button
            onClick={() => window.open("/api/health", "_blank")}
            variant="ghost"
          >
            HEALTH CHECK
          </Button>
        </div>
      </Card>
    </div>
  );
}

function getThreshold(metricName: string): number {
  switch (metricName) {
    case "LCP":
      return 2500;
    case "FID":
      return 100;
    case "CLS":
      return 0.1;
    default:
      return 1000;
  }
}
