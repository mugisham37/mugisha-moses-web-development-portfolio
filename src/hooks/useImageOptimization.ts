"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useImagePerformanceMonitor } from "@/utils/imagePerformanceMonitor";
import { useImagePreloader } from "@/utils/imagePreloader";
import { useLazyLoading } from "./useLazyLoading";
import {
  getImagePreset,
  getPerformanceBudget,
  getLoadingStrategy,
  isCriticalImage,
  calculateImagePriority,
  imagePresets,
  loadingStrategies,
} from "@/config/imageOptimization";

interface UseImageOptimizationOptions {
  src: string;
  width?: number;
  height?: number;
  preset?: keyof typeof imagePresets;
  strategy?: keyof typeof loadingStrategies;
  isAboveTheFold?: boolean;
  isLargest?: boolean;
  enablePerformanceMonitoring?: boolean;
  enablePreloading?: boolean;
  enableLazyLoading?: boolean;
  retryOnError?: boolean;
  maxRetries?: number;
}

interface UseImageOptimizationReturn {
  // Image properties
  optimizedSrc: string;
  shouldLoad: boolean;
  isLoaded: boolean;
  hasError: boolean;
  isLoading: boolean;

  // Performance metrics
  loadTime: number;
  fileSize?: number;
  cacheHit: boolean;
  retryCount: number;

  // Configuration
  imageProps: {
    src: string;
    loading: "eager" | "lazy";
    fetchPriority: "high" | "low" | "auto";
    sizes?: string;
    quality?: number;
    priority: boolean;
    placeholder: "blur" | "empty";
    blurDataURL?: string;
  };

  // Control functions
  load: () => void;
  retry: () => void;
  preload: () => Promise<void>;

  // Performance data
  performanceReport: {
    meetsPerformanceBudget: boolean;
    recommendations: string[];
    metrics: any;
  };
}

