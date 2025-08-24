"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { ThemeType } from "@/types/theme";

interface GridBackgroundProps {
  theme: ThemeType;
  isActive: boolean;
  gridSize?: number;
  opacity?: number;
  animationSpeed?: number;
  className?: string;
}

export const GridBackground: React.FC<GridBackgroundProps> = ({
  theme,
  isActive,
  gridSize = 50,
  opacity = 0.2,
  animationSpeed = 1,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const offsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastTimeRef = useRef<number>(0);

  // Get theme-specific colors
  const getGridColor = useCallback(() => {
    if (theme === "extreme-brutalist") {
      return "#000000";
    } else {
      return "#8b5cf6";
    }
  }, [theme]);

  // Draw grid pattern
  const drawGrid = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      offset: { x: number; y: number }
    ) => {
      ctx.clearRect(0, 0, width, height);
      ctx.save();

      ctx.globalAlpha = opacity;
      ctx.strokeStyle = getGridColor();
      ctx.lineWidth = theme === "extreme-brutalist" ? 2 : 1;

      // Draw vertical lines
      for (let x = offset.x % gridSize; x < width + gridSize; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Draw horizontal lines
      for (let y = offset.y % gridSize; y < height + gridSize; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Add theme-specific effects
      if (theme === "extreme-brutalist") {
        // Add intersection dots
        ctx.fillStyle = getGridColor();
        for (let x = offset.x % gridSize; x < width + gridSize; x += gridSize) {
          for (
            let y = offset.y % gridSize;
            y < height + gridSize;
            y += gridSize
          ) {
            ctx.beginPath();
            ctx.arc(x, y, 1, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      } else {
        // Add subtle glow effect
        ctx.shadowColor = getGridColor();
        ctx.shadowBlur = 2;
        ctx.globalAlpha = opacity * 0.5;

        // Redraw with glow
        for (let x = offset.x % gridSize; x < width + gridSize; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }

        for (
          let y = offset.y % gridSize;
          y < height + gridSize;
          y += gridSize
        ) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      }

      ctx.restore();
    },
    [theme, gridSize, opacity, getGridColor]
  );

  // Animation loop
  const animate = useCallback(
    (currentTime: number) => {
      if (!isActive) return;

      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");

      if (canvas && ctx) {
        // Update offset for animation
        offsetRef.current.x += animationSpeed * deltaTime * 0.01;
        offsetRef.current.y += animationSpeed * deltaTime * 0.005;

        // Keep offset within reasonable bounds
        if (offsetRef.current.x > gridSize) offsetRef.current.x = 0;
        if (offsetRef.current.y > gridSize) offsetRef.current.y = 0;

        drawGrid(ctx, canvas.width, canvas.height, offsetRef.current);
      }

      animationRef.current = requestAnimationFrame(animate);
    },
    [isActive, animationSpeed, drawGrid, gridSize]
  );

  // Resize canvas to match container
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Redraw grid with new dimensions
    const ctx = canvas.getContext("2d");
    if (ctx) {
      drawGrid(ctx, canvas.width, canvas.height, offsetRef.current);
    }
  }, [drawGrid]);

  // Initialize and start animation
  useEffect(() => {
    resizeCanvas();

    if (isActive) {
      lastTimeRef.current = performance.now();
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, animate, resizeCanvas]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [resizeCanvas]);

  // Reset animation when theme changes
  useEffect(() => {
    offsetRef.current = { x: 0, y: 0 };
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      drawGrid(ctx, canvas.width, canvas.height, offsetRef.current);
    }
  }, [theme, drawGrid]);

  return (
    <div className={`grid-background grid-background--${theme} ${className}`}>
      <canvas
        ref={canvasRef}
        className="grid-background__canvas"
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />
    </div>
  );
};

export default GridBackground;
