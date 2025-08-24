"use client";

import React, { ReactNode } from "react";
import { useThemeTransition } from "@/hooks/useThemeTransition";

interface ThemeDetectorProps {
  children: ReactNode;
}

// Component that automatically detects and applies theme changes based on scroll
export const ThemeDetector: React.FC<ThemeDetectorProps> = ({ children }) => {
  // This hook handles all the scroll-based theme detection logic
  useThemeTransition();

  return <>{children}</>;
};
