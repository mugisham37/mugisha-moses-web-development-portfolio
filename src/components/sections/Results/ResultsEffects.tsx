"use client";

import React, { useEffect, useRef } from "react";
import "./ResultsEffects.css";

interface ResultsEffectsProps {
  theme: "extreme-brutalist" | "refined-brutalist";
  isVisible: boolean;
}

export const ResultsEffects: React.FC<ResultsEffectsProps> = ({
  theme,
  isVisible,
}) => {
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible || !particlesRef.current) return;

    // Create floating particles
    const createParticle = () => {
      const particle = document.createElement("div");
      particle.className = `results-particle results-particle--${theme}`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 3}s`;
      particle.style.animationDuration = `${3 + Math.random() * 4}s`;

      if (particlesRef.current) {
        particlesRef.current.appendChild(particle);
      }

      // Remove particle after animation
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 7000);
    };

    // Create initial particles
    for (let i = 0; i < 15; i++) {
      setTimeout(() => createParticle(), i * 200);
    }

    // Continue creating particles
    const interval = setInterval(createParticle, 800);

    return () => {
      clearInterval(interval);
      if (particlesRef.current) {
        particlesRef.current.innerHTML = "";
      }
    };
  }, [isVisible, theme]);

  return (
    <div className={`results-effects results-effects--${theme}`}>
      {/* Success Particles */}
      <div ref={particlesRef} className="results-particles"></div>

      {/* Golden Grid */}
      <div className="results-grid">
        <div className="grid-lines grid-lines--horizontal">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="grid-line"
              style={{ top: `${(i + 1) * 12.5}%` }}
            />
          ))}
        </div>
        <div className="grid-lines grid-lines--vertical">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="grid-line"
              style={{ left: `${(i + 1) * 8.33}%` }}
            />
          ))}
        </div>
      </div>

      {/* Success Rays */}
      <div className="success-rays">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="success-ray"
            style={{
              left: `${15 + i * 15}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Floating Icons */}
      <div className="floating-icons">
        {["💰", "📈", "⚡", "🎯", "🚀", "✨"].map((icon, i) => (
          <div
            key={i}
            className="floating-icon"
            style={{
              left: `${10 + i * 15}%`,
              animationDelay: `${i * 1.2}s`,
            }}
          >
            {icon}
          </div>
        ))}
      </div>

      {/* Background Glow */}
      <div className="results-glow">
        <div className="glow-orb glow-orb--primary"></div>
        <div className="glow-orb glow-orb--secondary"></div>
        <div className="glow-orb glow-orb--accent"></div>
      </div>
    </div>
  );
};
