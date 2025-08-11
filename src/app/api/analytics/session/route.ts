import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, action, page, referer } = body;

    const headersList = headers();
    const userAgent = headersList.get("user-agent") || "";
    const forwardedFor = headersList.get("x-forwarded-for") || "";
    const realIp = headersList.get("x-real-ip") || "";
    const ip = forwardedFor.split(",")[0] || realIp || "unknown";

    // Parse user agent for device/browser info
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

    if (action === "start") {
      // Create or update session
      await db.userSession.upsert({
        where: { sessionId },
        update: {
          isActive: true,
          entryPage: page,
          referer: referer || null,
          updatedAt: new Date(),
        },
        create: {
          sessionId,
          startTime: new Date(),
          isActive: true,
          entryPage: page,
          referer: referer || null,
          userAgent,
          device: deviceInfo.device,
          browser: deviceInfo.browser,
          os: deviceInfo.os,
          pageViews: 0,
        },
      });
    } else if (action === "end") {
      // End session
      const session = await db.userSession.findUnique({
        where: { sessionId },
      });

      if (session) {
        const duration = Math.floor(
          (Date.now() - session.startTime.getTime()) / 1000
        );

        await db.userSession.update({
          where: { sessionId },
          data: {
            endTime: new Date(),
            duration,
            isActive: false,
            exitPage: page,
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to manage session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
