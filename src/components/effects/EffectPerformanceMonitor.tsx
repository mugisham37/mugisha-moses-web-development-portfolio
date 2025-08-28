"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { ThemeType } from "@/types/theme";

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage?: number;
  renderTime: number;
  effectsCount: number;
}

interface EffectPerformanceMonitorProps {
  theme: ThemeType;
  isVisible: boolean;
  onPerformanceUpdate?: (metrics: PerformanceMetrics) => void;
  updateInterval?: number;
  className?: string;
}

export const EffectPerformanceMonitor: React.FC<
  EffectPerformanceMonitorProps
> = ({
  theme,
  isVisible,
  onPerformanceUpdate,
  updateInterval = 1000,
  className = "",
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    frameTime: 16.67,
    renderTime: 0,
    effectsCount: 0,
  });

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const animationFrameRef = useRef<number>();
  const updateTimeoutRef = useRef<NodeJS.Timeout>();

  const measurePerformance = useCallback(() => {
    const now = performance.now();
    const deltaTime = now - lastTimeRef.current;

    frameCountRef.current++;

    // Calculate FPS every second
    if (deltaTime >= updateInterval) {
      const fps = Math.round((frameCountRef.current * 1000) / deltaTime);
      const frameTime = deltaTime / frameCountRef.current;

      // Get memory usage if available
      let memoryUsage: number | undefined;
      if ("memory" in performance) {
        const memory = (performance as any).memory;
        memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024);
      }

      const newMetrics: PerformanceMetrics = {
        fps,
        frameTime,
        memoryUsage,
        renderTime: frameTime,
        effectsCount: document.querySelectorAll("[data-effect]").length,
      };

      setMetrics(newMetrics);
      onPerformanceUpdate?.(newMetrics);

      // Reset counters
      frameCountRef.current = 0;
      lastTimeRef.current = now;
    }

    animationFrameRef.current = requestAnimationFrame(measurePerformance);
  }, [updateInterval, onPerformanceUpdate]);

  useEffect(() => {
    if (isVisible) {
      measurePerformance();
    }

    return () => {
      const currentAnimationFrame = animationFrameRef.current;
      const currentUpdateTimeout = updateTimeoutRef.current;

      if (currentAnimationFrame) {
        cancelAnimationFrame(currentAnimationFrame);
        animationFrameRef.current = undefined;
      }
      if (currentUpdateTimeout) {
        clearTimeout(currentUpdateTimeout);
        updateTimeoutRef.current = undefined;
      }
    };
  }, [isVisible, measurePerformance]);

  const getPerformanceStatus = (fps: number) => {
    if (fps >= 55) return { status: "excellent", color: "#00ff00" };
    if (fps >= 45) return { status: "good", color: "#ffff00" };
    if (fps >= 30) return { status: "fair", color: "#ff8800" };
    return { status: "poor", color: "#ff0000" };
  };

  const performanceStatus = getPerformanceStatus(metrics.fps);

  if (!isVisible) return null;

  return (
    <div
      className={`performance-monitor performance-monitor--${theme} ${className}`}
    >
      <div className="performance-monitor__header">
        <h3>Performance Monitor</h3>
        <div
          className="performance-monitor__status"
          style={{ color: performanceStatus.color }}
        >
          {performanceStatus.status.toUpperCase()}
        </div>
      </div>

      <div className="performance-monitor__metrics">
        <div className="metric">
          <span className="metric__label">FPS:</span>
          <span
            className="metric__value"
            style={{ color: performanceStatus.color }}
          >
            {metrics.fps}
          </span>
        </div>

        <div className="metric">
          <span className="metric__label">Frame Time:</span>
          <span className="metric__value">
            {metrics.frameTime.toFixed(2)}ms
          </span>
        </div>

        <div className="metric">
          <span className="metric__label">Effects:</span>
          <span className="metric__value">{metrics.effectsCount}</span>
        </div>

        {metrics.memoryUsage && (
          <div className="metric">
            <span className="metric__label">Memory:</span>
            <span className="metric__value">{metrics.memoryUsage}MB</span>
          </div>
        )}
      </div>

      <div className="performance-monitor__chart">
        <div
          className="fps-bar"
          style={{
            width: `${Math.min((metrics.fps / 60) * 100, 100)}%`,
            backgroundColor: performanceStatus.color,
          }}
        />
      </div>

      <style jsx>{`
        .performance-monitor {
          position: fixed;
          top: 20px;
          right: 20px;
          width: 250px;
          padding: 1rem;
          font-family: "Space Mono", monospace;
          font-size: 0.8rem;
          z-index: 9999;
          backdrop-filter: blur(10px);
          border-radius: 4px;
        }

        .performance-monitor--extreme-brutalist {
          background: rgba(0, 0, 0, 0.9);
          border: 2px solid #00ff00;
          color: #00ff00;
          box-shadow: 4px 4px 0 #ffff00;
        }

        .performance-monitor--refined-brutalist {
          background: rgba(26, 26, 26, 0.95);
          border: 1px solid #8b5cf6;
          color: #f5f5f5;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }

        .performance-monitor__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid currentColor;
        }

        .performance-monitor__header h3 {
          margin: 0;
          font-size: 0.9rem;
          font-weight: bold;
          text-transform: uppercase;
        }

        .performance-monitor__status {
          font-weight: bold;
          font-size: 0.7rem;
        }

        .performance-monitor__metrics {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .metric {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .metric__label {
          font-size: 0.7rem;
          opacity: 0.8;
        }

        .metric__value {
          font-weight: bold;
          font-size: 0.8rem;
        }

        .performance-monitor__chart {
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          overflow: hidden;
          position: relative;
        }

        .fps-bar {
          height: 100%;
          transition:
            width 0.3s ease,
            background-color 0.3s ease;
          border-radius: 2px;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .performance-monitor {
            top: 10px;
            right: 10px;
            width: 200px;
            padding: 0.75rem;
            font-size: 0.7rem;
          }

          .performance-monitor__header h3 {
            font-size: 0.8rem;
          }

          .performance-monitor__metrics {
            grid-template-columns: 1fr;
            gap: 0.25rem;
          }

          .metric__label {
            font-size: 0.6rem;
          }

          .metric__value {
            font-size: 0.7rem;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .fps-bar {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
};

export default EffectPerformanceMonitor;
