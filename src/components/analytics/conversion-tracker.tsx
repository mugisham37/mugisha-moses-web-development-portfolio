"use client";

import { useEffect } from "react";
import { useAnalytics } from "./analytics-provider";
import type { ConversionMetadata } from "@/types/analytics";

interface ConversionTrackerProps {
  step: string;
  value?: number;
  metadata?: ConversionMetadata;
  children: React.ReactNode;
}

export function ConversionTracker({
  step,
  value,
  metadata,
  children,
}: ConversionTrackerProps) {
  const { trackConversion, hasConsent } = useAnalytics();

  useEffect(() => {
    if (hasConsent) {
      // Track funnel step entry
      trackConversion(`funnel_${step}`, value, {
        ...metadata,
        step,
        timestamp: Date.now(),
      });
    }
  }, [step, value, metadata, trackConversion, hasConsent]);

  return <>{children}</>;
}

// Specific conversion trackers for common actions
export function ContactFormTracker({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConversionTracker step="contact_form_view" metadata={{ type: "contact" }}>
      {children}
    </ConversionTracker>
  );
}

export function ProjectInquiryTracker({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConversionTracker
      step="project_inquiry_view"
      metadata={{ type: "project_inquiry" }}
    >
      {children}
    </ConversionTracker>
  );
}

export function ConsultationBookingTracker({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConversionTracker
      step="consultation_booking_view"
      metadata={{ type: "consultation" }}
    >
      {children}
    </ConversionTracker>
  );
}

export function NewsletterSignupTracker({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConversionTracker
      step="newsletter_signup_view"
      metadata={{ type: "newsletter" }}
    >
      {children}
    </ConversionTracker>
  );
}
