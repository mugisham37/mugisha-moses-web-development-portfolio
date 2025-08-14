"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ScreenReaderUtils } from "@/lib/accessibility";

interface AccessibilitySettings {
  reducedMotion: boolean;
  highContrast: boolean;
  focusVisible: boolean;
  screenReader: boolean;
  fontSize: "small" | "medium" | "large" | "extra-large";
  announcements: boolean;
}

interface AccessibilityContextValue {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => void;
  announce: (message: string, priority?: "polite" | "assertive") => void;
  isScreenReaderActive: boolean;
}

const AccessibilityContext = createContext<AccessibilityContextValue | null>(
  null
);

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error(
      "useAccessibility must be used within AccessibilityProvider"
    );
  }
  return context;
}

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export function AccessibilityProvider({
  children,
}: AccessibilityProviderProps) {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    reducedMotion: false,
    highContrast: false,
    focusVisible: true,
    screenReader: false,
    fontSize: "medium",
    announcements: true,
  });

  const [isScreenReaderActive, setIsScreenReaderActive] = useState(false);

  // Detect user preferences on mount
  useEffect(() => {
    const detectPreferences = () => {
      // Detect reduced motion preference
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // Detect high contrast preference
      const prefersHighContrast = window.matchMedia(
        "(prefers-contrast: high)"
      ).matches;

      // Detect screen reader (basic detection)
      const hasScreenReader =
        navigator.userAgent.includes("NVDA") ||
        navigator.userAgent.includes("JAWS") ||
        navigator.userAgent.includes("VoiceOver") ||
        window.speechSynthesis?.getVoices().length > 0;

      setSettings((prev) => ({
        ...prev,
        reducedMotion: prefersReducedMotion,
        highContrast: prefersHighContrast,
        screenReader: hasScreenReader,
      }));

      setIsScreenReaderActive(hasScreenReader);
    };

    detectPreferences();

    // Listen for preference changes
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );
    const highContrastQuery = window.matchMedia("(prefers-contrast: high)");

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setSettings((prev) => ({ ...prev, reducedMotion: e.matches }));
    };

    const handleHighContrastChange = (e: MediaQueryListEvent) => {
      setSettings((prev) => ({ ...prev, highContrast: e.matches }));
    };

    reducedMotionQuery.addEventListener("change", handleReducedMotionChange);
    highContrastQuery.addEventListener("change", handleHighContrastChange);

    return () => {
      reducedMotionQuery.removeEventListener(
        "change",
        handleReducedMotionChange
      );
      highContrastQuery.removeEventListener("change", handleHighContrastChange);
    };
  }, []);

  // Apply settings to document
  useEffect(() => {
    const root = document.documentElement;

    // Apply reduced motion
    if (settings.reducedMotion) {
      root.classList.add("reduce-motion");
    } else {
      root.classList.remove("reduce-motion");
    }

    // Apply high contrast
    if (settings.highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }

    // Apply font size
    root.classList.remove(
      "font-small",
      "font-medium",
      "font-large",
      "font-extra-large"
    );
    root.classList.add(`font-${settings.fontSize}`);

    // Apply focus visible
    if (settings.focusVisible) {
      root.classList.add("focus-visible");
    } else {
      root.classList.remove("focus-visible");
    }

    // Apply screen reader optimizations
    if (settings.screenReader) {
      root.classList.add("screen-reader-active");
    } else {
      root.classList.remove("screen-reader-active");
    }
  }, [settings]);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));

    // Announce setting changes
    if (settings.announcements) {
      const settingNames = {
        reducedMotion: "Reduced motion",
        highContrast: "High contrast",
        focusVisible: "Focus indicators",
        screenReader: "Screen reader mode",
        fontSize: "Font size",
        announcements: "Announcements",
      };

      const announcement = `${settingNames[key]} ${
        typeof value === "boolean"
          ? value
            ? "enabled"
            : "disabled"
          : `set to ${value}`
      }`;

      ScreenReaderUtils.announce(announcement, "polite");
    }
  };

  const announce = (
    message: string,
    priority: "polite" | "assertive" = "polite"
  ) => {
    if (settings.announcements) {
      ScreenReaderUtils.announce(message, priority);
    }
  };

  const contextValue: AccessibilityContextValue = {
    settings,
    updateSetting,
    announce,
    isScreenReaderActive,
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}

      {/* Global accessibility styles */}
      <style jsx global>{`
        /* Reduced motion styles */
        .reduce-motion *,
        .reduce-motion *::before,
        .reduce-motion *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }

        /* High contrast styles */
        .high-contrast {
          --color-primary: #000000;
          --color-secondary: #ffffff;
          --color-accent: #ffff00;
          --border-width: 3px;
        }

        .high-contrast * {
          border-width: var(--border-width) !important;
          font-weight: 700 !important;
        }

        /* Font size styles */
        .font-small {
          font-size: 14px;
        }

        .font-medium {
          font-size: 16px;
        }

        .font-large {
          font-size: 18px;
        }

        .font-extra-large {
          font-size: 20px;
        }

        /* Focus visible enhancements */
        .focus-visible *:focus-visible {
          outline: 3px solid var(--color-accent, #ffff00) !important;
          outline-offset: 2px !important;
        }

        /* Screen reader optimizations */
        .screen-reader-active {
          --animation-duration: 0s;
          --transition-duration: 0s;
        }

        .screen-reader-active .sr-only:focus {
          position: static !important;
          width: auto !important;
          height: auto !important;
          padding: 0.5rem !important;
          margin: 0.5rem !important;
          overflow: visible !important;
          clip: auto !important;
          white-space: normal !important;
          background: var(--color-accent, #ffff00) !important;
          color: var(--color-primary, #000000) !important;
          border: 2px solid var(--color-primary, #000000) !important;
        }

        /* Enhanced touch targets */
        @media (pointer: coarse) {
          button,
          a,
          input,
          select,
          textarea {
            min-height: 44px !important;
            min-width: 44px !important;
          }
        }

        /* Print accessibility */
        @media print {
          .sr-only {
            position: static !important;
            width: auto !important;
            height: auto !important;
            overflow: visible !important;
            clip: auto !important;
          }
        }
      `}</style>
    </AccessibilityContext.Provider>
  );
}

