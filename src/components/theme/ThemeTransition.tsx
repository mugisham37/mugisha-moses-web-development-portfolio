"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemeType } from "@/types/theme";

interface ThemeTransitionProps {
  children: ReactNode;
  className?: string;
  transitionDuration?: number;
}

/**
 * ThemeTransition component that provides smooth visual transitions
 * between theme changes with proper CSS custom property interpolation
 */
export const ThemeTransition: React.FC<ThemeTransitionProps> = ({
  children,
  className = "",
  transitionDuration = 600,
}) => {
  const { currentTheme, isTransitioning, transitionProgress } = useTheme();
  const [transitionClass, setTransitionClass] = useState("");

  useEffect(() => {
    if (isTransitioning) {
      setTransitionClass("theme-transitioning");

      // Remove transition class after transition completes
      const timeout = setTimeout(() => {
        setTransitionClass("");
      }, transitionDuration);

      return () => clearTimeout(timeout);
    }
  }, [isTransitioning, transitionDuration]);

  const transitionStyles = {
    "--theme-transition-duration": `${transitionDuration}ms`,
    "--theme-transition-progress": transitionProgress,
  } as React.CSSProperties;

  return (
    <div
      className={`theme-transition ${transitionClass} theme-${currentTheme} ${className}`}
      style={transitionStyles}
    >
      {children}
    </div>
  );
};

/**
 * Hook to get theme transition state for custom animations
 */
export const useThemeTransition = () => {
  const { isTransitioning, transitionProgress, currentTheme } = useTheme();

  return {
    isTransitioning,
    progress: transitionProgress,
    currentTheme,
    // Easing function for smooth transitions
    easedProgress: easeOutCubic(transitionProgress),
  };
};

// Easing function for smooth transitions
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
