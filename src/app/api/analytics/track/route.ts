import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, event, data, timestamp, page, postId, metadata } = body;

    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "";
    const referer = headersList.get("referer") || "";

    // Handle legacy format for backward compatibility
    if (event === "page_view" && !sessionId) {
      const forwardedFor = headersList.get("x-forwarded-for") || "";
      const realIp = headersList.get("x-real-ip") || "";
      const ip = forwardedFor.split(",")[0] || realIp || "unknown";
      const legacySessionId = Buffer.from(`${ip}-${userAgent}`).toString(
        "base64"
      );

      await db.pageView.create({
        data: {
          path: metadata?.path || "/",
          userAgent,
          referer,
          sessionId: legacySessionId,
          createdAt: new Date(),
        },
      });
      return NextResponse.json({ success: true });
    }

    // Handle blog-specific events
    if (event === "blog_view" && postId) {
      await Promise.all([
        db.blogAnalytics.create({
          data: {
            postId,
            event: "view",
            metadata: metadata || data || {},
            createdAt: new Date(timestamp || Date.now()),
          },
        }),
        db.blogPost.update({
          where: { id: postId },
          data: {
            viewCount: {
              increment: 1,
            },
          },
        }),
      ]);
    } else if (event === "blog_share" && postId) {
      await db.blogAnalytics.create({
        data: {
          postId,
          event: "share",
          metadata: metadata || data || {},
          createdAt: new Date(timestamp || Date.now()),
        },
      });
    } else if (event === "project_view" && data?.projectId) {
      // Track project views
      await Promise.all([
        db.projectAnalytics.create({
          data: {
            projectId: data.projectId,
            event: "view",
            metadata: data || {},
            createdAt: new Date(timestamp || Date.now()),
          },
        }),
        db.project.update({
          where: { id: data.projectId },
          data: {
            viewCount: {
              increment: 1,
            },
          },
        }),
      ]);
    } else if (event === "project_like" && data?.projectId) {
      await Promise.all([
        db.projectAnalytics.create({
          data: {
            projectId: data.projectId,
            event: "like",
            metadata: data || {},
            createdAt: new Date(timestamp || Date.now()),
          },
        }),
        db.project.update({
          where: { id: data.projectId },
          data: {
            likeCount: {
              increment: 1,
            },
          },
        }),
      ]);
    } else {
      // Generic event tracking
      console.log(`Tracked event: ${event}`, { sessionId, data, page });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to track analytics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
