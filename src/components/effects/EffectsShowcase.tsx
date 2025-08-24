"use client";

import React, { useState, useCallback } from "react";
import { ThemeType } from "@/types/theme";
import { GlitchEffect } from "./GlitchEffect";
import { CursorTrail } from "./CursorTrail";
import { VisualEffectsLibrary, EffectType } from "./VisualEffectsLibrary";
import { EffectPerformanceMonitor } from "./EffectPerformanceMonitor";

interface EffectsShowcaseProps {
  theme: ThemeType;
  className?: string;
}

export const EffectsShowcase: React.FC<EffectsShowcaseProps> = ({
  theme,
  className = "",
}) => {
  const [activeEffects, setActiveEffects] = useState<EffectType[]>([
    "scanlines",
  ]);
  const [glitchActive, setGlitchActive] = useState(true);
  const [cursorTrailActive, setCursorTrailActive] = useState(true);
  const [visualEffectsActive, setVisualEffectsActive] = useState(true);
  const [performanceMonitorVisible, setPerformanceMonitorVisible] =
    useState(false);
  const [effectIntensity, setEffectIntensity] = useState(1);
  const [glitchTrigger, setGlitchTrigger] = useState<
    "auto" | "hover" | "manual"
  >("auto");
  const [cursorParticleMode, setCursorParticleMode] = useState(false);

  const availableEffects: EffectType[] = [
    "scanlines",
    "crt",
    "matrix",
    "terminal",
    "hologram",
    "neon-glow",
    "data-stream",
    "circuit-board",
    "glitch-bars",
    "pixel-rain",
  ];

  const toggleEffect = useCallback((effect: EffectType) => {
    setActiveEffects((prev) =>
      prev.includes(effect)
        ? prev.filter((e) => e !== effect)
        : [...prev, effect]
    );
  }, []);

  const handlePerformanceUpdate = useCallback(
    (metrics: any) => {
      // Auto-adjust effects based on performance
      if (metrics.fps < 20 && activeEffects.length > 2) {
        setActiveEffects((prev) => prev.slice(0, 1));
        setEffectIntensity(0.5);
      }
    },
    [activeEffects.length]
  );

  return (
    <div className={`effects-showcase effects-showcase--${theme} ${className}`}>
      {/* Performance Monitor */}
      <EffectPerformanceMonitor
        theme={theme}
        isVisible={performanceMonitorVisible}
        onPerformanceUpdate={handlePerformanceUpdate}
      />

      {/* Cursor Trail */}
      <CursorTrail
        theme={theme}
        isActive={cursorTrailActive}
        trailLength={20}
        trailSize={4}
        enablePerformanceMonitoring={true}
        adaptiveQuality={true}
        particleMode={cursorParticleMode}
      />

      {/* Visual Effects Library */}
      <VisualEffectsLibrary
        theme={theme}
        effects={activeEffects}
        intensity={effectIntensity}
        isActive={visualEffectsActive}
        enablePerformanceMonitoring={true}
      />

      {/* Main Content with Glitch Effect */}
      <div className="effects-showcase__content">
        <GlitchEffect
          theme={theme}
          isActive={glitchActive}
          intensity={effectIntensity}
          frequency={0.1}
          duration={200}
          trigger={glitchTrigger}
          enablePerformanceMonitoring={true}
          onGlitchStart={() => console.log("Glitch started")}
          onGlitchEnd={() => console.log("Glitch ended")}
        >
          <h1 className="effects-showcase__title">
            BRUTALIST EFFECTS SHOWCASE
          </h1>
        </GlitchEffect>

        <div className="effects-showcase__description">
          <p>
            Experience the full power of the brutalist visual effects system.
            This showcase demonstrates advanced glitch effects, cursor trails,
            and a comprehensive visual effects library with performance
            monitoring.
          </p>
        </div>

        {/* Controls */}
        <div className="effects-showcase__controls">
          <div className="control-group">
            <h3>Effect Controls</h3>

            <label>
              <input
                type="checkbox"
                checked={glitchActive}
                onChange={(e) => setGlitchActive(e.target.checked)}
              />
              Glitch Effect
            </label>

            <label>
              <input
                type="checkbox"
                checked={cursorTrailActive}
                onChange={(e) => setCursorTrailActive(e.target.checked)}
              />
              Cursor Trail
            </label>

            <label>
              <input
                type="checkbox"
                checked={visualEffectsActive}
                onChange={(e) => setVisualEffectsActive(e.target.checked)}
              />
              Visual Effects
            </label>

            <label>
              <input
                type="checkbox"
                checked={performanceMonitorVisible}
                onChange={(e) => setPerformanceMonitorVisible(e.target.checked)}
              />
              Performance Monitor
            </label>
          </div>

          <div className="control-group">
            <h3>Effect Settings</h3>

            <label>
              Intensity: {effectIntensity}
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={effectIntensity}
                onChange={(e) => setEffectIntensity(parseFloat(e.target.value))}
              />
            </label>

            <label>
              Glitch Trigger:
              <select
                value={glitchTrigger}
                onChange={(e) => setGlitchTrigger(e.target.value as any)}
              >
                <option value="auto">Auto</option>
                <option value="hover">Hover</option>
                <option value="manual">Manual</option>
              </select>
            </label>

            <label>
              <input
                type="checkbox"
                checked={cursorParticleMode}
                onChange={(e) => setCursorParticleMode(e.target.checked)}
              />
              Cursor Particle Mode
            </label>
          </div>

          <div className="control-group">
            <h3>Visual Effects</h3>
            {availableEffects.map((effect) => (
              <label key={effect}>
                <input
                  type="checkbox"
                  checked={activeEffects.includes(effect)}
                  onChange={() => toggleEffect(effect)}
                />
                {effect.replace("-", " ").toUpperCase()}
              </label>
            ))}
          </div>
        </div>

        {/* Demo Elements */}
        <div className="effects-showcase__demo">
          <div className="demo-card">
            <GlitchEffect
              theme={theme}
              isActive={glitchActive}
              intensity={effectIntensity * 0.8}
              trigger="hover"
            >
              <h3>HOVER FOR GLITCH</h3>
              <p>This card demonstrates hover-triggered glitch effects.</p>
            </GlitchEffect>
          </div>

          <div className="demo-card">
            <h3>PERFORMANCE OPTIMIZED</h3>
            <p>
              All effects include performance monitoring and adaptive quality to
              maintain smooth 60fps performance across devices.
            </p>
          </div>

          <div className="demo-card">
            <h3>THEME AWARE</h3>
            <p>
              Effects automatically adapt to the current theme, providing
              different visual styles for extreme and refined brutalist modes.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .effects-showcase {
          min-height: 100vh;
          padding: 2rem;
          position: relative;
        }

        .effects-showcase--extreme-brutalist {
          background: #000000;
          color: #00ff00;
          font-family: "Space Mono", monospace;
        }

        .effects-showcase--refined-brutalist {
          background: #1a1a1a;
          color: #f5f5f5;
          font-family: "Inter", sans-serif;
        }

        .effects-showcase__content {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
        }

        .effects-showcase__title {
          font-size: 3rem;
          font-weight: bold;
          text-align: center;
          margin-bottom: 2rem;
          text-shadow: ${theme === "extreme-brutalist"
            ? "4px 4px 0 #ffff00, 8px 8px 0 #ffffff"
            : "2px 2px 4px rgba(139, 92, 246, 0.5)"};
        }

        .effects-showcase__description {
          text-align: center;
          margin-bottom: 3rem;
          font-size: 1.2rem;
          line-height: 1.6;
        }

        .effects-showcase__controls {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
          padding: 2rem;
          border: ${theme === "extreme-brutalist"
            ? "4px solid #00ff00"
            : "2px solid #8b5cf6"};
          background: ${theme === "extreme-brutalist"
            ? "rgba(0, 255, 0, 0.1)"
            : "rgba(139, 92, 246, 0.1)"};
        }

        .control-group h3 {
          margin-bottom: 1rem;
          color: ${theme === "extreme-brutalist" ? "#ffff00" : "#8b5cf6"};
          text-transform: uppercase;
          font-weight: bold;
        }

        .control-group label {
          display: block;
          margin-bottom: 0.5rem;
          cursor: pointer;
        }

        .control-group input[type="checkbox"] {
          margin-right: 0.5rem;
        }

        .control-group input[type="range"] {
          width: 100%;
          margin-top: 0.5rem;
        }

        .control-group select {
          margin-left: 0.5rem;
          background: ${theme === "extreme-brutalist" ? "#000000" : "#2a2a2a"};
          color: inherit;
          border: 1px solid
            ${theme === "extreme-brutalist" ? "#00ff00" : "#8b5cf6"};
          padding: 0.25rem;
        }

        .effects-showcase__demo {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .demo-card {
          padding: 2rem;
          border: ${theme === "extreme-brutalist"
            ? "4px solid #ffffff"
            : "2px solid #8b5cf6"};
          background: ${theme === "extreme-brutalist"
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(139, 92, 246, 0.1)"};
          transition: all 0.3s ease;
        }

        .demo-card:hover {
          transform: ${theme === "extreme-brutalist"
            ? "translate(4px, 4px)"
            : "translateY(-4px)"};
          box-shadow: ${theme === "extreme-brutalist"
            ? "8px 8px 0 #ffff00"
            : "0 8px 24px rgba(139, 92, 246, 0.3)"};
        }

        .demo-card h3 {
          margin-bottom: 1rem;
          color: ${theme === "extreme-brutalist" ? "#ffff00" : "#8b5cf6"};
          font-weight: bold;
        }

        .demo-card p {
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .effects-showcase {
            padding: 1rem;
          }

          .effects-showcase__title {
            font-size: 2rem;
          }

          .effects-showcase__controls {
            grid-template-columns: 1fr;
            padding: 1rem;
          }

          .effects-showcase__demo {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default EffectsShowcase;
