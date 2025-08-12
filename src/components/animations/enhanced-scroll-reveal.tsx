"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
  Variants,
  Transition,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface EnhancedScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "scale" | "fade" | "rotate";
  distance?: number;
  threshold?: number;
  once?: boolean;
  rootMargin?: string;
  stagger?: boolean;
  staggerDelay?: number;
  brutalistEffect?: boolean;
}

const getEnhancedVariants = (
  direction: EnhancedScrollRevealProps["direction"],
  distance: number,
  brutalistEffect: boolean = false
): Variants => {
  const baseTransition: Transition = {
    duration: 0.8,
    ease: brutalistEffect ? [0.4, 0, 0.2, 1] : [0.25, 0.46, 0.45, 0.94],
  };

  const brutalistTransform = brutalistEffect ? { rotateX: 5, rotateY: 2 } : {};

  switch (direction) {
    case "up":
      return {
        hidden: {
          opacity: 0,
          y: distance,
          ...brutalistTransform,
        },
        visible: {
          opacity: 1,
          y: 0,
          rotateX: 0,
          rotateY: 0,
          transition: baseTransition,
        },
      };
    case "down":
      return {
        hidden: {
          opacity: 0,
          y: -distance,
          ...brutalistTransform,
        },
        visible: {
          opacity: 1,
          y: 0,
          rotateX: 0,
          rotateY: 0,
          transition: baseTransition,
        },
      };
    case "left":
      return {
        hidden: {
          opacity: 0,
          x: distance,
          ...brutalistTransform,
        },
        visible: {
          opacity: 1,
          x: 0,
          rotateX: 0,
          rotateY: 0,
          transition: baseTransition,
        },
      };
    case "right":
      return {
        hidden: {
          opacity: 0,
          x: -distance,
          ...brutalistTransform,
        },
        visible: {
          opacity: 1,
          x: 0,
          rotateX: 0,
          rotateY: 0,
          transition: baseTransition,
        },
      };
    case "scale":
      return {
        hidden: {
          opacity: 0,
          scale: 0.8,
          ...brutalistTransform,
        },
        visible: {
          opacity: 1,
          scale: 1,
          rotateX: 0,
          rotateY: 0,
          transition: baseTransition,
        },
      };
    case "rotate":
      return {
        hidden: {
          opacity: 0,
          rotate: brutalistEffect ? -10 : -5,
          scale: 0.9,
        },
        visible: {
          opacity: 1,
          rotate: 0,
          scale: 1,
          transition: baseTransition,
        },
      };
    case "fade":
    default:
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: baseTransition },
      };
  }
};

export function EnhancedScrollReveal({
  children,
  className = "",
  delay = 0,
  duration = 0.8,
  direction = "up",
  distance = 50,
  threshold = 0.1,
  once = true,
  rootMargin = "-50px",
  stagger = false,
  staggerDelay = 0.1,
  brutalistEffect = true,
}: EnhancedScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    margin: rootMargin as any,
    amount: threshold,
  });

  const variants = getEnhancedVariants(direction, distance, brutalistEffect);

  // Override duration and delay in variants
  const customVariants: Variants = {
    ...variants,
    visible: {
      ...variants.visible,
      transition: {
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  if (stagger && React.Children.count(children) > 1) {
    const containerVariants: Variants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay,
          delayChildren: delay,
        },
      },
    };

    return (
      <motion.div
        ref={ref}
        className={cn("", className)}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {React.Children.map(children, (child, index) => (
          <motion.div key={index} variants={customVariants}>
            {child}
          </motion.div>
        ))}
      </motion.div>
    );
  }

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

// Parallax scroll reveal with enhanced effects
interface ParallaxScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  direction?: "vertical" | "horizontal";
  scale?: boolean;
  rotate?: boolean;
  opacity?: boolean;
}

