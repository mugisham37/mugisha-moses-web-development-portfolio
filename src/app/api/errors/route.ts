import { NextRequest } from "next/server";
import {
  handleAPIError,
  createSuccessResponse,
  ValidationError,
} from "@/lib/api-errors";

interface ErrorLogData {
  message: string;
  stack?: string;
  digest?: string;
  timestamp: string;
  userAgent: string;
  url: string;
  critical?: boolean;
  userId?: string;
  componentStack?: string;
}

interface BatchErrorLogData {
  errors: ErrorLogData[];
  performance?: PerformanceMetric[];
  session: {
    id: string;
    timestamp: string;
  };
}

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: string;
  context?: Record<string, any>;
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      throw new ValidationError("Content-Type must be application/json");
    }

    const body = await request.json();

    // Handle batch error logging
    if (body.errors && Array.isArray(body.errors)) {
      return await handleBatchErrorLogging(request, body as BatchErrorLogData);
    }

    // Handle single error logging
    return await handleSingleErrorLogging(request, body as ErrorLogData);
  } catch (error) {
    return handleAPIError(error);
  }
}

async function handleSingleErrorLogging(
  request: NextRequest,
  body: ErrorLogData
) {
  // Validate required fields
  if (!body.message || !body.timestamp) {
    throw new ValidationError("Missing required fields: message, timestamp");
  }

  // Create error log entry
  const errorLog = {
    id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    message: body.message,
    stack: body.stack,
    digest: body.digest,
    timestamp: new Date(body.timestamp),
    userAgent: body.userAgent || "unknown",
    url: body.url || "unknown",
    critical: body.critical || false,
    userId: body.userId,
    componentStack: body.componentStack,
    ip: request.ip || "unknown",
    headers: {
      "user-agent": request.headers.get("user-agent"),
      referer: request.headers.get("referer"),
      "x-forwarded-for": request.headers.get("x-forwarded-for"),
    },
  };

  // Process error log
  await processErrorLog(errorLog);

  return createSuccessResponse(
    {
      logged: true,
      errorId: errorLog.id,
      message: "Error logged successfully",
    },
    200
  );
}

