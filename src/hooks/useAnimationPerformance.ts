"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage?: number;
  isLowPerformance: boolean;
}

interface AdaptiveAnimationConfig {
  enablePerformanceMonitoring: boolean;
  fpsThreshold: number;
  memoryThreshold?: number;
  adaptiveQuality: boolean;
  fallbackMode: "reduce" | "disable" | "simplify";
}

interface AdaptiveAnimationState {
  shouldReduceAnimations: boolean;
  qualityLevel: "high" | "medium" | "low" | "disabled";
  performanceMetrics: PerformanceMetrics;
  isMonitoring: boolean;
}

const DEFAULT_CONFIG: AdaptiveAnimationConfig = {
  enablePerformanceMonitoring: true,
  fpsThreshold: 30,
  memoryThreshold: 100, // MB
  adaptiveQuality: true,
  fallbackMode: "reduce",
};

/**
 * Hook for monitoring animation performance and adapting quality
 */
export const useAnimationPerformance = (
  config: Partial<AdaptiveAnimationConfig> = {}
) => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  const [state, setState] = useState<AdaptiveAnimationState>({
    shouldReduceAnimations: false,
    qualityLevel: "high",
    performanceMetrics: {
      fps: 60,
      frameTime: 16.67,
      isLowPerformance: false,
    },
    isMonitoring: false,
  });

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const animationFrameRef = useRef<number>();
  const measurementIntervalRef = useRef<NodeJS.Timeout>();

  const measurePerformance = useCallback(() => {
    const now = performance.now();
    const deltaTime = now - lastTimeRef.current;

    frameCountRef.current++;

    // Measure every second
    if (deltaTime >= 1000) {
      const fps = Math.round((frameCountRef.current * 1000) / deltaTime);
      const frameTime = deltaTime / frameCountRef.current;

      // Get memory usage if available
      let memoryUsage: number | undefined;
      if ("memory" in performance) {
        const memory = (performance as any).memory;
        memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024);
      }

      const isLowPerformance =
        fps < finalConfig.fpsThreshold ||
        (memoryUsage !== undefined &&
          finalConfig.memoryThreshold !== undefined &&
          memoryUsage > finalConfig.memoryThreshold) ||
        false;

      const newMetrics: PerformanceMetrics = {
        fps,
        frameTime,
        memoryUsage,
        isLowPerformance,
      };

      // Determine quality level based on performance
      let qualityLevel: AdaptiveAnimationState["qualityLevel"] = "high";
      let shouldReduceAnimations = false;

      if (finalConfig.adaptiveQuality && isLowPerformance) {
        if (fps < 15) {
          qualityLevel =
            finalConfig.fallbackMode === "disable" ? "disabled" : "low";
          shouldReduceAnimations = true;
        } else if (fps < 25) {
          qualityLevel = "low";
          shouldReduceAnimations = finalConfig.fallbackMode === "reduce";
        } else if (fps < finalConfig.fpsThreshold) {
          qualityLevel = "medium";
          shouldReduceAnimations = finalConfig.fallbackMode === "reduce";
        }
      }

      setState((prev) => ({
        ...prev,
        performanceMetrics: newMetrics,
        shouldReduceAnimations,
        qualityLevel,
      }));

      // Reset counters
      frameCountRef.current = 0;
      lastTimeRef.current = now;
    }

    if (state.isMonitoring) {
      animationFrameRef.current = requestAnimationFrame(measurePerformance);
    }
  }, [
    finalConfig.fpsThreshold,
    finalConfig.memoryThreshold,
    finalConfig.adaptiveQuality,
    finalConfig.fallbackMode,
    state.isMonitoring,
  ]);

  const startMonitoring = useCallback(() => {
    if (!finalConfig.enablePerformanceMonitoring) return;

    setState((prev) => ({ ...prev, isMonitoring: true }));
    lastTimeRef.current = performance.now();
    frameCountRef.current = 0;
    measurePerformance();
  }, [finalConfig.enablePerformanceMonitoring, measurePerformance]);

  const stopMonitoring = useCallback(() => {
    setState((prev) => ({ ...prev, isMonitoring: false }));

    const currentFrame = animationFrameRef.current;
    const currentInterval = measurementIntervalRef.current;

    if (currentFrame) {
      cancelAnimationFrame(currentFrame);
    }
    if (currentInterval) {
      clearInterval(currentInterval);
    }
  }, []);

  // Auto-start monitoring when component mounts
  useEffect(() => {
    if (finalConfig.enablePerformanceMonitoring) {
      startMonitoring();
    }

    return () => {
      stopMonitoring();
    };
  }, [
    finalConfig.enablePerformanceMonitoring,
    startMonitoring,
    stopMonitoring,
  ]);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setState((prev) => ({
          ...prev,
          shouldReduceAnimations: true,
          qualityLevel: "low",
        }));
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    // Initial check
    if (mediaQuery.matches) {
      setState((prev) => ({
        ...prev,
        shouldReduceAnimations: true,
        qualityLevel: "low",
      }));
    }

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return {
    ...state,
    startMonitoring,
    stopMonitoring,
    config: finalConfig,
  };
};

