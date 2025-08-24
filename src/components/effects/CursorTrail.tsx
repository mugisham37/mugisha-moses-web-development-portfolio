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
}

export const CursorTrail: React.FC<CursorTrailProps> = ({
  theme,
  isActive,
  trailLength = 20,
  trailSize = 4,
  trailColor,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailPointsRef = useRef<TrailPoint[]>([]);
  const animationRef = useRef<number>();
  const [isVisible, setIsVisible] = useState(false);

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

  // Render trail
  const renderTrail = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      if (trailPointsRef.current.length < 2) return;

      const color = getTrailColor();

      if (theme === "extreme-brutalist") {
        // Pixelated, brutal trail
        trailPointsRef.current.forEach((point, index) => {
          ctx.save();
          ctx.globalAlpha = point.opacity;
          ctx.fillStyle = color;

          const size = trailSize * (1 - index / trailPointsRef.current.length);
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
      } else {
        // Smooth, refined trail
        ctx.save();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // Create gradient trail
        trailPointsRef.current.forEach((point, index) => {
          if (index === 0) return;

          const prevPoint = trailPointsRef.current[index - 1];
          const progress = index / trailPointsRef.current.length;

          ctx.globalAlpha = point.opacity * (1 - progress);
          ctx.strokeStyle = color;
          ctx.lineWidth = trailSize * (1 - progress);

          ctx.beginPath();
          ctx.moveTo(prevPoint.x, prevPoint.y);
          ctx.lineTo(point.x, point.y);
          ctx.stroke();
        });

        // Add glow effect
        ctx.shadowBlur = trailSize * 2;
        ctx.shadowColor = color;
        ctx.globalCompositeOperation = "lighter";

        trailPointsRef.current.forEach((point, index) => {
          if (index === 0) return;

          const prevPoint = trailPointsRef.current[index - 1];
          const progress = index / trailPointsRef.current.length;

          ctx.globalAlpha = point.opacity * (1 - progress) * 0.5;
          ctx.strokeStyle = color;
          ctx.lineWidth = trailSize * (1 - progress) * 0.5;

          ctx.beginPath();
          ctx.moveTo(prevPoint.x, prevPoint.y);
          ctx.lineTo(point.x, point.y);
          ctx.stroke();
        });

        ctx.restore();
      }
    },
    [theme, trailSize, getTrailColor]
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
