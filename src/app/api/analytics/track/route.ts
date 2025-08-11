import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, postId, metadata } = body;

    const headersList = headers();
    const userAgent = headersList.get("user-agent") || "";
    const referer = headersList.get("referer") || "";
    const forwardedFor = headersList.get("x-forwarded-for") || "";
    const realIp = headersList.get("x-real-ip") || "";
    const ip = forwardedFor.split(",")[0] || realIp || "unknown";

    // Generate a session ID based on IP and user agent
    const sessionId = Buffer.from(`${ip}-${userAgent}`).toString("base64");

    if (event === "page_view") {
      // Track general page view
      await db.pageView.create({
        data: {
          path: metadata?.path || "/",
          userAgent,
          referer,
          sessionId,
          createdAt: new Date(),
        },
      });
    } else if (event === "blog_view" && postId) {
      // Track blog post view and increment view count
      await Promise.all([
        db.blogAnalytics.create({
          data: {
            postId,
            event: "view",
            metadata: metadata || {},
            createdAt: new Date(),
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
      // Track blog post share
      await db.blogAnalytics.create({
        data: {
          postId,
          event: "share",
          metadata: metadata || {},
          createdAt: new Date(),
        },
      });
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
