"use client";

import React from "react";
import { useThemeDetector } from "@/components/theme";

export const ThemeStatus: React.FC = () => {
  const { scrollProgress, isTransitioning, activeTheme } = useThemeDetector();

  return (
    <div className="fixed top-4 right-4 z-50 p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
      <div className="text-sm font-mono text-black">
        <div>
          Theme: <span className="font-bold">{activeTheme}</span>
        </div>
        <div>
          Progress:{" "}
          <span className="font-bold">
            {(scrollProgress * 100).toFixed(1)}%
          </span>
        </div>
        <div>
          Transitioning:{" "}
          <span className="font-bold">{isTransitioning ? "Yes" : "No"}</span>
        </div>
      </div>
    </div>
  );
};
