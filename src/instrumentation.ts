/**
 * Next.js Instrumentation Hook
 * Provides performance monitoring and optimization at the framework level
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    try {
      // Server-side instrumentation
      const { performanceMonitor } = await import("./lib/performance-monitor");

      // Start performance monitoring
      performanceMonitor.startMonitoring();

      // Only initialize database monitoring if database is properly configured
      try {
        const { db, isDatabaseAvailable } = await import("./lib/db");

        if (isDatabaseAvailable) {
          // Test if Prisma client is properly initialized
          await db.$queryRaw`SELECT 1`;

          // Wrap database queries with performance monitoring
          const originalQuery = db.$queryRaw;
          db.$queryRaw = new Proxy(originalQuery, {
            apply: async (
              target,
              thisArg,
              args: [TemplateStringsArray, ...unknown[]]
            ) => {
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

          console.log(
            "Server-side performance monitoring with database initialized"
          );
        } else {
          console.log("Database not configured, skipping database monitoring");
        }
      } catch (dbError) {
        console.warn(
          "Database not available during instrumentation, skipping database monitoring"
        );
      }

      console.log("Server-side performance monitoring initialized");
    } catch (error) {
      console.error("Failed to initialize instrumentation:", error);
    }
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    // Edge runtime instrumentation
    console.log("Edge runtime performance monitoring initialized");
  }
}
