"use client";

import React, { useRef, useState, useEffect } from "react";
import { useThemeClassName } from "@/hooks/useTheme";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { portfolioData } from "@/data/portfolio";

interface SkillTreeProps {
  className?: string;
}

interface SkillNode {
  id: string;
  name: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
  category: string;
  x: number;
  y: number;
  connections: string[];
  icon: string;
  description: string;
  yearsExperience: number;
  projects: number;
}

export const SkillTree: React.FC<SkillTreeProps> = ({ className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  const isVisible = useIntersectionObserver(containerRef, {
    threshold: 0.3,
    triggerOnce: true,
  });

  const containerClassName = useThemeClassName("skill-tree", {
    "extreme-brutalist": "skill-tree--extreme",
    "refined-brutalist": "skill-tree--refined",
  });

  // Transform portfolio skills into skill tree nodes with positioning
  const baseSkillNodes = portfolioData.skills.skillTree?.nodes || [];

  // Define positions for each skill in the tree layout
  const skillPositions: Record<string, { x: number; y: number }> = {
    react: { x: 300, y: 150 },
    nextjs: { x: 500, y: 100 },
    typescript: { x: 200, y: 250 },
    nodejs: { x: 400, y: 350 },
    postgresql: { x: 600, y: 400 },
    performance: { x: 700, y: 200 },
    architecture: { x: 800, y: 300 },
    aws: { x: 600, y: 500 },
    docker: { x: 800, y: 450 },
    graphql: { x: 100, y: 400 },
  };

  const skillNodes: SkillNode[] = baseSkillNodes.map((skill) => ({
    ...skill,
    x: skillPositions[skill.id]?.x || 400,
    y: skillPositions[skill.id]?.y || 300,
  }));

  const getLevelColor = (level: string) => {
    switch (level) {
      case "expert":
        return "var(--accent-color)";
      case "advanced":
        return "var(--highlight-color)";
      case "intermediate":
        return "#10b981";
      case "beginner":
        return "#6b7280";
      default:
        return "var(--text-color)";
    }
  };

  const getLevelSize = (level: string) => {
    switch (level) {
      case "expert":
        return 80;
      case "advanced":
        return 70;
      case "intermediate":
        return 60;
      case "beginner":
        return 50;
      default:
        return 60;
    }
  };

  useEffect(() => {
    if (isVisible) {
      const timer = setInterval(() => {
        setAnimationProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(timer);
    }
  }, [isVisible]);

  const renderConnections = () => {
    return skillNodes.map((node) =>
      node.connections.map((connectionId) => {
        const targetNode = skillNodes.find((n) => n.id === connectionId);
        if (!targetNode) return null;

        const isHighlighted =
          hoveredSkill === node.id ||
          hoveredSkill === connectionId ||
          selectedSkill === node.id ||
          selectedSkill === connectionId;

        return (
          <line
            key={`${node.id}-${connectionId}`}
            x1={node.x}
            y1={node.y}
            x2={targetNode.x}
            y2={targetNode.y}
            className={`skill-tree__connection ${
              isHighlighted ? "skill-tree__connection--highlighted" : ""
            }`}
            style={{
              strokeDasharray: "200",
              strokeDashoffset: `${200 - animationProgress * 2}`,
            }}
          />
        );
      })
    );
  };

  return (
    <div
      ref={containerRef}
      className={`${containerClassName} ${className}`}
      id="skill-tree"
    >
      <div className="skill-tree__header">
        <h3 className="skill-tree__title">
          <span className="skill-tree__title-icon">🌳</span>
          <span className="skill-tree__title-text">Technical Skill Tree</span>
          <div className="skill-tree__title-effects">
            <div className="skill-tree__title-border"></div>
            <div className="skill-tree__title-shadow"></div>
          </div>
        </h3>
        <p className="skill-tree__subtitle">
          Interactive visualization of technical expertise and skill connections
        </p>
      </div>

      <div className="skill-tree__container">
        <svg
          ref={svgRef}
          className="skill-tree__svg"
          viewBox="0 0 900 600"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Connection lines */}
          <g className="skill-tree__connections">{renderConnections()}</g>

          {/* Skill nodes */}
          <g className="skill-tree__nodes">
            {skillNodes.map((skill, index) => {
              const size = getLevelSize(skill.level);
              const isHovered = hoveredSkill === skill.id;
              const isSelected = selectedSkill === skill.id;
              const nodeDelay = index * 100;
              const shouldShow = animationProgress * 10 > nodeDelay;

              return (
                <g
                  key={skill.id}
                  className={`skill-tree__node ${
                    isHovered ? "skill-tree__node--hovered" : ""
                  } ${isSelected ? "skill-tree__node--selected" : ""}`}
                  transform={`translate(${skill.x}, ${skill.y})`}
                  style={{
                    opacity: shouldShow ? 1 : 0,
                    transform: `translate(${skill.x}px, ${skill.y}px) scale(${
                      shouldShow ? 1 : 0.5
                    })`,
                    transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${nodeDelay}ms`,
                  }}
                  onMouseEnter={() => setHoveredSkill(skill.id)}
                  onMouseLeave={() => setHoveredSkill(null)}
                  onClick={() =>
                    setSelectedSkill(
                      selectedSkill === skill.id ? null : skill.id
                    )
                  }
                >
                  {/* Node background */}
                  <circle
                    className="skill-tree__node-bg"
                    r={size / 2}
                    fill={getLevelColor(skill.level)}
                  />

                  {/* Node border */}
                  <circle
                    className="skill-tree__node-border"
                    r={size / 2}
                    fill="none"
                    stroke="var(--text-color)"
                    strokeWidth="3"
                  />

                  {/* Pulse effect */}
                  <circle
                    className="skill-tree__node-pulse"
                    r={size / 2}
                    fill="none"
                    stroke={getLevelColor(skill.level)}
                    strokeWidth="2"
                    opacity="0"
                  />

                  {/* Icon */}
                  <text
                    className="skill-tree__node-icon"
                    textAnchor="middle"
                    dy="0.3em"
                    fontSize={size / 3}
                  >
                    {skill.icon}
                  </text>

                  {/* Level indicator */}
                  <circle
                    className="skill-tree__level-indicator"
                    cx={size / 3}
                    cy={-size / 3}
                    r="8"
                    fill={getLevelColor(skill.level)}
                    stroke="var(--bg-color)"
                    strokeWidth="2"
                  />
                </g>
              );
            })}
          </g>
        </svg>

        {/* Skill details panel */}
        {(hoveredSkill || selectedSkill) && (
          <div className="skill-tree__details">
            {skillNodes
              .filter((skill) => skill.id === (selectedSkill || hoveredSkill))
              .map((skill) => (
                <div key={skill.id} className="skill-tree__detail-card">
                  <div className="skill-tree__detail-header">
                    <div className="skill-tree__detail-icon">{skill.icon}</div>
                    <div className="skill-tree__detail-meta">
                      <h4 className="skill-tree__detail-title">{skill.name}</h4>
                      <div className="skill-tree__detail-level">
                        <span
                          className="skill-tree__level-badge"
                          style={{
                            backgroundColor: getLevelColor(skill.level),
                          }}
                        >
                          {skill.level.toUpperCase()}
                        </span>
                        <span className="skill-tree__category">
                          {skill.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="skill-tree__detail-description">
                    {skill.description}
                  </p>

                  <div className="skill-tree__detail-stats">
                    <div className="skill-tree__stat">
                      <span className="skill-tree__stat-icon">⏱️</span>
                      <span className="skill-tree__stat-value">
                        {skill.yearsExperience}
                      </span>
                      <span className="skill-tree__stat-label">years</span>
                    </div>
                    <div className="skill-tree__stat">
                      <span className="skill-tree__stat-icon">🚀</span>
                      <span className="skill-tree__stat-value">
                        {skill.projects}
                      </span>
                      <span className="skill-tree__stat-label">projects</span>
                    </div>
                  </div>

                  {skill.connections.length > 0 && (
                    <div className="skill-tree__connections-info">
                      <h5 className="skill-tree__connections-title">
                        Connected Skills:
                      </h5>
                      <div className="skill-tree__connection-tags">
                        {skill.connections.map((connectionId) => {
                          const connectedSkill = skillNodes.find(
                            (n) => n.id === connectionId
                          );
                          return connectedSkill ? (
                            <span
                              key={connectionId}
                              className="skill-tree__connection-tag"
                              onClick={() => setSelectedSkill(connectionId)}
                            >
                              {connectedSkill.icon} {connectedSkill.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}

                  <div className="skill-tree__detail-effects">
                    <div className="skill-tree__detail-border"></div>
                    <div className="skill-tree__detail-shadow"></div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Legend */}
        <div className="skill-tree__legend">
          <h4 className="skill-tree__legend-title">Skill Levels</h4>
          <div className="skill-tree__legend-items">
            {["expert", "advanced", "intermediate", "beginner"].map((level) => (
              <div key={level} className="skill-tree__legend-item">
                <div
                  className="skill-tree__legend-dot"
                  style={{ backgroundColor: getLevelColor(level) }}
                ></div>
                <span className="skill-tree__legend-label">{level}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillTree;
