import { NextResponse } from "next/server";

// API Error Types
export interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
  requestId: string;
}

export interface ErrorResponse {
  success: false;
  error: APIError;
  statusCode: number;
}

export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  statusCode: number;
}

export type APIResponse<T = any> = SuccessResponse<T> | ErrorResponse;

// Error Classes
export class APIErrorBase extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: Record<string, any>;

  constructor(
    message: string,
    statusCode: number,
    code: string,
    details?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export class ValidationError extends APIErrorBase {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 400, "VALIDATION_ERROR", details);
  }
}

export class AuthenticationError extends APIErrorBase {
  constructor(message: string = "Authentication required") {
    super(message, 401, "AUTHENTICATION_ERROR");
  }
}

export class AuthorizationError extends APIErrorBase {
  constructor(message: string = "Insufficient permissions") {
    super(message, 403, "AUTHORIZATION_ERROR");
  }
}

export class NotFoundError extends APIErrorBase {
  constructor(resource: string = "Resource") {
    super(`${resource} not found`, 404, "NOT_FOUND");
  }
}

export class ConflictError extends APIErrorBase {
  constructor(message: string) {
    super(message, 409, "CONFLICT_ERROR");
  }
}

export class RateLimitError extends APIErrorBase {
  constructor(message: string = "Rate limit exceeded") {
    super(message, 429, "RATE_LIMIT_ERROR");
  }
}

export class InternalServerError extends APIErrorBase {
  constructor(message: string = "Internal server error") {
    super(message, 500, "INTERNAL_SERVER_ERROR");
  }
}

export class ServiceUnavailableError extends APIErrorBase {
  constructor(message: string = "Service temporarily unavailable") {
    super(message, 503, "SERVICE_UNAVAILABLE");
  }
}

export class GitHubAPIError extends APIErrorBase {
  constructor(message: string, statusCode: number = 502) {
    super(message, statusCode, "GITHUB_API_ERROR");
  }
}

export class DatabaseError extends APIErrorBase {
  constructor(message: string = "Database operation failed") {
    super(message, 500, "DATABASE_ERROR");
  }
}

// Error Handler Function
export function handleAPIError(error: unknown): NextResponse<ErrorResponse> {
  const requestId = generateRequestId();
  const timestamp = new Date();

  // Log error for monitoring
  console.error("API Error:", {
    error,
    requestId,
    timestamp,
    stack: error instanceof Error ? error.stack : undefined,
  });

  // Handle known API errors
  if (error instanceof APIErrorBase) {
    const apiError: APIError = {
      code: error.code,
      message: error.message,
      details: error.details,
      timestamp,
      requestId,
    };

    return NextResponse.json(
      {
        success: false,
        error: apiError,
        statusCode: error.statusCode,
      },
      { status: error.statusCode }
    );
  }

  // Handle Prisma errors
  if (error && typeof error === "object" && "code" in error) {
    const prismaError = error as any;

    switch (prismaError.code) {
      case "P2002":
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "UNIQUE_CONSTRAINT_ERROR",
              message: "A record with this information already exists",
              timestamp,
              requestId,
            },
            statusCode: 409,
          },
          { status: 409 }
        );

      case "P2025":
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "RECORD_NOT_FOUND",
              message: "The requested record was not found",
              timestamp,
              requestId,
            },
            statusCode: 404,
          },
          { status: 404 }
        );

      default:
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "DATABASE_ERROR",
              message: "Database operation failed",
              timestamp,
              requestId,
            },
            statusCode: 500,
          },
          { status: 500 }
        );
    }
  }

  // Handle generic errors
  const message =
    error instanceof Error ? error.message : "An unexpected error occurred";

  return NextResponse.json(
    {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message:
          process.env.NODE_ENV === "development"
            ? message
            : "Internal server error",
        timestamp,
        requestId,
      },
      statusCode: 500,
    },
    { status: 500 }
  );
}

// Success Response Helper
export function createSuccessResponse<T>(
  data: T,
  statusCode: number = 200
): NextResponse<SuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      statusCode,
    },
    { status: statusCode }
  );
}

// Request ID Generator
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Error Logging Service
export async function logError(
  error: Error,
  context: {
    userId?: string;
    requestId?: string;
    url?: string;
    userAgent?: string;
    additionalData?: Record<string, any>;
  }
) {
  const errorLog = {
    message: error.message,
    stack: error.stack,
    name: error.name,
    timestamp: new Date().toISOString(),
    ...context,
  };

  // In development, just log to console
  if (process.env.NODE_ENV === "development") {
    console.error("Error logged:", errorLog);
    return;
  }

  // In production, you would send this to your error monitoring service
  // Examples: Sentry, LogRocket, DataDog, etc.
  try {
    // Example implementation - replace with your actual error service
    await fetch(process.env.ERROR_LOGGING_ENDPOINT || "/api/errors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ERROR_LOGGING_TOKEN}`,
      },
      body: JSON.stringify(errorLog),
    });
  } catch (loggingError) {
    console.error("Failed to log error to external service:", loggingError);
  }
}

// Async Error Handler Wrapper
export function withErrorHandling<T extends any[], R>(
  handler: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R | NextResponse<ErrorResponse>> => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleAPIError(error);
    }
  };
}

// Validation Helper
export function validateRequired(
  data: Record<string, any>,
  requiredFields: string[]
): void {
  const missingFields = requiredFields.filter(
    (field) =>
      data[field] === undefined || data[field] === null || data[field] === ""
  );

  if (missingFields.length > 0) {
    throw new ValidationError(
      `Missing required fields: ${missingFields.join(", ")}`,
      { missingFields }
    );
  }
}

// Email Validation
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// URL Validation
export function validateURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
