"use client";

import { useState, forwardRef } from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface OptimizedImageProps extends Omit<ImageProps, "alt"> {
  alt: string; // Make alt required for accessibility
  fallbackSrc?: string;
  showLoader?: boolean;
  aspectRatio?: "square" | "video" | "portrait" | "landscape" | "auto";
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  quality?: number;
  priority?: boolean;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  className?: string;
  containerClassName?: string;
  onLoadingComplete?: () => void;
  onError?: () => void;
}

const aspectRatioClasses = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  auto: "",
};

export const OptimizedImage = forwardRef<HTMLDivElement, OptimizedImageProps>(
  (
    {
      src,
      alt,
      fallbackSrc = "/images/placeholder.svg",
      showLoader = true,
      aspectRatio = "auto",
      objectFit = "cover",
      quality = 85,
      priority = false,
      placeholder = "empty",
      blurDataURL,
      className,
      containerClassName,
      onLoadingComplete,
      onError,
      ...props
    },
    ref
  ) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [currentSrc, setCurrentSrc] = useState(src);

    const handleLoadingComplete = () => {
      setIsLoading(false);
      onLoadingComplete?.();
    };

    const handleError = () => {
      setHasError(true);
      setIsLoading(false);
      if (currentSrc !== fallbackSrc) {
        setCurrentSrc(fallbackSrc);
        setHasError(false);
        setIsLoading(true);
      } else {
        onError?.();
      }
    };

    const imageClasses = cn(
      "transition-opacity duration-300",
      objectFit === "cover" && "object-cover",
      objectFit === "contain" && "object-contain",
      objectFit === "fill" && "object-fill",
      objectFit === "none" && "object-none",
      objectFit === "scale-down" && "object-scale-down",
      isLoading && "opacity-0",
      !isLoading && "opacity-100",
      className
    );

    const containerClasses = cn(
      "relative overflow-hidden bg-gray-900",
      aspectRatio !== "auto" && aspectRatioClasses[aspectRatio],
      containerClassName
    );

    return (
      <div ref={ref} className={containerClasses}>
        <Image
          src={currentSrc}
          alt={alt}
          quality={quality}
          priority={priority}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          className={imageClasses}
          onLoad={handleLoadingComplete}
          onError={handleError}
          {...props}
        />

        {/* Loading indicator */}
        {isLoading && showLoader && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        )}

        {/* Error state */}
        {hasError && currentSrc === fallbackSrc && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <div className="mb-2 text-2xl">📷</div>
              <p className="font-mono text-sm text-gray-400">IMAGE NOT FOUND</p>
            </div>
          </div>
        )}
      </div>
    );
  }
);

OptimizedImage.displayName = "OptimizedImage";
