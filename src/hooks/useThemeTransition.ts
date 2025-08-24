"use client";

import { useEffect, useCallback, useRef } from "react";
import { ThemeType, UseThemeTransitionOptions } from "@/types/theme";
import { useScrollProgress } from "./useScrollProgress";
import { useThemeContext } from "@/contexts/ThemeContext";

interface UseThemeTransitionReturn {
  currentScrollProgress: number;
  isTransitioning: boolean;
  activeTheme: ThemeType;
}

const DEFAULT_OPTIONS: UseThemeTransitionOptions = {
  thresholds: [
    { progress: 0, theme: "extreme-brutalist" },
    { progress: 0.4, theme: "refined-brutalist" },
  ],
  transitionDuration: 600,
  easing: "cubic-bezier(0.4, 0, 0.2, 1)",
};

export const useThemeTransition = (
  options: Partial<UseThemeTransitionOptions> = {}
): UseThemeTransitionReturn => {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const { scrollProgress } = useScrollProgress({ throttleMs: 16 });
  const { currentTheme, setTheme, isTransitioning } = useThemeContext();

  // Hysteresis values to prevent rapid theme switching
  const hysteresisRef = useRef({
    lastTheme: currentTheme,
    lastTransitionTime: 0,
    debounceTimeout: null as NodeJS.Timeout | null,
  });

  // Determine target theme based on scroll progress
  const getTargetTheme = useCallback(
    (progress: number): ThemeType => {
      // Sort thresholds by progress
      const sortedThresholds = [...config.thresholds].sort(
        (a, b) => a.progress - b.progress
      );

      // Find the appropriate theme based on current progress
      let targetTheme = sortedThresholds[0].theme;

      for (let i = 0; i < sortedThresholds.length; i++) {
        const threshold = sortedThresholds[i];
        if (progress >= threshold.progress) {
          targetTheme = threshold.theme;
        } else {
          break;
        }
      }

      return targetTheme;
    },
    [config.thresholds]
  );

  // Apply hysteresis to prevent rapid theme switching
  const applyHysteresis = useCallback(
    (targetTheme: ThemeType, currentProgress: number): ThemeType => {
      const now = Date.now();
      const timeSinceLastTransition =
        now - hysteresisRef.current.lastTransitionTime;

      // If we're already transitioning, don't change theme
      if (isTransitioning) {
        return currentTheme;
      }

      // Apply minimum time between transitions (300ms)
      if (timeSinceLastTransition < 300) {
        return currentTheme;
      }

      // Apply progress-based hysteresis
      const hysteresisMargin = 0.05; // 5% margin

      if (targetTheme !== currentTheme) {
        // Find the threshold for the target theme
        const targetThreshold = config.thresholds.find(
          (t) => t.theme === targetTheme
        );

        if (targetThreshold) {
          // For switching to refined theme, require slightly more progress
          if (
            targetTheme === "refined-brutalist" &&
            currentTheme === "extreme-brutalist"
          ) {
            if (currentProgress < targetThreshold.progress + hysteresisMargin) {
              return currentTheme;
            }
          }

          // For switching back to extreme theme, require slightly less progress
          if (
            targetTheme === "extreme-brutalist" &&
            currentTheme === "refined-brutalist"
          ) {
            if (currentProgress > targetThreshold.progress - hysteresisMargin) {
              return currentTheme;
            }
          }
        }
      }

      return targetTheme;
    },
    [currentTheme, isTransitioning, config.thresholds]
  );

  // Handle theme transitions with debouncing
  const handleThemeTransition = useCallback(
    (targetTheme: ThemeType) => {
      // Clear existing debounce timeout
      if (hysteresisRef.current.debounceTimeout) {
        clearTimeout(hysteresisRef.current.debounceTimeout);
      }

      // Debounce theme changes
      hysteresisRef.current.debounceTimeout = setTimeout(() => {
        if (targetTheme !== currentTheme) {
          hysteresisRef.current.lastTransitionTime = Date.now();
          hysteresisRef.current.lastTheme = targetTheme;
          setTheme(targetTheme);
        }
      }, 100); // 100ms debounce
    },
    [currentTheme, setTheme]
  );

  // Main effect to handle scroll-based theme transitions
  useEffect(() => {
    const targetTheme = getTargetTheme(scrollProgress);
    const finalTheme = applyHysteresis(targetTheme, scrollProgress);

    if (finalTheme !== currentTheme) {
      handleThemeTransition(finalTheme);
    }

    return () => {
      // Cleanup debounce timeout on unmount
      const currentTimeout = hysteresisRef.current.debounceTimeout;
      if (currentTimeout) {
        clearTimeout(currentTimeout);
      }
    };
  }, [
    scrollProgress,
    currentTheme,
    getTargetTheme,
    applyHysteresis,
    handleThemeTransition,
  ]);

  // Update hysteresis ref when theme changes
  useEffect(() => {
    hysteresisRef.current.lastTheme = currentTheme;
  }, [currentTheme]);

  return {
    currentScrollProgress: scrollProgress,
    isTransitioning,
    activeTheme: currentTheme,
  };
};
