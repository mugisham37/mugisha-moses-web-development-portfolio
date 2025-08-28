import type { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Contact - Mugisha Moses | Full-Stack Developer",
  description:
    "Get in touch with Mugisha Moses for your next project. Available for freelance work and full-time opportunities.",
};
import { Navigation } from "@/components/sections/Navigation";
import { Contact } from "@/components/pages";
import { FooterBottomOnly } from "@/components/sections/Footer";
import { ThemeDetector } from "@/components/theme/ThemeDetector";
import { PageLoader } from "@/components/ui/PageLoader";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

export default function ContactPage() {
  return (
    <ErrorBoundary>
      <ThemeDetector>
        <Navigation />
        <main className="min-h-screen bg-current text-current">
          <div className="pt-20">
            <Suspense fallback={<PageLoader message="Loading Contact..." />}>
              <Contact />
            </Suspense>
          </div>
        </main>
        <FooterBottomOnly />
      </ThemeDetector>
    </ErrorBoundary>
  );
}
