"use client";

import { useCallback } from "react";
import { useThemeTransition } from "./useThemeTransition";
import { useThemeContext } from "@/contexts/ThemeContext";

// Hook that combines theme detection and utilities
export const useThemeDetector = () => {
  const { activeTheme, isTransitioning, currentScrollProgress } =
    useThemeTransition();
  const { currentTheme } = useThemeContext();

  // Generate theme-aware class names
  const getThemeClass = useCallback(
    (baseClass: string, variants?: Record<string, string>) => {
      const themeClass = `${baseClass}--${currentTheme}`;
      const variantClass = variants?.[currentTheme] || "";

      return [baseClass, themeClass, variantClass].filter(Boolean).join(" ");
    },
    [currentTheme]
  );

  return {
    activeTheme,
    isTransitioning,
    currentScrollProgress,
    getThemeClass,
  };
};
