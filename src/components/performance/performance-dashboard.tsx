"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

interface PerformanceMetrics {
  [key: string]: {
    avg: number;
    p95: number;
    count: number;
  };
}

interface CoreWebVitalsScore {
  lcp: "good" | "needs-improvement" | "poor";
  fid: "good" | "needs-improvement" | "poor";
  cls: "good" | "needs-improvement" | "poor";
  overall: "good" | "needs-improvement" | "poor";
}

interface PerformanceSummary {
  metrics: PerformanceMetrics;
  alerts: Array<{
    type: string;
    message: string;
    timestamp: string;
  }>;
}

/**
 * Performance Dashboard Component
 * Displays real-time performance metrics and Core Web Vitals
 */
export function PerformanceDashboard() {
  const [summary, setSummary] = useState<PerformanceSummary | null>(null);
  const [coreWebVitals, setCoreWebVitals] = useState<CoreWebVitalsScore | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/performance");

        if (!response.ok) {
          throw new Error("Failed to fetch performance data");
        }

        const data = await response.json();
        setSummary(data.summary);
        setCoreWebVitals(data.coreWebVitalsScore);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        console.error("Performance data fetch failed:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPerformanceData();

    // Refresh data every 30 seconds
    const interval = setInterval(fetchPerformanceData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getScoreColor = (score: string) => {
    switch (score) {
      case "good":
        return "text-green-400 border-green-400";
      case "needs-improvement":
        return "text-yellow-400 border-yellow-400";
      case "poor":
        return "text-red-400 border-red-400";
      default:
        return "text-gray-400 border-gray-400";
    }
  };

  const formatMetricValue = (key: string, value: number) => {
    if (
      key.includes("paint") ||
      key.includes("interactive") ||
      key.includes("blocking")
    ) {
      return `${Math.round(value)}ms`;
    }
    if (key === "CLS") {
      return value.toFixed(3);
    }
    return Math.round(value).toString();
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent" />
          <span className="ml-3 font-mono">Loading performance data...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-500 p-6">
        <div className="text-center">
          <h3 className="mb-2 font-mono font-bold text-red-400">Error</h3>
          <p className="text-red-300">{error}</p>
        </div>
      </Card>
    );
  }

  if (!summary || !coreWebVitals) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h3 className="mb-2 font-mono font-bold">No Data Available</h3>
          <p className="text-gray-400">
            Performance metrics will appear here once collected.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Core Web Vitals Overview */}
      <Card className="p-6">
        <h2 className="mb-4 font-mono text-xl font-bold text-yellow-400 uppercase">
          Core Web Vitals
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div
            className={`border-4 p-4 text-center ${getScoreColor(coreWebVitals.lcp)}`}
          >
            <div className="font-mono text-2xl font-bold">LCP</div>
            <div className="text-sm uppercase">
              {coreWebVitals.lcp.replace("-", " ")}
            </div>
            {summary.metrics.LCP && (
              <div className="mt-1 text-xs">
                {formatMetricValue("LCP", summary.metrics.LCP.p95)}
              </div>
            )}
          </div>

          <div
            className={`border-4 p-4 text-center ${getScoreColor(coreWebVitals.fid)}`}
          >
            <div className="font-mono text-2xl font-bold">FID</div>
            <div className="text-sm uppercase">
              {coreWebVitals.fid.replace("-", " ")}
            </div>
            {summary.metrics.FID && (
              <div className="mt-1 text-xs">
                {formatMetricValue("FID", summary.metrics.FID.p95)}
              </div>
            )}
          </div>

          <div
            className={`border-4 p-4 text-center ${getScoreColor(coreWebVitals.cls)}`}
          >
            <div className="font-mono text-2xl font-bold">CLS</div>
            <div className="text-sm uppercase">
              {coreWebVitals.cls.replace("-", " ")}
            </div>
            {summary.metrics.CLS && (
              <div className="mt-1 text-xs">
                {formatMetricValue("CLS", summary.metrics.CLS.p95)}
              </div>
            )}
          </div>

          <div
            className={`border-4 p-4 text-center ${getScoreColor(coreWebVitals.overall)}`}
          >
            <div className="font-mono text-2xl font-bold">Overall</div>
            <div className="text-sm uppercase">
              {coreWebVitals.overall.replace("-", " ")}
            </div>
          </div>
        </div>
      </Card>

      {/* Detailed Metrics */}
      <Card className="p-6">
        <h2 className="mb-4 font-mono text-xl font-bold text-yellow-400 uppercase">
          Performance Metrics
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(summary.metrics).map(([key, metric]) => (
            <div key={key} className="border-2 border-gray-600 p-4">
              <h3 className="mb-2 font-mono text-sm font-bold uppercase">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </h3>
              <div className="space-y-1 text-sm">
                <div>
                  <span className="text-gray-400">Average:</span>{" "}
                  <span className="font-mono">
                    {formatMetricValue(key, metric.avg)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">P95:</span>{" "}
                  <span className="font-mono">
                    {formatMetricValue(key, metric.p95)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Count:</span>{" "}
                  <span className="font-mono">{metric.count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Alerts */}
      {summary.alerts.length > 0 && (
        <Card className="border-red-500 p-6">
          <h2 className="mb-4 font-mono text-xl font-bold text-red-400 uppercase">
            Performance Alerts
          </h2>

          <div className="space-y-3">
            {summary.alerts.map((alert, index) => (
              <div
                key={index}
                className="border-l-4 border-red-400 bg-red-900 p-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-mono text-sm font-bold text-red-300 uppercase">
                      {alert.type.replace("_", " ")}
                    </div>
                    <div className="mt-1 text-red-100">{alert.message}</div>
                  </div>
                  <div className="font-mono text-xs text-red-300">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Performance Tips */}
      <Card className="border-green-500 p-6">
        <h2 className="mb-4 font-mono text-xl font-bold text-green-400 uppercase">
          Optimization Tips
        </h2>

        <div className="space-y-2 text-sm">
          <div className="flex items-start">
            <span className="mr-2 text-green-400">→</span>
            <span>
              Keep LCP under 2.5s by optimizing images and critical resources
            </span>
          </div>
          <div className="flex items-start">
            <span className="mr-2 text-green-400">→</span>
            <span>Minimize FID by reducing JavaScript execution time</span>
          </div>
          <div className="flex items-start">
            <span className="mr-2 text-green-400">→</span>
            <span>Prevent CLS by setting dimensions for images and ads</span>
          </div>
          <div className="flex items-start">
            <span className="mr-2 text-green-400">→</span>
            <span>Use code splitting to reduce initial bundle size</span>
          </div>
          <div className="flex items-start">
            <span className="mr-2 text-green-400">→</span>
            <span>Enable compression and caching for static assets</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

/**
 * Real-time Performance Monitor
 * Shows live performance metrics
 */
export function RealTimePerformanceMonitor() {
  const [metrics, setMetrics] = useState<{
    fps: number;
    memory: number;
    timing: number;
  }>({ fps: 0, memory: 0, timing: 0 });

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const updateMetrics = () => {
      const currentTime = performance.now();
      frameCount++;

      if (frameCount % 60 === 0) {
        const fps = Math.round(1000 / ((currentTime - lastTime) / 60));
        const perfWithMemory = performance as { memory?: { usedJSHeapSize: number } };
        const memory = perfWithMemory.memory?.usedJSHeapSize
          ? Math.round(perfWithMemory.memory.usedJSHeapSize / 1024 / 1024)
          : 0;
        const timing = Math.round(currentTime - lastTime);

        setMetrics({ fps, memory, timing });
        lastTime = currentTime;
      }

      animationId = requestAnimationFrame(updateMetrics);
    };

    animationId = requestAnimationFrame(updateMetrics);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <div className="fixed right-4 bottom-4 z-50 border-2 border-yellow-400 bg-black p-3 font-mono text-xs">
      <div className="mb-1 font-bold text-yellow-400">LIVE METRICS</div>
      <div>FPS: {metrics.fps}</div>
      <div>Memory: {metrics.memory}MB</div>
      <div>Frame: {metrics.timing}ms</div>
    </div>
  );
}
