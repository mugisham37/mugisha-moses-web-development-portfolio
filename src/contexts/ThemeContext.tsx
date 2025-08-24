"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  ThemeType,
  ThemeContextType,
  ThemeConfig,
  ThemeTransitionState,
} from "@/types/theme";
import { themeConfiguration } from "@/data/theme-config";

// Create the theme context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme storage key
const THEME_STORAGE_KEY = "brutalist-portfolio-theme";

// Default theme transition duration
const TRANSITION_DURATION = 600;

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: ThemeType;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialTheme = "extreme-brutalist",
}) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>(initialTheme);
  const [transitionState, setTransitionState] = useState<ThemeTransitionState>({
    from: initialTheme,
    to: initialTheme,
    progress: 1,
    isActive: false,
  });

  // Get current theme configuration
  const config: ThemeConfig =
    currentTheme === "extreme-brutalist"
      ? themeConfiguration.extreme
      : themeConfiguration.refined;

  // Load theme from localStorage on mount (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeType;
        if (
          savedTheme &&
          (savedTheme === "extreme-brutalist" ||
            savedTheme === "refined-brutalist")
        ) {
          setCurrentTheme(savedTheme);
        }
      } catch (error) {
        console.warn("Failed to load theme from localStorage:", error);
      }
    }
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
      } catch (error) {
        console.warn("Failed to save theme to localStorage:", error);
      }
    }
  }, [currentTheme]);

  // Theme switching with transition animation
  const setTheme = useCallback(
    (newTheme: ThemeType) => {
      if (newTheme === currentTheme) return;

      // Start transition
      setTransitionState({
        from: currentTheme,
        to: newTheme,
        progress: 0,
        isActive: true,
      });

      // Animate transition progress
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / TRANSITION_DURATION, 1);

        setTransitionState((prev) => ({
          ...prev,
          progress,
        }));

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Complete transition
          setCurrentTheme(newTheme);
          setTransitionState({
            from: newTheme,
            to: newTheme,
            progress: 1,
            isActive: false,
          });
        }
      };

      requestAnimationFrame(animate);
    },
    [currentTheme]
  );

  // Apply theme CSS custom properties to document root
  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = document.documentElement;

      // Set theme CSS custom properties
      root.style.setProperty("--theme-primary", config.colors.primary);
      root.style.setProperty("--theme-secondary", config.colors.secondary);
      root.style.setProperty("--theme-accent", config.colors.accent);
      root.style.setProperty("--theme-highlight", config.colors.highlight);
      root.style.setProperty("--theme-success", config.colors.success);
      root.style.setProperty("--theme-bg", config.colors.bg);
      root.style.setProperty("--theme-text", config.colors.text);

      // Set RGB values for alpha transparency
      root.style.setProperty("--theme-accent-rgb", config.colors.accentRgb);
      root.style.setProperty(
        "--theme-highlight-rgb",
        config.colors.highlightRgb
      );
      root.style.setProperty("--theme-success-rgb", config.colors.successRgb);

      root.style.setProperty("--theme-font-primary", config.typography.primary);
      root.style.setProperty("--theme-font-code", config.typography.code);

      root.style.setProperty("--theme-border-width", config.borders.width);
      root.style.setProperty("--theme-border-style", config.borders.style);
      root.style.setProperty(
        "--theme-border-radius",
        config.borders.radius || "0px"
      );

      root.style.setProperty(
        "--theme-animation-duration",
        config.animations.duration
      );
      root.style.setProperty(
        "--theme-animation-easing",
        config.animations.easing
      );

      // Set shadow variables
      if (config.shadows.brutal) {
        root.style.setProperty("--theme-shadow-brutal", config.shadows.brutal);
      }
      if (config.shadows.subtle) {
        root.style.setProperty("--theme-shadow-subtle", config.shadows.subtle);
      }
      if (config.shadows.double) {
        root.style.setProperty("--theme-shadow-double", config.shadows.double);
      }
      if (config.shadows.triple) {
        root.style.setProperty("--theme-shadow-triple", config.shadows.triple);
      }
      if (config.shadows.elevated) {
        root.style.setProperty(
          "--theme-shadow-elevated",
          config.shadows.elevated
        );
      }
      if (config.shadows.glow) {
        root.style.setProperty("--theme-shadow-glow", config.shadows.glow);
      }

      // Add theme class to body
      document.body.className = document.body.className
        .replace(/theme-\w+/g, "")
        .trim();
      document.body.classList.add(`theme-${currentTheme}`);
    }
  }, [config, currentTheme]);

  const contextValue: ThemeContextType = {
    currentTheme,
    isTransitioning: transitionState.isActive,
    transitionProgress: transitionState.progress,
    setTheme,
    config,
    themeConfiguration,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useThemeContext = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
};

export { ThemeContext };
