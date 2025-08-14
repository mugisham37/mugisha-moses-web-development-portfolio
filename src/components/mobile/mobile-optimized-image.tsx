"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface MobileOptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  sizes?: string;
  fill?: boolean;
  aspectRatio?: "square" | "video" | "portrait" | "landscape" | "auto";
  loading?: "lazy" | "eager";
  onLoad?: () => void;
  onError?: () => void;
  fallbackSrc?: string;
  showLoadingState?: boolean;
  enableZoom?: boolean;
}

/**
 * Mobile-optimized image component with enhanced loading states,
 * touch interactions, and responsive behavior
 */
export function MobileOptimizedImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  quality = 85,
  placeholder = "blur",
  blurDataURL,
  sizes,
  fill = false,
  aspectRatio = "auto",
  loading = "lazy",
  onLoad,
  onError,
  fallbackSrc,
  showLoadingState = true,
  enableZoom = false,
}: MobileOptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const isMobile = useIsMobile();
  const imageRef = useRef<HTMLDivElement>(null);

  // Generate mobile-optimized sizes if not provided
  const mobileSizes =
    sizes ||
    (isMobile
      ? "(max-width: 640px) 100vw, (max-width: 768px) 90vw, 80vw"
      : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw");

  // Generate aspect ratio classes
  const aspectRatioClass = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
    auto: "",
  }[aspectRatio];

  // Handle image load
  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  // Handle image error with fallback
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

  // Handle zoom toggle for mobile
  const handleZoomToggle = () => {
    if (enableZoom && isMobile) {
      setIsZoomed(!isZoomed);
      // Haptic feedback
      if ("vibrate" in navigator) {
        navigator.vibrate(30);
      }
    }
  };

  // Generate blur data URL if not provided
  const generateBlurDataURL = (width: number, height: number) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(0, 0, width, height);
    }
    return canvas.toDataURL();
  };

  const defaultBlurDataURL = blurDataURL || generateBlurDataURL(40, 40);

  return (
    <div
      ref={imageRef}
      className={cn(
        "bg-brutalist-charcoal-100 relative overflow-hidden",
        aspectRatioClass,
        enableZoom && isMobile && "cursor-pointer",
        className
      )}
      onClick={handleZoomToggle}
      role={enableZoom ? "button" : undefined}
      aria-label={
        enableZoom ? `${isZoomed ? "Zoom out" : "Zoom in"} ${alt}` : undefined
      }
      tabIndex={enableZoom ? 0 : undefined}
    >
      {/* Loading State */}
      <AnimatePresence>
        {isLoading && showLoadingState && (
          <motion.div
            className="bg-brutalist-charcoal-100 absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col items-center gap-3">
              {/* Loading spinner */}
              <motion.div
                className="h-8 w-8 rounded-full border-4 border-white/20 border-t-yellow-400"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />

              {/* Loading text */}
              <motion.p
                className="font-mono text-sm tracking-wider text-white/60 uppercase"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Loading...
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      <AnimatePresence>
        {hasError && !isLoading && (
          <motion.div
            className="bg-brutalist-charcoal-200 absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col items-center gap-3 p-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center border-4 border-red-400">
                <span className="text-xl text-red-400">⚠</span>
              </div>
              <p className="font-mono text-sm tracking-wider text-red-400 uppercase">
                Failed to load
              </p>
              <p className="font-mono text-xs text-white/60">{alt}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Image */}
      {!hasError && (
        <motion.div
          className="relative h-full w-full"
          animate={{
            scale: isZoomed ? 2 : 1,
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
        >
          <Image
            src={currentSrc}
            alt={alt}
            width={width}
            height={height}
            fill={fill}
            priority={priority}
            quality={quality}
            placeholder={placeholder}
            blurDataURL={defaultBlurDataURL}
            sizes={mobileSizes}
            loading={loading}
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              "object-cover transition-all duration-300",
              isLoading && "opacity-0",
              !isLoading && "opacity-100"
            )}
            style={{
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </motion.div>
      )}

      {/* Zoom Indicator */}
      {enableZoom && isMobile && !isLoading && !hasError && (
        <motion.div
          className="absolute top-2 right-2 rounded-full bg-black/70 p-2 text-white"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            animate={{ scale: isZoomed ? 1.2 : 1 }}
            transition={{ duration: 0.2 }}
          >
            {isZoomed ? "🔍-" : "🔍+"}
          </motion.div>
        </motion.div>
      )}

      {/* Touch Interaction Overlay */}
      {enableZoom && isMobile && (
        <motion.div
          className="absolute inset-0 bg-transparent"
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.1 }}
        />
      )}
    </div>
  );
}

/**
 * Mobile-optimized image gallery component
 */
interface MobileImageGalleryProps {
  images: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
  className?: string;
  aspectRatio?: "square" | "video" | "portrait" | "landscape";
  showThumbnails?: boolean;
}

export function MobileImageGallery({
  images,
  className = "",
  aspectRatio = "video",
  showThumbnails = true,
}: MobileImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useIsMobile();

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    if ("vibrate" in navigator) {
      navigator.vibrate(20);
    }
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    if ("vibrate" in navigator) {
      navigator.vibrate(20);
    }
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
    if ("vibrate" in navigator) {
      navigator.vibrate(15);
    }
  };

  if (images.length === 0) return null;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Image */}
      <div className="relative">
        <MobileOptimizedImage
          src={images[currentIndex].src}
          alt={images[currentIndex].alt}
          aspectRatio={aspectRatio}
          enableZoom={true}
          showLoadingState={true}
          className="w-full"
          sizes={isMobile ? "100vw" : "(max-width: 768px) 100vw, 80vw"}
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute top-1/2 left-2 min-h-[48px] min-w-[48px] -translate-y-1/2 border-2 border-white/20 bg-black/70 p-3 text-white transition-all duration-200 hover:border-yellow-400"
              aria-label="Previous image"
            >
              ←
            </button>
            <button
              onClick={nextImage}
              className="absolute top-1/2 right-2 min-h-[48px] min-w-[48px] -translate-y-1/2 border-2 border-white/20 bg-black/70 p-3 text-white transition-all duration-200 hover:border-yellow-400"
              aria-label="Next image"
            >
              →
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-2 bg-black/70 px-3 py-1 font-mono text-sm text-white">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Caption */}
      {images[currentIndex].caption && (
        <p className="text-center font-mono text-sm text-white/80">
          {images[currentIndex].caption}
        </p>
      )}

      {/* Thumbnails */}
      {showThumbnails && images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={cn(
                "h-16 w-16 flex-shrink-0 border-2 transition-all duration-200",
                "min-h-[48px] min-w-[48px]",
                index === currentIndex
                  ? "border-yellow-400 opacity-100"
                  : "border-white/20 opacity-60 hover:opacity-80"
              )}
              aria-label={`View image ${index + 1}: ${image.alt}`}
            >
              <MobileOptimizedImage
                src={image.src}
                alt={image.alt}
                aspectRatio="square"
                showLoadingState={false}
                className="h-full w-full"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
