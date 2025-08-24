"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

interface HeroVisualProps {
  className?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  year: string;
  color: string;
}

interface CodeSnippet {
  language: string;
  code: string;
  filename: string;
}

const achievements: Achievement[] = [
  {
    id: "performance",
    title: "Performance Expert",
    description: "Optimized applications to achieve 99.9% uptime",
    icon: "⚡",
    year: "2024",
    color: "#ffff00",
  },
  {
    id: "architecture",
    title: "System Architect",
    description: "Designed scalable systems handling millions of users",
    icon: "🏗️",
    year: "2023",
    color: "#00ffff",
  },
  {
    id: "revenue",
    title: "Revenue Generator",
    description: "Generated $2.5M+ in measurable business value",
    icon: "💰",
    year: "2024",
    color: "#00ff00",
  },
  {
    id: "innovation",
    title: "Innovation Leader",
    description: "Led digital transformation initiatives",
    icon: "🚀",
    year: "2023",
    color: "#ff00ff",
  },
];

const codeSnippets: CodeSnippet[] = [
  {
    language: "typescript",
    filename: "performance-optimizer.ts",
    code: `const optimizePerformance = async () => {
  const metrics = await measureCoreWebVitals();
  if (metrics.lcp > 2500) {
    await implementLazyLoading();
    await optimizeImages();
  }
  return metrics.score > 95;
};`,
  },
  {
    language: "javascript",
    filename: "revenue-tracker.js",
    code: `class RevenueTracker {
  constructor() {
    this.totalGenerated = 2500000;
    this.conversionRate = 0.15;
  }
  
  calculateROI(investment) {
    return (this.totalGenerated / investment) * 100;
  }
}`,
  },
  {
    language: "typescript",
    filename: "system-architect.ts",
    code: `interface ScalableSystem {
  handleLoad: (users: number) => Promise<boolean>;
  autoScale: () => void;
  maintainUptime: () => Promise<number>;
}

const buildSystem = (): ScalableSystem => ({
  handleLoad: async (users) => users < 1000000,
  autoScale: () => console.log("Scaling..."),
  maintainUptime: async () => 99.9
});`,
  },
];

