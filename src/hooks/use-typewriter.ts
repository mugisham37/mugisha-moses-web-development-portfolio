"use client";

import { useState, useEffect, useCallback } from "react";

interface TypewriterPreferences {
  prefersReducedMotion: boolean;
  prefersHighContrast: boolean;
  prefersSlowAnimations: boolean;
}

interface TypewriterConfig {
  speed: number;
  deleteSpeed: number;
  pauseDuration: number;
  showCursor: boolean;
  enableHover: boolean;
}

export function useTypewriter() {
  const [preferences, setPreferences] = useState<TypewriterPreferences>({
    prefersReducedMotion: false,
    prefersHighContrast: false,
    prefersSlowAnimations: false,
  });

  // Detect user preferences
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQueries = {
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)"),
      highContrast: window.matchMedia("(prefers-contrast: high)"),
      slowAnimations: window.matchMedia("(prefers-reduced-motion: reduce)"),
    };

    const updatePreferences = () => {
      setPreferences({
        prefersReducedMotion: mediaQueries.reducedMotion.matches,
        prefersHighContrast: mediaQueries.highContrast.matches,
        prefersSlowAnimations: mediaQueries.slowAnimations.matches,
      });
    };

    // Initial check
    updatePreferences();

    // Listen for changes
    Object.values(mediaQueries).forEach((mq) => {
      mq.addEventListener("change", updatePreferences);
    });

    return () => {
      Object.values(mediaQueries).forEach((mq) => {
        mq.removeEventListener("change", updatePreferences);
      });
    };
  }, []);

  // Generate optimized config based on preferences
  const getOptimizedConfig = useCallback(
    (baseConfig: Partial<TypewriterConfig> = {}): TypewriterConfig => {
      const defaultConfig: TypewriterConfig = {
        speed: 75,
        deleteSpeed: 35,
        pauseDuration: 2200,
        showCursor: true,
        enableHover: true,
      };

      const config = { ...defaultConfig, ...baseConfig };

      // Adjust for accessibility preferences
      if (preferences.prefersReducedMotion) {
        config.speed = Math.max(config.speed * 0.5, 20); // Slower typing
        config.deleteSpeed = Math.max(config.deleteSpeed * 0.5, 15);
        config.pauseDuration = Math.min(config.pauseDuration * 1.5, 4000);
      }

      if (preferences.prefersSlowAnimations) {
        config.speed = Math.max(config.speed * 0.7, 30);
        config.deleteSpeed = Math.max(config.deleteSpeed * 0.7, 20);
      }

      return config;
    },
    [preferences]
  );

  // Utility function for realistic typing variations
  const getCharacterSpeed = useCallback(
    (char: string, baseSpeed: number, isDeleting: boolean = false) => {
      // Character-specific timing adjustments
      const speedMultipliers: Record<string, number> = {
        " ": 0.3, // Spaces are faster
        ".": 1.8, // Punctuation is slower
        ",": 1.5,
        "!": 1.8,
        "?": 1.8,
        ":": 1.6,
        ";": 1.6,
        "-": 1.2,
        "/": 1.3,
        "\\": 1.3,
        "(": 1.4,
        ")": 1.4,
        "[": 1.4,
        "]": 1.4,
        "{": 1.4,
        "}": 1.4,
      };

      const multiplier = speedMultipliers[char] || 1;

      // Add slight randomness for natural feel
      const randomVariation = 0.8 + Math.random() * 0.4; // 0.8 to 1.2

      // Adjust for accessibility
      let finalSpeed = baseSpeed * multiplier * randomVariation;

      if (preferences.prefersReducedMotion) {
        finalSpeed *= 0.7; // Slower for reduced motion
      }

      return Math.round(Math.max(finalSpeed, isDeleting ? 10 : 20));
    },
    [preferences]
  );

  // Enhanced cursor animation config
  const getCursorConfig = useCallback(() => {
    return {
      duration: preferences.prefersReducedMotion ? 1.5 : 1,
      opacity: preferences.prefersReducedMotion ? [1] : [1, 0.3, 1],
      scaleY: preferences.prefersReducedMotion ? [1] : [1, 0.9, 1],
      transition: {
        duration: preferences.prefersReducedMotion ? 0 : 1,
        repeat: preferences.prefersReducedMotion ? 0 : Infinity,
        ease: "easeInOut",
      },
    };
  }, [preferences]);

  // Accessibility announcements
  const announceText = useCallback(
    (text: string, isComplete: boolean = false) => {
      if (typeof window === "undefined") return;

      // Create or update live region for screen readers
      let liveRegion = document.getElementById("typewriter-live-region");
      if (!liveRegion) {
        liveRegion = document.createElement("div");
        liveRegion.id = "typewriter-live-region";
        liveRegion.setAttribute("aria-live", "polite");
        liveRegion.setAttribute("aria-atomic", "true");
        liveRegion.className = "sr-only";
        document.body.appendChild(liveRegion);
      }

      // Announce completed text
      if (isComplete) {
        liveRegion.textContent = `Developer specialty: ${text}`;
      }
    },
    []
  );

  return {
    preferences,
    getOptimizedConfig,
    getCharacterSpeed,
    getCursorConfig,
    announceText,
  };
}

// Hook for managing typewriter state
export function useTypewriterState(texts: string[]) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const nextText = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % texts.length);
    setIsDeleting(false);
    setDisplayText("");
  }, [texts.length]);

  const pauseAnimation = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resumeAnimation = useCallback(() => {
    setIsPaused(false);
  }, []);

  const resetAnimation = useCallback(() => {
    setCurrentIndex(0);
    setDisplayText("");
    setIsDeleting(false);
    setIsPaused(false);
    setIsComplete(false);
  }, []);

  return {
    currentIndex,
    displayText,
    isDeleting,
    isPaused,
    isComplete,
    setDisplayText,
    setIsDeleting,
    setIsComplete,
    nextText,
    pauseAnimation,
    resumeAnimation,
    resetAnimation,
  };
}
