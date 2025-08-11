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
import {
  generatePersonJsonLd,
  generateWebsiteJsonLd,
  generateOrganizationJsonLd,
} from "@/lib/seo";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

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
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Blog RSS Feed"
          href="/blog/rss.xml"
        />
      </head>
      <body className="antialiased">
        <StructuredData data={globalStructuredData} />
        <CriticalErrorBoundary context={{ location: "root-layout" }}>
          <AnalyticsProvider>
            <MainLayout>{children}</MainLayout>
          </AnalyticsProvider>
        </CriticalErrorBoundary>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
