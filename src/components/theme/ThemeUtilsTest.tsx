"use client";

import React from "react";
import {
  ThemeRenderer,
  ConditionalThemeRenderer,
  MultiThemeRenderer,
  useTheme,
  useThemeClassName,
  useThemeStyles,
  useThemeTransitionUtils,
} from "./index";

// Simple test component to verify all utilities work
export const ThemeUtilsTest: React.FC = () => {
  const { currentTheme } = useTheme();
  const className = useThemeClassName("test-component");
  const styles = useThemeStyles({ padding: "16px" });
  const { toggleTheme } = useThemeTransitionUtils();

  return (
    <div className={className} style={styles}>
      <h3>Theme Utils Test</h3>
      <p>Current theme: {currentTheme}</p>

      <button
        onClick={toggleTheme}
        style={{ margin: "8px", padding: "8px 16px" }}
      >
        Toggle Theme
      </button>

      <ThemeRenderer>
        {(theme) => (
          <div
            style={{
              marginTop: "16px",
              padding: "8px",
              backgroundColor:
                theme === "extreme-brutalist" ? "#ffff00" : "#e2e8f0",
            }}
          >
            ThemeRenderer: {theme}
          </div>
        )}
      </ThemeRenderer>

      <ConditionalThemeRenderer theme="extreme-brutalist">
        <div style={{ marginTop: "8px", color: "red" }}>
          Only visible in extreme theme
        </div>
      </ConditionalThemeRenderer>

      <ConditionalThemeRenderer theme="refined-brutalist">
        <div style={{ marginTop: "8px", color: "purple" }}>
          Only visible in refined theme
        </div>
      </ConditionalThemeRenderer>

      <MultiThemeRenderer
        extreme={
          <div style={{ marginTop: "8px", fontWeight: "bold" }}>
            EXTREME CONTENT
          </div>
        }
        refined={
          <div style={{ marginTop: "8px", fontStyle: "italic" }}>
            Refined content
          </div>
        }
      />
    </div>
  );
};
