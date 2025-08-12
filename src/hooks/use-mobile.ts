"use client";

import { useState, useEffect } from "react";

interface MobileDetection {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  screenSize: "mobile" | "tablet" | "desktop";
  orientation: "portrait" | "landscape";
  isIOS: boolean;
  isAndroid: boolean;
}

/**
 * Hook to detect mobile devices and screen characteristics
 * Provides comprehensive mobile detection for responsive behavior
 */
export function useMobile(): MobileDetection {
  const [detection, setDetection] = useState<MobileDetection>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isTouchDevice: false,
    screenSize: "desktop",
    orientation: "landscape",
    isIOS: false,
    isAndroid: false,
  });

  useEffect(() => {
    const updateDetection = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const userAgent = navigator.userAgent;

      // Screen size detection
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024;

      // Touch device detection
      const isTouchDevice =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-expect-error - legacy support for IE
        navigator.msMaxTouchPoints > 0;

      // Screen size category
      let screenSize: "mobile" | "tablet" | "desktop" = "desktop";
      if (isMobile) screenSize = "mobile";
      else if (isTablet) screenSize = "tablet";

      // Orientation detection
      const orientation = height > width ? "portrait" : "landscape";

      // Platform detection
      const isIOS = /iPad|iPhone|iPod/.test(userAgent);
      const isAndroid = /Android/.test(userAgent);

      setDetection({
        isMobile,
        isTablet,
        isDesktop,
        isTouchDevice,
        screenSize,
        orientation,
        isIOS,
        isAndroid,
      });
    };

    // Initial detection
    updateDetection();

    // Listen for resize and orientation changes
    window.addEventListener("resize", updateDetection);
    window.addEventListener("orientationchange", updateDetection);

    return () => {
      window.removeEventListener("resize", updateDetection);
      window.removeEventListener("orientationchange", updateDetection);
    };
  }, []);

  return detection;
}

/**
 * Hook to detect if the current device is mobile
 * Simple boolean check for mobile devices
 */
export function useIsMobile(): boolean {
  const { isMobile } = useMobile();
  return isMobile;
}

/**
 * Hook to detect if the current device supports touch
 * Useful for enabling touch-specific interactions
 */
export function useIsTouchDevice(): boolean {
  const { isTouchDevice } = useMobile();
  return isTouchDevice;
}
