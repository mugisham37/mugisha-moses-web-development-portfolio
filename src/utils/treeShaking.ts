// Tree shaking optimization utilities
// This file helps ensure proper tree shaking by providing optimized imports

import { lazy } from "react";

// Framer Motion - Import only what we need
export {
  motion,
  AnimatePresence,
  useAnimation,
  useInView,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionTemplate,
} from "framer-motion";

// Clsx - Optimized class name utility
export { default as clsx } from "clsx";

// React - Only import what we use
export {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useContext,
  createContext,
  forwardRef,
  memo,
  lazy,
  Suspense,
} from "react";

// Next.js - Optimized imports
export { default as Image } from "next/image";
export { default as Link } from "next/link";
export { default as Head } from "next/head";
export { default as dynamic } from "next/dynamic";
export { useRouter, usePathname, useSearchParams } from "next/navigation";

// Custom hooks - Barrel export for tree shaking
export { useTheme } from "@/hooks/useTheme";
export { useScrollProgress } from "@/hooks/useScrollProgress";
export { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
export { useAnimatedCounter } from "@/hooks/useAnimatedCounter";
// export { useParallax } from "@/hooks/useParallax"; // Hook not implemented yet
export { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";

// UI Components - Optimized exports (using named exports)
export { BrutalButton } from "@/components/ui/BrutalButton/BrutalButton";
export { BrutalCard } from "@/components/ui/BrutalCard/BrutalCard";
export { BrutalInput } from "@/components/ui/BrutalInput/BrutalInput";
export { Modal } from "@/components/ui/Modal/Modal";

// Effects - Lazy loaded exports
export const ParticleSystem = lazy(
  () => import("@/components/effects/ParticleSystem")
);
export const GridBackground = lazy(
  () => import("@/components/effects/GridBackground")
);
export const GlitchEffect = lazy(
  () => import("@/components/effects/GlitchEffect")
);
export const CursorTrail = lazy(
  () => import("@/components/effects/CursorTrail")
);

// Utilities - Tree-shakeable exports (commented out until implemented)
// export { default as themeDetector } from "@/utils/theme-detector";
// export { default as animationHelpers } from "@/utils/animation-helpers";
// export { default as performanceUtils } from "@/utils/performance-utils";
// export { default as seoHelpers } from "@/utils/seo-helpers";

// Types - Re-export for consistency
export type { ThemeType, ThemeConfig } from "@/types/theme";
export type { BaseComponentProps } from "@/types/components";
// export type { PerformanceMetrics } from "@/types/performance"; // Not implemented yet

// Constants - Tree-shakeable constants
export const THEME_TRANSITION_DURATION = 600;
export const SCROLL_THRESHOLD = 0.4;
export const ANIMATION_EASING = "cubic-bezier(0.4, 0, 0.2, 1)";
export const PERFORMANCE_BUDGET = {
  FCP: 1500,
  LCP: 2500,
  FID: 100,
  CLS: 0.1,
};

// Bundle size optimization helpers
export const optimizeBundle = {
  // Lazy load heavy components
  lazyLoad: <T extends React.ComponentType<any>>(
    importFn: () => Promise<{ default: T }>
  ) => {
    return lazy(importFn);
  },

  // Preload critical resources
  preloadResource: (href: string, as: string) => {
    if (typeof window !== "undefined") {
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = href;
      link.as = as;
      document.head.appendChild(link);
    }
  },

  // Prefetch non-critical resources
  prefetchResource: (href: string) => {
    if (typeof window !== "undefined") {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = href;
      document.head.appendChild(link);
    }
  },

  // Dynamic import with error handling
  dynamicImport: async <T>(
    importFn: () => Promise<T>,
    fallback?: T
  ): Promise<T> => {
    try {
      return await importFn();
    } catch (error) {
      console.error("Dynamic import failed:", error);
      if (fallback) {
        return fallback;
      }
      throw error;
    }
  },
};

// Performance monitoring for tree shaking effectiveness
export const bundleAnalytics = {
  // Track bundle loading performance
  trackBundleLoad: (bundleName: string, startTime: number) => {
    const endTime = performance.now();
    const loadTime = endTime - startTime;

    console.log(`[Bundle] ${bundleName} loaded in ${loadTime.toFixed(2)}ms`);

    // Send to analytics if available
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "bundle_load", {
        bundle_name: bundleName,
        load_time: loadTime,
      });
    }
  },

  // Monitor unused code
  detectUnusedCode: () => {
    if (typeof window !== "undefined" && "coverage" in window) {
      // Use Chrome DevTools Coverage API if available
      console.log("[Bundle] Code coverage analysis available in DevTools");
    }
  },

  // Bundle size reporting
  reportBundleSize: (bundleName: string, size: number) => {
    console.log(`[Bundle] ${bundleName} size: ${(size / 1024).toFixed(2)}KB`);

    // Warn if bundle exceeds recommended size
    const maxSizes = {
      framework: 50 * 1024, // 50KB
      vendor: 100 * 1024, // 100KB
      main: 30 * 1024, // 30KB
    };

    const maxSize = maxSizes[bundleName as keyof typeof maxSizes];
    if (maxSize && size > maxSize) {
      console.warn(
        `[Bundle] ${bundleName} exceeds recommended size of ${(maxSize / 1024).toFixed(2)}KB`
      );
    }
  },
};

// Export configuration object
const treeShakingConfig = {
  optimizeBundle,
  bundleAnalytics,
  THEME_TRANSITION_DURATION,
  SCROLL_THRESHOLD,
  ANIMATION_EASING,
  PERFORMANCE_BUDGET,
};

export default treeShakingConfig;
