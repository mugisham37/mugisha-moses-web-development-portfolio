"use client";

import React, { useRef } from "react";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { portfolioData } from "@/data/portfolio";

interface HeroCTAProps {
  className?: string;
}

export const HeroCTA: React.FC<HeroCTAProps> = ({ className = "" }) => {
  const { currentTheme, config } = useThemeContext();
  const ctaRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(ctaRef, {
    threshold: 0.3,
    rootMargin: "0px",
    triggerOnce: true,
  });

  const { ctaButtons } = portfolioData.hero;

  const handleCTAClick = (action: string) => {
    switch (action) {
      case "contact":
        // Scroll to contact section or open contact modal
        const contactSection = document.getElementById("contact");
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: "smooth" });
        }
        break;
      case "scroll-to-projects":
        // Scroll to projects section
        const projectsSection = document.getElementById("projects");
        if (projectsSection) {
          projectsSection.scrollIntoView({ behavior: "smooth" });
        }
        break;
      default:
        console.log(`CTA action: ${action}`);
    }
  };

  return (
    <div
      ref={ctaRef}
      className={`hero-cta hero-cta--${currentTheme} ${className}`}
      style={
        {
          "--cta-text": config.colors.text,
          "--cta-accent": config.colors.accent,
          "--cta-highlight": config.colors.highlight,
          "--cta-bg": config.colors.bg,
          "--cta-border-width": config.borders.width,
          "--cta-border-radius": config.borders.radius,
          "--cta-animation-duration": config.animations.duration,
          "--cta-animation-easing": config.animations.easing,
        } as React.CSSProperties
      }
    >
      {/* CTA Buttons */}
      <div className="hero-cta__buttons">
        {ctaButtons.map((button: any, index: number) => (
          <button
            key={index}
            className={`hero-cta__btn hero-cta__btn--${button.variant} hero-cta__btn--${currentTheme}`}
            onClick={() => handleCTAClick(button.action)}
            style={{
              animationDelay: `${index * 200}ms`,
            }}
          >
            <span className="hero-cta__btn-text">{button.text}</span>
            <div className="hero-cta__btn-effects" aria-hidden="true">
              <div className="hero-cta__btn-shadow"></div>
              <div className="hero-cta__btn-border"></div>
              <div className="hero-cta__btn-shimmer"></div>
              <div className="hero-cta__btn-strike"></div>
            </div>
          </button>
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="hero-cta__scroll-indicator" aria-hidden="true">
        <div className="hero-cta__scroll-logo">
          <div className="hero-cta__scroll-icon">↓</div>
        </div>
        <div className="hero-cta__scroll-progress">
          <div className="hero-cta__scroll-bar"></div>
        </div>
        <span className="hero-cta__scroll-text">SCROLL TO EXPLORE</span>
      </div>
    </div>
  );
};

export default HeroCTA;
