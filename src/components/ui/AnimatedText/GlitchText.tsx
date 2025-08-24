"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useThemeContext } from "@/contexts/ThemeContext";
import { GlitchTextProps } from "./types";

export const GlitchText: React.FC<GlitchTextProps> = ({
  children,
  intensity = "medium",
  trigger = "auto",
  glitchDuration = 300,
  glitchInterval = 3000,
  colors,
  isActive: externalIsActive,
  delay = 0,
  onComplete,
  className = "",
  theme,
}) => {
  const { currentTheme, config } = useThemeContext();
  const activeTheme = theme || currentTheme;

  const [isGlitching, setIsGlitching] = useState(false);
  const [glitchPhase, setGlitchPhase] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const glitchRef = useRef<HTMLSpanElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const phaseRef = useRef<NodeJS.Timeout | null>(null);
  const delayRef = useRef<NodeJS.Timeout | null>(null);

  // Default glitch colors based on theme
  const defaultColors =
    activeTheme === "extreme-brutalist"
      ? ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"]
      : ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#ec4899"];

  const glitchColors = colors || defaultColors;

  // Intensity configurations
  const intensityConfig = {
    low: {
      maxOffset: 2,
      phases: 3,
      phaseSpeed: 100,
    },
    medium: {
      maxOffset: 5,
      phases: 5,
      phaseSpeed: 60,
    },
    high: {
      maxOffset: 10,
      phases: 8,
      phaseSpeed: 30,
    },
  };

  const config_intensity = intensityConfig[intensity];

  // Clean up timers
  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (phaseRef.current) {
      clearTimeout(phaseRef.current);
      phaseRef.current = null;
    }
    if (delayRef.current) {
      clearTimeout(delayRef.current);
      delayRef.current = null;
    }
  }, []);

  // Start glitch effect
  const startGlitch = useCallback(() => {
    if (isGlitching) return;

    setIsGlitching(true);
    setGlitchPhase(0);

    let currentPhase = 0;
    const maxPhases = config_intensity.phases;

    const runPhase = () => {
      if (currentPhase >= maxPhases) {
        setIsGlitching(false);
        setGlitchPhase(0);
        onComplete?.();
        return;
      }

      setGlitchPhase(currentPhase);
      currentPhase++;

      phaseRef.current = setTimeout(runPhase, config_intensity.phaseSpeed);
    };

    runPhase();
  }, [isGlitching, config_intensity, onComplete]);

  // Handle auto trigger
  useEffect(() => {
    if (trigger !== "auto" || hasStarted) return;

    const startEffect = () => {
      setHasStarted(true);
      startGlitch();

      // Set up interval for repeated glitches
      intervalRef.current = setInterval(startGlitch, glitchInterval);
    };

    if (delay > 0) {
      delayRef.current = setTimeout(startEffect, delay);
    } else {
      startEffect();
    }

    return cleanup;
  }, [trigger, hasStarted, delay, glitchInterval, startGlitch, cleanup]);

  // Handle manual trigger
  useEffect(() => {
    if (trigger !== "manual") return;

    if (externalIsActive && !isGlitching) {
      startGlitch();
    }
  }, [trigger, externalIsActive, isGlitching, startGlitch]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Generate glitch styles
  const getGlitchStyles = () => {
    if (!isGlitching) return {};

    const offset = (Math.random() - 0.5) * config_intensity.maxOffset;
    const colorIndex = Math.floor(Math.random() * glitchColors.length);
    const color = glitchColors[colorIndex];

    return {
      transform: `translateX(${offset}px) skew(${offset * 0.5}deg)`,
      color: color,
      textShadow: `
        ${offset}px 0 ${glitchColors[(colorIndex + 1) % glitchColors.length]},
        ${-offset}px 0 ${glitchColors[(colorIndex + 2) % glitchColors.length]},
        0 ${offset}px ${glitchColors[(colorIndex + 3) % glitchColors.length]}
      `,
      filter: `hue-rotate(${Math.random() * 360}deg) saturate(${1 + Math.random()})`,
    };
  };

  // Handle hover trigger
  const handleMouseEnter = () => {
    if (trigger === "hover" && !isGlitching) {
      startGlitch();
    }
  };

  return (
    <span
      ref={glitchRef}
      className={`glitch-text glitch-text--${activeTheme} ${
        isGlitching ? "glitch-text--active" : ""
      } ${className}`}
      onMouseEnter={handleMouseEnter}
      style={
        {
          "--glitch-color": config.colors.text,
          "--glitch-accent": config.colors.accent,
          "--glitch-font": config.typography.primary,
          "--glitch-duration": `${glitchDuration}ms`,
          "--glitch-intensity": intensity,
          ...getGlitchStyles(),
        } as React.CSSProperties & Record<string, string | number>
      }
      data-text={typeof children === "string" ? children : ""}
    >
      <span className="glitch-text__content">{children}</span>
      {isGlitching && (
        <>
          <span
            className="glitch-text__layer glitch-text__layer--1"
            aria-hidden="true"
          >
            {children}
          </span>
          <span
            className="glitch-text__layer glitch-text__layer--2"
            aria-hidden="true"
          >
            {children}
          </span>
        </>
      )}
    </span>
  );
};

export default GlitchText;
