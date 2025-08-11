"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

// Brutalist loading spinner
interface BrutalistSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  color?: "yellow" | "white" | "black";
}

export function BrutalistSpinner({
  size = "md",
  className = "",
  color = "yellow",
}: BrutalistSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-4",
    lg: "h-12 w-12 border-4",
    xl: "h-16 w-16 border-6",
  };

  const colorClasses = {
    yellow: "border-brutalist-yellow border-t-transparent",
    white: "border-white border-t-transparent",
    black: "border-black border-t-transparent",
  };

  return (
    <motion.div
      className={cn(
        "rounded-none",
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

// Mechanical loading bars
interface MechanicalLoadingProps {
  className?: string;
  barCount?: number;
  color?: string;
}

export function MechanicalLoading({
  className = "",
  barCount = 5,
  color = "#FFFF00",
}: MechanicalLoadingProps) {
  const containerVariants: Variants = {
    animate: {
      transition: {
        staggerChildren: 0.1,
        repeat: Infinity,
        repeatType: "loop",
      },
    },
  };

  const barVariants: Variants = {
    animate: {
      scaleY: [1, 2, 1],
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <motion.div
      className={cn("flex items-end space-x-1", className)}
      variants={containerVariants}
      animate="animate"
    >
      {Array.from({ length: barCount }).map((_, index) => (
        <motion.div
          key={index}
          className="h-8 w-2 border-2 border-black"
          style={{ backgroundColor: color }}
          variants={barVariants}
        />
      ))}
    </motion.div>
  );
}

// Glitch loading effect
interface GlitchLoadingProps {
  text?: string;
  className?: string;
}

export function GlitchLoading({
  text = "LOADING",
  className = "",
}: GlitchLoadingProps) {
  const glitchVariants: Variants = {
    animate: {
      x: [0, -2, 2, -1, 1, 0],
      y: [0, 1, -1, 2, -2, 0],
      skewX: [0, -1, 1, -0.5, 0.5, 0],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatType: "loop",
      },
    },
  };

  return (
    <div className={cn("relative font-mono text-2xl font-bold", className)}>
      <motion.span
        className="relative z-10 text-white"
        variants={glitchVariants}
        animate="animate"
      >
        {text}
      </motion.span>
      <motion.span
        className="absolute top-0 left-0 text-red-500"
        animate={{
          x: [-1, 1, -1],
          opacity: [0.8, 0.6, 0.8],
        }}
        transition={{
          duration: 0.2,
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        {text}
      </motion.span>
      <motion.span
        className="absolute top-0 left-0 text-blue-500"
        animate={{
          x: [1, -1, 1],
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{
          duration: 0.3,
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        {text}
      </motion.span>
    </div>
  );
}

// Brutalist progress bar
interface BrutalistProgressBarProps {
  progress: number;
  className?: string;
  showPercentage?: boolean;
  animated?: boolean;
}

export function BrutalistProgressBar({
  progress,
  className = "",
  showPercentage = true,
  animated = true,
}: BrutalistProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={cn("w-full", className)}>
      {showPercentage && (
        <div className="mb-2 flex justify-between font-mono text-sm font-bold">
          <span>PROGRESS</span>
          <span>{Math.round(clampedProgress)}%</span>
        </div>
      )}
      <div className="h-4 border-4 border-white bg-black">
        <motion.div
          className="bg-brutalist-yellow h-full"
          initial={{ width: "0%" }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{
            duration: animated ? 0.5 : 0,
            ease: [0.4, 0, 0.2, 1],
          }}
        />
      </div>
    </div>
  );
}

// Skeleton loading with brutalist style
interface BrutalistSkeletonProps {
  className?: string;
  lines?: number;
  animated?: boolean;
}

export function BrutalistSkeleton({
  className = "",
  lines = 3,
  animated = true,
}: BrutalistSkeletonProps) {
  const skeletonVariants: Variants = {
    animate: {
      opacity: [0.3, 0.7, 0.3],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <motion.div
          key={index}
          className="h-4 border-4 border-white bg-gray-800"
          style={{
            width: `${Math.random() * 40 + 60}%`,
          }}
          variants={animated ? skeletonVariants : undefined}
          animate={animated ? "animate" : undefined}
        />
      ))}
    </div>
  );
}

// Typewriter loading effect
interface TypewriterLoadingProps {
  texts: string[];
  className?: string;
  speed?: number;
}

export function TypewriterLoading({
  texts,
  className = "",
  speed = 100,
}: TypewriterLoadingProps) {
  const [currentTextIndex, setCurrentTextIndex] = React.useState(0);
  const [currentText, setCurrentText] = React.useState("");
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    const fullText = texts[currentTextIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (currentText.length < fullText.length) {
            setCurrentText(fullText.substring(0, currentText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), 1000);
          }
        } else {
          if (currentText.length > 0) {
            setCurrentText(fullText.substring(0, currentText.length - 1));
          } else {
            setIsDeleting(false);
            setCurrentTextIndex((prev) => (prev + 1) % texts.length);
          }
        }
      },
      isDeleting ? speed / 2 : speed
    );

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentTextIndex, texts, speed]);

  return (
    <div className={cn("font-mono font-bold", className)}>
      <span>{currentText}</span>
      <motion.span
        className="bg-brutalist-yellow ml-1 inline-block h-6 w-1"
        animate={{ opacity: [1, 0] }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    </div>
  );
}

// Brutalist loading overlay
interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
  loadingComponent?: React.ReactNode;
  blur?: boolean;
}

export function LoadingOverlay({
  isLoading,
  children,
  className = "",
  loadingComponent,
  blur = true,
}: LoadingOverlayProps) {
  const defaultLoadingComponent = (
    <div className="flex flex-col items-center space-y-4">
      <BrutalistSpinner size="lg" />
      <GlitchLoading text="LOADING..." />
    </div>
  );

  return (
    <div className={cn("relative", className)}>
      {children}
      {isLoading && (
        <motion.div
          className={cn(
            "absolute inset-0 z-50 flex items-center justify-center bg-black/90",
            blur && "backdrop-blur-sm"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {loadingComponent || defaultLoadingComponent}
        </motion.div>
      )}
    </div>
  );
}

// Pulse loading dots
interface PulseDotsProps {
  className?: string;
  dotCount?: number;
  color?: string;
}

export function PulseDots({
  className = "",
  dotCount = 3,
  color = "#FFFF00",
}: PulseDotsProps) {
  const containerVariants: Variants = {
    animate: {
      transition: {
        staggerChildren: 0.2,
        repeat: Infinity,
        repeatType: "loop",
      },
    },
  };

  const dotVariants: Variants = {
    animate: {
      scale: [1, 1.5, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 0.8,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      className={cn("flex space-x-2", className)}
      variants={containerVariants}
      animate="animate"
    >
      {Array.from({ length: dotCount }).map((_, index) => (
        <motion.div
          key={index}
          className="h-3 w-3 border-2 border-black"
          style={{ backgroundColor: color }}
          variants={dotVariants}
        />
      ))}
    </motion.div>
  );
}

// Matrix-style loading effect
interface MatrixLoadingProps {
  className?: string;
  text?: string;
}

export function MatrixLoading({
  className = "",
  text = "INITIALIZING SYSTEM...",
}: MatrixLoadingProps) {
  const [displayText, setDisplayText] = React.useState("");
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(text.substring(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 100);

      return () => clearTimeout(timeout);
    } else {
      // Reset after completion
      const resetTimeout = setTimeout(() => {
        setDisplayText("");
        setCurrentIndex(0);
      }, 2000);

      return () => clearTimeout(resetTimeout);
    }
  }, [currentIndex, text]);

  return (
    <div className={cn("font-mono text-green-400", className)}>
      <span>{displayText}</span>
      <motion.span
        className="ml-1 inline-block h-4 w-2 bg-green-400"
        animate={{ opacity: [1, 0] }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    </div>
  );
}

// Brutalist card loading state
interface CardLoadingProps {
  className?: string;
  showImage?: boolean;
  showTitle?: boolean;
  showContent?: boolean;
}

export function CardLoading({
  className = "",
  showImage = true,
  showTitle = true,
  showContent = true,
}: CardLoadingProps) {
  return (
    <div className={cn("border-4 border-white bg-black p-6", className)}>
      {showImage && <BrutalistSkeleton className="mb-4" lines={1} animated />}
      {showTitle && (
        <div className="mb-4">
          <BrutalistSkeleton lines={1} animated />
        </div>
      )}
      {showContent && <BrutalistSkeleton lines={3} animated />}
    </div>
  );
}
