"use client";

import React, { useRef, useState, useEffect } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";
import "./RevenueDashboard.css";

interface RevenueData {
  category: string;
  amount: number;
  percentage: number;
  icon: string;
  color: string;
  description: string;
}

interface RevenueDashboardProps {
  theme: "extreme-brutalist" | "refined-brutalist";
}

const revenueData: RevenueData[] = [
  {
    category: "Revenue Generated",
    amount: 2500000,
    percentage: 100,
    icon: "💰",
    color: "#00ff00",
    description: "Direct revenue generated for clients",
  },
  {
    category: "Cost Savings",
    amount: 850000,
    percentage: 34,
    icon: "💎",
    color: "#00ffff",
    description: "Operational costs reduced through optimization",
  },
  {
    category: "Performance Gains",
    amount: 1200000,
    percentage: 48,
    icon: "⚡",
    color: "#ffff00",
    description: "Value from improved system performance",
  },
  {
    category: "Efficiency Boost",
    amount: 650000,
    percentage: 26,
    icon: "🚀",
    color: "#8b5cf6",
    description: "Productivity improvements and automation",
  },
];

export const RevenueDashboard: React.FC<RevenueDashboardProps> = ({
  theme,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState(0);
  const [progressBars, setProgressBars] = useState<number[]>([]);

  const isVisible = useIntersectionObserver(sectionRef, {
    threshold: 0.3,
    triggerOnce: true,
  });

  // Animated counters for each category
  const totalCounter = useAnimatedCounter({
    end: 2500000,
    duration: 2500,
    formatValue: (value) => `$${(value / 1000000).toFixed(1)}M`,
  });

  const activeCounter = useAnimatedCounter({
    end: revenueData[activeCategory].amount,
    duration: 1500,
    formatValue: (value) => `$${(value / 1000).toLocaleString()}`,
  });

  // Animate progress bars
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setProgressBars(revenueData.map((item) => item.percentage));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  // Auto-rotate active category
  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setActiveCategory((prev) => (prev + 1) % revenueData.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  return (
    <div
      ref={sectionRef}
      className={`revenue-dashboard revenue-dashboard--${theme} ${
        isVisible ? "revenue-dashboard--visible" : ""
      }`}
    >
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h3 className="dashboard-title">FINANCIAL IMPACT</h3>
        <div className="dashboard-subtitle">
          <span className="subtitle-text">Total Value Delivered</span>
          <div className="total-amount" ref={totalCounter.ref}>
            {totalCounter.count}
          </div>
        </div>
      </div>

      {/* Revenue Categories */}
      <div className="revenue-categories">
        {revenueData.map((category, index) => (
          <div
            key={index}
            className={`revenue-category ${
              activeCategory === index ? "revenue-category--active" : ""
            }`}
            onClick={() => setActiveCategory(index)}
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="category-header">
              <span className="category-icon">{category.icon}</span>
              <span className="category-name">{category.category}</span>
            </div>

            <div className="category-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${progressBars[index] || 0}%`,
                    backgroundColor: category.color,
                    boxShadow: `0 0 10px ${category.color}`,
                  }}
                ></div>
              </div>
              <span className="progress-percentage">
                {category.percentage}%
              </span>
            </div>

            <div className="category-amount">
              ${(category.amount / 1000).toLocaleString()}K
            </div>

            <div className="category-description">{category.description}</div>

            {/* Active indicator */}
            {activeCategory === index && (
              <div className="active-indicator">
                <div className="indicator-pulse"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Active Category Detail */}
      <div className="category-detail">
        <div className="detail-content">
          <div className="detail-header">
            <span className="detail-icon">
              {revenueData[activeCategory].icon}
            </span>
            <h4 className="detail-title">
              {revenueData[activeCategory].category}
            </h4>
          </div>

          <div className="detail-amount" ref={activeCounter.ref}>
            {activeCounter.count}
          </div>

          <div className="detail-description">
            {revenueData[activeCategory].description}
          </div>

          <div className="detail-visualization">
            <div className="viz-container">
              <div
                className="viz-circle"
                style={{
                  background: `conic-gradient(
                    ${revenueData[activeCategory].color} 0deg,
                    ${revenueData[activeCategory].color} ${revenueData[activeCategory].percentage * 3.6}deg,
                    rgba(255, 255, 255, 0.1) ${revenueData[activeCategory].percentage * 3.6}deg,
                    rgba(255, 255, 255, 0.1) 360deg
                  )`,
                }}
              >
                <div className="viz-inner">
                  <span className="viz-percentage">
                    {revenueData[activeCategory].percentage}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Data visualization effects */}
        <div className="detail-effects">
          <div className="data-streams">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="data-stream"
                style={{
                  animationDelay: `${i * 0.3}s`,
                  left: `${20 + i * 12}%`,
                }}
              ></div>
            ))}
          </div>

          <div className="data-particles">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="data-particle"
                style={{
                  animationDelay: `${i * 0.4}s`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Dashboard Footer */}
      <div className="dashboard-footer">
        <div className="footer-stats">
          <div className="stat-item">
            <span className="stat-label">Projects</span>
            <span className="stat-value">25+</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Clients</span>
            <span className="stat-value">15+</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">ROI Average</span>
            <span className="stat-value">340%</span>
          </div>
        </div>

        <div className="footer-note">
          <span className="note-icon">📊</span>
          <span className="note-text">
            All figures based on verified client results and third-party audits
          </span>
        </div>
      </div>
    </div>
  );
};
