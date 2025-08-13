/**
 * CSS Generator Utilities
 * Generate CSS from design tokens and create dynamic styles
 */

import { designTokens } from "./design-tokens";
import type {
  AnimationConfig,
  ResponsiveValue,
  ComponentState,
  ShadowVariant,
  ShadowSize,
} from "@/types/design-tokens";

/**
 * Generate CSS custom properties from design tokens
 */
export function generateTokenCSS(): string {
  const cssLines: string[] = [":root {"];

  // Helper function to add CSS variables recursively
  const addCSSVars = (obj: any, prefix = "") => {
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === "string" || typeof value === "number") {
        cssLines.push(`  --${prefix}${key}: ${value};`);
      } else if (typeof value === "object" && value !== null) {
        addCSSVars(value, `${prefix}${key}-`);
      }
    });
  };

  // Generate color variables
  addCSSVars(designTokens.colors, "color-");

  // Generate typography variables
  Object.entries(designTokens.typography).forEach(([category, values]) => {
    if (category === "fontFamilies") {
      Object.entries(values).forEach(([key, value]) => {
        cssLines.push(
          `  --font-family-${key}: ${Array.isArray(value) ? value.join(", ") : value};`
        );
      });
    } else {
      addCSSVars(
        values,
        `${category.replace("font", "font-").replace("letter", "letter-").replace("line", "line-")}`
      );
    }
  });

  // Generate spacing variables
  addCSSVars(designTokens.spacing, "spacing-");

  // Generate shadow variables
  addCSSVars(designTokens.shadows, "shadow-");

  // Generate animation variables
  addCSSVars(designTokens.animations.durations, "duration-");
  addCSSVars(designTokens.animations.easings, "easing-");

  // Generate border variables
  addCSSVars(designTokens.borders.width, "border-width-");
  addCSSVars(designTokens.borders.radius, "border-radius-");

  // Generate z-index variables
  addCSSVars(designTokens.zIndex, "z-index-");

  cssLines.push("}");
  return cssLines.join("\n");
}

/**
 * Generate responsive CSS for a property
 */
export function generateResponsiveCSS<T>(
  property: string,
  values: ResponsiveValue<T>,
  selector = ""
): string {
  const css: string[] = [];
  const breakpoints = designTokens.breakpoints;

  // Base value
  if (values.base !== undefined) {
    css.push(`${selector} { ${property}: ${values.base}; }`);
  }

  // Responsive values
  Object.entries(values).forEach(([breakpoint, value]) => {
    if (breakpoint !== "base" && value !== undefined) {
      const minWidth = breakpoints[breakpoint as keyof typeof breakpoints];
      if (minWidth) {
        css.push(`@media (min-width: ${minWidth}) {`);
        css.push(`  ${selector} { ${property}: ${value}; }`);
        css.push(`}`);
      }
    }
  });

  return css.join("\n");
}

/**
 * Generate animation CSS from config
 */
export function generateAnimationCSS(
  name: string,
  config: AnimationConfig,
  keyframes?: string
): string {
  const css: string[] = [];

  // Add keyframes if provided
  if (keyframes) {
    css.push(`@keyframes ${name} {`);
    css.push(keyframes);
    css.push(`}`);
  }

  // Generate animation properties
  const duration = designTokens.animations.durations[config.duration];
  const easing = designTokens.animations.easings[config.easing];

  const animationProps = [
    `animation-name: ${name}`,
    `animation-duration: ${duration}`,
    `animation-timing-function: ${easing}`,
  ];

  if (config.delay) {
    animationProps.push(`animation-delay: ${config.delay}ms`);
  }

  if (config.fillMode) {
    animationProps.push(`animation-fill-mode: ${config.fillMode}`);
  }

  if (config.iterationCount) {
    animationProps.push(`animation-iteration-count: ${config.iterationCount}`);
  }

  if (config.direction) {
    animationProps.push(`animation-direction: ${config.direction}`);
  }

  return animationProps.join(";\n") + ";";
}

/**
 * Generate component state CSS
 */
export function generateStateCSS(
  baseSelector: string,
  states: Partial<Record<ComponentState, Record<string, string>>>
): string {
  const css: string[] = [];

  Object.entries(states).forEach(([state, styles]) => {
    let selector = baseSelector;

    switch (state) {
      case "hover":
        selector += ":hover";
        break;
      case "active":
        selector += ":active";
        break;
      case "focus":
        selector += ":focus";
        break;
      case "disabled":
        selector += ":disabled, " + baseSelector + "[aria-disabled='true']";
        break;
      case "loading":
        selector += "[data-loading='true']";
        break;
      case "error":
        selector += "[data-error='true']";
        break;
      case "success":
        selector += "[data-success='true']";
        break;
    }

    css.push(`${selector} {`);
    Object.entries(styles).forEach(([property, value]) => {
      css.push(`  ${property}: ${value};`);
    });
    css.push(`}`);
  });

  return css.join("\n");
}

/**
 * Generate brutalist shadow CSS
 */
export function generateBrutalistShadowCSS(
  variant: ShadowVariant = "brutalist",
  size: ShadowSize = "md"
): string {
  return `var(--shadow-${variant}-${size})`;
}

