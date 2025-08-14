import type { Config } from "tailwindcss";
import { designTokens } from "./src/lib/design-tokens";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design token-based color system
        "primary-black": designTokens.colors.primary.black,
        "primary-white": designTokens.colors.primary.white,
        "primary-gray": designTokens.colors.primary.gray,
        "accent-yellow": designTokens.colors.accent.yellow,
        "accent-yellow-dark": designTokens.colors.accent.yellowDark,
        "accent-yellow-light": designTokens.colors.accent.yellowLight,
        semantic: designTokens.colors.semantic,
        brutalist: {
          black: designTokens.colors.primary.black,
          white: designTokens.colors.primary.white,
          yellow: designTokens.colors.accent.yellow,
          charcoal: designTokens.colors.brutalist.charcoal,
          "off-white": designTokens.colors.brutalist.offWhite,
        },
        // Semantic color mapping using CSS custom properties
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",

        // Enhanced gradient colors
        "gradient-dark-start": designTokens.colors.primary.black,
        "gradient-dark-middle": designTokens.colors.brutalist.charcoal[200],
        "gradient-dark-end": designTokens.colors.primary.black,
        "gradient-light-start": designTokens.colors.primary.white,
        "gradient-light-middle": designTokens.colors.brutalist.offWhite[200],
        "gradient-light-end": designTokens.colors.brutalist.offWhite[100],
      },
      fontFamily: designTokens.typography.fontFamilies,
      fontSize: {
        // Base font sizes with enhanced line heights and letter spacing
        xs: [
          designTokens.typography.fontSizes.xs,
          {
            lineHeight: designTokens.typography.lineHeights.relaxed,
            letterSpacing: designTokens.typography.letterSpacing.normal,
          },
        ],
        sm: [
          designTokens.typography.fontSizes.sm,
          {
            lineHeight: designTokens.typography.lineHeights.relaxed,
            letterSpacing: designTokens.typography.letterSpacing.normal,
          },
        ],
        base: [
          designTokens.typography.fontSizes.base,
          {
            lineHeight: designTokens.typography.lineHeights.loose,
            letterSpacing: designTokens.typography.letterSpacing.normal,
          },
        ],
        lg: [
          designTokens.typography.fontSizes.lg,
          {
            lineHeight: designTokens.typography.lineHeights.relaxed,
            letterSpacing: designTokens.typography.letterSpacing.normal,
          },
        ],
        xl: [
          designTokens.typography.fontSizes.xl,
          {
            lineHeight: designTokens.typography.lineHeights.relaxed,
            letterSpacing: designTokens.typography.letterSpacing.normal,
          },
        ],
        "2xl": [
          designTokens.typography.fontSizes["2xl"],
          {
            lineHeight: designTokens.typography.lineHeights.normal,
            letterSpacing: designTokens.typography.letterSpacing.normal,
          },
        ],
        "3xl": [
          designTokens.typography.fontSizes["3xl"],
          {
            lineHeight: designTokens.typography.lineHeights.normal,
            letterSpacing: designTokens.typography.letterSpacing.tight,
          },
        ],
        "4xl": [
          designTokens.typography.fontSizes["4xl"],
          {
            lineHeight: designTokens.typography.lineHeights.snug,
            letterSpacing: designTokens.typography.letterSpacing.tight,
          },
        ],
        "5xl": [
          designTokens.typography.fontSizes["5xl"],
          {
            lineHeight: designTokens.typography.lineHeights.snug,
            letterSpacing: designTokens.typography.letterSpacing.tighter,
          },
        ],
        "6xl": [
          designTokens.typography.fontSizes["6xl"],
          {
            lineHeight: designTokens.typography.lineHeights.tight,
            letterSpacing: designTokens.typography.letterSpacing.tighter,
          },
        ],
        "7xl": [
          designTokens.typography.fontSizes["7xl"],
          {
            lineHeight: designTokens.typography.lineHeights.tight,
            letterSpacing: designTokens.typography.letterSpacing.tighter,
          },
        ],
        "8xl": [
          designTokens.typography.fontSizes["8xl"],
          {
            lineHeight: designTokens.typography.lineHeights.tighter,
            letterSpacing: designTokens.typography.letterSpacing.tighter,
          },
        ],
        "9xl": [
          designTokens.typography.fontSizes["9xl"],
          {
            lineHeight: designTokens.typography.lineHeights.none,
            letterSpacing: designTokens.typography.letterSpacing.tighter,
          },
        ],
        display: [
          designTokens.typography.fontSizes.display,
          {
            lineHeight: designTokens.typography.lineHeights.none,
            letterSpacing: designTokens.typography.letterSpacing.tighter,
          },
        ],

        // Fluid typography sizes for responsive scaling
        "fluid-xs": designTokens.typography.fontSizes["fluid-xs"],
        "fluid-sm": designTokens.typography.fontSizes["fluid-sm"],
        "fluid-base": designTokens.typography.fontSizes["fluid-base"],
        "fluid-lg": designTokens.typography.fontSizes["fluid-lg"],
        "fluid-xl": designTokens.typography.fontSizes["fluid-xl"],
        "fluid-2xl": designTokens.typography.fontSizes["fluid-2xl"],
        "fluid-3xl": designTokens.typography.fontSizes["fluid-3xl"],
        "fluid-4xl": designTokens.typography.fontSizes["fluid-4xl"],
        "fluid-5xl": designTokens.typography.fontSizes["fluid-5xl"],
        "fluid-6xl": designTokens.typography.fontSizes["fluid-6xl"],
        "fluid-7xl": designTokens.typography.fontSizes["fluid-7xl"],
        "fluid-8xl": designTokens.typography.fontSizes["fluid-8xl"],
        "fluid-9xl": designTokens.typography.fontSizes["fluid-9xl"],
        "fluid-display": designTokens.typography.fontSizes["fluid-display"],
      },
      fontWeight: designTokens.typography.fontWeights,
      lineHeight: designTokens.typography.lineHeights,
      letterSpacing: designTokens.typography.letterSpacing,
      spacing: {
        ...designTokens.spacing,
        // Additional spacing values for specific use cases
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },
      borderWidth: {
        ...designTokens.borders.width,
        "3": "3px",
        "6": "6px",
      },
      borderRadius: designTokens.borders.radius,
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-in-up": "slideInUp 0.5s ease-out",
        "slide-in-down": "slideInDown 0.5s ease-out",
        "slide-in-left": "slideInLeft 0.5s ease-out",
        "slide-in-right": "slideInRight 0.5s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "bounce-subtle": "bounceSubtle 0.6s ease-out",
        typing:
          "typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideInUp: {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideInDown: {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        bounceSubtle: {
          "0%, 20%, 53%, 80%, 100%": { transform: "translate3d(0,0,0)" },
          "40%, 43%": { transform: "translate3d(0, -8px, 0)" },
          "70%": { transform: "translate3d(0, -4px, 0)" },
          "90%": { transform: "translate3d(0, -2px, 0)" },
        },
        typing: {
          from: { width: "0" },
          to: { width: "100%" },
        },
        "blink-caret": {
          "from, to": { "border-color": "transparent" },
          "50%": { "border-color": "#FFFF00" },
        },
      },
      boxShadow: {
        // Design token-based shadows
        "brutalist-sm": designTokens.shadows.brutalist.sm,
        "brutalist-md": designTokens.shadows.brutalist.md,
        "brutalist-lg": designTokens.shadows.brutalist.lg,
        "brutalist-xl": designTokens.shadows.brutalist.xl,
        "brutalist-2xl": designTokens.shadows.brutalist["2xl"],
        "accent-sm": designTokens.shadows.accent.sm,
        "accent-md": designTokens.shadows.accent.md,
        "accent-lg": designTokens.shadows.accent.lg,
        "accent-xl": designTokens.shadows.accent.xl,
        "accent-2xl": designTokens.shadows.accent["2xl"],
        "light-sm": designTokens.shadows.light.sm,
        "light-md": designTokens.shadows.light.md,
        "light-lg": designTokens.shadows.light.lg,
        "light-xl": designTokens.shadows.light.xl,
        "light-2xl": designTokens.shadows.light["2xl"],
        // Legacy support
        brutalist: designTokens.shadows.brutalist.md,
        "brutalist-yellow": designTokens.shadows.accent.md,
        "brutalist-yellow-lg": designTokens.shadows.accent.lg,
        "brutalist-inset": "inset 4px 4px 0px 0px var(--color-primary-black)",
      },
      zIndex: designTokens.zIndex,
      backdropBlur: {
        xs: "2px",
      },
      // Mobile-specific utilities
      screens: {
        xs: "475px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
        // Touch device queries
        touch: { raw: "(hover: none) and (pointer: coarse)" },
        "no-touch": { raw: "(hover: hover) and (pointer: fine)" },
        // Orientation queries
        portrait: { raw: "(orientation: portrait)" },
        landscape: { raw: "(orientation: landscape)" },
      },
      // Touch target sizes
      minHeight: {
        touch: "44px",
        "touch-lg": "48px",
        "touch-xl": "56px",
      },
      minWidth: {
        touch: "44px",
        "touch-lg": "48px",
        "touch-xl": "56px",
      },
      // Safe area utilities
      padding: {
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-left": "env(safe-area-inset-left)",
        "safe-right": "env(safe-area-inset-right)",
      },
      margin: {
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-left": "env(safe-area-inset-left)",
        "safe-right": "env(safe-area-inset-right)",
      },
    },
  },
  plugins: [
    // Custom plugin for mobile utilities and enhanced typography
    function ({
      addUtilities,
    }: {
      addUtilities: (utilities: Record<string, any>) => void;
    }) {
      const newUtilities = {
        // Mobile optimization utilities
        ".touch-manipulation": {
          "touch-action": "manipulation",
          "-webkit-touch-callout": "none",
          "-webkit-user-select": "none",
          "user-select": "none",
        },
        ".prevent-zoom": {
          "font-size": "16px",
        },
        ".hardware-acceleration": {
          transform: "translateZ(0)",
          "will-change": "transform",
        },
        ".mobile-scroll": {
          "-webkit-overflow-scrolling": "touch",
          "overscroll-behavior": "none",
        },
        ".safe-area-inset": {
          "padding-top": "env(safe-area-inset-top)",
          "padding-bottom": "env(safe-area-inset-bottom)",
          "padding-left": "env(safe-area-inset-left)",
          "padding-right": "env(safe-area-inset-right)",
        },

        // Enhanced typography utilities
        ".font-feature-normal": {
          "font-feature-settings": '"kern" 1, "liga" 1, "calt" 1',
        },
        ".font-feature-mono": {
          "font-feature-settings": '"kern" 1, "liga" 0, "calt" 0, "tnum" 1',
        },
        ".font-feature-display": {
          "font-feature-settings": '"kern" 1, "liga" 0, "calt" 0, "ss01" 1',
        },

        // Text optimization utilities
        ".text-crisp": {
          "-webkit-font-smoothing": "antialiased",
          "-moz-osx-font-smoothing": "grayscale",
          "text-rendering": "optimizeLegibility",
        },

        // Typography hierarchy utilities
        ".typography-scale-display": {
          "font-size": "clamp(4rem, 12vw, 10rem)",
          "line-height": "0.9",
          "letter-spacing": "-0.025em",
        },
        ".typography-scale-hero": {
          "font-size": "clamp(3rem, 8vw, 6rem)",
          "line-height": "1",
          "letter-spacing": "-0.02em",
        },
        ".typography-scale-heading": {
          "font-size": "clamp(1.5rem, 4vw, 3rem)",
          "line-height": "1.1",
          "letter-spacing": "-0.01em",
        },
        ".typography-scale-body": {
          "font-size": "clamp(1rem, 2.5vw, 1.125rem)",
          "line-height": "1.5",
          "letter-spacing": "0em",
        },
      };
      addUtilities(newUtilities);
    },
  ],
} satisfies Config;

export default config;
