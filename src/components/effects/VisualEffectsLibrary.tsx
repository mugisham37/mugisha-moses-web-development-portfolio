"use client";

import React, {
  useRef,
  useEffect,
  useCallback,
  useState,
  useMemo,
} from "react";
import { ThemeType } from "@/types/theme";

// Effect types
export type EffectType =
  | "scanlines"
  | "crt"
  | "matrix"
  | "terminal"
  | "hologram"
  | "neon-glow"
  | "data-stream"
  | "circuit-board"
  | "glitch-bars"
  | "pixel-rain";

interface VisualEffectsLibraryProps {
  theme: ThemeType;
  effects: EffectType[];
  intensity?: number;
  isActive?: boolean;
  className?: string;
  enablePerformanceMonitoring?: boolean;
}

interface EffectConfig {
  name: string;
  render: (
    ctx: CanvasRenderingContext2D,
    time: number,
    intensity: number,
    theme: ThemeType
  ) => void;
  performanceCost: number; // 1-5 scale
}

export const VisualEffectsLibrary: React.FC<VisualEffectsLibraryProps> = ({
  theme,
  effects,
  intensity = 1,
  isActive = true,
  className = "",
  enablePerformanceMonitoring = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const performanceRef = useRef<{
    frameCount: number;
    lastTime: number;
    fps: number;
    activeEffects: EffectType[];
  }>({
    frameCount: 0,
    lastTime: 0,
    fps: 60,
    activeEffects: [],
  });

  // Effect configurations
  const effectConfigs: Record<EffectType, EffectConfig> = useMemo(
    () => ({
      scanlines: {
        name: "Scan Lines",
        performanceCost: 2,
        render: (ctx, time, intensity, theme) => {
          const lineHeight = theme === "extreme-brutalist" ? 4 : 2;
          const opacity =
            theme === "extreme-brutalist" ? 0.3 * intensity : 0.1 * intensity;
          const speed = theme === "extreme-brutalist" ? 2 : 1;

          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.fillStyle = theme === "extreme-brutalist" ? "#00ff00" : "#8b5cf6";

          const offset = (time * speed) % (lineHeight * 2);
          for (
            let y = -offset;
            y < ctx.canvas.height + lineHeight;
            y += lineHeight * 2
          ) {
            ctx.fillRect(0, y, ctx.canvas.width, 1);
          }

          ctx.restore();
        },
      },

      crt: {
        name: "CRT Effect",
        performanceCost: 3,
        render: (ctx, time, intensity, theme) => {
          const curvature = 0.1 * intensity;
          const scanlineIntensity = theme === "extreme-brutalist" ? 0.5 : 0.2;

          ctx.save();

          // Screen curvature simulation
          const gradient = ctx.createRadialGradient(
            ctx.canvas.width / 2,
            ctx.canvas.height / 2,
            0,
            ctx.canvas.width / 2,
            ctx.canvas.height / 2,
            Math.max(ctx.canvas.width, ctx.canvas.height) / 2
          );
          gradient.addColorStop(0, `rgba(0, 0, 0, 0)`);
          gradient.addColorStop(0.8, `rgba(0, 0, 0, ${0.1 * intensity})`);
          gradient.addColorStop(1, `rgba(0, 0, 0, ${0.3 * intensity})`);

          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

          // Flickering effect
          if (Math.random() < 0.02 * intensity) {
            ctx.globalAlpha = 0.1;
            ctx.fillStyle =
              theme === "extreme-brutalist" ? "#ffffff" : "#f0f0f0";
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          }

          ctx.restore();
        },
      },

      matrix: {
        name: "Matrix Rain",
        performanceCost: 4,
        render: (ctx, time, intensity, theme) => {
          const chars =
            theme === "extreme-brutalist"
              ? "01"
              : "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
          const fontSize = theme === "extreme-brutalist" ? 16 : 12;
          const columns = Math.floor(ctx.canvas.width / fontSize);
          const drops: number[] = [];

          // Initialize drops
          for (let i = 0; i < columns; i++) {
            if (!drops[i]) drops[i] = Math.random() * ctx.canvas.height;
          }

          ctx.save();
          ctx.font = `${fontSize}px monospace`;
          ctx.fillStyle = theme === "extreme-brutalist" ? "#00ff00" : "#8b5cf6";

          for (let i = 0; i < columns; i++) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            const x = i * fontSize;
            const y = drops[i];

            ctx.globalAlpha = Math.random() * intensity;
            ctx.fillText(char, x, y);

            drops[i] += fontSize;
            if (drops[i] > ctx.canvas.height && Math.random() > 0.975) {
              drops[i] = 0;
            }
          }

          ctx.restore();
        },
      },

      terminal: {
        name: "Terminal Effect",
        performanceCost: 2,
        render: (ctx, time, intensity, theme) => {
          const blinkSpeed = 1000;
          const showCursor = Math.floor(time / blinkSpeed) % 2 === 0;

          if (showCursor) {
            ctx.save();
            ctx.fillStyle =
              theme === "extreme-brutalist" ? "#00ff00" : "#06b6d4";
            ctx.globalAlpha = intensity;

            // Blinking cursor
            const cursorWidth = 2;
            const cursorHeight = 20;
            const x = 20 + ((time / 50) % (ctx.canvas.width - 40));
            const y = 20;

            ctx.fillRect(x, y, cursorWidth, cursorHeight);
            ctx.restore();
          }
        },
      },

      hologram: {
        name: "Hologram Effect",
        performanceCost: 3,
        render: (ctx, time, intensity, theme) => {
          const waveHeight = 20 * intensity;
          const waveSpeed = 0.005;
          const lineSpacing = theme === "extreme-brutalist" ? 8 : 4;

          ctx.save();
          ctx.strokeStyle =
            theme === "extreme-brutalist" ? "#00ffff" : "#8b5cf6";
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.3 * intensity;

          for (let y = 0; y < ctx.canvas.height; y += lineSpacing) {
            ctx.beginPath();
            for (let x = 0; x < ctx.canvas.width; x += 2) {
              const wave = Math.sin(x * 0.01 + time * waveSpeed) * waveHeight;
              const adjustedY = y + wave;

              if (x === 0) {
                ctx.moveTo(x, adjustedY);
              } else {
                ctx.lineTo(x, adjustedY);
              }
            }
            ctx.stroke();
          }

          ctx.restore();
        },
      },

      "neon-glow": {
        name: "Neon Glow",
        performanceCost: 3,
        render: (ctx, time, intensity, theme) => {
          const pulseSpeed = 0.003;
          const pulse = (Math.sin(time * pulseSpeed) + 1) / 2;
          const glowIntensity = (0.5 + pulse * 0.5) * intensity;

          ctx.save();
          ctx.shadowBlur = 20 * glowIntensity;
          ctx.shadowColor =
            theme === "extreme-brutalist" ? "#ffff00" : "#8b5cf6";
          ctx.strokeStyle =
            theme === "extreme-brutalist" ? "#ffff00" : "#8b5cf6";
          ctx.lineWidth = 2;
          ctx.globalAlpha = glowIntensity;

          // Draw neon border
          ctx.strokeRect(10, 10, ctx.canvas.width - 20, ctx.canvas.height - 20);

          // Additional glow layers
          for (let i = 0; i < 3; i++) {
            ctx.shadowBlur = (30 + i * 10) * glowIntensity;
            ctx.strokeRect(
              10,
              10,
              ctx.canvas.width - 20,
              ctx.canvas.height - 20
            );
          }

          ctx.restore();
        },
      },

      "data-stream": {
        name: "Data Stream",
        performanceCost: 4,
        render: (ctx, time, intensity, theme) => {
          const streamCount = Math.floor(10 * intensity);
          const speed = theme === "extreme-brutalist" ? 3 : 2;

          ctx.save();
          ctx.font = "10px monospace";
          ctx.fillStyle = theme === "extreme-brutalist" ? "#00ff00" : "#06b6d4";

          for (let i = 0; i < streamCount; i++) {
            const x =
              (i * ctx.canvas.width) / streamCount +
              ((time * speed) % ctx.canvas.width);
            const data = Math.random().toString(16).substr(2, 8).toUpperCase();

            ctx.globalAlpha = Math.random() * intensity;
            ctx.fillText(data, x % ctx.canvas.width, 20 + i * 15);
          }

          ctx.restore();
        },
      },

      "circuit-board": {
        name: "Circuit Board",
        performanceCost: 3,
        render: (ctx, time, intensity, theme) => {
          const gridSize = theme === "extreme-brutalist" ? 40 : 30;
          const pulseSpeed = 0.002;
          const pulse = (Math.sin(time * pulseSpeed) + 1) / 2;

          ctx.save();
          ctx.strokeStyle =
            theme === "extreme-brutalist" ? "#00ff00" : "#8b5cf6";
          ctx.lineWidth = 1;
          ctx.globalAlpha = (0.2 + pulse * 0.3) * intensity;

          // Draw circuit lines
          for (let x = 0; x < ctx.canvas.width; x += gridSize) {
            for (let y = 0; y < ctx.canvas.height; y += gridSize) {
              if (Math.random() > 0.7) {
                // Horizontal line
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + gridSize, y);
                ctx.stroke();
              }

              if (Math.random() > 0.7) {
                // Vertical line
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x, y + gridSize);
                ctx.stroke();
              }

              // Circuit nodes
              if (Math.random() > 0.9) {
                ctx.beginPath();
                ctx.arc(x, y, 2, 0, Math.PI * 2);
                ctx.fill();
              }
            }
          }

          ctx.restore();
        },
      },

      "glitch-bars": {
        name: "Glitch Bars",
        performanceCost: 2,
        render: (ctx, time, intensity, theme) => {
          if (Math.random() > 0.95 * intensity) {
            const barCount = Math.floor(Math.random() * 5) + 1;

            ctx.save();

            for (let i = 0; i < barCount; i++) {
              const y = Math.random() * ctx.canvas.height;
              const height = Math.random() * 50 + 10;
              const offset = (Math.random() - 0.5) * 20;

              ctx.fillStyle =
                theme === "extreme-brutalist" ? "#ff0000" : "#8b5cf6";
              ctx.globalAlpha = 0.7 * intensity;
              ctx.fillRect(offset, y, ctx.canvas.width, height);

              // Add noise
              ctx.fillStyle =
                theme === "extreme-brutalist" ? "#00ffff" : "#06b6d4";
              ctx.globalAlpha = 0.3 * intensity;
              ctx.fillRect(offset + 2, y, ctx.canvas.width, height);
            }

            ctx.restore();
          }
        },
      },

      "pixel-rain": {
        name: "Pixel Rain",
        performanceCost: 4,
        render: (ctx, time, intensity, theme) => {
          const pixelSize = theme === "extreme-brutalist" ? 4 : 2;
          const rainCount = Math.floor(50 * intensity);

          ctx.save();

          for (let i = 0; i < rainCount; i++) {
            const x = Math.random() * ctx.canvas.width;
            const y = (time * 2 + i * 100) % (ctx.canvas.height + 100);
            const alpha = Math.random() * intensity;

            ctx.globalAlpha = alpha;
            ctx.fillStyle =
              theme === "extreme-brutalist" ? "#ffff00" : "#8b5cf6";
            ctx.fillRect(
              Math.floor(x / pixelSize) * pixelSize,
              Math.floor(y / pixelSize) * pixelSize,
              pixelSize,
              pixelSize
            );
          }

          ctx.restore();
        },
      },
    }),
    []
  );

  // Performance monitoring
  const updatePerformance = useCallback(() => {
    if (!enablePerformanceMonitoring) return;

    const now = performance.now();
    performanceRef.current.frameCount++;

    if (now - performanceRef.current.lastTime >= 1000) {
      performanceRef.current.fps = performanceRef.current.frameCount;
      performanceRef.current.frameCount = 0;
      performanceRef.current.lastTime = now;
      performanceRef.current.activeEffects = effects;

      const totalCost = effects.reduce(
        (sum, effect) => sum + effectConfigs[effect].performanceCost,
        0
      );

      if (performanceRef.current.fps < 30) {
        console.warn(
          `VisualEffectsLibrary performance: ${performanceRef.current.fps} FPS with ${effects.length} effects (cost: ${totalCost})`
        );
      }
    }
  }, [enablePerformanceMonitoring, effects, effectConfigs]);

  // Animation loop
  const animate = useCallback(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (canvas && ctx) {
      const currentTime = performance.now() - startTimeRef.current;

      // Clear canvas with slight fade for trail effects
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render active effects
      effects.forEach((effectType) => {
        const config = effectConfigs[effectType];
        if (config) {
          config.render(ctx, currentTime, intensity, theme);
        }
      });

      updatePerformance();
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [isActive, effects, intensity, theme, updatePerformance, effectConfigs]);

  // Resize canvas
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  // Initialize
  useEffect(() => {
    startTimeRef.current = performance.now();
    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [resizeCanvas]);

  // Start/stop animation
  useEffect(() => {
    if (isActive) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, animate]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`visual-effects-library visual-effects-library--${theme} ${className}`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 1,
        imageRendering: theme === "extreme-brutalist" ? "pixelated" : "auto",
      }}
      aria-hidden="true"
    />
  );
};

export default VisualEffectsLibrary;
