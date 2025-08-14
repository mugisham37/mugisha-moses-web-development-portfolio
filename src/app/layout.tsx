import type { Metadata } from "next";
import { Space_Mono, Inter } from "next/font/google";
import "./globals.css";
import { SITE_CONFIG } from "@/lib/constants";
import { MainLayout } from "@/components/layout/main-layout";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AnalyticsProvider } from "@/components/analytics/analytics-provider";
import { StructuredData } from "@/components/seo/structured-data";
import { CriticalErrorBoundary } from "@/components/error/app-error-boundary";
import { AnimationProvider } from "@/components/animations/animation-provider";
import {
  CriticalCSS,
  FontPreloader,
  ResourceHints,
} from "@/components/performance/critical-css";
import {
  generatePersonJsonLd,
  generateWebsiteJsonLd,
  generateOrganizationJsonLd,
} from "@/lib/seo";

// Enhanced font loading with optimized preloading and fallbacks
const spaceMono = Space_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
  preload: true,
  fallback: [
    "Space Mono Fallback",
    "Courier New",
    "Consolas",
    "Monaco",
    "monospace",
  ],
  adjustFontFallback: true,
  declarations: [
    {
      prop: "font-feature-settings",
      value: '"kern" 1, "liga" 0, "calt" 0',
    },
    {
      prop: "font-variant-numeric",
      value: "tabular-nums",
    },
  ],
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  fallback: [
    "Inter Fallback",
    "Helvetica Neue",
    "Arial",
    "system-ui",
    "sans-serif",
  ],
  adjustFontFallback: true,
  declarations: [
    {
      prop: "font-feature-settings",
      value:
        '"kern" 1, "liga" 1, "calt" 1, "pnum" 1, "tnum" 0, "onum" 1, "lnum" 0',
    },
    {
      prop: "font-variant-numeric",
      value: "oldstyle-nums proportional-nums",
    },
  ],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    "developer",
    "portfolio",
    "brutalist",
    "next.js",
    "typescript",
    "react",
    "web development",
    "full-stack",
  ],
  authors: [
    {
      name: SITE_CONFIG.author.name,
      url: SITE_CONFIG.url,
    },
  ],
  creator: SITE_CONFIG.author.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_CONFIG.url,
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    creator: "@username", // Update with actual Twitter handle
  },
  icons: {
    icon: "/favicon.ico",
  },
  metadataBase: new URL(SITE_CONFIG.url),

  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": SITE_CONFIG.name,
    "format-detection": "telephone=no",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const globalStructuredData = [
    generatePersonJsonLd(),
    generateWebsiteJsonLd(),
    generateOrganizationJsonLd(),
  ];

  return (
    <html lang="en" className={`${spaceMono.variable} ${inter.variable}`}>
      <head>
        <CriticalCSS />
        <FontPreloader />
        <ResourceHints />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Blog RSS Feed"
          href="/blog/rss.xml"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className="antialiased">
        <StructuredData data={globalStructuredData} />
        <CriticalErrorBoundary context={{ location: "root-layout" }}>
          <AnimationProvider>
            <AnalyticsProvider>
              <MainLayout>{children}</MainLayout>
            </AnalyticsProvider>
          </AnimationProvider>
        </CriticalErrorBoundary>
        <Analytics />
        <SpeedInsights />

        {/* Enhanced font loading optimization script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Add fonts-loading class initially
                document.documentElement.classList.add('fonts-loading');
                
                // Enhanced font loading detection
                if (document.fonts && document.fonts.ready) {
                  // Check for specific fonts
                  const spaceMono = new FontFace('Space Mono', 'url()');
                  const inter = new FontFace('Inter', 'url()');
                  
                  // Wait for critical fonts to load
                  Promise.all([
                    document.fonts.load('700 16px "Space Mono"'),
                    document.fonts.load('400 16px "Inter"'),
                    document.fonts.ready
                  ]).then(function() {
                    document.documentElement.classList.add('fonts-loaded');
                    document.documentElement.classList.remove('fonts-loading');
                    
                    // Trigger reflow for better font rendering
                    document.body.style.fontFamily = document.body.style.fontFamily;
                  }).catch(function() {
                    // Fallback if font loading fails
                    setTimeout(function() {
                      document.documentElement.classList.add('fonts-loaded');
                      document.documentElement.classList.remove('fonts-loading');
                    }, 2000);
                  });
                } else {
                  // Fallback for browsers without font loading API
                  setTimeout(function() {
                    document.documentElement.classList.add('fonts-loaded');
                    document.documentElement.classList.remove('fonts-loading');
                  }, 3000);
                }
                
                // Performance optimization: preload critical font variants
                const preloadFonts = [
                  { family: 'Space Mono', weight: '700', style: 'normal' },
                  { family: 'Inter', weight: '400', style: 'normal' },
                  { family: 'Inter', weight: '600', style: 'normal' },
                ];
                
                preloadFonts.forEach(function(font) {
                  if (document.fonts && document.fonts.load) {
                    document.fonts.load(font.weight + ' 16px "' + font.family + '"');
                  }
                });
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
