import { ThemeConfiguration } from "@/types/theme";

export const themeConfiguration: ThemeConfiguration = {
  extreme: {
    colors: {
      primary: "#000000",
      secondary: "#ffffff",
      accent: "#ffff00",
      highlight: "#00ffff",
      success: "#00ff00",
      bg: "#ffffff",
      text: "#000000",
    },
    typography: {
      primary: "Space Mono, monospace",
      code: "JetBrains Mono, monospace",
      sizes: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
        "6xl": "3.75rem",
      },
    },
    borders: {
      width: "8px",
      style: "solid",
      radius: "0px",
    },
    shadows: {
      brutal: "8px 8px 0",
      double: "8px 8px 0 #ffff00, 16px 16px 0 #ffffff",
      triple: "8px 8px 0 #ffff00, 16px 16px 0 #ffffff, 24px 24px 0 #000000",
    },
    animations: {
      duration: "0.3s",
      easing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      glitch: "brutalGlitch 0.3s ease-out",
      pulse: "brutalPulse 2s ease-in-out infinite",
    },
  },
  refined: {
    colors: {
      primary: "#1a1a1a",
      secondary: "#f5f5f5",
      accent: "#8b5cf6",
      highlight: "#06b6d4",
      success: "#10b981",
      bg: "#f5f5f5",
      text: "#1a1a1a",
    },
    typography: {
      primary: "Inter, sans-serif",
      code: "JetBrains Mono, monospace",
      sizes: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
        "6xl": "3.75rem",
      },
    },
    borders: {
      width: "2px",
      style: "solid",
      radius: "8px",
    },
    shadows: {
      subtle: "4px 4px 12px rgba(0, 0, 0, 0.3)",
      elevated: "0 10px 30px rgba(0, 0, 0, 0.2)",
      glow: "0 0 20px rgba(139, 92, 246, 0.3)",
    },
    animations: {
      duration: "0.4s",
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      smooth: "smoothTransition 0.4s ease",
      float: "gentleFloat 6s ease-in-out infinite",
    },
  },
};
