"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import {
  useScrollDirection,
  useScrollProgress,
} from "@/hooks/use-scroll-triggered-animations";
import { cn } from "@/lib/utils";

interface ScrollProgressBarProps {
  className?: string;
  color?: "accent" | "white" | "primary";
  height?: number;
  position?: "top" | "bottom";
  showPercentage?: boolean;
}

export function ScrollProgressBar({
  className = "",
  color = "accent",
  height = 4,
  position = "top",
  showPercentage = false,
}: ScrollProgressBarProps) {
  const progress = useScrollProgress();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(progress > 5);
  }, [progress]);

  const colorClasses = {
    accent: "bg-brutalist-yellow shadow-[0_0_10px_rgba(255,255,0,0.5)]",
    white: "bg-white shadow-[0_0_10px_rgba(255,255,255,0.3)]",
    primary: "bg-black shadow-[0_0_10px_rgba(0,0,0,0.3)]",
  };

  return (
    <motion.div
      className={cn(
        "fixed right-0 left-0 z-50",
        position === "top" ? "top-0" : "bottom-0",
        className
      )}
      initial={{ opacity: 0, scaleY: 0 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scaleY: isVisible ? 1 : 0,
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Background track */}
      <div className="w-full bg-black/20 backdrop-blur-sm" style={{ height }} />

      {/* Progress bar */}
      <motion.div
        className={cn("absolute top-0 left-0 origin-left", colorClasses[color])}
        style={{
          height,
          width: `${progress}%`,
        }}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.1, ease: "easeOut" }}
      />

      {/* Optional percentage display */}
      {showPercentage && (
        <motion.div
          className="absolute top-2 right-4 font-mono text-xs font-bold tracking-wider text-white uppercase"
          initial={{ opacity: 0, y: -10 }}
          animate={{
            opacity: isVisible ? 1 : 0,
            y: isVisible ? 0 : -10,
          }}
          transition={{ delay: 0.2 }}
        >
          {Math.round(progress)}%
        </motion.div>
      )}
    </motion.div>
  );
}

interface ScrollDirectionIndicatorProps {
  className?: string;
  showOnScroll?: boolean;
}

export function ScrollDirectionIndicator({
  className = "",
  showOnScroll = true,
}: ScrollDirectionIndicatorProps) {
  const direction = useScrollDirection();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (showOnScroll) {
      setIsVisible(direction !== null);

      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [direction, showOnScroll]);

  if (!direction || !isVisible) return null;

  return (
    <motion.div
      className={cn(
        "fixed top-1/2 right-4 z-40 -translate-y-1/2",
        "border-2 border-white bg-black/80 backdrop-blur-sm",
        "rounded-sm px-3 py-2",
        className
      )}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="text-brutalist-yellow font-mono text-sm font-bold"
        animate={{
          y: direction === "down" ? [0, 4, 0] : [0, -4, 0],
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {direction === "down" ? "↓" : "↑"}
      </motion.div>
    </motion.div>
  );
}

interface ParallaxScrollEffectProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  direction?: "up" | "down" | "left" | "right";
  offset?: number;
}

export function ParallaxScrollEffect({
  children,
  className = "",
  speed = 0.5,
  direction = "up",
  offset = 0,
}: ParallaxScrollEffectProps) {
  const { scrollY } = useScroll();

  const transform = useTransform(
    scrollY,
    [0, 1000],
    direction === "up"
      ? [offset, offset - 1000 * speed]
      : direction === "down"
        ? [offset, offset + 1000 * speed]
        : direction === "left"
          ? [offset, offset - 1000 * speed]
          : [offset, offset + 1000 * speed]
  );

  const springTransform = useSpring(transform, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className={cn(className)}
      style={{
        y: direction === "up" || direction === "down" ? springTransform : 0,
        x: direction === "left" || direction === "right" ? springTransform : 0,
      }}
    >
      {children}
    </motion.div>
  );
}

interface ScrollSnapSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function ScrollSnapSection({
  children,
  className = "",
  id,
}: ScrollSnapSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "min-h-screen snap-start snap-always",
        "flex flex-col justify-center",
        className
      )}
    >
      {children}
    </section>
  );
}

interface ScrollSnapContainerProps {
  children: React.ReactNode;
  className?: string;
  direction?: "vertical" | "horizontal";
}

export function ScrollSnapContainer({
  children,
  className = "",
  direction = "vertical",
}: ScrollSnapContainerProps) {
  return (
    <div
      className={cn(
        "snap-mandatory",
        direction === "vertical"
          ? "snap-y overflow-y-auto"
          : "snap-x overflow-x-auto",
        "h-screen",
        className
      )}
    >
      {children}
    </div>
  );
}

interface SmoothScrollToTopProps {
  className?: string;
  threshold?: number;
  size?: "sm" | "md" | "lg";
}

export function SmoothScrollToTop({
  className = "",
  threshold = 400,
  size = "md",
}: SmoothScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);
  const progress = useScrollProgress();

  useEffect(() => {
    setIsVisible(window.scrollY > threshold);
  }, [progress, threshold]);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const sizeClasses = {
    sm: "w-10 h-10 text-sm",
    md: "w-12 h-12 text-base",
    lg: "w-14 h-14 text-lg",
  };

  return (
    <motion.button
      className={cn(
        "fixed right-8 bottom-8 z-50",
        "bg-brutalist-yellow text-black",
        "border-4 border-black",
        "font-mono font-bold",
        "flex items-center justify-center",
        "transition-all duration-300",
        "hover:scale-110 hover:shadow-[8px_8px_0px_rgba(0,0,0,0.3)]",
        "focus:ring-4 focus:ring-white focus:outline-none",
        sizeClasses[size],
        className
      )}
      initial={{ opacity: 0, scale: 0, rotate: -180 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0,
        rotate: isVisible ? 0 : -180,
      }}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      onClick={handleScrollToTop}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Scroll to top"
    >
      ↑
    </motion.button>
  );
}
