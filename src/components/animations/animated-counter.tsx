"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedCounterProps {
  end: number;
  start?: number;
  duration?: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  decimals?: number;
  separator?: string;
  easingFunction?: "easeOut" | "easeIn" | "easeInOut" | "bounce" | "sharp";
  onComplete?: () => void;
  onStart?: () => void;
  ariaLabel?: string;
}

// Enhanced easing functions for sophisticated animations
const easingFunctions = {
  easeOut: [0.4, 0, 0.2, 1] as const,
  easeIn: [0.4, 0, 1, 1] as const,
  easeInOut: [0.4, 0, 0.2, 1] as const,
  bounce: [0.68, -0.55, 0.265, 1.55] as const,
  sharp: [0.4, 0, 0.6, 1] as const,
};

export function AnimatedCounter({
  end,
  start = 0,
  duration = 2000,
  delay = 0,
  prefix = "",
  suffix = "",
  className = "",
  decimals = 0,
  separator = ",",
  easingFunction = "easeOut",
  onComplete,
  onStart,
  ariaLabel,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(start);
  const [hasStarted, setHasStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const shouldReduceMotion = useReducedMotion();

  const motionValue = useMotionValue(start);
  const springValue = useSpring(motionValue, {
    duration: shouldReduceMotion ? 0 : duration,
    bounce: easingFunction === "bounce" ? 0.25 : 0,
    damping: easingFunction === "bounce" ? 15 : 25,
    stiffness: easingFunction === "sharp" ? 300 : 200,
  });

  useEffect(() => {
    if (isInView && !hasStarted) {
      const timeout = setTimeout(
        () => {
          setHasStarted(true);
          if (onStart) {
            onStart();
          }

          // For reduced motion, set value immediately
          if (shouldReduceMotion) {
            setDisplayValue(end);
            setIsComplete(true);
            if (onComplete) {
              onComplete();
            }
          } else {
            motionValue.set(end);
          }
        },
        shouldReduceMotion ? 0 : delay
      );

      return () => clearTimeout(timeout);
    }
  }, [
    isInView,
    hasStarted,
    delay,
    motionValue,
    end,
    shouldReduceMotion,
    onStart,
    onComplete,
  ]);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(latest);
    });

    const unsubscribeComplete = springValue.on("animationComplete", () => {
      setIsComplete(true);
      if (onComplete) {
        onComplete();
      }
    });

    return () => {
      unsubscribe();
      unsubscribeComplete();
    };
  }, [springValue, onComplete, shouldReduceMotion]);

  const formatNumber = (num: number): string => {
    const rounded = Number(num.toFixed(decimals));

    if (separator && rounded >= 1000) {
      return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    }

    return rounded.toString();
  };

  return (
    <motion.span
      ref={ref}
      className={cn(
        "inline-block tabular-nums transition-colors duration-300",
        isComplete && "text-brutalist-yellow",
        className
      )}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={
        hasStarted
          ? { opacity: 1, scale: 1, y: 0 }
          : { opacity: 0, scale: 0.8, y: 20 }
      }
      transition={{
        duration: shouldReduceMotion ? 0 : 0.6,
        delay: shouldReduceMotion ? 0 : delay / 1000,
        ease: easingFunctions[easingFunction],
      }}
      aria-label={
        ariaLabel || `${prefix}${formatNumber(displayValue)}${suffix}`
      }
      role="status"
      aria-live="polite"
    >
      {prefix}
      {formatNumber(displayValue)}
      {suffix}
    </motion.span>
  );
}

interface CounterGridProps {
  counters: Array<{
    label: string;
    value: number;
    prefix?: string;
    suffix?: string;
    decimals?: number;
    ariaLabel?: string;
  }>;
  className?: string;
  counterClassName?: string;
  labelClassName?: string;
  staggerDelay?: number;
  duration?: number;
  easingFunction?: "easeOut" | "easeIn" | "easeInOut" | "bounce" | "sharp";
  columns?: 1 | 2 | 3 | 4;
  onAllComplete?: () => void;
}

