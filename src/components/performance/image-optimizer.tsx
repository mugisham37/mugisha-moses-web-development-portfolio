"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { ImageOptimizer } from "@/lib/performance-optimization";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
  quality?: number;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  sizes?: string;
  fill?: boolean;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Optimized Image Component
 * Provides advanced image optimization with lazy loading, WebP/AVIF support, and performance monitoring
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = "",
  quality = 85,
  placeholder = "blur",
  blurDataURL,
  sizes,
  fill = false,
  style,
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [loadTime, setLoadTime] = useState<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Generate optimized image props
  const optimizedProps = ImageOptimizer.getOptimizedImageProps(
    src,
    alt,
    width,
    height,
    priority
  );

  // Custom blur data URL if not provided
  const finalBlurDataURL = blurDataURL || optimizedProps.blurDataURL;

  // Custom sizes if not provided
  const finalSizes = sizes || optimizedProps.sizes;

  const handleLoad = () => {
    const endTime = Date.now();
    const duration = endTime - startTimeRef.current;
    setLoadTime(duration);
    setIsLoaded(true);

    // Performance monitoring
    if (typeof window !== "undefined" && "performance" in window) {
      performance.mark(`image-loaded-${src}`);
      performance.measure(
        `image-load-time-${src}`,
        `image-start-${src}`,
        `image-loaded-${src}`
      );
    }

    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    console.error(`Failed to load image: ${src}`);
    onError?.();
  };

  useEffect(() => {
    if (typeof window !== "undefined" && "performance" in window) {
      performance.mark(`image-start-${src}`);
    }
  }, [src]);

  // Error fallback component
  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center border-4 border-white bg-gray-800 ${className}`}
        style={{
          width: fill ? "100%" : width,
          height: fill ? "100%" : height,
          ...style,
        }}
      >
        <span className="font-mono text-sm text-white uppercase">
          Image Failed
        </span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={style}>
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={finalBlurDataURL}
        sizes={finalSizes}
        className={`transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          objectFit: "cover",
          objectPosition: "center",
        }}
      />

      {/* Loading indicator */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center border-4 border-white bg-black">
          <div className="animate-pulse">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent" />
          </div>
        </div>
      )}

      {/* Performance indicator (development only) */}
      {process.env.NODE_ENV === "development" && loadTime && (
        <div className="bg-opacity-75 absolute top-2 right-2 bg-black px-2 py-1 font-mono text-xs text-white">
          {loadTime}ms
        </div>
      )}
    </div>
  );
}

/**
 * Progressive Image Component
 * Loads images progressively with multiple quality levels
 */
interface ProgressiveImageProps extends OptimizedImageProps {
  lowQualitySrc?: string;
  mediumQualitySrc?: string;
}

export function ProgressiveImage({
  src,
  lowQualitySrc,
  mediumQualitySrc,
  alt,
  width,
  height,
  className = "",
  ...props
}: ProgressiveImageProps) {
  const [currentSrc, setCurrentSrc] = useState(lowQualitySrc || src);
  const [isHighQualityLoaded, setIsHighQualityLoaded] = useState(false);

  useEffect(() => {
    // Preload medium quality image
    if (mediumQualitySrc) {
      const mediumImg = new window.Image();
      mediumImg.onload = () => {
        setCurrentSrc(mediumQualitySrc);
      };
      mediumImg.src = mediumQualitySrc;
    }

    // Preload high quality image
    const highImg = new window.Image();
    highImg.onload = () => {
      setCurrentSrc(src);
      setIsHighQualityLoaded(true);
    };
    highImg.src = src;
  }, [src, mediumQualitySrc]);

  return (
    <OptimizedImage
      src={currentSrc}
      alt={alt}
      width={width}
      height={height}
      className={`${className} ${
        isHighQualityLoaded ? "filter-none" : "blur-sm filter"
      }`}
      {...props}
    />
  );
}

/**
 * Lazy Image Component
 * Uses Intersection Observer for optimal lazy loading
 */
interface LazyImageProps extends OptimizedImageProps {
  rootMargin?: string;
  threshold?: number;
}

export function LazyImage({
  src,
  alt,
  width,
  height,
  rootMargin = "50px",
  threshold = 0.1,
  className = "",
  ...props
}: LazyImageProps) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Delay loading slightly to improve performance
          setTimeout(() => setShouldLoad(true), 100);
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return (
    <div ref={imgRef} className={`${className}`} style={{ width, height }}>
      {shouldLoad ? (
        <OptimizedImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          {...props}
        />
      ) : (
        <div
          className="flex items-center justify-center border-4 border-gray-700 bg-gray-900"
          style={{ width, height }}
        >
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-600 border-t-transparent" />
        </div>
      )}
    </div>
  );
}

/**
 * Image Gallery Component
 * Optimized for multiple images with lazy loading and preloading
 */
interface ImageGalleryProps {
  images: Array<{
    src: string;
    alt: string;
    width: number;
    height: number;
  }>;
  className?: string;
  itemClassName?: string;
  preloadCount?: number;
}

export function ImageGallery({
  images,
  className = "",
  itemClassName = "",
  preloadCount = 3,
}: ImageGalleryProps) {
  // Preload first few images
  useEffect(() => {
    const preloadImages = async () => {
      const indicesToPreload = Array.from(
        { length: Math.min(preloadCount, images.length) },
        (_, i) => i
      );

      for (const index of indicesToPreload) {
        const img = new window.Image();
        img.src = images[index].src;
      }
    };

    preloadImages();
  }, [images, preloadCount]);

  return (
    <div className={`grid gap-4 ${className}`}>
      {images.map((image, index) => (
        <div key={`${image.src}-${index}`} className={itemClassName}>
          {index < preloadCount ? (
            <OptimizedImage
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              priority={index === 0}
              className="h-auto w-full"
            />
          ) : (
            <LazyImage
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              className="h-auto w-full"
            />
          )}
        </div>
      ))}
    </div>
  );
}
