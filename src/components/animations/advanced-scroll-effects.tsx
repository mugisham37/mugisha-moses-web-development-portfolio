"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useAnimation,
  AnimatePresence,
  type Variants,
  type Transition,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { useScrollTriggeredAnimation } from "@/hooks/use-scroll-triggered-animations";

// Advanced animation variants with sophisticated easing
const advancedVariants: Record<string, Variants> = {
  // Viewport-based animations
  fadeInUp: {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  },
  fadeInDown: {
    hidden: { opacity: 0, y: -60, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  },
  slideInLeft: {
    hidden: { opacity: 0, x: -100, rotateY: -15 },
    visible: {
      opacity: 1,
      x: 0,
      rotateY: 0,
      transition: {
        duration: 0.9,
        ease: [0.23, 1, 0.32, 1],
      },
    },
  },
  slideInRight: {
    hidden: { opacity: 0, x: 100, rotateY: 15 },
    visible: {
      opacity: 1,
      x: 0,
      rotateY: 0,
      transition: {
        duration: 0.9,
        ease: [0.23, 1, 0.32, 1],
      },
    },
  },
  scaleInRotate: {
    hidden: { opacity: 0, scale: 0.3, rotate: -180 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 1.2,
        ease: [0.34, 1.56, 0.64, 1],
      },
    },
  },
  morphIn: {
    hidden: { opacity: 0, scale: 0.8, borderRadius: "50%" },
    visible: {
      opacity: 1,
      scale: 1,
      borderRadius: "0%",
      transition: {
        duration: 1,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  },
  // Stagger container variants
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
        duration: 0.6,
      },
    },
  },
  staggerItem: {
    hidden: { opacity: 0, y: 40, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  },
  // Advanced stagger with rotation
  staggerRotateItem: {
    hidden: { opacity: 0, y: 30, rotate: -5, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      rotate: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.23, 1, 0.32, 1],
      },
    },
  },
  // Page transition variants
  pageTransition: {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  },
};

// Advanced easing functions
const advancedEasing = {
  brutalist: [0.25, 0.46, 0.45, 0.94] as const,
  elastic: [0.68, -0.55, 0.265, 1.55] as const,
  smooth: [0.23, 1, 0.32, 1] as const,
  sharp: [0.4, 0, 0.2, 1] as const,
  bounce: [0.34, 1.56, 0.64, 1] as const,
};

interface ViewportAnimationProps {
  children: React.ReactNode;
  className?: string;
  variant?: keyof typeof advancedVariants;
  delay?: number;
  duration?: number;
  threshold?: number;
  triggerOnce?: boolean;
  easing?: keyof typeof advancedEasing;
  onAnimationStart?: () => void;
  onAnimationComplete?: () => void;
}

export function ViewportAnimation({
  children,
  className,
  variant = "fadeInUp",
  delay = 0,
  duration,
  threshold = 0.1,
  triggerOnce = true,
  easing = "brutalist",
  onAnimationStart,
  onAnimationComplete,
}: ViewportAnimationProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: triggerOnce,
    margin: `-${threshold * 100}%`,
  });

  const variants = advancedVariants[variant];
  const customTransition: Transition = {
    ...variants.visible?.transition,
    delay,
    ease: advancedEasing[easing],
    ...(duration && { duration }),
  };

  useEffect(() => {
    if (isInView && onAnimationStart) {
      onAnimationStart();
    }
  }, [isInView, onAnimationStart]);

  return (
    <motion.div
      ref={ref}
      className={cn("relative", className)}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        ...variants,
        visible: {
          ...variants.visible,
          transition: customTransition,
        },
      }}
      onAnimationComplete={onAnimationComplete}
    >
      {children}
    </motion.div>
  );
}

interface StaggeredAnimationProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  itemVariant?: "staggerItem" | "staggerRotateItem";
  threshold?: number;
  triggerOnce?: boolean;
  delay?: number;
}

export function StaggeredAnimation({
  children,
  className,
  staggerDelay = 0.15,
  itemVariant = "staggerItem",
  threshold = 0.1,
  triggerOnce = true,
  delay = 0,
}: StaggeredAnimationProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: triggerOnce,
    margin: `-${threshold * 100}%`,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
        duration: 0.6,
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
        <motion.div key={index} variants={advancedVariants[itemVariant]}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

interface ParallaxElementProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  direction?: "vertical" | "horizontal";
  offset?: number;
  scale?: boolean;
  rotate?: boolean;
}

export function ParallaxElement({
  children,
  className,
  speed = 0.5,
  direction = "vertical",
  offset = 100,
  scale = false,
  rotate = false,
}: ParallaxElementProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Create smooth spring animations
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };

  const y = useSpring(
    useTransform(scrollYProgress, [0, 1], [offset * speed, -offset * speed]),
    springConfig
  );

  const x = useSpring(
    useTransform(scrollYProgress, [0, 1], [offset * speed, -offset * speed]),
    springConfig
  );

  const scaleValue = useSpring(
    useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]),
    springConfig
  );

  const rotateValue = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 360]),
    springConfig
  );

  const motionStyle: any = {};

  if (direction === "vertical") {
    motionStyle.y = y;
  } else {
    motionStyle.x = x;
  }

  if (scale) {
    motionStyle.scale = scaleValue;
  }

  if (rotate) {
    motionStyle.rotate = rotateValue;
  }

  return (
    <motion.div
      ref={ref}
      className={cn("relative", className)}
      style={motionStyle}
    >
      {children}
    </motion.div>
  );
}

interface ScrollProgressIndicatorProps {
  className?: string;
  color?: string;
  height?: number;
  position?: "top" | "bottom";
}

export function ScrollProgressIndicator({
  className,
  color = "#ffff00",
  height = 4,
  position = "top",
}: ScrollProgressIndicatorProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className={cn(
        "fixed right-0 left-0 z-50 origin-left",
        position === "top" ? "top-0" : "bottom-0",
        className
      )}
      style={{
        scaleX,
        height: `${height}px`,
        backgroundColor: color,
      }}
    />
  );
}

interface SmoothPageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function SmoothPageTransition({
  children,
  className,
}: SmoothPageTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={className}
        variants={advancedVariants.pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

interface MagneticElementProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  restoreSpeed?: number;
}

export function MagneticElement({
  children,
  className,
  strength = 0.3,
  restoreSpeed = 0.15,
}: MagneticElementProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      x.set(deltaX);
      y.set(deltaY);
    },
    [strength, x, y]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        x: springX,
        y: springY,
      }}
    >
      {children}
    </motion.div>
  );
}

interface ReducedMotionWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ReducedMotionWrapper({
  children,
  fallback,
}: ReducedMotionWrapperProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  if (prefersReducedMotion) {
    return <>{fallback || children}</>;
  }

  return <>{children}</>;
}

// Advanced scroll-triggered counter animation
interface AnimatedCounterProps {
  value: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  threshold?: number;
}

export function AnimatedCounter({
  value,
  duration = 2,
  delay = 0,
  suffix = "",
  prefix = "",
  className,
  threshold = 0.3,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const isInView = useInView(ref, {
    once: true,
    margin: `-${threshold * 100}%`,
  });

  useEffect(() => {
    if (!isInView) return;

    const timer = setTimeout(() => {
      let startTime: number;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min(
          (currentTime - startTime) / (duration * 1000),
          1
        );

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentCount = Math.floor(easeOutQuart * value);

        setCount(currentCount);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(value);
        }
      };

      requestAnimationFrame(animate);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [isInView, value, duration, delay]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// Export all components
export { advancedVariants, advancedEasing };