export function CounterGrid({
  counters,
  className = "",
  counterClassName = "",
  labelClassName = "",
  staggerDelay = 200,
  duration = 2000,
  easingFunction = "easeOut",
  columns = 2,
  onAllComplete,
}: CounterGridProps) {
  const [completedCount, setCompletedCount] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const handleCounterComplete = () => {
    setCompletedCount((prev) => {
      const newCount = prev + 1;
      if (newCount === counters.length && onAllComplete) {
        onAllComplete();
      }
      return newCount;
    });
  };

  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-4 lg:gap-6", gridCols[columns], className)}>
      {counters.map((counter, index) => (
        <motion.div
          key={counter.label}
          className="group hover:bg-brutalist-yellow relative overflow-hidden border-4 border-white bg-black/50 p-4 text-center backdrop-blur-sm transition-all duration-300 hover:text-black lg:p-6"
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          whileHover={{
            scale: shouldReduceMotion ? 1 : 1.02,
            y: shouldReduceMotion ? 0 : -2,
          }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.6,
            delay: shouldReduceMotion ? 0 : index * (staggerDelay / 1000),
            ease: easingFunctions[easingFunction],
          }}
        >
          {/* Decorative corner elements */}
          <div className="bg-brutalist-yellow absolute -top-1 -left-1 h-3 w-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="bg-brutalist-yellow absolute -top-1 -right-1 h-3 w-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="bg-brutalist-yellow absolute -bottom-1 -left-1 h-3 w-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="bg-brutalist-yellow absolute -right-1 -bottom-1 h-3 w-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="space-y-2">
            <AnimatedCounter
              end={counter.value}
              duration={duration}
              delay={index * staggerDelay}
              prefix={counter.prefix}
              suffix={counter.suffix}
              decimals={counter.decimals}
              easingFunction={easingFunction}
              onComplete={handleCounterComplete}
              ariaLabel={counter.ariaLabel}
              className={cn(
                "text-brutalist-yellow block font-mono text-2xl font-bold transition-colors duration-300 group-hover:text-black lg:text-3xl",
                counterClassName
              )}
            />
            <div
              className={cn(
                "font-mono text-xs tracking-wider text-white uppercase transition-colors duration-300 group-hover:text-black lg:text-sm",
                labelClassName
              )}
            >
              {counter.label}
            </div>
          </div>

          {/* Progress indicator */}
          <motion.div
            className="bg-brutalist-yellow absolute bottom-0 left-0 h-1"
            initial={{ width: "0%" }}
            animate={{ width: completedCount > index ? "100%" : "0%" }}
            transition={{ duration: 0.3, delay: 0.1 }}
          />
        </motion.div>
      ))}
    </div>
  );
}

interface ProgressCounterProps {
  end: number;
  start?: number;
  duration?: number;
  delay?: number;
  className?: string;
  barClassName?: string;
  textClassName?: string;
  showPercentage?: boolean;
  height?: number;
  label?: string;
  easingFunction?: "easeOut" | "easeIn" | "easeInOut" | "bounce" | "sharp";
  onComplete?: () => void;
}

// Advanced Metrics Showcase Component
interface MetricsShowcaseProps {
  metrics: Array<{
    label: string;
    value: number;
    prefix?: string;
    suffix?: string;
    decimals?: number;
    ariaLabel?: string;
    description?: string;
  }>;
  title?: string;
  className?: string;
  columns?: 1 | 2 | 3 | 4;
  staggerDelay?: number;
  duration?: number;
  easingFunction?: "easeOut" | "easeIn" | "easeInOut" | "bounce" | "sharp";
  showProgress?: boolean;
  onAllComplete?: () => void;
}

