"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScrollProgressProps {
  className?: string;
  showPercentage?: boolean;
  color?: "accent" | "white" | "primary";
  height?: "thin" | "medium" | "thick";
  position?: "top" | "bottom";
  smooth?: boolean;
}

export function ScrollProgress({
  className = "",
  showPercentage = false,
  color = "accent",
  height = "thin",
  position = "top",
  smooth = true,
}: ScrollProgressProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();

  // Smooth spring animation for progress
  const springConfig = {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  };

  const scaleX = useSpring(
    scrollYProgress,
    smooth ? springConfig : { duration: 0 }
  );

  // Show progress indicator after scrolling past hero section
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > window.innerHeight * 0.2;
      setIsVisible(scrolled);
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledHandleScroll, { passive: true });
    return () => window.removeEventListener("scroll", throttledHandleScroll);
  }, []);

  const colorClasses = {
    accent: "bg-brutalist-yellow",
    white: "bg-white",
    primary: "bg-black",
  };

  const heightClasses = {
    thin: "h-1",
    medium: "h-2",
    thick: "h-1",
  };

  const positionClasses = {
    top: "top-0",
    bottom: "bottom-0",
  };

  return (
    <motion.div
      className={cn(
        "fixed right-0 left-0 z-50 origin-left",
        positionClasses[position],
        className
      )}
      initial={{ opacity: 0, scaleY: 0 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scaleY: isVisible ? 1 : 0,
      }}
      transition={{
        duration: 0.3,
        ease: "easeOut",
      }}
    >
      {/* Background track */}
      <div
        className={cn(
          "w-full bg-black/20 backdrop-blur-sm",
          heightClasses[height]
        )}
      />

      {/* Progress bar */}
      <motion.div
        className={cn(
          "absolute top-0 left-0 origin-left",
          colorClasses[color],
          heightClasses[height],
          "shadow-[0_0_10px_rgba(255,255,0,0.5)]"
        )}
        style={{ scaleX }}
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
          <motion.span>{Math.round(scrollYProgress.get() * 100)}%</motion.span>
        </motion.div>
      )}
    </motion.div>
  );
}
