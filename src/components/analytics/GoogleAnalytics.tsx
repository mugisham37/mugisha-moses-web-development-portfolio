/**
 * Google Analytics Component
 * Handles Google Analytics 4 integration and tracking
 */

"use client";

import { useEffect } from "react";
import Script from "next/script";
import { seoConfig } from "@/config/seo";

interface GoogleAnalyticsProps {
  measurementId?: string;
}

export function GoogleAnalytics({
  measurementId = seoConfig.analytics.googleAnalyticsId,
}: GoogleAnalyticsProps) {
  useEffect(() => {
    if (!measurementId) {
      console.warn("Google Analytics measurement ID not provided");
      return;
    }

    // Initialize dataLayer and gtag
    window.dataLayer = window.dataLayer || [];

    if (!window.gtag) {
      window.gtag = function (
        command: string,
        targetId: string,
        config?: Record<string, any>
      ) {
        window.dataLayer.push(arguments);
      };
    }

    // Configure Google Analytics
    if (window.gtag) {
      window.gtag("config", measurementId, {
        page_title: document.title,
        page_location: window.location.href,
        send_page_view: true,
      });

      // Track initial page view
      window.gtag("event", "page_view", {
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  }, [measurementId]);

  if (!measurementId) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            page_title: document.title,
            page_location: window.location.href,
          });
        `}
      </Script>
    </>
  );
}

/**
 * Google Tag Manager Component
 */
export function GoogleTagManager({
  containerId = seoConfig.analytics.googleTagManagerId,
}: {
  containerId?: string;
}) {
  if (!containerId) {
    return null;
  }

  return (
    <>
      <Script
        id="google-tag-manager"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${containerId}');
          `,
        }}
      />
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${containerId}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
    </>
  );
}

/**
 * Microsoft Clarity Component
 */
export function MicrosoftClarity({
  clarityId = seoConfig.analytics.microsoftClarityId,
}: {
  clarityId?: string;
}) {
  if (!clarityId) {
    return null;
  }

  return (
    <Script
      id="microsoft-clarity"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${clarityId}");
        `,
      }}
    />
  );
}

/**
 * Analytics Provider Component
 * Combines all analytics services
 */
export function AnalyticsProvider() {
  return (
    <>
      <GoogleAnalytics />
      <GoogleTagManager />
      <MicrosoftClarity />
    </>
  );
}

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: {
      (command: string, targetId: string, config?: Record<string, any>): void;
      q?: any[];
      l?: number;
    };
    dataLayer: any[];
  }
}
