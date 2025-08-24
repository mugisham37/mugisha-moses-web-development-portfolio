"use client";

import React, { useRef, useEffect, useCallback, useState } from "react";
import { ThemeType } from "@/types/theme";

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage?: number;
  activeEffects: string[];
  performanceCost: number;
  recommendations: string[];
}

interface EffectPerformanceMonitorProps {
  theme: ThemeType;
  isVisible?: boolean;
  onPerformanceUpdate?: (metrics: PerformanceMetrics) => void;
  warningThreshold?: number;
  criticalThreshold?: number;
  className?: string;
}

export const EffectPerformanceMonitor: React.FC<
  EffectPerformanceMonitorProps
> = ({
  theme,
  isVisible = false,
  onPerformanceUpdate,
  warningThreshold = 30,
  criticalThreshold = 20,
  className = "",
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    frameTime: 16.67,
    activeEffects: [],
    performanceCost: 0,
    recommendations: [],
  });

  const metricsRef = useRef<{
    frameCount: number;
    lastTime: number;
    frameTimes: number[];
    lastFrameTime: number;
  }>({
    frameCount: 0,
    lastTime: performance.now(),
    frameTimes: [],
    lastFrameTime: performance.now(),
  });

  const animationRef = useRef<number>();

  // Get active effects from DOM or global state
  const getActiveEffects = useCallback((): string[] => {
    const effects: string[] = [];

    // Check for active effect components
    const glitchElements = document.querySelectorAll(
      '[data-glitch-active="true"]'
    );
    if (glitchElements.length > 0) effects.push("Glitch Effect");

    const cursorTrails = document.querySelectorAll(".cursor-trail");
    if (cursorTrails.length > 0) effects.push("Cursor Trail");

    const particleSystems = document.querySelectorAll(".particle-system");
    if (particleSystems.length > 0) effects.push("Particle System");

    const visualEffects = document.querySelectorAll(".visual-effects-library");
    if (visualEffects.length > 0) effects.push("Visual Effects Library");

    const scanLines = document.querySelectorAll(".scan-lines");
    if (scanLines.length > 0) effects.push("Scan Lines");

    const gridBackgrounds = document.querySelectorAll(".grid-background");
    if (gridBackgrounds.length > 0) effects.push("Grid Background");

    return effects;
  }, []);

  // Calculate total performance cost
  const calculatePerformanceCost = useCallback((effects: string[]): number => {
    const costMap: Record<string, number> = {
      "Glitch Effect": 3,
      "Cursor Trail": 2,
      "Particle System": 4,
      "Visual Effects Library": 5,
      "Scan Lines": 2,
      "Grid Background": 2,
    };

    return effects.reduce((total, effect) => total + (costMap[effect] || 1), 0);
  }, []);

  // Generate performance recommendations
  const generateRecommendations = useCallback(
    (fps: number, cost: number, memory?: number): string[] => {
      const recommendations: string[] = [];

      if (fps < criticalThreshold) {
        recommendations.push("Critical: FPS below 20, disable heavy effects");
        recommendations.push("Consider reducing particle count");
        recommendations.push("Disable cursor trail and glitch effects");
      } else if (fps < warningThreshold) {
        recommendations.push("Warning: FPS below 30, optimize effects");
        recommendations.push("Reduce effect intensity");
        recommendations.push("Enable adaptive quality");
      }

      if (cost > 15) {
        recommendations.push("Too many effects active simultaneously");
        recommendations.push("Consider effect prioritization");
      }

      if (memory && memory > 100) {
        recommendations.push("High memory usage detected");
        recommendations.push("Check for memory leaks in effects");
      }

      if (recommendations.length === 0) {
        recommendations.push("Performance is optimal");
      }

      return recommendations;
    },
    [criticalThreshold, warningThreshold]
  );

  // Performance monitoring loop
  const monitorPerformance = useCallback(() => {
    const now = performance.now();
    const frameTime = now - metricsRef.current.lastFrameTime;
    metricsRef.current.lastFrameTime = now;
    metricsRef.current.frameCount++;

    // Track frame times for smoothing
    metricsRef.current.frameTimes.push(frameTime);
    if (metricsRef.current.frameTimes.length > 60) {
      metricsRef.current.frameTimes.shift();
    }

    // Update metrics every second
    if (now - metricsRef.current.lastTime >= 1000) {
      const avgFrameTime =
        metricsRef.current.frameTimes.reduce((a, b) => a + b, 0) /
        metricsRef.current.frameTimes.length;
      const fps = 1000 / avgFrameTime;

      // Get memory usage if available
      let memoryUsage: number | undefined;
      if ("memory" in performance) {
        const memory = (performance as any).memory;
        memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // MB
      }

      // Analyze active effects (this would be populated by effect components)
      const activeEffects = getActiveEffects();
      const performanceCost = calculatePerformanceCost(activeEffects);
      const recommendations = generateRecommendations(
        fps,
        performanceCost,
        memoryUsage
      );

      const newMetrics: PerformanceMetrics = {
        fps: Math.round(fps),
        frameTime: Math.round(avgFrameTime * 100) / 100,
        memoryUsage,
        activeEffects,
        performanceCost,
        recommendations,
      };

      setMetrics(newMetrics);
      onPerformanceUpdate?.(newMetrics);

      metricsRef.current.frameCount = 0;
      metricsRef.current.lastTime = now;
    }

    animationRef.current = requestAnimationFrame(monitorPerformance);
  }, [
    onPerformanceUpdate,
    getActiveEffects,
    calculatePerformanceCost,
    generateRecommendations,
  ]);

  // Start monitoring
  useEffect(() => {
    animationRef.current = requestAnimationFrame(monitorPerformance);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [monitorPerformance]);

  // Get status color based on performance
  const getStatusColor = useCallback(() => {
    if (metrics.fps < criticalThreshold) return "#ff0000";
    if (metrics.fps < warningThreshold) return "#ffff00";
    return "#00ff00";
  }, [metrics.fps, criticalThreshold, warningThreshold]);

  if (!isVisible) return null;

  return (
    <div
      className={`effect-performance-monitor effect-performance-monitor--${theme} ${className}`}
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        background:
          theme === "extreme-brutalist" ? "#000000" : "rgba(0, 0, 0, 0.8)",
        border:
          theme === "extreme-brutalist"
            ? "2px solid #00ff00"
            : "1px solid #8b5cf6",
        padding: "12px",
        fontFamily: "monospace",
        fontSize: "12px",
        color: theme === "extreme-brutalist" ? "#00ff00" : "#ffffff",
        zIndex: 10000,
        minWidth: "250px",
        backdropFilter: theme === "refined-brutalist" ? "blur(10px)" : "none",
      }}
    >
      <div style={{ marginBottom: "8px", fontWeight: "bold" }}>
        EFFECT PERFORMANCE MONITOR
      </div>

      <div style={{ marginBottom: "4px" }}>
        <span style={{ color: getStatusColor() }}>●</span> FPS: {metrics.fps}
      </div>

      <div style={{ marginBottom: "4px" }}>
        Frame Time: {metrics.frameTime}ms
      </div>

      {metrics.memoryUsage && (
        <div style={{ marginBottom: "4px" }}>
          Memory: {metrics.memoryUsage.toFixed(1)}MB
        </div>
      )}

      <div style={{ marginBottom: "4px" }}>
        Performance Cost: {metrics.performanceCost}
      </div>

      {metrics.activeEffects.length > 0 && (
        <div style={{ marginBottom: "8px" }}>
          <div style={{ marginBottom: "2px" }}>Active Effects:</div>
          {metrics.activeEffects.map((effect, index) => (
            <div key={index} style={{ fontSize: "10px", marginLeft: "8px" }}>
              • {effect}
            </div>
          ))}
        </div>
      )}

      {metrics.recommendations.length > 0 && (
        <div>
          <div style={{ marginBottom: "2px", fontWeight: "bold" }}>
            Recommendations:
          </div>
          {metrics.recommendations.map((rec, index) => (
            <div
              key={index}
              style={{
                fontSize: "10px",
                marginLeft: "8px",
                color: rec.startsWith("Critical")
                  ? "#ff0000"
                  : rec.startsWith("Warning")
                    ? "#ffff00"
                    : rec.startsWith("Performance is optimal")
                      ? "#00ff00"
                      : "inherit",
              }}
            >
              • {rec}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EffectPerformanceMonitor;
