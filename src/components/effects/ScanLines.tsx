"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { ThemeType } from "@/types/theme";

interface ScanLine {
  y: number;
  speed: number;
  opacity: number;
  thickness: number;
  color: string;
}

interface ScanLinesProps {
  theme: ThemeType;
  isActive: boolean;
  lineCount?: number;
  speed?: number;
  opacity?: number;
  className?: string;
}

export const ScanLines: React.FC<ScanLinesProps> = ({
  theme,
  isActive,
  lineCount = 8,
  speed = 1,
  opacity = 0.3,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const scanLinesRef = useRef<ScanLine[]>([]);
  const lastTimeRef = useRef<number>(0);

  // Get theme-specific colors
  const getScanLineColors = useCallback(() => {
    if (theme === "extreme-brutalist") {
      return ["#ffff00", "#00ffff", "#ffffff"];
    } else {
      return ["#8b5cf6", "#06b6d4", "#10b981"];
    }
  }, [theme]);

  // Initialize scan lines
  const initializeScanLines = useCallback(() => {
    const lines: ScanLine[] = [];
    const canvas = canvasRef.current;
    if (!canvas) return lines;

    const colors = getScanLineColors();

    for (let i = 0; i < lineCount; i++) {
      lines.push({
        y: Math.random() * canvas.height,
        speed:
          (Math.random() * speed + 0.5) *
          (theme === "extreme-brutalist" ? 2 : 1),
        opacity: Math.random() * opacity + 0.1,
        thickness:
          theme === "extreme-brutalist"
            ? Math.random() * 3 + 1
            : Math.random() * 2 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    return lines;
  }, [lineCount, speed, opacity, theme, getScanLineColors]);

  // Update scan line positions
  const updateScanLines = useCallback(
    (deltaTime: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      scanLinesRef.current.forEach((line) => {
        line.y += line.speed * deltaTime * 0.1;

        // Wrap around when line goes off screen
        if (line.y > canvas.height + line.thickness) {
          line.y = -line.thickness;
          line.speed =
            (Math.random() * speed + 0.5) *
            (theme === "extreme-brutalist" ? 2 : 1);
          line.opacity = Math.random() * opacity + 0.1;

          const colors = getScanLineColors();
          line.color = colors[Math.floor(Math.random() * colors.length)];
        }
      });
    },
    [speed, opacity, theme, getScanLineColors]
  );

  // Render scan lines
  const renderScanLines = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      scanLinesRef.current.forEach((line) => {
        ctx.save();
        ctx.globalAlpha = line.opacity;
        ctx.fillStyle = line.color;

        if (theme === "extreme-brutalist") {
          // Sharp, pixelated scan lines
          ctx.fillRect(
            0,
            Math.floor(line.y),
            ctx.canvas.width,
            Math.ceil(line.thickness)
          );

          // Add glitch effect occasionally
          if (Math.random() < 0.05) {
            ctx.globalAlpha = line.opacity * 0.5;
            ctx.fillRect(
              Math.random() * 20,
              Math.floor(line.y),
              ctx.canvas.width - Math.random() * 40,
              Math.ceil(line.thickness)
            );
          }
        } else {
          // Smooth scan lines with gradient
          const gradient = ctx.createLinearGradient(
            0,
            line.y,
            0,
            line.y + line.thickness
          );
          gradient.addColorStop(0, "transparent");
          gradient.addColorStop(0.5, line.color);
          gradient.addColorStop(1, "transparent");

          ctx.fillStyle = gradient;
          ctx.fillRect(0, line.y, ctx.canvas.width, line.thickness);
        }

        ctx.restore();
      });

      // Add terminal-style flicker effect
      if (theme === "extreme-brutalist" && Math.random() < 0.02) {
        ctx.save();
        ctx.globalAlpha = 0.1;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.restore();
      }
    },
    [theme]
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
        updateScanLines(deltaTime);
        renderScanLines(ctx);
      }

      animationRef.current = requestAnimationFrame(animate);
    },
    [isActive, updateScanLines, renderScanLines]
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

    // Reinitialize scan lines with new dimensions
    scanLinesRef.current = initializeScanLines();
  }, [initializeScanLines]);

  // Initialize and start animation
  useEffect(() => {
    resizeCanvas();
    scanLinesRef.current = initializeScanLines();

    if (isActive) {
      lastTimeRef.current = performance.now();
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, animate, initializeScanLines, resizeCanvas]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [resizeCanvas]);

  // Update scan lines when theme changes
  useEffect(() => {
    scanLinesRef.current = initializeScanLines();
  }, [theme, initializeScanLines]);

  return (
    <div className={`scan-lines scan-lines--${theme} ${className}`}>
      <canvas
        ref={canvasRef}
        className="scan-lines__canvas"
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 4,
          mixBlendMode: theme === "extreme-brutalist" ? "screen" : "overlay",
        }}
      />
    </div>
  );
};

export default ScanLines;
