import { NextResponse } from "next/server";
import { ZodError } from "zod";

// Error Classes
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

export class ConflictError extends Error {
  constructor(message: string = "Resource conflict") {
    super(message);
    this.name = "ConflictError";
  }
}

export class InternalServerError extends Error {
  constructor(message: string = "Internal server error") {
    super(message);
    this.name = "InternalServerError";
  }
}

export class ServiceUnavailableError extends Error {
  constructor(message: string = "Service temporarily unavailable") {
    super(message);
    this.name = "ServiceUnavailableError";
  }
}

export class DatabaseError extends Error {
  constructor(message: string = "Database operation failed") {
    super(message);
    this.name = "DatabaseError";
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

  if (error instanceof ConflictError) {
    return NextResponse.json(
      {
        success: false,
        error: "Conflict",
        message: error.message,
      },
      { status: 409 }
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

  if (error instanceof InternalServerError) {
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        message: error.message,
      },
      { status: 500 }
    );
  }

  if (error instanceof ServiceUnavailableError) {
    return NextResponse.json(
      {
        success: false,
        error: "Service Unavailable",
        message: error.message,
      },
      { status: 503 }
    );
  }

  if (error instanceof DatabaseError) {
    return NextResponse.json(
      {
        success: false,
        error: "Database Error",
        message: error.message,
      },
      { status: 500 }
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

// Utility Functions
export function logError(error: unknown, context?: string): void {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;
  
  console.error(`[${context || 'Unknown'}] Error:`, {
    message: errorMessage,
    stack: errorStack,
    timestamp: new Date().toISOString(),
  });
}

export function withErrorHandling<T extends (...args: unknown[]) => unknown>(
  fn: T,
  context?: string
): T {
  return ((...args: Parameters<T>) => {
    try {
      const result = fn(...args);
      if (result instanceof Promise) {
        return result.catch((error) => {
          logError(error, context);
          throw error;
        });
      }
      return result;
    } catch (error) {
      logError(error, context);
      throw error;
    }
  }) as T;
}

// Validation Functions
export function validateRequired(value: unknown, fieldName: string): string {
  if (value === null || value === undefined || value === '') {
    throw new ValidationError(`${fieldName} is required`);
  }
  return String(value);
}

export function validateEmail(email: string): string {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format');
  }
  return email.toLowerCase();
}

export function validateURL(url: string): string {
  try {
    new URL(url);
    return url;
  } catch {
    throw new ValidationError('Invalid URL format');
  }
}

// Type Definitions
export interface APIError {
  message: string;
  code?: string;
  statusCode?: number;
}

export interface ErrorResponse {
  success: false;
  error: string;
  message?: string;
  details?: unknown;
}

export interface SuccessResponse<T = unknown> {
  success: true;
  data: T;
}

export type APIResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;

export interface FormErrors {
  [key: string]: string | string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: FormErrors;
}

// Form Data Types
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot?: string;
  csrfToken?: string;
}

export interface ProjectInquiryData {
  name: string;
  email: string;
  company?: string;
  projectType: string;
  budget: string;
  timeline: string;
  description: string;
  requirements?: string[];
}

export interface ConsultationBookingData {
  name: string;
  email: string;
  company?: string;
  consultationType: string;
  preferredDate: string;
  timeZone: string;
  description: string;
}

export interface NewsletterData {
  email: string;
  preferences?: string[];
}

export interface BlogCommentData {
  name: string;
  email: string;
  website?: string;
  comment: string;
  postId: string;
  parentId?: string;
}

export interface TestimonialSubmissionData {
  name: string;
  email: string;
  company?: string;
  position?: string;
  testimonial: string;
  rating: number;
  projectType?: string;
  allowPublic: boolean;
}

// GitHub Types
export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  topics: string[];
}

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface ContributionData {
  totalContributions: number;
  weeks: ContributionWeek[];
}

export interface GitHubUserStats {
  totalRepositories: number;
  totalStars: number;
  totalForks: number;
  totalCommits: number;
  contributions: ContributionData;
  topLanguages: Array<{
    name: string;
    percentage: number;
    color: string;
  }>;
}

// Error Monitoring Types
export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  url?: string;
  timestamp: Date;
  additionalData?: Record<string, unknown>;
}

export interface ErrorReport {
  error: Error;
  context: ErrorContext;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  context?: Record<string, unknown>;
}
