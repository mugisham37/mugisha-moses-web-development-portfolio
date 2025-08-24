"use client";

import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useLazyLoading } from "@/hooks/useLazyLoading";
import { useImagePerformanceMonitor } from "@/utils/imagePerformanceMonitor";
import {
  generateNextImageProps,
  generateBlurPlaceholder,
} from "@/utils/responsiveImage";
import { useImagePreloader } from "@/utils/imagePreloader";
import type { ThemeType } from "@/types/theme";
import "./OptimizedImage.module.css";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  theme?: ThemeType;
  className?: string;
  sizes?: string;
  quality?: number;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  fill?: boolean;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
  lazy?: boolean;
  responsive?: boolean;
  brutalistEffects?: boolean;
  configName?: "hero" | "card" | "thumbnail" | "portrait" | "logo";
  preload?: boolean;
  retryOnError?: boolean;
  maxRetries?: number;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false,
  theme,
  className = "",
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  quality = 85,
  placeholder = "blur",
  blurDataURL,
  fill = false,
  style,
  onLoad,
  onError,
  lazy = true,
  responsive = true,
  brutalistEffects = true,
  configName,
  preload = false,
  retryOnError = true,
  maxRetries = 3,
}) => {
  const { currentTheme } = useTheme();
  const activeTheme = theme || currentTheme;
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [loadStartTime, setLoadStartTime] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Performance monitoring
  const performanceMonitor = useImagePerformanceMonitor();
  const imagePreloader = useImagePreloader();

  // Lazy loading with intersection observer
  const { isVisible } = useLazyLoading({
    threshold: 0.1,
    rootMargin: "50px",
    triggerOnce: true,
    enabled: lazy && !priority,
  });

  // Should render image
  const shouldRenderImage = !lazy || priority || isVisible;

  // Generate optimized image props
  const optimizedProps =
    width && height && configName
      ? generateNextImageProps(src, width, height, {
          priority,
          quality,
          configName,
          alt,
          className: "",
        })
      : null;

  // Generate blur placeholder
  const defaultBlurDataURL =
    blurDataURL ||
    (width && height
      ? generateBlurPlaceholder(10, Math.round(10 * (height / width)))
      : "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=");

  // Start performance monitoring when component mounts
  useEffect(() => {
    if (shouldRenderImage) {
      const startTime = performance.now();
      setLoadStartTime(startTime);

      performanceMonitor.startMonitoring(src, {
        isLazyLoaded: lazy && !priority,
        isAboveTheFold: priority,
        quality,
        format: src.includes(".webp")
          ? "webp"
          : src.includes(".avif")
            ? "avif"
            : src.includes(".png")
              ? "png"
              : "jpg",
      });
    }
  }, [shouldRenderImage, src, lazy, priority, quality, performanceMonitor]);

  // Preload critical images
  useEffect(() => {
    if ((priority || preload) && !isLoaded) {
      imagePreloader.preloadImage(src, { priority: priority || preload });
    }
  }, [priority, preload, src, isLoaded, imagePreloader]);

  const handleLoad = useCallback(
    (event?: React.SyntheticEvent<HTMLImageElement>) => {
      const loadTime = performance.now() - loadStartTime;
      const img = event?.currentTarget || imageRef.current;

      if (img) {
        // Check if loaded from cache
        const fromCache = loadTime < 50; // Very fast load likely indicates cache hit

        performanceMonitor.recordLoad(src, img, loadTime, fromCache);

        // Record render time after next frame
        requestAnimationFrame(() => {
          const renderTime = performance.now() - loadStartTime;
          performanceMonitor.recordRender(src, renderTime);
        });
      }

      setIsLoaded(true);
      setHasError(false);
      setRetryCount(0);
      onLoad?.();
    },
    [loadStartTime, src, performanceMonitor, onLoad]
  );

  const handleError = useCallback(() => {
    performanceMonitor.recordError(src);

    if (retryOnError && retryCount < maxRetries) {
      // Retry loading after a delay
      setTimeout(
        () => {
          setRetryCount((prev) => prev + 1);
          performanceMonitor.recordImageRetry(src);
          // Force re-render by updating a state
          setHasError(false);
        },
        Math.pow(2, retryCount) * 1000
      ); // Exponential backoff
    } else {
      setHasError(true);
      onError?.();
    }
  }, [src, performanceMonitor, retryOnError, retryCount, maxRetries, onError]);

  // Generate responsive sizes based on breakpoints
  const responsiveSizes = responsive
    ? optimizedProps?.sizes || sizes
    : undefined;

  // Brutalist styling classes
  const containerClasses = [
    "optimized-image-container",
    `optimized-image-container--${activeTheme}`,
    brutalistEffects && "optimized-image-container--brutal",
    isLoaded && "optimized-image-container--loaded",
    hasError && "optimized-image-container--error",
    retryCount > 0 && "optimized-image-container--retrying",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const imageClasses = [
    "optimized-image",
    `optimized-image--${activeTheme}`,
    brutalistEffects && "optimized-image--brutal",
    isLoaded && "optimized-image--loaded",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={containerRef} className={containerClasses} style={style}>
      {/* Loading placeholder */}
      {!isLoaded && !hasError && (
        <div
          className={`optimized-image-placeholder optimized-image-placeholder--${activeTheme}`}
        >
          <div className="optimized-image-placeholder__content">
            <div className="optimized-image-placeholder__spinner" />
            {retryCount > 0 && (
              <div className="optimized-image-placeholder__retry">
                RETRY {retryCount}/{maxRetries}
              </div>
            )}
            {brutalistEffects && (
              <>
                <div className="optimized-image-placeholder__scan-lines" />
                <div className="optimized-image-placeholder__grid" />
              </>
            )}
          </div>
        </div>
      )}

      {/* Error state */}
      {hasError && retryCount >= maxRetries && (
        <div
          className={`optimized-image-error optimized-image-error--${activeTheme}`}
        >
          <div className="optimized-image-error__content">
            <div className="optimized-image-error__icon">⚠</div>
            <div className="optimized-image-error__text">IMAGE LOAD ERROR</div>
            <div className="optimized-image-error__details">
              Failed after {maxRetries} retries
            </div>
            {brutalistEffects && (
              <div className="optimized-image-error__glitch" />
            )}
          </div>
        </div>
      )}

      {/* Actual image - only render when visible */}
      {shouldRenderImage && !hasError && (
        <Image
          ref={imageRef}
          src={optimizedProps?.src || src}
          alt={alt}
          width={fill ? undefined : optimizedProps?.width || width}
          height={fill ? undefined : optimizedProps?.height || height}
          fill={fill}
          priority={priority}
          sizes={responsiveSizes}
          quality={optimizedProps?.quality || quality}
          placeholder={placeholder}
          blurDataURL={
            placeholder === "blur"
              ? optimizedProps?.blurDataURL || defaultBlurDataURL
              : undefined
          }
          className={imageClasses}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            objectFit: fill ? "cover" : undefined,
            objectPosition: fill ? "center" : undefined,
          }}
          // Add retry key to force re-render on retry
          key={`${src}-${retryCount}`}
        />
      )}

      {/* Brutalist effects overlay */}
      {brutalistEffects && isLoaded && (
        <div
          className={`optimized-image-effects optimized-image-effects--${activeTheme}`}
        >
          <div className="optimized-image-effects__border" />
          <div className="optimized-image-effects__shadow" />
          <div className="optimized-image-effects__scan" />
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
