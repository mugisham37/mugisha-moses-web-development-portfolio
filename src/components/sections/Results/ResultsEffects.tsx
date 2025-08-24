"use client";

import React from "react";
import "./ResultsEffects.css";

interface ResultsEffectsProps {
  theme: "extreme-brutalist" | "refined-brutalist";
  isVisible: boolean;
  className?: string;
}

export const ResultsEffects: React.FC<ResultsEffectsProps> = ({
  theme,
  isVisible,
  className = "",
}) => {
  return (
    <div
      className={`results-effects results-effects--${theme} ${className} ${
        isVisible ? "results-effects--visible" : ""
      }`}
    >
      {/* Success Particles */}
      <div className="results-effects__particles">
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
      <div className="results-effects__grid" />

      {/* Success Glow */}
      <div className="results-effects__glow" />
    </div>
  );
};
