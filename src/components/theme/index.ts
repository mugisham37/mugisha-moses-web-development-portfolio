// Theme component utilities barrel export

// Core theme components
export { ThemeProvider, useThemeContext } from "@/contexts/ThemeContext";

// Theme renderer components
export {
  ThemeRenderer,
  ConditionalThemeRenderer,
  MultiThemeRenderer,
  useThemeClassName,
  useThemeStyles,
} from "./ThemeRenderer";

// Theme detector component
export { ThemeDetector } from "./ThemeDetector";

// Higher-order components
export {
  withTheme,
  withCurrentTheme,
  withThemeStyles,
  withThemeTransition,
  type WithThemeProps,
} from "./withTheme";

// Theme hooks
export {
  useTheme,
  useThemeVariables,
  useThemeClassName as useThemeClass,
  useThemeStyles as useThemeStyle,
  useThemeCondition,
  useThemeAnimation,
  useThemeTransitionUtils,
  useThemeResponsive,
} from "@/hooks/useTheme";

// Theme detector hook
export { useThemeDetector } from "@/hooks/useThemeDetector";

// CSS utilities
export {
  ThemeCSSUtils,
  createThemeCSSUtils,
  themeUtils,
} from "@/utils/theme-css-utils";

// Re-export types
export type {
  ThemeType,
  ThemeConfig,
  ThemeContextType,
  ThemeTransitionState,
} from "@/types/theme";
