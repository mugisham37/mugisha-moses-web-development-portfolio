import { NextResponse } from "next/server";
import { db, dbManager } from "@/lib/db";
import { memoryCache } from "@/lib/cache";

export async function GET() {
  const startTime = Date.now();

  try {
    // Check database connectivity
    const dbHealth = await dbManager.getConnectionHealth();

    // Check cache health
    const cacheStats = memoryCache.getStats();

    // System health metrics
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();

    const responseTime = Date.now() - startTime;

    const healthData = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: Math.floor(uptime),
      responseTime,
      version: process.env.npm_package_version || "unknown",
      environment: process.env.NODE_ENV || "unknown",
      checks: {
        database: {
          status: dbHealth.isHealthy ? "healthy" : "unhealthy",
          responseTime: dbHealth.responseTime,
          connections: dbHealth.connectionCount,
          maxConnections: dbHealth.maxConnections,
        },
        cache: {
          status: "healthy",
          size: cacheStats.size,
          maxSize: cacheStats.maxSize,
          utilization: Math.round((cacheStats.size / cacheStats.maxSize) * 100),
        },
        memory: {
          status:
            memoryUsage.heapUsed < memoryUsage.heapTotal * 0.9
              ? "healthy"
              : "warning",
          heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
          heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
          utilization: Math.round(
            (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100
          ),
        },
      },
    };

    // Determine overall health status
    const isHealthy =
      dbHealth.isHealthy &&
      memoryUsage.heapUsed < memoryUsage.heapTotal * 0.9 &&
      responseTime < 1000;

    if (!isHealthy) {
      healthData.status = "degraded";
    }

    return NextResponse.json(healthData, {
      status: isHealthy ? 200 : 503,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Health check failed:", error);

    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
        responseTime: Date.now() - startTime,
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  }
}

// Simple health check for load balancers
export async function HEAD() {
  try {
    // Quick database ping
    await db.$queryRaw`SELECT 1`;
    return new NextResponse(null, { status: 200 });
  } catch {
    return new NextResponse(null, { status: 503 });
  }
}