/**
 * Hook for adaptive animation settings based on performance
 */
export const useAdaptiveAnimation = (
  config?: Partial<AdaptiveAnimationConfig>
) => {
  const performance = useAnimationPerformance(config);

  const getAnimationConfig = useCallback(
    (
      baseConfig: {
        duration?: number;
        iterations?: number;
        complexity?: "low" | "medium" | "high";
      } = {}
    ) => {
      const { qualityLevel, shouldReduceAnimations } = performance;

      if (qualityLevel === "disabled") {
        return {
          duration: 0,
          iterations: 1,
          enabled: false,
        };
      }

      let durationMultiplier = 1;
      let iterationsMultiplier = 1;
      let enabled = true;

      if (shouldReduceAnimations) {
        switch (qualityLevel) {
          case "low":
            durationMultiplier = 0.5;
            iterationsMultiplier = 0.5;
            break;
          case "medium":
            durationMultiplier = 0.75;
            iterationsMultiplier = 0.75;
            break;
          default:
            break;
        }
      }

      // Further reduce based on complexity
      if (baseConfig.complexity === "high" && qualityLevel !== "high") {
        durationMultiplier *= 0.7;
        if (qualityLevel === "low") {
          enabled = false;
        }
      }

      return {
        duration: Math.max(
          (baseConfig.duration || 300) * durationMultiplier,
          100
        ),
        iterations: Math.max(
          Math.round((baseConfig.iterations || 1) * iterationsMultiplier),
          1
        ),
        enabled,
        qualityLevel,
      };
    },
    [performance]
  );

  const shouldUseAnimation = useCallback(
    (complexity: "low" | "medium" | "high" = "medium") => {
      const { qualityLevel, shouldReduceAnimations } = performance;

      if (qualityLevel === "disabled") return false;
      if (complexity === "high" && qualityLevel === "low") return false;
      if (complexity === "high" && shouldReduceAnimations) return false;

      return true;
    },
    [performance]
  );

  const getOptimizedSettings = useCallback(
    (
      baseConfig: {
        duration?: number;
        stagger?: boolean;
        staggerDelay?: number;
      } = {}
    ) => {
      const animConfig = getAnimationConfig({
        duration: baseConfig.duration,
        complexity: "medium",
      });

      return {
        duration: animConfig.enabled
          ? animConfig.duration
          : baseConfig.duration,
        stagger: baseConfig.stagger && animConfig.enabled,
        staggerDelay: animConfig.enabled ? baseConfig.staggerDelay : 0,
        enabled: animConfig.enabled,
      };
    },
    [getAnimationConfig]
  );

  const shouldReduceMotion = useCallback(() => {
    return (
      performance.shouldReduceAnimations ||
      performance.qualityLevel === "disabled"
    );
  }, [performance.shouldReduceAnimations, performance.qualityLevel]);

  return {
    ...performance,
    getAnimationConfig,
    shouldUseAnimation,
    getOptimizedSettings,
    shouldReduceMotion,
  };
};

/**
 * Hook for performance-aware CSS animations
 */
export const usePerformanceAwareCSS = (
  config?: Partial<AdaptiveAnimationConfig>
) => {
  const { qualityLevel, shouldReduceAnimations } = useAdaptiveAnimation(config);

  const getCSSProperties = useCallback(
    (baseProperties: React.CSSProperties = {}) => {
      const properties: React.CSSProperties = { ...baseProperties };

      if (qualityLevel === "disabled") {
        // Remove all animations
        properties.animation = "none";
        properties.transition = "none";
        return properties;
      }

      if (shouldReduceAnimations) {
        // Reduce animation duration and complexity
        if (properties.animationDuration) {
          const duration = parseFloat(properties.animationDuration.toString());
          properties.animationDuration = `${Math.max(duration * 0.5, 0.1)}s`;
        }

        if (properties.transitionDuration) {
          const duration = parseFloat(properties.transitionDuration.toString());
          properties.transitionDuration = `${Math.max(duration * 0.5, 0.1)}s`;
        }

        // Simplify transform properties for better performance
        if (qualityLevel === "low") {
          properties.willChange = "transform";
          properties.backfaceVisibility = "hidden";
          properties.perspective = "1000px";
        }
      }

      return properties;
    },
    [qualityLevel, shouldReduceAnimations]
  );

  return {
    qualityLevel,
    shouldReduceAnimations,
    getCSSProperties,
  };
};

export default useAnimationPerformance;