export const HeroVisual: React.FC<HeroVisualProps> = ({ className = "" }) => {
  const { currentTheme, config } = useThemeContext();
  const [currentCodeIndex, setCurrentCodeIndex] = useState(0);
  const [typedCode, setTypedCode] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [hoveredAchievement, setHoveredAchievement] = useState<string | null>(
    null
  );

  const visualRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(visualRef, {
    threshold: 0.2,
    rootMargin: "0px",
    triggerOnce: true,
  });

  // Start animations when visible
  useEffect(() => {
    if (isVisible) {
      setTimeout(() => setShowAchievements(true), 1000);
      setTimeout(() => setIsTyping(true), 1500);
    }
  }, [isVisible]);

  // Typewriter effect for code
  useEffect(() => {
    if (!isTyping) return;

    const currentSnippet = codeSnippets[currentCodeIndex];
    let currentIndex = 0;

    const typeCode = () => {
      if (currentIndex < currentSnippet.code.length) {
        setTypedCode(currentSnippet.code.slice(0, currentIndex + 1));
        currentIndex++;
        setTimeout(typeCode, 50 + Math.random() * 50); // Variable typing speed
      } else {
        // Wait then switch to next snippet
        setTimeout(() => {
          setCurrentCodeIndex((prev) => (prev + 1) % codeSnippets.length);
          setTypedCode("");
          currentIndex = 0;
        }, 3000);
      }
    };

    typeCode();
  }, [currentCodeIndex, isTyping]);

  return (
    <div
      ref={visualRef}
      className={`hero-visual hero-visual--${currentTheme} ${className}`}
      style={
        {
          "--visual-text": config.colors.text,
          "--visual-accent": config.colors.accent,
          "--visual-highlight": config.colors.highlight,
          "--visual-bg": config.colors.bg,
          "--visual-border-width": config.borders.width,
          "--visual-border-radius": config.borders.radius,
          "--visual-animation-duration": config.animations.duration,
          "--visual-animation-easing": config.animations.easing,
        } as React.CSSProperties
      }
    >
      {/* Portrait Section */}
      <div className="hero-visual__portrait-container">
        {/* Portrait Frame with Scan Effects */}
        <div className="hero-visual__portrait-frame">
          {/* Frame Corners */}
          <div
            className="hero-visual__frame-corner hero-visual__frame-corner--tl"
            aria-hidden="true"
          />
          <div
            className="hero-visual__frame-corner hero-visual__frame-corner--tr"
            aria-hidden="true"
          />
          <div
            className="hero-visual__frame-corner hero-visual__frame-corner--bl"
            aria-hidden="true"
          />
          <div
            className="hero-visual__frame-corner hero-visual__frame-corner--br"
            aria-hidden="true"
          />

          {/* Portrait Image */}
          <div className="hero-visual__portrait-wrapper">
            <Image
              src="/hero-portrait.jpg"
              alt="Professional portrait of the developer"
              width={400}
              height={500}
              priority
              className="hero-visual__portrait-image"
              sizes="(max-width: 768px) 300px, 400px"
            />

            {/* Scan Effect Overlay */}
            <div className="hero-visual__scan-overlay" aria-hidden="true">
              <div className="hero-visual__scan-line"></div>
              <div className="hero-visual__scan-grid"></div>
              <div className="hero-visual__scan-noise"></div>
            </div>

            {/* Status Indicators */}
            <div className="hero-visual__status-indicators" aria-hidden="true">
              <div className="hero-visual__status-dot hero-visual__status-dot--online"></div>
              <span className="hero-visual__status-text">ONLINE</span>
            </div>
          </div>

          {/* Frame Effects */}
          <div className="hero-visual__frame-effects" aria-hidden="true">
            <div className="hero-visual__frame-glow"></div>
            <div className="hero-visual__frame-shadow"></div>
          </div>
        </div>

        {/* Floating Achievement Badges */}
        {showAchievements && (
          <div className="hero-visual__achievements">
            {achievements.map((achievement, index) => (
              <div
                key={achievement.id}
                className={`hero-visual__achievement-badge hero-visual__achievement-badge--${index + 1}`}
                style={
                  {
                    animationDelay: `${index * 200}ms`,
                    "--badge-color": achievement.color,
                  } as React.CSSProperties
                }
                onMouseEnter={() => setHoveredAchievement(achievement.id)}
                onMouseLeave={() => setHoveredAchievement(null)}
              >
                {/* Badge Icon */}
                <div className="hero-visual__badge-icon">
                  <span className="hero-visual__badge-emoji">
                    {achievement.icon}
                  </span>
                </div>

                {/* Badge Effects */}
                <div className="hero-visual__badge-effects" aria-hidden="true">
                  <div className="hero-visual__badge-glow"></div>
                  <div className="hero-visual__badge-pulse"></div>
                </div>

                {/* Tooltip */}
                {hoveredAchievement === achievement.id && (
                  <div className="hero-visual__achievement-tooltip">
                    <div className="hero-visual__tooltip-content">
                      <h4 className="hero-visual__tooltip-title">
                        {achievement.title}
                      </h4>
                      <p className="hero-visual__tooltip-description">
                        {achievement.description}
                      </p>
                      <span className="hero-visual__tooltip-year">
                        {achievement.year}
                      </span>
                    </div>
                    <div
                      className="hero-visual__tooltip-arrow"
                      aria-hidden="true"
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Live Code Display */}
      <div className="hero-visual__code-container">
        <div className="hero-visual__code-window">
          {/* Window Header */}
          <div className="hero-visual__code-header">
            <div className="hero-visual__window-controls">
              <span className="hero-visual__window-control hero-visual__window-control--close"></span>
              <span className="hero-visual__window-control hero-visual__window-control--minimize"></span>
              <span className="hero-visual__window-control hero-visual__window-control--maximize"></span>
            </div>
            <div className="hero-visual__code-filename">
              {codeSnippets[currentCodeIndex]?.filename}
            </div>
            <div className="hero-visual__code-status">
              <span className="hero-visual__code-status-dot"></span>
              <span className="hero-visual__code-status-text">LIVE</span>
            </div>
          </div>

          {/* Code Content */}
          <div className="hero-visual__code-content">
            <div className="hero-visual__code-lines">
              {typedCode.split("\n").map((line, index) => (
                <div key={index} className="hero-visual__code-line">
                  <span className="hero-visual__line-number">{index + 1}</span>
                  <span className="hero-visual__line-content">
                    <SyntaxHighlighter
                      code={line}
                      language={
                        codeSnippets[currentCodeIndex]?.language || "typescript"
                      }
                    />
                  </span>
                </div>
              ))}
              {isTyping && <span className="hero-visual__code-cursor">|</span>}
            </div>
          </div>

          {/* Code Footer */}
          <div className="hero-visual__code-footer">
            <div className="hero-visual__code-stats">
              <span className="hero-visual__code-stat">
                Lines: {typedCode.split("\n").length}
              </span>
              <span className="hero-visual__code-stat">
                Lang: {codeSnippets[currentCodeIndex]?.language.toUpperCase()}
              </span>
            </div>
            <div className="hero-visual__code-indicator">
              <div className="hero-visual__code-pulse"></div>
            </div>
          </div>
        </div>

        {/* Code Background Effects */}
        <div className="hero-visual__code-effects" aria-hidden="true">
          <div className="hero-visual__code-glow"></div>
          <div className="hero-visual__code-shadow"></div>
          <div className="hero-visual__code-scan"></div>
        </div>
      </div>

      {/* Background Visual Effects */}
      <div className="hero-visual__bg-effects" aria-hidden="true">
        <div className="hero-visual__bg-grid"></div>
        <div className="hero-visual__bg-particles"></div>
        <div className="hero-visual__bg-glow"></div>
      </div>
    </div>
  );
};

// Simple syntax highlighter component
interface SyntaxHighlighterProps {
  code: string;
  language: string;
}

const SyntaxHighlighter: React.FC<SyntaxHighlighterProps> = ({
  code,
  language,
}) => {
  const highlightCode = (code: string, language: string) => {
    // Simple syntax highlighting patterns
    const patterns = {
      typescript: [
        {
          pattern:
            /\b(const|let|var|function|class|interface|type|async|await|return|if|else|for|while|try|catch)\b/g,
          className: "keyword",
        },
        {
          pattern: /\b(string|number|boolean|void|Promise|Array)\b/g,
          className: "type",
        },
        { pattern: /"[^"]*"/g, className: "string" },
        { pattern: /\/\/.*$/gm, className: "comment" },
        { pattern: /\b\d+(\.\d+)?\b/g, className: "number" },
      ],
      javascript: [
        {
          pattern:
            /\b(const|let|var|function|class|async|await|return|if|else|for|while|try|catch|this)\b/g,
          className: "keyword",
        },
        { pattern: /"[^"]*"/g, className: "string" },
        { pattern: /\/\/.*$/gm, className: "comment" },
        { pattern: /\b\d+(\.\d+)?\b/g, className: "number" },
      ],
    };

    let highlightedCode = code;
    const languagePatterns =
      patterns[language as keyof typeof patterns] || patterns.typescript;

    languagePatterns.forEach(({ pattern, className }) => {
      highlightedCode = highlightedCode.replace(
        pattern,
        (match) =>
          `<span class="hero-visual__syntax-${className}">${match}</span>`
      );
    });

    return highlightedCode;
  };

  return (
    <span
      dangerouslySetInnerHTML={{
        __html: highlightCode(code, language),
      }}
    />
  );
};

export default HeroVisual;
