/**
 * SEO Provider Component
 * Provides SEO context and utilities throughout the application
 */

"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  generateMetadata,
  generateStructuredData,
  SEOConfig,
} from "@/utils/seo-helpers";
import { portfolioData } from "@/data/portfolio";

interface SEOContextType {
  updateSEO: (config: Partial<SEOConfig>) => void;
  currentSEO: SEOConfig;
  trackPageView: (page: string) => void;
  trackEvent: (event: string, data?: Record<string, any>) => void;
}

const SEOContext = createContext<SEOContextType | undefined>(undefined);

interface SEOProviderProps {
  children: React.ReactNode;
  initialSEO?: Partial<SEOConfig>;
}

export function SEOProvider({ children, initialSEO = {} }: SEOProviderProps) {
  const [currentSEO, setCurrentSEO] = useState<SEOConfig>({
    title: `${portfolioData.personal.name} - ${portfolioData.personal.title}`,
    description: portfolioData.personal.bio,
    keywords: [
      portfolioData.personal.name,
      portfolioData.personal.title,
      "portfolio",
      "web development",
      "brutalist design",
      "Next.js",
      "React",
      "TypeScript",
    ],
    ...initialSEO,
  });

  const updateSEO = (config: Partial<SEOConfig>) => {
    setCurrentSEO((prev) => ({ ...prev, ...config }));
  };

  const trackPageView = useCallback(
    (page: string) => {
      // Track page views for analytics
      if (typeof window !== "undefined") {
        // Google Analytics 4
        if (window.gtag) {
          window.gtag("config", process.env.NEXT_PUBLIC_GA_ID || "", {
            page_title: currentSEO.title,
            page_location: window.location.href,
          });
        }

        // Custom analytics tracking
        console.log("Page view tracked:", {
          page,
          title: currentSEO.title,
          timestamp: new Date().toISOString(),
        });
      }
    },
    [currentSEO.title]
  );

  const trackEvent = useCallback(
    (event: string, data: Record<string, any> = {}) => {
      // Track custom events for analytics
      if (typeof window !== "undefined") {
        // Google Analytics 4
        if (window.gtag) {
          window.gtag("event", event, {
            ...data,
            page_title: currentSEO.title,
            page_location: window.location.href,
          });
        }

        // Custom analytics tracking
        console.log("Event tracked:", {
          event,
          data,
          page: currentSEO.title,
          timestamp: new Date().toISOString(),
        });
      }
    },
    [currentSEO.title]
  );

  // Update document title when SEO changes
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = currentSEO.title;
    }
  }, [currentSEO.title]);

  // Track initial page view
  useEffect(() => {
    trackPageView(window.location.pathname);
  }, [trackPageView]);

  const contextValue: SEOContextType = {
    updateSEO,
    currentSEO,
    trackPageView,
    trackEvent,
  };

  return (
    <SEOContext.Provider value={contextValue}>{children}</SEOContext.Provider>
  );
}

/**
 * Hook to use SEO context
 */
export function useSEO() {
  const context = useContext(SEOContext);
  if (context === undefined) {
    throw new Error("useSEO must be used within a SEOProvider");
  }
  return context;
}

/**
 * Hook to update page SEO
 */
export function usePageSEO(config: Partial<SEOConfig>) {
  const { updateSEO, trackPageView } = useSEO();

  useEffect(() => {
    updateSEO(config);
    if (config.canonicalUrl) {
      trackPageView(config.canonicalUrl);
    }
  }, [config, updateSEO, trackPageView]);
}

/**
 * Component to dynamically update SEO
 */
export function SEOUpdater({ config }: { config: Partial<SEOConfig> }) {
  usePageSEO(config);
  return null;
}

// Window interface is extended in analytics/GoogleAnalytics.tsx
