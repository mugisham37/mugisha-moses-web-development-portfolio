import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { designTokens } from "./design-tokens";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Design Token Utilities
 */

/**
 * Get CSS custom property value for a design token
 * @param tokenPath - The token path (e.g., "color-primary-black")
 * @returns CSS var() function
 */
export function token(tokenPath: string): string {
  return `var(--${tokenPath})`;
}

/**
 * Create a brutalist shadow utility
 * @param size - Shadow size (sm, md, lg, xl, 2xl)
 * @param variant - Shadow variant (brutalist, accent, light)
 * @returns CSS box-shadow value
 */
export function brutalistShadow(
  size: "sm" | "md" | "lg" | "xl" | "2xl" = "md",
  variant: "brutalist" | "accent" | "light" = "brutalist"
): string {
  return token(`shadow-${variant}-${size}`);
}

/**
 * Create responsive spacing utility
 * @param mobile - Mobile spacing value
 * @param desktop - Desktop spacing value
 * @returns CSS clamp() function
 */
export function responsiveSpacing(mobile: string, desktop: string): string {
  return `clamp(${token(`spacing-${mobile}`)}, 4vw, ${token(`spacing-${desktop}`)})`;
}

/**
 * Create animation utility with design tokens
 * @param duration - Animation duration key
 * @param easing - Animation easing key
 * @param property - CSS property to animate
 * @returns CSS transition value
 */
export function createAnimation(
  duration: keyof typeof designTokens.animations.durations = "normal",
  easing: keyof typeof designTokens.animations.easings = "easeOut",
  property: string = "all"
): string {
  return `${property} ${token(`duration-${duration}`)} ${token(`easing-${easing}`)}`;
}

/**
 * Create focus ring utility for accessibility
 * @param color - Focus ring color token
 * @param width - Focus ring width
 * @returns CSS focus styles
 */
export function focusRing(
  color: string = "color-accent-yellow",
  width: string = "2px"
): Record<string, string> {
  return {
    outline: `${width} solid ${token(color)}`,
    outlineOffset: "2px",
  };
}

/**
 * Create brutalist border utility
 * @param width - Border width key
 * @param color - Border color token
 * @returns CSS border value
 */
export function brutalistBorder(
  width: "brutalist" | "brutalist-lg" | "brutalist-xl" = "brutalist",
  color: string = "border"
): string {
  return `${token(`border-width-${width}`)} solid ${token(color)}`;
}

/**
 * Create media query utility
 * @param breakpoint - Breakpoint key
 * @returns CSS media query string
 */
export function mediaQuery(
  breakpoint: keyof typeof designTokens.breakpoints
): string {
  return `@media (min-width: ${designTokens.breakpoints[breakpoint]})`;
}

/**
 * Create high contrast styles utility
 * @param normalValue - Normal style value
 * @param highContrastValue - High contrast style value
 * @returns CSS with high contrast media query
 */
export function highContrast(
  normalValue: string,
  highContrastValue: string
): string {
  return `${normalValue}; @media (prefers-contrast: high) { ${highContrastValue}; }`;
}

/**
 * Create reduced motion styles utility
 * @param normalValue - Normal animation value
 * @param reducedValue - Reduced motion value
 * @returns CSS with reduced motion media query
 */
export function reducedMotion(
  normalValue: string,
  reducedValue: string = "none"
): string {
  return `${normalValue}; @media (prefers-reduced-motion: reduce) { ${reducedValue}; }`;
}

/**
 * Generate component variant classes
 * @param base - Base classes
 * @param variants - Variant classes object
 * @param defaultVariant - Default variant key
 * @returns Function to get variant classes
 */
export function createVariants<
  T extends Record<string, Record<string, string>>,
>(base: string, variants: T, defaultVariant: { [K in keyof T]: keyof T[K] }) {
  return (props: Partial<{ [K in keyof T]: keyof T[K] }> = {}) => {
    const variantClasses = Object.entries(variants).map(([key, variantMap]) => {
      const variant = props[key as keyof T] || defaultVariant[key as keyof T];
      return variantMap[variant as keyof typeof variantMap];
    });

    return cn(base, ...variantClasses);
  };
}

/**
 * Create safe area padding utility
 * @param sides - Which sides to apply safe area padding
 * @returns CSS safe area padding
 */
export function safeArea(
  sides: ("top" | "bottom" | "left" | "right")[] = [
    "top",
    "bottom",
    "left",
    "right",
  ]
): Record<string, string> {
  const styles: Record<string, string> = {};

  sides.forEach((side) => {
    styles[`padding-${side}`] = `env(safe-area-inset-${side})`;
  });

  return styles;
}

/**
 * Create touch-friendly sizing utility
 * @param size - Touch target size
 * @returns CSS sizing for touch targets
 */
export function touchTarget(
  size: "default" | "lg" | "xl" = "default"
): Record<string, string> {
  const sizeMap = {
    default: "44px",
    lg: "48px",
    xl: "56px",
  };

  return {
    minHeight: sizeMap[size],
    minWidth: sizeMap[size],
  };
}
