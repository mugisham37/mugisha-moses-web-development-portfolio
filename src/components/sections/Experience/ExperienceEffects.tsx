"use client";

import React from "react";
import "./ExperienceEffects.css";

interface ExperienceEffectsProps {
  theme: "extreme-brutalist" | "refined-brutalist";
  isVisible: boolean;
  className?: string;
}

export const ExperienceEffects: React.FC<ExperienceEffectsProps> = ({
  theme,
  isVisible,
  className = "",
}) => {
  return (
    <div
      className={`experience-effects experience-effects--${theme} ${className} ${
        isVisible ? "experience-effects--visible" : ""
      }`}
    >
      {/* Success Particles */}
      <div className="experience-effects__particles">
        {Array.from({ length: 20 }).map((_, index) => (
          <div
            key={index}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Golden Grid */}
      <div className="experience-effects__grid" />

      {/* Success Glow */}
      <div className="experience-effects__glow" />
    </div>
  );
};
