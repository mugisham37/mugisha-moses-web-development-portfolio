"use client";

import React, { useRef, useState, useEffect } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import "./ExperienceTimeline.css";

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

export const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({
  theme,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visibleExperiences, setVisibleExperiences] = useState<number[]>([]);

  const isVisible = useIntersectionObserver(sectionRef, {
    threshold: 0.1,
    triggerOnce: true,
  });

  // Animate experiences in sequence
  useEffect(() => {
    if (isVisible) {
      experiences.forEach((_, index) => {
        setTimeout(() => {
          setVisibleExperiences((prev) => [...prev, index]);
        }, index * 300);
      });
    }
  }, [isVisible]);

  const getCategoryColor = (category: Experience["category"]) => {
    const colors = {
      technical: theme === "extreme-brutalist" ? "#00ffff" : "#06b6d4",
      leadership: theme === "extreme-brutalist" ? "#00ff00" : "#10b981",
      learning: theme === "extreme-brutalist" ? "#ffff00" : "#8b5cf6",
      milestone: theme === "extreme-brutalist" ? "#ff6b00" : "#f59e0b",
    };
    return colors[category];
  };

  return (
    <div
      ref={sectionRef}
      className={`vertical-timeline vertical-timeline--${theme} ${
        isVisible ? "vertical-timeline--visible" : ""
      }`}
    >
      {/* Timeline Header */}
      <div className="timeline-header">
        <h3 className="timeline-title">EXPERIENCE JOURNEY</h3>
        <p className="timeline-subtitle">
          Professional growth milestones and key achievements
        </p>
      </div>

      {/* Vertical Timeline Container */}
      <div className="timeline-container">
        {/* Center Line */}
        <div className="timeline-line">
          <div className="line-progress"></div>
        </div>

        {/* Timeline Items */}
        {experiences.map((experience, index) => (
          <div
            key={index}
            className={`timeline-item ${
              index % 2 === 0 ? "timeline-item--left" : "timeline-item--right"
            } ${
              visibleExperiences.includes(index) ? "timeline-item--visible" : ""
            } ${experience.current ? "timeline-item--current" : ""}`}
            style={{
              animationDelay: `${index * 0.3}s`,
            }}
          >
            {/* Timeline Node */}
            <div
              className="timeline-node"
              style={{
                borderColor: getCategoryColor(experience.category),
                boxShadow: `0 0 20px ${getCategoryColor(experience.category)}`,
              }}
            >
              <span className="node-icon">{experience.icon}</span>
              <div className="node-year">{experience.year}</div>

              {/* Current indicator */}
              {experience.current && <div className="current-pulse"></div>}
            </div>

            {/* Experience Card */}
            <div className="experience-card">
              <div className="card-header">
                <h4 className="card-title">{experience.title}</h4>
                <span
                  className="card-category"
                  style={{ color: getCategoryColor(experience.category) }}
                >
                  {experience.category}
                </span>
              </div>

              <p className="card-description">{experience.description}</p>

              <div className="card-impact">
                <span className="impact-label">Impact:</span>
                <span className="impact-text">{experience.impact}</span>
              </div>

              {/* Metrics */}
              {experience.metrics && (
                <div className="card-metrics">
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
                <div className="card-technologies">
                  <span className="tech-label">Technologies:</span>
                  <div className="tech-tags">
                    {experience.technologies.map((tech, techIndex) => (
                      <span key={techIndex} className="tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Card Glow Effect */}
              <div
                className="card-glow"
                style={{
                  background: `linear-gradient(135deg, ${getCategoryColor(experience.category)}20, transparent)`,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Timeline Stats */}
      <div className="timeline-stats">
        <div className="stat-item">
          <span className="stat-value">{experiences.length}</span>
          <span className="stat-label">Milestones</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">6+</span>
          <span className="stat-label">Years</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">∞</span>
          <span className="stat-label">Growth</span>
        </div>
      </div>
    </div>
  );
};
