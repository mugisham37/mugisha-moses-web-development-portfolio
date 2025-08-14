import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = "Authentication required") {
    super(message);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends Error {
  constructor(message: string = "Insufficient permissions") {
    super(message);
    this.name = "AuthorizationError";
  }
}

export class GitHubAPIError extends Error {
  public statusCode: number;
  public response?: unknown;

  constructor(message: string, statusCode: number = 500, response?: unknown) {
    super(message);
    this.name = "GitHubAPIError";
    this.statusCode = statusCode;
    this.response = response;
  }
}

export class NotFoundError extends Error {
  constructor(message: string = "Resource not found") {
    super(message);
    this.name = "NotFoundError";
  }
}

export class RateLimitError extends Error {
  constructor(message: string = "Rate limit exceeded") {
    super(message);
    this.name = "RateLimitError";
  }
}

export function handleAPIError(error: unknown): NextResponse {
  console.error("API Error:", error);

  if (error instanceof ValidationError) {
    return NextResponse.json(
      {
        success: false,
        error: "Validation Error",
        message: error.message,
      },
      { status: 400 }
    );
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: "Validation Error",
        details: error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 }
    );
  }

  if (error instanceof AuthenticationError) {
    return NextResponse.json(
      {
        success: false,
        error: "Authentication Error",
        message: error.message,
      },
      { status: 401 }
    );
  }

  if (error instanceof AuthorizationError) {
    return NextResponse.json(
      {
        success: false,
        error: "Authorization Error",
        message: error.message,
      },
      { status: 403 }
    );
  }

  if (error instanceof NotFoundError) {
    return NextResponse.json(
      {
        success: false,
        error: "Not Found",
        message: error.message,
      },
      { status: 404 }
    );
  }

  if (error instanceof RateLimitError) {
    return NextResponse.json(
      {
        success: false,
        error: "Rate Limit Exceeded",
        message: error.message,
      },
      { status: 429 }
    );
  }

  // Generic server error
  return NextResponse.json(
    {
      success: false,
      error: "Internal Server Error",
      message: "An unexpected error occurred",
    },
    { status: 500 }
  );
}

export function createSuccessResponse<T>(
  data: T,
  status: number = 200
): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

export function createErrorResponse(
  message: string,
  status: number = 400,
  details?: unknown
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: message,
      ...(details ? { details } : {}),
    },
    { status }
  );
}
