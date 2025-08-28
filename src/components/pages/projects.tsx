"use client";

import React, { useState } from "react";
import { useThemeContext } from "@/contexts/ThemeContext";
import { portfolioData } from "@/data/portfolio";

interface ResourcesProps {
  className?: string;
}

export const Resources: React.FC<ResourcesProps> = ({ className = "" }) => {
  const { currentTheme } = useThemeContext();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const resources = portfolioData.resources.downloads;

  const filteredResources = resources.filter((resource) => {
    if (filter === "all") return true;
    return resource.type === filter;
  });

  const resourceTypes = [
    { value: "all", label: "All Resources" },
    { value: "guide", label: "Guides" },
    { value: "template", label: "Templates" },
    { value: "toolkit", label: "Toolkits" },
    { value: "checklist", label: "Checklists" },
    { value: "whitepaper", label: "Whitepapers" },
  ];

  const handleDownload = async (resource: (typeof resources)[0]) => {
    setDownloadingId(resource.id);

    // Simulate download tracking
    try {
      // In a real app, you would track the download here
      console.log(`Downloading resource: ${resource.title}`);

      // Simulate download delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real app, you would trigger the actual download here
      // window.open(resource.downloadUrl, '_blank');
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setDownloadingId(null);
    }
  };

  const formatDownloadCount = (count: number): string => {
    if (count >= 10000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toLocaleString();
  };

  const getFormatIcon = (format: string): string => {
    switch (format) {
      case "pdf":
        return "📄";
      case "zip":
        return "📦";
      case "figma":
        return "🎨";
      case "notion":
        return "📝";
      default:
        return "📁";
    }
  };

  const getTypeColor = (type: string): string => {
    switch (type) {
      case "guide":
        return currentTheme === "extreme-brutalist" ? "#ffff00" : "#8b5cf6";
      case "template":
        return currentTheme === "extreme-brutalist" ? "#00ffff" : "#06b6d4";
      case "toolkit":
        return currentTheme === "extreme-brutalist" ? "#00ff00" : "#10b981";
      case "checklist":
        return currentTheme === "extreme-brutalist" ? "#ff00ff" : "#f59e0b";
      case "whitepaper":
        return currentTheme === "extreme-brutalist" ? "#ff6600" : "#ef4444";
      default:
        return currentTheme === "extreme-brutalist" ? "#ffffff" : "#6b7280";
    }
  };

  const resourcesClasses = [
    "resources-section",
    `resources-section--${currentTheme}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={resourcesClasses}>
      <div className="resources-section__container">
        {/* Section Header */}
        <div className="resources-section__header">
          <div className="resources-section__title-group">
            <h2 className="resources-section__title">
              <span className="resources-section__title-main">
                FREE RESOURCES
              </span>
              <span className="resources-section__title-sub">
                Download premium development resources
              </span>
            </h2>
            <div className="resources-section__terminal-line">
              <span className="resources-section__prompt">$</span>
              <span className="resources-section__command">
                download --premium-resources --free
              </span>
              <span className="resources-section__cursor"></span>
            </div>
          </div>

          {/* Resource Type Filter */}
          <div className="resources-section__filters">
            {resourceTypes.map((type) => (
              <button
                key={type.value}
                className={`resources-section__filter ${
                  filter === type.value
                    ? "resources-section__filter--active"
                    : ""
                }`}
                onClick={() => setFilter(type.value)}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        <div className="resources-section__grid">
          {filteredResources.map((resource, index) => (
            <div
              key={resource.id}
              className="resource-card"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Resource Preview */}
              <div className="resource-card__preview">
                <div className="resource-card__preview-image">
                  <div className="resource-card__format-badge">
                    <span className="resource-card__format-icon">
                      {getFormatIcon(resource.format)}
                    </span>
                    <span className="resource-card__format-text">
                      {resource.format.toUpperCase()}
                    </span>
                  </div>
                  <div className="resource-card__preview-overlay">
                    <div className="resource-card__preview-icon">📁</div>
                  </div>
                </div>

                {/* Type Badge */}
                <div
                  className="resource-card__type-badge"
                  style={{
                    backgroundColor: getTypeColor(resource.type),
                    color:
                      currentTheme === "extreme-brutalist"
                        ? "#000000"
                        : "#ffffff",
                  }}
                >
                  {resource.type.toUpperCase()}
                </div>
              </div>

              {/* Resource Content */}
              <div className="resource-card__content">
                <h3 className="resource-card__title">{resource.title}</h3>
                <p className="resource-card__description">
                  {resource.description}
                </p>

                {/* Resource Stats */}
                <div className="resource-card__stats">
                  <div className="resource-card__stat">
                    <span className="resource-card__stat-icon">⭐</span>
                    <span className="resource-card__stat-value">
                      {resource.rating}
                    </span>
                  </div>
                  <div className="resource-card__stat">
                    <span className="resource-card__stat-icon">📥</span>
                    <span className="resource-card__stat-value">
                      {formatDownloadCount(resource.downloadCount)}
                    </span>
                  </div>
                  <div className="resource-card__stat">
                    <span className="resource-card__stat-icon">💾</span>
                    <span className="resource-card__stat-value">
                      {resource.size}
                    </span>
                  </div>
                </div>

                {/* Resource Tags */}
                <div className="resource-card__tags">
                  {resource.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="resource-card__tag">
                      {tag}
                    </span>
                  ))}
                  {resource.tags.length > 3 && (
                    <span className="resource-card__tag resource-card__tag--more">
                      +{resource.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Download Button */}
                <button
                  className={`resource-card__download-btn ${
                    downloadingId === resource.id
                      ? "resource-card__download-btn--downloading"
                      : ""
                  }`}
                  onClick={() => handleDownload(resource)}
                  disabled={downloadingId === resource.id}
                >
                  <span className="resource-card__download-icon">
                    {downloadingId === resource.id ? "⏳" : "⬇️"}
                  </span>
                  <span className="resource-card__download-text">
                    {downloadingId === resource.id
                      ? "DOWNLOADING..."
                      : "DOWNLOAD FREE"}
                  </span>
                  <div className="resource-card__download-effects">
                    <div className="resource-card__download-shimmer"></div>
                    <div className="resource-card__download-border"></div>
                  </div>
                </button>

                {/* Last Updated */}
                <div className="resource-card__updated">
                  Updated: {new Date(resource.lastUpdated).toLocaleDateString()}
                </div>
              </div>

              {/* Card Effects */}
              <div className="resource-card__effects">
                <div className="resource-card__border-top"></div>
                <div className="resource-card__border-right"></div>
                <div className="resource-card__border-bottom"></div>
                <div className="resource-card__border-left"></div>
                <div className="resource-card__shadow"></div>
                <div className="resource-card__glow"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Section Stats */}
        <div className="resources-section__stats">
          <div className="resources-section__stat">
            <span className="resources-section__stat-value">
              {resources
                .reduce((total, resource) => total + resource.downloadCount, 0)
                .toLocaleString()}
            </span>
            <span className="resources-section__stat-label">
              Total Downloads
            </span>
          </div>
          <div className="resources-section__stat">
            <span className="resources-section__stat-value">
              {resources.length}
            </span>
            <span className="resources-section__stat-label">
              Free Resources
            </span>
          </div>
          <div className="resources-section__stat">
            <span className="resources-section__stat-value">
              {(
                resources.reduce(
                  (total, resource) => total + resource.rating,
                  0
                ) / resources.length
              ).toFixed(1)}
            </span>
            <span className="resources-section__stat-label">
              Average Rating
            </span>
          </div>
        </div>
      </div>

      {/* Background Effects */}
      <div className="resources-section__background">
        <div className="resources-section__particles"></div>
        <div className="resources-section__grid-overlay"></div>
        <div className="resources-section__scan-lines"></div>
      </div>
    </section>
  );
};
