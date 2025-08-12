"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  threshold?: number;
  disabled?: boolean;
  className?: string;
}

/**
 * Pull-to-refresh component with brutalist styling
 * Provides native-like pull-to-refresh functionality for mobile devices
 */
export function PullToRefresh({
  onRefresh,
  children,
  threshold = 80,
  disabled = false,
  className = "",
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [canRefresh, setCanRefresh] = useState(false);
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number>(0);
  const currentY = useRef<number>(0);
  const isDragging = useRef<boolean>(false);

  // Only enable on mobile devices
  const isEnabled = isMobile && !disabled;

  const handleTouchStart = useCallback(
    (event: TouchEvent) => {
      if (!isEnabled || isRefreshing) return;

      // Only trigger if we're at the top of the page
      if (window.scrollY > 0) return;

      startY.current = event.touches[0].clientY;
      isDragging.current = true;
    },
    [isEnabled, isRefreshing]
  );

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      if (!isDragging.current || !isEnabled || isRefreshing) return;

      currentY.current = event.touches[0].clientY;
      const deltaY = currentY.current - startY.current;

      // Only allow pulling down
      if (deltaY > 0 && window.scrollY === 0) {
        event.preventDefault();

        // Apply resistance curve for natural feel
        const resistance = Math.min(deltaY / 2.5, threshold * 1.5);
        setPullDistance(resistance);
        setCanRefresh(resistance >= threshold);
      }
    },
    [isEnabled, isRefreshing, threshold]
  );

  const handleTouchEnd = useCallback(async () => {
    if (!isDragging.current || !isEnabled) return;

    isDragging.current = false;

    if (canRefresh && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error("Refresh failed:", error);
      } finally {
        setIsRefreshing(false);
        setCanRefresh(false);
      }
    }

    setPullDistance(0);
  }, [canRefresh, isRefreshing, onRefresh, isEnabled]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isEnabled) return;

    container.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, isEnabled]);

  // Calculate refresh indicator position and opacity
  const indicatorY = Math.min(pullDistance - 20, threshold);
  const indicatorOpacity = Math.min(pullDistance / threshold, 1);
  const indicatorScale = canRefresh
    ? 1.1
    : Math.min(pullDistance / threshold, 1);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        transform: isEnabled
          ? `translateY(${Math.min(pullDistance * 0.5, 40)}px)`
          : undefined,
        transition: isDragging.current
          ? "none"
          : "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {/* Pull-to-refresh indicator */}
      <AnimatePresence>
        {isEnabled && (pullDistance > 0 || isRefreshing) && (
          <motion.div
            className="absolute left-1/2 z-50 flex items-center justify-center"
            style={{
              top: -60,
              transform: `translateX(-50%) translateY(${indicatorY}px)`,
              opacity: indicatorOpacity,
            }}
            initial={{ scale: 0 }}
            animate={{ scale: indicatorScale }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className={`flex h-12 w-12 items-center justify-center border-4 border-white bg-black ${
                canRefresh ? "border-yellow-400 bg-yellow-400" : ""
              }`}
            >
              <RefreshCw
                className={`h-6 w-6 ${
                  canRefresh ? "text-black" : "text-white"
                } ${isRefreshing ? "animate-spin" : ""}`}
                style={{
                  transform: !isRefreshing
                    ? `rotate(${pullDistance * 2}deg)`
                    : undefined,
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative">{children}</div>

      {/* Loading overlay */}
      <AnimatePresence>
        {isRefreshing && (
          <motion.div
            className="absolute inset-x-0 top-0 z-40 flex items-center justify-center bg-black/80 py-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-3">
              <RefreshCw className="h-5 w-5 animate-spin text-yellow-400" />
              <span className="font-mono text-sm text-white uppercase">
                Refreshing...
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Hook for programmatic refresh control
 */
export function usePullToRefresh() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = useCallback(
    async (refreshFn: () => Promise<void>) => {
      if (isRefreshing) return;

      setIsRefreshing(true);
      try {
        await refreshFn();
      } finally {
        setIsRefreshing(false);
      }
    },
    [isRefreshing]
  );

  return { isRefreshing, refresh };
}
