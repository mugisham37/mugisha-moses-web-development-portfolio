"use client";

import { useState, useEffect } from "react";
import { ThemeType } from "@/types/theme";

const THEME_STORAGE_KEY = "brutalist-portfolio-theme";

interface UseThemePersistenceOptions {
  defaultTheme?: ThemeType;
  storageKey?: string;
}

export const useThemePersistence = (
  options: UseThemePersistenceOptions = {}
) => {
  const { defaultTheme = "extreme-brutalist", storageKey = THEME_STORAGE_KEY } =
    options;

  const [theme, setThemeState] = useState<ThemeType>(defaultTheme);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load theme from localStorage on client-side hydration
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedTheme = localStorage.getItem(storageKey) as ThemeType;
        if (
          savedTheme &&
          (savedTheme === "extreme-brutalist" ||
            savedTheme === "refined-brutalist")
        ) {
          setThemeState(savedTheme);
        }
      } catch (error) {
        console.warn("Failed to load theme from localStorage:", error);
      } finally {
        setIsHydrated(true);
      }
    }
  }, [storageKey]);

  // Save theme to localStorage when it changes
  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(storageKey, newTheme);
      } catch (error) {
        console.warn("Failed to save theme to localStorage:", error);
      }
    }
  };

  // Clear saved theme
  const clearTheme = () => {
    setThemeState(defaultTheme);

    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(storageKey);
      } catch (error) {
        console.warn("Failed to clear theme from localStorage:", error);
      }
    }
  };

  return {
    theme,
    setTheme,
    clearTheme,
    isHydrated,
  };
};
