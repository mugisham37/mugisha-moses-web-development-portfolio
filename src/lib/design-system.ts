/**
 * Design System Utilities
 * Utility functions for accessing and manipulating design tokens
 */

import {
  designTokens,
  type ColorPath,
  type SpacingPath,
  type ShadowPath,
} from "./design-tokens";

/**
 * Get a design token value by path
 * @param path - Dot-separated path to the token (e.g., "colors.primary.black")
 * @param tokens - The design tokens object
 * @returns The token value or undefined if not found
 */
export function getToken<T>(path: string, tokens: T): unknown {
  return path.split(".").reduce((obj: unknown, key: string) => 
    (obj as Record<string, unknown>)?.[key], tokens);
}

/**
 * Get a color token value
 * @param path - Color token path
 * @returns The color value
 */
export function getColor(path: ColorPath): string {
  const result = getToken(path, designTokens.colors);
  return (typeof result === 'string') ? result : "#000000";
}

/**
 * Get a spacing token value
 * @param path - Spacing token path
 * @returns The spacing value
 */
export function getSpacing(path: SpacingPath): string {
  const result = getToken(path, designTokens.spacing);
  return (typeof result === 'string') ? result : "0px";
}

/**
 * Get a shadow token value
 * @param path - Shadow token path
 * @returns The shadow value
 */
export function getShadow(path: ShadowPath): string {
  const result = getToken(path, designTokens.shadows);
  return (typeof result === 'string') ? result : "none";
}

/**
 * Generate CSS custom properties from design tokens
 * @returns CSS custom properties string
 */
export function generateCSSCustomProperties(): string {
  const cssVars: string[] = [];

  // Colors
  const addColorVars = (obj: Record<string, unknown>, prefix = "") => {
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === "string") {
        cssVars.push(`  --${prefix}${key}: ${value};`);
      } else if (typeof value === "object" && value !== null) {
        addColorVars(value as Record<string, unknown>, `${prefix}${key}-`);
      }
    });
  };

  addColorVars(designTokens.colors, "color-");

  // Typography
  Object.entries(designTokens.typography.fontSizes).forEach(([key, value]) => {
    cssVars.push(`  --font-size-${key}: ${value};`);
  });

  Object.entries(designTokens.typography.fontWeights).forEach(
    ([key, value]) => {
      cssVars.push(`  --font-weight-${key}: ${value};`);
    }
  );

  Object.entries(designTokens.typography.lineHeights).forEach(
    ([key, value]) => {
      cssVars.push(`  --line-height-${key}: ${value};`);
    }
  );

  Object.entries(designTokens.typography.letterSpacing).forEach(
    ([key, value]) => {
      cssVars.push(`  --letter-spacing-${key}: ${value};`);
    }
  );

  // Spacing
  Object.entries(designTokens.spacing).forEach(([key, value]) => {
    cssVars.push(`  --spacing-${key}: ${value};`);
  });

  // Shadows
  const addShadowVars = (obj: Record<string, unknown>, prefix = "") => {
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === "string") {
        cssVars.push(`  --shadow-${prefix}${key}: ${value};`);
      } else if (typeof value === "object" && value !== null) {
        addShadowVars(value as Record<string, unknown>, `${prefix}${key}-`);
      }
    });
  };

  addShadowVars(designTokens.shadows);

  // Animations
  Object.entries(designTokens.animations.durations).forEach(([key, value]) => {
    cssVars.push(`  --duration-${key}: ${value};`);
  });

  Object.entries(designTokens.animations.easings).forEach(([key, value]) => {
    cssVars.push(`  --easing-${key}: ${value};`);
  });

  // Borders
  Object.entries(designTokens.borders.width).forEach(([key, value]) => {
    cssVars.push(`  --border-width-${key}: ${value};`);
  });

  Object.entries(designTokens.borders.radius).forEach(([key, value]) => {
    cssVars.push(`  --border-radius-${key}: ${value};`);
  });

  // Z-index
  Object.entries(designTokens.zIndex).forEach(([key, value]) => {
    cssVars.push(`  --z-index-${key}: ${value};`);
  });

  return `:root {\n${cssVars.join("\n")}\n}`;
}

