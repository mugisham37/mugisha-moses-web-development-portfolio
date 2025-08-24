"use client";

import React from "react";
import "./ResultsEffects.css";

interface ResultsEffectsProps {
  theme: "extreme-brutalist" | "refined-brutalist";
  isVisible: boolean;
}

export const ResultsEffects: React.FC<ResultsEffectsProps> = ({
  theme,
  isVisible,
}) => {
  return (
    <div
      className={`results-effects results-effects--${theme} ${isVisible ? "results-effects--visible" : ""}`}
    >
      {/* Success Particles */}
      <div className="success-particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="success-particle"
            style={{
              animationDelay: `${i * 0.2}s`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Golden Grid */}
      <div className="golden-grid">
        <div className="grid-lines grid-lines--horizontal">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="grid-line" style={{ top: `${i * 10}%` }} />
          ))}
        </div>
        <div className="grid-lines grid-lines--vertical">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="grid-line" style={{ left: `${i * 10}%` }} />
          ))}
        </div>
      </div>

      {/* Achievement Streams */}
      <div className="achievement-streams">
        <div className="stream stream--left">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="stream-item"
              style={{ animationDelay: `${i * 0.5}s` }}
            >
              ⚡
            </div>
          ))}
        </div>
        <div className="stream stream--right">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="stream-item"
              style={{ animationDelay: `${i * 0.5 + 0.25}s` }}
            >
              🎯
            </div>
          ))}
        </div>
      </div>

      {/* Background Glow */}
      <div className="background-glow">
        <div className="glow-orb glow-orb--primary"></div>
        <div className="glow-orb glow-orb--secondary"></div>
        <div className="glow-orb glow-orb--accent"></div>
      </div>
    </div>
  );
};
