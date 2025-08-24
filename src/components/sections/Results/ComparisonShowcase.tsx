"use client";

import React, { useState, useRef } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";
import "./ComparisonShowcase.css";

interface ComparisonData {
  title: string;
  client: string;
  before: Array<{
    metric: string;
    value: string;
    icon: string;
  }>;
  after: Array<{
    metric: string;
    value: string;
    icon: string;
  }>;
  impact: {
    highlight: string;
    value: string;
  };
}

interface ComparisonShowcaseProps {
  theme: "extreme-brutalist" | "refined-brutalist";
}

const comparisonData: ComparisonData[] = [
  {
    title: "E-commerce Platform Optimization",
    client: "TechCorp Enterprise",
    before: [
      { metric: "Page Load Time", value: "4.2s", icon: "⏱️" },
      { metric: "Conversion Rate", value: "2.1%", icon: "📈" },
      { metric: "Monthly Revenue", value: "$45K", icon: "💰" },
      { metric: "User Satisfaction", value: "3.2/5", icon: "⭐" },
    ],
    after: [
      { metric: "Page Load Time", value: "1.1s", icon: "⚡" },
      { metric: "Conversion Rate", value: "5.8%", icon: "🚀" },
      { metric: "Monthly Revenue", value: "$127K", icon: "💎" },
      { metric: "User Satisfaction", value: "4.9/5", icon: "🌟" },
    ],
    impact: {
      highlight: "Revenue Increase",
      value: "+182%",
    },
  },
  {
    title: "SaaS Application Modernization",
    client: "GrowthCo",
    before: [
      { metric: "System Uptime", value: "94.2%", icon: "⚠️" },
      { metric: "Response Time", value: "850ms", icon: "🐌" },
      { metric: "User Retention", value: "67%", icon: "📉" },
      { metric: "Support Tickets", value: "340/mo", icon: "🎫" },
    ],
    after: [
      { metric: "System Uptime", value: "99.9%", icon: "✅" },
      { metric: "Response Time", value: "120ms", icon: "⚡" },
      { metric: "User Retention", value: "94%", icon: "📊" },
      { metric: "Support Tickets", value: "45/mo", icon: "🎯" },
    ],
    impact: {
      highlight: "Performance Boost",
      value: "+607%",
    },
  },
  {
    title: "Financial Dashboard Rebuild",
    client: "InvestPro Solutions",
    before: [
      { metric: "Data Processing", value: "12min", icon: "⏳" },
      { metric: "User Complaints", value: "89/week", icon: "😤" },
      { metric: "System Crashes", value: "15/day", icon: "💥" },
      { metric: "Client Retention", value: "72%", icon: "📉" },
    ],
    after: [
      { metric: "Data Processing", value: "45sec", icon: "⚡" },
      { metric: "User Complaints", value: "3/week", icon: "😊" },
      { metric: "System Crashes", value: "0/day", icon: "🛡️" },
      { metric: "Client Retention", value: "96%", icon: "📈" },
    ],
    impact: {
      highlight: "Processing Speed",
      value: "+1500%",
    },
  },
];

