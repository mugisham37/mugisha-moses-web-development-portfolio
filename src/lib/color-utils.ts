/**
 * Color Utilities for Enhanced Visual Balance
 * Comprehensive color management system for the brutalist portfolio
 */

import { designTokens } from "./design-tokens";

// Color contrast calculation for WCAG compliance
export function calculateContrast(
  foreground: string,
  background: string
): number {
  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  // Calculate relative luminance
  const getLuminance = (rgb: { r: number; g: number; b: number }) => {
    const { r, g, b } = rgb;
    const [rs, gs, bs] = [r, g, b].map((c) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const fgRgb = hexToRgb(foreground);
  const bgRgb = hexToRgb(background);

  if (!fgRgb || !bgRgb) return 0;

  const fgLuminance = getLuminance(fgRgb);
  const bgLuminance = getLuminance(bgRgb);

  const lighter = Math.max(fgLuminance, bgLuminance);
  const darker = Math.min(fgLuminance, bgLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

// Check WCAG AA compliance (4.5:1 ratio)
export function isWCAGCompliant(
  foreground: string,
  background: string
): boolean {
  return calculateContrast(foreground, background) >= 4.5;
}

// Check WCAG AAA compliance (7:1 ratio)
export function isWCAGAAACompliant(
  foreground: string,
  background: string
): boolean {
  return calculateContrast(foreground, background) >= 7;
}

// Color palette generator for strategic accent application
export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
}

export function generateColorPalette(
  theme: "dark" | "light" = "dark"
): ColorPalette {
  if (theme === "dark") {
    return {
      primary: designTokens.colors.primary.black,
      secondary: designTokens.colors.brutalist.charcoal[100],
      accent: designTokens.colors.accent.yellow,
      background: designTokens.colors.primary.black,
      foreground: designTokens.colors.primary.white,
      muted: designTokens.colors.brutalist.charcoal[200],
    };
  } else {
    return {
      primary: designTokens.colors.primary.white,
      secondary: designTokens.colors.brutalist.offWhite[100],
      accent: designTokens.colors.accent.yellow,
      background: designTokens.colors.primary.white,
      foreground: designTokens.colors.primary.black,
      muted: designTokens.colors.brutalist.offWhite[200],
    };
  }
}

// Strategic color application utilities
export interface ColorStrategy {
  background: string;
  foreground: string;
  accent: string;
  border: string;
  shadow: string;
}

export function getColorStrategy(
  section: "hero" | "content" | "accent" | "muted",
  theme: "dark" | "light" = "dark"
): ColorStrategy {
  const palette = generateColorPalette(theme);

  switch (section) {
    case "hero":
      return {
        background: palette.primary,
        foreground: palette.foreground,
        accent: palette.accent,
        border: palette.foreground,
        shadow:
          theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
      };
    case "content":
      return {
        background: palette.background,
        foreground: palette.foreground,
        accent: palette.accent,
        border: palette.foreground,
        shadow:
          theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
      };
    case "accent":
      return {
        background: palette.accent,
        foreground: designTokens.colors.primary.black,
        accent: designTokens.colors.primary.black,
        border: designTokens.colors.primary.black,
        shadow: "rgba(0, 0, 0, 0.2)",
      };
    case "muted":
      return {
        background: palette.muted,
        foreground: palette.foreground,
        accent: palette.accent,
        border: palette.foreground,
        shadow:
          theme === "dark"
            ? "rgba(255, 255, 255, 0.05)"
            : "rgba(0, 0, 0, 0.05)",
      };
    default:
      return getColorStrategy("content", theme);
  }
}

// Visual balance utilities
export interface VisualBalance {
  alternatingBackgrounds: string[];
  transitionDuration: string;
  accentFrequency: number;
}

export function calculateVisualBalance(sectionCount: number): VisualBalance {
  const backgrounds = [];

  for (let i = 0; i < sectionCount; i++) {
    if (i % 4 === 0) backgrounds.push("textured-dark");
    else if (i % 4 === 1) backgrounds.push("light-gradient");
    else if (i % 4 === 2) backgrounds.push("dark-gradient");
    else backgrounds.push("accent-gradient");
  }

  return {
    alternatingBackgrounds: backgrounds,
    transitionDuration: "500ms",
    accentFrequency: 3, // Every 3rd section gets accent treatment
  };
}

// Gradient generator for enhanced visual depth
export interface GradientConfig {
  type: "linear" | "radial" | "conic";
  direction?: string;
  colors: string[];
  stops?: number[];
}

export function generateGradient(config: GradientConfig): string {
  const { type, direction = "to bottom right", colors, stops } = config;

  let colorStops = colors;
  if (stops && stops.length === colors.length) {
    colorStops = colors.map((color, index) => `${color} ${stops[index]}%`);
  }

  switch (type) {
    case "linear":
      return `linear-gradient(${direction}, ${colorStops.join(", ")})`;
    case "radial":
      return `radial-gradient(circle at center, ${colorStops.join(", ")})`;
    case "conic":
      return `conic-gradient(from 0deg at center, ${colorStops.join(", ")})`;
    default:
      return `linear-gradient(${direction}, ${colorStops.join(", ")})`;
  }
}

// Predefined gradient configurations
export const gradientPresets = {
  darkToCharcoal: {
    type: "linear" as const,
    direction: "to bottom right",
    colors: [
      designTokens.colors.primary.black,
      designTokens.colors.brutalist.charcoal[200],
      designTokens.colors.primary.black,
    ],
  },
  lightToOffWhite: {
    type: "linear" as const,
    direction: "to bottom right",
    colors: [
      designTokens.colors.primary.white,
      designTokens.colors.brutalist.offWhite[200],
      designTokens.colors.brutalist.offWhite[100],
    ],
  },
  accentGradient: {
    type: "linear" as const,
    direction: "to bottom right",
    colors: [
      designTokens.colors.accent.yellow,
      designTokens.colors.accent.yellowLight,
      designTokens.colors.accent.yellow,
    ],
  },
};

// Texture pattern generators
export interface TexturePattern {
  name: string;
  css: string;
  opacity: number;
}

export const texturePatterns: Record<string, TexturePattern> = {
  dots: {
    name: "Subtle Dots",
    css: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)",
    opacity: 0.05,
  },
  lines: {
    name: "Diagonal Lines",
    css: "linear-gradient(45deg, transparent 49%, rgba(255,255,255,0.05) 50%, transparent 51%)",
    opacity: 0.03,
  },
  grid: {
    name: "Grid Pattern",
    css: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
    opacity: 0.05,
  },
  noise: {
    name: "Noise Texture",
    css: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E\")",
    opacity: 0.02,
  },
};

// Color accessibility utilities
export function getAccessibleColor(
  backgroundColor: string,
  preferredColor: string,
  fallbackColor: string
): string {
  if (isWCAGCompliant(preferredColor, backgroundColor)) {
    return preferredColor;
  }
  return fallbackColor;
}

// Dynamic color adjustment for better contrast
export function adjustColorForContrast(
  color: string,
  backgroundColor: string,
  targetRatio: number = 4.5
): string {
  // This is a simplified implementation
  // In production, you'd want a more sophisticated color adjustment algorithm
  const currentRatio = calculateContrast(color, backgroundColor);

  if (currentRatio >= targetRatio) {
    return color;
  }

  // Return high contrast alternatives
  if (backgroundColor === designTokens.colors.primary.black) {
    return designTokens.colors.primary.white;
  } else {
    return designTokens.colors.primary.black;
  }
}

// Color scheme validation
export interface ColorSchemeValidation {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
}

export function validateColorScheme(
  foreground: string,
  background: string,
  accent: string
): ColorSchemeValidation {
  const issues: string[] = [];
  const suggestions: string[] = [];

  // Check foreground/background contrast
  if (!isWCAGCompliant(foreground, background)) {
    issues.push(
      "Foreground and background colors do not meet WCAG AA contrast requirements"
    );
    suggestions.push(
      "Increase contrast between foreground and background colors"
    );
  }

  // Check accent/background contrast
  if (!isWCAGCompliant(accent, background)) {
    issues.push(
      "Accent and background colors do not meet WCAG AA contrast requirements"
    );
    suggestions.push(
      "Ensure accent color has sufficient contrast against background"
    );
  }

  // Check if colors are too similar
  const fgBgContrast = calculateContrast(foreground, background);
  const accentBgContrast = calculateContrast(accent, background);

  if (fgBgContrast < 3) {
    issues.push("Foreground and background colors are too similar");
    suggestions.push(
      "Increase the difference between foreground and background colors"
    );
  }

  if (accentBgContrast < 3) {
    issues.push("Accent and background colors are too similar");
    suggestions.push("Choose a more contrasting accent color");
  }

  return {
    isValid: issues.length === 0,
    issues,
    suggestions,
  };
}

// Export commonly used color combinations
export const colorCombinations = {
  darkHero: {
    background: designTokens.colors.primary.black,
    foreground: designTokens.colors.primary.white,
    accent: designTokens.colors.accent.yellow,
  },
  lightContent: {
    background: designTokens.colors.primary.white,
    foreground: designTokens.colors.primary.black,
    accent: designTokens.colors.accent.yellow,
  },
  accentSection: {
    background: designTokens.colors.accent.yellow,
    foreground: designTokens.colors.primary.black,
    accent: designTokens.colors.primary.black,
  },
  mutedSection: {
    background: designTokens.colors.brutalist.charcoal[100],
    foreground: designTokens.colors.primary.white,
    accent: designTokens.colors.accent.yellow,
  },
};
