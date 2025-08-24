// Theme component utilities barrel export

// Core theme components
export { ThemeProvider, useThemeContext } from "@/contexts/ThemeContext";

// Theme detector component
export { ThemeDetector } from "./ThemeDetector";

// Theme detector hook
export { useThemeDetector } from "@/hooks/useThemeDetector";

// Re-export types
export type {
  ThemeType,
  ThemeConfig,
  ThemeContextType,
  ThemeTransitionState,
} from "@/types/theme";
