import { z } from "zod";

// Validation Error Types
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface FormErrors {
  [key: string]: ValidationError[];
}

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: FormErrors;
}

// Custom error messages for better UX
const customErrorMessages = {
  required: "This field is required",
  email: "Please enter a valid email address",
  url: "Please enter a valid URL",
  minLength: (min: number) => `Must be at least ${min} characters long`,
  maxLength: (max: number) => `Must be no more than ${max} characters long`,
  min: (min: number) => `Must be at least ${min}`,
  max: (max: number) => `Must be no more than ${max}`,
  pattern: "Invalid format",
  phone: "Please enter a valid phone number",
  strongPassword:
    "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character",
};

// Common validation schemas
export const commonSchemas = {
  email: z
    .string()
    .min(1, customErrorMessages.required)
    .email(customErrorMessages.email),

  password: z
    .string()
    .min(8, customErrorMessages.minLength(8))
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      customErrorMessages.strongPassword
    ),

  name: z
    .string()
    .min(1, customErrorMessages.required)
    .min(2, customErrorMessages.minLength(2))
    .max(100, customErrorMessages.maxLength(100)),

  phone: z
    .string()
    .min(1, customErrorMessages.required)
    .regex(/^[\+]?[1-9][\d]{0,15}$/, customErrorMessages.phone),

  url: z
    .string()
    .min(1, customErrorMessages.required)
    .url(customErrorMessages.url),

  message: z
    .string()
    .min(1, customErrorMessages.required)
    .min(10, customErrorMessages.minLength(10))
    .max(5000, customErrorMessages.maxLength(5000)),

  subject: z
    .string()
    .min(1, customErrorMessages.required)
    .min(3, customErrorMessages.minLength(3))
    .max(200, customErrorMessages.maxLength(200)),
};

