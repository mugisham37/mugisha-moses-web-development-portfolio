"use client";

import React, { useRef } from "react";
import { useTheme, useThemeClassName } from "@/hooks/useTheme";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { portfolioData } from "@/data/portfolio";

interface LinkedInRecommendationsProps {
  className?: string;
}

export const LinkedInRecommendations: React.FC<
  LinkedInRecommendationsProps
> = ({ className = "" }) => {
  const { currentTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(containerRef, {
    threshold: 0.3,
    triggerOnce: true,
  });

  const containerClassName = useThemeClassName("linkedin-recommendations", {
    "extreme-brutalist": "linkedin-recommendations--extreme",
    "refined-brutalist": "linkedin-recommendations--refined",
  });

  const { recommendations } = portfolioData.socialProof;

  return (
    <div
      ref={containerRef}
      className={`${containerClassName} ${className}`}
      id="linkedin-recommendations"
    >
      <h3 className="linkedin-recommendations__title">
        LinkedIn Recommendations
      </h3>

      <div className="linkedin-recommendations__grid">
        {recommendations.map((recommendation, index) => (
          <div
            key={recommendation.id}
            className={`linkedin-recommendations__card ${
              isVisible ? "linkedin-recommendations__card--animate" : ""
            }`}
            style={{
              animationDelay: `${index * 200}ms`,
            }}
          >
            {/* Card Header */}
            <div className="linkedin-recommendations__header">
              <div className="linkedin-recommendations__profile">
                <div className="linkedin-recommendations__avatar">
                  <img
                    src={recommendation.profileImage}
                    alt={`${recommendation.name} profile`}
                    className="linkedin-recommendations__avatar-image"
                    onError={(e) => {
                      // Fallback to initials if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const initials = target.nextElementSibling as HTMLElement;
                      if (initials) {
                        initials.style.display = "flex";
                      }
                    }}
                  />
                  <div
                    className="linkedin-recommendations__avatar-fallback"
                    style={{ display: "none" }}
                  >
                    {recommendation.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                </div>

                <div className="linkedin-recommendations__profile-info">
                  <h4 className="linkedin-recommendations__name">
                    {recommendation.name}
                  </h4>
                  <p className="linkedin-recommendations__title-company">
                    {recommendation.title} at {recommendation.company}
                  </p>
                  <span className="linkedin-recommendations__connections">
                    {recommendation.mutualConnections} mutual connections
                  </span>
                </div>
              </div>

              {/* LinkedIn Badge */}
              <div className="linkedin-recommendations__badge-container">
                <a
                  href={recommendation.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="linkedin-recommendations__linkedin-badge"
                  aria-label={`View ${recommendation.name}'s LinkedIn profile`}
                >
                  <span className="linkedin-recommendations__linkedin-icon">
                    in
                  </span>
                </a>

                {/* Verification Badge */}
                <div className="linkedin-recommendations__verification">
                  <div className="linkedin-recommendations__verification-badge">
                    ✓
                  </div>
                  <span className="linkedin-recommendations__verification-text">
                    Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Recommendation Content */}
            <blockquote className="linkedin-recommendations__content">
              <div className="linkedin-recommendations__quote-mark">"</div>
              <p className="linkedin-recommendations__text">
                {recommendation.content}
              </p>
              <div className="linkedin-recommendations__quote-mark linkedin-recommendations__quote-mark--end">
                "
              </div>
            </blockquote>

            {/* Card Footer */}
            <div className="linkedin-recommendations__footer">
              <div className="linkedin-recommendations__date">
                {new Date(recommendation.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>

              <div className="linkedin-recommendations__actions">
                <button
                  className="linkedin-recommendations__action-btn"
                  aria-label="Like recommendation"
                >
                  <span className="linkedin-recommendations__action-icon">
                    👍
                  </span>
                  <span className="linkedin-recommendations__action-count">
                    {Math.floor(Math.random() * 50) + 10}
                  </span>
                </button>

                <button
                  className="linkedin-recommendations__action-btn"
                  aria-label="Share recommendation"
                >
                  <span className="linkedin-recommendations__action-icon">
                    ↗
                  </span>
                  Share
                </button>
              </div>
            </div>

            {/* Hover Effects */}
            <div className="linkedin-recommendations__hover-effects">
              <div className="linkedin-recommendations__shimmer"></div>
              <div className="linkedin-recommendations__border-glow"></div>
            </div>
          </div>
        ))}
      </div>

      {/* View More Button */}
      <div className="linkedin-recommendations__view-more">
        <a
          href="https://linkedin.com/in/moses-mugisha"
          target="_blank"
          rel="noopener noreferrer"
          className="linkedin-recommendations__view-more-btn"
        >
          <span className="linkedin-recommendations__view-more-text">
            View All Recommendations
          </span>
          <span className="linkedin-recommendations__view-more-icon">→</span>
          <div className="linkedin-recommendations__view-more-effects">
            <div className="linkedin-recommendations__view-more-shimmer"></div>
          </div>
        </a>
      </div>
    </div>
  );
};

export default LinkedInRecommendations;
