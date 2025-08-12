import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, page, event, timeOnPage, scrollDepth } = body;

    // Update page view with engagement metrics
    if (event === "page_hidden" && timeOnPage) {
      await db.pageView.updateMany({
        where: {
          sessionId,
          path: page,
        },
        data: {
          timeOnPage: Math.floor(timeOnPage / 1000), // Convert to seconds
        },
      });
    }

    if (event === "scroll_depth" && scrollDepth) {
      await db.pageView.updateMany({
        where: {
          sessionId,
          path: page,
        },
        data: {
          scrollDepth,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to track engagement:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
