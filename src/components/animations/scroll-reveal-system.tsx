"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

// Configuration interface
interface ScrollRevealConfig {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
  duration?: number;
  stagger?: number;
  easing?:
    | "linear"
    | "easeIn"
    | "easeOut"
    | "easeInOut"
    | "circOut"
    | "backOut";
}

// Easing functions
const easingFunctions = {
  linear: [0, 0, 1, 1] as const,
  easeIn: [0.4, 0, 1, 1] as const,
  easeOut: [0, 0, 0.2, 1] as const,
  easeInOut: [0.4, 0, 0.2, 1] as const,
  circOut: [0.08, 0.82, 0.17, 1] as const,
  backOut: [0.34, 1.56, 0.64, 1] as const,
};

// Default animation variants - bulletproof definitions
const DEFAULT_VARIANTS = {
  fadeInUp: {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  fadeInDown: {
    hidden: { opacity: 0, y: -60 },
    visible: { opacity: 1, y: 0 },
  },
  fadeInLeft: {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0 },
  },
  fadeInRight: {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },
  scaleInUp: {
    hidden: { opacity: 0, scale: 0.8, y: 40 },
    visible: { opacity: 1, scale: 1, y: 0 },
  },
  scaleInRotate: {
    hidden: { opacity: 0, scale: 0.5, rotate: -180 },
    visible: { opacity: 1, scale: 1, rotate: 0 },
  },
  rotateIn: {
    hidden: { opacity: 0, rotate: -180, scale: 0.5 },
    visible: { opacity: 1, rotate: 0, scale: 1 },
  },
  rotateInLeft: {
    hidden: { opacity: 0, rotate: -90, transformOrigin: "left bottom" },
    visible: { opacity: 1, rotate: 0, transformOrigin: "left bottom" },
  },
  rotateInRight: {
    hidden: { opacity: 0, rotate: 90, transformOrigin: "right bottom" },
    visible: { opacity: 1, rotate: 0, transformOrigin: "right bottom" },
  },
  flipInX: {
    hidden: { opacity: 0, rotateX: -90 },
    visible: { opacity: 1, rotateX: 0 },
  },
  flipInY: {
    hidden: { opacity: 0, rotateY: -90 },
    visible: { opacity: 1, rotateY: 0 },
  },
  zoomIn: {
    hidden: { opacity: 0, scale: 0.3 },
    visible: { opacity: 1, scale: 1 },
  },
  zoomInUp: {
    hidden: { opacity: 0, scale: 0.1, y: 2000 },
    visible: { opacity: 1, scale: 1, y: 0 },
  },
  zoomInDown: {
    hidden: { opacity: 0, scale: 0.1, y: -2000 },
    visible: { opacity: 1, scale: 1, y: 0 },
  },
  slideInUp: {
    hidden: { y: "100%" },
    visible: { y: "0%" },
  },
  slideInDown: {
    hidden: { y: "-100%" },
    visible: { y: "0%" },
  },
  slideInLeft: {
    hidden: { x: "-100%" },
    visible: { x: "0%" },
  },
  slideInRight: {
    hidden: { x: "100%" },
    visible: { x: "0%" },
  },
  bounceIn: {
    hidden: { opacity: 0, scale: 0.3 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 100,
      },
    },
  },
  bounceInUp: {
    hidden: { opacity: 0, y: 100, scale: 0.3 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 100,
      },
    },
  },
  elasticIn: {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 8,
        stiffness: 100,
      },
    },
  },
  backInUp: {
    hidden: { opacity: 0, y: 100, scale: 0.7 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
        restDelta: 0.001,
      },
    },
  },
  brutalistSlam: {
    hidden: { opacity: 0, y: -100, rotateX: -90, scale: 0.5 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.34, 1.56, 0.64, 1],
      },
    },
  },
  brutalistPunch: {
    hidden: { opacity: 0, scale: 0, rotate: -180 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.6,
        ease: [0.68, -0.55, 0.265, 1.55],
      },
    },
  },
};

// Safe animation getter function
function getSafeAnimation(animationName: string) {
  // Check if the animation exists in our variants
  if (DEFAULT_VARIANTS[animationName as keyof typeof DEFAULT_VARIANTS]) {
    return DEFAULT_VARIANTS[animationName as keyof typeof DEFAULT_VARIANTS];
  }

  // Log warning in development
  if (process.env.NODE_ENV === "development") {
    console.warn(
      `Animation "${animationName}" not found. Using fadeInUp as fallback.`
    );
  }

  // Always return a safe fallback
  return DEFAULT_VARIANTS.fadeInUp;
}

// Safe easing getter function
function getSafeEasing(easingName: string) {
  if (easingFunctions[easingName as keyof typeof easingFunctions]) {
    return easingFunctions[easingName as keyof typeof easingFunctions];
  }
  return easingFunctions.easeOut;
}

// ScrollReveal component
interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  animation?: string;
  config?: ScrollRevealConfig;
  onReveal?: () => void;
  onHide?: () => void;
}

