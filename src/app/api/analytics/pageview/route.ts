import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, path, timestamp, referer } = body;

    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "";

    // Parse user agent for device info
    const getDeviceInfo = (ua: string) => {
      const isMobile = /Mobile|Android|iPhone|iPad/.test(ua);
      const isTablet = /iPad|Tablet/.test(ua);

      let device = "desktop";
      if (isTablet) device = "tablet";
      else if (isMobile) device = "mobile";

      let browser = "unknown";
      if (ua.includes("Chrome")) browser = "chrome";
      else if (ua.includes("Firefox")) browser = "firefox";
      else if (ua.includes("Safari")) browser = "safari";
      else if (ua.includes("Edge")) browser = "edge";

      let os = "unknown";
      if (ua.includes("Windows")) os = "windows";
      else if (ua.includes("Mac")) os = "macos";
      else if (ua.includes("Linux")) os = "linux";
      else if (ua.includes("Android")) os = "android";
      else if (ua.includes("iOS")) os = "ios";

      return { device, browser, os };
    };

    const deviceInfo = getDeviceInfo(userAgent);

    // Record page view
    await db.pageView.create({
      data: {
        path,
        userAgent,
        referer: referer || null,
        sessionId,
        device: deviceInfo.device,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
        createdAt: new Date(timestamp),
      },
    });

    // Update session page view count
    await db.userSession.update({
      where: { sessionId },
      data: {
        pageViews: {
          increment: 1,
        },
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to track page view:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
