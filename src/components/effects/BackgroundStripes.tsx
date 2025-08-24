"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { ThemeType } from "@/types/theme";

interface Stripe {
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;
  speed: number;
  color: string;
  opacity: number;
}

interface BackgroundStripesProps {
  theme: ThemeType;
  isActive: boolean;
  stripeCount?: number;
  direction?: "horizontal" | "vertical" | "diagonal";
  speed?: number;
  className?: string;
}

export const BackgroundStripes: React.FC<BackgroundStripesProps> = ({
  theme,
  isActive,
  stripeCount = 6,
  direction = "diagonal",
  speed = 2,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const stripesRef = useRef<Stripe[]>([]);
  const lastTimeRef = useRef<number>(0);

  // Get theme-specific colors
  const getStripeColors = useCallback(() => {
    if (theme === "extreme-brutalist") {
      return ["#ffff00", "#000000", "#ffffff"];
    } else {
      return ["#8b5cf6", "#06b6d4", "#f5f5f5"];
    }
  }, [theme]);

  // Initialize stripes
  const initializeStripes = useCallback(() => {
    const stripes: Stripe[] = [];
    const canvas = canvasRef.current;
    if (!canvas) return stripes;

    const colors = getStripeColors();
    const diagonal = Math.sqrt(canvas.width ** 2 + canvas.height ** 2);

    for (let i = 0; i < stripeCount; i++) {
      let stripe: Stripe;

      switch (direction) {
        case "horizontal":
          stripe = {
            x: 0,
            y: (canvas.height / stripeCount) * i - Math.random() * 100,
            width: canvas.width,
            height: Math.random() * 40 + 20,
            angle: 0,
            speed:
              (Math.random() * speed + 0.5) * (Math.random() > 0.5 ? 1 : -1),
            color: colors[Math.floor(Math.random() * colors.length)],
            opacity:
              theme === "extreme-brutalist"
                ? Math.random() * 0.3 + 0.1
                : Math.random() * 0.15 + 0.05,
          };
          break;

        case "vertical":
          stripe = {
            x: (canvas.width / stripeCount) * i - Math.random() * 100,
            y: 0,
            width: Math.random() * 40 + 20,
            height: canvas.height,
            angle: 0,
            speed:
              (Math.random() * speed + 0.5) * (Math.random() > 0.5 ? 1 : -1),
            color: colors[Math.floor(Math.random() * colors.length)],
            opacity:
              theme === "extreme-brutalist"
                ? Math.random() * 0.3 + 0.1
                : Math.random() * 0.15 + 0.05,
          };
          break;

        case "diagonal":
        default:
          stripe = {
            x: -diagonal / 2 + (diagonal / stripeCount) * i,
            y: -diagonal / 2,
            width: Math.random() * 60 + 30,
            height: diagonal,
            angle:
              theme === "extreme-brutalist" ? 45 + Math.random() * 20 - 10 : 45,
            speed:
              (Math.random() * speed + 0.5) * (Math.random() > 0.5 ? 1 : -1),
            color: colors[Math.floor(Math.random() * colors.length)],
            opacity:
              theme === "extreme-brutalist"
                ? Math.random() * 0.2 + 0.05
                : Math.random() * 0.1 + 0.03,
          };
          break;
      }

      stripes.push(stripe);
    }

    return stripes;
  }, [stripeCount, direction, speed, theme, getStripeColors]);

  // Update stripe positions
  const updateStripes = useCallback(
    (deltaTime: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      stripesRef.current.forEach((stripe) => {
        switch (direction) {
          case "horizontal":
            stripe.y += stripe.speed * deltaTime * 0.01;
            if (stripe.speed > 0 && stripe.y > canvas.height + stripe.height) {
              stripe.y = -stripe.height;
            } else if (stripe.speed < 0 && stripe.y < -stripe.height) {
              stripe.y = canvas.height + stripe.height;
            }
            break;

          case "vertical":
            stripe.x += stripe.speed * deltaTime * 0.01;
            if (stripe.speed > 0 && stripe.x > canvas.width + stripe.width) {
              stripe.x = -stripe.width;
            } else if (stripe.speed < 0 && stripe.x < -stripe.width) {
              stripe.x = canvas.width + stripe.width;
            }
            break;

          case "diagonal":
          default:
            stripe.x += stripe.speed * deltaTime * 0.01;
            const diagonal = Math.sqrt(canvas.width ** 2 + canvas.height ** 2);
            if (stripe.speed > 0 && stripe.x > diagonal) {
              stripe.x = -diagonal / 2;
            } else if (stripe.speed < 0 && stripe.x < -diagonal) {
              stripe.x = diagonal / 2;
            }
            break;
        }
      });
    },
    [direction]
  );

  // Render stripes
  const renderStripes = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      stripesRef.current.forEach((stripe) => {
        ctx.save();
        ctx.globalAlpha = stripe.opacity;
        ctx.fillStyle = stripe.color;

        if (direction === "diagonal") {
          // Transform for diagonal stripes
          ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
          ctx.rotate((stripe.angle * Math.PI) / 180);
          ctx.translate(-ctx.canvas.width / 2, -ctx.canvas.height / 2);
        }

        if (theme === "extreme-brutalist") {
          // Sharp, geometric stripes
          ctx.fillRect(stripe.x, stripe.y, stripe.width, stripe.height);

          // Add concrete texture effect
          ctx.globalAlpha = stripe.opacity * 0.3;
          for (let i = 0; i < stripe.width; i += 4) {
            if (Math.random() > 0.7) {
              ctx.fillRect(stripe.x + i, stripe.y, 2, stripe.height);
            }
          }
        } else {
          // Smooth stripes with gradient
          const gradient =
            direction === "horizontal"
              ? ctx.createLinearGradient(
                  stripe.x,
                  stripe.y,
                  stripe.x,
                  stripe.y + stripe.height
                )
              : ctx.createLinearGradient(
                  stripe.x,
                  stripe.y,
                  stripe.x + stripe.width,
                  stripe.y
                );

          gradient.addColorStop(0, "transparent");
          gradient.addColorStop(0.5, stripe.color);
          gradient.addColorStop(1, "transparent");

          ctx.fillStyle = gradient;
          ctx.fillRect(stripe.x, stripe.y, stripe.width, stripe.height);
        }

        ctx.restore();
      });
    },
    [theme, direction]
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
        updateStripes(deltaTime);
        renderStripes(ctx);
      }

      animationRef.current = requestAnimationFrame(animate);
    },
    [isActive, updateStripes, renderStripes]
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

    // Reinitialize stripes with new dimensions
    stripesRef.current = initializeStripes();
  }, [initializeStripes]);

  // Initialize and start animation
  useEffect(() => {
    resizeCanvas();
    stripesRef.current = initializeStripes();

    if (isActive) {
      lastTimeRef.current = performance.now();
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, animate, initializeStripes, resizeCanvas]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [resizeCanvas]);

  // Update stripes when theme changes
  useEffect(() => {
    stripesRef.current = initializeStripes();
  }, [theme, initializeStripes]);

  return (
    <div
      className={`background-stripes background-stripes--${theme} ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="background-stripes__canvas"
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 3,
          mixBlendMode:
            theme === "extreme-brutalist" ? "multiply" : "soft-light",
        }}
      />
    </div>
  );
};

export default BackgroundStripes;
