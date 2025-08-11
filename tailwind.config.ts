import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brutalist color palette
        brutalist: {
          black: "#000000",
          white: "#FFFFFF",
          yellow: "#FFFF00",
          charcoal: {
            100: "#1A1A1A",
            200: "#2A2A2A",
          },
          "off-white": {
            100: "#F8F8F8",
            200: "#F0F0F0",
          },
          "yellow-variant": {
            100: "#FEF08A",
            200: "#EAB308",
          },
        },
        // Semantic color mapping
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#000000",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#FFFFFF",
          foreground: "#000000",
        },
        accent: {
          DEFAULT: "#FFFF00",
          foreground: "#000000",
        },
        muted: {
          DEFAULT: "#1A1A1A",
          foreground: "#F8F8F8",
        },
      },
      fontFamily: {
        mono: ["Space Mono", "monospace"],
        sans: ["Inter", "sans-serif"],
      },
      fontSize: {
        display: ["8rem", { lineHeight: "1", letterSpacing: "-0.02em" }],
        "6xl": ["4rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "5xl": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "4xl": ["2.25rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        "3xl": ["1.875rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        "2xl": ["1.5rem", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
        xl: ["1.25rem", { lineHeight: "1.4", letterSpacing: "-0.01em" }],
        lg: ["1.125rem", { lineHeight: "1.5" }],
        base: ["1rem", { lineHeight: "1.5" }],
        sm: ["0.875rem", { lineHeight: "1.5" }],
        xs: ["0.75rem", { lineHeight: "1.5" }],
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },
      borderWidth: {
        "3": "3px",
        "6": "6px",
      },
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
        brutalist: "4px 4px 0px 0px #000000",
        "brutalist-lg": "8px 8px 0px 0px #000000",
        "brutalist-yellow": "4px 4px 0px 0px #FFFF00",
        "brutalist-yellow-lg": "8px 8px 0px 0px #FFFF00",
        "brutalist-inset": "inset 4px 4px 0px 0px #000000",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
