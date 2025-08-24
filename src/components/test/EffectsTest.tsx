"use client";

import React, { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import {
  GlitchEffect,
  CursorTrail,
  VisualEffectsLibrary,
  EffectPerformanceMonitor,
  EffectsShowcase,
  EffectType,
} from "@/components/effects";

export const EffectsTest: React.FC = () => {
  const { currentTheme } = useTheme();
  const [testMode, setTestMode] = useState<"individual" | "showcase">(
    "individual"
  );
  const [showPerformanceMonitor, setShowPerformanceMonitor] = useState(true);

  const testEffects: EffectType[] = ["scanlines", "crt", "matrix"];

  if (testMode === "showcase") {
    return (
      <div className="effects-test">
        <div className="test-controls">
          <button onClick={() => setTestMode("individual")}>
            Switch to Individual Tests
          </button>
        </div>
        <EffectsShowcase theme={currentTheme} />
      </div>
    );
  }

  return (
    <div className="effects-test">
      <EffectPerformanceMonitor
        theme={currentTheme}
        isVisible={showPerformanceMonitor}
        onPerformanceUpdate={(metrics) => {
          console.log("Performance metrics:", metrics);
        }}
      />

      <CursorTrail
        theme={currentTheme}
        isActive={true}
        trailLength={15}
        trailSize={3}
        enablePerformanceMonitoring={true}
        adaptiveQuality={true}
        particleMode={false}
      />

      <VisualEffectsLibrary
        theme={currentTheme}
        effects={testEffects}
        intensity={0.8}
        isActive={true}
        enablePerformanceMonitoring={true}
      />

      <div className="test-content">
        <div className="test-controls">
          <button onClick={() => setTestMode("showcase")}>
            Switch to Full Showcase
          </button>
          <button
            onClick={() => setShowPerformanceMonitor(!showPerformanceMonitor)}
          >
            {showPerformanceMonitor ? "Hide" : "Show"} Performance Monitor
          </button>
        </div>

        <div className="test-section">
          <h2>Enhanced Glitch Effect Test</h2>

          <div className="test-grid">
            <div className="test-item">
              <h3>Auto Trigger</h3>
              <GlitchEffect
                theme={currentTheme}
                isActive={true}
                intensity={1}
                frequency={0.2}
                duration={300}
                trigger="auto"
                enablePerformanceMonitoring={true}
              >
                <div className="test-content-box">AUTO GLITCH EFFECT</div>
              </GlitchEffect>
            </div>

            <div className="test-item">
              <h3>Hover Trigger</h3>
              <GlitchEffect
                theme={currentTheme}
                isActive={true}
                intensity={1.5}
                duration={200}
                trigger="hover"
                enablePerformanceMonitoring={true}
              >
                <div className="test-content-box">HOVER FOR GLITCH</div>
              </GlitchEffect>
            </div>

            <div className="test-item">
              <h3>High Intensity</h3>
              <GlitchEffect
                theme={currentTheme}
                isActive={true}
                intensity={2}
                frequency={0.3}
                duration={400}
                trigger="auto"
                enablePerformanceMonitoring={true}
              >
                <div className="test-content-box">EXTREME GLITCH</div>
              </GlitchEffect>
            </div>
          </div>
        </div>

        <div className="test-section">
          <h2>Visual Effects Library Test</h2>
          <p>Background effects are active: {testEffects.join(", ")}</p>
          <p>Move your cursor around to see the enhanced cursor trail.</p>
          <p>Check the performance monitor for real-time metrics.</p>
        </div>

        <div className="test-section">
          <h2>Performance Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <h4>Glitch Effect Features</h4>
              <ul>
                <li>Configurable intensity and timing</li>
                <li>Multiple trigger modes (auto, hover, manual)</li>
                <li>Theme-aware visual styles</li>
                <li>Performance monitoring</li>
                <li>Enhanced layer effects</li>
              </ul>
            </div>

            <div className="info-item">
              <h4>Cursor Trail Features</h4>
              <ul>
                <li>Adaptive quality based on performance</li>
                <li>Particle mode support</li>
                <li>Theme-aware rendering</li>
                <li>Performance optimization</li>
                <li>Smooth animations</li>
              </ul>
            </div>

            <div className="info-item">
              <h4>Visual Effects Library</h4>
              <ul>
                <li>10+ different effect types</li>
                <li>Performance cost calculation</li>
                <li>Theme-aware implementations</li>
                <li>Real-time performance monitoring</li>
                <li>Configurable intensity</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .effects-test {
          min-height: 100vh;
          padding: 2rem;
          background: ${currentTheme === "extreme-brutalist"
            ? "#000000"
            : "#1a1a1a"};
          color: ${currentTheme === "extreme-brutalist"
            ? "#00ff00"
            : "#f5f5f5"};
          font-family: ${currentTheme === "extreme-brutalist"
            ? "'Space Mono', monospace"
            : "'Inter', sans-serif"};
        }

        .test-content {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
        }

        .test-controls {
          margin-bottom: 2rem;
          text-align: center;
        }

        .test-controls button {
          margin: 0 1rem;
          padding: 0.5rem 1rem;
          background: ${currentTheme === "extreme-brutalist"
            ? "#00ff00"
            : "#8b5cf6"};
          color: ${currentTheme === "extreme-brutalist"
            ? "#000000"
            : "#ffffff"};
          border: none;
          font-family: inherit;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .test-controls button:hover {
          transform: ${currentTheme === "extreme-brutalist"
            ? "translate(2px, 2px)"
            : "translateY(-2px)"};
          box-shadow: ${currentTheme === "extreme-brutalist"
            ? "4px 4px 0 #ffff00"
            : "0 4px 12px rgba(139, 92, 246, 0.3)"};
        }

        .test-section {
          margin-bottom: 3rem;
          padding: 2rem;
          border: ${currentTheme === "extreme-brutalist"
            ? "2px solid #00ff00"
            : "1px solid #8b5cf6"};
          background: ${currentTheme === "extreme-brutalist"
            ? "rgba(0, 255, 0, 0.05)"
            : "rgba(139, 92, 246, 0.05)"};
        }

        .test-section h2 {
          margin-bottom: 1rem;
          color: ${currentTheme === "extreme-brutalist"
            ? "#ffff00"
            : "#8b5cf6"};
          text-transform: uppercase;
          font-weight: bold;
        }

        .test-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .test-item {
          text-align: center;
        }

        .test-item h3 {
          margin-bottom: 1rem;
          color: ${currentTheme === "extreme-brutalist"
            ? "#ffffff"
            : "#f5f5f5"};
        }

        .test-content-box {
          padding: 2rem;
          border: ${currentTheme === "extreme-brutalist"
            ? "4px solid #ffffff"
            : "2px solid #8b5cf6"};
          background: ${currentTheme === "extreme-brutalist"
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(139, 92, 246, 0.1)"};
          font-weight: bold;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .test-content-box:hover {
          transform: ${currentTheme === "extreme-brutalist"
            ? "translate(4px, 4px)"
            : "translateY(-4px)"};
          box-shadow: ${currentTheme === "extreme-brutalist"
            ? "8px 8px 0 #ffff00"
            : "0 8px 24px rgba(139, 92, 246, 0.3)"};
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .info-item {
          padding: 1.5rem;
          border: ${currentTheme === "extreme-brutalist"
            ? "2px solid #ffffff"
            : "1px solid #8b5cf6"};
          background: ${currentTheme === "extreme-brutalist"
            ? "rgba(255, 255, 255, 0.05)"
            : "rgba(139, 92, 246, 0.05)"};
        }

        .info-item h4 {
          margin-bottom: 1rem;
          color: ${currentTheme === "extreme-brutalist"
            ? "#ffff00"
            : "#8b5cf6"};
          font-weight: bold;
        }

        .info-item ul {
          list-style: none;
          padding: 0;
        }

        .info-item li {
          margin-bottom: 0.5rem;
          padding-left: 1rem;
          position: relative;
        }

        .info-item li::before {
          content: "▶";
          position: absolute;
          left: 0;
          color: ${currentTheme === "extreme-brutalist"
            ? "#00ff00"
            : "#8b5cf6"};
        }

        @media (max-width: 768px) {
          .effects-test {
            padding: 1rem;
          }

          .test-grid,
          .info-grid {
            grid-template-columns: 1fr;
          }

          .test-section {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default EffectsTest;
