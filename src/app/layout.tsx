import type { Metadata } from "next";
import { Inter, Space_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/theme/ThemeProvider";
import AnalyticsProvider from "@/components/analytics/AnalyticsProvider";
import CookieConsent from "@/components/analytics/CookieConsent";
import PerformanceDashboard from "@/components/analytics/PerformanceDashboard";
import { Suspense } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Brutalist Portfolio - Next.js Developer",
  description:
    "A sophisticated brutalist portfolio showcasing modern web development expertise with dual-theme architecture and advanced animations.",
  keywords:
    "brutalist design, portfolio, next.js, react, web development, typescript",
  authors: [{ name: "Portfolio Developer" }],
  creator: "Portfolio Developer",
  publisher: "Portfolio Developer",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Brutalist Portfolio - Next.js Developer",
    description:
      "A sophisticated brutalist portfolio showcasing modern web development expertise with dual-theme architecture and advanced animations.",
    siteName: "Brutalist Portfolio",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Brutalist Portfolio Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brutalist Portfolio - Next.js Developer",
    description:
      "A sophisticated brutalist portfolio showcasing modern web development expertise with dual-theme architecture and advanced animations.",
    images: ["/images/twitter-card.jpg"],
    creator: "@portfolio_dev",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceMono.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />

        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />

        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />

        {/* Structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Portfolio Developer",
              jobTitle: "Full Stack Developer",
              description:
                "Experienced developer specializing in modern web technologies and brutalist design",
              url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
              sameAs: [
                "https://github.com/portfolio-dev",
                "https://linkedin.com/in/portfolio-dev",
                "https://twitter.com/portfolio_dev",
              ],
              knowsAbout: [
                "Next.js",
                "React",
                "TypeScript",
                "Node.js",
                "Web Performance",
                "Brutalist Design",
              ],
            }),
          }}
        />
      </head>
      <body className="antialiased">
        <AnalyticsProvider
          enablePerformanceMonitoring={true}
          enableErrorTracking={true}
          enableUserSessionTracking={true}
        >
          <ThemeProvider>
            <Suspense
              fallback={<div className="loading-fallback">Loading...</div>}
            >
              {children}
            </Suspense>

            {/* Cookie consent modal */}
            <CookieConsent />

            {/* Performance dashboard (only in development) */}
            {process.env.NODE_ENV === "development" && (
              <PerformanceDashboard isVisible={false} />
            )}
          </ThemeProvider>
        </AnalyticsProvider>

        {/* Service worker registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