export const useImageOptimization = (
  options: UseImageOptimizationOptions
): UseImageOptimizationReturn => {
  const {
    src,
    width,
    height,
    preset = "standard" as const,
    strategy,
    isAboveTheFold = false,
    isLargest = false,
    enablePerformanceMonitoring = true,
    enablePreloading = true,
    enableLazyLoading = true,
    retryOnError = true,
    maxRetries = 3,
  } = options;

  // State management
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadTime, setLoadTime] = useState(0);
  const [fileSize, setFileSize] = useState<number>();
  const [cacheHit, setCacheHit] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [loadStartTime, setLoadStartTime] = useState(0);

  // Hooks
  const performanceMonitor = useImagePerformanceMonitor();
  const imagePreloader = useImagePreloader();

  // Calculate priority and strategy
  const isCritical = isCriticalImage(src);
  const priority = calculateImagePriority(
    isAboveTheFold,
    isCritical,
    isLargest
  );
  const loadingStrategy = strategy || (priority ? "critical" : "standard");

  // Get configurations
  const imagePreset = getImagePreset(preset);
  const performanceBudget = getPerformanceBudget(preset);
  const strategyConfig = getLoadingStrategy(loadingStrategy);

  // Lazy loading
  const { isVisible, load: triggerLoad } = useLazyLoading({
    threshold: 0.1,
    rootMargin: "50px",
    triggerOnce: true,
    enabled: enableLazyLoading && !priority,
  });

  // Should load determination
  const shouldLoad = useMemo(() => {
    if (!enableLazyLoading || priority) return true;
    return isVisible;
  }, [enableLazyLoading, priority, isVisible]);

  // Optimized image properties
  const imageProps = useMemo(() => {
    const { priority: presetPriority, ...presetWithoutPriority } = imagePreset;
    const baseProps = {
      src,
      loading: strategyConfig.loading,
      fetchPriority: strategyConfig.fetchPriority,
      priority, // Use calculated priority
      ...presetWithoutPriority,
    };

    // Add responsive sizes if width/height provided
    if (width && height) {
      // Generate responsive sizes based on preset
      // This would be enhanced with actual responsive size calculation
    }

    return baseProps;
  }, [src, strategyConfig, priority, imagePreset, width, height]);

  // Performance monitoring setup
  useEffect(() => {
    if (enablePerformanceMonitoring && shouldLoad) {
      const startTime = performance.now();
      setLoadStartTime(startTime);
      setIsLoading(true);

      performanceMonitor.startMonitoring(src, {
        isLazyLoaded: enableLazyLoading && !priority,
        isAboveTheFold,
        quality: imagePreset.quality || 85,
        format: src.includes(".webp")
          ? "webp"
          : src.includes(".avif")
            ? "avif"
            : src.includes(".png")
              ? "png"
              : "jpg",
      });
    }
  }, [
    enablePerformanceMonitoring,
    shouldLoad,
    src,
    performanceMonitor,
    enableLazyLoading,
    priority,
    isAboveTheFold,
    imagePreset.quality,
  ]);

  // Preload function
  const preload = useCallback(async () => {
    try {
      await imagePreloader.preloadImage(src, {
        priority: priority || strategyConfig.preload,
      });
    } catch (error) {
      console.warn("Failed to preload image:", src, error);
    }
  }, [imagePreloader, src, priority, strategyConfig.preload]);

  // Load function
  const load = useCallback(() => {
    if (isLoaded || isLoading) return;

    setIsLoading(true);
    setHasError(false);
    triggerLoad();
  }, [isLoaded, isLoading, triggerLoad]);

  // Preloading setup
  useEffect(() => {
    if (enablePreloading && (priority || strategyConfig.preload)) {
      preload();
    }
  }, [enablePreloading, priority, strategyConfig.preload, preload]);

  // Retry function
  const retry = useCallback(() => {
    if (retryCount >= maxRetries) return;

    setRetryCount((prev) => prev + 1);
    setHasError(false);
    setIsLoading(true);

    if (enablePerformanceMonitoring) {
      performanceMonitor.recordImageRetry(src);
    }

    // Exponential backoff
    const delay = Math.pow(2, retryCount) * 1000;
    setTimeout(() => {
      load();
    }, delay);
  }, [
    retryCount,
    maxRetries,
    enablePerformanceMonitoring,
    performanceMonitor,
    src,
    load,
  ]);

  // Handle load success
  const handleLoadSuccess = useCallback(
    (img: HTMLImageElement) => {
      const endTime = performance.now();
      const totalLoadTime = endTime - loadStartTime;

      setIsLoaded(true);
      setIsLoading(false);
      setLoadTime(totalLoadTime);

      // Determine if cache hit (very fast load)
      const wasCacheHit = totalLoadTime < 50;
      setCacheHit(wasCacheHit);

      // Estimate file size (rough calculation)
      const pixelCount = img.naturalWidth * img.naturalHeight;
      const estimatedSize = pixelCount * 0.5; // Rough estimate
      setFileSize(estimatedSize);

      if (enablePerformanceMonitoring) {
        performanceMonitor.recordLoad(src, img, totalLoadTime, wasCacheHit);

        requestAnimationFrame(() => {
          const renderTime = performance.now() - loadStartTime;
          performanceMonitor.recordRender(src, renderTime);
        });
      }
    },
    [loadStartTime, enablePerformanceMonitoring, performanceMonitor, src]
  );

  // Handle load error
  const handleLoadError = useCallback(() => {
    setIsLoading(false);

    if (enablePerformanceMonitoring) {
      performanceMonitor.recordError(src);
    }

    if (retryOnError && retryCount < maxRetries) {
      retry();
    } else {
      setHasError(true);
    }
  }, [
    enablePerformanceMonitoring,
    performanceMonitor,
    src,
    retryOnError,
    retryCount,
    maxRetries,
    retry,
  ]);

  // Performance report
  const performanceReport = useMemo(() => {
    const metrics = enablePerformanceMonitoring
      ? performanceMonitor.getMetrics(src)
      : null;

    const meetsPerformanceBudget =
      loadTime > 0 ? loadTime <= performanceBudget.maxLoadTime : true;

    const recommendations: string[] = [];

    if (loadTime > performanceBudget.maxLoadTime) {
      recommendations.push(
        `Load time (${loadTime}ms) exceeds budget (${performanceBudget.maxLoadTime}ms)`
      );
    }

    if (fileSize && fileSize > performanceBudget.maxFileSize) {
      recommendations.push(
        `File size (${Math.round(fileSize / 1024)}KB) exceeds budget (${Math.round(performanceBudget.maxFileSize / 1024)}KB)`
      );
    }

    if (!cacheHit && isLoaded) {
      recommendations.push(
        "Consider implementing better caching for this image"
      );
    }

    if (retryCount > 0) {
      recommendations.push(
        `Image required ${retryCount} retries - check server reliability`
      );
    }

    return {
      meetsPerformanceBudget,
      recommendations,
      metrics,
    };
  }, [
    enablePerformanceMonitoring,
    performanceMonitor,
    src,
    loadTime,
    performanceBudget,
    fileSize,
    cacheHit,
    isLoaded,
    retryCount,
  ]);

  return {
    // Image properties
    optimizedSrc: src,
    shouldLoad,
    isLoaded,
    hasError,
    isLoading,

    // Performance metrics
    loadTime,
    fileSize,
    cacheHit,
    retryCount,

    // Configuration
    imageProps,

    // Control functions
    load,
    retry,
    preload,

    // Performance data
    performanceReport,
  };
};
