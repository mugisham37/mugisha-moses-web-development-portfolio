"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface ScrollPosition {
  x: number;
  y: number;
}

interface ScrollRestorationOptions {
  enabled?: boolean;
  storageKey?: string;
  restoreDelay?: number;
  saveThrottle?: number;
}

const defaultOptions: Required<ScrollRestorationOptions> = {
  enabled: true,
  storageKey: "scroll-positions",
  restoreDelay: 100,
  saveThrottle: 100,
};

export function useScrollRestoration(options: ScrollRestorationOptions = {}) {
  const config = { ...defaultOptions, ...options };
  const pathname = usePathname();
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isRestoringRef = useRef(false);

  // Save scroll position
  const saveScrollPosition = (path: string, position: ScrollPosition) => {
    if (!config.enabled || typeof window === "undefined") return;

    try {
      const stored = sessionStorage.getItem(config.storageKey);
      const positions = stored ? JSON.parse(stored) : {};
      positions[path] = position;
      sessionStorage.setItem(config.storageKey, JSON.stringify(positions));
    } catch (error) {
      console.warn("Failed to save scroll position:", error);
    }
  };

  // Get saved scroll position
  const getSavedScrollPosition = (path: string): ScrollPosition | null => {
    if (!config.enabled || typeof window === "undefined") return null;

    try {
      const stored = sessionStorage.getItem(config.storageKey);
      if (!stored) return null;

      const positions = JSON.parse(stored);
      return positions[path] || null;
    } catch (error) {
      console.warn("Failed to get saved scroll position:", error);
      return null;
    }
  };

  // Restore scroll position
  const restoreScrollPosition = (path: string) => {
    if (!config.enabled) return;

    const savedPosition = getSavedScrollPosition(path);
    if (!savedPosition) return;

    isRestoringRef.current = true;

    setTimeout(() => {
      window.scrollTo({
        left: savedPosition.x,
        top: savedPosition.y,
        behavior: "auto", // Use auto for restoration to avoid animation
      });

      // Reset restoration flag after a short delay
      setTimeout(() => {
        isRestoringRef.current = false;
      }, 100);
    }, config.restoreDelay);
  };

  // Throttled scroll handler
  const handleScroll = () => {
    if (!config.enabled || isRestoringRef.current) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      const position: ScrollPosition = {
        x: window.scrollX,
        y: window.scrollY,
      };
      saveScrollPosition(pathname, position);
    }, config.saveThrottle);
  };

  // Handle page visibility change
  const handleVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      // Save immediately when page becomes hidden
      const position: ScrollPosition = {
        x: window.scrollX,
        y: window.scrollY,
      };
      saveScrollPosition(pathname, position);
    }
  };

  // Handle beforeunload
  const handleBeforeUnload = () => {
    const position: ScrollPosition = {
      x: window.scrollX,
      y: window.scrollY,
    };
    saveScrollPosition(pathname, position);
  };

  useEffect(() => {
    if (!config.enabled) return;

    // Restore scroll position on mount
    restoreScrollPosition(pathname);

    // Add scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Add visibility change listener
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Add beforeunload listener
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      // Clean up timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Remove listeners
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [pathname, config.enabled]);

  // Manual scroll position management
  const manualSave = (path?: string) => {
    const targetPath = path || pathname;
    const position: ScrollPosition = {
      x: window.scrollX,
      y: window.scrollY,
    };
    saveScrollPosition(targetPath, position);
  };

  const manualRestore = (path?: string) => {
    const targetPath = path || pathname;
    restoreScrollPosition(targetPath);
  };

  const clearSavedPosition = (path?: string) => {
    if (!config.enabled || typeof window === "undefined") return;

    try {
      const targetPath = path || pathname;
      const stored = sessionStorage.getItem(config.storageKey);
      if (!stored) return;

      const positions = JSON.parse(stored);
      delete positions[targetPath];
      sessionStorage.setItem(config.storageKey, JSON.stringify(positions));
    } catch (error) {
      console.warn("Failed to clear saved scroll position:", error);
    }
  };

  const clearAllPositions = () => {
    if (!config.enabled || typeof window === "undefined") return;

    try {
      sessionStorage.removeItem(config.storageKey);
    } catch (error) {
      console.warn("Failed to clear all scroll positions:", error);
    }
  };

  return {
    manualSave,
    manualRestore,
    clearSavedPosition,
    clearAllPositions,
    getSavedScrollPosition: () => getSavedScrollPosition(pathname),
  };
}
