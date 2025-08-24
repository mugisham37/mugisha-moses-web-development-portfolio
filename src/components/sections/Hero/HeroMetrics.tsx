"use client";

import React, { useRef } from "react";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { portfolioData } from "@/data/portfolio";

interface HeroMetricsProps {
  className?: string;
}

export const HeroMetrics: React.FC<HeroMetricsProps> = ({ className = "" }) => {
  const { currentTheme, config } = useThemeContext();
  const metricsRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(metricsRef, {
    threshold: 0.3,
    rootMargin: "0px",
    triggerOnce: true,
  });

  const { metrics } = portfolioData.hero;

  // Format value based on type
  const formatValue = (value: number, format?: string) => {
    switch (format) {
      case "currency":
        return `$${value}M`;
      case "percentage":
        return `${value}%`;
      case "number":
      default:
        return value.toString();
    }
  };

  return (
    <div
      ref={metricsRef}
      className={`hero-metrics hero-metrics--${currentTheme} ${className}`}
      style={
        {
          "--metrics-text": config.colors.text,
          "--metrics-accent": config.colors.accent,
          "--metrics-highlight": config.colors.highlight,
          "--metrics-bg": config.colors.bg,
          "--metrics-font-primary": config.typography.primary,
          "--metrics-font-code": config.typography.code,
          "--metrics-border-width": config.borders.width,
          "--metrics-border-radius": config.borders.radius,
          "--metrics-animation-duration": config.animations.duration,
          "--metrics-animation-easing": config.animations.easing,
        } as React.CSSProperties
      }
    >
      <div className="hero-metrics__grid">
        {metrics.map((metric: (typeof metrics)[0], index: number) => (
          <MetricCard
            key={index}
            metric={metric}
            index={index}
            isVisible={isVisible}
            theme={currentTheme}
          />
        ))}
      </div>

      {/* Terminal-style metrics header */}
      <div className="hero-metrics__header" aria-hidden="true">
        <span className="hero-metrics__header-text">
          PERFORMANCE_METRICS.exe
        </span>
        <div className="hero-metrics__header-indicator">
          <div className="hero-metrics__header-pulse"></div>
        </div>
      </div>
    </div>
  );
};

interface MetricCardProps {
  metric: {
    value: number | string;
    label: string;
    format?: "number" | "currency" | "percentage";
  };
  index: number;
  isVisible: boolean;
  theme: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  metric,
  index,
  isVisible,
  theme,
}) => {
  const numericValue =
    typeof metric.value === "string" ? parseFloat(metric.value) : metric.value;

  const { count, ref } = useAnimatedCounter({
    end: numericValue,
    start: 0,
    duration: 2000 + index * 300, // Stagger animation
    easing: (t: number) => 1 - Math.pow(1 - t, 3), // easeOutCubic
    formatValue: (value: number) => {
      switch (metric.format) {
        case "currency":
          return `$${value.toFixed(1)}M`;
        case "percentage":
          return `${value.toFixed(1)}%`;
        case "number":
        default:
          return Math.floor(value).toString();
      }
    },
  });

  return (
    <div
      ref={ref}
      className={`hero-metrics__card hero-metrics__card--${theme}`}
      style={{
        animationDelay: `${index * 150}ms`,
      }}
    >
      {/* Card Background Effects */}
      <div className="hero-metrics__card-bg" aria-hidden="true">
        <div className="hero-metrics__card-pattern"></div>
        <div className="hero-metrics__card-glow"></div>
      </div>

      {/* Metric Value */}
      <div className="hero-metrics__value">
        <span className="hero-metrics__value-text">{count}</span>
        <div className="hero-metrics__value-underline" aria-hidden="true"></div>
      </div>

      {/* Metric Label */}
      <div className="hero-metrics__label">
        <span className="hero-metrics__label-text">{metric.label}</span>
      </div>

      {/* Card Border Effects */}
      <div className="hero-metrics__card-effects" aria-hidden="true">
        <div className="hero-metrics__card-border-top"></div>
        <div className="hero-metrics__card-border-right"></div>
        <div className="hero-metrics__card-border-bottom"></div>
        <div className="hero-metrics__card-border-left"></div>
        <div className="hero-metrics__card-corner hero-metrics__card-corner--tl"></div>
        <div className="hero-metrics__card-corner hero-metrics__card-corner--tr"></div>
        <div className="hero-metrics__card-corner hero-metrics__card-corner--bl"></div>
        <div className="hero-metrics__card-corner hero-metrics__card-corner--br"></div>
      </div>

      {/* Hover Effects */}
      <div className="hero-metrics__hover-effects" aria-hidden="true">
        <div className="hero-metrics__hover-shadow"></div>
        <div className="hero-metrics__hover-glow"></div>
        <div className="hero-metrics__hover-strike"></div>
      </div>
    </div>
  );
};

export default HeroMetrics;
