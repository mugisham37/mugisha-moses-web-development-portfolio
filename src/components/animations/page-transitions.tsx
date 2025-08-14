"use client";

import React, { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useAnimation,
  type Variants,
} from "framer-motion";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// Page transition variants
const pageTransitionVariants: Record<string, Variants> = {
  // Slide transitions
  slideLeft: {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  },
  slideRight: {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  },
  slideUp: {
    initial: { y: "100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "-100%", opacity: 0 },
  },
  slideDown: {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },

  // Fade transitions
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  fadeScale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 },
  },

  // Scale transitions
  scaleCenter: {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 },
  },
  scaleCorner: {
    initial: { scale: 0, opacity: 0, transformOrigin: "top left" },
    animate: { scale: 1, opacity: 1, transformOrigin: "top left" },
    exit: { scale: 0, opacity: 0, transformOrigin: "top left" },
  },

  // Rotation transitions
  rotateIn: {
    initial: { rotate: -180, opacity: 0, scale: 0.5 },
    animate: { rotate: 0, opacity: 1, scale: 1 },
    exit: { rotate: 180, opacity: 0, scale: 0.5 },
  },

  // Flip transitions
  flipX: {
    initial: { rotateX: -90, opacity: 0 },
    animate: { rotateX: 0, opacity: 1 },
    exit: { rotateX: 90, opacity: 0 },
  },
  flipY: {
    initial: { rotateY: -90, opacity: 0 },
    animate: { rotateY: 0, opacity: 1 },
    exit: { rotateY: 90, opacity: 0 },
  },

  // Brutalist transitions
  brutalistSlam: {
    initial: {
      y: -100,
      opacity: 0,
      scale: 0.8,
      rotateX: -45,
      filter: "blur(10px)",
    },
    animate: {
      y: 0,
      opacity: 1,
      scale: 1,
      rotateX: 0,
      filter: "blur(0px)",
    },
    exit: {
      y: 100,
      opacity: 0,
      scale: 0.8,
      rotateX: 45,
      filter: "blur(10px)",
    },
  },
  brutalistPunch: {
    initial: {
      scale: 0,
      opacity: 0,
      rotate: -180,
      filter: "contrast(0)",
    },
    animate: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      filter: "contrast(1)",
    },
    exit: {
      scale: 0,
      opacity: 0,
      rotate: 180,
      filter: "contrast(0)",
    },
  },

  // Complex transitions
  morphSlide: {
    initial: {
      x: "100%",
      opacity: 0,
      borderRadius: "50%",
      scale: 0.5,
    },
    animate: {
      x: 0,
      opacity: 1,
      borderRadius: "0%",
      scale: 1,
    },
    exit: {
      x: "-100%",
      opacity: 0,
      borderRadius: "50%",
      scale: 0.5,
    },
  },
};

// Transition timing configurations
const transitionConfigs = {
  fast: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  normal: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  slow: { duration: 0.8, ease: [0.23, 1, 0.32, 1] },
  brutalist: { duration: 0.6, ease: [0.68, -0.55, 0.265, 1.55] },
  elastic: { duration: 1, ease: [0.34, 1.56, 0.64, 1] },
};

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  variant?: keyof typeof pageTransitionVariants;
  timing?: keyof typeof transitionConfigs;
  exitBeforeEnter?: boolean;
}

export function PageTransition({
  children,
  className,
  variant = "fade",
  timing = "normal",
  exitBeforeEnter = true,
}: PageTransitionProps) {
  const pathname = usePathname();
  const variants = pageTransitionVariants[variant];
  const transition = transitionConfigs[timing];

  return (
    <AnimatePresence mode={exitBeforeEnter ? "wait" : "sync"}>
      <motion.div
        key={pathname}
        className={cn("min-h-screen", className)}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={transition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Loading transition overlay
interface LoadingTransitionProps {
  isLoading: boolean;
  variant?: "fade" | "slide" | "scale" | "brutalist";
  message?: string;
  className?: string;
}

export function LoadingTransition({
  isLoading,
  variant = "fade",
  message = "Loading...",
  className,
}: LoadingTransitionProps) {
  const loadingVariants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slide: {
      initial: { y: "-100%" },
      animate: { y: 0 },
      exit: { y: "-100%" },
    },
    scale: {
      initial: { scale: 0, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0, opacity: 0 },
    },
    brutalist: {
      initial: {
        opacity: 0,
        scale: 0.5,
        rotate: -180,
        filter: "blur(10px)",
      },
      animate: {
        opacity: 1,
        scale: 1,
        rotate: 0,
        filter: "blur(0px)",
      },
      exit: {
        opacity: 0,
        scale: 0.5,
        rotate: 180,
        filter: "blur(10px)",
      },
    },
  };

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm",
            className
          )}
          variants={loadingVariants[variant]}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="text-center">
            <motion.div
              className="border-brutalist-yellow mx-auto mb-4 h-12 w-12 rounded-full border-4 border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <motion.p
              className="font-mono text-lg text-white"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {message}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Route transition with custom animations based on navigation direction
interface RouteTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function RouteTransition({ children, className }: RouteTransitionProps) {
  const pathname = usePathname();
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  useEffect(() => {
    // Simple heuristic for navigation direction
    // In a real app, you might track this more precisely
    const handlePopState = () => {
      setDirection("backward");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const variants = {
    initial: {
      x: direction === "forward" ? "100%" : "-100%",
      opacity: 0,
    },
    animate: {
      x: 0,
      opacity: 1,
    },
    exit: {
      x: direction === "forward" ? "-100%" : "100%",
      opacity: 0,
    },
  };

  return (
    <AnimatePresence mode="wait" onExitComplete={() => setDirection("forward")}>
      <motion.div
        key={pathname}
        className={className}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{
          duration: 0.5,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Staggered page content reveal
interface StaggeredPageRevealProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  initialDelay?: number;
}

export function StaggeredPageReveal({
  children,
  className,
  staggerDelay = 0.1,
  initialDelay = 0.2,
}: StaggeredPageRevealProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: initialDelay,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

// Section transition for smooth scrolling between sections
interface SectionTransitionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  background?: "light" | "dark" | "accent";
}

export function SectionTransition({
  children,
  className,
  id,
  background = "light",
}: SectionTransitionProps) {
  const backgroundClasses = {
    light: "bg-white text-black",
    dark: "bg-black text-white",
    accent: "bg-brutalist-yellow text-black",
  };

  return (
    <motion.section
      id={id}
      className={cn(
        "relative overflow-hidden",
        backgroundClasses[background],
        className
      )}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{
          duration: 0.8,
          delay: 0.2,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        {children}
      </motion.div>
    </motion.section>
  );
}

export { pageTransitionVariants, transitionConfigs };
