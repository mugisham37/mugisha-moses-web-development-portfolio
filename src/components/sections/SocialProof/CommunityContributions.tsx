"use client";

import React, { useRef } from "react";
import { useTheme, useThemeClassName } from "@/hooks/useTheme";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { portfolioData } from "@/data/portfolio";

interface CommunityContributionsProps {
  className?: string;
}

export const CommunityContributions: React.FC<CommunityContributionsProps> = ({
  className = "",
}) => {
  const { currentTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(containerRef, {
    threshold: 0.3,
    triggerOnce: true,
  });

  const containerClassName = useThemeClassName("community-contributions", {
    "extreme-brutalist": "community-contributions--extreme",
    "refined-brutalist": "community-contributions--refined",
  });

  const { contributions } = portfolioData.socialProof;

  return (
    <div
      ref={containerRef}
      className={`${containerClassName} ${className}`}
      id="community-contributions"
    >
      {/* Section Header */}
      <div className="community-contributions__header">
        <h3 className="community-contributions__title">
          <span className="community-contributions__title-icon">🚀</span>
          <span className="community-contributions__title-text">
            Open Source Impact
          </span>
        </h3>
        <p className="community-contributions__subtitle">
          Contributing to the developer ecosystem with tools and libraries used
          by thousands
        </p>
      </div>

      {/* Contributions Grid */}
      <div
        className={`community-contributions__grid ${
          isVisible ? "community-contributions__grid--visible" : ""
        }`}
      >
        {contributions.map((contribution, index) => (
          <div
            key={contribution.name}
            className="community-contributions__card"
            style={{
              animationDelay: `${index * 200}ms`,
            }}
          >
            {/* Card Header */}
            <div className="community-contributions__card-header">
              <div className="community-contributions__project-info">
                <h4 className="community-contributions__project-name">
                  {contribution.name}
                </h4>
                <span className="community-contributions__role-badge">
                  {contribution.role}
                </span>
              </div>
              <div className="community-contributions__github-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="community-contributions__stats">
              <div className="community-contributions__stat">
                <div className="community-contributions__stat-icon">⭐</div>
                <div className="community-contributions__stat-content">
                  <span className="community-contributions__stat-value">
                    {contribution.stats.stars.toLocaleString()}
                  </span>
                  <span className="community-contributions__stat-label">
                    Stars
                  </span>
                </div>
              </div>

              <div className="community-contributions__stat">
                <div className="community-contributions__stat-icon">🔀</div>
                <div className="community-contributions__stat-content">
                  <span className="community-contributions__stat-value">
                    {contribution.stats.forks.toLocaleString()}
                  </span>
                  <span className="community-contributions__stat-label">
                    Forks
                  </span>
                </div>
              </div>

              <div className="community-contributions__stat">
                <div className="community-contributions__stat-icon">📦</div>
                <div className="community-contributions__stat-content">
                  <span className="community-contributions__stat-value">
                    {contribution.stats.downloads >= 1000
                      ? `${Math.floor(contribution.stats.downloads / 1000)}K`
                      : contribution.stats.downloads.toLocaleString()}
                  </span>
                  <span className="community-contributions__stat-label">
                    Downloads
                  </span>
                </div>
              </div>
            </div>

            {/* Impact Section */}
            <div className="community-contributions__impact">
              <div className="community-contributions__impact-text">
                <span className="community-contributions__impact-icon">💡</span>
                <span className="community-contributions__impact-description">
                  {contribution.impact}
                </span>
              </div>
            </div>

            {/* Recognition Badge */}
            <div className="community-contributions__recognition">
              <div className="community-contributions__recognition-badge">
                <span className="community-contributions__recognition-icon">
                  🏆
                </span>
                <span className="community-contributions__recognition-text">
                  {contribution.recognition}
                </span>
              </div>
            </div>

            {/* Hover Effects */}
            <div className="community-contributions__card-effects">
              <div className="community-contributions__card-shimmer"></div>
              <div className="community-contributions__card-border"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Projects Teaser */}
      <div className="community-contributions__more">
        <div className="community-contributions__more-card">
          <div className="community-contributions__more-icon">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v6m0 6v6" />
              <path d="m21 12-6-6-6 6-6-6" />
            </svg>
          </div>
          <h4 className="community-contributions__more-title">
            +15 More Projects
          </h4>
          <p className="community-contributions__more-description">
            Explore my complete open source portfolio on GitHub
          </p>
          <div className="community-contributions__more-cta">
            <span className="community-contributions__more-link">
              View All Projects →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityContributions;
