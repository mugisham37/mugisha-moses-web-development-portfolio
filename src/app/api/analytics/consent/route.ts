import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, consent } = body;

    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "";
    const forwardedFor = headersList.get("x-forwarded-for") || "";
    const realIp = headersList.get("x-real-ip") || "";
    const ip = forwardedFor.split(",")[0] || realIp || "unknown";

    // Store user consent
    await db.userConsent.upsert({
      where: { sessionId },
      update: {
        analytics: consent.analytics || false,
        marketing: consent.marketing || false,
        functional: consent.functional || true,
        necessary: consent.necessary || true,
        lastUpdated: new Date(),
      },
      create: {
        sessionId,
        analytics: consent.analytics || false,
        marketing: consent.marketing || false,
        functional: consent.functional || true,
        necessary: consent.necessary || true,
        consentDate: new Date(),
        ipAddress: ip,
        userAgent,
        version: "1.0",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to store consent:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
