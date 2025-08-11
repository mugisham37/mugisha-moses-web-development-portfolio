"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProgressiveImageProps {
  src: string;
  alt: string;
  lowQualitySrc?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function ProgressiveImage({
  src,
  alt,
  lowQualitySrc,
  width,
  height,
  fill = false,
  className,
  containerClassName,
  priority = false,
  quality = 85,
  sizes,
  onLoad,
  onError,
}: ProgressiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "50px",
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Generate blur data URL for low quality placeholder
  const generateBlurDataURL = (w: number, h: number) => {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(0, 0, w, h);
    }
    return canvas.toDataURL();
  };

  const blurDataURL = generateBlurDataURL(10, 10);

  return (
    <div
      ref={imgRef}
      className={cn(
        "relative overflow-hidden bg-gray-900",
        fill && "h-full w-full",
        containerClassName
      )}
    >
      {/* Low quality placeholder */}
      {lowQualitySrc && !isLoaded && isInView && (
        <Image
          src={lowQualitySrc}
          alt={alt}
          fill={fill}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          className={cn(
            "absolute inset-0 scale-110 blur-sm filter transition-opacity duration-300",
            isLoaded && "opacity-0",
            className
          )}
          quality={20}
          priority={priority}
        />
      )}

      {/* Main image */}
      {isInView && (
        <Image
          src={src}
          alt={alt}
          fill={fill}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          className={cn(
            "transition-opacity duration-500",
            !isLoaded && "opacity-0",
            isLoaded && "opacity-100",
            className
          )}
          quality={quality}
          priority={priority}
          sizes={sizes}
          placeholder="blur"
          blurDataURL={blurDataURL}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}

      {/* Loading placeholder */}
      {!isInView && !priority && (
        <div className="absolute inset-0 animate-pulse bg-gray-900" />
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="text-center">
            <div className="mb-2 text-2xl">📷</div>
            <p className="font-mono text-sm text-gray-400">FAILED TO LOAD</p>
          </div>
        </div>
      )}
    </div>
  );
}
