"use client";

import React, { useRef, useState } from "react";
import { useThemeClassName } from "@/hooks/useTheme";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { portfolioData } from "@/data/portfolio";

interface SpeakingEventsProps {
  className?: string;
}

export const SpeakingEvents: React.FC<SpeakingEventsProps> = ({
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);
  const [hoveredPublication, setHoveredPublication] = useState<string | null>(
    null
  );

  const isVisible = useIntersectionObserver(containerRef, {
    threshold: 0.3,
    triggerOnce: true,
  });

  const containerClassName = useThemeClassName("speaking-events", {
    "extreme-brutalist": "speaking-events--extreme",
    "refined-brutalist": "speaking-events--refined",
  });

  const { speakingEvents, publications } = portfolioData.socialProof;

  const getEventIcon = (type: string) => {
    switch (type) {
      case "conference":
        return "🎤";
      case "meetup":
        return "👥";
      case "workshop":
        return "🛠️";
      case "podcast":
        return "🎧";
      default:
        return "📢";
    }
  };

  const getEventLogo = (eventName: string) => {
    // Map event names to logos - in a real app, these would be actual logo URLs
    const logoMap: { [key: string]: string } = {
      "React Conference 2024": "⚛️",
      "JavaScript Meetup NYC": "🟨",
      "Developer Insights Podcast": "🎙️",
    };
    return logoMap[eventName] || "🎯";
  };

  const getPublicationIcon = (type: string) => {
    switch (type) {
      case "article":
        return "📝";
      case "tutorial":
        return "📚";
      case "case-study":
        return "📊";
      case "whitepaper":
        return "📄";
      default:
        return "✍️";
    }
  };

  const getPlatformLogo = (platform: string) => {
    const logoMap: { [key: string]: string } = {
      "Dev.to": "🌐",
      Medium: "📖",
      "CSS-Tricks": "🎨",
    };
    return logoMap[platform] || "📄";
  };

  const formatDate = (dateString: string) => {
    // Use a deterministic date formatting to avoid hydration issues
    const date = new Date(dateString + "T00:00:00.000Z"); // Force UTC to avoid timezone issues
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${months[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
  };

  const formatEngagementStats = (audience: number) => {
    if (audience >= 1000) {
      return `${(audience / 1000).toFixed(1)}K`;
    }
    return audience.toString();
  };

  return (
    <div
      ref={containerRef}
      className={`${containerClassName} ${className}`}
      id="speaking-events"
    >
      {/* Speaking Events Section */}
      <div className="speaking-events__section">
        <div className="speaking-events__header">
          <h3 className="speaking-events__title">
            <span className="speaking-events__title-icon">🎯</span>
            <span className="speaking-events__title-text">
              Speaking & Events
            </span>
            <div className="speaking-events__title-effects">
              <div className="speaking-events__title-border"></div>
              <div className="speaking-events__title-shadow"></div>
            </div>
          </h3>
          <p className="speaking-events__subtitle">
            Sharing knowledge and insights with the developer community
          </p>
        </div>

        <div
          ref={timelineRef}
          className={`speaking-events__timeline ${
            isVisible ? "speaking-events__timeline--visible" : ""
          }`}
        >
          <div className="speaking-events__timeline-line"></div>

          {speakingEvents.map((event, index) => (
            <div
              key={event.id}
              className={`speaking-events__event ${
                hoveredEvent === event.id
                  ? "speaking-events__event--hovered"
                  : ""
              }`}
              style={{
                animationDelay: `${index * 200}ms`,
              }}
              onMouseEnter={() => setHoveredEvent(event.id)}
              onMouseLeave={() => setHoveredEvent(null)}
            >
              <div className="speaking-events__event-marker">
                <div className="speaking-events__event-icon">
                  {getEventIcon(event.type)}
                </div>
                <div className="speaking-events__event-pulse"></div>
              </div>

              <div className="speaking-events__event-card">
                <div className="speaking-events__event-header">
                  <div className="speaking-events__event-logo">
                    <span className="speaking-events__logo-icon">
                      {getEventLogo(event.event)}
                    </span>
                    <div className="speaking-events__logo-glow"></div>
                  </div>

                  <div className="speaking-events__event-meta">
                    <div className="speaking-events__event-date">
                      <span className="speaking-events__date-icon">📅</span>
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="speaking-events__event-type">
                      {event.type.toUpperCase()}
                    </div>
                  </div>

                  <div className="speaking-events__event-metrics">
                    <div className="speaking-events__metric">
                      <span className="speaking-events__metric-icon">👥</span>
                      <span className="speaking-events__metric-value">
                        {formatEngagementStats(event.audience)}
                      </span>
                      <span className="speaking-events__metric-label">
                        audience
                      </span>
                    </div>
                  </div>
                </div>

                <div className="speaking-events__event-content">
                  <h4 className="speaking-events__event-title">
                    {event.title}
                  </h4>

                  <div className="speaking-events__event-details">
                    <div className="speaking-events__event-name">
                      <span className="speaking-events__detail-icon">🎪</span>
                      <span>{event.event}</span>
                    </div>
                    <div className="speaking-events__event-location">
                      <span className="speaking-events__detail-icon">📍</span>
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <p className="speaking-events__event-description">
                    {event.description}
                  </p>

                  <div className="speaking-events__event-actions">
                    {event.recording && (
                      <a
                        href={event.recording}
                        className="speaking-events__action-link speaking-events__action-link--primary"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="speaking-events__action-icon">🎥</span>
                        <span>Watch Recording</span>
                        <div className="speaking-events__action-shimmer"></div>
                      </a>
                    )}
                    {event.slides && (
                      <a
                        href={event.slides}
                        className="speaking-events__action-link speaking-events__action-link--secondary"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="speaking-events__action-icon">📊</span>
                        <span>View Slides</span>
                        <div className="speaking-events__action-shimmer"></div>
                      </a>
                    )}
                  </div>
                </div>

                <div className="speaking-events__event-effects">
                  <div className="speaking-events__event-border"></div>
                  <div className="speaking-events__event-shadow"></div>
                  <div className="speaking-events__event-glow"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Publications Section */}
      <div className="speaking-events__section">
        <div className="speaking-events__header">
          <h3 className="speaking-events__title">
            <span className="speaking-events__title-icon">📚</span>
            <span className="speaking-events__title-text">
              Publications & Articles
            </span>
            <div className="speaking-events__title-effects">
              <div className="speaking-events__title-border"></div>
              <div className="speaking-events__title-shadow"></div>
            </div>
          </h3>
          <p className="speaking-events__subtitle">
            Technical writing and thought leadership in web development
          </p>
        </div>

        <div
          className={`speaking-events__publications ${
            isVisible ? "speaking-events__publications--visible" : ""
          }`}
        >
          {publications.map((publication, index) => (
            <article
              key={publication.id}
              className={`speaking-events__publication ${
                hoveredPublication === publication.id
                  ? "speaking-events__publication--hovered"
                  : ""
              }`}
              style={{
                animationDelay: `${(index + speakingEvents.length) * 150}ms`,
              }}
              onMouseEnter={() => setHoveredPublication(publication.id)}
              onMouseLeave={() => setHoveredPublication(null)}
            >
              <div className="speaking-events__publication-header">
                <div className="speaking-events__publication-logo">
                  <span className="speaking-events__platform-logo">
                    {getPlatformLogo(publication.platform)}
                  </span>
                  <div className="speaking-events__platform-glow"></div>
                </div>

                <div className="speaking-events__publication-meta">
                  <div className="speaking-events__publication-platform">
                    {publication.platform}
                  </div>
                  <div className="speaking-events__publication-date">
                    {formatDate(publication.date)}
                  </div>
                  <div className="speaking-events__publication-type">
                    <span className="speaking-events__type-icon">
                      {getPublicationIcon(publication.type)}
                    </span>
                    <span>
                      {publication.type.replace("-", " ").toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="speaking-events__publication-content">
                <h4 className="speaking-events__publication-title">
                  <a
                    href={publication.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="speaking-events__publication-link"
                  >
                    {publication.title}
                  </a>
                </h4>

                <p className="speaking-events__publication-description">
                  {publication.description}
                </p>

                <div className="speaking-events__publication-stats">
                  <div className="speaking-events__publication-stat">
                    <span className="speaking-events__stat-icon">⏱️</span>
                    <span className="speaking-events__stat-value">
                      {publication.readTime}
                    </span>
                    <span className="speaking-events__stat-label">
                      min read
                    </span>
                  </div>
                  <div className="speaking-events__publication-stat">
                    <span className="speaking-events__stat-icon">👀</span>
                    <span className="speaking-events__stat-value">
                      {(publication.views / 1000).toFixed(1)}K
                    </span>
                    <span className="speaking-events__stat-label">views</span>
                  </div>
                  <div className="speaking-events__publication-stat">
                    <span className="speaking-events__stat-icon">🔄</span>
                    <span className="speaking-events__stat-value">
                      {publication.shares}
                    </span>
                    <span className="speaking-events__stat-label">shares</span>
                  </div>
                  <div className="speaking-events__publication-stat">
                    <span className="speaking-events__stat-icon">💬</span>
                    <span className="speaking-events__stat-value">
                      {Math.floor(publication.views / 100)}
                    </span>
                    <span className="speaking-events__stat-label">
                      comments
                    </span>
                  </div>
                </div>
              </div>

              <div className="speaking-events__publication-effects">
                <div className="speaking-events__publication-border"></div>
                <div className="speaking-events__publication-shadow"></div>
                <div className="speaking-events__publication-shimmer"></div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpeakingEvents;
