"use client";

import React, { useState, useEffect, useRef } from "react";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { TypewriterText } from "./TypewriterText";
import { HeroMetrics } from "./HeroMetrics";
import { HeroVisual } from "./HeroVisual";
import { HeroCTA } from "./HeroCTA";
import { portfolioData } from "@/data/portfolio";

interface HeroContentProps {
  className?: string;
}

export const HeroContent: React.FC<HeroContentProps> = ({ className = "" }) => {
  const { currentTheme, config } = useThemeContext();
  const [currentHeadlineIndex, setCurrentHeadlineIndex] = useState(0);
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(0);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showValueProp, setShowValueProp] = useState(false);
  const [showCTAs, setShowCTAs] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(contentRef, {
    threshold: 0.2,
    rootMargin: "0px",
    triggerOnce: true,
  });

  const { headlines, subtitles, valueProposition } = portfolioData.hero;

  // Handle headline rotation
  useEffect(() => {
    if (!isVisible) return;

    const rotateHeadline = () => {
      const interval = setInterval(() => {
        setCurrentHeadlineIndex((prev) => (prev + 1) % headlines.length);
      }, 4000);
      return interval;
    };

    const timer = setTimeout(rotateHeadline, 3000);
    const interval = rotateHeadline();

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [isVisible, headlines.length]);

  // Handle subtitle rotation
  useEffect(() => {
    if (!showSubtitle) return;

    const rotateSubtitle = () => {
      const interval = setInterval(() => {
        setCurrentSubtitleIndex((prev) => (prev + 1) % subtitles.length);
      }, 5000);
      return interval;
    };

    const timer = setTimeout(rotateSubtitle, 4000);
    const interval = rotateSubtitle();

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [showSubtitle, subtitles.length]);

  // Staggered animation sequence
  const handleHeadlineComplete = () => {
    setTimeout(() => setShowSubtitle(true), 300);
  };

  const handleSubtitleComplete = () => {
    setTimeout(() => setShowValueProp(true), 500);
  };

  const handleValuePropComplete = () => {
    setTimeout(() => setShowCTAs(true), 400);
  };

  return (
    <div
      ref={contentRef}
      className={`hero-content hero-content--${currentTheme} ${className}`}
      style={
        {
          "--content-text": config.colors.text,
          "--content-accent": config.colors.accent,
          "--content-highlight": config.colors.highlight,
          "--content-bg": config.colors.bg,
          "--content-font-primary": config.typography.primary,
          "--content-font-code": config.typography.code,
          "--content-border-width": config.borders.width,
          "--content-border-radius": config.borders.radius,
          "--content-animation-duration": config.animations.duration,
          "--content-animation-easing": config.animations.easing,
        } as React.CSSProperties
      }
    >
      {/* Main Headlines */}
      <div className="hero-content__headlines">
        <h1 className="hero-content__main-title">
          <TypewriterText
            text={headlines[currentHeadlineIndex]}
            speed={80}
            delay={500}
            onComplete={
              currentHeadlineIndex === 0 ? handleHeadlineComplete : undefined
            }
            className="hero-content__headline-text"
          />
        </h1>

        {/* Terminal-style status indicator */}
        <div className="hero-content__status-indicator" aria-hidden="true">
          <span className="hero-content__status-dot"></span>
          <span className="hero-content__status-text">SYSTEM_ONLINE</span>
        </div>
      </div>

      {/* Rotating Subtitles */}
      {showSubtitle && (
        <div className="hero-content__subtitles">
          <h2 className="hero-content__subtitle">
            <TypewriterText
              text={subtitles[currentSubtitleIndex]}
              speed={40}
              delay={200}
              onComplete={
                currentSubtitleIndex === 0 ? handleSubtitleComplete : undefined
              }
              className="hero-content__subtitle-text"
            />
          </h2>

          {/* Subtitle indicator */}
          <div className="hero-content__subtitle-indicator" aria-hidden="true">
            {subtitles.map((_: string, index: number) => (
              <span
                key={index}
                className={`hero-content__subtitle-dot ${
                  index === currentSubtitleIndex
                    ? "hero-content__subtitle-dot--active"
                    : ""
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Value Proposition with Strike-through Animation */}
      {showValueProp && (
        <div className="hero-content__value-proposition">
          <div className="hero-content__value-prop-container">
            <p className="hero-content__value-prop-text">
              <TypewriterText
                text={valueProposition}
                speed={25}
                delay={300}
                showCursor={false}
                onComplete={handleValuePropComplete}
                className="hero-content__value-prop-typewriter"
              />
            </p>

            {/* Strike-through effect overlay */}
            <div className="hero-content__strike-overlay" aria-hidden="true">
              <div className="hero-content__strike-line"></div>
              <div className="hero-content__strike-highlight"></div>
            </div>
          </div>

          {/* Terminal prompt */}
          <div className="hero-content__terminal-prompt" aria-hidden="true">
            <span className="hero-content__prompt-symbol">$</span>
            <span className="hero-content__prompt-text">
              execute_mission.sh
            </span>
            <span className="hero-content__prompt-cursor">_</span>
          </div>
        </div>
      )}

      {/* Impact Metrics */}
      {showValueProp && <HeroMetrics className="hero-content__metrics" />}

      {/* Call-to-Action Buttons */}
      {showCTAs && <HeroCTA className="hero-content__cta" />}

      {/* Background Text Effects */}
      <div className="hero-content__bg-effects" aria-hidden="true">
        <div className="hero-content__bg-text hero-content__bg-text--1">
          CODE
        </div>
        <div className="hero-content__bg-text hero-content__bg-text--2">
          CRAFT
        </div>
        <div className="hero-content__bg-text hero-content__bg-text--3">
          SCALE
        </div>
      </div>

      {/* Hero Visual Elements */}
      {showValueProp && <HeroVisual className="hero-content__visual" />}
    </div>
  );
};

export default HeroContent;
