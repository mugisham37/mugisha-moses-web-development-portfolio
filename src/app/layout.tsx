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

export const metadata: Metadata = {
  title: "Brutalist Portfolio - Next.js",
  description: "A sophisticated brutalist portfolio built with Next.js 14",
  keywords: ["portfolio", "brutalist", "nextjs", "typescript", "developer"],
  authors: [{ name: "Portfolio Owner" }],
  robots: "index, follow",
  manifest: "/manifest.json",
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Brutalist Portfolio",
  },
};

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
      <body
        className={`${inter.variable} ${spaceMono.variable} ${jetbrainsMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <PerformanceProvider>
          <ServiceWorkerProvider>
            <ThemeProvider initialTheme="extreme-brutalist">
              {children}
              <FloatingContact />
              <CookieConsent />
              <NotificationSystem />
            </ThemeProvider>
          </ServiceWorkerProvider>
        </PerformanceProvider>
      </body>
    </html>
  );
}
