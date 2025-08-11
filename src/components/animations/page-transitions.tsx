"use client";

import React from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// Page transition variants with brutalist aesthetic
const pageVariants: Variants = {
  initial: {
    opacity: 0,
    x: 100,
    scale: 0.95,
  },
  in: {
    opacity: 1,
    x: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    x: -100,
    scale: 1.05,
  },
};

const brutalistPageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 50,
    rotateX: -15,
  },
  in: {
    opacity: 1,
    y: 0,
    rotateX: 0,
  },
  out: {
    opacity: 0,
    y: -50,
    rotateX: 15,
  },
};

const slideVariants: Variants = {
  initial: {
    x: "100%",
  },
  in: {
    x: "0%",
  },
  out: {
    x: "-100%",
  },
};

const scaleVariants: Variants = {
  initial: {
    scale: 0.8,
    opacity: 0,
  },
  in: {
    scale: 1,
    opacity: 1,
  },
  out: {
    scale: 1.2,
    opacity: 0,
  },
};

// Transition configurations
const pageTransition = {
  type: "tween" as const,
  ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
  duration: 0.4,
};

const brutalistTransition = {
  type: "tween" as const,
  ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
  duration: 0.3,
};

const slideTransition = {
  type: "tween" as const,
  ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
  duration: 0.5,
};

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "brutalist" | "slide" | "scale";
}

export function PageTransition({
  children,
  className,
  variant = "brutalist",
}: PageTransitionProps) {
  const pathname = usePathname();

  const getVariants = () => {
    switch (variant) {
      case "brutalist":
        return brutalistPageVariants;
      case "slide":
        return slideVariants;
      case "scale":
        return scaleVariants;
      default:
        return pageVariants;
    }
  };

  const getTransition = () => {
    switch (variant) {
      case "brutalist":
        return brutalistTransition;
      case "slide":
        return slideTransition;
      default:
        return pageTransition;
    }
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        className={cn("", className)}
        variants={getVariants()}
        initial="initial"
        animate="in"
        exit="out"
        transition={getTransition()}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

interface RouteTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function RouteTransition({ children, className }: RouteTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        className={cn("", className)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          type: "tween",
          ease: [0.25, 0.46, 0.45, 0.94],
          duration: 0.3,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Loading transition overlay
interface LoadingTransitionProps {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
}

export function LoadingTransition({
  isLoading,
  children,
  className,
}: LoadingTransitionProps) {
  return (
    <div className={cn("relative", className)}>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center space-x-4">
              <div className="border-t-brutalist-yellow h-8 w-8 animate-spin border-4 border-white"></div>
              <span className="font-mono text-sm font-bold tracking-wide text-white uppercase">
                Loading...
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </div>
  );
}

// Page transition wrapper with loading states
interface TransitionWrapperProps {
  children: React.ReactNode;
  isLoading?: boolean;
  className?: string;
  variant?: "default" | "brutalist" | "slide" | "scale";
}

export function TransitionWrapper({
  children,
  isLoading = false,
  className,
  variant = "brutalist",
}: TransitionWrapperProps) {
  return (
    <LoadingTransition isLoading={isLoading} className={className}>
      <PageTransition variant={variant}>{children}</PageTransition>
    </LoadingTransition>
  );
}

// Staggered page content animation
interface StaggeredPageContentProps {
  children: React.ReactNode[];
  className?: string;
  staggerDelay?: number;
}

export function StaggeredPageContent({
  children,
  className,
  staggerDelay = 0.1,
}: StaggeredPageContentProps) {
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

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "tween",
        ease: [0.25, 0.46, 0.45, 0.94],
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      className={cn("", className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {children.map((child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
