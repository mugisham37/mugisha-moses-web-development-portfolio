"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile, useMobile } from "@/hooks/use-mobile";
import { optimizeMobilePerformance } from "@/lib/mobile-utils";

interface MobileLayoutProps {
  children: React.ReactNode;
  className?: string;
  enableSafeArea?: boolean;
  enablePullToRefresh?: boolean;
  enableSwipeNavigation?: boolean;
  onRefresh?: () => Promise<void>;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

/**
 * Enhanced mobile layout wrapper with native-like features
 */
export function MobileLayout({
  children,
  className = "",
  enableSafeArea = true,
  enablePullToRefresh = false,
  enableSwipeNavigation = false,
  onRefresh,
  onSwipeLeft,
  onSwipeRight,
}: MobileLayoutProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
    null
  );
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const layoutRef = useRef<HTMLDivElement>(null);
  const { isMobile, screenSize, orientation, isIOS, isAndroid } = useMobile();

  // Initialize mobile performance optimizations
  useEffect(() => {
    if (isMobile) {
      const {
        enableGPUAcceleration,
        optimizeImages,
        preloadCriticalResources,
        enableServiceWorker,
      } = optimizeMobilePerformance();

      enableGPUAcceleration();
      optimizeImages();
      preloadCriticalResources();
      enableServiceWorker();
    }
  }, [isMobile]);

  // Handle keyboard visibility
  useEffect(() => {
    if (!isMobile) return;

    const handleResize = () => {
      const viewportHeight =
        window.visualViewport?.height || window.innerHeight;
      const windowHeight = window.screen.height;
      const threshold = windowHeight * 0.75;

      setIsKeyboardVisible(viewportHeight < threshold);
    };

    window.visualViewport?.addEventListener("resize", handleResize);
    window.addEventListener("resize", handleResize);

    return () => {
      window.visualViewport?.removeEventListener("resize", handleResize);
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile]);

  // Handle pull to refresh
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!enablePullToRefresh && !enableSwipeNavigation) return;

    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;

    // Pull to refresh (vertical)
    if (enablePullToRefresh && Math.abs(deltaY) > Math.abs(deltaX)) {
      if (deltaY > 0 && window.scrollY === 0) {
        e.preventDefault();
        const distance = Math.min(deltaY * 0.5, 100);
        setPullDistance(distance);
      }
    }

