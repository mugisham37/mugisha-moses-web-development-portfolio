"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useTheme } from "@/hooks/useTheme";

interface ScrollProgressProps {
  className?: string;
  showSectionNavigation?: boolean;
  sections?: Array<{
    id: string;
    label: string;
    icon?: string;
  }>;
}

interface SectionNavigationProps {
  sections: Array<{
    id: string;
    label: string;
    icon?: string;
  }>;
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
}

export const ScrollProgress: React.FC<ScrollProgressProps> = ({
  className = "",
  showSectionNavigation = true,
  sections = [
    { id: "hero", label: "HOME", icon: "⚡" },
    { id: "social-proof", label: "PROOF", icon: "🏆" },
    { id: "results", label: "RESULTS", icon: "📊" },
    { id: "footer", label: "CONTACT", icon: "🚀" },
  ],
}) => {
  const { scrollProgress, scrollDirection } = useScrollProgress();
  const [activeSection, setActiveSection] = useState("hero");
  const [isVisible, setIsVisible] = useState(false);
  const { currentTheme } = useTheme();

  // Track active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;
          const elementBottom = elementTop + rect.height;

          if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  // Show/hide based on scroll position
  useEffect(() => {
    setIsVisible(scrollProgress > 0.05);
  }, [scrollProgress]);

  const handleSectionClick = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }, []);

  return (
    <div
      className={`scroll-progress scroll-progress--${currentTheme} ${
        isVisible ? "scroll-progress--visible" : ""
      } ${scrollDirection === "up" ? "scroll-progress--scrolling-up" : ""} ${className}`}
    >
      {/* Main progress bar */}
      <div className="scroll-progress__bar">
        <div className="scroll-progress__track">
          <div
            className="scroll-progress__fill"
            style={{
              transform: `scaleX(${scrollProgress})`,
            }}
          />
          <div className="scroll-progress__glow" />
        </div>

        {/* Progress percentage */}
        <div className="scroll-progress__percentage">
          <span className="scroll-progress__number">
            {Math.round(scrollProgress * 100)}
          </span>
          <span className="scroll-progress__symbol">%</span>
        </div>
      </div>

      {/* Section navigation */}
      {showSectionNavigation && (
        <SectionNavigation
          sections={sections}
          activeSection={activeSection}
          onSectionClick={handleSectionClick}
        />
      )}

      {/* Brutal effects */}
      <div className="scroll-progress__effects">
        <div className="scroll-progress__scan-line" />
        <div className="scroll-progress__terminal-border" />
      </div>
    </div>
  );
};

const SectionNavigation: React.FC<SectionNavigationProps> = ({
  sections,
  activeSection,
  onSectionClick,
}) => {
  const { currentTheme } = useTheme();

  return (
    <nav className={`section-navigation section-navigation--${currentTheme}`}>
      <div className="section-navigation__list">
        {sections.map((section, index) => (
          <button
            key={section.id}
            className={`section-navigation__item ${
              activeSection === section.id
                ? "section-navigation__item--active"
                : ""
            }`}
            onClick={() => onSectionClick(section.id)}
            aria-label={`Navigate to ${section.label} section`}
            style={
              {
                "--item-index": index,
              } as React.CSSProperties
            }
          >
            <div className="section-navigation__icon">{section.icon}</div>
            <div className="section-navigation__label">{section.label}</div>
            <div className="section-navigation__indicator" />

            {/* Brutal hover effects */}
            <div className="section-navigation__effects">
              <div className="section-navigation__border" />
              <div className="section-navigation__shadow" />
              <div className="section-navigation__glitch" />
            </div>
          </button>
        ))}
      </div>

      {/* Navigation background */}
      <div className="section-navigation__background">
        <div className="section-navigation__grid" />
        <div className="section-navigation__noise" />
      </div>
    </nav>
  );
};

// Vertical progress indicator (alternative design)
interface VerticalProgressProps {
  className?: string;
  position?: "left" | "right";
}

export const VerticalProgress: React.FC<VerticalProgressProps> = ({
  className = "",
  position = "right",
}) => {
  const { scrollProgress } = useScrollProgress();
  const { currentTheme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(scrollProgress > 0.1);
  }, [scrollProgress]);

  return (
    <div
      className={`vertical-progress vertical-progress--${currentTheme} vertical-progress--${position} ${
        isVisible ? "vertical-progress--visible" : ""
      } ${className}`}
    >
      <div className="vertical-progress__track">
        <div
          className="vertical-progress__fill"
          style={{
            transform: `scaleY(${scrollProgress})`,
          }}
        />
        <div className="vertical-progress__markers">
          {[0.25, 0.5, 0.75].map((marker, index) => (
            <div
              key={index}
              className={`vertical-progress__marker ${
                scrollProgress >= marker
                  ? "vertical-progress__marker--passed"
                  : ""
              }`}
              style={{
                top: `${marker * 100}%`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Terminal-style progress display */}
      <div className="vertical-progress__display">
        <div className="vertical-progress__text">
          SCROLL: {Math.round(scrollProgress * 100)}%
        </div>
        <div className="vertical-progress__cursor" />
      </div>
    </div>
  );
};

// Smooth scroll utility component
interface SmoothScrollProps {
  children: React.ReactNode;
  offset?: number;
  duration?: number;
}

export const SmoothScroll: React.FC<SmoothScrollProps> = ({
  children,
  offset = 80,
  duration = 800,
}) => {
  useEffect(() => {
    // Enhanced smooth scrolling for anchor links
    const handleAnchorClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.tagName === "A" && target.hash) {
        e.preventDefault();

        const targetId = target.hash.slice(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          const targetPosition =
            targetElement.getBoundingClientRect().top + window.scrollY - offset;

          // Custom smooth scroll with easing
          const startPosition = window.scrollY;
          const distance = targetPosition - startPosition;
          const startTime = performance.now();

          const easeInOutCubic = (t: number): number => {
            return t < 0.5
              ? 4 * t * t * t
              : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
          };

          const animateScroll = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeInOutCubic(progress);

            window.scrollTo(0, startPosition + distance * easedProgress);

            if (progress < 1) {
              requestAnimationFrame(animateScroll);
            }
          };

          requestAnimationFrame(animateScroll);
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, [offset, duration]);

  return <>{children}</>;
};
