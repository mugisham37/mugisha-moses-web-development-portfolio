"use client";

import React, { useState, useEffect } from "react";
import { ThemeType } from "@/types/theme";

interface NavigationCTAProps {
  theme: ThemeType;
  className?: string;
}

export const NavigationCTA: React.FC<NavigationCTAProps> = ({
  theme,
  className = "",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [terminalText, setTerminalText] = useState("READY");
  const [scanProgress, setScanProgress] = useState(0);

  // Terminal text animation
  useEffect(() => {
    const texts = ["READY", "ONLINE", "ACTIVE", "READY"];
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % texts.length;
      setTerminalText(texts[currentIndex]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Scan effect animation
  useEffect(() => {
    if (isHovered) {
      const interval = setInterval(() => {
        setScanProgress((prev) => (prev >= 100 ? 0 : prev + 2));
      }, 50);

      return () => clearInterval(interval);
    } else {
      setScanProgress(0);
    }
  }, [isHovered]);

  const handleCTAClick = () => {
    // Scroll to contact section
    const contactSection = document.querySelector("#contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const ctaClasses = [
    "navigation-cta",
    `navigation-cta--${theme}`,
    isHovered ? "navigation-cta--hovered" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={ctaClasses}>
      {/* Main CTA Button */}
      <button
        className="navigation-cta__button"
        onClick={handleCTAClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Button Content */}
        <div className="navigation-cta__content">
          <span className="navigation-cta__text">HIRE ME</span>
          <div className="navigation-cta__arrow">
            <span className="navigation-cta__arrow-line"></span>
            <span className="navigation-cta__arrow-head">&gt;</span>
          </div>
        </div>

        {/* Layered Shadow Effects */}
        <div className="navigation-cta__shadow navigation-cta__shadow--1"></div>
        <div className="navigation-cta__shadow navigation-cta__shadow--2"></div>
        <div className="navigation-cta__shadow navigation-cta__shadow--3"></div>

        {/* Border Animation */}
        <div className="navigation-cta__border-animation"></div>

        {/* Shimmer Effect */}
        <div className="navigation-cta__shimmer"></div>

        {/* Strike Effect */}
        <div className="navigation-cta__strike"></div>

        {/* Scan Line */}
        <div
          className="navigation-cta__scan-line"
          style={{ transform: `translateY(${scanProgress}%)` }}
        ></div>
      </button>

      {/* Terminal Indicator */}
      <div className="navigation-cta__terminal">
        <div className="navigation-cta__terminal-content">
          <span className="navigation-cta__terminal-bracket">[</span>
          <span className="navigation-cta__terminal-status">
            {terminalText}
          </span>
          <span className="navigation-cta__terminal-bracket">]</span>
          <span className="navigation-cta__terminal-cursor">_</span>
        </div>

        {/* Terminal Glow */}
        <div className="navigation-cta__terminal-glow"></div>
      </div>

      {/* Progress Indicator */}
      <div className="navigation-cta__progress">
        <div className="navigation-cta__progress-bar">
          <div
            className="navigation-cta__progress-fill"
            style={{ width: `${isHovered ? scanProgress : 0}%` }}
          ></div>
        </div>
        <span className="navigation-cta__progress-text">
          {isHovered ? `${Math.floor(scanProgress)}%` : "0%"}
        </span>
      </div>

      {/* Glitch Layers */}
      <div className="navigation-cta__glitch navigation-cta__glitch--1">
        HIRE ME
      </div>
      <div className="navigation-cta__glitch navigation-cta__glitch--2">
        HIRE ME
      </div>
    </div>
  );
};
