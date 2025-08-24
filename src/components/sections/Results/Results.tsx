"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { ComparisonShowcase } from "./ComparisonShowcase";
import { RevenueDashboard } from "./RevenueDashboard";
import { AchievementTimeline } from "./AchievementTimeline";
import { ResultsEffects } from "./ResultsEffects";
import "./Results.css";

interface ResultsProps {
  className?: string;
}

export const Results: React.FC<ResultsProps> = ({ className = "" }) => {
  const { currentTheme } = useTheme();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [achievementStream, setAchievementStream] = useState<string[]>([]);

  // Intersection observer for entrance animations
  const isInView = useIntersectionObserver(sectionRef, {
    threshold: 0.2,
    rootMargin: "-50px",
    triggerOnce: true,
  });

  useEffect(() => {
    if (isInView) {
      setIsVisible(true);
      // Start achievement stream animation
      const achievements = [
        "SYSTEM_OPTIMIZATION_COMPLETE",
        "PERFORMANCE_BOOST_ACHIEVED",
        "REVENUE_TARGET_EXCEEDED",
        "CLIENT_SATISFACTION_100%",
        "DEPLOYMENT_SUCCESSFUL",
        "METRICS_IMPROVED_BY_250%",
      ];

      let index = 0;
      const interval = setInterval(() => {
        if (index < achievements.length) {
          setAchievementStream((prev) => [...prev, achievements[index]]);
          index++;
        } else {
          clearInterval(interval);
        }
      }, 800);

      return () => clearInterval(interval);
    }
  }, [isInView]);

  return (
    <section
      ref={sectionRef}
      className={`results-section results-section--${currentTheme} ${className} ${
        isVisible ? "results-section--visible" : ""
      }`}
      id="results"
    >
      {/* Background Effects */}
      <ResultsEffects theme={currentTheme} isVisible={isVisible} />

      {/* Container */}
      <div className="results-container">
        {/* Terminal Success Line */}
        <div className="results-terminal">
          <div className="terminal-line">
            <span className="terminal-prompt">$</span>
            <span className="terminal-command">
              analyze_project_results --comprehensive
            </span>
          </div>
          <div className="terminal-output">
            <div className="success-line">
              <span className="success-indicator">✓</span>
              <span className="success-text">RESULTS ANALYSIS COMPLETE</span>
              <span className="blinking-cursor">_</span>
            </div>
          </div>
        </div>

        {/* Achievement Stream */}
        <div className="achievement-stream">
          {achievementStream.map((achievement, index) => (
            <div
              key={index}
              className="achievement-item"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <span className="achievement-icon">⚡</span>
              <span className="achievement-text">{achievement}</span>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="results-content">
          {/* Section Header */}
          <header className="results-header">
            <div className="header-badge">
              <span className="badge-text">PROVEN RESULTS</span>
              <div className="badge-glow"></div>
            </div>
            <h2 className="results-title">
              <span className="title-line">MEASURABLE</span>
              <span className="title-line title-line--accent">IMPACT</span>
              <span className="title-line">DELIVERED</span>
            </h2>
            <p className="results-subtitle">
              Real projects. Real results. Real ROI. Here&apos;s the data that
              proves the value of investing in exceptional development.
            </p>
          </header>

          {/* Results Grid */}
          <div className="results-grid">
            {/* Before/After Comparisons */}
            <div className="results-section-wrapper">
              <ComparisonShowcase theme={currentTheme} />
            </div>

            {/* Revenue Dashboard */}
            <div className="results-section-wrapper">
              <RevenueDashboard theme={currentTheme} />
            </div>

            {/* Achievement Timeline */}
            <div className="results-section-wrapper results-section-wrapper--full">
              <AchievementTimeline theme={currentTheme} />
            </div>
          </div>

          {/* Results CTA */}
          <div className="results-cta">
            <div className="cta-content">
              <h3 className="cta-title">Ready to See Similar Results?</h3>
              <p className="cta-description">
                Let&apos;s discuss how we can achieve these kinds of
                improvements for your project.
              </p>
              <div className="cta-buttons">
                <button className="cta-button cta-button--primary">
                  <span className="button-text">START YOUR PROJECT</span>
                  <div className="button-effects">
                    <div className="button-shimmer"></div>
                    <div className="button-glow"></div>
                  </div>
                </button>
                <button className="cta-button cta-button--secondary">
                  <span className="button-text">VIEW CASE STUDIES</span>
                  <div className="button-effects">
                    <div className="button-border-animation"></div>
                  </div>
                </button>
              </div>
            </div>
            <div className="cta-guarantee">
              <div className="guarantee-badge">
                <span className="guarantee-icon">🛡️</span>
                <span className="guarantee-text">
                  100% SATISFACTION GUARANTEE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
