"use client";

import React, { useEffect } from "react";
import { MainHeader } from "./header";
import { MainFooter } from "./footer";
import { ScrollProgress } from "./scroll-progress";
import { SkipNav } from "./skip-nav";
import { MobileNavigation } from "@/components/mobile/mobile-navigation";
import {
  AnimationPreferencesProvider,
  OptimizedMotionConfig,
  PerformanceMonitor,
} from "@/components/animations/animation-utils";
import { PageTransition } from "@/components/animations/page-transitions";
import { OfflineNotification } from "@/components/error/offline-notification";
import { initializeOfflineSupport } from "@/lib/offline-detection";
import { handleMobileScroll, getMobileClasses } from "@/lib/mobile-utils";
import { useMobile } from "@/hooks/use-mobile";

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
  const mobile = useMobile();

  useEffect(() => {
    // Initialize offline support and service worker
    initializeOfflineSupport();

    // Initialize mobile-specific optimizations
    handleMobileScroll({
      preventBounce: true,
      preventOverscroll: true,
    });

    // Add mobile classes to document
    const mobileClasses = getMobileClasses();
    if (mobileClasses) {
      document.documentElement.className += ` ${mobileClasses}`;
    }

    return () => {
      // Cleanup mobile classes
      const classesToRemove = [
        "is-mobile",
        "is-touch",
        "is-portrait",
        "is-mobile",
        "is-tablet",
        "is-desktop",
      ];
      classesToRemove.forEach((cls) => {
        document.documentElement.classList.remove(cls);
      });
    };
  }, []);

  return (
    <AnimationPreferencesProvider>
      <OptimizedMotionConfig>
        <PerformanceMonitor showFPS={process.env.NODE_ENV === "development"}>
          <div
            className={`mobile-scroll safe-area-inset min-h-screen bg-black text-white ${className}`}
          >
            {/* Skip Navigation */}
            <SkipNav />

            {/* Scroll Progress */}
            {showScrollProgress && <ScrollProgress />}

            {/* Desktop Header */}
            {showHeader && <MainHeader />}

            {/* Mobile Navigation */}
            <MobileNavigation />

            {/* Main Content with Page Transitions */}
            <main
              id="main-content"
              className="flex-1"
              role="main"
              style={{
                paddingTop: mobile.isMobile
                  ? "env(safe-area-inset-top)"
                  : undefined,
                paddingBottom: mobile.isMobile
                  ? "env(safe-area-inset-bottom)"
                  : undefined,
              }}
            >
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
