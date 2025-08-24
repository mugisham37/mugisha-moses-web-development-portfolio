/**
 * Web Vitals Analytics API Endpoint
 * Collects and processes Core Web Vitals metrics
 */

import { NextRequest, NextResponse } from "next/server";

interface WebVitalsData {
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
  id: string;
  url: string;
  timestamp: number;
}

export async function POST(request: NextRequest) {
  try {
    const data: WebVitalsData = await request.json();

    // Validate the data
    if (!data.name || typeof data.value !== "number" || !data.id) {
      return NextResponse.json(
        { error: "Invalid Web Vitals data" },
        { status: 400 }
      );
    }

    // Log the metric (in production, you'd send this to your analytics service)
    console.log("[Web Vitals API]", {
      metric: data.name,
      value: data.value,
      rating: data.rating,
      url: data.url,
      timestamp: new Date(data.timestamp).toISOString(),
    });

    // Here you would typically:
    // 1. Store the data in a database
    // 2. Send to analytics services (Google Analytics, DataDog, etc.)
    // 3. Trigger alerts if metrics exceed thresholds

    // Example: Send to external analytics service
    if (process.env.ANALYTICS_WEBHOOK_URL) {
      try {
        await fetch(process.env.ANALYTICS_WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.ANALYTICS_API_KEY}`,
          },
          body: JSON.stringify({
            ...data,
            userAgent: request.headers.get("user-agent"),
            referer: request.headers.get("referer"),
            ip: request.ip || request.headers.get("x-forwarded-for"),
          }),
        });
      } catch (error) {
        console.error("Failed to send to external analytics:", error);
      }
    }

    // Check if metric exceeds performance budget
    const budgets = {
      LCP: 2500,
      FID: 100,
      CLS: 0.1,
      FCP: 1800,
      TTFB: 800,
    };

    const budget = budgets[data.name as keyof typeof budgets];
    if (budget && data.value > budget) {
      console.warn(`[Performance Alert] ${data.name} exceeded budget:`, {
        value: data.value,
        budget,
        url: data.url,
      });

      // In production, you might send alerts here
      // await sendPerformanceAlert(data);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Web Vitals API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
