"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import "./AchievementTimeline.css";

interface Achievement {
  year: number;
  title: string;
  description: string;
  icon: string;
  current?: boolean;
  category: "technical" | "business" | "recognition" | "milestone";
  impact: string;
  metrics?: {
    value: string;
    label: string;
  }[];
  technologies?: string[];
}

interface AchievementTimelineProps {
  theme: "extreme-brutalist" | "refined-brutalist";
}

const achievements: Achievement[] = [
  {
    year: 2020,
    title: "First Enterprise Client",
    description:
      "Landed first major enterprise contract, delivering a full-stack platform modernization project.",
    icon: "🏢",
    category: "milestone",
    impact: "Foundation for enterprise expertise",
    metrics: [
      { value: "$250K", label: "Project Value" },
      { value: "6 months", label: "Duration" },
    ],
    technologies: ["React", "Node.js", "PostgreSQL"],
  },
  {
    year: 2021,
    title: "Performance Optimization Breakthrough",
    description:
      "Achieved 400% performance improvement for a high-traffic e-commerce platform.",
    icon: "⚡",
    category: "technical",
    impact: "Established performance engineering reputation",
    metrics: [
      { value: "400%", label: "Speed Increase" },
      { value: "85%", label: "Load Time Reduction" },
    ],
    technologies: ["Next.js", "Redis", "CDN"],
  },
  {
    year: 2021,
    title: "Open Source Recognition",
    description:
      "Created React Brutalist UI library, gaining 1500+ GitHub stars and community adoption.",
    icon: "⭐",
    category: "recognition",
    impact: "Thought leadership in design systems",
    metrics: [
      { value: "1,500+", label: "GitHub Stars" },
      { value: "50K+", label: "Weekly Downloads" },
    ],
    technologies: ["React", "TypeScript", "Storybook"],
  },
  {
    year: 2022,
    title: "$1M Revenue Milestone",
    description:
      "Generated over $1M in direct revenue for clients through optimization and development projects.",
    icon: "💰",
    category: "business",
    impact: "Proven ROI delivery capability",
    metrics: [
      { value: "$1M+", label: "Revenue Generated" },
      { value: "12", label: "Major Projects" },
    ],
    technologies: ["Full Stack", "Cloud", "Analytics"],
  },
  {
    year: 2022,
    title: "Conference Speaker",
    description:
      "Spoke at React Conference 2022 about building brutalist UIs with modern React patterns.",
    icon: "🎤",
    category: "recognition",
    impact: "Industry thought leadership",
    metrics: [
      { value: "500+", label: "Attendees" },
      { value: "95%", label: "Positive Feedback" },
    ],
    technologies: ["React", "Design Systems", "Performance"],
  },
  {
    year: 2023,
    title: "Next.js Performance Toolkit",
    description:
      "Released performance toolkit that became featured in Next.js official documentation.",
    icon: "🛠️",
    category: "technical",
    impact: "Industry-standard tooling contribution",
    metrics: [
      { value: "10K+", label: "Monthly Users" },
      { value: "Featured", label: "Next.js Docs" },
    ],
    technologies: ["Next.js", "Performance", "DevTools"],
  },
  {
    year: 2023,
    title: "15+ Enterprise Clients",
    description:
      "Expanded client base to include 15+ enterprise clients across various industries.",
    icon: "📈",
    category: "business",
    impact: "Scalable business growth",
    metrics: [
      { value: "15+", label: "Enterprise Clients" },
      { value: "98%", label: "Retention Rate" },
    ],
    technologies: ["Enterprise", "Scalability", "Architecture"],
  },
  {
    year: 2024,
    title: "Current: Innovation Focus",
    description:
      "Leading cutting-edge projects in AI integration, performance optimization, and brutalist design systems.",
    icon: "🚀",
    category: "milestone",
    impact: "Pushing industry boundaries",
    current: true,
    metrics: [
      { value: "5+", label: "AI Projects" },
      { value: "∞", label: "Innovation" },
    ],
    technologies: ["AI/ML", "Next.js 14", "Edge Computing"],
  },
];

