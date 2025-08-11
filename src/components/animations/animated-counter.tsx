"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
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
  onComplete?: () => void;
}

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
  onComplete,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(start);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const motionValue = useMotionValue(start);
  const springValue = useSpring(motionValue, {
    duration: duration,
    bounce: 0,
  });

  useEffect(() => {
    if (isInView && !hasStarted) {
      const timeout = setTimeout(() => {
        setHasStarted(true);
        motionValue.set(end);
      }, delay);

      return () => clearTimeout(timeout);
    }
  }, [isInView, hasStarted, delay, motionValue, end]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(latest);
    });

    const unsubscribeComplete = springValue.on("animationComplete", () => {
      if (onComplete) {
        onComplete();
      }
    });

    return () => {
      unsubscribe();
      unsubscribeComplete();
    };
  }, [springValue, onComplete]);

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
      className={cn("inline-block tabular-nums", className)}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={
        hasStarted ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }
      }
      transition={{
        duration: 0.5,
        delay: delay / 1000,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
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
  }>;
  className?: string;
  counterClassName?: string;
  labelClassName?: string;
  staggerDelay?: number;
  duration?: number;
}

export function CounterGrid({
  counters,
  className = "",
  counterClassName = "",
  labelClassName = "",
  staggerDelay = 200,
  duration = 2000,
}: CounterGridProps) {
  return (
    <div className={cn("grid gap-4", className)}>
      {counters.map((counter, index) => (
        <motion.div
          key={counter.label}
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{
            duration: 0.6,
            delay: index * (staggerDelay / 1000),
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <AnimatedCounter
            end={counter.value}
            duration={duration}
            delay={index * staggerDelay}
            prefix={counter.prefix}
            suffix={counter.suffix}
            decimals={counter.decimals}
            className={cn("block text-4xl font-bold", counterClassName)}
          />
          <div
            className={cn(
              "mt-2 text-sm tracking-wide uppercase",
              labelClassName
            )}
          >
            {counter.label}
          </div>
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
}: ProgressCounterProps) {
  const [progress, setProgress] = useState(start);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const motionValue = useMotionValue(start);
  const springValue = useSpring(motionValue, {
    duration: duration,
    bounce: 0,
  });

  useEffect(() => {
    if (isInView && !hasStarted) {
      const timeout = setTimeout(() => {
        setHasStarted(true);
        motionValue.set(end);
      }, delay);

      return () => clearTimeout(timeout);
    }
  }, [isInView, hasStarted, delay, motionValue, end]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setProgress(latest);
    });

    return () => unsubscribe();
  }, [springValue]);

  const percentage = Math.min(Math.max((progress / 100) * 100, 0), 100);

  return (
    <div ref={ref} className={cn("w-full", className)}>
      <div className="mb-2 flex items-center justify-between">
        {showPercentage && (
          <AnimatedCounter
            end={end}
            start={start}
            duration={duration}
            delay={delay}
            suffix="%"
            className={cn("font-mono text-sm font-bold", textClassName)}
          />
        )}
      </div>
      <div
        className={cn("w-full border-2 border-white bg-gray-800", barClassName)}
        style={{ height: `${height}px` }}
      >
        <motion.div
          className="bg-brutalist-yellow h-full"
          initial={{ width: "0%" }}
          animate={hasStarted ? { width: `${percentage}%` } : { width: "0%" }}
          transition={{
            duration: duration / 1000,
            delay: delay / 1000,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        />
      </div>
    </div>
  );
}
