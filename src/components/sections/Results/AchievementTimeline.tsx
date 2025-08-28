"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import "./AchievementTimeline.css";

interface Experience {
  year: number;
  title: string;
  description: string;
  icon: string;
  current?: boolean;
  category: "technical" | "leadership" | "learning" | "milestone";
  impact: string;
  metrics?: {
    value: string;
    label: string;
  }[];
  technologies?: string[];
}

interface ExperienceTimelineProps {
  theme: "extreme-brutalist" | "refined-brutalist";
}

const experiences: Experience[] = [
  {
    year: 2020,
    title: "Junior Full-Stack Developer",
    description:
      "Started professional journey as a junior developer, learning enterprise-level development practices and modern web technologies.",
    icon: "🌱",
    category: "milestone",
    impact: "Foundation of professional development career",
    metrics: [
      { value: "6 months", label: "Learning Period" },
      { value: "3", label: "Major Projects" },
    ],
    technologies: ["React", "Node.js", "PostgreSQL"],
  },
  {
    year: 2021,
    title: "Mid-Level Developer",
    description:
      "Gained expertise in performance optimization, advanced React patterns, and full-stack architecture design.",
    icon: "⚡",
    category: "technical",
    impact: "Developed deep technical expertise",
    metrics: [
      { value: "12", label: "Projects Completed" },
      { value: "5", label: "Technologies Mastered" },
    ],
    technologies: ["Next.js", "TypeScript", "Redis", "AWS"],
  },
  {
    year: 2021,
    title: "Open Source Contributor",
    description:
      "Started contributing to open source projects and building personal libraries, establishing presence in developer community.",
    icon: "⭐",
    category: "learning",
    impact: "Built reputation in developer community",
    metrics: [
      { value: "15+", label: "Contributions" },
      { value: "3", label: "Personal Projects" },
    ],
    technologies: ["React", "TypeScript", "Storybook"],
  },
  {
    year: 2022,
    title: "Senior Developer & Team Lead",
    description:
      "Promoted to senior role with team leadership responsibilities, mentoring junior developers and architecting complex systems.",
    icon: "👥",
    category: "leadership",
    impact: "Developed leadership and mentoring skills",
    metrics: [
      { value: "5", label: "Team Members" },
      { value: "8", label: "Major Deliveries" },
    ],
    technologies: ["Team Leadership", "Architecture", "Mentoring"],
  },
  {
    year: 2022,
    title: "Technical Speaker",
    description:
      "Began speaking at conferences and meetups, sharing knowledge about modern React development and design systems.",
    icon: "🎤",
    category: "learning",
    impact: "Enhanced communication and thought leadership",
    metrics: [
      { value: "3", label: "Conferences" },
      { value: "500+", label: "Developers Reached" },
    ],
    technologies: ["Public Speaking", "React", "Design Systems"],
  },
  {
    year: 2023,
    title: "Principal Developer",
    description:
      "Advanced to principal level, leading architectural decisions and establishing development standards across multiple teams.",
    icon: "🛠️",
    category: "technical",
    impact: "Became technical authority and standard setter",
    metrics: [
      { value: "3", label: "Teams Led" },
      { value: "15+", label: "Developers Mentored" },
    ],
    technologies: ["Architecture", "Standards", "Cross-team Leadership"],
  },
  {
    year: 2023,
    title: "Freelance Consultant",
    description:
      "Expanded experience by taking on freelance consulting work, helping multiple companies with technical challenges.",
    icon: "📈",
    category: "milestone",
    impact: "Gained diverse industry experience",
    metrics: [
      { value: "10+", label: "Client Projects" },
      { value: "5", label: "Industries" },
    ],
    technologies: ["Consulting", "Multiple Stacks", "Business Strategy"],
  },
  {
    year: 2024,
    title: "Current: Technical Innovation Leader",
    description:
      "Currently leading innovation initiatives, exploring AI integration, and pushing boundaries of modern web development.",
    icon: "🚀",
    category: "milestone",
    impact: "Driving industry innovation and best practices",
    current: true,
    metrics: [
      { value: "6+", label: "Years Experience" },
      { value: "∞", label: "Learning Continues" },
    ],
    technologies: ["AI/ML", "Next.js 14", "Innovation Leadership"],
  },
];

