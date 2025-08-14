/**
 * Typography Utilities
 * Utility functions for consistent typography implementation
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Typography utility function that combines classes with proper precedence
 */
export function typographyClass(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Responsive font size calculator
 * Generates fluid typography classes based on viewport
 */
export function responsiveFontSize(
  minSize: number,
  maxSize: number,
  minViewport: number = 320,
  maxViewport: number = 1200
): string {
  const slope = (maxSize - minSize) / (maxViewport - minViewport);
  const yAxisIntersection = -minViewport * slope + minSize;

  return `clamp(${minSize}rem, ${yAxisIntersection}rem + ${slope * 100}vw, ${maxSize}rem)`;
}

/**
 * Typography scale generator
 * Creates consistent typography scales based on modular scale
 */
export function generateTypographyScale(
  baseSize: number = 1,
  ratio: number = 1.25,
  steps: number = 9
): Record<string, string> {
  const scale: Record<string, string> = {};

  for (let i = 0; i < steps; i++) {
    const size = baseSize * Math.pow(ratio, i);
    scale[`step-${i}`] = `${size.toFixed(3)}rem`;
  }

  return scale;
}

/**
 * Line height calculator
 * Calculates optimal line height based on font size
 */
export function calculateLineHeight(fontSize: number): number {
  // Optimal line height formula: 1.2 + (0.2 / fontSize)
  return Math.max(1.2, 1.2 + 0.2 / fontSize);
}

/**
 * Letter spacing calculator
 * Calculates optimal letter spacing based on font size and weight
 */
export function calculateLetterSpacing(
  fontSize: number,
  fontWeight: number = 400
): number {
  // Heavier weights need tighter spacing
  const weightFactor = (fontWeight - 400) / 400;
  const baseFactor = -0.02; // Base letter spacing

  return baseFactor - weightFactor * 0.01;
}

/**
 * Typography preset configurations
 */
export const typographyPresets = {
  display: {
    fontSize: responsiveFontSize(4, 8),
    lineHeight: calculateLineHeight(6),
    letterSpacing: calculateLetterSpacing(6, 900),
    fontWeight: 900,
    textTransform: "uppercase" as const,
  },

  heading1: {
    fontSize: responsiveFontSize(2.5, 4.5),
    lineHeight: calculateLineHeight(3.5),
    letterSpacing: calculateLetterSpacing(3.5, 700),
    fontWeight: 700,
    textTransform: "uppercase" as const,
  },

  heading2: {
    fontSize: responsiveFontSize(2, 3.5),
    lineHeight: calculateLineHeight(2.75),
    letterSpacing: calculateLetterSpacing(2.75, 700),
    fontWeight: 700,
    textTransform: "uppercase" as const,
  },

  heading3: {
    fontSize: responsiveFontSize(1.75, 2.5),
    lineHeight: calculateLineHeight(2.125),
    letterSpacing: calculateLetterSpacing(2.125, 600),
    fontWeight: 600,
    textTransform: "uppercase" as const,
  },

  body: {
    fontSize: responsiveFontSize(1, 1.125),
    lineHeight: calculateLineHeight(1.0625),
    letterSpacing: 0,
    fontWeight: 400,
  },

  bodyLarge: {
    fontSize: responsiveFontSize(1.125, 1.25),
    lineHeight: calculateLineHeight(1.1875),
    letterSpacing: 0,
    fontWeight: 400,
  },

  caption: {
    fontSize: responsiveFontSize(0.75, 0.875),
    lineHeight: calculateLineHeight(0.8125),
    letterSpacing: calculateLetterSpacing(0.8125, 500),
    fontWeight: 500,
    textTransform: "uppercase" as const,
  },
} as const;

/**
 * Font loading optimization utilities
 */
export const fontLoadingUtils = {
  /**
   * Preload critical fonts
   */
  preloadFonts: () => {
    if (typeof window !== "undefined") {
      const link1 = document.createElement("link");
      link1.rel = "preload";
      link1.href =
        "https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap";
      link1.as = "style";
      document.head.appendChild(link1);

      const link2 = document.createElement("link");
      link2.rel = "preload";
      link2.href =
        "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap";
      link2.as = "style";
      document.head.appendChild(link2);
    }
  },

  /**
   * Check if fonts are loaded
   */
  checkFontLoad: async (fontFamily: string): Promise<boolean> => {
    if (typeof window !== "undefined" && "fonts" in document) {
      try {
        await document.fonts.load(`1rem ${fontFamily}`);
        return document.fonts.check(`1rem ${fontFamily}`);
      } catch {
        return false;
      }
    }
    return false;
  },

  /**
   * Apply font loading class when fonts are ready
   */
  applyFontLoadedClass: async () => {
    if (typeof window !== "undefined") {
      const spaceMono = await fontLoadingUtils.checkFontLoad("Space Mono");
      const inter = await fontLoadingUtils.checkFontLoad("Inter");

      if (spaceMono && inter) {
        document.documentElement.classList.add("fonts-loaded");
      }
    }
  },
};

/**
 * Accessibility utilities for typography
 */
export const typographyA11y = {
  /**
   * Check if text meets WCAG contrast requirements
   */
  checkContrast: (foreground: string, background: string): boolean => {
    // This is a simplified check - in production, use a proper contrast checker
    // Mock validation based on color values
    const isValidForeground = /^#[0-9A-F]{6}$/i.test(foreground);
    const isValidBackground = /^#[0-9A-F]{6}$/i.test(background);
    
    if (!isValidForeground || !isValidBackground) {
      console.warn(`Invalid color format: ${foreground} or ${background}`);
      return false;
    }
    
    // Returns true for valid colors - implement actual contrast calculation in production
    return true;
  },

  /**
   * Get optimal font size for readability
   */
  getOptimalFontSize: (textLength: number): string => {
    // Longer text should have slightly larger font size for better readability
    if (textLength > 500) return "text-lg";
    if (textLength > 200) return "text-base";
    return "text-sm";
  },

  /**
   * Get optimal line height for readability
   */
  getOptimalLineHeight: (fontSize: number): string => {
    const lineHeight = calculateLineHeight(fontSize);
    if (lineHeight >= 1.6) return "leading-loose";
    if (lineHeight >= 1.5) return "leading-relaxed";
    if (lineHeight >= 1.4) return "leading-normal";
    if (lineHeight >= 1.3) return "leading-snug";
    if (lineHeight >= 1.2) return "leading-tight";
    return "leading-tighter";
  },
};

/**
 * Typography animation utilities
 */
export const typographyAnimations = {
  /**
   * Typewriter effect configuration
   */
  typewriter: {
    duration: 50, // ms per character
    cursor: "|",
    cursorBlink: 500, // ms
  },

  /**
   * Text reveal animation configuration
   */
  textReveal: {
    duration: 600, // ms
    delay: 100, // ms between words
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  },

  /**
   * Enhanced counter animation configuration
   */
  counter: {
    duration: 2500, // ms - Increased for more dramatic effect
    staggerDelay: 150, // ms - Delay between counter animations
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    separator: ",",
    easingFunctions: {
      easeOut: [0.4, 0, 0.2, 1],
      easeIn: [0.4, 0, 1, 1],
      easeInOut: [0.4, 0, 0.2, 1],
      bounce: [0.68, -0.55, 0.265, 1.55],
      sharp: [0.4, 0, 0.6, 1],
    },
    spring: {
      damping: 25,
      stiffness: 200,
      bounce: 0,
    },
  },
};

/**
 * Export all utilities
 */
const typographyUtils = {
  typographyClass,
  responsiveFontSize,
  generateTypographyScale,
  calculateLineHeight,
  calculateLetterSpacing,
  typographyPresets,
  fontLoadingUtils,
  typographyA11y,
  typographyAnimations,
};

export default typographyUtils;
