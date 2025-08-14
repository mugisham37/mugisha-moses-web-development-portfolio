import { NextRequest, NextResponse } from "next/server";
import { performanceMonitor } from "@/lib/performance-monitor";

/**
 * Performance Metrics API Endpoint
 * Collects and stores performance metrics from the client
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, page, metrics, connectionInfo, timestamp } = body;

    // Validate required fields
    if (!sessionId || !page || !metrics) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Record each metric
    for (const [metricType, value] of Object.entries(metrics)) {
      if (typeof value === "number" && value > 0) {
        await performanceMonitor.recordMetric({
          type: metricType as any,
          value,
          url: page,
          sessionId,
          connectionType: connectionInfo?.effectiveType,
          timestamp: new Date(timestamp),
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Performance metrics collection failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Get Performance Summary
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = parseInt(searchParams.get("timeRange") || "3600000"); // 1 hour default

    const summary = performanceMonitor.getPerformanceSummary(timeRange);
    const coreWebVitalsScore = performanceMonitor.getCoreWebVitalsScore(
      summary.metrics
    );

    return NextResponse.json({
      summary,
      coreWebVitalsScore,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Performance summary retrieval failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
