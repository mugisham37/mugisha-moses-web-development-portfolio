import type { Metadata } from "next";
import { Inter, Space_Mono, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/contexts/ThemeContext";
import {
  FloatingContact,
  CookieConsent,
  NotificationSystem,
} from "@/components/layout";
import { ServiceWorkerProvider } from "@/components/providers/ServiceWorkerProvider";
import { PerformanceProvider } from "@/components/providers/PerformanceProvider";
import { SEOProvider, HomepageStructuredData } from "@/components/seo";
import { AnalyticsProvider } from "@/components/analytics";
import { PerformanceMonitor } from "@/components/performance";
import { generateMetadata } from "@/utils/seo-helpers";
import { portfolioData } from "@/data/portfolio";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = generateMetadata({
  title: `${portfolioData.personal.name} - ${portfolioData.personal.title}`,
  description: portfolioData.personal.bio,
  keywords: [
    portfolioData.personal.name,
    portfolioData.personal.title,
    ...portfolioData.skills.technical.map((skill) => skill.name),
    "portfolio",
    "web development",
    "brutalist design",
    "Next.js",
    "React",
    "TypeScript",
  ],
  canonicalUrl: "/",
  ogImage: "/images/og-homepage.jpg",
  twitterImage: "/images/twitter-homepage.jpg",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HomepageStructuredData />
        <AnalyticsProvider />
      </head>
      <body
        className={`${inter.variable} ${spaceMono.variable} ${jetbrainsMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <PerformanceProvider>
          <ServiceWorkerProvider>
            <SEOProvider>
              <ThemeProvider initialTheme="extreme-brutalist">
                <PerformanceMonitor />
                {children}
                <FloatingContact />
                <CookieConsent />
                <NotificationSystem />
              </ThemeProvider>
            </SEOProvider>
          </ServiceWorkerProvider>
        </PerformanceProvider>
      </body>
    </html>
  );
}
