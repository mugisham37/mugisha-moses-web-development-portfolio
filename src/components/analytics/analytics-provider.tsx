"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { ConsentBanner } from "./consent-banner";
import { PerformanceMonitor } from "./performance-monitor";
import { ABTestProvider } from "./ab-test-provider";
import type {
  AnalyticsMetadata,
  ConsentTypes,
  SessionData,
  ConsentData,
} from "@/types/analytics";

interface AnalyticsContextType {
  sessionId: string;
  hasConsent: boolean;
  consentTypes: ConsentTypes;
  updateConsent: (consent: Partial<ConsentTypes>) => void;
  trackEvent: (event: string, data?: AnalyticsMetadata) => void;
  trackPageView: (path: string, metadata?: AnalyticsMetadata) => void;
  trackConversion: (
    type: string,
    value?: number,
    metadata?: AnalyticsMetadata
  ) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error("useAnalytics must be used within AnalyticsProvider");
  }
  return context;
}

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const [sessionId, setSessionId] = useState<string>("");
  const [hasConsent, setHasConsent] = useState<boolean>(false);
  const [showConsentBanner, setShowConsentBanner] = useState<boolean>(false);
  const [consentTypes, setConsentTypes] = useState<ConsentTypes>({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: true,
  });

  const initializeSession = useCallback(async () => {
    if (!sessionId) return;

    try {
      await fetch("/api/analytics/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          action: "start",
          page: window.location.pathname,
          referer: document.referrer,
        }),
      });
    } catch (error) {
      console.error("Failed to initialize session:", error);
    }
  }, [sessionId]);

  useEffect(() => {
    // Generate or retrieve session ID
    const generateSessionId = () => {
      const stored = localStorage.getItem("analytics_session_id");
      if (stored) {
        const session: SessionData = JSON.parse(stored);
        const now = Date.now();
        // Session expires after 30 minutes of inactivity
        if (now - session.lastActivity < 30 * 60 * 1000) {
          session.lastActivity = now;
          localStorage.setItem("analytics_session_id", JSON.stringify(session));
          return session.id;
        }
      }

      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
      const sessionData: SessionData = {
        id: newSessionId,
        created: Date.now(),
        lastActivity: Date.now(),
      };
      localStorage.setItem("analytics_session_id", JSON.stringify(sessionData));
      return newSessionId;
    };

    setSessionId(generateSessionId());

    // Check for existing consent
    const storedConsent = localStorage.getItem("analytics_consent");
    if (storedConsent) {
      const consent: ConsentData = JSON.parse(storedConsent);
      setConsentTypes(consent.types);
      setHasConsent(consent.types.analytics || consent.types.marketing);
    } else {
      // Show consent banner for new users
      setShowConsentBanner(true);
    }
  }, []);

  useEffect(() => {
    if (sessionId) {
      initializeSession();
    }
  }, [sessionId, initializeSession]);

  const updateConsent = (newConsent: Partial<ConsentTypes>) => {
    const updatedConsent = { ...consentTypes, ...newConsent };
    setConsentTypes(updatedConsent);
    setHasConsent(updatedConsent.analytics || updatedConsent.marketing);
    setShowConsentBanner(false);

    // Store consent
    const consentData: ConsentData = {
      types: updatedConsent,
      timestamp: Date.now(),
      version: "1.0",
    };
    localStorage.setItem("analytics_consent", JSON.stringify(consentData));

    // Send consent to server
    fetch("/api/analytics/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        consent: updatedConsent,
      }),
    }).catch(console.error);
  };

  const trackEvent = async (event: string, data?: AnalyticsMetadata) => {
    if (!consentTypes.analytics && !consentTypes.necessary) return;

    try {
      await fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          event,
          data,
          timestamp: Date.now(),
          page: window.location.pathname,
        }),
      });
    } catch (error) {
      console.error("Failed to track event:", error);
    }
  };

  const trackPageView = async (path: string, metadata?: AnalyticsMetadata) => {
    // Page views are considered necessary for basic functionality
    try {
      await fetch("/api/analytics/pageview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          path,
          metadata,
          timestamp: Date.now(),
          referer: document.referrer,
        }),
      });
    } catch (error) {
      console.error("Failed to track page view:", error);
    }
  };

  const trackConversion = async (
    type: string,
    value?: number,
    metadata?: AnalyticsMetadata
  ) => {
    if (!consentTypes.analytics) return;

    try {
      await fetch("/api/analytics/conversion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          type,
          value,
          metadata,
          timestamp: Date.now(),
          page: window.location.pathname,
        }),
      });
    } catch (error) {
      console.error("Failed to track conversion:", error);
    }
  };

  const contextValue: AnalyticsContextType = {
    sessionId,
    hasConsent,
    consentTypes,
    updateConsent,
    trackEvent,
    trackPageView,
    trackConversion,
  };

  return (
    <AnalyticsContext.Provider value={contextValue}>
      <ABTestProvider>
        {children}
        {showConsentBanner && (
          <ConsentBanner
            onAcceptAll={() =>
              updateConsent({ analytics: true, marketing: true })
            }
            onAcceptNecessary={() =>
              updateConsent({ analytics: false, marketing: false })
            }
            onCustomize={(consent) => updateConsent(consent)}
          />
        )}
        <PerformanceMonitor
          sessionId={sessionId}
          hasConsent={consentTypes.analytics}
        />
      </ABTestProvider>
    </AnalyticsContext.Provider>
  );
}
