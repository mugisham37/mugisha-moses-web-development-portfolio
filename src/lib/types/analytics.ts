// Analytics type definitions

export interface AnalyticsMetadata extends Record<string, unknown> {
  timestamp?: string;
  page?: string;
  element?: string;
  platform?: string;
  resource?: string;
  duration?: number;
  percentage?: number;
  feature?: string;
  tier?: string;
  question?: string;
  ctaType?: string;
  sessionId?: string;
}

export interface AnalyticsEvent {
  event: string;
  metadata?: AnalyticsMetadata;
}

export interface ServiceAnalyticsEvent {
  serviceId: string;
  event:
    | "view"
    | "inquiry"
    | "booking"
    | "conversion"
    | "feature_click"
    | "pricing_view"
    | "faq_expand"
    | "cta_click";
  metadata?: AnalyticsMetadata;
}

export interface ProjectAnalyticsEvent {
  projectId: string;
  event: string;
  metadata?: AnalyticsMetadata;
}
