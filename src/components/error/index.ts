export { default as ErrorBoundary } from "./error-boundary";
export type { ErrorFallbackProps } from "./error-boundary";

export {
  OfflineNotification,
  ConnectionStatus,
  NetworkQualityIndicator,
  OfflineFallback,
} from "./offline-notification";

export {
  useOnlineStatus,
  useNetworkQuality,
  useOfflineNotification,
  OfflineStorage,
  offlineFetch,
  registerServiceWorker,
  gracefulDegradation,
} from "@/lib/offline-detection";

export {
  errorMonitoring,
  useErrorMonitoring,
  withErrorMonitoring,
} from "@/lib/error-monitoring";

export {
  handleAPIError,
  createSuccessResponse,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  InternalServerError,
  ServiceUnavailableError,
  GitHubAPIError,
  DatabaseError,
  logError,
  withErrorHandling,
  validateRequired,
  validateEmail,
  validateURL,
} from "@/lib/api-errors";

export {
  validateForm,
  getFieldError,
  hasFieldError,
  getFormErrorCount,
  sanitizeInput,
  sanitizeEmail,
  sanitizeURL,
  validateHoneypot,
  validateCSRFToken,
  contactFormSchema,
  projectInquirySchema,
  consultationBookingSchema,
  newsletterSchema,
  blogCommentSchema,
  testimonialSubmissionSchema,
  rateLimitConfigs,
} from "@/lib/form-validation";

export { GitHubService, githubService } from "@/lib/github-fallbacks";

export type {
  APIError,
  ErrorResponse,
  SuccessResponse,
  APIResponse,
  ValidationError as FormValidationError,
  FormErrors,
  ValidationResult,
  ContactFormData,
  ProjectInquiryData,
  ConsultationBookingData,
  NewsletterData,
  BlogCommentData,
  TestimonialSubmissionData,
  GitHubRepository,
  ContributionData,
  ContributionWeek,
  ContributionDay,
  GitHubUserStats,
  ErrorContext,
  ErrorReport,
  PerformanceMetric,
} from "@/lib/api-errors";
