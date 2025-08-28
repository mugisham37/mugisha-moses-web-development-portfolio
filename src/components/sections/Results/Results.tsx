"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
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
      // Start experience stream animation
      const experiences = [
        "SENIOR_DEVELOPER_EXPERIENCE",
        "FULL_STACK_EXPERTISE_GAINED",
        "TEAM_LEADERSHIP_DEVELOPED",
        "ARCHITECTURE_SKILLS_MASTERED",
        "MENTORSHIP_EXPERIENCE_BUILT",
        "INNOVATION_MINDSET_CULTIVATED",
      ];

      let index = 0;
      const interval = setInterval(() => {
        if (index < experiences.length) {
          setAchievementStream((prev) => [...prev, experiences[index]]);
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
              analyze_professional_experience --comprehensive
            </span>
          </div>
          <div className="terminal-output">
            <div className="success-line">
              <span className="success-indicator">✓</span>
              <span className="success-text">EXPERIENCE ANALYSIS COMPLETE</span>
              <span className="blinking-cursor">_</span>
            </div>
          </div>
        </div>

        {/* Experience Stream */}
        <div className="achievement-stream">
          {achievementStream.map((experience, index) => (
            <div
              key={index}
              className="achievement-item"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <span className="achievement-icon">💼</span>
              <span className="achievement-text">{experience}</span>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="results-content">
          {/* Section Header */}
          <header className="results-header">
            <div className="header-badge">
              <span className="badge-text">PROFESSIONAL EXPERIENCE</span>
              <div className="badge-glow"></div>
            </div>
            <h2 className="results-title">
              <span className="title-line">YEARS OF</span>
              <span className="title-line title-line--accent">EXPERTISE</span>
              <span className="title-line">GAINED</span>
            </h2>
            <p className="results-subtitle">
              Real experience. Real growth. Real expertise. Here&apos;s the
              journey that shaped a seasoned developer and technical leader.
            </p>
          </header>

          {/* Experience Grid */}
          <div className="results-grid">
            {/* Experience Timeline */}
            <div className="results-section-wrapper results-section-wrapper--full">
              <AchievementTimeline theme={currentTheme} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
