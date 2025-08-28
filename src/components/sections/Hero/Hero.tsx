"use client";

import React, { useRef, useEffect } from "react";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { HeroContent } from "./HeroContent";

interface HeroProps {
  children?: React.ReactNode;
  className?: string;
}

export const Hero: React.FC<HeroProps> = ({ children, className = "" }) => {
  const { currentTheme, config } = useThemeContext();
  const heroRef = useRef<HTMLElement>(null);
  const isVisible = useIntersectionObserver(heroRef, {
    threshold: 0.1,
    rootMargin: "0px",
    triggerOnce: false,
  });

  // Apply theme-specific background effects
  useEffect(() => {
    if (heroRef.current) {
      const heroElement = heroRef.current;

      // Add theme-specific classes
      heroElement.classList.remove(
        "hero--extreme-brutalist",
        "hero--refined-brutalist"
      );
      heroElement.classList.add(`hero--${currentTheme}`);

      // Apply dynamic CSS properties
      heroElement.style.setProperty("--hero-bg", config.colors.bg);
      heroElement.style.setProperty("--hero-text", config.colors.text);
      heroElement.style.setProperty("--hero-accent", config.colors.accent);
      heroElement.style.setProperty(
        "--hero-highlight",
        config.colors.highlight
      );
      heroElement.style.setProperty(
        "--hero-border-width",
        config.borders.width
      );
      heroElement.style.setProperty(
        "--hero-border-radius",
        config.borders.radius || "0px"
      );
      heroElement.style.setProperty(
        "--hero-animation-duration",
        config.animations.duration
      );
      heroElement.style.setProperty(
        "--hero-animation-easing",
        config.animations.easing
      );
    }
  }, [currentTheme, config]);

  return (
    <section
      ref={heroRef}
      className={`hero ${className}`}
      id="hero"
      role="banner"
      aria-label="Hero section"
    >
      {/* Background Effects Layer - CSS-based for now */}
      <div className="hero__background-effects">
        <div className="hero__background-pattern" aria-hidden="true" />
        <div className="hero__background-grid" aria-hidden="true" />
        <div className="hero__background-stripes" aria-hidden="true" />
        <div className="hero__scan-lines" aria-hidden="true" />
        <div className="hero__noise-texture" aria-hidden="true" />
      </div>

      {/* Content Container */}
      <div className="hero__container">
        <div className="hero__grid">{children || <HeroContent />}</div>
      </div>

      {/* Performance Optimization Overlay */}
      <div className="hero__performance-overlay" aria-hidden="true" />
    </section>
  );
};

export default Hero;
