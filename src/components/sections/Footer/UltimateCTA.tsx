"use client";

import React, { useState, useEffect, useRef } from "react";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

interface UltimateCTAProps {
  className?: string;
}

interface GuaranteeItem {
  icon: string;
  text: string;
  id: string;
}

const guaranteeItems: GuaranteeItem[] = [
  { icon: "💯", text: "100% satisfaction guaranteed", id: "satisfaction" },
  { icon: "⚡", text: "4-hour response time", id: "response" },
  { icon: "🆓", text: "Free consultation", id: "consultation" },
  { icon: "👥", text: "Join 50+ satisfied clients", id: "clients" },
];

export const UltimateCTA: React.FC<UltimateCTAProps> = ({ className = "" }) => {
  const { currentTheme } = useThemeContext();
  const [isVisible, setIsVisible] = useState(false);
  const [titleText, setTitleText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [hoveredGuarantee, setHoveredGuarantee] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isInView = useIntersectionObserver(containerRef, {
    threshold: 0.3,
    triggerOnce: true,
  });

  const fullTitle =
    "MAIN CTA - READY TO START? LET'S BUILD SOMETHING AMAZING TOGETHER.";

  // Typewriter effect for title
  useEffect(() => {
    if (isInView && !isTyping) {
      setIsTyping(true);
      let currentIndex = 0;
      const typeInterval = setInterval(() => {
        if (currentIndex <= fullTitle.length) {
          setTitleText(fullTitle.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);
        }
      }, 50);

      return () => clearInterval(typeInterval);
    }
  }, [isInView, isTyping]);

  // Visibility animation
  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setIsVisible(true), 200);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  const handleCTAClick = (action: string) => {
    // Track conversion
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "click", {
        event_category: "ultimate_cta",
        event_label: action,
        value: 1,
      });
    }

    // Handle different CTA actions
    switch (action) {
      case "start_project":
        // Navigate to contact page
        window.location.href = "/contact";
        break;
      case "quick_quote":
        // Open quote form or redirect
        window.open("/quote", "_blank");
        break;
      case "schedule_call":
        // Open calendar booking
        window.open("https://calendly.com/your-calendar", "_blank");
        break;
    }
  };

  const ctaClasses = [
    "ultimate-cta",
    `ultimate-cta--${currentTheme}`,
    isVisible ? "ultimate-cta--visible" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={containerRef} className={ctaClasses}>
      {/* Background Effects */}
      <div className="ultimate-cta__background">
        <div className="ultimate-cta__particles"></div>
        <div className="ultimate-cta__grid"></div>
        <div className="ultimate-cta__glow"></div>
        <div className="ultimate-cta__stripes"></div>
      </div>

      {/* Shadow Layers */}
      <div className="ultimate-cta__shadow ultimate-cta__shadow--1"></div>
      <div className="ultimate-cta__shadow ultimate-cta__shadow--2"></div>
      <div className="ultimate-cta__shadow ultimate-cta__shadow--3"></div>

      {/* Border Effects */}
      <div className="ultimate-cta__border ultimate-cta__border--main"></div>
      <div className="ultimate-cta__border ultimate-cta__border--accent"></div>

      {/* Main Container */}
      <div className="ultimate-cta__container">
        {/* Title Section */}
        <div className="ultimate-cta__title-container">
          <div className="ultimate-cta__title-shadow"></div>
          <h2 className="ultimate-cta__title">
            {titleText}
            {isTyping && <span className="ultimate-cta__cursor">_</span>}
          </h2>
          <div className="ultimate-cta__title-strike"></div>
          <div className="ultimate-cta__title-glow"></div>

          {/* Glitch Layers */}
          <div className="ultimate-cta__title-glitch ultimate-cta__title-glitch--1">
            {titleText}
          </div>
          <div className="ultimate-cta__title-glitch ultimate-cta__title-glitch--2">
            {titleText}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="ultimate-cta__buttons">
          {/* Primary CTA - Start Project */}
          <button
            className={`ultimate-cta__button ultimate-cta__button--primary ${
              hoveredButton === "start_project"
                ? "ultimate-cta__button--hovered"
                : ""
            }`}
            onClick={() => handleCTAClick("start_project")}
            onMouseEnter={() => setHoveredButton("start_project")}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <div className="ultimate-cta__button-content">
              <span className="ultimate-cta__button-text">
                START YOUR PROJECT
              </span>
              <div className="ultimate-cta__button-arrow">
                <span className="ultimate-cta__arrow-line"></span>
                <span className="ultimate-cta__arrow-head">&gt;</span>
              </div>
            </div>

            {/* Button Effects */}
            <div className="ultimate-cta__button-shadow ultimate-cta__button-shadow--1"></div>
            <div className="ultimate-cta__button-shadow ultimate-cta__button-shadow--2"></div>
            <div className="ultimate-cta__button-border"></div>
            <div className="ultimate-cta__button-rainbow"></div>
            <div className="ultimate-cta__button-strike"></div>
            <div className="ultimate-cta__button-glow"></div>
            <div className="ultimate-cta__button-shimmer"></div>
          </button>

          {/* Secondary CTA - Quick Quote */}
          <button
            className={`ultimate-cta__button ultimate-cta__button--secondary ${
              hoveredButton === "quick_quote"
                ? "ultimate-cta__button--hovered"
                : ""
            }`}
            onClick={() => handleCTAClick("quick_quote")}
            onMouseEnter={() => setHoveredButton("quick_quote")}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <div className="ultimate-cta__button-content">
              <span className="ultimate-cta__button-text">GET QUICK QUOTE</span>
              <div className="ultimate-cta__button-icon">💰</div>
            </div>

            {/* Button Effects */}
            <div className="ultimate-cta__button-shadow ultimate-cta__button-shadow--1"></div>
            <div className="ultimate-cta__button-border"></div>
            <div className="ultimate-cta__button-pulse"></div>
            <div className="ultimate-cta__button-strike"></div>
            <div className="ultimate-cta__button-glow"></div>
          </button>

          {/* Tertiary CTA - Schedule Call */}
          <button
            className={`ultimate-cta__button ultimate-cta__button--tertiary ${
              hoveredButton === "schedule_call"
                ? "ultimate-cta__button--hovered"
                : ""
            }`}
            onClick={() => handleCTAClick("schedule_call")}
            onMouseEnter={() => setHoveredButton("schedule_call")}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <div className="ultimate-cta__button-content">
              <span className="ultimate-cta__button-text">SCHEDULE CALL</span>
              <div className="ultimate-cta__button-icon">📞</div>
            </div>

            {/* Button Effects */}
            <div className="ultimate-cta__button-shadow ultimate-cta__button-shadow--1"></div>
            <div className="ultimate-cta__button-border"></div>
            <div className="ultimate-cta__button-glow-effect"></div>
            <div className="ultimate-cta__button-strike"></div>
            <div className="ultimate-cta__button-glow"></div>
          </button>
        </div>

        {/* Guarantee Items */}
        <div className="ultimate-cta__guarantees">
          {guaranteeItems.map((item, index) => (
            <div
              key={item.id}
              className={`ultimate-cta__guarantee ${
                hoveredGuarantee === item.id
                  ? "ultimate-cta__guarantee--hovered"
                  : ""
              }`}
              onMouseEnter={() => setHoveredGuarantee(item.id)}
              onMouseLeave={() => setHoveredGuarantee(null)}
              style={{ "--guarantee-index": index } as React.CSSProperties}
            >
              <div className="ultimate-cta__guarantee-shadow"></div>
              <div className="ultimate-cta__guarantee-border"></div>

              <div className="ultimate-cta__guarantee-content">
                <span className="ultimate-cta__guarantee-icon">
                  {item.icon}
                </span>
                <span className="ultimate-cta__guarantee-text">
                  {item.text}
                </span>
              </div>

              <div className="ultimate-cta__guarantee-strike"></div>
              <div className="ultimate-cta__guarantee-glow"></div>
            </div>
          ))}
        </div>

        {/* Main Strike Effect */}
        <div className="ultimate-cta__main-strike"></div>
      </div>

      {/* Scan Lines */}
      <div className="ultimate-cta__scan-lines">
        <div className="ultimate-cta__scan-line ultimate-cta__scan-line--1"></div>
        <div className="ultimate-cta__scan-line ultimate-cta__scan-line--2"></div>
        <div className="ultimate-cta__scan-line ultimate-cta__scan-line--3"></div>
      </div>
    </div>
  );
};