export const AchievementTimeline: React.FC<ExperienceTimelineProps> = ({
  theme,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [visibleExperiences, setVisibleExperiences] = useState<number[]>([]);
  const [activeExperience, setActiveExperience] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, scrollLeft: 0 });

  const isVisible = useIntersectionObserver(sectionRef, {
    threshold: 0.2,
    triggerOnce: true,
  });

  // Animate experiences in sequence
  useEffect(() => {
    if (isVisible) {
      experiences.forEach((_, index) => {
        setTimeout(() => {
          setVisibleExperiences((prev) => [...prev, index]);
        }, index * 200);
      });
    }
  }, [isVisible]);

  // Auto-highlight current experience with enhanced effects
  useEffect(() => {
    const currentIndex = experiences.findIndex((e) => e.current);
    if (currentIndex !== -1 && isVisible) {
      setTimeout(() => {
        setActiveExperience(currentIndex);
        // Auto-scroll to current experience
        if (timelineRef.current) {
          const medallionPosition =
            (currentIndex / (experiences.length - 1)) * 100;
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

  const getCategoryColor = (category: Experience["category"]) => {
    const colors = {
      technical: theme === "extreme-brutalist" ? "#00ffff" : "#06b6d4",
      leadership: theme === "extreme-brutalist" ? "#00ff00" : "#10b981",
      learning: theme === "extreme-brutalist" ? "#ffff00" : "#8b5cf6",
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

  const scrollToExperience = (index: number) => {
    if (timelineRef.current) {
      const medallionPosition = (index / (experiences.length - 1)) * 100;
      const scrollPosition =
        (medallionPosition / 100) *
        (timelineRef.current.scrollWidth - timelineRef.current.clientWidth);
      timelineRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
      setActiveExperience(index);
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
        <h3 className="timeline-title">EXPERIENCE TIMELINE</h3>
        <p className="timeline-subtitle">
          Professional growth journey and key learning milestones
        </p>

        {/* Category Legend */}
        <div className="category-legend">
          {["technical", "leadership", "learning", "milestone"].map(
            (category) => (
              <div key={category} className="legend-item">
                <div
                  className="legend-color"
                  style={{
                    backgroundColor: getCategoryColor(
                      category as Experience["category"]
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
            {experiences.map((_, index) => (
              <button
                key={index}
                className={`progress-dot ${activeExperience === index ? "progress-dot--active" : ""}`}
                onClick={() => scrollToExperience(index)}
                style={{
                  left: `${(index / (experiences.length - 1)) * 100}%`,
                }}
                aria-label={`Go to ${experiences[index].year} experience`}
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

          {/* Experience Medallions */}
          {experiences.map((experience, index) => (
            <div
              key={index}
              className={`achievement-medallion ${
                visibleExperiences.includes(index)
                  ? "achievement-medallion--visible"
                  : ""
              } ${
                activeExperience === index
                  ? "achievement-medallion--active"
                  : ""
              } ${experience.current ? "achievement-medallion--current" : ""}`}
              style={{
                left: `${(index / (experiences.length - 1)) * 100}%`,
                animationDelay: `${index * 0.2}s`,
              }}
              onClick={() =>
                setActiveExperience(activeExperience === index ? null : index)
              }
            >
              {/* Medallion */}
              <div
                className="medallion"
                style={{
                  borderColor: getCategoryColor(experience.category),
                  boxShadow: `0 0 20px ${getCategoryColor(experience.category)}`,
                }}
              >
                <span className="medallion-icon">{experience.icon}</span>
                <div className="medallion-year">{experience.year}</div>

                {/* Current indicator */}
                {experience.current && (
                  <div className="current-indicator">
                    <div className="current-pulse"></div>
                  </div>
                )}
              </div>

              {/* Experience Details */}
              <div className="achievement-details">
                <div className="details-card">
                  <div className="card-header">
                    <h4 className="achievement-title">{experience.title}</h4>
                    <span
                      className="achievement-category"
                      style={{ color: getCategoryColor(experience.category) }}
                    >
                      {experience.category}
                    </span>
                  </div>

                  <p className="achievement-description">
                    {experience.description}
                  </p>

                  <div className="achievement-impact">
                    <span className="impact-label">Growth:</span>
                    <span className="impact-text">{experience.impact}</span>
                  </div>

                  {/* Experience Metrics */}
                  {experience.metrics && (
                    <div className="achievement-metrics">
                      {experience.metrics.map((metric, metricIndex) => (
                        <div key={metricIndex} className="metric-item">
                          <span className="metric-value">{metric.value}</span>
                          <span className="metric-label">{metric.label}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Technologies */}
                  {experience.technologies && (
                    <div className="achievement-technologies">
                      <span className="tech-label">Skills:</span>
                      <div className="tech-tags">
                        {experience.technologies.map((tech, techIndex) => (
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
                        background: `radial-gradient(circle, ${getCategoryColor(experience.category)} 0%, transparent 70%)`,
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
          <span className="stat-value">{experiences.length}</span>
          <span className="stat-label">Career Milestones</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">6+</span>
          <span className="stat-label">Years Experience</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">∞</span>
          <span className="stat-label">Learning Continues</span>
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
