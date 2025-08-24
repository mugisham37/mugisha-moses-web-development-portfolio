"use client";

import React from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useThemeDetector } from "@/components/theme";

interface ScrollProgressProps {
  className?: string;
  showPercentage?: boolean;
  position?: "top" | "bottom";
}

export const ScrollProgress: React.FC<ScrollProgressProps> = ({
  className = "",
  showPercentage = false,
  position = "top",
}) => {
  const progress = useScrollProgress();
  const { activeTheme, getThemeClass } = useThemeDetector();

  const progressClasses = [
    "scroll-progress",
    `scroll-progress--${position}`,
    getThemeClass("scroll-progress"),
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <div
        className={progressClasses}
        style={
          {
            "--scroll-progress": progress,
          } as React.CSSProperties
        }
      />
      {showPercentage && (
        <div className="fixed top-4 left-4 z-50 p-2 bg-white/90 backdrop-blur-sm rounded text-black text-sm font-mono">
          {(progress * 100).toFixed(1)}%
        </div>
      )}
    </>
  );
};
