"use client";

import React, { useEffect, useRef } from "react";
import { useThemeTransition } from "@/hooks/useThemeTransition";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { ThemeType } from "@/types/theme";

interface ThemeDetectorProps {
  children?: React.ReactNode;
  className?: string;
  // Section-based theme detection
  sections?: Array<{
    id: string;
    theme: ThemeType;
    threshold?: number;
  }>;
  // Scroll-based theme detection options
  scrollThresholds?: Array<{
    progress: number;
    theme: ThemeType;
  }>;
  transitionDuration?: number;
  enableSectionDetection?: boolean;
  enableScrollDetection?: boolean;
}

export const ThemeDetector: React.FC<ThemeDetectorProps> = ({
  children,
  className = "",
  sections = [],
  scrollThresholds,
  transitionDuration = 600,
  enableSectionDetection = false,
  enableScrollDetection = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Use scroll-based theme transition
  const { currentScrollProgress, isTransitioning, activeTheme } =
    useThemeTransition({
      thresholds: scrollThresholds || [
        { progress: 0, theme: "extreme-brutalist" },
        { progress: 0.4, theme: "refined-brutalist" },
      ],
      transitionDuration,
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    });

  // Section-based detection using intersection observer
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());
  const { isVisible: containerVisible } = useIntersectionObserver(
    containerRef,
    {
      threshold: 0.1,
      rootMargin: "-10% 0px -10% 0px", // Trigger when section is more centered
    }
  );

  // Register section elements for intersection observation
  const registerSection = (id: string, element: HTMLElement | null) => {
    if (element) {
      sectionRefs.current.set(id, element);
    } else {
      sectionRefs.current.delete(id);
    }
  };

  // Effect to observe sections if section detection is enabled
  useEffect(() => {
    // Skip on server-side rendering
    if (typeof window === "undefined") return;
    if (!enableSectionDetection || sections.length === 0) return;

    const observers: IntersectionObserver[] = [];

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              // Section is visible, but we're using scroll-based detection primarily
              // This could be used for additional section-specific effects
              console.log(`Section ${section.id} is visible`);
            }
          },
          {
            threshold: section.threshold || 0.3,
            rootMargin: "-20% 0px -20% 0px",
          }
        );

        observer.observe(element);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [sections, enableSectionDetection]);

  // Apply theme transition classes to container
  const containerClasses = [
    "theme-detector",
    `theme-detector--${activeTheme}`,
    isTransitioning ? "theme-detector--transitioning" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={containerRef}
      className={containerClasses}
      data-scroll-progress={currentScrollProgress.toFixed(3)}
      data-active-theme={activeTheme}
      data-transitioning={isTransitioning}
      style={
        {
          "--scroll-progress": currentScrollProgress,
          "--transition-duration": `${transitionDuration}ms`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
};

// Hook for components to access theme detection state
export const useThemeDetector = () => {
  const { currentScrollProgress, isTransitioning, activeTheme } =
    useThemeTransition();

  return {
    scrollProgress: currentScrollProgress,
    isTransitioning,
    activeTheme,
    // Helper functions
    isExtremeTheme: activeTheme === "extreme-brutalist",
    isRefinedTheme: activeTheme === "refined-brutalist",
    getThemeClass: (baseClass: string) => `${baseClass}--${activeTheme}`,
  };
};

// Component for section-specific theme detection
interface ThemeSectionProps {
  id: string;
  theme: ThemeType;
  children: React.ReactNode;
  className?: string;
  threshold?: number;
}

export const ThemeSection: React.FC<ThemeSectionProps> = ({
  id,
  theme,
  children,
  className = "",
  threshold = 0.3,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const { isVisible } = useIntersectionObserver(sectionRef, {
    threshold,
    rootMargin: "-20% 0px -20% 0px",
  });

  const sectionClasses = [
    "theme-section",
    `theme-section--${theme}`,
    isVisible ? "theme-section--visible" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      ref={sectionRef}
      id={id}
      className={sectionClasses}
      data-theme={theme}
      data-visible={isVisible}
    >
      {children}
    </section>
  );
};
