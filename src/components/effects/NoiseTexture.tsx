"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { ThemeType } from "@/types/theme";

interface NoiseTextureProps {
  theme: ThemeType;
  isActive: boolean;
  intensity?: number;
  scale?: number;
  className?: string;
}

export const NoiseTexture: React.FC<NoiseTextureProps> = ({
  theme,
  isActive,
  intensity = 0.1,
  scale = 1,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const noiseDataRef = useRef<ImageData | null>(null);
  const lastTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);

  // Generate noise pattern
  const generateNoise = useCallback(
    (width: number, height: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx) return null;

      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const noise = Math.random();
        const value = Math.floor(noise * 255);

        if (theme === "extreme-brutalist") {
          // High contrast, pixelated noise
          const binaryNoise = noise > 0.5 ? 255 : 0;
          data[i] = binaryNoise; // Red
          data[i + 1] = binaryNoise; // Green
          data[i + 2] = binaryNoise; // Blue
          data[i + 3] = Math.floor(intensity * 255 * (noise > 0.8 ? 1 : 0.3)); // Alpha
        } else {
          // Smooth, subtle noise
          data[i] = value; // Red
          data[i + 1] = value; // Green
          data[i + 2] = value; // Blue
          data[i + 3] = Math.floor(intensity * 255 * noise * 0.5); // Alpha
        }
      }

      return imageData;
    },
    [theme, intensity]
  );

  // Render noise texture
  const renderNoise = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const canvas = ctx.canvas;

      // Generate new noise every few frames for animation
      if (
        frameCountRef.current % (theme === "extreme-brutalist" ? 3 : 8) ===
        0
      ) {
        noiseDataRef.current = generateNoise(
          Math.floor(canvas.width / scale),
          Math.floor(canvas.height / scale)
        );
      }

      if (noiseDataRef.current) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Create temporary canvas for scaling
        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d");

        if (tempCtx) {
          tempCanvas.width = noiseDataRef.current.width;
          tempCanvas.height = noiseDataRef.current.height;
          tempCtx.putImageData(noiseDataRef.current, 0, 0);

          // Scale and draw noise
          ctx.save();
          ctx.imageSmoothingEnabled = theme !== "extreme-brutalist";
          ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);

          // Add theme-specific blend modes
          if (theme === "extreme-brutalist") {
            ctx.globalCompositeOperation = "multiply";
          } else {
            ctx.globalCompositeOperation = "overlay";
          }

          ctx.restore();
        }
      }

      frameCountRef.current++;
    },
    [theme, scale, generateNoise]
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
        renderNoise(ctx);
      }

      animationRef.current = requestAnimationFrame(animate);
    },
    [isActive, renderNoise]
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

    // Reset noise data for new dimensions
    noiseDataRef.current = null;
    frameCountRef.current = 0;
  }, []);

  // Initialize and start animation
  useEffect(() => {
    resizeCanvas();

    if (isActive) {
      lastTimeRef.current = performance.now();
      frameCountRef.current = 0;
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

  // Reset when theme changes
  useEffect(() => {
    noiseDataRef.current = null;
    frameCountRef.current = 0;
  }, [theme]);

  return (
    <div className={`noise-texture noise-texture--${theme} ${className}`}>
      <canvas
        ref={canvasRef}
        className="noise-texture__canvas"
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 5,
          opacity: intensity,
        }}
      />
    </div>
  );
};

export default NoiseTexture;
