/**
 * Performance Dashboard Component
 * Real-time performance monitoring and metrics display
 */

"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import usePerformanceMonitor from "@/hooks/usePerformanceMonitor";
import { trackEvent } from "@/utils/analytics";

interface PerformanceDashboardProps {
  isVisible?: boolean;
  onClose?: () => void;
  className?: string;
}

const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  isVisible = false,
  onClose,
  className = "",
}) => {
  const { currentTheme } = useTheme();
  const {
    metrics,
    getPerformanceScore,
    getPerformanceStatus,
    exportPerformanceData,
    isMonitoring,
  } = usePerformanceMonitor();

  const [isExpanded, setIsExpanded] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (isVisible) {
      trackEvent({
        action: "performance_dashboard_open",
        category: "technical",
        label: "dashboard_interaction",
      });
    }
  }, [isVisible]);

  const performanceScore = getPerformanceScore();
  const performanceStatus = getPerformanceStatus();

  const getScoreColor = (score: number): string => {
    if (score >= 90)
      return currentTheme === "extreme-brutalist" ? "#00ff00" : "#10b981";
    if (score >= 75)
      return currentTheme === "extreme-brutalist" ? "#ffff00" : "#f59e0b";
    if (score >= 50)
      return currentTheme === "extreme-brutalist" ? "#ff8800" : "#ef4444";
    return currentTheme === "extreme-brutalist" ? "#ff0000" : "#dc2626";
  };

  const getMetricRating = (
    value: number | null,
    thresholds: { good: number; poor: number },
    isLowerBetter = true
  ): string => {
    if (value === null) return "N/A";

    if (isLowerBetter) {
      if (value <= thresholds.good) return "GOOD";
      if (value <= thresholds.poor) return "NEEDS IMPROVEMENT";
      return "POOR";
    } else {
      if (value >= thresholds.good) return "GOOD";
      if (value >= thresholds.poor) return "NEEDS IMPROVEMENT";
      return "POOR";
    }
  };

  const formatValue = (value: number | null, unit: string): string => {
    if (value === null) return "N/A";
    return `${Math.round(value)}${unit}`;
  };

  const handleExport = () => {
    exportPerformanceData();
    trackEvent({
      action: "performance_data_export",
      category: "technical",
      label: "data_export",
    });
  };

  const handleToggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
    trackEvent({
      action: "performance_auto_refresh_toggle",
      category: "technical",
      label: autoRefresh ? "disabled" : "enabled",
    });
  };

  if (!isVisible) return null;

  return (
    <div
      className={`performance-dashboard performance-dashboard--${currentTheme} ${className}`}
    >
      <div className="performance-dashboard__header">
        <div className="performance-dashboard__title">
          <span className="performance-dashboard__icon">⚡</span>
          <h3>PERFORMANCE MONITOR</h3>
          <div
            className={`performance-dashboard__status performance-dashboard__status--${performanceStatus}`}
          >
            {performanceStatus.toUpperCase()}
          </div>
        </div>

        <div className="performance-dashboard__controls">
          <button
            className="performance-dashboard__control"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? "▼" : "▲"}
          </button>

          <button
            className={`performance-dashboard__control ${autoRefresh ? "active" : ""}`}
            onClick={handleToggleAutoRefresh}
            title="Toggle Auto Refresh"
          >
            🔄
          </button>

          <button
            className="performance-dashboard__control"
            onClick={handleExport}
            title="Export Data"
          >
            📊
          </button>

          {onClose && (
            <button
              className="performance-dashboard__control performance-dashboard__close"
              onClick={onClose}
              title="Close Dashboard"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="performance-dashboard__score">
        <div
          className="performance-dashboard__score-circle"
          style={
            {
              "--score-color": getScoreColor(performanceScore),
            } as React.CSSProperties
          }
        >
          <span className="performance-dashboard__score-value">
            {performanceScore}
          </span>
          <span className="performance-dashboard__score-label">SCORE</span>
        </div>

        <div className="performance-dashboard__monitoring-status">
          <div
            className={`performance-dashboard__indicator ${isMonitoring ? "active" : ""}`}
          >
            <span className="performance-dashboard__indicator-dot"></span>
            {isMonitoring ? "MONITORING" : "INACTIVE"}
          </div>
          <div className="performance-dashboard__last-update">
            Last: {new Date(metrics.lastUpdate).toLocaleTimeString()}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="performance-dashboard__details">
          <div className="performance-dashboard__section">
            <h4 className="performance-dashboard__section-title">
              CORE WEB VITALS
            </h4>
            <div className="performance-dashboard__metrics">
              <div className="performance-dashboard__metric">
                <div className="performance-dashboard__metric-label">LCP</div>
                <div className="performance-dashboard__metric-value">
                  {formatValue(metrics.lcp, "ms")}
                </div>
                <div
                  className={`performance-dashboard__metric-rating performance-dashboard__metric-rating--${getMetricRating(metrics.lcp, { good: 2500, poor: 4000 }).toLowerCase().replace(" ", "-")}`}
                >
                  {getMetricRating(metrics.lcp, { good: 2500, poor: 4000 })}
                </div>
              </div>

              <div className="performance-dashboard__metric">
                <div className="performance-dashboard__metric-label">FID</div>
                <div className="performance-dashboard__metric-value">
                  {formatValue(metrics.fid, "ms")}
                </div>
                <div
                  className={`performance-dashboard__metric-rating performance-dashboard__metric-rating--${getMetricRating(metrics.fid, { good: 100, poor: 300 }).toLowerCase().replace(" ", "-")}`}
                >
                  {getMetricRating(metrics.fid, { good: 100, poor: 300 })}
                </div>
              </div>

              <div className="performance-dashboard__metric">
                <div className="performance-dashboard__metric-label">CLS</div>
                <div className="performance-dashboard__metric-value">
                  {metrics.cls !== null ? metrics.cls.toFixed(3) : "N/A"}
                </div>
                <div
                  className={`performance-dashboard__metric-rating performance-dashboard__metric-rating--${getMetricRating(metrics.cls, { good: 0.1, poor: 0.25 }).toLowerCase().replace(" ", "-")}`}
                >
                  {getMetricRating(metrics.cls, { good: 0.1, poor: 0.25 })}
                </div>
              </div>

              <div className="performance-dashboard__metric">
                <div className="performance-dashboard__metric-label">FCP</div>
                <div className="performance-dashboard__metric-value">
                  {formatValue(metrics.fcp, "ms")}
                </div>
                <div
                  className={`performance-dashboard__metric-rating performance-dashboard__metric-rating--${getMetricRating(metrics.fcp, { good: 1800, poor: 3000 }).toLowerCase().replace(" ", "-")}`}
                >
                  {getMetricRating(metrics.fcp, { good: 1800, poor: 3000 })}
                </div>
              </div>

              <div className="performance-dashboard__metric">
                <div className="performance-dashboard__metric-label">TTFB</div>
                <div className="performance-dashboard__metric-value">
                  {formatValue(metrics.ttfb, "ms")}
                </div>
                <div
                  className={`performance-dashboard__metric-rating performance-dashboard__metric-rating--${getMetricRating(metrics.ttfb, { good: 800, poor: 1800 }).toLowerCase().replace(" ", "-")}`}
                >
                  {getMetricRating(metrics.ttfb, { good: 800, poor: 1800 })}
                </div>
              </div>
            </div>
          </div>

          <div className="performance-dashboard__section">
            <h4 className="performance-dashboard__section-title">
              CUSTOM METRICS
            </h4>
            <div className="performance-dashboard__metrics">
              <div className="performance-dashboard__metric">
                <div className="performance-dashboard__metric-label">FPS</div>
                <div className="performance-dashboard__metric-value">
                  {formatValue(metrics.animationFrameRate, "")}
                </div>
                <div
                  className={`performance-dashboard__metric-rating performance-dashboard__metric-rating--${getMetricRating(metrics.animationFrameRate, { good: 60, poor: 30 }, false).toLowerCase().replace(" ", "-")}`}
                >
                  {getMetricRating(
                    metrics.animationFrameRate,
                    { good: 60, poor: 30 },
                    false
                  )}
                </div>
              </div>

              <div className="performance-dashboard__metric">
                <div className="performance-dashboard__metric-label">
                  Memory
                </div>
                <div className="performance-dashboard__metric-value">
                  {formatValue(metrics.memoryUsage, "MB")}
                </div>
                <div
                  className={`performance-dashboard__metric-rating performance-dashboard__metric-rating--${getMetricRating(metrics.memoryUsage, { good: 50, poor: 100 }).toLowerCase().replace(" ", "-")}`}
                >
                  {getMetricRating(metrics.memoryUsage, {
                    good: 50,
                    poor: 100,
                  })}
                </div>
              </div>

              <div className="performance-dashboard__metric">
                <div className="performance-dashboard__metric-label">
                  Theme Transition
                </div>
                <div className="performance-dashboard__metric-value">
                  {formatValue(metrics.themeTransitionTime, "ms")}
                </div>
                <div
                  className={`performance-dashboard__metric-rating performance-dashboard__metric-rating--${getMetricRating(metrics.themeTransitionTime, { good: 600, poor: 1000 }).toLowerCase().replace(" ", "-")}`}
                >
                  {getMetricRating(metrics.themeTransitionTime, {
                    good: 600,
                    poor: 1000,
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .performance-dashboard {
          position: fixed;
          top: 20px;
          right: 20px;
          width: 320px;
          background: var(--bg-primary);
          border: var(--border-brutal);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-brutal);
          font-family: var(--font-mono);
          font-size: 12px;
          z-index: 9999;
          max-height: 80vh;
          overflow-y: auto;
        }

        .performance-dashboard--extreme-brutalist {
          --bg-primary: #000000;
          --text-primary: #ffffff;
          --text-secondary: #ffff00;
          --border-brutal: 4px solid #ffffff;
          --border-radius: 0;
          --shadow-brutal: 8px 8px 0 #ffff00;
          --font-mono: "JetBrains Mono", monospace;
        }

        .performance-dashboard--refined-brutalist {
          --bg-primary: #1a1a1a;
          --text-primary: #f5f5f5;
          --text-secondary: #8b5cf6;
          --border-brutal: 2px solid #8b5cf6;
          --border-radius: 8px;
          --shadow-brutal: 0 10px 30px rgba(0, 0, 0, 0.3);
          --font-mono: "JetBrains Mono", monospace;
        }

        .performance-dashboard__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 2px solid var(--text-secondary);
        }

        .performance-dashboard__title {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-primary);
          font-weight: bold;
        }

        .performance-dashboard__title h3 {
          margin: 0;
          font-size: 14px;
        }

        .performance-dashboard__icon {
          font-size: 16px;
        }

        .performance-dashboard__status {
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: bold;
        }

        .performance-dashboard__status--excellent {
          background: #00ff00;
          color: #000000;
        }

        .performance-dashboard__status--good {
          background: #ffff00;
          color: #000000;
        }

        .performance-dashboard__status--needs-improvement {
          background: #ff8800;
          color: #000000;
        }

        .performance-dashboard__status--poor {
          background: #ff0000;
          color: #ffffff;
        }

        .performance-dashboard__controls {
          display: flex;
          gap: 4px;
        }

        .performance-dashboard__control {
          background: transparent;
          border: 1px solid var(--text-secondary);
          color: var(--text-primary);
          padding: 4px 8px;
          cursor: pointer;
          border-radius: var(--border-radius);
          font-size: 12px;
          transition: all 0.2s ease;
        }

        .performance-dashboard__control:hover,
        .performance-dashboard__control.active {
          background: var(--text-secondary);
          color: var(--bg-primary);
        }

        .performance-dashboard__close {
          border-color: #ff0000 !important;
          color: #ff0000 !important;
        }

        .performance-dashboard__close:hover {
          background: #ff0000 !important;
          color: #ffffff !important;
        }

        .performance-dashboard__score {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
        }

        .performance-dashboard__score-circle {
          width: 80px;
          height: 80px;
          border: 4px solid var(--score-color);
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .performance-dashboard__score-value {
          font-size: 24px;
          font-weight: bold;
          color: var(--score-color);
        }

        .performance-dashboard__score-label {
          font-size: 10px;
          color: var(--text-secondary);
        }

        .performance-dashboard__monitoring-status {
          text-align: right;
        }

        .performance-dashboard__indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-secondary);
          margin-bottom: 4px;
        }

        .performance-dashboard__indicator.active {
          color: #00ff00;
        }

        .performance-dashboard__indicator-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: currentColor;
          animation: pulse 2s infinite;
        }

        .performance-dashboard__last-update {
          font-size: 10px;
          color: var(--text-secondary);
          opacity: 0.7;
        }

        .performance-dashboard__details {
          border-top: 2px solid var(--text-secondary);
        }

        .performance-dashboard__section {
          padding: 12px 16px;
          border-bottom: 1px solid var(--text-secondary);
        }

        .performance-dashboard__section:last-child {
          border-bottom: none;
        }

        .performance-dashboard__section-title {
          margin: 0 0 8px 0;
          font-size: 12px;
          color: var(--text-secondary);
          font-weight: bold;
        }

        .performance-dashboard__metrics {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .performance-dashboard__metric {
          text-align: center;
        }

        .performance-dashboard__metric-label {
          font-size: 10px;
          color: var(--text-secondary);
          margin-bottom: 2px;
        }

        .performance-dashboard__metric-value {
          font-size: 14px;
          font-weight: bold;
          color: var(--text-primary);
          margin-bottom: 2px;
        }

        .performance-dashboard__metric-rating {
          font-size: 8px;
          padding: 1px 4px;
          border-radius: 2px;
          font-weight: bold;
        }

        .performance-dashboard__metric-rating--good {
          background: #00ff00;
          color: #000000;
        }

        .performance-dashboard__metric-rating--needs-improvement {
          background: #ffff00;
          color: #000000;
        }

        .performance-dashboard__metric-rating--poor {
          background: #ff0000;
          color: #ffffff;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @media (max-width: 768px) {
          .performance-dashboard {
            width: 280px;
            top: 10px;
            right: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default PerformanceDashboard;
