"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { MotionConfig, Transition } from "framer-motion";

// Animation preferences context
interface AnimationPreferences {
  reducedMotion: boolean;
  highPerformance: boolean;
  prefersAnimations: boolean;
}

const AnimationPreferencesContext = createContext<AnimationPreferences>({
  reducedMotion: false,
  highPerformance: false,
  prefersAnimations: true,
});

export const useAnimationPreferences = () => {
  return useContext(AnimationPreferencesContext);
};

// Animation preferences provider
interface AnimationPreferencesProviderProps {
  children: React.ReactNode;
}

export function AnimationPreferencesProvider({
  children,
}: AnimationPreferencesProviderProps) {
  const [preferences, setPreferences] = useState<AnimationPreferences>({
    reducedMotion: false,
    highPerformance: false,
    prefersAnimations: true,
  });

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reducedMotion = mediaQuery.matches;

    // Check for high performance mode (low-end devices)
    const connection = (
      navigator as Navigator & {
        connection?: {
          effectiveType?: string;
          saveData?: boolean;
        };
      }
    ).connection;
    const highPerformance =
      connection?.effectiveType === "slow-2g" ||
      connection?.effectiveType === "2g" ||
      connection?.saveData === true;

    // Check device capabilities
    const prefersAnimations = !reducedMotion && !highPerformance;

    setPreferences({
      reducedMotion,
      highPerformance,
      prefersAnimations,
    });

    // Listen for changes
    const handleChange = () => {
      setPreferences((prev) => ({
        ...prev,
        reducedMotion: mediaQuery.matches,
      }));
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <AnimationPreferencesContext.Provider value={preferences}>
      {children}
    </AnimationPreferencesContext.Provider>
  );
}

// Optimized motion config
interface OptimizedMotionConfigProps {
  children: React.ReactNode;
}

export function OptimizedMotionConfig({
  children,
}: OptimizedMotionConfigProps) {
  const { reducedMotion, highPerformance } = useAnimationPreferences();

  // Reduced motion transitions
  const reducedMotionTransition: Transition = {
    duration: 0.01,
    ease: "linear",
  };

  // High performance transitions (simpler easing)
  const highPerformanceTransition: Transition = {
    type: "tween",
    duration: 0.2,
    ease: "easeOut",
  };

  // Default brutalist transitions
  const defaultTransition: Transition = {
    type: "tween",
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1],
  };

  const getTransition = () => {
    if (reducedMotion) return reducedMotionTransition;
    if (highPerformance) return highPerformanceTransition;
    return defaultTransition;
  };

  return (
    <MotionConfig
      transition={getTransition()}
      reducedMotion={reducedMotion ? "always" : "never"}
    >
      {children}
    </MotionConfig>
  );
}

// Performance-aware animation wrapper
interface PerformanceAnimationProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

export function PerformanceAnimation({
  children,
  fallback,
  className = "",
}: PerformanceAnimationProps) {
  const { prefersAnimations } = useAnimationPreferences();

  if (!prefersAnimations && fallback) {
    return <div className={className}>{fallback}</div>;
  }

  return <div className={className}>{children}</div>;
}

// Intersection observer hook for performance
export function useIntersectionObserver(
  threshold: number = 0.1,
  rootMargin: string = "0px",
  triggerOnce: boolean = true
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const ref = React.useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;

        if (isVisible && (!triggerOnce || !hasTriggered)) {
          setIsIntersecting(true);
          if (triggerOnce) {
            setHasTriggered(true);
          }
        } else if (!triggerOnce) {
          setIsIntersecting(isVisible);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce, hasTriggered]);

  return { ref, isIntersecting };
}

