"use client";

import React, { useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "scale" | "fade";
  distance?: number;
  threshold?: number;
  once?: boolean;
  rootMargin?: string;
}

const getVariants = (
  direction: ScrollRevealProps["direction"],
  distance: number
): Variants => {
  const baseTransition = {
    duration: 0.8,
    ease: [0.25, 0.46, 0.45, 0.94] as const,
  };

  switch (direction) {
    case "up":
      return {
        hidden: { opacity: 0, y: distance },
        visible: { opacity: 1, y: 0, transition: baseTransition },
      };
    case "down":
      return {
        hidden: { opacity: 0, y: -distance },
        visible: { opacity: 1, y: 0, transition: baseTransition },
      };
    case "left":
      return {
        hidden: { opacity: 0, x: distance },
        visible: { opacity: 1, x: 0, transition: baseTransition },
      };
    case "right":
      return {
        hidden: { opacity: 0, x: -distance },
        visible: { opacity: 1, x: 0, transition: baseTransition },
      };
    case "scale":
      return {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: baseTransition },
      };
    case "fade":
    default:
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: baseTransition },
      };
  }
};

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  duration = 0.8,
  direction = "up",
  distance = 50,
  threshold = 0.1,
  once = true,
  rootMargin = "-50px",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once,
    margin: rootMargin,
    amount: threshold,
  });

  const variants = getVariants(direction, distance);

  // Override duration in variants
  const customVariants = {
    ...variants,
    visible: {
      ...variants.visible,
      transition: {
        ...variants.visible.transition,
        duration,
        delay,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={cn("", className)}
      variants={customVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {children}
    </motion.div>
  );
}

interface StaggeredRevealProps {
  children: React.ReactNode[];
  className?: string;
  staggerDelay?: number;
  direction?: ScrollRevealProps["direction"];
  distance?: number;
  threshold?: number;
  once?: boolean;
  rootMargin?: string;
}

export function StaggeredReveal({
  children,
  className = "",
  staggerDelay = 0.1,
  direction = "up",
  distance = 50,
  threshold = 0.1,
  once = true,
  rootMargin = "-50px",
}: StaggeredRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once,
    margin: rootMargin,
    amount: threshold,
  });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = getVariants(direction, distance);

  return (
    <motion.div
      ref={ref}
      className={cn("", className)}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {children.map((child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

interface ParallaxRevealProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  direction?: "vertical" | "horizontal";
}

export function ParallaxReveal({
  children,
  className = "",
  speed = 0.5,
  direction = "vertical",
}: ParallaxRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={ref}
      className={cn("", className)}
      style={{
        y: direction === "vertical" ? speed * -100 : 0,
        x: direction === "horizontal" ? speed * -100 : 0,
      }}
      transition={{ type: "spring", stiffness: 100, damping: 30 }}
    >
      {children}
    </motion.div>
  );
}

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  onReveal?: () => void;
}

export function RevealOnScroll({
  children,
  className = "",
  threshold = 0.1,
  rootMargin = "-50px",
  once = true,
  onReveal,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once,
    margin: rootMargin,
    amount: threshold,
  });

  React.useEffect(() => {
    if (isInView && onReveal) {
      onReveal();
    }
  }, [isInView, onReveal]);

  return (
    <div ref={ref} className={cn("", className)}>
      {children}
    </div>
  );
}

interface CountUpOnScrollProps {
  end: number;
  start?: number;
  duration?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
}

export function CountUpOnScroll({
  end,
  start = 0,
  duration = 2000,
  className = "",
  suffix = "",
  prefix = "",
}: CountUpOnScrollProps) {
  const [count, setCount] = React.useState(start);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  React.useEffect(() => {
    if (!isInView) return;

    const startTime = Date.now();
    const startValue = start;
    const endValue = end;
    const totalChange = endValue - startValue;

    const animateCount = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + totalChange * easeOut;

      setCount(Math.floor(currentValue));

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      } else {
        setCount(endValue);
      }
    };

    requestAnimationFrame(animateCount);
  }, [isInView, start, end, duration]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}
