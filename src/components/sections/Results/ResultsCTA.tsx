"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import "./ResultsCTA.css";

interface ResultsCTAProps {
  theme: "extreme-brutalist" | "refined-brutalist";
  className?: string;
}

interface CTAAnalytics {
  section: string;
  action: string;
  label?: string;
  value?: number;
}

export const ResultsCTA: React.FC<ResultsCTAProps> = ({
  theme,
  className = "",
}) => {
  const { currentTheme } = useTheme();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [successAnimations, setSuccessAnimations] = useState<string[]>([]);
  const [conversionMetrics, setConversionMetrics] = useState({
    views: 0,
    interactions: 0,
    conversions: 0,
  });

  // Intersection observer for entrance animations
  const isInView = useIntersectionObserver(sectionRef, {
    threshold: 0.3,
    rootMargin: "-50px",
    triggerOnce: true,
  });

  // Track analytics events
  const trackEvent = (analytics: CTAAnalytics) => {
    // In a real implementation, this would send to Google Analytics, Mixpanel, etc.
    console.log("CTA Analytics Event:", analytics);

    // Update local metrics for demonstration
    setConversionMetrics((prev) => ({
      ...prev,
      interactions: prev.interactions + 1,
      ...(analytics.action === "conversion" && {
        conversions: prev.conversions + 1,
      }),
    }));

    // Example GA4 event (would be implemented with actual GA4)
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", analytics.action, {
        event_category: "Results CTA",
        event_label: analytics.label,
        value: analytics.value,
        section: analytics.section,
      });
    }
  };

  // Success animation sequence
  useEffect(() => {
    if (isInView) {
      setIsVisible(true);

      // Track section view
      trackEvent({
        section: "results-cta",
        action: "view",
        label: "section_visible",
      });

      setConversionMetrics((prev) => ({ ...prev, views: prev.views + 1 }));

      // Start success animation sequence
      const successMessages = [
        "CONVERSION_OPTIMIZATION_ACTIVE",
        "SUCCESS_METRICS_LOADED",
        "GUARANTEE_VERIFIED",
        "CTA_ELEMENTS_READY",
        "TRACKING_INITIALIZED",
      ];

      let index = 0;
      const interval = setInterval(() => {
        if (index < successMessages.length) {
          setSuccessAnimations((prev) => [...prev, successMessages[index]]);
          index++;
        } else {
          clearInterval(interval);
        }
      }, 600);

      return () => clearInterval(interval);
    }
  }, [isInView]);

  const handleCTAClick = (ctaType: string, ctaLabel: string) => {
    trackEvent({
      section: "results-cta",
      action: "click",
      label: ctaLabel,
      value: ctaType === "primary" ? 100 : 50,
    });

    // Simulate conversion tracking
    if (ctaType === "primary") {
      setTimeout(() => {
        trackEvent({
          section: "results-cta",
          action: "conversion",
          label: "primary_cta_conversion",
        });
      }, 1000);
    }

    // In a real implementation, this would navigate or open a modal
    console.log(`CTA clicked: ${ctaLabel}`);
  };

  const guaranteeItems = [
    {
      icon: "🛡️",
      text: "100% SATISFACTION GUARANTEE",
      subtext: "Full refund if not completely satisfied",
    },
    {
      icon: "⚡",
      text: "RAPID DELIVERY PROMISE",
      subtext: "Project kickoff within 48 hours",
    },
    {
      icon: "🎯",
      text: "RESULTS-DRIVEN APPROACH",
      subtext: "Measurable ROI or we work for free",
    },
    {
      icon: "🔒",
      text: "ENTERPRISE SECURITY",
      subtext: "Bank-level security & NDA protection",
    },
  ];

  const ctaOptions = [
    {
      type: "primary",
      text: "START YOUR PROJECT",
      subtext: "Book a strategy session",
      icon: "🚀",
      urgency: "Limited spots available",
      value: "$10K+ value",
    },
    {
      type: "secondary",
      text: "VIEW CASE STUDIES",
      subtext: "See detailed results",
      icon: "📊",
      urgency: "Updated weekly",
      value: "Free access",
    },
    {
      type: "tertiary",
      text: "GET FREE AUDIT",
      subtext: "No commitment required",
      icon: "🔍",
      urgency: "48-hour turnaround",
      value: "$2K value",
    },
  ];

  return (
    <div
      ref={sectionRef}
      className={`results-cta results-cta--${theme} ${className} ${
        isVisible ? "results-cta--visible" : ""
      }`}
    >
      {/* Success Animation Stream */}
      <div className="results-cta__success-stream">
        {successAnimations.map((message, index) => (
          <div
            key={index}
            className="success-stream__item"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <span className="success-stream__icon">✓</span>
            <span className="success-stream__text">{message}</span>
          </div>
        ))}
      </div>

      {/* Main CTA Content */}
      <div className="results-cta__content">
        {/* Conversion Header */}
        <div className="results-cta__header">
          <div className="cta-header__badge">
            <span className="badge__icon">🎯</span>
            <span className="badge__text">CONVERSION OPTIMIZED</span>
            <div className="badge__pulse"></div>
          </div>

          <h3 className="cta-header__title">
            <span className="title__line">READY TO SEE</span>
            <span className="title__line title__line--accent">
              SIMILAR RESULTS?
            </span>
            <span className="title__line">FOR YOUR PROJECT?</span>
          </h3>

          <p className="cta-header__description">
            Join 200+ successful projects that achieved measurable ROI.
            Let&apos;s discuss how we can replicate these results for your
            business.
          </p>

          {/* Social Proof Metrics */}
          <div className="cta-header__metrics">
            <div className="metric__item">
              <span className="metric__value">98%</span>
              <span className="metric__label">Client Satisfaction</span>
            </div>
            <div className="metric__item">
              <span className="metric__value">$2.5M+</span>
              <span className="metric__label">Revenue Generated</span>
            </div>
            <div className="metric__item">
              <span className="metric__value">48hr</span>
              <span className="metric__label">Response Time</span>
            </div>
          </div>
        </div>

        {/* Multiple CTA Options */}
        <div className="results-cta__options">
          {ctaOptions.map((cta, index) => (
            <div
              key={index}
              className={`cta-option cta-option--${cta.type}`}
              style={{ animationDelay: `${0.8 + index * 0.2}s` }}
            >
              <div className="cta-option__header">
                <span className="cta-option__icon">{cta.icon}</span>
                <div className="cta-option__urgency">{cta.urgency}</div>
              </div>

              <button
                className={`cta-option__button cta-option__button--${cta.type}`}
                onClick={() => handleCTAClick(cta.type, cta.text)}
              >
                <span className="button__text">{cta.text}</span>
                <span className="button__subtext">{cta.subtext}</span>

                <div className="button__effects">
                  <div className="button__shimmer"></div>
                  <div className="button__glow"></div>
                  <div className="button__strike"></div>
                  <div className="button__border-animation"></div>
                </div>
              </button>

              <div className="cta-option__value">
                <span className="value__text">{cta.value}</span>
                <div className="value__highlight"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Guarantee Section */}
        <div className="results-cta__guarantees">
          <div className="guarantees__header">
            <h4 className="guarantees__title">
              <span className="guarantees__icon">🛡️</span>
              YOUR SUCCESS IS GUARANTEED
            </h4>
          </div>

          <div className="guarantees__grid">
            {guaranteeItems.map((guarantee, index) => (
              <div
                key={index}
                className="guarantee__item"
                style={{ animationDelay: `${1.4 + index * 0.1}s` }}
              >
                <div className="guarantee__icon">{guarantee.icon}</div>
                <div className="guarantee__content">
                  <div className="guarantee__text">{guarantee.text}</div>
                  <div className="guarantee__subtext">{guarantee.subtext}</div>
                </div>
                <div className="guarantee__verification">
                  <span className="verification__badge">VERIFIED</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion Analytics Display (for demo) */}
        {process.env.NODE_ENV === "development" && (
          <div className="results-cta__analytics">
            <div className="analytics__title">Live Conversion Metrics</div>
            <div className="analytics__metrics">
              <div className="analytics__metric">
                <span className="metric__label">Views:</span>
                <span className="metric__value">{conversionMetrics.views}</span>
              </div>
              <div className="analytics__metric">
                <span className="metric__label">Interactions:</span>
                <span className="metric__value">
                  {conversionMetrics.interactions}
                </span>
              </div>
              <div className="analytics__metric">
                <span className="metric__label">Conversions:</span>
                <span className="metric__value">
                  {conversionMetrics.conversions}
                </span>
              </div>
              <div className="analytics__metric">
                <span className="metric__label">CVR:</span>
                <span className="metric__value">
                  {conversionMetrics.views > 0
                    ? `${((conversionMetrics.conversions / conversionMetrics.views) * 100).toFixed(1)}%`
                    : "0%"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Background Effects */}
      <div className="results-cta__effects">
        <div className="effects__particles"></div>
        <div className="effects__grid"></div>
        <div className="effects__glow"></div>
      </div>
    </div>
  );
};