/**
 * Generate focus ring CSS for accessibility
 */
export function generateFocusRingCSS(
  selector: string,
  color = "var(--color-accent-yellow)",
  width = "2px"
): string {
  return `
${selector}:focus {
  outline: ${width} solid ${color};
  outline-offset: 2px;
}

${selector}:focus:not(:focus-visible) {
  outline: none;
}

${selector}:focus-visible {
  outline: ${width} solid ${color};
  outline-offset: 2px;
}
  `.trim();
}

/**
 * Generate high contrast mode CSS
 */
export function generateHighContrastCSS(
  selector: string,
  normalStyles: Record<string, string>,
  highContrastStyles: Record<string, string>
): string {
  const css: string[] = [];

  // Normal styles
  css.push(`${selector} {`);
  Object.entries(normalStyles).forEach(([property, value]) => {
    css.push(`  ${property}: ${value};`);
  });
  css.push(`}`);

  // High contrast styles
  css.push(`@media (prefers-contrast: high) {`);
  css.push(`  ${selector} {`);
  Object.entries(highContrastStyles).forEach(([property, value]) => {
    css.push(`    ${property}: ${value};`);
  });
  css.push(`  }`);
  css.push(`}`);

  return css.join("\n");
}

/**
 * Generate reduced motion CSS
 */
export function generateReducedMotionCSS(
  selector: string,
  normalStyles: Record<string, string>,
  reducedStyles: Record<string, string> = {
    "animation-duration": "0.01ms !important",
    "transition-duration": "0.01ms !important",
  }
): string {
  const css: string[] = [];

  // Normal styles
  css.push(`${selector} {`);
  Object.entries(normalStyles).forEach(([property, value]) => {
    css.push(`  ${property}: ${value};`);
  });
  css.push(`}`);

  // Reduced motion styles
  css.push(`@media (prefers-reduced-motion: reduce) {`);
  css.push(`  ${selector} {`);
  Object.entries(reducedStyles).forEach(([property, value]) => {
    css.push(`    ${property}: ${value};`);
  });
  css.push(`  }`);
  css.push(`}`);

  return css.join("\n");
}

/**
 * Generate mobile-optimized CSS
 */
export function generateMobileCSS(
  selector: string,
  mobileStyles: Record<string, string>
): string {
  const css: string[] = [];

  css.push(`@media (max-width: ${designTokens.breakpoints.md}) {`);
  css.push(`  ${selector} {`);
  Object.entries(mobileStyles).forEach(([property, value]) => {
    css.push(`    ${property}: ${value};`);
  });
  css.push(`  }`);
  css.push(`}`);

  return css.join("\n");
}

/**
 * Generate touch-friendly CSS
 */
export function generateTouchCSS(
  selector: string,
  touchStyles: Record<string, string> = {
    "min-height": "44px",
    "min-width": "44px",
    "touch-action": "manipulation",
  }
): string {
  const css: string[] = [];

  css.push(`@media (hover: none) and (pointer: coarse) {`);
  css.push(`  ${selector} {`);
  Object.entries(touchStyles).forEach(([property, value]) => {
    css.push(`    ${property}: ${value};`);
  });
  css.push(`  }`);
  css.push(`}`);

  return css.join("\n");
}

/**
 * Generate safe area CSS for devices with notches
 */
export function generateSafeAreaCSS(
  selector: string,
  sides: ("top" | "bottom" | "left" | "right")[] = [
    "top",
    "bottom",
    "left",
    "right",
  ]
): string {
  const css: string[] = [];

  css.push(`@supports (padding: env(safe-area-inset-top)) {`);
  css.push(`  ${selector} {`);

  sides.forEach((side) => {
    css.push(`    padding-${side}: env(safe-area-inset-${side});`);
  });

  css.push(`  }`);
  css.push(`}`);

  return css.join("\n");
}

/**
 * Generate complete component CSS with all variants and states
 */
export function generateComponentCSS(
  componentName: string,
  baseStyles: Record<string, string>,
  variants: Record<string, Record<string, string>> = {},
  states: Partial<Record<ComponentState, Record<string, string>>> = {},
  responsive: Record<string, ResponsiveValue<string>> = {}
): string {
  const css: string[] = [];
  const baseSelector = `.${componentName}`;

  // Base styles
  css.push(`${baseSelector} {`);
  Object.entries(baseStyles).forEach(([property, value]) => {
    css.push(`  ${property}: ${value};`);
  });
  css.push(`}`);

  // Variants
  Object.entries(variants).forEach(([variantName, styles]) => {
    const variantSelector = `${baseSelector}--${variantName}`;
    css.push(`${variantSelector} {`);
    Object.entries(styles).forEach(([property, value]) => {
      css.push(`  ${property}: ${value};`);
    });
    css.push(`}`);
  });

  // States
  if (Object.keys(states).length > 0) {
    css.push(generateStateCSS(baseSelector, states));
  }

  // Responsive styles
  Object.entries(responsive).forEach(([property, values]) => {
    css.push(generateResponsiveCSS(property, values, baseSelector));
  });

  return css.join("\n\n");
}
