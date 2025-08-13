/**
 * Design Token Type Definitions
 * Comprehensive TypeScript types for the design token system
 */

import { designTokens } from "@/lib/design-tokens";

// Base design token types
export type DesignTokens = typeof designTokens;

// Color system types
export type ColorTokens = typeof designTokens.colors;
export type PrimaryColors = typeof designTokens.colors.primary;
export type AccentColors = typeof designTokens.colors.accent;
export type SemanticColors = typeof designTokens.colors.semantic;
export type BrutalistColors = typeof designTokens.colors.brutalist;

// Typography system types
export type TypographyTokens = typeof designTokens.typography;
export type FontFamily = keyof typeof designTokens.typography.fontFamilies;
export type FontSize = keyof typeof designTokens.typography.fontSizes;
export type FontWeight = keyof typeof designTokens.typography.fontWeights;
export type LineHeight = keyof typeof designTokens.typography.lineHeights;
export type LetterSpacing = keyof typeof designTokens.typography.letterSpacing;

// Spacing system types
export type SpacingTokens = typeof designTokens.spacing;
export type SpacingScale = keyof typeof designTokens.spacing;

// Shadow system types
export type ShadowTokens = typeof designTokens.shadows;
export type ShadowVariant = keyof typeof designTokens.shadows;
export type ShadowSize = keyof typeof designTokens.shadows.brutalist;

// Animation system types
export type AnimationTokens = typeof designTokens.animations;
export type AnimationDuration = keyof typeof designTokens.animations.durations;
export type AnimationEasing = keyof typeof designTokens.animations.easings;

// Border system types
export type BorderTokens = typeof designTokens.borders;
export type BorderWidth = keyof typeof designTokens.borders.width;
export type BorderRadius = keyof typeof designTokens.borders.radius;

// Breakpoint types
export type Breakpoint = keyof typeof designTokens.breakpoints;

// Z-index types
export type ZIndex = keyof typeof designTokens.zIndex;

// Component variant types
export interface ComponentVariants {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "secondary" | "accent" | "ghost";
  state?: "default" | "hover" | "active" | "disabled" | "loading";
}

// Button component types
export interface ButtonVariants {
  variant?: "primary" | "secondary" | "accent" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg" | "xl";
  state?: "default" | "hover" | "active" | "disabled" | "loading";
}

// Card component types
export interface CardVariants {
  variant?: "default" | "elevated" | "accent" | "outline";
  size?: "sm" | "md" | "lg" | "xl";
  hover?: "lift" | "glow" | "invert" | "scale" | "none";
  padding?: "sm" | "md" | "lg" | "xl";
  state?: "default" | "hover" | "active" | "disabled" | "loading";
}

// Typography component types
export interface TypographyVariants {
  variant?:
    | "display"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "body"
    | "caption"
    | "overline";
  weight?: FontWeight;
  family?: FontFamily;
  size?: FontSize;
  color?: string;
}

// Theme types
export interface ThemeConfig {
  colors: {
    background: string;
    foreground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    accent: string;
    accentForeground: string;
    muted: string;
    mutedForeground: string;
    border: string;
    input: string;
    ring: string;
  };
  shadows: {
    brutalist: string;
    brutalistLg: string;
    brutalistYellow: string;
  };
}

// CSS custom property types
export type CSSCustomProperty = `--${string}`;

// Design token path types for type-safe access
export type ColorPath =
  | "primary.black"
  | "primary.white"
  | `primary.gray.${100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900}`
  | "accent.yellow"
  | "accent.yellowDark"
  | "accent.yellowLight"
  | "semantic.success"
  | "semantic.warning"
  | "semantic.error"
  | "semantic.info"
  | "brutalist.charcoal.100"
  | "brutalist.charcoal.200"
  | "brutalist.offWhite.100"
  | "brutalist.offWhite.200";

export type SpacingPath = keyof typeof designTokens.spacing;

export type ShadowPath =
  | `brutalist.${ShadowSize}`
  | `accent.${ShadowSize}`
  | `light.${ShadowSize}`;

// Utility types for component props
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface VariantProps<T extends Record<string, any>> {
  variant?: keyof T;
}

export interface SizeProps<T extends Record<string, any>> {
  size?: keyof T;
}

// Animation configuration types
export interface AnimationConfig {
  duration: AnimationDuration;
  easing: AnimationEasing;
  delay?: number;
  fillMode?: "none" | "forwards" | "backwards" | "both";
  iterationCount?: number | "infinite";
  direction?: "normal" | "reverse" | "alternate" | "alternate-reverse";
}

// Responsive design types
export interface ResponsiveValue<T> {
  base?: T;
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  "2xl"?: T;
}

// Accessibility types
export interface AccessibilityConfig {
  reducedMotion?: boolean;
  highContrast?: boolean;
  focusVisible?: boolean;
  screenReader?: boolean;
}

// Component state types
export type ComponentState =
  | "default"
  | "hover"
  | "active"
  | "focus"
  | "disabled"
  | "loading"
  | "error"
  | "success";

// Layout types
export interface LayoutProps {
  display?:
    | "block"
    | "inline"
    | "inline-block"
    | "flex"
    | "inline-flex"
    | "grid"
    | "inline-grid";
  position?: "static" | "relative" | "absolute" | "fixed" | "sticky";
  overflow?: "visible" | "hidden" | "scroll" | "auto";
  zIndex?: ZIndex;
}

// Spacing props types
export interface SpacingProps {
  m?: SpacingScale;
  mt?: SpacingScale;
  mr?: SpacingScale;
  mb?: SpacingScale;
  ml?: SpacingScale;
  mx?: SpacingScale;
  my?: SpacingScale;
  p?: SpacingScale;
  pt?: SpacingScale;
  pr?: SpacingScale;
  pb?: SpacingScale;
  pl?: SpacingScale;
  px?: SpacingScale;
  py?: SpacingScale;
}

// Border props types
export interface BorderProps {
  border?: boolean;
  borderWidth?: BorderWidth;
  borderRadius?: BorderRadius;
  borderColor?: string;
}

// Shadow props types
export interface ShadowProps {
  shadow?: ShadowVariant;
  shadowSize?: ShadowSize;
}

// Combined component props
export interface DesignSystemProps
  extends BaseComponentProps,
    LayoutProps,
    SpacingProps,
    BorderProps,
    ShadowProps {
  // Additional design system props can be added here
}

// Theme context types
export interface ThemeContextValue {
  theme: "light" | "dark";
  toggleTheme: () => void;
  tokens: DesignTokens;
  config: ThemeConfig;
}

// Design system configuration
export interface DesignSystemConfig {
  tokens: DesignTokens;
  components: {
    button: ButtonVariants;
    card: CardVariants;
    typography: TypographyVariants;
  };
  theme: ThemeConfig;
  accessibility: AccessibilityConfig;
}

// Export utility type for getting nested object keys
export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

// Token accessor types
export type TokenAccessor<T extends object> = NestedKeyOf<T>;
export type ColorTokenAccessor = TokenAccessor<ColorTokens>;
export type SpacingTokenAccessor = TokenAccessor<SpacingTokens>;
export type TypographyTokenAccessor = TokenAccessor<TypographyTokens>;