// Contact Form Schema
export const contactFormSchema = z.object({
  name: commonSchemas.name,
  email: commonSchemas.email,
  subject: commonSchemas.subject.optional(),
  message: commonSchemas.message,
  type: z
    .enum([
      "GENERAL",
      "PROJECT_INQUIRY",
      "CONSULTATION",
      "COLLABORATION",
      "SUPPORT",
    ])
    .default("GENERAL"),
  projectType: z.string().optional(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  honeypot: z.string().max(0, "Bot detected"), // Spam protection
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Project Inquiry Form Schema
export const projectInquirySchema = z.object({
  name: commonSchemas.name,
  email: commonSchemas.email,
  company: z.string().optional(),
  projectTitle: z
    .string()
    .min(1, customErrorMessages.required)
    .min(3, customErrorMessages.minLength(3))
    .max(200, customErrorMessages.maxLength(200)),
  projectDescription: commonSchemas.message,
  projectType: z.enum([
    "WEB_APPLICATION",
    "MOBILE_APP",
    "E_COMMERCE",
    "API_DEVELOPMENT",
    "CONSULTING",
    "OTHER",
  ]),
  budget: z.enum([
    "UNDER_5K",
    "5K_TO_15K",
    "15K_TO_50K",
    "50K_TO_100K",
    "OVER_100K",
    "DISCUSS",
  ]),
  timeline: z.enum([
    "ASAP",
    "1_MONTH",
    "2_3_MONTHS",
    "3_6_MONTHS",
    "6_PLUS_MONTHS",
    "FLEXIBLE",
  ]),
  technologies: z.array(z.string()).optional(),
  additionalInfo: z
    .string()
    .max(2000, customErrorMessages.maxLength(2000))
    .optional(),
  honeypot: z.string().max(0, "Bot detected"),
});

export type ProjectInquiryData = z.infer<typeof projectInquirySchema>;

// Consultation Booking Schema
export const consultationBookingSchema = z.object({
  name: commonSchemas.name,
  email: commonSchemas.email,
  company: z.string().optional(),
  phone: commonSchemas.phone.optional(),
  consultationType: z.enum([
    "TECHNICAL_CONSULTATION",
    "PROJECT_PLANNING",
    "CODE_REVIEW",
    "ARCHITECTURE_REVIEW",
    "GENERAL_DISCUSSION",
  ]),
  preferredDate: z.string().min(1, customErrorMessages.required),
  preferredTime: z.string().min(1, customErrorMessages.required),
  timezone: z.string().min(1, customErrorMessages.required),
  duration: z.enum(["30_MIN", "60_MIN", "90_MIN", "120_MIN"]).default("60_MIN"),
  topics: commonSchemas.message,
  meetingType: z
    .enum(["VIDEO_CALL", "PHONE_CALL", "IN_PERSON"])
    .default("VIDEO_CALL"),
  honeypot: z.string().max(0, "Bot detected"),
});

export type ConsultationBookingData = z.infer<typeof consultationBookingSchema>;

// Newsletter Signup Schema
export const newsletterSchema = z.object({
  email: commonSchemas.email,
  name: z.string().optional(),
  interests: z.array(z.string()).optional(),
  honeypot: z.string().max(0, "Bot detected"),
});

export type NewsletterData = z.infer<typeof newsletterSchema>;

// Blog Comment Schema
export const blogCommentSchema = z.object({
  name: commonSchemas.name,
  email: commonSchemas.email,
  website: z.string().url(customErrorMessages.url).optional().or(z.literal("")),
  comment: z
    .string()
    .min(1, customErrorMessages.required)
    .min(5, customErrorMessages.minLength(5))
    .max(2000, customErrorMessages.maxLength(2000)),
  postId: z.string().min(1, customErrorMessages.required),
  parentId: z.string().optional(),
  honeypot: z.string().max(0, "Bot detected"),
});

export type BlogCommentData = z.infer<typeof blogCommentSchema>;

// Testimonial Submission Schema
export const testimonialSubmissionSchema = z.object({
  name: commonSchemas.name,
  email: commonSchemas.email,
  company: z.string().optional(),
  role: z
    .string()
    .min(1, customErrorMessages.required)
    .max(100, customErrorMessages.maxLength(100)),
  rating: z
    .number()
    .min(1, "Rating must be between 1 and 5")
    .max(5, "Rating must be between 1 and 5"),
  testimonial: z
    .string()
    .min(1, customErrorMessages.required)
    .min(20, customErrorMessages.minLength(20))
    .max(1000, customErrorMessages.maxLength(1000)),
  projectType: z.string().optional(),
  workDuration: z.string().optional(),
  allowPublic: z.boolean().default(true),
  allowContact: z.boolean().default(false),
  honeypot: z.string().max(0, "Bot detected"),
});

export type TestimonialSubmissionData = z.infer<
  typeof testimonialSubmissionSchema
>;

// Generic validation function
export function validateForm<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  try {
    const validatedData = schema.parse(data);
    return {
      success: true,
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formErrors: FormErrors = {};

      error.issues.forEach((err: z.ZodIssue) => {
        const field = err.path.join(".");
        if (!formErrors[field]) {
          formErrors[field] = [];
        }

        formErrors[field].push({
          field,
          message: err.message,
          code: err.code,
        });
      });

      return {
        success: false,
        errors: formErrors,
      };
    }

    // Unexpected error
    return {
      success: false,
      errors: {
        general: [
          {
            field: "general",
            message: "An unexpected validation error occurred",
            code: "UNKNOWN_ERROR",
          },
        ],
      },
    };
  }
}

// Client-side validation helpers
export function getFieldError(
  errors: FormErrors | undefined,
  fieldName: string
): string | undefined {
  if (!errors || !errors[fieldName] || errors[fieldName].length === 0) {
    return undefined;
  }
  return errors[fieldName][0].message;
}

export function hasFieldError(
  errors: FormErrors | undefined,
  fieldName: string
): boolean {
  return !!getFieldError(errors, fieldName);
}

export function getFormErrorCount(errors: FormErrors | undefined): number {
  if (!errors) return 0;
  return Object.values(errors).reduce(
    (count, fieldErrors) => count + fieldErrors.length,
    0
  );
}

// Sanitization helpers
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .substring(0, 10000); // Limit length
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export function sanitizeURL(url: string): string {
  const trimmed = url.trim();
  if (
    trimmed &&
    !trimmed.startsWith("http://") &&
    !trimmed.startsWith("https://")
  ) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

// Rate limiting helpers (for form submissions)
export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxAttempts: number; // Max attempts per window
}

export const rateLimitConfigs = {
  contact: { windowMs: 60 * 1000, maxAttempts: 3 }, // 3 per minute
  newsletter: { windowMs: 60 * 1000, maxAttempts: 2 }, // 2 per minute
  consultation: { windowMs: 5 * 60 * 1000, maxAttempts: 1 }, // 1 per 5 minutes
  testimonial: { windowMs: 10 * 60 * 1000, maxAttempts: 1 }, // 1 per 10 minutes
};

// Honeypot validation (spam protection)
export function validateHoneypot(honeypot: string | undefined): boolean {
  return !honeypot || honeypot.length === 0;
}

// CSRF token validation (if using custom CSRF protection)
export function validateCSRFToken(
  token: string,
  expectedToken: string
): boolean {
  return token === expectedToken;
}
