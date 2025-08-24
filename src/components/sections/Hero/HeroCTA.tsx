"use client";

import React, { useRef, useState, useEffect } from "react";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { portfolioData } from "@/data/portfolio";

interface HeroCTAProps {
  className?: string;
}

interface CTAButton {
  text: string;
  variant: "primary" | "secondary";
  action: string;
}

export const HeroCTA: React.FC<HeroCTAProps> = ({ className = "" }) => {
  const { currentTheme, config } = useThemeContext();
  const [isLoading, setIsLoading] = useState<{ [key: number]: boolean }>({});
  const [hoveredButton, setHoveredButton] = useState<number | null>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollLogoRef = useRef<HTMLDivElement>(null);
  const { scrollProgress } = useScrollProgress();

  const isVisible = useIntersectionObserver(ctaRef, {
    threshold: 0.3,
    rootMargin: "0px",
    triggerOnce: true,
  });

  const { ctaButtons } = portfolioData.hero;

  // Handle scroll indicator click
  const handleScrollIndicatorClick = () => {
    const nextSection =
      document.querySelector('[data-section="social-proof"]') ||
      document.querySelector("section:nth-of-type(2)") ||
      document.getElementById("social-proof");

    if (nextSection) {
      nextSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      // Fallback: scroll down by viewport height
      window.scrollBy({
        top: window.innerHeight,
        behavior: "smooth",
      });
    }
  };

  // Enhanced CTA click handler with loading states
  const handleCTAClick = async (action: string, index: number) => {
    setIsLoading((prev) => ({ ...prev, [index]: true }));

    try {
      switch (action) {
        case "contact":
          // Simulate loading for contact action
          await new Promise((resolve) => setTimeout(resolve, 800));

          // Try multiple possible contact section IDs
          const contactSection =
            document.getElementById("contact") ||
            document.getElementById("footer") ||
            document.querySelector('[data-section="contact"]') ||
            document.querySelector("section:last-of-type");

          if (contactSection) {
            contactSection.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          } else {
            // Fallback: scroll to bottom
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: "smooth",
            });
          }
          break;

        case "scroll-to-projects":
          // Simulate loading for projects action
          await new Promise((resolve) => setTimeout(resolve, 600));

          // Try multiple possible project section IDs
          const projectsSection =
            document.getElementById("projects") ||
            document.getElementById("results") ||
            document.querySelector('[data-section="projects"]') ||
            document.querySelector('[data-section="results"]') ||
            document.querySelector("section:nth-of-type(3)");

          if (projectsSection) {
            projectsSection.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          } else {
            // Fallback: scroll down by 2 viewport heights
            window.scrollBy({
              top: window.innerHeight * 2,
              behavior: "smooth",
            });
          }
          break;

        default:
          console.log(`CTA action: ${action}`);
          await new Promise((resolve) => setTimeout(resolve, 400));
      }
    } catch (error) {
      console.error("CTA action failed:", error);
    } finally {
      setIsLoading((prev) => ({ ...prev, [index]: false }));
    }
  };

  // Update scroll progress indicator
  useEffect(() => {
    if (scrollLogoRef.current) {
      const progressPercentage = Math.min(scrollProgress * 100, 100);
      scrollLogoRef.current.style.setProperty(
        "--scroll-progress",
        `${progressPercentage}%`
      );
    }
  }, [scrollProgress]);

  // Handle keyboard navigation
  const handleKeyDown = (
    event: React.KeyboardEvent,
    action: string,
    index: number
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCTAClick(action, index);
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
          "--cta-secondary": config.colors.secondary,
          "--cta-border-width": config.borders.width,
          "--cta-border-radius": config.borders.radius || "0px",
          "--cta-animation-duration": config.animations.duration,
          "--cta-animation-easing": config.animations.easing,
          "--cta-font-primary": config.typography.primary,
          "--cta-font-code": config.typography.code,
        } as React.CSSProperties
      }
      role="region"
      aria-label="Call to action buttons"
    >
      {/* CTA Buttons */}
      <div
        className="hero-cta__buttons"
        role="group"
        aria-label="Primary actions"
      >
        {ctaButtons.map((button: CTAButton, index: number) => (
          <button
            key={index}
            className={`hero-cta__btn hero-cta__btn--${button.variant} hero-cta__btn--${currentTheme} ${
              isLoading[index] ? "hero-cta__btn--loading" : ""
            }`}
            onClick={() => handleCTAClick(button.action, index)}
            onKeyDown={(e) => handleKeyDown(e, button.action, index)}
            onMouseEnter={() => setHoveredButton(index)}
            onMouseLeave={() => setHoveredButton(null)}
            onFocus={() => setHoveredButton(index)}
            onBlur={() => setHoveredButton(null)}
            disabled={isLoading[index]}
            style={{
              animationDelay: `${index * 200}ms`,
            }}
            aria-label={`${button.text} - ${button.variant === "primary" ? "Primary action" : "Secondary action"}`}
            aria-describedby={`cta-description-${index}`}
          >
            <span className="hero-cta__btn-text">
              {button.text}
              {isLoading[index] && <span className="sr-only">Loading...</span>}
            </span>

            {/* Button Effects */}
            <div className="hero-cta__btn-effects" aria-hidden="true">
              <div className="hero-cta__btn-shadow"></div>
              <div className="hero-cta__btn-border"></div>
              <div className="hero-cta__btn-shimmer"></div>
              <div className="hero-cta__btn-strike"></div>
            </div>

            {/* Progress Indicator */}
            <div
              className="hero-cta__btn-progress"
              aria-hidden="true"
              style={{
                opacity: hoveredButton === index ? 1 : 0,
                transform: hoveredButton === index ? "scaleX(1)" : "scaleX(0)",
              }}
            ></div>

            {/* Glow Effect */}
            <div
              className="hero-cta__btn-glow"
              aria-hidden="true"
              style={{
                opacity: hoveredButton === index ? 0.6 : 0,
              }}
            ></div>

            {/* Hidden description for screen readers */}
            <span id={`cta-description-${index}`} className="sr-only">
              {button.action === "contact"
                ? "Navigate to contact section to get in touch"
                : "Navigate to projects section to view portfolio"}
            </span>
          </button>
        ))}
      </div>

      {/* Enhanced Scroll Indicator */}
      <div
        className="hero-cta__scroll-indicator"
        role="button"
        tabIndex={0}
        onClick={handleScrollIndicatorClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleScrollIndicatorClick();
          }
        }}
        aria-label="Scroll to next section"
        aria-describedby="scroll-description"
      >
        <div
          ref={scrollLogoRef}
          className="hero-cta__scroll-logo"
          style={
            {
              "--scroll-progress": "0%",
            } as React.CSSProperties
          }
        >
          <div className="hero-cta__scroll-icon">↓</div>

          {/* Progress ring */}
          <svg
            className="hero-cta__scroll-progress-ring"
            width="100%"
            height="100%"
            viewBox="0 0 60 60"
            aria-hidden="true"
          >
            <circle
              cx="30"
              cy="30"
              r="26"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.2"
            />
            <circle
              cx="30"
              cy="30"
              r="26"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="163.36"
              strokeDashoffset="163.36"
              transform="rotate(-90 30 30)"
              className="hero-cta__scroll-progress-circle"
              style={{
                strokeDashoffset: `calc(163.36 - (163.36 * var(--scroll-progress, 0%) / 100))`,
              }}
            />
          </svg>
        </div>

        <div className="hero-cta__scroll-progress">
          <div
            className="hero-cta__scroll-bar"
            style={{
              height: `${Math.min(scrollProgress * 100, 100)}%`,
            }}
          ></div>
        </div>

        <span className="hero-cta__scroll-text">SCROLL TO EXPLORE</span>

        {/* Terminal-style indicator */}
        <div className="hero-cta__terminal-indicator" aria-hidden="true">
          <span className="hero-cta__terminal-prompt">$</span>
          <span className="hero-cta__terminal-command">
            explore_portfolio.sh
          </span>
          <span className="hero-cta__terminal-cursor">_</span>
        </div>

        {/* Hidden description for screen readers */}
        <span id="scroll-description" className="sr-only">
          Click or press Enter to scroll to the next section of the portfolio
        </span>
      </div>

      {/* Background Effects */}
      <div className="hero-cta__bg-effects" aria-hidden="true">
        <div className="hero-cta__bg-grid"></div>
        <div className="hero-cta__bg-particles"></div>
        <div className="hero-cta__bg-glow"></div>
      </div>
    </div>
  );
};

export default HeroCTA;
