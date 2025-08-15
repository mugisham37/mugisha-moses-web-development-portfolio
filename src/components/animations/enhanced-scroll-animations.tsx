"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useAnimation, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScrollAnimationProps {
  children: React.ReactNode;
  className?: string;
  animation?:
    | "fadeIn"
    | "slideUp"
    | "slideDown"
    | "slideLeft"
    | "slideRight"
    | "scale"
    | "rotate"
    | "blur";
  delay?: number;
  duration?: number;
  threshold?: number;
  triggerOnce?: boolean;
  stagger?: boolean;
  staggerDelay?: number;
}

const animationVariants: Record<string, Variants> = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideUp: {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 },
  },
  slideDown: {
    hidden: { opacity: 0, y: -60 },
    visible: { opacity: 1, y: 0 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0 },
  },
  slideRight: {
    hidden: { opacity: 0, x: -60 },
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
  blur: {
    hidden: { opacity: 0, filter: "blur(10px)" },
    visible: { opacity: 1, filter: "blur(0px)" },
  },
};

export function ScrollAnimation({
  children,
  className = "",
  animation = "fadeIn",
  delay = 0,
  duration = 0.6,
  threshold = 0.1,
  triggerOnce = true,
  stagger = false,
  staggerDelay = 0.1,
}: ScrollAnimationProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    amount: threshold,
    once: triggerOnce,
  });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else if (!triggerOnce) {
      controls.start("hidden");
    }
  }, [isInView, controls, triggerOnce]);

  const variants = animationVariants[animation];

  const containerVariants = stagger
    ? {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delay,
          },
        },
      }
    : variants;

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
      transition={{
        duration,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: stagger ? 0 : delay,
      }}
    >
      {stagger
        ? React.Children.map(children, (child, index) => (
            <motion.div key={index} variants={variants}>
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}

interface ScrollStaggerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  delay?: number;
  animation?:
    | "fadeIn"
    | "slideUp"
    | "slideDown"
    | "slideLeft"
    | "slideRight"
    | "scale";
}

export function ScrollStagger({
  children,
  className = "",
  staggerDelay = 0.1,
  delay = 0,
  animation = "slideUp",
}: ScrollStaggerProps) {
  return (
    <ScrollAnimation
      className={className}
      animation={animation}
      delay={delay}
      stagger={true}
      staggerDelay={staggerDelay}
    >
      {children}
    </ScrollAnimation>
  );
}

interface ScrollCounterProps {
  end: number;
  start?: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  threshold?: number;
}

export function ScrollCounter({
  end,
  start = 0,
  duration = 2,
  delay = 0,
  suffix = "",
  prefix = "",
  className = "",
  threshold = 0.3,
}: ScrollCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(start);
  const [hasStarted, setHasStarted] = useState(false);
  const isInView = useInView(ref, { amount: threshold, once: true });

  useEffect(() => {
    if (isInView && !hasStarted) {
      setHasStarted(true);

      const timer = setTimeout(() => {
        const increment = (end - start) / (duration * 60); // 60fps
        let current = start;

        const counter = setInterval(() => {
          current += increment;
          if (current >= end) {
            setCount(end);
            clearInterval(counter);
          } else {
            setCount(Math.floor(current));
          }
        }, 1000 / 60);

        return () => clearInterval(counter);
      }, delay * 1000);

      return () => clearTimeout(timer);
    }
  }, [isInView, hasStarted, start, end, duration, delay]);

  return (
    <motion.span
      ref={ref}
      className={cn("font-mono font-bold", className)}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.6, delay }}
    >
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </motion.span>
  );
}

interface ScrollTypewriterProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  cursor?: boolean;
  threshold?: number;
}

export function ScrollTypewriter({
  text,
  delay = 0,
  speed = 50,
  className = "",
  cursor = true,
  threshold = 0.3,
}: ScrollTypewriterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(cursor);
  const [hasStarted, setHasStarted] = useState(false);
  const isInView = useInView(ref, { amount: threshold, once: true });

  useEffect(() => {
    if (isInView && !hasStarted) {
      setHasStarted(true);

      const timer = setTimeout(() => {
        let index = 0;
        const typeInterval = setInterval(() => {
          if (index < text.length) {
            setDisplayText(text.slice(0, index + 1));
            index++;
          } else {
            clearInterval(typeInterval);
            if (cursor) {
              // Blink cursor after typing is complete
              setInterval(() => {
                setShowCursor((prev) => !prev);
              }, 500);
            }
          }
        }, speed);

        return () => clearInterval(typeInterval);
      }, delay * 1000);

      return () => clearTimeout(timer);
    }
  }, [isInView, hasStarted, text, speed, delay, cursor]);

  return (
    <span ref={ref} className={cn("font-mono", className)}>
      {displayText}
      {cursor && showCursor && (
        <motion.span
          className="ml-1 inline-block h-5 w-0.5 bg-current"
          animate={{ opacity: [1, 0] }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      )}
    </span>
  );
}

interface ScrollProgressCircleProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
  color?: string;
  backgroundColor?: string;
}

export function ScrollProgressCircle({
  size = 60,
  strokeWidth = 4,
  className = "",
  color = "#FFFF00",
  backgroundColor = "rgba(255,255,255,0.1)",
}: ScrollProgressCircleProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      setProgress(Math.min(100, Math.max(0, scrollPercent)));
      setIsVisible(scrollTop > 200);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      className={cn("fixed right-8 bottom-8 z-50 cursor-pointer", className)}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0,
      }}
      transition={{ duration: 0.3 }}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <svg width={size} height={size} className="-rotate-90 transform">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 0.1s ease-out",
          }}
        />
      </svg>

      {/* Arrow icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 17l5-5 5 5" />
          <path d="M7 11l5-5 5 5" />
        </svg>
      </div>
    </motion.div>
  );
}
