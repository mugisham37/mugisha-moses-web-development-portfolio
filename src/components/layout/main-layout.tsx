"use client";

import React, { useEffect } from "react";
import { MainHeader } from "./header";
import { MainFooter } from "./footer";
import { ScrollProgress } from "./scroll-progress";
import { SkipNav } from "./skip-nav";
import {
  AnimationPreferencesProvider,
  OptimizedMotionConfig,
  PerformanceMonitor,
} from "@/components/animations/animation-utils";
import { PageTransition } from "@/components/animations/page-transitions";
import { OfflineNotification } from "@/components/error/offline-notification";
import { initializeOfflineSupport } from "@/lib/offline-detection";

interface MainLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  showScrollProgress?: boolean;
  enablePageTransitions?: boolean;
  className?: string;
}

export function MainLayout({
  children,
  showHeader = true,
  showFooter = true,
  showScrollProgress = true,
  enablePageTransitions = true,
  className = "",
}: MainLayoutProps) {
  useEffect(() => {
    // Initialize offline support and service worker
    initializeOfflineSupport();
  }, []);

  return (
    <AnimationPreferencesProvider>
      <OptimizedMotionConfig>
        <PerformanceMonitor showFPS={process.env.NODE_ENV === "development"}>
          <div className={`min-h-screen bg-black text-white ${className}`}>
            {/* Skip Navigation */}
            <SkipNav />

            {/* Scroll Progress */}
            {showScrollProgress && <ScrollProgress />}

            {/* Header */}
            {showHeader && <MainHeader />}

            {/* Main Content with Page Transitions */}
            <main id="main-content" className="flex-1" role="main">
              {enablePageTransitions ? (
                <PageTransition variant="brutalist">{children}</PageTransition>
              ) : (
                children
              )}
            </main>

            {/* Footer */}
            {showFooter && <MainFooter />}

            {/* Offline Notification */}
            <OfflineNotification />
          </div>
        </PerformanceMonitor>
      </OptimizedMotionConfig>
    </AnimationPreferencesProvider>
  );
}
