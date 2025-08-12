import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, type, value, metadata, timestamp, page } = body;

    const headersList = await headers();
    const referer = headersList.get("referer") || "";

    // Record conversion event
    await db.conversionEvent.create({
      data: {
        sessionId,
        type,
        value: value || null,
        metadata: metadata || {},
        page,
        referer: referer || null,
        createdAt: new Date(timestamp),
      },
    });

    // Update session conversion status
    await db.userSession.update({
      where: { sessionId },
      data: {
        hasConverted: true,
        conversionType: type,
        conversionValue: value || null,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to track conversion:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
