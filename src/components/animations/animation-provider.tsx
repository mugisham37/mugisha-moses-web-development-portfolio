"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";
import {
  animationManager,
  shouldReduceMotion,
  getDevicePerformanceLevel,
  PERFORMANCE_SETTINGS,
  type ANIMATION_DURATIONS,
  type ANIMATION_EASINGS,
} from "@/lib/animation-config";

interface AnimationContextType {
  reducedMotion: boolean;
  performanceLevel: keyof typeof PERFORMANCE_SETTINGS;
  shouldAnimate: (animationId: string) => boolean;
  registerAnimation: (animationId: string) => void;
  unregisterAnimation: (animationId: string) => void;
  getOptimizedDuration: (duration: number) => number;
  getOptimizedEasing: (easing: readonly number[]) => readonly number[];
}

const AnimationContext = createContext<AnimationContextType | undefined>(
  undefined
);

export function useAnimationContext() {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error(
      "useAnimationContext must be used within AnimationProvider"
    );
  }
  return context;
}

interface AnimationProviderProps {
  children: React.ReactNode;
  forceReducedMotion?: boolean;
  performanceOverride?: keyof typeof PERFORMANCE_SETTINGS;
}

export function AnimationProvider({
  children,
  forceReducedMotion,
  performanceOverride,
}: AnimationProviderProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [performanceLevel, setPerformanceLevel] =
    useState<keyof typeof PERFORMANCE_SETTINGS>("standard");

  useEffect(() => {
    // Initialize reduced motion preference
    const initialReducedMotion = forceReducedMotion ?? shouldReduceMotion();
    setReducedMotion(initialReducedMotion);

    // Initialize performance level
    const initialPerformanceLevel =
      performanceOverride ?? getDevicePerformanceLevel();
    setPerformanceLevel(initialPerformanceLevel);

    // Listen for reduced motion preference changes
    if (typeof window !== "undefined" && !forceReducedMotion) {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      const handleChange = (e: MediaQueryListEvent) => {
        setReducedMotion(e.matches);
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [forceReducedMotion, performanceOverride]);

  const getOptimizedDuration = (duration: number): number => {
    if (reducedMotion) return 0.01; // Nearly instant for reduced motion

    const settings = PERFORMANCE_SETTINGS[performanceLevel];
    if (settings.reducedComplexity) {
      return Math.min(duration, 0.3); // Cap duration for low-end devices
    }

    return duration;
  };

  const getOptimizedEasing = (easing: readonly number[]): readonly number[] => {
    if (reducedMotion) return [0, 0, 1, 1]; // Linear for reduced motion

    const settings = PERFORMANCE_SETTINGS[performanceLevel];
    if (settings.simplifiedEasings) {
      return [0.25, 0.46, 0.45, 0.94]; // Standard easing for low-end devices
    }

    return easing;
  };

  const contextValue: AnimationContextType = {
    reducedMotion,
    performanceLevel,
    shouldAnimate: animationManager.shouldAnimate.bind(animationManager),
    registerAnimation:
      animationManager.registerAnimation.bind(animationManager),
    unregisterAnimation:
      animationManager.unregisterAnimation.bind(animationManager),
    getOptimizedDuration,
    getOptimizedEasing,
  };

  // Global motion configuration
  const motionConfig = {
    reducedMotion: reducedMotion ? "always" : "never",
    transition: {
      duration: reducedMotion ? 0.01 : 0.6,
      ease: reducedMotion ? [0, 0, 1, 1] : [0.25, 0.46, 0.45, 0.94],
    },
  };

  return (
    <AnimationContext.Provider value={contextValue}>
      <MotionConfig {...motionConfig}>{children}</MotionConfig>
    </AnimationContext.Provider>
  );
}

// HOC for components that need animation optimization
export function withAnimationOptimization<P extends object>(
  Component: React.ComponentType<P>
) {
  return function OptimizedComponent(props: P) {
    const { reducedMotion, performanceLevel } = useAnimationContext();

    // Pass optimization flags to the component
    const optimizedProps = {
      ...props,
      reducedMotion,
      performanceLevel,
    } as P;

    return <Component {...optimizedProps} />;
  };
}

// Hook for managing animation lifecycle
export function useAnimationLifecycle(animationId: string) {
  const { shouldAnimate, registerAnimation, unregisterAnimation } =
    useAnimationContext();
  const [canAnimate, setCanAnimate] = useState(false);

  useEffect(() => {
    const animate = shouldAnimate(animationId);
    setCanAnimate(animate);

    if (animate) {
      registerAnimation(animationId);
    }

    return () => {
      if (animate) {
        unregisterAnimation(animationId);
      }
    };
  }, [animationId, shouldAnimate, registerAnimation, unregisterAnimation]);

  return canAnimate;
}

// Hook for optimized animation values
export function useOptimizedAnimation() {
  const { getOptimizedDuration, getOptimizedEasing, reducedMotion } =
    useAnimationContext();

  const optimizeTransition = (transition: {
    duration?: number;
    ease?: readonly number[];
    [key: string]: any;
  }) => {
    return {
      ...transition,
      duration: transition.duration
        ? getOptimizedDuration(transition.duration)
        : undefined,
      ease: transition.ease ? getOptimizedEasing(transition.ease) : undefined,
    };
  };

  const optimizeVariants = (variants: Record<string, any>) => {
    if (reducedMotion) {
      // Simplify variants for reduced motion
      const simplifiedVariants: Record<string, any> = {};

      Object.keys(variants).forEach((key) => {
        const variant = variants[key];
        if (typeof variant === "object" && variant.transition) {
          simplifiedVariants[key] = {
            ...variant,
            transition: optimizeTransition(variant.transition),
          };
        } else {
          simplifiedVariants[key] = variant;
        }
      });

      return simplifiedVariants;
    }

    return variants;
  };

  return {
    optimizeTransition,
    optimizeVariants,
    reducedMotion,
  };
}

// Performance monitoring component
export function AnimationPerformanceMonitor() {
  const [fps, setFps] = useState(60);
  const [animationCount, setAnimationCount] = useState(0);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const measurePerformance = (currentTime: number) => {
      frameCount++;
      const deltaTime = currentTime - lastTime;

      if (deltaTime >= 1000) {
        const currentFps = Math.round((frameCount * 1000) / deltaTime);
        setFps(currentFps);
        frameCount = 0;
        lastTime = currentTime;
      }

      animationId = requestAnimationFrame(measurePerformance);
    };

    animationId = requestAnimationFrame(measurePerformance);

    return () => cancelAnimationFrame(animationId);
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 rounded bg-black/80 p-2 font-mono text-xs text-white">
      <div>FPS: {fps}</div>
      <div>Animations: {animationCount}</div>
    </div>
  );
}

// Utility component for debugging animations
export function AnimationDebugger({ children }: { children: React.ReactNode }) {
  const { reducedMotion, performanceLevel } = useAnimationContext();

  if (process.env.NODE_ENV !== "development") {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {children}
      <div className="fixed top-4 right-4 z-50 rounded bg-black/80 p-2 font-mono text-xs text-white">
        <div>Reduced Motion: {reducedMotion ? "ON" : "OFF"}</div>
        <div>Performance: {performanceLevel}</div>
      </div>
    </div>
  );
}
