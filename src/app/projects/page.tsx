import type { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Projects - Mugisha Moses | Full-Stack Developer",
  description:
    "Browse my portfolio of projects including web applications, mobile apps, and development resources.",
};
import { Navigation } from "@/components/sections/Navigation";
import { Resources } from "@/components/pages";
import { FooterBottomOnly } from "@/components/sections/Footer";
import { ThemeDetector } from "@/components/theme/ThemeDetector";
import { PageLoader } from "@/components/ui/PageLoader";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

export default function ProjectsPage() {
  return (
    <ErrorBoundary>
      <ThemeDetector>
        <Navigation />
        <main className="min-h-screen bg-current text-current">
          <div className="pt-20">
            <Suspense fallback={<PageLoader message="Loading Projects..." />}>
              <Resources />
            </Suspense>
          </div>
        </main>
        <FooterBottomOnly />
      </ThemeDetector>
    </ErrorBoundary>
  );
}
