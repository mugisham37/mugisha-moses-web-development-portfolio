"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

interface ScrollIndicatorProps {
  className?: string;
  text?: string;
  variant?: "default" | "minimal" | "animated";
  position?: "center" | "left" | "right";
  hideAfterScroll?: boolean;
  onClick?: () => void;
}

export function ScrollIndicator({
  className = "",
  text = "SCROLL DOWN",
  variant = "default",
  position = "center",
  hideAfterScroll = true,
  onClick,
}: ScrollIndicatorProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!hideAfterScroll) return;

    const handleScroll = () => {
      const scrolled = window.scrollY > 100;

      if (scrolled && isVisible) {
        setIsVisible(false);
      } else if (!scrolled && !isVisible) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hideAfterScroll, isVisible]);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Default behavior: scroll to next section
      const nextSection = document.querySelector("section:nth-of-type(2)");
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({
          top: window.innerHeight,
          behavior: "smooth",
        });
      }
    }
  };

  const positionClasses = {
    center: "left-1/2 -translate-x-1/2",
    left: "left-8",
    right: "right-8",
  };

  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.9,
    },
  };

  const containerTransition = {
    duration: 0.6,
    ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    delay: 0.5,
  };

  if (variant === "minimal") {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.button
            className={cn(
              "absolute bottom-8 z-10 cursor-pointer",
              "focus:ring-brutalist-yellow rounded-sm focus:ring-4 focus:outline-none",
              "transition-all duration-300 hover:scale-110",
              positionClasses[position],
              className
            )}
            onClick={handleClick}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={containerTransition}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Scroll down to next section"
          >
            <motion.div
              className="text-brutalist-yellow"
              animate={{
                y: [0, 8, 0],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
                repeatType: "reverse" as const,
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 13l5 5 5-5" />
                <path d="M7 6l5 5 5-5" />
              </svg>
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>
    );
  }

  if (variant === "animated") {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.button
            className={cn(
              "group absolute bottom-8 z-10 cursor-pointer",
              "focus:ring-brutalist-yellow rounded-sm focus:ring-4 focus:outline-none",
              positionClasses[position],
              className
            )}
            onClick={handleClick}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Scroll down to next section"
          >
            <motion.div
              className="flex flex-col items-center space-y-3"
              animate={{
                y: [0, 8, 0],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
                repeatType: "reverse" as const,
              }}
            >
              {/* Animated text */}
              <Typography
                variant="caption"
                className="group-hover:text-brutalist-yellow font-mono text-white transition-colors duration-300"
              >
                {text}
              </Typography>

              {/* Animated arrow */}
              <motion.div
                className="flex flex-col space-y-1"
                animate={{
                  y: [0, 4, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatType: "reverse",
                }}
              >
                <motion.div
                  className="group-hover:bg-brutalist-yellow h-0.5 w-6 bg-white transition-colors duration-300"
                  animate={{
                    scaleX: [1, 0.8, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    repeatType: "reverse",
                  }}
                />
                <motion.div
                  className="group-hover:bg-brutalist-yellow h-0.5 w-6 bg-white transition-colors duration-300"
                  animate={{
                    scaleX: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    repeatType: "reverse",
                    delay: 0.2,
                  }}
                />
                <motion.div
                  className="group-hover:bg-brutalist-yellow h-0.5 w-6 bg-white transition-colors duration-300"
                  animate={{
                    scaleX: [1, 0.6, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    repeatType: "reverse",
                    delay: 0.4,
                  }}
                />
              </motion.div>
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>
    );
  }

  // Default variant
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          className={cn(
            "group absolute bottom-8 z-10 cursor-pointer",
            "focus:ring-brutalist-yellow rounded-sm focus:ring-4 focus:outline-none",
            positionClasses[position],
            className
          )}
          onClick={handleClick}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Scroll down to next section"
        >
          <motion.div
            className="group-hover:text-brutalist-yellow flex flex-col items-center space-y-2 text-white transition-colors duration-300"
            animate={{
              y: [0, 8, 0],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "reverse" as const,
            }}
          >
            <Typography variant="caption" className="font-mono">
              {text}
            </Typography>

            {/* Mouse icon with scroll animation */}
            <div className="flex h-10 w-6 justify-center rounded-full border-2 border-current">
              <motion.div
                className="mt-2 h-3 w-1 rounded-full bg-current"
                animate={{
                  y: [0, 6, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatType: "reverse" as const,
                }}
              />
            </div>

            {/* Additional arrow indicator */}
            <motion.div
              className="text-current"
              animate={{
                y: [0, 4, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                repeatType: "reverse",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 13l5 5 5-5" />
              </svg>
            </motion.div>
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