// Accessibility Settings Panel Component
export function AccessibilitySettings() {
  const { settings, updateSetting } = useAccessibility();

  return (
    <div className="accessibility-settings border-4 border-black bg-white p-6">
      <h2 className="mb-4 font-mono text-xl font-bold uppercase">
        Accessibility Settings
      </h2>

      <div className="space-y-4">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={settings.reducedMotion}
            onChange={(e) => updateSetting("reducedMotion", e.target.checked)}
            className="h-5 w-5"
          />
          <span className="font-mono">Reduce Motion</span>
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={settings.highContrast}
            onChange={(e) => updateSetting("highContrast", e.target.checked)}
            className="h-5 w-5"
          />
          <span className="font-mono">High Contrast</span>
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={settings.focusVisible}
            onChange={(e) => updateSetting("focusVisible", e.target.checked)}
            className="h-5 w-5"
          />
          <span className="font-mono">Focus Indicators</span>
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={settings.announcements}
            onChange={(e) => updateSetting("announcements", e.target.checked)}
            className="h-5 w-5"
          />
          <span className="font-mono">Screen Reader Announcements</span>
        </label>

        <div>
          <label className="mb-2 block font-mono">Font Size</label>
          <select
            value={settings.fontSize}
            onChange={(e) => updateSetting("fontSize", e.target.value as any)}
            className="w-full border-2 border-black p-2 font-mono"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="extra-large">Extra Large</option>
          </select>
        </div>
      </div>
    </div>
  );
}
