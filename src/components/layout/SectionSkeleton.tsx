"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";

interface SectionSkeletonProps {
  variant?:
    | "social-proof"
    | "results"
    | "footer"
    | "form"
    | "dashboard"
    | "timeline";
  className?: string;
}

const SectionSkeleton: React.FC<SectionSkeletonProps> = ({
  variant = "social-proof",
  className = "",
}) => {
  const { currentTheme } = useTheme();

  const shimmerAnimation = {
    x: ["-100%", "100%"],
  };

  const shimmerTransition = {
    duration: 1.5,
    repeat: Infinity,
    ease: "easeInOut",
  };

  const renderSkeletonContent = () => {
    switch (variant) {
      case "social-proof":
        return (
          <div className="skeleton-social-proof">
            <div className="skeleton-header">
              <div className="skeleton-title" />
              <div className="skeleton-subtitle" />
            </div>
            <div className="skeleton-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-avatar" />
                  <div className="skeleton-content">
                    <div className="skeleton-line" />
                    <div className="skeleton-line short" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "results":
        return (
          <div className="skeleton-results">
            <div className="skeleton-header">
              <div className="skeleton-title large" />
              <div className="skeleton-subtitle" />
            </div>
            <div className="skeleton-metrics">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton-metric">
                  <div className="skeleton-number" />
                  <div className="skeleton-label" />
                </div>
              ))}
            </div>
            <div className="skeleton-comparison">
              <div className="skeleton-before">
                <div className="skeleton-card-header" />
                <div className="skeleton-card-body" />
              </div>
              <div className="skeleton-arrow" />
              <div className="skeleton-after">
                <div className="skeleton-card-header" />
                <div className="skeleton-card-body" />
              </div>
            </div>
          </div>
        );

      case "footer":
        return (
          <div className="skeleton-footer">
            <div className="skeleton-cta">
              <div className="skeleton-title large" />
              <div className="skeleton-buttons">
                <div className="skeleton-button primary" />
                <div className="skeleton-button secondary" />
              </div>
            </div>
            <div className="skeleton-footer-content">
              <div className="skeleton-column">
                <div className="skeleton-column-title" />
                <div className="skeleton-links" />
              </div>
              <div className="skeleton-column">
                <div className="skeleton-column-title" />
                <div className="skeleton-links" />
              </div>
              <div className="skeleton-column">
                <div className="skeleton-column-title" />
                <div className="skeleton-links" />
              </div>
            </div>
          </div>
        );

      case "form":
        return (
          <div className="skeleton-form">
            <div className="skeleton-form-header">
              <div className="skeleton-title" />
              <div className="skeleton-subtitle" />
            </div>
            <div className="skeleton-form-fields">
              <div className="skeleton-input" />
              <div className="skeleton-input" />
              <div className="skeleton-textarea" />
              <div className="skeleton-button primary" />
            </div>
          </div>
        );

      case "dashboard":
        return (
          <div className="skeleton-dashboard">
            <div className="skeleton-dashboard-header">
              <div className="skeleton-title" />
              <div className="skeleton-filters" />
            </div>
            <div className="skeleton-charts">
              <div className="skeleton-chart large" />
              <div className="skeleton-chart-grid">
                <div className="skeleton-chart small" />
                <div className="skeleton-chart small" />
                <div className="skeleton-chart small" />
                <div className="skeleton-chart small" />
              </div>
            </div>
          </div>
        );

      case "timeline":
        return (
          <div className="skeleton-timeline">
            <div className="skeleton-timeline-header">
              <div className="skeleton-title" />
            </div>
            <div className="skeleton-timeline-content">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton-timeline-item">
                  <div className="skeleton-timeline-marker" />
                  <div className="skeleton-timeline-content">
                    <div className="skeleton-timeline-title" />
                    <div className="skeleton-timeline-description" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="skeleton-default">
            <div className="skeleton-header" />
            <div className="skeleton-body">
              <div className="skeleton-line" />
              <div className="skeleton-line" />
              <div className="skeleton-line short" />
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className={`section-skeleton section-skeleton--${variant} section-skeleton--${currentTheme} ${className}`}
    >
      <div className="skeleton-container">
        <motion.div
          className="skeleton-shimmer"
          animate={shimmerAnimation}
          transition={shimmerTransition}
        />
        {renderSkeletonContent()}
      </div>
    </div>
  );
};

export default SectionSkeleton;
