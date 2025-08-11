import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Analytics event schema
const analyticsEventSchema = z.object({
  serviceId: z.string().min(1, "Service ID is required"),
  event: z.enum([
    "view",
    "inquiry",
    "booking",
    "conversion",
    "feature_click",
    "pricing_view",
    "faq_expand",
    "cta_click",
  ]),
  metadata: z.record(z.any()).optional(),
  sessionId: z.string().optional(),
  userAgent: z.string().optional(),
  referer: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = analyticsEventSchema.parse(body);

    // Get additional request metadata
    const userAgent = request.headers.get("user-agent") || undefined;
    const referer = request.headers.get("referer") || undefined;
    const sessionId = validatedData.sessionId || generateSessionId();

    // In production, this would save to the database
    // For now, we'll just log the analytics event
    const analyticsEvent = {
      serviceId: validatedData.serviceId,
      event: validatedData.event,
      metadata: {
        ...validatedData.metadata,
        timestamp: new Date().toISOString(),
        userAgent,
        referer,
        sessionId,
      },
      createdAt: new Date(),
    };

    console.log("Service Analytics Event:", analyticsEvent);

    // In production, you would:
    // 1. Save to database using Prisma
    // 2. Send to analytics service (Google Analytics, Mixpanel, etc.)
    // 3. Update service performance metrics

    // Example database save (uncomment when database is available):
    /*
    const db = await import("@/lib/db");
    await db.prisma.serviceAnalytics.create({
      data: {
        serviceId: validatedData.serviceId,
        event: validatedData.event,
        metadata: analyticsEvent.metadata,
      },
    });
    */

    return NextResponse.json({
      success: true,
      message: "Analytics event recorded",
      sessionId,
    });
  } catch (error) {
    console.error("Service analytics error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request data",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to record analytics event",
      },
      { status: 500 }
    );
  }
}

// Generate a simple session ID
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// GET endpoint for retrieving service analytics (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get("serviceId");
    const event = searchParams.get("event");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // In production, you would:
    // 1. Verify admin authentication
    // 2. Query database for analytics data
    // 3. Return aggregated metrics

    // Mock analytics data for now
    const mockAnalytics = {
      serviceId: serviceId || "all",
      totalEvents: 1250,
      eventBreakdown: {
        view: 800,
        inquiry: 150,
        booking: 45,
        conversion: 25,
        feature_click: 180,
        pricing_view: 50,
      },
      conversionRate: 0.02, // 2%
      topReferrers: [
        { source: "google.com", count: 450 },
        { source: "direct", count: 320 },
        { source: "linkedin.com", count: 180 },
      ],
      timeRange: {
        start:
          startDate ||
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        end: endDate || new Date().toISOString(),
      },
    };

    return NextResponse.json({
      success: true,
      data: mockAnalytics,
    });
  } catch (error) {
    console.error("Service analytics retrieval error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve analytics data",
      },
      { status: 500 }
    );
  }
}
