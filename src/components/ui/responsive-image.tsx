"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ImagePlaceholder } from "./image-placeholder";

interface ResponsiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  aspectRatio?: "square" | "video" | "portrait" | "landscape" | "auto";
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  priority?: boolean;
  quality?: number;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  sizes?: string;
  className?: string;
  containerClassName?: string;
  fallbackSrc?: string;
  showPlaceholder?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

const aspectRatioClasses = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  auto: "",
};

const objectFitClasses = {
  cover: "object-cover",
  contain: "object-contain",
  fill: "object-fill",
  none: "object-none",
  "scale-down": "object-scale-down",
};

// Generate responsive sizes based on breakpoints
const generateSizes = (aspectRatio?: string) => {
  const baseSize = aspectRatio === "portrait" ? "50vw" : "100vw";
  return `(max-width: 640px) ${baseSize}, (max-width: 1024px) 50vw, 33vw`;
};

export function ResponsiveImage({
  src,
  alt,
  width,
  height,
  fill = false,
  aspectRatio = "auto",
  objectFit = "cover",
  priority = false,
  quality = 85,
  placeholder = "empty",
  blurDataURL,
  sizes,
  className,
  containerClassName,
  fallbackSrc,
  showPlaceholder = true,
  onLoad,
  onError,
}: ResponsiveImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);

    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
      setIsLoading(true);
    } else {
      onError?.();
    }
  };

  const containerClasses = cn(
    "relative overflow-hidden",
    aspectRatio !== "auto" && aspectRatioClasses[aspectRatio],
    fill && "w-full h-full",
    containerClassName
  );

  const imageClasses = cn(
    "transition-opacity duration-300",
    objectFitClasses[objectFit],
    isLoading && "opacity-0",
    !isLoading && "opacity-100",
    className
  );

  const imageSizes = sizes || generateSizes(aspectRatio);

  return (
    <div className={containerClasses}>
      <Image
        src={currentSrc}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        className={imageClasses}
        quality={quality}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        sizes={imageSizes}
        onLoad={handleLoad}
        onError={handleError}
      />

      {/* Loading/Error states */}
      {showPlaceholder && (isLoading || hasError) && (
        <div className="absolute inset-0">
          <ImagePlaceholder
            state={hasError ? "error" : "loading"}
            aspectRatio={aspectRatio !== "auto" ? aspectRatio : undefined}
            className="h-full w-full border-0"
          />
        </div>
      )}
    </div>
  );
}

// Preset configurations for common use cases
export const ResponsiveImagePresets = {
  // Hero images - large, high priority
  hero: (props: ResponsiveImageProps) => (
    <ResponsiveImage
      aspectRatio="video"
      priority
      quality={90}
      sizes="100vw"
      {...props}
    />
  ),

  // Thumbnail images - small, optimized
  thumbnail: (props: ResponsiveImageProps) => (
    <ResponsiveImage
      aspectRatio="square"
      quality={75}
      sizes="(max-width: 640px) 25vw, (max-width: 1024px) 20vw, 15vw"
      {...props}
    />
  ),

  // Card images - medium size, balanced quality
  card: (props: ResponsiveImageProps) => (
    <ResponsiveImage
      aspectRatio="video"
      quality={80}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      {...props}
    />
  ),

  // Gallery images - high quality, lazy loaded
  gallery: (props: ResponsiveImageProps) => (
    <ResponsiveImage
      quality={90}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 70vw"
      {...props}
    />
  ),

  // Avatar images - small, circular
  avatar: (props: ResponsiveImageProps) => (
    <ResponsiveImage
      aspectRatio="square"
      objectFit="cover"
      quality={75}
      sizes="(max-width: 640px) 15vw, 10vw"
      {...props}
    />
  ),
};
