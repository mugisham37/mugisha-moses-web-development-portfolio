"use client";

import { useContext, useMemo, useCallback } from "react";
import { ThemeContext } from "@/contexts/ThemeContext";
import { ThemeType, ThemeConfig } from "@/types/theme";
import { trackThemeChange } from "@/utils/analytics";

// Enhanced useTheme hook with additional utilities
export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};

// Hook for theme-aware CSS custom properties
export const useThemeVariables = () => {
  const { config, currentTheme } = useTheme();

  return useMemo(
    () => ({
      // Color variables
      "--theme-primary": config.colors.primary,
      "--theme-secondary": config.colors.secondary,
      "--theme-accent": config.colors.accent,
      "--theme-highlight": config.colors.highlight,
      "--theme-success": config.colors.success,
      "--theme-bg": config.colors.bg,
      "--theme-text": config.colors.text,

      // Typography variables
      "--theme-font-primary": config.typography.primary,
      "--theme-font-code": config.typography.code,

      // Border variables
      "--theme-border-width": config.borders.width,
      "--theme-border-style": config.borders.style,
      "--theme-border-radius": config.borders.radius || "0px",

      // Animation variables
      "--theme-animation-duration": config.animations.duration,
      "--theme-animation-easing": config.animations.easing,

      // Shadow variables
      "--theme-shadow-brutal": config.shadows.brutal || "none",
      "--theme-shadow-subtle": config.shadows.subtle || "none",
      "--theme-shadow-double": config.shadows.double || "none",
      "--theme-shadow-triple": config.shadows.triple || "none",
      "--theme-shadow-elevated": config.shadows.elevated || "none",
      "--theme-shadow-glow": config.shadows.glow || "none",

      // Theme identifier
      "--current-theme": currentTheme,
    }),
    [config, currentTheme]
  );
};

// Hook for theme-aware class names
export const useThemeClassName = (
  baseClass: string,
  variants?: Partial<Record<ThemeType, string>>
) => {
  const { currentTheme } = useTheme();

  return useMemo(() => {
    const themeClass = `${baseClass}--${currentTheme}`;
    const variantClass = variants?.[currentTheme] || "";

    return [baseClass, themeClass, variantClass].filter(Boolean).join(" ");
  }, [baseClass, currentTheme, variants]);
};

// Hook for theme-aware styles
export const useThemeStyles = (
  baseStyles: React.CSSProperties = {},
  themeStyles?: Partial<Record<ThemeType, React.CSSProperties>>
) => {
  const { currentTheme } = useTheme();
  const themeVariables = useThemeVariables();

  return useMemo(() => {
    const currentThemeStyles = themeStyles?.[currentTheme] || {};

    return {
      ...baseStyles,
      ...currentThemeStyles,
      ...themeVariables,
    } as React.CSSProperties;
  }, [baseStyles, themeStyles, currentTheme, themeVariables]);
};

// Hook for conditional theme rendering
export const useThemeCondition = (targetTheme: ThemeType) => {
  const { currentTheme } = useTheme();

  return useMemo(
    () => ({
      isActive: currentTheme === targetTheme,
      isExtreme: currentTheme === "extreme-brutalist",
      isRefined: currentTheme === "refined-brutalist",
    }),
    [currentTheme, targetTheme]
  );
};

// Hook for theme-aware animations
export const useThemeAnimation = (animationName: string) => {
  const { config, currentTheme } = useTheme();

  return useMemo(() => {
    const duration = config.animations.duration;
    const easing = config.animations.easing;

    // Get theme-specific animation if available
    const themeAnimation =
      config.animations[animationName as keyof typeof config.animations];

    return {
      animation: themeAnimation || `${animationName} ${duration} ${easing}`,
      animationDuration: duration,
      animationTimingFunction: easing,
      animationName: themeAnimation ? undefined : animationName,
    };
  }, [config, animationName]);
};

// Hook for theme transition utilities
export const useThemeTransitionUtils = () => {
  const { isTransitioning, transitionProgress, setTheme, currentTheme } =
    useTheme();

  const toggleTheme = useCallback(() => {
    const newTheme =
      currentTheme === "extreme-brutalist"
        ? "refined-brutalist"
        : "extreme-brutalist";

    // Track theme change with analytics
    trackThemeChange(newTheme, transitionProgress);

    setTheme(newTheme);
  }, [currentTheme, setTheme, transitionProgress]);

  const getTransitionStyle = useCallback(
    (fromValue: string | number, toValue: string | number) => {
      if (!isTransitioning) return toValue;

      // Linear interpolation for numeric values
      if (typeof fromValue === "number" && typeof toValue === "number") {
        return fromValue + (toValue - fromValue) * transitionProgress;
      }

      // For non-numeric values, use step transition at 50%
      return transitionProgress > 0.5 ? toValue : fromValue;
    },
    [isTransitioning, transitionProgress]
  );

  return {
    isTransitioning,
    transitionProgress,
    toggleTheme,
    getTransitionStyle,
  };
};

// Hook for theme-aware responsive utilities
export const useThemeResponsive = () => {
  const { currentTheme, config } = useTheme();

  return useMemo(
    () => ({
      // Responsive breakpoints with theme awareness
      getResponsiveValue: <T>(values: {
        mobile: T;
        tablet?: T;
        desktop?: T;
        extreme?: T;
        refined?: T;
      }) => {
        // Theme-specific values take precedence
        if (
          currentTheme === "extreme-brutalist" &&
          values.extreme !== undefined
        ) {
          return values.extreme;
        }
        if (
          currentTheme === "refined-brutalist" &&
          values.refined !== undefined
        ) {
          return values.refined;
        }

        // Fallback to responsive values
        return values.desktop || values.tablet || values.mobile;
      },

      // Theme-aware media queries
      mediaQueries: {
        mobile: "@media (max-width: 767px)",
        tablet: "@media (min-width: 768px) and (max-width: 1023px)",
        desktop: "@media (min-width: 1024px)",
        extreme:
          currentTheme === "extreme-brutalist"
            ? "@media all"
            : "@media not all",
        refined:
          currentTheme === "refined-brutalist"
            ? "@media all"
            : "@media not all",
      },
    }),
    [currentTheme]
  );
};