export function MetricsShowcase({
  metrics,
  title,
  className = "",
  columns = 2,
  staggerDelay = 150,
  duration = 2500,
  easingFunction = "easeOut",
  showProgress = false,
  onAllComplete,
}: MetricsShowcaseProps) {
  const [completedCount, setCompletedCount] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const handleMetricComplete = () => {
    setCompletedCount((prev) => {
      const newCount = prev + 1;
      if (newCount === metrics.length && onAllComplete) {
        setTimeout(onAllComplete, 300); // Small delay for better UX
      }
      return newCount;
    });
  };

  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 lg:grid-cols-4",
  };

  return (
    <motion.div
      className={cn("space-y-8", className)}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      {title && (
        <motion.h3
          className="font-mono text-2xl font-bold tracking-wider text-white uppercase lg:text-3xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: easingFunctions[easingFunction] }}
        >
          {title}
        </motion.h3>
      )}

      <div className={cn("grid gap-6 lg:gap-8", gridCols[columns])}>
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            className="group hover:border-brutalist-yellow hover:bg-brutalist-yellow/10 relative overflow-hidden border-4 border-white bg-black/60 backdrop-blur-sm transition-all duration-500"
            initial={{ opacity: 0, y: 40, rotateX: 15 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{
              scale: shouldReduceMotion ? 1 : 1.02,
              y: shouldReduceMotion ? 0 : -4,
              rotateX: shouldReduceMotion ? 0 : -2,
            }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.7,
              delay: shouldReduceMotion ? 0 : index * (staggerDelay / 1000),
              ease: easingFunctions[easingFunction],
            }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="from-brutalist-yellow/20 h-full w-full bg-gradient-to-br to-transparent" />
              <motion.div
                className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,0,0.1)_25%,rgba(255,255,0,0.1)_50%,transparent_50%,transparent_75%,rgba(255,255,0,0.1)_75%)] bg-[length:20px_20px]"
                animate={{ x: [0, 20], y: [0, 20] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
            </div>

            <div className="relative p-6 lg:p-8">
              {/* Counter */}
              <div className="mb-4 text-center">
                <AnimatedCounter
                  end={metric.value}
                  duration={duration}
                  delay={index * staggerDelay}
                  prefix={metric.prefix}
                  suffix={metric.suffix}
                  decimals={metric.decimals}
                  easingFunction={easingFunction}
                  onComplete={handleMetricComplete}
                  ariaLabel={metric.ariaLabel}
                  className="text-brutalist-yellow block font-mono text-3xl font-black transition-all duration-300 group-hover:scale-110 lg:text-4xl xl:text-5xl"
                />
              </div>

              {/* Label */}
              <div className="mb-2 text-center">
                <h4 className="group-hover:text-brutalist-yellow font-mono text-sm font-bold tracking-widest text-white uppercase transition-colors duration-300 lg:text-base">
                  {metric.label}
                </h4>
              </div>

              {/* Description */}
              {metric.description && (
                <p className="text-center text-xs text-gray-300 transition-colors duration-300 group-hover:text-white lg:text-sm">
                  {metric.description}
                </p>
              )}

              {/* Progress indicator */}
              {showProgress && (
                <motion.div
                  className="bg-brutalist-yellow absolute bottom-0 left-0 h-1"
                  initial={{ width: "0%" }}
                  animate={{ width: completedCount > index ? "100%" : "0%" }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
              )}

              {/* Corner decorations */}
              <div className="border-brutalist-yellow absolute -top-2 -left-2 h-4 w-4 border-t-4 border-l-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="border-brutalist-yellow absolute -top-2 -right-2 h-4 w-4 border-t-4 border-r-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="border-brutalist-yellow absolute -bottom-2 -left-2 h-4 w-4 border-b-4 border-l-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="border-brutalist-yellow absolute -right-2 -bottom-2 h-4 w-4 border-r-4 border-b-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Completion indicator */}
      {completedCount === metrics.length && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "backOut" }}
        >
          <div className="border-brutalist-yellow bg-brutalist-yellow/10 text-brutalist-yellow inline-flex items-center space-x-2 rounded-none border-2 px-4 py-2 font-mono text-sm font-bold">
            <motion.div
              className="bg-brutalist-yellow h-2 w-2 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span>ALL METRICS LOADED</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export function ProgressCounter({
  end,
  start = 0,
  duration = 2000,
  delay = 0,
  className = "",
  barClassName = "",
  textClassName = "",
  showPercentage = true,
  height = 8,
  label,
  easingFunction = "easeOut",
  onComplete,
}: ProgressCounterProps) {
  const [progress, setProgress] = useState(start);
  const [hasStarted, setHasStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const shouldReduceMotion = useReducedMotion();

  const motionValue = useMotionValue(start);
  const springValue = useSpring(motionValue, {
    duration: shouldReduceMotion ? 0 : duration,
    bounce: easingFunction === "bounce" ? 0.25 : 0,
    damping: easingFunction === "bounce" ? 15 : 25,
    stiffness: easingFunction === "sharp" ? 300 : 200,
  });

  useEffect(() => {
    if (isInView && !hasStarted) {
      const timeout = setTimeout(
        () => {
          setHasStarted(true);

          if (shouldReduceMotion) {
            setProgress(end);
            setIsComplete(true);
            if (onComplete) {
              onComplete();
            }
          } else {
            motionValue.set(end);
          }
        },
        shouldReduceMotion ? 0 : delay
      );

      return () => clearTimeout(timeout);
    }
  }, [
    isInView,
    hasStarted,
    delay,
    motionValue,
    end,
    shouldReduceMotion,
    onComplete,
  ]);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const unsubscribe = springValue.on("change", (latest) => {
      setProgress(latest);
    });

    const unsubscribeComplete = springValue.on("animationComplete", () => {
      setIsComplete(true);
      if (onComplete) {
        onComplete();
      }
    });

    return () => {
      unsubscribe();
      unsubscribeComplete();
    };
  }, [springValue, shouldReduceMotion, onComplete]);

  const percentage = Math.min(Math.max((progress / 100) * 100, 0), 100);

  return (
    <div
      ref={ref}
      className={cn("w-full", className)}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div className="mb-2 flex items-center justify-between">
        {label && (
          <span
            className={cn(
              "font-mono text-sm font-medium text-white",
              textClassName
            )}
          >
            {label}
          </span>
        )}
        {showPercentage && (
          <AnimatedCounter
            end={end}
            start={start}
            duration={duration}
            delay={delay}
            suffix="%"
            easingFunction={easingFunction}
            className={cn(
              "text-brutalist-yellow font-mono text-sm font-bold",
              textClassName
            )}
          />
        )}
      </div>
      <div
        className={cn(
          "relative w-full overflow-hidden border-4 border-white bg-black/50",
          isComplete && "border-brutalist-yellow",
          barClassName
        )}
        style={{ height: `${height}px` }}
      >
        <motion.div
          className="bg-brutalist-yellow shadow-brutalist-sm h-full"
          initial={{ width: "0%" }}
          animate={hasStarted ? { width: `${percentage}%` } : { width: "0%" }}
          transition={{
            duration: shouldReduceMotion ? 0 : duration / 1000,
            delay: shouldReduceMotion ? 0 : delay / 1000,
            ease: easingFunctions[easingFunction],
          }}
        />

        {/* Animated shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: "-100%" }}
          animate={hasStarted ? { x: "100%" } : { x: "-100%" }}
          transition={{
            duration: shouldReduceMotion ? 0 : 1.5,
            delay: shouldReduceMotion ? 0 : (delay + duration * 0.3) / 1000,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
}
