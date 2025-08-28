import type { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Experience - Mugisha Moses | Full-Stack Developer",
  description:
    "Explore my professional journey and experience as a full-stack developer specializing in React, Node.js, and modern web technologies.",
};
import { Navigation } from "@/components/sections/Navigation";
import { Experience } from "@/components/sections/Experience";
import { FooterBottomOnly } from "@/components/sections/Footer";
import { ThemeDetector } from "@/components/theme/ThemeDetector";
import { PageLoader } from "@/components/ui/PageLoader";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

export default function ExperiencePage() {
  return (
    <ErrorBoundary>
      <ThemeDetector>
        <Navigation />
        <main className="min-h-screen bg-current text-current">
          <div className="pt-20">
            <Suspense fallback={<PageLoader message="Loading Experience..." />}>
              <Experience />
            </Suspense>
          </div>
        </main>
        <FooterBottomOnly />
      </ThemeDetector>
    </ErrorBoundary>
  );
}
