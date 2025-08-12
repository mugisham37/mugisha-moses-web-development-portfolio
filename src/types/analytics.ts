// Analytics type definitions
export interface AnalyticsMetadata {
  [key: string]: string | number | boolean | null | undefined;
}

export interface AnalyticsEvent {
  event: string;
  postId?: string;
  metadata?: AnalyticsMetadata;
}

export interface ConversionMetadata extends AnalyticsMetadata {
  source?: string;
  variant?: string;
  type?: string;
  step?: string;
  timestamp?: number;
}

export interface PerformanceMetrics {
  lcp?: number;
  fid?: number;
  cls?: number;
  fcp?: number;
  ttfb?: number;
}

export interface ConnectionInfo {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
}

export interface PerformanceEntry {
  name?: string;
  startTime: number;
  processingStart?: number;
  value?: number;
  hadRecentInput?: boolean;
}

export interface NavigatorConnection {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
}

export interface ExtendedNavigator extends Navigator {
  connection?: NavigatorConnection;
  mozConnection?: NavigatorConnection;
  webkitConnection?: NavigatorConnection;
  msMaxTouchPoints?: number;
}

export interface ConsentTypes {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export interface SessionData {
  id: string;
  created: number;
  lastActivity: number;
}

export interface ConsentData {
  types: ConsentTypes;
  timestamp: number;
  version: string;
}
