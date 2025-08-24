"use client";

import React from "react";
import {
  ThemeRenderer,
  useTheme,
  useThemeClassName,
  type ThemeType,
} from "./index";

// Quick test component to verify all utilities work
export const ThemeUtilsQuickTest: React.FC = () => {
  const { currentTheme } = useTheme();
  const className = useThemeClassName("test-component");

  return (
    <div className={className} style={{ padding: "16px", margin: "8px" }}>
      <h4>Theme Utils Quick Test</h4>
      <p>Current theme: {currentTheme}</p>

      <ThemeRenderer>
        {(theme: ThemeType) => (
          <div
            style={{
              padding: "8px",
              backgroundColor:
                theme === "extreme-brutalist" ? "#ffff00" : "#e2e8f0",
              color: theme === "extreme-brutalist" ? "#000" : "#1a1a1a",
              marginTop: "8px",
            }}
          >
            ThemeRenderer working: {theme}
          </div>
        )}
      </ThemeRenderer>
    </div>
  );
};
