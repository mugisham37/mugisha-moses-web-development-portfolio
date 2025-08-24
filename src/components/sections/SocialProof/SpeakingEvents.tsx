"use client";

import React, { useRef } from "react";
import { useTheme, useThemeClassName } from "@/hooks/useTheme";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { portfolioData } from "@/data/portfolio";

interface SpeakingEventsProps {
  className?: string;
}

export const SpeakingEvents: React.FC<SpeakingEventsProps> = ({
  className = "",
}) => {
  const { currentTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
          </h3>
          <p className="speaking-events__subtitle">
            Sharing knowledge and insights with the developer community
          </p>
        </div>

        <div
          className={`speaking-events__timeline ${
            isVisible ? "speaking-events__timeline--visible" : ""
          }`}
        >
          {speakingEvents.map((event, index) => (
            <div
              key={event.id}
              className="speaking-events__event"
              style={{
                animationDelay: `${index * 150}ms`,
              }}
            >
              <div className="speaking-events__event-marker">
                <div className="speaking-events__event-icon">
                  {getEventIcon(event.type)}
                </div>
                <div className="speaking-events__event-line"></div>
              </div>

              <div className="speaking-events__event-content">
                <div className="speaking-events__event-header">
                  <div className="speaking-events__event-meta">
                    <span className="speaking-events__event-date">
                      {formatDate(event.date)}
                    </span>
                    <span className="speaking-events__event-type">
                      {event.type.toUpperCase()}
                    </span>
                  </div>
                  <div className="speaking-events__event-audience">
                    <span className="speaking-events__audience-icon">👥</span>
                    <span className="speaking-events__audience-count">
                      {event.audience.toLocaleString()}
                    </span>
                  </div>
                </div>

                <h4 className="speaking-events__event-title">{event.title}</h4>
                <div className="speaking-events__event-details">
                  <span className="speaking-events__event-name">
                    {event.event}
                  </span>
                  <span className="speaking-events__event-location">
                    📍 {event.location}
                  </span>
                </div>

                <p className="speaking-events__event-description">
                  {event.description}
                </p>

                <div className="speaking-events__event-links">
                  {event.recording && (
                    <a
                      href={event.recording}
                      className="speaking-events__event-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="speaking-events__link-icon">🎥</span>
                      <span>Watch Recording</span>
                    </a>
                  )}
                  {event.slides && (
                    <a
                      href={event.slides}
                      className="speaking-events__event-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="speaking-events__link-icon">📊</span>
                      <span>View Slides</span>
                    </a>
                  )}
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
              className="speaking-events__publication"
              style={{
                animationDelay: `${(index + speakingEvents.length) * 150}ms`,
              }}
            >
              <div className="speaking-events__publication-header">
                <div className="speaking-events__publication-icon">
                  {getPublicationIcon(publication.type)}
                </div>
                <div className="speaking-events__publication-meta">
                  <span className="speaking-events__publication-platform">
                    {publication.platform}
                  </span>
                  <span className="speaking-events__publication-date">
                    {formatDate(publication.date)}
                  </span>
                  <span className="speaking-events__publication-type">
                    {publication.type.replace("-", " ").toUpperCase()}
                  </span>
                </div>
              </div>

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
                    {publication.readTime} min read
                  </span>
                </div>
                <div className="speaking-events__publication-stat">
                  <span className="speaking-events__stat-icon">👀</span>
                  <span className="speaking-events__stat-value">
                    {publication.views.toLocaleString()} views
                  </span>
                </div>
                <div className="speaking-events__publication-stat">
                  <span className="speaking-events__stat-icon">🔄</span>
                  <span className="speaking-events__stat-value">
                    {publication.shares} shares
                  </span>
                </div>
              </div>

              <div className="speaking-events__publication-effects">
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
