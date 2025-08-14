/**
 * Next.js Instrumentation Hook
 * Provides performance monitoring and optimization at the framework level
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Server-side instrumentation
    const { performanceMonitor } = await import("./lib/performance-monitor");

    // Start performance monitoring
    performanceMonitor.startMonitoring();

    // Monitor database performance
    const { db } = await import("./lib/db");

    // Wrap database queries with performance monitoring
    const originalQuery = db.$queryRaw;
    db.$queryRaw = new Proxy(originalQuery, {
      apply: async (target, thisArg, args) => {
        const startTime = Date.now();
        try {
          const result = await target.apply(thisArg, args);
          const duration = Date.now() - startTime;

          await performanceMonitor.recordDatabasePerformance(
            String(args[0]),
            duration
          );

          return result;
        } catch (error) {
          const duration = Date.now() - startTime;
          await performanceMonitor.recordDatabasePerformance(
            String(args[0]),
            duration,
            String(error)
          );
          throw error;
        }
      },
    });

    console.log("Server-side performance monitoring initialized");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    // Edge runtime instrumentation
    console.log("Edge runtime performance monitoring initialized");
  }
}