/**
 * Create a brutalist shadow with customizable offset and color
 * @param offset - Shadow offset in pixels
 * @param color - Shadow color (defaults to white with opacity)
 * @returns CSS box-shadow value
 */
export function createBrutalistShadow(
  offset: number = 8,
  color: string = "rgba(255, 255, 255, 0.1)"
): string {
  return `${offset}px ${offset}px 0px ${color}`;
}

/**
 * Create a responsive font size using clamp()
 * @param minSize - Minimum font size
 * @param preferredSize - Preferred font size (viewport-based)
 * @param maxSize - Maximum font size
 * @returns CSS clamp() value
 */
export function createResponsiveFontSize(
  minSize: string,
  preferredSize: string,
  maxSize: string
): string {
  return `clamp(${minSize}, ${preferredSize}, ${maxSize})`;
}

/**
 * Generate theme-aware color values
 * @param lightColor - Color for light theme
 * @param darkColor - Color for dark theme
 * @returns CSS custom property with theme support
 */
export function createThemeColor(
  lightColor: string,
  darkColor: string
): string {
  return `light-dark(${lightColor}, ${darkColor})`;
}

/**
 * Create a spacing scale multiplier
 * @param multiplier - Multiplier for base spacing unit
 * @returns Calculated spacing value
 */
export function createSpacing(multiplier: number): string {
  const baseUnit = 0.25; // 4px base unit
  return `${baseUnit * multiplier}rem`;
}

/**
 * Generate animation timing function
 * @param type - Animation type
 * @returns CSS timing function
 */
export function getAnimationTiming(
  type: keyof typeof designTokens.animations.easings
): string {
  return designTokens.animations.easings[type];
}

/**
 * Generate animation duration
 * @param speed - Animation speed
 * @returns CSS duration value
 */
export function getAnimationDuration(
  speed: keyof typeof designTokens.animations.durations
): string {
  return designTokens.animations.durations[speed];
}

/**
 * Create a brutalist border style
 * @param width - Border width
 * @param color - Border color
 * @returns CSS border value
 */
export function createBrutalistBorder(
  width: keyof typeof designTokens.borders.width = "brutalist",
  color: string = "var(--color-primary-white)"
): string {
  return `${designTokens.borders.width[width]} solid ${color}`;
}

/**
 * Generate media query for breakpoint
 * @param breakpoint - Breakpoint name
 * @returns CSS media query string
 */
export function createMediaQuery(
  breakpoint: keyof typeof designTokens.breakpoints
): string {
  return `@media (min-width: ${designTokens.breakpoints[breakpoint]})`;
}

/**
 * Create focus ring styles for accessibility
 * @param color - Focus ring color
 * @param width - Focus ring width
 * @returns CSS focus styles object
 */
export function createFocusRing(
  color: string = "var(--color-accent-yellow)",
  width: string = "2px"
): Record<string, string> {
  return {
    outline: `${width} solid ${color}`,
    outlineOffset: "2px",
  };
}

/**
 * Generate high contrast mode styles
 * @param normalStyles - Normal styles object
 * @param highContrastStyles - High contrast styles object
 * @returns CSS with high contrast media query
 */
export function createHighContrastStyles(
  normalStyles: Record<string, string>,
  highContrastStyles: Record<string, string>
): string {
  const normal = Object.entries(normalStyles)
    .map(([key, value]) => `${key}: ${value};`)
    .join(" ");

  const highContrast = Object.entries(highContrastStyles)
    .map(([key, value]) => `${key}: ${value};`)
    .join(" ");

  return `
    ${normal}
    @media (prefers-contrast: high) {
      ${highContrast}
    }
  `;
}

/**
 * Create reduced motion styles
 * @param normalStyles - Normal animation styles
 * @param reducedStyles - Reduced motion styles
 * @returns CSS with reduced motion media query
 */
export function createReducedMotionStyles(
  normalStyles: Record<string, string>,
  reducedStyles: Record<string, string>
): string {
  const normal = Object.entries(normalStyles)
    .map(([key, value]) => `${key}: ${value};`)
    .join(" ");

  const reduced = Object.entries(reducedStyles)
    .map(([key, value]) => `${key}: ${value};`)
    .join(" ");

  return `
    ${normal}
    @media (prefers-reduced-motion: reduce) {
      ${reduced}
    }
  `;
}
