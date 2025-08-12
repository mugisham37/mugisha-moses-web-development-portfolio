"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Play,
  Pause,
  ZoomIn,
  Download,
  Share2,
  Maximize2,
} from "lucide-react";
import { OptimizedImage } from "./optimized-image";
import { Button } from "./button";
import { Typography } from "./typography";
import { cn } from "@/lib/utils";
import { useTouchGestures } from "@/hooks/use-touch-gestures";
import { useIsMobile } from "@/hooks/use-mobile";
import { TouchTarget } from "@/components/mobile/touch-target";

interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
  downloadUrl?: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  title?: string;
  showThumbnails?: boolean;
  showControls?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  enableKeyboard?: boolean;
  enableSwipe?: boolean;
  className?: string;
  onImageChange?: (index: number) => void;
}

export function ImageGallery({
  images,
  title,
  showThumbnails = true,
  showControls = true,
  autoPlay = false,
  autoPlayInterval = 3000,
  enableKeyboard = true,
  enableSwipe = true,
  className,
  onImageChange,
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const currentImage = images[currentIndex];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isAutoPlaying, images.length, autoPlayInterval]);

  // Keyboard navigation
  useEffect(() => {
    if (!enableKeyboard) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          prevImage();
          break;
        case "ArrowRight":
          event.preventDefault();
          nextImage();
          break;
        case "Escape":
          if (showLightbox) {
            event.preventDefault();
            setShowLightbox(false);
          }
          break;
        case " ":
          if (showLightbox) {
            event.preventDefault();
            setIsAutoPlaying(!isAutoPlaying);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enableKeyboard, showLightbox, isAutoPlaying]);

  const nextImage = useCallback(() => {
    const newIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(newIndex);
    onImageChange?.(newIndex);
  }, [currentIndex, images.length, onImageChange]);

  const prevImage = useCallback(() => {
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(newIndex);
    onImageChange?.(newIndex);
  }, [currentIndex, images.length, onImageChange]);

  const goToImage = useCallback(
    (index: number) => {
      setCurrentIndex(index);
      onImageChange?.(index);
    },
    [onImageChange]
  );

  // Touch/swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!enableSwipe) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!enableSwipe) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!enableSwipe || !touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextImage();
    } else if (isRightSwipe) {
      prevImage();
    }
  };

  const handleShare = async () => {
    if (navigator.share && currentImage) {
      try {
        await navigator.share({
          title: title || "Image",
          text: currentImage.alt,
          url: currentImage.src,
        });
      } catch (error) {
        // Fallback to copying URL
        navigator.clipboard.writeText(currentImage.src);
      }
    }
  };

  const handleDownload = () => {
    if (!currentImage) return;

    const link = document.createElement("a");
    link.href = currentImage.downloadUrl || currentImage.src;
    link.download = `${title || "image"}-${currentIndex + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (images.length === 0) return null;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Image */}
      <div
        className="group relative cursor-pointer"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <OptimizedImage
          src={currentImage.src}
          alt={currentImage.alt}
          aspectRatio="video"
          className="h-full w-full"
          containerClassName="border border-white bg-gray-900"
          onClick={() => setShowLightbox(true)}
          priority={currentIndex === 0}
        />

        {/* Navigation arrows */}
        {images.length > 1 && showControls && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={prevImage}
              className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/80 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextImage}
              className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/80 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}

        {/* Image info overlay */}
        <div className="absolute right-4 bottom-4 left-4 flex items-end justify-between opacity-0 transition-opacity group-hover:opacity-100">
          <div className="bg-black/80 px-3 py-2">
            <Typography variant="caption" className="font-mono text-white">
              {currentIndex + 1} / {images.length}
            </Typography>
            {currentImage.caption && (
              <Typography variant="caption" className="text-gray-300">
                {currentImage.caption}
              </Typography>
            )}
          </div>

          {/* Controls */}
          {showControls && (
            <div className="flex items-center gap-2">
              {images.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="bg-black/80 p-2 text-white hover:bg-black"
                  aria-label={
                    isAutoPlaying ? "Pause slideshow" : "Play slideshow"
                  }
                >
                  {isAutoPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLightbox(true)}
                className="bg-black/80 p-2 text-white hover:bg-black"
                aria-label="Open lightbox"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && showThumbnails && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={cn(
                "relative h-16 w-24 flex-shrink-0 overflow-hidden border-2 transition-colors",
                currentIndex === index
                  ? "border-accent"
                  : "border-gray-600 hover:border-white"
              )}
            >
              <OptimizedImage
                src={image.src}
                alt={image.alt}
                aspectRatio="video"
                className="h-full w-full"
                showLoader={false}
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {showLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
            onClick={() => setShowLightbox(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-h-full max-w-7xl"
              onClick={(e) => e.stopPropagation()}
            >
              <OptimizedImage
                src={currentImage.src}
                alt={currentImage.alt}
                width={1200}
                height={800}
                className="max-h-[90vh] w-auto object-contain"
                priority
              />

              {/* Lightbox controls */}
              <div className="absolute -top-16 right-0 flex items-center gap-2">
                {/* Share button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="bg-white/20 p-2 text-white hover:bg-white/30"
                  aria-label="Share image"
                >
                  <Share2 className="h-5 w-5" />
                </Button>

                {/* Download button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownload}
                  className="bg-white/20 p-2 text-white hover:bg-white/30"
                  aria-label="Download image"
                >
                  <Download className="h-5 w-5" />
                </Button>

                {/* Close button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowLightbox(false)}
                  className="bg-white p-2 text-black hover:bg-gray-200"
                  aria-label="Close lightbox"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Navigation in lightbox */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={prevImage}
                    className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/20 p-3 text-white hover:bg-white/30"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={nextImage}
                    className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/20 p-3 text-white hover:bg-white/30"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}

              {/* Image info in lightbox */}
              <div className="absolute right-4 bottom-4 left-4 flex items-end justify-between">
                <div className="bg-black/80 px-4 py-2">
                  <Typography variant="body" className="font-mono text-white">
                    {currentIndex + 1} / {images.length}
                  </Typography>
                  {currentImage.caption && (
                    <Typography variant="body" className="text-gray-300">
                      {currentImage.caption}
                    </Typography>
                  )}
                </div>

                {/* Auto-play control in lightbox */}
                {images.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    className="bg-black/80 p-2 text-white hover:bg-black"
                    aria-label={
                      isAutoPlaying ? "Pause slideshow" : "Play slideshow"
                    }
                  >
                    {isAutoPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
