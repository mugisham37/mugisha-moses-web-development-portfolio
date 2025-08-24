"use client";

import React, { ReactNode } from "react";
import { ThemeType } from "@/types/theme";
import { useThemeContext } from "@/contexts/ThemeContext";

// Render props pattern for theme-dependent rendering
interface ThemeRendererProps {
  children: (theme: ThemeType, config: any) => ReactNode;
  fallback?: ReactNode;
}

export const ThemeRenderer: React.FC<ThemeRendererProps> = ({
  children,
  fallback = null,
}) => {
  const { currentTheme, config } = useThemeContext();

  try {
    return <>{children(currentTheme, config)}</>;
  } catch (error) {
    console.error("ThemeRenderer error:", error);
    return <>{fallback}</>;
  }
};

// Conditional theme renderer for specific themes
interface ConditionalThemeRendererProps {
  theme: ThemeType;
  children: ReactNode;
  fallback?: ReactNode;
}

export const ConditionalThemeRenderer: React.FC<
  ConditionalThemeRendererProps
> = ({ theme, children, fallback = null }) => {
  const { currentTheme } = useThemeContext();

  return currentTheme === theme ? <>{children}</> : <>{fallback}</>;
};

// Multi-theme renderer for different content per theme
interface MultiThemeRendererProps {
  extreme?: ReactNode;
  refined?: ReactNode;
  fallback?: ReactNode;
}

export const MultiThemeRenderer: React.FC<MultiThemeRendererProps> = ({
  extreme,
  refined,
  fallback = null,
}) => {
  const { currentTheme } = useThemeContext();

  switch (currentTheme) {
    case "extreme-brutalist":
      return <>{extreme || fallback}</>;
    case "refined-brutalist":
      return <>{refined || fallback}</>;
    default:
      return <>{fallback}</>;
  }
};

// Theme-aware class name generator
export const useThemeClassName = (
  baseClass: string,
  variants?: Record<ThemeType, string>
) => {
  const { currentTheme } = useThemeContext();

  if (variants && variants[currentTheme]) {
    return `${baseClass} ${baseClass}--${currentTheme} ${variants[currentTheme]}`;
  }

  return `${baseClass} ${baseClass}--${currentTheme}`;
};

// Theme-aware style generator
export const useThemeStyles = (
  baseStyles: React.CSSProperties,
  themeStyles?: Partial<Record<ThemeType, React.CSSProperties>>
) => {
  const { currentTheme, config } = useThemeContext();

  const themeSpecificStyles = themeStyles?.[currentTheme] || {};

  return {
    ...baseStyles,
    ...themeSpecificStyles,
    // Inject theme CSS custom properties
    "--theme-primary": config.colors.primary,
    "--theme-secondary": config.colors.secondary,
    "--theme-accent": config.colors.accent,
    "--theme-highlight": config.colors.highlight,
    "--theme-success": config.colors.success,
    "--theme-bg": config.colors.bg,
    "--theme-text": config.colors.text,
    "--theme-border-width": config.borders.width,
    "--theme-border-style": config.borders.style,
    "--theme-border-radius": config.borders.radius || "0px",
    "--theme-animation-duration": config.animations.duration,
    "--theme-animation-easing": config.animations.easing,
  } as React.CSSProperties;
};
