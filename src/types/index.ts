// Core application types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
  success?: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Contact types
export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
  type?: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
}

// Blog types
export interface BlogPostData {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  status: "DRAFT" | "PUBLISHED" | "SCHEDULED" | "ARCHIVED";
  featured?: boolean;
  categoryIds?: string[];
  tagIds?: string[];
}

// Project types
export interface ProjectData {
  title: string;
  slug: string;
  description: string;
  content?: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED" | "FEATURED";
  featured?: boolean;
  thumbnail?: string;
  images?: string[];
  videoUrl?: string;
  categoryIds?: string[];
}

// Category types
export interface CategoryData {
  name: string;
  slug: string;
  description?: string;
  color: string;
}

// Error handling types
export interface ErrorDetails {
  field?: string;
  message: string;
  code?: string;
}

export interface ValidationError {
  error: string;
  details: ErrorDetails[];
}

// Analytics types
export interface AnalyticsData {
  event: string;
  metadata?: Record<string, unknown>;
  timestamp?: number;
}

// Testimonial types
export interface TestimonialData {
  name: string;
  email?: string;
  role: string;
  company?: string;
  content: string;
  rating?: number;
  videoUrl?: string;
  avatarUrl?: string;
  linkedinProfile?: string;
  source?: string;
  featured?: boolean;
  approved?: boolean;
}

// Service types
export interface ServiceData {
  name: string;
  slug: string;
  description: string;
  content?: string;
  priceFrom?: number;
  priceTo?: number;
  priceType: "HOURLY" | "PROJECT" | "MONTHLY" | "CUSTOM";
  features: string[];
  highlights: string[];
  processSteps?: unknown;
  deliveryTime?: string;
  deliverables: string[];
  featured?: boolean;
  popular?: boolean;
  order?: number;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  active?: boolean;
}

// Request context types
export interface RequestContext {
  userAgent?: string;
  ip?: string;
  sessionId?: string;
  userId?: string;
}

// Search types
export interface SearchParams {
  q?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
  [key: string]: string | number | undefined;
}

// Bulk operation types
export interface BulkOperationResult {
  success: number;
  failed: number;
  errors: Array<{
    index: number;
    error: string;
  }>;
}