export function ScrollReveal({
  children,
  className,
  animation = "fadeInUp",
  config = {},
  onReveal,
  onHide,
}: ScrollRevealProps) {
  const {
    threshold = 0.1,
    rootMargin = "0px",
    triggerOnce = true,
    delay = 0,
    duration = 0.6,
    easing = "easeOut",
  } = config;

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: triggerOnce,
    margin: rootMargin as any,
    amount: threshold,
  });

  const [hasRevealed, setHasRevealed] = useState(false);

  useEffect(() => {
    if (isInView && !hasRevealed) {
      setHasRevealed(true);
      onReveal?.();
    } else if (!isInView && hasRevealed && !triggerOnce) {
      setHasRevealed(false);
      onHide?.();
    }
  }, [isInView, hasRevealed, triggerOnce, onReveal, onHide]);

  // Get safe animation variant
  const animationVariant = getSafeAnimation(animation);

  const transition = {
    duration,
    delay,
    ease: getSafeEasing(easing),
  };

  return (
    <motion.div
      ref={ref}
      className={cn("relative", className)}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: animationVariant.hidden,
        visible: {
          ...animationVariant.visible,
          transition,
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// ScrollRevealStagger component
interface ScrollRevealStaggerProps {
  children: React.ReactNode;
  className?: string;
  animation?: string;
  config?: ScrollRevealConfig;
  itemClassName?: string;
}

export function ScrollRevealStagger({
  children,
  className,
  animation = "fadeInUp",
  config = {},
  itemClassName,
}: ScrollRevealStaggerProps) {
  const {
    threshold = 0.1,
    rootMargin = "0px",
    triggerOnce = true,
    delay = 0,
    duration = 0.6,
    stagger = 0.1,
    easing = "easeOut",
  } = config;

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: triggerOnce,
    margin: rootMargin as any,
    amount: threshold,
  });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  // Get safe animation variant
  const animationVariant = getSafeAnimation(animation);

  const itemVariants = {
    hidden: animationVariant.hidden,
    visible: {
      ...animationVariant.visible,
      transition: {
        duration,
        ease: getSafeEasing(easing),
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          className={itemClassName}
          variants={itemVariants}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

// ScrollTextReveal component
interface ScrollTextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  animation?: "fadeIn" | "slideUp" | "rotateIn" | "scaleIn";
}

export function ScrollTextReveal({
  text,
  className,
  delay = 0,
  stagger = 0.05,
  animation = "fadeIn",
}: ScrollTextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" as any });

  const letterVariants = {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    slideUp: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    },
    rotateIn: {
      hidden: { opacity: 0, rotateX: -90 },
      visible: { opacity: 1, rotateX: 0 },
    },
    scaleIn: {
      hidden: { opacity: 0, scale: 0 },
      visible: { opacity: 1, scale: 1 },
    },
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const selectedVariant = letterVariants[animation] || letterVariants.fadeIn;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          variants={selectedVariant}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ display: "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.div>
  );
}

// MultiLayerParallax component
interface MultiLayerParallaxProps {
  children: React.ReactNode;
  className?: string;
  layers?: Array<{
    speed: number;
    direction?: "up" | "down" | "left" | "right";
    scale?: boolean;
    rotate?: boolean;
  }>;
}

export function MultiLayerParallax({
  children,
  className,
  layers = [{ speed: 0.5 }],
}: MultiLayerParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <div ref={ref} className={cn("relative", className)}>
      {React.Children.map(children, (child, index) => {
        const layer = layers[index] || layers[0];
        const {
          speed,
          direction = "up",
          scale = false,
          rotate = false,
        } = layer;

        let yTransform, xTransform, scaleTransform, rotateTransform;

        switch (direction) {
          case "up":
            yTransform = useTransform(
              scrollYProgress,
              [0, 1],
              [0, -speed * 100]
            );
            break;
          case "down":
            yTransform = useTransform(
              scrollYProgress,
              [0, 1],
              [0, speed * 100]
            );
            break;
          case "left":
            xTransform = useTransform(
              scrollYProgress,
              [0, 1],
              [0, -speed * 100]
            );
            break;
          case "right":
            xTransform = useTransform(
              scrollYProgress,
              [0, 1],
              [0, speed * 100]
            );
            break;
        }

        if (scale) {
          scaleTransform = useTransform(
            scrollYProgress,
            [0, 0.5, 1],
            [1, 1 + speed * 0.2, 1]
          );
        }

        if (rotate) {
          rotateTransform = useTransform(
            scrollYProgress,
            [0, 1],
            [0, speed * 360]
          );
        }

        return (
          <motion.div
            key={index}
            style={{
              y: yTransform,
              x: xTransform,
              scale: scaleTransform,
              rotate: rotateTransform,
            }}
          >
            {child}
          </motion.div>
        );
      })}
    </div>
  );
}

// ScrollMorph component
interface ScrollMorphProps {
  children: React.ReactNode;
  className?: string;
  fromShape?: string;
  toShape?: string;
  duration?: number;
}

export function ScrollMorph({
  children,
  className,
  fromShape = "0%",
  toShape = "50%",
  duration = 1,
}: ScrollMorphProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" as any });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{
        borderRadius: fromShape,
        scale: 0.8,
        opacity: 0,
      }}
      animate={
        isInView
          ? {
              borderRadius: toShape,
              scale: 1,
              opacity: 1,
            }
          : {}
      }
      transition={{
        duration,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
}

// Export the variants and easing functions for backward compatibility
export const revealVariants = DEFAULT_VARIANTS;
export { easingFunctions };