// Debounced animation trigger
export function useDebouncedAnimation(delay: number = 100) {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  const trigger = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setShouldAnimate(true);
    }, delay);
  }, [delay]);

  const reset = React.useCallback(() => {
    setShouldAnimate(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { shouldAnimate, trigger, reset };
}

// Animation performance monitor
export function useAnimationPerformance() {
  const [fps, setFps] = useState(60);
  const [isLowPerformance, setIsLowPerformance] = useState(false);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const measureFPS = (currentTime: number) => {
      frameCount++;

      if (currentTime - lastTime >= 1000) {
        const currentFPS = Math.round(
          (frameCount * 1000) / (currentTime - lastTime)
        );
        setFps(currentFPS);
        setIsLowPerformance(currentFPS < 30);

        frameCount = 0;
        lastTime = currentTime;
      }

      animationId = requestAnimationFrame(measureFPS);
    };

    animationId = requestAnimationFrame(measureFPS);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return { fps, isLowPerformance };
}

// Adaptive animation quality
interface AdaptiveAnimationProps {
  children: React.ReactNode;
  highQuality: React.ReactNode;
  lowQuality: React.ReactNode;
  className?: string;
}

export function AdaptiveAnimation({
  children,
  highQuality,
  lowQuality,
  className = "",
}: AdaptiveAnimationProps) {
  const { isLowPerformance } = useAnimationPerformance();
  const { highPerformance } = useAnimationPreferences();

  const shouldUseLowQuality = isLowPerformance || highPerformance;

  return (
    <div className={className}>
      {shouldUseLowQuality ? lowQuality : highQuality}
      {children}
    </div>
  );
}

// Brutalist animation variants with performance considerations
export const brutalistVariants = {
  // High performance variants
  highPerf: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  },

  // Standard variants
  standard: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },

  // Enhanced variants
  enhanced: {
    hidden: { opacity: 0, y: 50, rotateX: -15 },
    visible: { opacity: 1, y: 0, rotateX: 0 },
    exit: { opacity: 0, y: -50, rotateX: 15 },
  },
};

// Get appropriate variants based on performance
export function useBrutalistVariants(
  performance: "high" | "standard" | "enhanced" = "standard"
) {
  const { highPerformance, reducedMotion } = useAnimationPreferences();

  if (reducedMotion) {
    return brutalistVariants.highPerf;
  }

  if (highPerformance) {
    return brutalistVariants.highPerf;
  }

  const performanceKey = performance === "high" ? "highPerf" : performance;
  return brutalistVariants[performanceKey as keyof typeof brutalistVariants];
}

// Animation timing utilities
export const animationTimings = {
  instant: 0.01,
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  verySlow: 0.8,
};

export const brutalistEasing = {
  sharp: [0.4, 0, 0.2, 1] as [number, number, number, number],
  mechanical: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
  bounce: [0.68, -0.55, 0.265, 1.55] as [number, number, number, number],
  linear: [0, 0, 1, 1] as [number, number, number, number],
};

// Accessibility-aware animation hook
export function useAccessibleAnimation() {
  const { reducedMotion, prefersAnimations } = useAnimationPreferences();

  const getTransition = (
    duration: number = 0.3,
    easing = brutalistEasing.sharp
  ) => {
    if (reducedMotion) {
      return { duration: 0.01, ease: "linear" };
    }

    return {
      type: "tween" as const,
      duration,
      ease: easing,
    };
  };

  const shouldAnimate = prefersAnimations && !reducedMotion;

  return {
    shouldAnimate,
    getTransition,
    reducedMotion,
    prefersAnimations,
  };
}

// Performance monitoring component
interface PerformanceMonitorProps {
  children: React.ReactNode;
  showFPS?: boolean;
}

export function PerformanceMonitor({
  children,
  showFPS = false,
}: PerformanceMonitorProps) {
  const { fps, isLowPerformance } = useAnimationPerformance();

  return (
    <>
      {children}
      {showFPS && process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 left-4 z-50 rounded bg-black/90 px-2 py-1 font-mono text-xs text-white">
          FPS: {fps} {isLowPerformance && "(LOW)"}
        </div>
      )}
    </>
  );
}
