"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TestimonialCard } from "./testimonial-card";
import type { Testimonial } from "@prisma/client";

interface TestimonialWithAuthor extends Testimonial {
  author?: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  } | null;
}

interface TestimonialCarouselProps {
  testimonials: TestimonialWithAuthor[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showNavigation?: boolean;
  showIndicators?: boolean;
  className?: string;
}

export function TestimonialCarousel({
  testimonials,
  autoPlay = true,
  autoPlayInterval = 5000,
  showNavigation = true,
  showIndicators = true,
  className = "",
}: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);

  const nextTestimonial = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prevTestimonial = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  }, [testimonials.length]);

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || testimonials.length <= 1) return;

    const interval = setInterval(nextTestimonial, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextTestimonial, autoPlayInterval, testimonials.length]);

  // Pause auto-play on hover
  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    if (autoPlay) {
      setIsAutoPlaying(true);
    }
  };

  if (testimonials.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="space-y-4">
          <div className="text-6xl">💬</div>
          <h3 className="text-2xl font-bold text-gray-400 uppercase">
            No Testimonials Yet
          </h3>
          <p className="text-gray-500">
            Be the first to experience our elite services and share your success
            story.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div
      className={`space-y-6 ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main Carousel */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{
              duration: 0.5,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <TestimonialCard
              testimonial={testimonials[currentIndex]}
              variant="featured"
              showVideo={true}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {showNavigation && testimonials.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={prevTestimonial}
              className="absolute top-1/2 left-4 h-12 w-12 -translate-y-1/2 p-0 opacity-80 hover:opacity-100"
            >
              <span className="text-xl">←</span>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={nextTestimonial}
              className="absolute top-1/2 right-4 h-12 w-12 -translate-y-1/2 p-0 opacity-80 hover:opacity-100"
            >
              <span className="text-xl">→</span>
            </Button>
          </>
        )}
      </div>

      {/* Indicators */}
      {showIndicators && testimonials.length > 1 && (
        <div className="flex items-center justify-center gap-3">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`h-3 w-3 border-2 transition-all duration-300 ${
                index === currentIndex
                  ? "bg-brutalist-yellow border-brutalist-yellow scale-125"
                  : "hover:border-brutalist-yellow border-white bg-transparent hover:scale-110"
              } `}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {isAutoPlaying && testimonials.length > 1 && (
        <div className="h-1 w-full overflow-hidden bg-gray-700">
          <motion.div
            className="bg-brutalist-yellow h-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: autoPlayInterval / 1000,
              ease: "linear",
              repeat: Infinity,
            }}
          />
        </div>
      )}

      {/* Testimonial Counter */}
      <div className="text-center">
        <span className="font-mono text-sm tracking-wider text-gray-400 uppercase">
          {currentIndex + 1} of {testimonials.length} testimonials
        </span>
      </div>
    </div>
  );
}
