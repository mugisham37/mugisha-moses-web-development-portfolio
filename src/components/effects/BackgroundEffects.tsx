"use client";

import React from "react";
import { ThemeType } from "@/types/theme";
import { GridBackground } from "./GridBackground";
import { ScanLines } from "./ScanLines";
import { NoiseTexture } from "./NoiseTexture";
import { BackgroundStripes } from "./BackgroundStripes";

interface BackgroundEffectsProps {
  theme: ThemeType;
  isActive?: boolean;
  enableGrid?: boolean;
  enableScanLines?: boolean;
  enableNoise?: boolean;
  enableStripes?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const BackgroundEffects: React.FC<BackgroundEffectsProps> = ({
  theme,
  isActive = true,
  enableGrid = true,
  enableScanLines = true,
  enableNoise = true,
  enableStripes = true,
  className = "",
  children,
}) => {
  return (
    <div
      className={`background-effects background-effects--${theme} ${className}`}
    >
      {/* Background Stripes - Lowest layer */}
      {enableStripes && (
        <BackgroundStripes
          theme={theme}
          isActive={isActive}
          stripeCount={theme === "extreme-brutalist" ? 8 : 6}
          direction="diagonal"
          speed={theme === "extreme-brutalist" ? 3 : 1.5}
          className="background-effects__stripes"
        />
      )}

      {/* Grid Background - Second layer */}
      {enableGrid && (
        <GridBackground
          theme={theme}
          isActive={isActive}
          gridSize={theme === "extreme-brutalist" ? 40 : 60}
          opacity={theme === "extreme-brutalist" ? 0.3 : 0.15}
          animationSpeed={theme === "extreme-brutalist" ? 2 : 1}
          className="background-effects__grid"
        />
      )}

      {/* Scan Lines - Third layer */}
      {enableScanLines && (
        <ScanLines
          theme={theme}
          isActive={isActive}
          lineCount={theme === "extreme-brutalist" ? 12 : 8}
          speed={theme === "extreme-brutalist" ? 2.5 : 1.5}
          opacity={theme === "extreme-brutalist" ? 0.4 : 0.2}
          className="background-effects__scan-lines"
        />
      )}

      {/* Noise Texture - Top layer */}
      {enableNoise && (
        <NoiseTexture
          theme={theme}
          isActive={isActive}
          intensity={theme === "extreme-brutalist" ? 0.15 : 0.08}
          scale={theme === "extreme-brutalist" ? 2 : 1.5}
          className="background-effects__noise"
        />
      )}

      {/* Content layer */}
      {children && (
        <div className="background-effects__content">{children}</div>
      )}
    </div>
  );
};

export default BackgroundEffects;
