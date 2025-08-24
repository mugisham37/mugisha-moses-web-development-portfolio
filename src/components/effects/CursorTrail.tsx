"use client";

import React, { useRef, useEffect, useCallback, useState } from "react";
import { ThemeType } from "@/types/theme";

interface TrailPoint {
  x: number;
  y: number;
  timestamp: number;
  opacity: number;
}

interface CursorTrailProps {
  theme: ThemeType;
  isActive: boolean;
  trailLength?: number;
  trailSize?: number;
  trailColor?: string;
  className?: string;
  enablePerformanceMonitoring?: boolean;
  adaptiveQuality?: boolean;
  particleMode?: boolean;
}

export const CursorTrail: React.FC<CursorTrailProps> = ({
  theme,
  isActive,
  trailLength = 20,
  trailSize = 4,
  trailColor,
  className = "",
  enablePerformanceMonitoring = false,
  adaptiveQuality = true,
  particleMode = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailPointsRef = useRef<TrailPoint[]>([]);
  const animationRef = useRef<number>();
  const [isVisible, setIsVisible] = useState(false);
  const performanceRef = useRef<{
    frameCount: number;
    lastTime: number;
    fps: number;
    quality: number;
  }>({
    frameCount: 0,
    lastTime: 0,
    fps: 60,
    quality: 1,
  });

  // Theme-aware trail colors
  const getTrailColor = useCallback(() => {
    if (trailColor) return trailColor;

    return theme === "extreme-brutalist" ? "#ffff00" : "#8b5cf6";
  }, [theme, trailColor]);

  // Add trail point
  const addTrailPoint = useCallback(
    (x: number, y: number) => {
      const now = performance.now();
      trailPointsRef.current.push({
        x,
        y,
        timestamp: now,
        opacity: 1,
      });

      // Remove old points
      trailPointsRef.current = trailPointsRef.current.filter(
        (point) => now - point.timestamp < 1000
      );

      // Limit trail length
      if (trailPointsRef.current.length > trailLength) {
        trailPointsRef.current = trailPointsRef.current.slice(-trailLength);
      }
    },
    [trailLength]
  );

  // Update trail points opacity
  const updateTrailPoints = useCallback(() => {
    const now = performance.now();
    trailPointsRef.current.forEach((point) => {
      const age = now - point.timestamp;
      point.opacity = Math.max(0, 1 - age / 1000);
    });
  }, []);

  // Performance monitoring
  const updatePerformance = useCallback(() => {
    if (!enablePerformanceMonitoring) return;

    const now = performance.now();
    performanceRef.current.frameCount++;

    if (now - performanceRef.current.lastTime >= 1000) {
      performanceRef.current.fps = performanceRef.current.frameCount;
      performanceRef.current.frameCount = 0;
      performanceRef.current.lastTime = now;

      // Adaptive quality based on performance
      if (adaptiveQuality) {
        if (performanceRef.current.fps < 30) {
          performanceRef.current.quality = Math.max(
            0.3,
            performanceRef.current.quality - 0.1
          );
        } else if (performanceRef.current.fps > 50) {
          performanceRef.current.quality = Math.min(
            1,
            performanceRef.current.quality + 0.05
          );
        }
      }

      if (enablePerformanceMonitoring && performanceRef.current.fps < 30) {
        console.warn(
          `CursorTrail performance: ${performanceRef.current.fps} FPS (Quality: ${performanceRef.current.quality.toFixed(2)})`
        );
      }
    }
  }, [enablePerformanceMonitoring, adaptiveQuality]);

  // Enhanced render trail with performance optimizations
  const renderTrail = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      if (trailPointsRef.current.length < 2) return;

      const color = getTrailColor();
      const quality = adaptiveQuality ? performanceRef.current.quality : 1;
      const effectiveTrailLength = Math.floor(trailLength * quality);
      const points = trailPointsRef.current.slice(-effectiveTrailLength);

      if (theme === "extreme-brutalist") {
        if (particleMode) {
          // Particle-based brutal trail
          points.forEach((point, index) => {
            ctx.save();
            ctx.globalAlpha = point.opacity * quality;

            // Create pixelated particles
            const size = trailSize * (1 - index / points.length) * quality;
            const pixelSize = Math.max(2, Math.floor(size / 2));

            // Main particle
            ctx.fillStyle = color;
            ctx.fillRect(
              Math.floor(point.x - pixelSize / 2),
              Math.floor(point.y - pixelSize / 2),
              pixelSize,
              pixelSize
            );

            // Brutal border
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 1;
            ctx.strokeRect(
              Math.floor(point.x - pixelSize / 2),
              Math.floor(point.y - pixelSize / 2),
              pixelSize,
              pixelSize
            );

            // Add spark effects for recent points
            if (index > points.length - 5) {
              const sparkCount = Math.floor(3 * quality);
              for (let i = 0; i < sparkCount; i++) {
                const sparkX = point.x + (Math.random() - 0.5) * size * 2;
                const sparkY = point.y + (Math.random() - 0.5) * size * 2;
                const sparkSize = Math.max(1, Math.floor(pixelSize / 3));

                ctx.fillStyle = index % 2 === 0 ? "#ffff00" : color;
                ctx.fillRect(
                  Math.floor(sparkX - sparkSize / 2),
                  Math.floor(sparkY - sparkSize / 2),
                  sparkSize,
                  sparkSize
                );
              }
            }

            ctx.restore();
          });
        } else {
          // Traditional pixelated trail
          points.forEach((point, index) => {
            ctx.save();
            ctx.globalAlpha = point.opacity * quality;
            ctx.fillStyle = color;

            const size = trailSize * (1 - index / points.length) * quality;
            ctx.fillRect(
              Math.floor(point.x - size / 2),
              Math.floor(point.y - size / 2),
              Math.ceil(size),
              Math.ceil(size)
            );

            // Add brutal border
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 1;
            ctx.strokeRect(
              Math.floor(point.x - size / 2),
              Math.floor(point.y - size / 2),
              Math.ceil(size),
              Math.ceil(size)
            );

            ctx.restore();
          });
        }
      } else {
        // Refined theme rendering
        ctx.save();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        if (particleMode) {
          // Smooth particle trail
          points.forEach((point, index) => {
            ctx.save();
            const progress = index / points.length;
            const size = trailSize * (1 - progress) * quality;

            ctx.globalAlpha = point.opacity * (1 - progress) * quality;
            ctx.fillStyle = color;
            ctx.shadowBlur = size;
            ctx.shadowColor = color;

            ctx.beginPath();
            ctx.arc(point.x, point.y, size / 2, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
          });
        } else {
          // Smooth line trail
          points.forEach((point, index) => {
            if (index === 0) return;

            const prevPoint = points[index - 1];
            const progress = index / points.length;

            ctx.globalAlpha = point.opacity * (1 - progress) * quality;
            ctx.strokeStyle = color;
            ctx.lineWidth = trailSize * (1 - progress) * quality;

            ctx.beginPath();
            ctx.moveTo(prevPoint.x, prevPoint.y);
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
          });

          // Add glow effect if quality allows
          if (quality > 0.7) {
            ctx.shadowBlur = trailSize * 2;
            ctx.shadowColor = color;
            ctx.globalCompositeOperation = "lighter";

            points.forEach((point, index) => {
              if (index === 0) return;

              const prevPoint = points[index - 1];
              const progress = index / points.length;

              ctx.globalAlpha = point.opacity * (1 - progress) * 0.5 * quality;
              ctx.strokeStyle = color;
              ctx.lineWidth = trailSize * (1 - progress) * 0.5 * quality;

              ctx.beginPath();
              ctx.moveTo(prevPoint.x, prevPoint.y);
              ctx.lineTo(point.x, point.y);
              ctx.stroke();
            });
          }
        }

        ctx.restore();
      }

      updatePerformance();
    },
    [
      theme,
      trailSize,
      getTrailColor,
      trailLength,
      adaptiveQuality,
      particleMode,
      updatePerformance,
    ]
  );

  // Animation loop
  const animate = useCallback(() => {
    if (!isActive || !isVisible) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (canvas && ctx) {
      updateTrailPoints();
      renderTrail(ctx);
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [isActive, isVisible, updateTrailPoints, renderTrail]);

  // Mouse move handler
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isActive) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      addTrailPoint(x, y);
    },
    [isActive, addTrailPoint]
  );

  // Mouse enter/leave handlers
  const handleMouseEnter = useCallback(() => {
    setIsVisible(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsVisible(false);
    trailPointsRef.current = [];
  }, []);

  // Resize canvas
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  // Initialize canvas and event listeners
  useEffect(() => {
    resizeCanvas();

    if (isActive) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseenter", handleMouseEnter);
      document.addEventListener("mouseleave", handleMouseLeave);
      window.addEventListener("resize", resizeCanvas);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [
    isActive,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
    resizeCanvas,
  ]);

  // Start animation when visible
  useEffect(() => {
    if (isVisible && isActive) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, isActive, animate]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`cursor-trail cursor-trail--${theme} ${className}`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9999,
        imageRendering: theme === "extreme-brutalist" ? "pixelated" : "auto",
      }}
      aria-hidden="true"
    />
  );
};

export default CursorTrail;