async function handleBatchErrorLogging(
  request: NextRequest,
  body: BatchErrorLogData
) {
  const processedErrors = [];
  const processedMetrics = [];

  // Process errors
  for (const errorData of body.errors) {
    if (!errorData.message || !errorData.timestamp) {
      continue; // Skip invalid errors
    }

    const errorLog = {
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message: errorData.message,
      stack: errorData.stack,
      digest: errorData.digest,
      timestamp: new Date(errorData.timestamp),
      userAgent: errorData.userAgent || "unknown",
      url: errorData.url || "unknown",
      critical: errorData.critical || false,
      userId: errorData.userId,
      componentStack: errorData.componentStack,
      sessionId: body.session.id,
      ip: request.ip || "unknown",
      headers: {
        "user-agent": request.headers.get("user-agent"),
        referer: request.headers.get("referer"),
        "x-forwarded-for": request.headers.get("x-forwarded-for"),
      },
    };

    await processErrorLog(errorLog);
    processedErrors.push(errorLog.id);
  }

  // Process performance metrics
  if (body.performance) {
    for (const metric of body.performance) {
      const processedMetric = {
        id: `metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...metric,
        sessionId: body.session.id,
        timestamp: new Date(metric.timestamp),
      };

      await processPerformanceMetric(processedMetric);
      processedMetrics.push(processedMetric.id);
    }
  }

  return createSuccessResponse(
    {
      logged: true,
      processedErrors: processedErrors.length,
      processedMetrics: processedMetrics.length,
      sessionId: body.session.id,
      message: "Batch data logged successfully",
    },
    200
  );
}

async function processErrorLog(errorLog: any) {
  // Log to console for development
  if (process.env.NODE_ENV === "development") {
    console.error("Client Error Logged:", errorLog);
  }

  // Store in database (implement based on your database choice)
  await storeErrorInDatabase(errorLog);

  // Send to external monitoring service
  if (process.env.NODE_ENV === "production") {
    await simulateExternalErrorService(errorLog);
  }

  // Send alert for critical errors
  if (errorLog.critical) {
    await sendCriticalErrorAlert(errorLog);
  }

  // Check for error patterns and send alerts
  await checkErrorPatterns(errorLog);
}

async function processPerformanceMetric(metric: any) {
  // Log performance issues
  if (
    (metric.name === "LCP" && metric.value > 2500) ||
    (metric.name === "FID" && metric.value > 100) ||
    (metric.name === "CLS" && metric.value > 0.1)
  ) {
    console.warn("Performance issue detected:", metric);

    // Send performance alert
    await sendPerformanceAlert(metric);
  }

  // Store performance data
  await storePerformanceMetric(metric);
}

async function storeErrorInDatabase(errorLog: any) {
  // In a real application, store in your database
  // Example with Prisma:
  /*
  await prisma.errorLog.create({
    data: {
      id: errorLog.id,
      message: errorLog.message,
      stack: errorLog.stack,
      url: errorLog.url,
      userAgent: errorLog.userAgent,
      critical: errorLog.critical,
      timestamp: errorLog.timestamp,
      // ... other fields
    }
  });
  */

  // For now, just simulate storage
  console.log("Error stored in database:", errorLog.id);
}

async function storePerformanceMetric(metric: any) {
  // Store performance metrics in database
  console.log("Performance metric stored:", metric.id);
}

async function checkErrorPatterns(errorLog: any) {
  // Implement error pattern detection
  // For example, if the same error occurs multiple times in a short period
  // This would typically query your database for recent similar errors

  const similarErrorsCount = await getSimilarErrorsCount(errorLog);

  if (similarErrorsCount > 5) {
    await sendErrorPatternAlert(errorLog, similarErrorsCount);
  }
}

async function getSimilarErrorsCount(errorLog: any): Promise<number> {
  // In a real implementation, query your database
  // For now, return a random number for demonstration
  return Math.floor(Math.random() * 10);
}

async function sendErrorPatternAlert(errorLog: any, count: number) {
  console.warn(
    `Error pattern detected: ${errorLog.message} occurred ${count} times`
  );

  // Send alert to monitoring service
  if (process.env.SLACK_ERROR_WEBHOOK) {
    try {
      await fetch(process.env.SLACK_ERROR_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `⚠️ ERROR PATTERN: ${errorLog.message} (${count} occurrences)`,
          attachments: [
            {
              color: "warning",
              fields: [
                { title: "Error", value: errorLog.message, short: false },
                { title: "Count", value: count.toString(), short: true },
                { title: "URL", value: errorLog.url, short: true },
              ],
            },
          ],
        }),
      });
    } catch (error) {
      console.error("Failed to send pattern alert:", error);
    }
  }
}

async function sendPerformanceAlert(metric: any) {
  console.warn("Performance alert:", metric);

  // Send performance alert
  if (process.env.SLACK_PERFORMANCE_WEBHOOK) {
    try {
      await fetch(process.env.SLACK_PERFORMANCE_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `📊 PERFORMANCE ISSUE: ${metric.name} = ${metric.value}${metric.unit}`,
          attachments: [
            {
              color: "warning",
              fields: [
                { title: "Metric", value: metric.name, short: true },
                {
                  title: "Value",
                  value: `${metric.value}${metric.unit}`,
                  short: true,
                },
                {
                  title: "Context",
                  value: JSON.stringify(metric.context || {}),
                  short: false,
                },
              ],
            },
          ],
        }),
      });
    } catch (error) {
      console.error("Failed to send performance alert:", error);
    }
  }
}

// Simulate external error monitoring service
async function simulateExternalErrorService(errorLog: any) {
  // In production, replace this with actual service calls
  // Examples:

  // Sentry
  // Sentry.captureException(new Error(errorLog.message), {
  //   extra: errorLog,
  //   level: errorLog.critical ? 'fatal' : 'error'
  // });

  // LogRocket
  // LogRocket.captureException(new Error(errorLog.message));

  // Custom webhook
  // await fetch(process.env.ERROR_WEBHOOK_URL, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(errorLog)
  // });

  console.log("Error sent to external monitoring service:", errorLog.id);
}

// Send critical error alerts
async function sendCriticalErrorAlert(errorLog: any) {
  // In production, you would send alerts via:
  // - Email to development team
  // - Slack/Discord webhook
  // - SMS alerts
  // - PagerDuty/OpsGenie

  console.error("CRITICAL ERROR ALERT:", {
    errorId: errorLog.id,
    message: errorLog.message,
    url: errorLog.url,
    timestamp: errorLog.timestamp,
  });

  // Example: Send to Slack webhook
  if (process.env.SLACK_ERROR_WEBHOOK) {
    try {
      await fetch(process.env.SLACK_ERROR_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `🚨 CRITICAL ERROR: ${errorLog.message}`,
          attachments: [
            {
              color: "danger",
              fields: [
                { title: "Error ID", value: errorLog.id, short: true },
                { title: "URL", value: errorLog.url, short: true },
                {
                  title: "User Agent",
                  value: errorLog.userAgent,
                  short: false,
                },
                {
                  title: "Stack",
                  value: errorLog.stack?.substring(0, 500) + "...",
                  short: false,
                },
              ],
            },
          ],
        }),
      });
    } catch (slackError) {
      console.error("Failed to send Slack alert:", slackError);
    }
  }
}

// Health check endpoint
export async function GET() {
  return createSuccessResponse({
    service: "error-logging",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
}
