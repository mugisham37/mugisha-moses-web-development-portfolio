import { NextRequest, NextResponse } from "next/server";
import {
  trackProjectInteraction,
  getProjectAnalytics,
} from "@/lib/project-queries";
import { z } from "zod";

const analyticsEventSchema = z.object({
  event: z.string().min(1).max(50),
  metadata: z.record(z.any()).optional(),
});

const analyticsQuerySchema = z.object({
  days: z.string().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    const body = await request.json();

    // Validate request body
    const validatedBody = analyticsEventSchema.safeParse(body);

    if (!validatedBody.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: validatedBody.error.errors },
        { status: 400 }
      );
    }

    const { event, metadata } = validatedBody.data;

    // Get user information from request
    const userAgent = request.headers.get("user-agent") || "unknown";
    const referer = request.headers.get("referer");
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Enhanced metadata
    const enhancedMetadata = {
      ...metadata,
      userAgent,
      referer,
      ip,
      timestamp: new Date().toISOString(),
    };

    // Track the interaction
    await trackProjectInteraction(projectId, event, enhancedMetadata);

    return NextResponse.json({
      success: true,
      message: "Analytics event tracked successfully",
    });
  } catch (error) {
    console.error("Analytics tracking error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    const { searchParams } = new URL(request.url);

    // Validate query parameters
    const validatedParams = analyticsQuerySchema.safeParse({
      days: searchParams.get("days") || undefined,
    });

    if (!validatedParams.success) {
      return NextResponse.json(
        {
          error: "Invalid query parameters",
          details: validatedParams.error.errors,
        },
        { status: 400 }
      );
    }

    const { days } = validatedParams.data;
    const analyticsDays = days ? parseInt(days, 10) : 30;

    // Get analytics data
    const analytics = await getProjectAnalytics(projectId, analyticsDays);

    return NextResponse.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error("Analytics retrieval error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
