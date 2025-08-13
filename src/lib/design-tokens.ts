/**
 * Design Tokens System
 * Comprehensive design token definitions for the brutalist portfolio
 * Following the Industrial Digital Brutalism design philosophy
 */

export const designTokens = {
  colors: {
    primary: {
      black: "#000000",
      white: "#ffffff",
      gray: {
        100: "#f5f5f5",
        200: "#e5e5e5",
        300: "#d4d4d4",
        400: "#a3a3a3",
        500: "#737373",
        600: "#525252",
        700: "#404040",
        800: "#262626",
        900: "#171717",
      },
    },
    accent: {
      yellow: "#ffff00",
      yellowDark: "#e6e600",
      yellowLight: "#ffff33",
    },
    semantic: {
      success: "#22c55e",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#3b82f6",
    },
    brutalist: {
      charcoal: {
        100: "#1a1a1a",
        200: "#2a2a2a",
      },
      offWhite: {
        100: "#f8f8f8",
        200: "#f0f0f0",
      },
    },
  },

  typography: {
    fontFamilies: {
      mono: [
        "Space Mono",
        "Space Mono Fallback",
        "Courier New",
        "Consolas",
        "Monaco",
        "monospace",
      ],
      sans: [
        "Inter",
        "Inter Fallback",
        "Helvetica Neue",
        "Arial",
        "system-ui",
        "sans-serif",
      ],
    },
    fontSizes: {
      // Base scale (16px base)
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem", // 36px
      "5xl": "3rem", // 48px
      "6xl": "3.75rem", // 60px
      "7xl": "4.5rem", // 72px
      "8xl": "6rem", // 96px
      "9xl": "8rem", // 128px
      display: "10rem", // 160px - Enhanced for hero sections

      // Fluid typography sizes for responsive scaling
      "fluid-xs": "clamp(0.75rem, 1.5vw, 0.875rem)",
      "fluid-sm": "clamp(0.875rem, 2vw, 1rem)",
      "fluid-base": "clamp(1rem, 2.5vw, 1.125rem)",
      "fluid-lg": "clamp(1.125rem, 3vw, 1.25rem)",
      "fluid-xl": "clamp(1.25rem, 3.5vw, 1.5rem)",
      "fluid-2xl": "clamp(1.5rem, 4vw, 1.875rem)",
      "fluid-3xl": "clamp(1.875rem, 5vw, 2.25rem)",
      "fluid-4xl": "clamp(2.25rem, 6vw, 3rem)",
      "fluid-5xl": "clamp(3rem, 7vw, 3.75rem)",
      "fluid-6xl": "clamp(3.75rem, 8vw, 4.5rem)",
      "fluid-7xl": "clamp(4.5rem, 9vw, 6rem)",
      "fluid-8xl": "clamp(6rem, 10vw, 8rem)",
      "fluid-9xl": "clamp(8rem, 12vw, 10rem)",
      "fluid-display": "clamp(8rem, 15vw, 12rem)",
    },
    fontWeights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
    lineHeights: {
      none: 1,
      tighter: 1.05,
      tight: 1.1,
      snug: 1.2,
      normal: 1.3,
      relaxed: 1.4,
      loose: 1.5,
      looser: 1.6,
    },
    letterSpacing: {
      tightest: "-0.05em",
      tighter: "-0.025em",
      tight: "-0.01em",
      normal: "0em",
      wide: "0.025em",
      wider: "0.05em",
      widest: "0.1em",
      ultra: "0.15em",
    },
    // Enhanced typography scale ratios
    scaleRatio: {
      minorSecond: 1.067,
      majorSecond: 1.125,
      minorThird: 1.2,
      majorThird: 1.25,
      perfectFourth: 1.333,
      augmentedFourth: 1.414,
      perfectFifth: 1.5,
      goldenRatio: 1.618,
    },
  },

  spacing: {
    px: "1px",
    0: "0px",
    1: "0.25rem", // 4px
    2: "0.5rem", // 8px
    3: "0.75rem", // 12px
    4: "1rem", // 16px
    5: "1.25rem", // 20px
    6: "1.5rem", // 24px
    8: "2rem", // 32px
    10: "2.5rem", // 40px
    12: "3rem", // 48px
    16: "4rem", // 64px
    20: "5rem", // 80px
    24: "6rem", // 96px
    32: "8rem", // 128px
    40: "10rem", // 160px
    48: "12rem", // 192px
    56: "14rem", // 224px
    64: "16rem", // 256px
  },

  shadows: {
    brutalist: {
      sm: "4px 4px 0px rgba(255, 255, 255, 0.1)",
      md: "8px 8px 0px rgba(255, 255, 255, 0.1)",
      lg: "12px 12px 0px rgba(255, 255, 255, 0.1)",
      xl: "16px 16px 0px rgba(255, 255, 255, 0.1)",
      "2xl": "20px 20px 0px rgba(255, 255, 255, 0.1)",
    },
    accent: {
      sm: "4px 4px 0px rgba(255, 255, 0, 0.3)",
      md: "8px 8px 0px rgba(255, 255, 0, 0.3)",
      lg: "12px 12px 0px rgba(255, 255, 0, 0.3)",
      xl: "16px 16px 0px rgba(255, 255, 0, 0.3)",
      "2xl": "20px 20px 0px rgba(255, 255, 0, 0.3)",
    },
    light: {
      sm: "4px 4px 0px rgba(0, 0, 0, 0.1)",
      md: "8px 8px 0px rgba(0, 0, 0, 0.1)",
      lg: "12px 12px 0px rgba(0, 0, 0, 0.1)",
      xl: "16px 16px 0px rgba(0, 0, 0, 0.1)",
      "2xl": "20px 20px 0px rgba(0, 0, 0, 0.1)",
    },
  },

  animations: {
    durations: {
      fast: "0.15s",
      normal: "0.3s",
      slow: "0.6s",
      slower: "1s",
    },
    easings: {
      easeOut: "cubic-bezier(0.4, 0, 0.2, 1)",
      easeIn: "cubic-bezier(0.4, 0, 1, 1)",
      easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
      bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      sharp: "cubic-bezier(0.4, 0, 0.6, 1)",
    },
  },

  borders: {
    width: {
      none: "0px",
      thin: "1px",
      default: "2px",
      thick: "4px",
      brutalist: "4px",
      "brutalist-lg": "6px",
      "brutalist-xl": "8px",
    },
    radius: {
      none: "0px",
      sm: "2px",
      default: "4px",
      md: "6px",
      lg: "8px",
      brutalist: "0px", // Brutalist design uses no border radius
    },
  },

  breakpoints: {
    xs: "475px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },

  zIndex: {
    hide: -1,
    auto: "auto",
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
} as const;

// Type definitions for design tokens
export type DesignTokens = typeof designTokens;
export type ColorTokens = typeof designTokens.colors;
export type TypographyTokens = typeof designTokens.typography;
export type SpacingTokens = typeof designTokens.spacing;
export type ShadowTokens = typeof designTokens.shadows;
export type AnimationTokens = typeof designTokens.animations;
export type BorderTokens = typeof designTokens.borders;

// Utility type for accessing nested token values
export type TokenPath<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}.${TokenPath<T[K]>}`
          : K
        : never;
    }[keyof T]
  : never;

// Color token paths for type safety
export type ColorPath = TokenPath<ColorTokens>;
export type TypographyPath = TokenPath<TypographyTokens>;
export type SpacingPath = TokenPath<SpacingTokens>;
export type ShadowPath = TokenPath<ShadowTokens>;