export function ParallaxScrollReveal({
  children,
  className = "",
  speed = 0.5,
  direction = "vertical",
  scale = false,
  rotate = false,
  opacity = false,
}: ParallaxScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Transform values based on scroll progress
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    direction === "vertical" ? [0, speed * -100] : [0, 0]
  );
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    direction === "horizontal" ? [0, speed * -100] : [0, 0]
  );
  const scaleValue = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    scale ? [0.8, 1, 1.2] : [1, 1, 1]
  );
  const rotateValue = useTransform(
    scrollYProgress,
    [0, 1],
    rotate ? [0, 360] : [0, 0]
  );
  const opacityValue = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    opacity ? [0, 1, 1, 0] : [1, 1, 1, 1]
  );

  // Spring animations for smoother motion
  const springY = useSpring(y, { stiffness: 100, damping: 30 });
  const springX = useSpring(x, { stiffness: 100, damping: 30 });
  const springScale = useSpring(scaleValue, { stiffness: 100, damping: 30 });
  const springRotate = useSpring(rotateValue, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      ref={ref}
      className={cn("", className)}
      style={{
        y: springY,
        x: springX,
        scale: springScale,
        rotate: springRotate,
        opacity: opacityValue,
      }}
    >
      {children}
    </motion.div>
  );
}

// Scroll-triggered counter with enhanced animations
interface ScrollCounterProps {
  end: number;
  start?: number;
  duration?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
  brutalistStyle?: boolean;
}

export function ScrollCounter({
  end,
  start = 0,
  duration = 2000,
  className = "",
  suffix = "",
  prefix = "",
  brutalistStyle = true,
}: ScrollCounterProps) {
  const [count, setCount] = useState(start);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView || hasStarted) return;

    setHasStarted(true);
    const startTime = Date.now();
    const startValue = start;
    const endValue = end;
    const totalChange = endValue - startValue;

    const animateCount = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Brutalist easing (more mechanical)
      const easeOut = brutalistStyle
        ? 1 - Math.pow(1 - progress, 2)
        : 1 - Math.pow(1 - progress, 3);

      const currentValue = startValue + totalChange * easeOut;
      setCount(Math.floor(currentValue));

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      } else {
        setCount(endValue);
      }
    };

    requestAnimationFrame(animateCount);
  }, [isInView, hasStarted, start, end, duration, brutalistStyle]);

  return (
    <motion.span
      ref={ref}
      className={cn("tabular-nums", className)}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={
        hasStarted ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }
      }
      transition={{
        type: "spring",
        stiffness: brutalistStyle ? 200 : 100,
        damping: brutalistStyle ? 20 : 30,
      }}
    >
      {prefix}
      {count}
      {suffix}
    </motion.span>
  );
}

// Multi-directional reveal for complex layouts
interface MultiDirectionalRevealProps {
  children: React.ReactNode[];
  className?: string;
  directions?: Array<"up" | "down" | "left" | "right" | "scale" | "fade">;
  staggerDelay?: number;
  brutalistEffect?: boolean;
}

export function MultiDirectionalReveal({
  children,
  className = "",
  directions = ["up", "left", "right", "down"],
  staggerDelay = 0.1,
  brutalistEffect = true,
}: MultiDirectionalRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={cn("", className)}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {children.map((child, index) => {
        const direction = directions[index % directions.length];
        const variants = getEnhancedVariants(direction, 50, brutalistEffect);

        return (
          <motion.div key={index} variants={variants}>
            {child}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

// Scroll-triggered text reveal with typewriter effect
interface ScrollTextRevealProps {
  text: string;
  className?: string;
  speed?: number;
  brutalistCursor?: boolean;
}

export function ScrollTextReveal({
  text,
  className = "",
  speed = 50,
  brutalistCursor = true,
}: ScrollTextRevealProps) {
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    setShowCursor(true);
    let currentIndex = 0;

    const typeInterval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayText(text.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => setShowCursor(false), 1000);
      }
    }, speed);

    return () => clearInterval(typeInterval);
  }, [isInView, text, speed]);

  return (
    <div ref={ref} className={cn("", className)}>
      <span>{displayText}</span>
      {showCursor && (
        <motion.span
          className={cn(
            "ml-1 inline-block w-1",
            brutalistCursor ? "bg-brutalist-yellow" : "bg-white"
          )}
          animate={{ opacity: [1, 0] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{ height: "1em" }}
        />
      )}
    </div>
  );
}