export const ComparisonShowcase: React.FC<ComparisonShowcaseProps> = ({
  theme,
}) => {
  const [activeComparison, setActiveComparison] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<"before" | "after" | null>(
    null
  );
  const sectionRef = useRef<HTMLDivElement>(null);

  const isVisible = useIntersectionObserver(sectionRef, {
    threshold: 0.3,
    triggerOnce: true,
  });

  const impactCounter = useAnimatedCounter({
    end: parseInt(
      comparisonData[activeComparison].impact.value.replace(/[^0-9]/g, "")
    ),
    duration: 2000,
    formatValue: (value) => `+${Math.floor(value)}%`,
  });

  const handleTabChange = (index: number) => {
    if (index === activeComparison) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setActiveComparison(index);
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <div
      ref={sectionRef}
      className={`comparison-showcase comparison-showcase--${theme} ${
        isVisible ? "comparison-showcase--visible" : ""
      }`}
    >
      {/* Section Header */}
      <div className="comparison-header">
        <h3 className="comparison-title">BEFORE & AFTER</h3>
        <p className="comparison-subtitle">
          Real transformations with measurable impact
        </p>
      </div>

      {/* Comparison Tabs */}
      <div className="comparison-tabs">
        {comparisonData.map((comparison, index) => (
          <button
            key={index}
            className={`comparison-tab ${
              activeComparison === index ? "comparison-tab--active" : ""
            } ${isTransitioning ? "comparison-tab--transitioning" : ""}`}
            onClick={() => handleTabChange(index)}
          >
            <span className="tab-title">{comparison.title}</span>
            <span className="tab-client">{comparison.client}</span>
            <div className="tab-effects">
              <div className="tab-glow"></div>
              <div className="tab-border-animation"></div>
            </div>
          </button>
        ))}
      </div>

      {/* Active Comparison */}
      <div
        className={`comparison-content ${isTransitioning ? "comparison-content--transitioning" : ""}`}
      >
        <div className="comparison-cards">
          {/* Before Card */}
          <div
            className={`comparison-card comparison-card--before ${
              hoveredCard === "before" ? "comparison-card--hovered" : ""
            }`}
            onMouseEnter={() => setHoveredCard("before")}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="card-background-effects">
              <div className="card-scan-lines"></div>
              <div className="card-noise"></div>
            </div>
            <div className="card-header">
              <h4 className="card-title">
                <span className="title-text">BEFORE</span>
                <div className="title-underline"></div>
              </h4>
              <div className="card-status card-status--warning">
                <span className="status-icon">⚠️</span>
                <span className="status-text">NEEDS IMPROVEMENT</span>
                <div className="status-pulse"></div>
              </div>
            </div>
            <div className="card-metrics">
              {comparisonData[activeComparison].before.map((metric, index) => (
                <div
                  key={index}
                  className="metric-item"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="metric-icon">{metric.icon}</span>
                  <div className="metric-content">
                    <span className="metric-label">{metric.metric}</span>
                    <span className="metric-value metric-value--before">
                      {metric.value}
                    </span>
                  </div>
                  <div className="metric-effects">
                    <div className="metric-glow"></div>
                    <div className="metric-border"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="card-corner-effects">
              <div className="corner corner--top-left"></div>
              <div className="corner corner--top-right"></div>
              <div className="corner corner--bottom-left"></div>
              <div className="corner corner--bottom-right"></div>
            </div>
          </div>

          {/* Transformation Arrow */}
          <div className="transformation-arrow">
            <div className="arrow-container">
              <div className="arrow-line"></div>
              <div className="arrow-head"></div>
              <div className="arrow-text">TRANSFORM</div>
            </div>
            <div className="arrow-effects">
              <div className="arrow-glow"></div>
              <div className="arrow-lightning">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="lightning-bolt"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  ></div>
                ))}
              </div>
              <div className="arrow-particles">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="particle"
                    style={
                      {
                        animationDelay: `${i * 0.2}s`,
                        "--particle-angle": `${i * 45}deg`,
                      } as React.CSSProperties
                    }
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* After Card */}
          <div
            className={`comparison-card comparison-card--after ${
              hoveredCard === "after" ? "comparison-card--hovered" : ""
            }`}
            onMouseEnter={() => setHoveredCard("after")}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="card-background-effects">
              <div className="card-success-rays"></div>
              <div className="card-shimmer"></div>
            </div>
            <div className="card-header">
              <h4 className="card-title">
                <span className="title-text">AFTER</span>
                <div className="title-underline"></div>
              </h4>
              <div className="card-status card-status--success">
                <span className="status-icon">✅</span>
                <span className="status-text">OPTIMIZED</span>
                <div className="status-celebration">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="celebration-particle"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="card-metrics">
              {comparisonData[activeComparison].after.map((metric, index) => (
                <div
                  key={index}
                  className="metric-item"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="metric-icon">{metric.icon}</span>
                  <div className="metric-content">
                    <span className="metric-label">{metric.metric}</span>
                    <span className="metric-value metric-value--after">
                      {metric.value}
                    </span>
                  </div>
                  <div className="metric-effects">
                    <div className="metric-glow"></div>
                    <div className="metric-border"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="card-corner-effects">
              <div className="corner corner--top-left"></div>
              <div className="corner corner--top-right"></div>
              <div className="corner corner--bottom-left"></div>
              <div className="corner corner--bottom-right"></div>
            </div>
          </div>
        </div>

        {/* Impact Summary */}
        <div className="impact-summary">
          <div className="impact-background">
            <div className="impact-grid"></div>
            <div className="impact-waves">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="impact-wave"
                  style={{ animationDelay: `${i * 0.5}s` }}
                ></div>
              ))}
            </div>
          </div>
          <div className="impact-content">
            <div className="impact-badge">
              <span className="badge-icon">🎯</span>
              <span className="badge-text">MEASURABLE IMPACT</span>
            </div>
            <h4 className="impact-title">
              {comparisonData[activeComparison].impact.highlight}
            </h4>
            <div className="impact-value-container">
              <div className="impact-value" ref={impactCounter.ref}>
                {impactCounter.count}
              </div>
              <div className="impact-sparkles">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="sparkle"
                    style={
                      {
                        animationDelay: `${i * 0.2}s`,
                        "--sparkle-angle": `${i * 60}deg`,
                      } as React.CSSProperties
                    }
                  ></div>
                ))}
              </div>
            </div>
            <div className="impact-description">
              <span className="description-highlight">
                Delivered measurable results
              </span>
              <span className="description-text">
                that directly impacted the bottom line and exceeded client
                expectations
              </span>
            </div>
            <div className="impact-financial-data">
              <div className="financial-item">
                <span className="financial-label">ROI Generated</span>
                <span className="financial-value">$2.4M+</span>
              </div>
              <div className="financial-item">
                <span className="financial-label">Time Saved</span>
                <span className="financial-value">1,200hrs</span>
              </div>
              <div className="financial-item">
                <span className="financial-label">Efficiency Gain</span>
                <span className="financial-value">
                  {comparisonData[activeComparison].impact.value}
                </span>
              </div>
            </div>
          </div>
          <div className="impact-effects">
            <div className="impact-glow"></div>
            <div className="impact-rays">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="impact-ray"
                  style={{
                    transform: `rotate(${i * 30}deg)`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                ></div>
              ))}
            </div>
            <div className="impact-orbs">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="impact-orb"
                  style={
                    {
                      animationDelay: `${i * 0.3}s`,
                      "--orb-angle": `${i * 90}deg`,
                    } as React.CSSProperties
                  }
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
