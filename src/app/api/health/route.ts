import { NextRequest } from "next/server";
import { createSuccessResponse } from "@/lib/api-errors";

export async function GET(request: NextRequest) {
  return createSuccessResponse({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.NEXT_PUBLIC_BUILD_VERSION || "unknown",
    environment: process.env.NODE_ENV,
  });
}

export async function HEAD(request: NextRequest) {
  return new Response(null, { status: 200 });
}
