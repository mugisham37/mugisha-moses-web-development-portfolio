"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  useScrollTriggeredAnimation,
  useStaggeredScrollAnimation,
} from "@/hooks/use-scroll-triggered-animations";
import { cn } from "@/lib/utils";

interface ScrollTriggeredContentProps {
  children: React.ReactNode;
  className?: string;
  animation?:
    | "fadeIn"
    | "slideUp"
    | "slideDown"
    | "slideLeft"
    | "slideRight"
    | "scale"
    | "rotate";
  delay?: number;
  duration?: number;
  threshold?: number;
  triggerOnce?: boolean;
}

const animationVariants = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideUp: {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  },
  slideDown: {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
  },
  slideRight: {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },
  rotate: {
    hidden: { opacity: 0, rotate: -10, scale: 0.9 },
    visible: { opacity: 1, rotate: 0, scale: 1 },
  },
};

export function ScrollTriggeredContent({
  children,
  className = "",
  animation = "fadeIn",
  delay = 0,
  duration = 0.6,
  threshold = 0.1,
  triggerOnce = true,
}: ScrollTriggeredContentProps) {
  const { ref, hasTriggered } = useScrollTriggeredAnimation({
    threshold,
    triggerOnce,
    delay: delay * 1000,
  });

  const variants = animationVariants[animation];

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial="hidden"
      animate={hasTriggered ? "visible" : "hidden"}
      variants={variants}
      transition={{
        duration,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
}

interface ScrollStaggeredContentProps {
  children: React.ReactNode[];
  className?: string;
  animation?:
    | "fadeIn"
    | "slideUp"
    | "slideDown"
    | "slideLeft"
    | "slideRight"
    | "scale";
  staggerDelay?: number;
  delay?: number;
  duration?: number;
  threshold?: number;
}

export function ScrollStaggeredContent({
  children,
  className = "",
  animation = "slideUp",
  staggerDelay = 0.1,
  delay = 0,
  duration = 0.6,
  threshold = 0.1,
}: ScrollStaggeredContentProps) {
  const { containerRef, triggeredItems } = useStaggeredScrollAnimation(
    children.length,
    {
      threshold,
      delay: delay * 1000,
      staggerDelay: staggerDelay * 1000,
    }
  );

  const variants = animationVariants[animation];

  return (
    <div ref={containerRef} className={cn(className)}>
      {children.map((child, index) => (
        <motion.div
          key={index}
          initial="hidden"
          animate={triggeredItems[index] ? "visible" : "hidden"}
          variants={variants}
          transition={{
            duration,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}

interface ScrollParallaxContentProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  direction?: "vertical" | "horizontal";
}

export function ScrollParallaxContent({
  children,
  className = "",
  speed = 0.5,
  direction = "vertical",
}: ScrollParallaxContentProps) {
  return (
    <motion.div
      className={cn(className)}
      style={{
        y: direction === "vertical" ? `${speed * 100}%` : 0,
        x: direction === "horizontal" ? `${speed * 100}%` : 0,
      }}
    >
      {children}
    </motion.div>
  );
}

interface ScrollRevealSectionProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  animation?: "fadeIn" | "slideUp" | "slideDown" | "slideLeft" | "slideRight";
  staggerChildren?: boolean;
  delay?: number;
}

export function ScrollRevealSection({
  children,
  className = "",
  title,
  subtitle,
  animation = "slideUp",
  staggerChildren = false,
  delay = 0,
}: ScrollRevealSectionProps) {
  const { ref, hasTriggered } = useScrollTriggeredAnimation({
    threshold: 0.1,
    triggerOnce: true,
    delay: delay * 1000,
  });

  const variants = animationVariants[animation];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerChildren ? 0.1 : 0,
      },
    },
  };

  return (
    <motion.section
      ref={ref}
      className={cn("space-y-8", className)}
      initial="hidden"
      animate={hasTriggered ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {(title || subtitle) && (
        <motion.div variants={variants} className="space-y-4 text-center">
          {title && (
            <motion.h2
              variants={variants}
              className="font-mono text-3xl font-bold tracking-wider uppercase md:text-4xl"
            >
              {title}
            </motion.h2>
          )}
          {subtitle && (
            <motion.p
              variants={variants}
              className="mx-auto max-w-2xl text-lg text-gray-400"
            >
              {subtitle}
            </motion.p>
          )}
        </motion.div>
      )}

      <motion.div variants={staggerChildren ? containerVariants : variants}>
        {children}
      </motion.div>
    </motion.section>
  );
}