    // Swipe navigation (horizontal)
    if (enableSwipeNavigation && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > 50) {
        setSwipeDirection(deltaX > 0 ? "right" : "left");
      }
    }
  };

  const handleTouchEnd = async () => {
    if (!touchStart) return;

    // Handle pull to refresh
    if (enablePullToRefresh && pullDistance > 60 && onRefresh) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }

    // Handle swipe navigation
    if (enableSwipeNavigation && swipeDirection) {
      if (swipeDirection === "left" && onSwipeLeft) {
        onSwipeLeft();
      } else if (swipeDirection === "right" && onSwipeRight) {
        onSwipeRight();
      }

      // Haptic feedback
      if ("vibrate" in navigator) {
        navigator.vibrate(30);
      }
    }

    setTouchStart(null);
    setSwipeDirection(null);
  };

  // Don't render mobile layout on desktop
  if (!isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={layoutRef}
      className={cn(
        "min-h-screen bg-black text-white",
        "relative overflow-x-hidden",
        enableSafeArea && "safe-area-inset",
        isKeyboardVisible && "keyboard-visible",
        orientation === "landscape" && "landscape-mode",
        isIOS && "ios-device",
        isAndroid && "android-device",
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: `translateY(${pullDistance}px)`,
        transition: pullDistance === 0 ? "transform 0.3s ease-out" : "none",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Pull to Refresh Indicator */}
      <AnimatePresence>
        {enablePullToRefresh && (pullDistance > 0 || isRefreshing) && (
          <motion.div
            className="absolute top-0 right-0 left-0 z-50 flex items-center justify-center bg-black/90 py-4 backdrop-blur-sm"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            style={{
              transform: `translateY(${Math.max(0, pullDistance - 60)}px)`,
            }}
          >
            <div className="flex items-center gap-3">
              {isRefreshing ? (
                <>
                  <motion.div
                    className="h-6 w-6 rounded-full border-2 border-white/20 border-t-yellow-400"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <span className="font-mono text-sm tracking-wider text-white uppercase">
                    Refreshing...
                  </span>
                </>
              ) : (
                <>
                  <motion.div
                    className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white/40"
                    animate={{
                      rotate: pullDistance > 60 ? 180 : 0,
                      borderColor:
                        pullDistance > 60 ? "#FFFF00" : "rgba(255,255,255,0.4)",
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="h-2 w-2 rounded-full bg-current" />
                  </motion.div>
                  <span
                    className={cn(
                      "font-mono text-sm tracking-wider uppercase transition-colors duration-200",
                      pullDistance > 60 ? "text-yellow-400" : "text-white/60"
                    )}
                  >
                    {pullDistance > 60
                      ? "Release to refresh"
                      : "Pull to refresh"}
                  </span>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Swipe Navigation Indicators */}
      <AnimatePresence>
        {enableSwipeNavigation && swipeDirection && (
          <motion.div
            className={cn(
              "fixed top-1/2 z-50 -translate-y-1/2",
              "border-2 border-yellow-400 bg-black/80 backdrop-blur-sm",
              "px-4 py-2 font-mono text-sm tracking-wider text-yellow-400 uppercase",
              swipeDirection === "left" ? "right-4" : "left-4"
            )}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            {swipeDirection === "left" ? "← Swipe Left" : "Swipe Right →"}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div
        className={cn("relative z-10", isKeyboardVisible && "pb-safe-bottom")}
      >
        {children}
      </div>

      {/* Mobile-specific overlays and indicators */}
      <div className="fixed right-4 bottom-4 z-40 space-y-2">
        {/* Connection Status */}
        <motion.div
          className={cn(
            "border border-white/20 bg-black/80 px-3 py-1 backdrop-blur-sm",
            "font-mono text-xs tracking-wider uppercase",
            navigator.onLine ? "text-green-400" : "text-red-400"
          )}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
        >
          {navigator.onLine ? "Online" : "Offline"}
        </motion.div>

        {/* Screen Size Indicator (Development) */}
        {process.env.NODE_ENV === "development" && (
          <motion.div
            className="border border-white/20 bg-black/80 px-3 py-1 font-mono text-xs tracking-wider text-yellow-400 uppercase backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 }}
          >
            {screenSize} • {orientation}
          </motion.div>
        )}
      </div>

      {/* Keyboard Spacer */}
      {isKeyboardVisible && <div className="h-safe-bottom" />}
    </motion.div>
  );
}

/**
 * Mobile-optimized container with responsive padding and safe areas
 */
interface MobileContainerProps {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  padding?: "none" | "sm" | "md" | "lg";
  className?: string;
}

export function MobileContainer({
  children,
  size = "lg",
  padding = "md",
  className = "",
}: MobileContainerProps) {
  const isMobile = useIsMobile();

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-full",
  };

  const paddingClasses = {
    none: "px-0",
    sm: isMobile ? "px-4" : "px-6",
    md: isMobile ? "px-6" : "px-8",
    lg: isMobile ? "px-8" : "px-12",
  };

  return (
    <div
      className={cn(
        "mx-auto w-full",
        sizeClasses[size],
        paddingClasses[padding],
        "safe-area-inset",
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Mobile-optimized section with responsive spacing
 */
interface MobileSectionProps {
  children: React.ReactNode;
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
  background?: "transparent" | "black" | "white" | "accent";
  className?: string;
}

export function MobileSection({
  children,
  spacing = "md",
  background = "transparent",
  className = "",
}: MobileSectionProps) {
  const isMobile = useIsMobile();

  const spacingClasses = {
    none: "py-0",
    sm: isMobile ? "py-8" : "py-12",
    md: isMobile ? "py-12" : "py-16",
    lg: isMobile ? "py-16" : "py-24",
    xl: isMobile ? "py-20" : "py-32",
  };

  const backgroundClasses = {
    transparent: "bg-transparent",
    black: "bg-black text-white",
    white: "bg-white text-black",
    accent: "bg-yellow-400 text-black",
  };

  return (
    <section
      className={cn(
        spacingClasses[spacing],
        backgroundClasses[background],
        "relative",
        className
      )}
    >
      {children}
    </section>
  );
}
