"use client";

import React from "react";
import { useTheme } from "@/contexts/ThemeContext";

/**
 * Test component to verify theme system functionality
 * This component displays current theme state and provides theme switching controls
 */
export const ThemeTest: React.FC = () => {
  const {
    currentTheme,
    isTransitioning,
    transitionProgress,
    setTheme,
    config,
  } = useTheme();

  return (
    <div className="theme-test p-4 border-2 border-current">
      <h2 className="text-xl font-bold mb-4">Theme System Test</h2>

      <div className="mb-4">
        <p>
          <strong>Current Theme:</strong> {currentTheme}
        </p>
        <p>
          <strong>Is Transitioning:</strong> {isTransitioning ? "Yes" : "No"}
        </p>
        <p>
          <strong>Transition Progress:</strong>{" "}
          {Math.round(transitionProgress * 100)}%
        </p>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Theme Configuration:</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <strong>Primary:</strong>
            <span
              className="inline-block w-4 h-4 ml-2 border border-current"
              style={{ backgroundColor: config.colors.primary }}
            ></span>
            {config.colors.primary}
          </div>
          <div>
            <strong>Accent:</strong>
            <span
              className="inline-block w-4 h-4 ml-2 border border-current"
              style={{ backgroundColor: config.colors.accent }}
            ></span>
            {config.colors.accent}
          </div>
          <div>
            <strong>Font:</strong> {config.typography.primary}
          </div>
          <div>
            <strong>Border Width:</strong> {config.borders.width}
          </div>
        </div>
      </div>

      <div className="space-x-2">
        <button
          onClick={() => setTheme("extreme-brutalist")}
          className={`px-4 py-2 border-2 border-current font-bold ${
            currentTheme === "extreme-brutalist" ? "bg-current text-white" : ""
          }`}
          disabled={isTransitioning}
        >
          Extreme Brutalist
        </button>
        <button
          onClick={() => setTheme("refined-brutalist")}
          className={`px-4 py-2 border-2 border-current font-bold ${
            currentTheme === "refined-brutalist" ? "bg-current text-white" : ""
          }`}
          disabled={isTransitioning}
        >
          Refined Brutalist
        </button>
      </div>

      <div className="mt-4 p-4 border border-current">
        <h4 className="font-semibold mb-2">Theme-aware Elements:</h4>
        <div className="space-y-2">
          <div className="brutal-element p-2">
            Brutal Element with theme-aware styling
          </div>
          <button className="brutal-button px-4 py-2">Brutal Button</button>
          <code className="brutal-code p-2 block">
            console.log(&apos;Theme-aware code block&apos;);
          </code>
        </div>
      </div>
    </div>
  );
};
