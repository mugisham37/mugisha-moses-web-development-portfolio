"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { ExperienceTimeline } from "../sections/Experience/ExperienceTimeline";
import { ExperienceEffects } from "../sections/Experience/ExperienceEffects";
import "../sections/Experience/Experience.css";

interface ExperienceProps {
  className?: string;
}

export const Experience: React.FC<ExperienceProps> = ({ className = "" }) => {
  const { currentTheme } = useTheme();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [experienceStream, setExperienceStream] = useState<string[]>([]);

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
          setExperienceStream((prev) => [...prev, experiences[index]]);
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
      className={`experience-section experience-section--${currentTheme} ${className} ${
        isVisible ? "experience-section--visible" : ""
      }`}
      id="experience"
    >
      {/* Background Effects */}
      <ExperienceEffects theme={currentTheme} isVisible={isVisible} />
      {/* Container */}
      <div className="experience-container">
        {/* Terminal Success Line */}
        <div className="experience-terminal">
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
        <div className="experience-stream">
          {experienceStream.map((experience, index) => (
            <div
              key={index}
              className="experience-item"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <span className="experience-icon">💼</span>
              <span className="experience-text">{experience}</span>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="experience-content">
          {/* Section Header */}
          <header className="experience-header">
            <div className="header-badge">
              <span className="badge-text">PROFESSIONAL EXPERIENCE</span>
              <div className="badge-glow"></div>
            </div>
            <h2 className="experience-title">
              <span className="title-line">YEARS OF</span>
              <span className="title-line title-line--accent">EXPERTISE</span>
              <span className="title-line">GAINED</span>
            </h2>
            <p className="experience-subtitle">
              Real experience. Real growth. Real expertise. Here&apos;s the
              journey that shaped a seasoned developer and technical leader.
            </p>
          </header>

          {/* Experience Grid */}
          <div className="experience-grid">
            {/* Experience Timeline */}
            <div className="experience-section-wrapper experience-section-wrapper--full">
              <ExperienceTimeline theme={currentTheme} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
