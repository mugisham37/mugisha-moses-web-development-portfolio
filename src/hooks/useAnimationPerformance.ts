"use client";

import { useEffect, useRef, useCallback } from "react";

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  isLowPerformance: boolean;
}

interface UseAnimationPerformanceOptions {
  threshold?: number; // FPS threshold below which performance is considered low
  sampleSize?: number; // Number of frames to sample for average
  onPerformanceChange?: (metrics: PerformanceMetrics) => void;
}

export const useAnimationPerformance = (
  options: UseAnimationPerformanceOptions = {}
) => {
  const { threshold = 45, sampleSize = 60, onPerformanceChange } = options;

  const frameTimesRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const metricsRef = useRef<PerformanceMetrics>({
    fps: 60,
    frameTime: 16.67,
    isLowPerformance: false,
  });

  const measurePerformance = useCallback(
    (currentTime: number) => {
      if (lastFrameTimeRef.current === 0) {
        lastFrameTimeRef.current = currentTime;
        animationFrameRef.current = requestAnimationFrame(measurePerformance);
        return;
      }

      const frameTime = currentTime - lastFrameTimeRef.current;
      lastFrameTimeRef.current = currentTime;

      // Add frame time to samples
      frameTimesRef.current.push(frameTime);

      // Keep only the most recent samples
      if (frameTimesRef.current.length > sampleSize) {
        frameTimesRef.current.shift();
      }

      // Calculate metrics if we have enough samples
      if (frameTimesRef.current.length >= Math.min(sampleSize, 10)) {
        const avgFrameTime =
          frameTimesRef.current.reduce((sum, time) => sum + time, 0) /
          frameTimesRef.current.length;
        const fps = Math.round(1000 / avgFrameTime);
        const isLowPerformance = fps < threshold;

        const newMetrics: PerformanceMetrics = {
          fps,
          frameTime: avgFrameTime,
          isLowPerformance,
        };

        // Only trigger callback if performance status changed
        if (
          newMetrics.isLowPerformance !== metricsRef.current.isLowPerformance
        ) {
          metricsRef.current = newMetrics;
          onPerformanceChange?.(newMetrics);
        } else {
          metricsRef.current = newMetrics;
        }
      }

      animationFrameRef.current = requestAnimationFrame(measurePerformance);
    },
    [threshold, sampleSize, onPerformanceChange]
  );

  const startMonitoring = useCallback(() => {
    if (animationFrameRef.current) return;

    frameTimesRef.current = [];
    lastFrameTimeRef.current = 0;
    animationFrameRef.current = requestAnimationFrame(measurePerformance);
  }, [measurePerformance]);

  const stopMonitoring = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const getMetrics = useCallback(() => metricsRef.current, []);

  // Auto-start monitoring on mount
  useEffect(() => {
    startMonitoring();
    return stopMonitoring;
  }, [startMonitoring, stopMonitoring]);

  return {
    metrics: metricsRef.current,
    startMonitoring,
    stopMonitoring,
    getMetrics,
  };
};

// Hook for adaptive animation settings based on performance
export const useAdaptiveAnimation = () => {
  const { metrics } = useAnimationPerformance({
    threshold: 45,
    sampleSize: 30,
  });

  const getOptimizedSettings = useCallback(
    (baseSettings: {
      duration?: number;
      stagger?: boolean;
      staggerDelay?: number;
      intensity?: "low" | "medium" | "high";
    }) => {
      if (!metrics.isLowPerformance) {
        return baseSettings;
      }

      // Reduce animation complexity for low performance
      return {
        ...baseSettings,
        duration: Math.min(baseSettings.duration || 600, 300),
        stagger: false, // Disable stagger on low performance
        staggerDelay: Math.max(baseSettings.staggerDelay || 100, 200),
        intensity: "low" as const,
      };
    },
    [metrics.isLowPerformance]
  );

  const shouldReduceMotion = useCallback(() => {
    // Check both performance and user preferences
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    return prefersReducedMotion || metrics.isLowPerformance;
  }, [metrics.isLowPerformance]);

  return {
    metrics,
    getOptimizedSettings,
    shouldReduceMotion,
    isLowPerformance: metrics.isLowPerformance,
  };
};

export default useAnimationPerformance;
