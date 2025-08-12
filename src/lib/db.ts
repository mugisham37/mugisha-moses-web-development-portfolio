import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Enhanced Prisma client configuration with optimized connection pooling
export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
    ...(process.env.DATABASE_URL && {
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    }),
    // Optimized connection and transaction settings
    transactionOptions: {
      maxWait: 5000, // 5 seconds max wait for transaction
      timeout: 10000, // 10 seconds transaction timeout
      isolationLevel: "ReadCommitted", // Optimal for most use cases
    },
    // Error formatting for better debugging
    errorFormat: process.env.NODE_ENV === "development" ? "pretty" : "minimal",
  });

// Connection pool monitoring and optimization
class DatabaseConnectionManager {
  private static instance: DatabaseConnectionManager;
  private connectionCount = 0;
  private maxConnections = parseInt(
    process.env.DATABASE_MAX_CONNECTIONS || "10"
  );
  private connectionTimeout = parseInt(
    process.env.DATABASE_CONNECTION_TIMEOUT || "30000"
  );

  static getInstance(): DatabaseConnectionManager {
    if (!DatabaseConnectionManager.instance) {
      DatabaseConnectionManager.instance = new DatabaseConnectionManager();
    }
    return DatabaseConnectionManager.instance;
  }

  async executeWithRetry<T>(
    operation: () => Promise<T>,
    maxRetries = 3,
    baseDelay = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;

        // Don't retry on certain errors
        if (
          error instanceof Error &&
          (error.message.includes("Unique constraint") ||
            error.message.includes("Foreign key constraint") ||
            error.message.includes("Check constraint"))
        ) {
          throw error;
        }

        if (attempt === maxRetries) break;

        // Exponential backoff with jitter
        const delay =
          baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }

  async getConnectionHealth(): Promise<{
    isHealthy: boolean;
    connectionCount: number;
    maxConnections: number;
    responseTime: number;
  }> {
    const startTime = Date.now();

    try {
      await db.$queryRaw`SELECT 1`;
      const responseTime = Date.now() - startTime;

      return {
        isHealthy: true,
        connectionCount: this.connectionCount,
        maxConnections: this.maxConnections,
        responseTime,
      };
    } catch (error) {
      return {
        isHealthy: false,
        connectionCount: this.connectionCount,
        maxConnections: this.maxConnections,
        responseTime: Date.now() - startTime,
      };
    }
  }
}

export const dbManager = DatabaseConnectionManager.getInstance();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

// Connection health check utility
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await db.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
}

// Graceful shutdown utility
export async function disconnectDatabase(): Promise<void> {
  try {
    await db.$disconnect();
    console.log("Database disconnected successfully");
  } catch (error) {
    console.error("Error disconnecting from database:", error);
  }
}
