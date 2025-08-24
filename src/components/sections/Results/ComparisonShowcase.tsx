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
];

export const ComparisonShowcase: React.FC<ComparisonShowcaseProps> = ({
  theme,
}) => {
  const [activeComparison, setActiveComparison] = useState(0);
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
            }`}
            onClick={() => setActiveComparison(index)}
          >
            <span className="tab-title">{comparison.title}</span>
            <span className="tab-client">{comparison.client}</span>
          </button>
        ))}
      </div>

      {/* Active Comparison */}
      <div className="comparison-content">
        <div className="comparison-cards">
          {/* Before Card */}
          <div className="comparison-card comparison-card--before">
            <div className="card-header">
              <h4 className="card-title">BEFORE</h4>
              <div className="card-status card-status--warning">
                <span className="status-icon">⚠️</span>
                <span className="status-text">NEEDS IMPROVEMENT</span>
              </div>
            </div>
            <div className="card-metrics">
              {comparisonData[activeComparison].before.map((metric, index) => (
                <div key={index} className="metric-item">
                  <span className="metric-icon">{metric.icon}</span>
                  <div className="metric-content">
                    <span className="metric-label">{metric.metric}</span>
                    <span className="metric-value metric-value--before">
                      {metric.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transformation Arrow */}
          <div className="transformation-arrow">
            <div className="arrow-line"></div>
            <div className="arrow-head"></div>
            <div className="arrow-effects">
              <div className="arrow-glow"></div>
              <div className="arrow-particles">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="particle"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* After Card */}
          <div className="comparison-card comparison-card--after">
            <div className="card-header">
              <h4 className="card-title">AFTER</h4>
              <div className="card-status card-status--success">
                <span className="status-icon">✅</span>
                <span className="status-text">OPTIMIZED</span>
              </div>
            </div>
            <div className="card-metrics">
              {comparisonData[activeComparison].after.map((metric, index) => (
                <div key={index} className="metric-item">
                  <span className="metric-icon">{metric.icon}</span>
                  <div className="metric-content">
                    <span className="metric-label">{metric.metric}</span>
                    <span className="metric-value metric-value--after">
                      {metric.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Impact Summary */}
        <div className="impact-summary">
          <div className="impact-content">
            <h4 className="impact-title">
              {comparisonData[activeComparison].impact.highlight}
            </h4>
            <div className="impact-value" ref={impactCounter.ref}>
              {impactCounter.count}
            </div>
            <div className="impact-description">
              Delivered measurable results that directly impacted the bottom
              line
            </div>
          </div>
          <div className="impact-effects">
            <div className="impact-glow"></div>
            <div className="impact-rays">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="impact-ray"
                  style={{ transform: `rotate(${i * 45}deg)` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
