"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { ThemeProvider as ThemeContextProvider } from "@/contexts/ThemeContext";
import { ThemeType } from "@/types/theme";
import { useThemePersistence } from "@/hooks/useThemePersistence";

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeType;
}

/**
 * ThemeProvider component that handles SSR compatibility and theme persistence
 * This component ensures that theme is properly hydrated on the client side
 * and prevents hydration mismatches between server and client
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = "extreme-brutalist",
}) => {
  const { theme, isHydrated } = useThemePersistence({ defaultTheme });
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering theme-dependent content until hydrated
  if (!mounted || !isHydrated) {
    return (
      <ThemeContextProvider initialTheme={defaultTheme}>
        <div className="theme-loading">{children}</div>
      </ThemeContextProvider>
    );
  }

  return (
    <ThemeContextProvider initialTheme={theme}>{children}</ThemeContextProvider>
  );
};

/**
 * NoSSR wrapper component to prevent SSR for theme-sensitive components
 */
export const NoSSR: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <>{children}</>;
};
