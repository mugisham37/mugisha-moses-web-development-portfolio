import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, page, metrics, connectionInfo, timestamp } = body;

    // Record performance metrics
    await db.performanceMetric.create({
      data: {
        sessionId,
        page,
        lcp: metrics.lcp || null,
        fid: metrics.fid || null,
        cls: metrics.cls || null,
        fcp: metrics.fcp || null,
        ttfb: metrics.ttfb || null,
        domContentLoaded: metrics.domContentLoaded || null,
        loadComplete: metrics.loadComplete || null,
        connectionType: connectionInfo?.effectiveType || null,
        effectiveType: connectionInfo?.effectiveType || null,
        createdAt: new Date(timestamp),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to track performance metrics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
