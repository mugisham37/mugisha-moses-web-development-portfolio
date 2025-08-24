"use client";

import React, { useRef, useEffect } from "react";
import { useTheme, useThemeClassName } from "@/hooks/useTheme";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { ClientLogos } from "./ClientLogos";
import { LinkedInRecommendations } from "./LinkedInRecommendations";
import { CommunityContributions } from "./CommunityContributions";
import { SpeakingEvents } from "./SpeakingEvents";

interface SocialProofProps {
  className?: string;
}

export const SocialProof: React.FC<SocialProofProps> = ({ className = "" }) => {
  const { currentTheme, setTheme } = useTheme();
  const containerRef = useRef<HTMLElement>(null);
  const isVisible = useIntersectionObserver(containerRef, {
    threshold: 0.3,
    triggerOnce: false,
  });

  // Transition to refined brutalist theme when this section becomes visible
  useEffect(() => {
    if (isVisible && currentTheme === "extreme-brutalist") {
      setTheme("refined-brutalist");
    }
  }, [isVisible, currentTheme, setTheme]);

  const containerClassName = useThemeClassName("social-proof", {
    "extreme-brutalist": "social-proof--extreme",
    "refined-brutalist": "social-proof--refined",
  });

  return (
    <section
      ref={containerRef}
      className={`${containerClassName} ${className}`}
      id="social-proof"
    >
      {/* Background Effects */}
      <div className="social-proof__background">
        <div className="social-proof__network-particles"></div>
        <div className="social-proof__trust-grid"></div>
        <div className="social-proof__scan-lines"></div>
      </div>

      {/* Container */}
      <div className="social-proof__container">
        {/* Terminal Success Line */}
        <div className="social-proof__terminal">
          <div className="social-proof__terminal-line">
            <span className="social-proof__terminal-prompt">$</span>
            <span className="social-proof__terminal-command">
              validate_trust_metrics --social-proof
            </span>
          </div>
          <div className="social-proof__terminal-output">
            <span className="social-proof__terminal-success">✓</span>
            <span className="social-proof__terminal-text">
              TRUST VALIDATION: COMPLETE
            </span>
            <span className="social-proof__terminal-cursor"></span>
          </div>
        </div>

        {/* Section Header */}
        <div className="social-proof__header">
          <h2 className="social-proof__title">
            <span className="social-proof__title-line">TRUSTED BY</span>
            <span className="social-proof__title-highlight">
              INDUSTRY LEADERS
            </span>
          </h2>
          <p className="social-proof__subtitle">
            Building relationships and delivering results that speak for
            themselves
          </p>
        </div>

        {/* Content Grid */}
        <div className="social-proof__content">
          {/* Client Logo Carousel */}
          <ClientLogos />

          {/* LinkedIn Recommendations */}
          <LinkedInRecommendations />

          {/* Community Contributions */}
          <CommunityContributions />

          {/* Speaking Events and Publications */}
          <SpeakingEvents />
        </div>

        {/* Trust Indicators */}
        <div className="social-proof__trust-indicators">
          <div className="social-proof__indicator">
            <div className="social-proof__indicator-value">150+</div>
            <div className="social-proof__indicator-label">
              Projects Delivered
            </div>
          </div>
          <div className="social-proof__indicator">
            <div className="social-proof__indicator-value">99.9%</div>
            <div className="social-proof__indicator-label">
              Client Satisfaction
            </div>
          </div>
          <div className="social-proof__indicator">
            <div className="social-proof__indicator-value">5+</div>
            <div className="social-proof__indicator-label">
              Years Experience
            </div>
          </div>
          <div className="social-proof__indicator">
            <div className="social-proof__indicator-value">24/7</div>
            <div className="social-proof__indicator-label">
              Support Available
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