export const AchievementTimeline: React.FC<AchievementTimelineProps> = ({
  theme,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [visibleAchievements, setVisibleAchievements] = useState<number[]>([]);
  const [activeAchievement, setActiveAchievement] = useState<number | null>(
    null
  );
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, scrollLeft: 0 });

  const isVisible = useIntersectionObserver(sectionRef, {
    threshold: 0.2,
    triggerOnce: true,
  });

  // Animate achievements in sequence
  useEffect(() => {
    if (isVisible) {
      achievements.forEach((_, index) => {
        setTimeout(() => {
          setVisibleAchievements((prev) => [...prev, index]);
        }, index * 200);
      });
    }
  }, [isVisible]);

  // Auto-highlight current achievement with enhanced effects
  useEffect(() => {
    const currentIndex = achievements.findIndex((a) => a.current);
    if (currentIndex !== -1 && isVisible) {
      setTimeout(() => {
        setActiveAchievement(currentIndex);
        // Auto-scroll to current achievement
        if (timelineRef.current) {
          const medallionPosition =
            (currentIndex / (achievements.length - 1)) * 100;
          const scrollPosition =
            (medallionPosition / 100) *
            (timelineRef.current.scrollWidth - timelineRef.current.clientWidth);
          timelineRef.current.scrollTo({
            left: scrollPosition,
            behavior: "smooth",
          });
        }
      }, 2500);
    }
  }, [isVisible]);

  // Enhanced scroll progress tracking
  const handleScroll = useCallback(() => {
    if (timelineRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = timelineRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
      setScrollProgress(progress);
    }
  }, []);

  useEffect(() => {
    const timeline = timelineRef.current;
    if (timeline) {
      timeline.addEventListener("scroll", handleScroll);
      return () => timeline.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  // Enhanced touch/drag support
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (timelineRef.current) {
      setIsDragging(true);
      setDragStart({
        x: e.pageX - timelineRef.current.offsetLeft,
        scrollLeft: timelineRef.current.scrollLeft,
      });
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !timelineRef.current) return;
      e.preventDefault();
      const x = e.pageX - timelineRef.current.offsetLeft;
      const walk = (x - dragStart.x) * 2;
      timelineRef.current.scrollLeft = dragStart.scrollLeft - walk;
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (timelineRef.current) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].pageX - timelineRef.current.offsetLeft,
        scrollLeft: timelineRef.current.scrollLeft,
      });
    }
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging || !timelineRef.current) return;
      const x = e.touches[0].pageX - timelineRef.current.offsetLeft;
      const walk = (x - dragStart.x) * 1.5;
      timelineRef.current.scrollLeft = dragStart.scrollLeft - walk;
    },
    [isDragging, dragStart]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const getCategoryColor = (category: Achievement["category"]) => {
    const colors = {
      technical: theme === "extreme-brutalist" ? "#00ffff" : "#06b6d4",
      business: theme === "extreme-brutalist" ? "#00ff00" : "#10b981",
      recognition: theme === "extreme-brutalist" ? "#ffff00" : "#8b5cf6",
      milestone: theme === "extreme-brutalist" ? "#ff6b00" : "#f59e0b",
    };
    return colors[category];
  };

  const handleNavigationScroll = (direction: "left" | "right") => {
    if (timelineRef.current) {
      const scrollAmount = 400;
      timelineRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollToAchievement = (index: number) => {
    if (timelineRef.current) {
      const medallionPosition = (index / (achievements.length - 1)) * 100;
      const scrollPosition =
        (medallionPosition / 100) *
        (timelineRef.current.scrollWidth - timelineRef.current.clientWidth);
      timelineRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
      setActiveAchievement(index);
    }
  };

  return (
    <div
      ref={sectionRef}
      className={`achievement-timeline achievement-timeline--${theme} ${
        isVisible ? "achievement-timeline--visible" : ""
      }`}
    >
      {/* Timeline Header */}
      <div className="timeline-header">
        <h3 className="timeline-title">ACHIEVEMENT TIMELINE</h3>
        <p className="timeline-subtitle">
          Key milestones and breakthrough moments in the journey
        </p>

        {/* Category Legend */}
        <div className="category-legend">
          {["technical", "business", "recognition", "milestone"].map(
            (category) => (
              <div key={category} className="legend-item">
                <div
                  className="legend-color"
                  style={{
                    backgroundColor: getCategoryColor(
                      category as Achievement["category"]
                    ),
                  }}
                ></div>
                <span className="legend-label">{category}</span>
              </div>
            )
          )}
        </div>
      </div>

      {/* Timeline Navigation */}
      <div className="timeline-navigation">
        <button
          className="nav-button nav-button--left"
          onClick={() => handleNavigationScroll("left")}
          aria-label="Scroll timeline left"
        >
          <span className="nav-icon">←</span>
        </button>

        <div className="timeline-progress">
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${scrollProgress}%` }}
            ></div>
          </div>
          <div className="progress-indicators">
            {achievements.map((_, index) => (
              <button
                key={index}
                className={`progress-dot ${activeAchievement === index ? "progress-dot--active" : ""}`}
                onClick={() => scrollToAchievement(index)}
                style={{
                  left: `${(index / (achievements.length - 1)) * 100}%`,
                }}
                aria-label={`Go to ${achievements[index].year} achievement`}
              />
            ))}
          </div>
        </div>

        <button
          className="nav-button nav-button--right"
          onClick={() => handleNavigationScroll("right")}
          aria-label="Scroll timeline right"
        >
          <span className="nav-icon">→</span>
        </button>
      </div>

      {/* Timeline Container */}
      <div
        className={`timeline-container ${isDragging ? "timeline-container--dragging" : ""}`}
        ref={timelineRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="timeline-track">
          {/* Timeline Line */}
          <div className="timeline-line">
            <div className="line-progress"></div>
          </div>

          {/* Achievement Medallions */}
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={`achievement-medallion ${
                visibleAchievements.includes(index)
                  ? "achievement-medallion--visible"
                  : ""
              } ${
                activeAchievement === index
                  ? "achievement-medallion--active"
                  : ""
              } ${achievement.current ? "achievement-medallion--current" : ""}`}
              style={{
                left: `${(index / (achievements.length - 1)) * 100}%`,
                animationDelay: `${index * 0.2}s`,
              }}
              onClick={() =>
                setActiveAchievement(activeAchievement === index ? null : index)
              }
            >
              {/* Medallion */}
              <div
                className="medallion"
                style={{
                  borderColor: getCategoryColor(achievement.category),
                  boxShadow: `0 0 20px ${getCategoryColor(achievement.category)}`,
                }}
              >
                <span className="medallion-icon">{achievement.icon}</span>
                <div className="medallion-year">{achievement.year}</div>

                {/* Current indicator */}
                {achievement.current && (
                  <div className="current-indicator">
                    <div className="current-pulse"></div>
                  </div>
                )}
              </div>

              {/* Achievement Details */}
              <div className="achievement-details">
                <div className="details-card">
                  <div className="card-header">
                    <h4 className="achievement-title">{achievement.title}</h4>
                    <span
                      className="achievement-category"
                      style={{ color: getCategoryColor(achievement.category) }}
                    >
                      {achievement.category}
                    </span>
                  </div>

                  <p className="achievement-description">
                    {achievement.description}
                  </p>

                  <div className="achievement-impact">
                    <span className="impact-label">Impact:</span>
                    <span className="impact-text">{achievement.impact}</span>
                  </div>

                  {/* Achievement Metrics */}
                  {achievement.metrics && (
                    <div className="achievement-metrics">
                      {achievement.metrics.map((metric, metricIndex) => (
                        <div key={metricIndex} className="metric-item">
                          <span className="metric-value">{metric.value}</span>
                          <span className="metric-label">{metric.label}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Technologies */}
                  {achievement.technologies && (
                    <div className="achievement-technologies">
                      <span className="tech-label">Technologies:</span>
                      <div className="tech-tags">
                        {achievement.technologies.map((tech, techIndex) => (
                          <span key={techIndex} className="tech-tag">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Card effects */}
                  <div className="card-effects">
                    <div
                      className="card-glow"
                      style={{
                        background: `radial-gradient(circle, ${getCategoryColor(achievement.category)} 0%, transparent 70%)`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Stats */}
      <div className="timeline-stats">
        <div className="stat-item">
          <span className="stat-value">{achievements.length}</span>
          <span className="stat-label">Major Milestones</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">4</span>
          <span className="stat-label">Years of Growth</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">∞</span>
          <span className="stat-label">Innovation Continues</span>
        </div>
      </div>

      {/* Timeline Effects */}
      <div className="timeline-effects">
        <div className="effect-particles">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="effect-particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
              }}
            ></div>
          ))}
        </div>

        <div className="effect-rays">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="effect-ray"
              style={{
                left: `${20 + i * 15}%`,
                animationDelay: `${i * 0.8}s`,
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};
