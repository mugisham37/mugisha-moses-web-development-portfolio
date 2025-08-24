"use client";

import React, { useState, useRef } from "react";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { socialPlatforms, SocialPlatform } from "@/data/social";

interface SocialPlatformsProps {
  className?: string;
}

interface PlatformCardProps {
  platform: SocialPlatform;
  index: number;
  isVisible: boolean;
}

const PlatformCard: React.FC<PlatformCardProps> = ({
  platform,
  index,
  isVisible,
}) => {
  const { currentTheme } = useThemeContext();
  const [isHovered, setIsHovered] = useState(false);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const cardClasses = [
    "social-platform-card",
    `social-platform-card--${currentTheme}`,
    `social-platform-card--${platform.id}`,
    isVisible && "social-platform-card--visible",
    isHovered && "social-platform-card--hovered",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={cardClasses}
      style={
        {
          "--platform-color": platform.color,
          "--animation-delay": `${index * 150}ms`,
        } as React.CSSProperties
      }
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Platform Header */}
      <div className="social-platform-card__header">
        <div className="social-platform-card__icon">
          <span className="social-platform-card__emoji">{platform.icon}</span>
          <div className="social-platform-card__icon-glow"></div>
        </div>
        <div className="social-platform-card__info">
          <h3 className="social-platform-card__name">{platform.name}</h3>
          <p className="social-platform-card__handle">{platform.handle}</p>
        </div>
        <div className="social-platform-card__status">
          <div className="social-platform-card__status-dot"></div>
          <span className="social-platform-card__status-text">ACTIVE</span>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="social-platform-card__stats">
        <div className="social-platform-card__stat">
          <span className="social-platform-card__stat-value">
            {formatNumber(platform.followers)}
          </span>
          <span className="social-platform-card__stat-label">FOLLOWERS</span>
        </div>
        <div className="social-platform-card__stat">
          <span className="social-platform-card__stat-value">
            {formatNumber(platform.stats.totalViews)}
          </span>
          <span className="social-platform-card__stat-label">VIEWS</span>
        </div>
        <div className="social-platform-card__stat">
          <span className="social-platform-card__stat-value">
            {platform.stats.avgEngagement}%
          </span>
          <span className="social-platform-card__stat-label">ENGAGEMENT</span>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="social-platform-card__activity">
        <h4 className="social-platform-card__activity-title">
          RECENT ACTIVITY
        </h4>
        <div className="social-platform-card__activity-list">
          {platform.recentActivity
            .slice(0, 2)
            .map((activity, activityIndex) => (
              <div
                key={activity.id}
                className="social-platform-card__activity-item"
                style={
                  {
                    "--activity-delay": `${index * 150 + activityIndex * 100}ms`,
                  } as React.CSSProperties
                }
              >
                <div className="social-platform-card__activity-meta">
                  <span className="social-platform-card__activity-type">
                    {activity.type.toUpperCase()}
                  </span>
                  <span className="social-platform-card__activity-date">
                    {new Date(activity.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <h5 className="social-platform-card__activity-title">
                  {activity.title}
                </h5>
                <p className="social-platform-card__activity-description">
                  {activity.description}
                </p>
                <div className="social-platform-card__activity-metrics">
                  {activity.metrics.views && (
                    <span className="social-platform-card__activity-metric">
                      👁️ {formatNumber(activity.metrics.views)}
                    </span>
                  )}
                  {activity.metrics.likes && (
                    <span className="social-platform-card__activity-metric">
                      ❤️ {formatNumber(activity.metrics.likes)}
                    </span>
                  )}
                  {activity.metrics.shares && (
                    <span className="social-platform-card__activity-metric">
                      🔄 {formatNumber(activity.metrics.shares)}
                    </span>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Follow Button */}
      <div className="social-platform-card__actions">
        <a
          href={platform.url}
          target="_blank"
          rel="noopener noreferrer"
          className="social-platform-card__follow-btn"
        >
          <span className="social-platform-card__follow-text">
            FOLLOW ON {platform.name.toUpperCase()}
          </span>
          <div className="social-platform-card__follow-arrow">→</div>
          <div className="social-platform-card__follow-glow"></div>
        </a>
      </div>

      {/* Card Effects */}
      <div className="social-platform-card__effects">
        <div className="social-platform-card__border-top"></div>
        <div className="social-platform-card__border-right"></div>
        <div className="social-platform-card__border-bottom"></div>
        <div className="social-platform-card__border-left"></div>
        <div className="social-platform-card__corner-tl"></div>
        <div className="social-platform-card__corner-tr"></div>
        <div className="social-platform-card__corner-bl"></div>
        <div className="social-platform-card__corner-br"></div>
        <div className="social-platform-card__scan-line"></div>
        <div className="social-platform-card__glow-effect"></div>
      </div>
    </div>
  );
};

export const SocialPlatforms: React.FC<SocialPlatformsProps> = ({
  className = "",
}) => {
  const { currentTheme } = useThemeContext();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(sectionRef, {
    threshold: 0.2,
    triggerOnce: true,
  });

  const sectionClasses = [
    "social-platforms-section",
    `social-platforms-section--${currentTheme}`,
    isVisible && "social-platforms-section--visible",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section ref={sectionRef} className={sectionClasses}>
      {/* Section Header */}
      <div className="social-platforms-section__header">
        <div className="social-platforms-section__terminal-line">
          <span className="social-platforms-section__prompt">$</span>
          <span className="social-platforms-section__command">
            connect --social-networks
          </span>
          <span className="social-platforms-section__cursor">_</span>
        </div>
        <h2 className="social-platforms-section__title">
          SOCIAL NETWORK CONNECTIONS
        </h2>
        <p className="social-platforms-section__description">
          Follow my journey across platforms where I share insights, tutorials,
          and behind-the-scenes development content.
        </p>
      </div>

      {/* Platform Grid */}
      <div className="social-platforms-section__grid">
        {socialPlatforms.map((platform, index) => (
          <PlatformCard
            key={platform.id}
            platform={platform}
            index={index}
            isVisible={isVisible}
          />
        ))}
      </div>

      {/* Section Stats */}
      <div className="social-platforms-section__stats">
        <div className="social-platforms-section__stat">
          <span className="social-platforms-section__stat-value">
            {socialPlatforms
              .reduce((total, platform) => total + platform.followers, 0)
              .toLocaleString()}
          </span>
          <span className="social-platforms-section__stat-label">
            TOTAL FOLLOWERS
          </span>
        </div>
        <div className="social-platforms-section__stat">
          <span className="social-platforms-section__stat-value">
            {socialPlatforms
              .reduce((total, platform) => total + platform.stats.totalViews, 0)
              .toLocaleString()}
          </span>
          <span className="social-platforms-section__stat-label">
            TOTAL VIEWS
          </span>
        </div>
        <div className="social-platforms-section__stat">
          <span className="social-platforms-section__stat-value">
            {(
              socialPlatforms.reduce(
                (total, platform) => total + platform.stats.avgEngagement,
                0
              ) / socialPlatforms.length
            ).toFixed(1)}
            %
          </span>
          <span className="social-platforms-section__stat-label">
            AVG ENGAGEMENT
          </span>
        </div>
      </div>

      {/* Background Effects */}
      <div className="social-platforms-section__background">
        <div className="social-platforms-section__grid-pattern"></div>
        <div className="social-platforms-section__scan-lines"></div>
        <div className="social-platforms-section__particles"></div>
        <div className="social-platforms-section__glow"></div>
      </div>
    </section>
  );
};
