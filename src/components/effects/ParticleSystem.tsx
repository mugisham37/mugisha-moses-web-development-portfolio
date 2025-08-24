"use client";

import React, { useRef, useEffect, useCallback, useMemo } from "react";
import { ThemeType } from "@/types/theme";

// Enhanced particle types for different behaviors
export type ParticleType =
  | "floating"
  | "network"
  | "sparks"
  | "dust"
  | "code"
  | "geometric"
  | "energy";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  life: number;
  maxLife: number;
  type: ParticleType;
  rotation?: number;
  rotationSpeed?: number;
  pulsePhase?: number;
  connectionRadius?: number;
  trail?: Array<{ x: number; y: number; opacity: number }>;
  active: boolean; // For object pooling
}

interface ParticleSystemConfig {
  particleCount: number;
  particleTypes: ParticleType[];
  speed: number;
  size: { min: number; max: number };
  colors: string[];
  connectionDistance?: number;
  trailLength?: number;
  respawnRate?: number;
}

interface ParticleSystemProps {
  theme: ThemeType;
  isActive: boolean;
  config?: Partial<ParticleSystemConfig>;
  className?: string;
  performanceMode?: "high" | "medium" | "low";
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  theme,
  isActive,
  config = {},
  className = "",
  performanceMode = "medium",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlePoolRef = useRef<Particle[]>([]);
  const activeParticlesRef = useRef<Particle[]>([]);
  const lastTimeRef = useRef<number>(0);
  const performanceMetricsRef = useRef({
    frameCount: 0,
    lastFpsCheck: 0,
    currentFps: 60,
    adaptiveQuality: 1,
  });

  // Device capability detection for responsive particle density
  const deviceCapabilities = useMemo(() => {
    if (typeof window === "undefined") return { tier: "medium", multiplier: 1 };

    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    const isLowEnd =
      navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;
    const hasWebGL = !!gl;

    if (isMobile || isLowEnd || !hasWebGL) {
      return { tier: "low", multiplier: 0.3 };
    } else if (
      navigator.hardwareConcurrency &&
      navigator.hardwareConcurrency >= 8
    ) {
      return { tier: "high", multiplier: 1.5 };
    }

    return { tier: "medium", multiplier: 1 };
  }, []);

  // Theme-aware particle configuration
  const particleConfig: ParticleSystemConfig = useMemo(() => {
    const baseConfig: ParticleSystemConfig = {
      particleCount: 80,
      particleTypes: ["floating", "network"],
      speed: 1,
      size: { min: 1, max: 3 },
      colors: ["#ffff00", "#00ffff", "#ffffff"],
      connectionDistance: 120,
      trailLength: 5,
      respawnRate: 0.02,
    };

    if (theme === "extreme-brutalist") {
      return {
        ...baseConfig,
        particleCount: Math.floor(120 * deviceCapabilities.multiplier),
        particleTypes: ["geometric", "sparks", "code"],
        speed: 1.5,
        size: { min: 2, max: 6 },
        colors: ["#ffff00", "#00ffff", "#000000", "#ffffff"],
        connectionDistance: 80,
        trailLength: 8,
        respawnRate: 0.03,
        ...config,
      };
    } else {
      return {
        ...baseConfig,
        particleCount: Math.floor(60 * deviceCapabilities.multiplier),
        particleTypes: ["floating", "network", "energy"],
        speed: 0.8,
        size: { min: 1, max: 4 },
        colors: ["#8b5cf6", "#06b6d4", "#10b981", "#ffffff"],
        connectionDistance: 150,
        trailLength: 6,
        respawnRate: 0.015,
        ...config,
      };
    }
  }, [theme, config, deviceCapabilities.multiplier]);

  // Performance-based quality adjustment
  const adjustedConfig = useMemo(() => {
    const qualityMultiplier = performanceMetricsRef.current.adaptiveQuality;
    const performanceMultipliers = {
      high: 1,
      medium: 0.7,
      low: 0.4,
    };

    const multiplier =
      performanceMultipliers[performanceMode] * qualityMultiplier;

    return {
      ...particleConfig,
      particleCount: Math.floor(particleConfig.particleCount * multiplier),
      trailLength: Math.floor((particleConfig.trailLength || 5) * multiplier),
    };
  }, [particleConfig, performanceMode]);

  // Object pooling for performance optimization
  const createParticle = useCallback(
    (canvas: HTMLCanvasElement): Particle => {
      const type =
        adjustedConfig.particleTypes[
          Math.floor(Math.random() * adjustedConfig.particleTypes.length)
        ];
      const size =
        adjustedConfig.size.min +
        Math.random() * (adjustedConfig.size.max - adjustedConfig.size.min);

      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * adjustedConfig.speed * 2,
        vy: (Math.random() - 0.5) * adjustedConfig.speed * 2,
        size,
        color:
          adjustedConfig.colors[
            Math.floor(Math.random() * adjustedConfig.colors.length)
          ],
        opacity: Math.random() * 0.8 + 0.2,
        life: Math.random() * 3000 + 1000,
        maxLife: Math.random() * 3000 + 1000,
        type,
        rotation:
          type === "geometric" ? Math.random() * Math.PI * 2 : undefined,
        rotationSpeed:
          type === "geometric" ? (Math.random() - 0.5) * 0.02 : undefined,
        pulsePhase: type === "energy" ? Math.random() * Math.PI * 2 : undefined,
        connectionRadius:
          type === "network" ? adjustedConfig.connectionDistance : undefined,
        trail: type === "sparks" || type === "code" ? [] : undefined,
        active: true,
      };
    },
    [adjustedConfig]
  );

  // Initialize particle pool
  const initializeParticlePool = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create particle pool (larger than active count for efficient reuse)
    const poolSize = Math.floor(adjustedConfig.particleCount * 1.5);
    particlePoolRef.current = [];

    for (let i = 0; i < poolSize; i++) {
      particlePoolRef.current.push(createParticle(canvas));
    }

    // Initialize active particles
    activeParticlesRef.current = particlePoolRef.current
      .slice(0, adjustedConfig.particleCount)
      .map((particle) => ({ ...particle, active: true }));
  }, [adjustedConfig.particleCount, createParticle]);

  // Get particle from pool
  const getParticleFromPool = useCallback(
    (canvas: HTMLCanvasElement): Particle | null => {
      const inactiveParticle = particlePoolRef.current.find((p) => !p.active);
      if (inactiveParticle) {
        // Reset particle properties
        const newParticle = createParticle(canvas);
        Object.assign(inactiveParticle, newParticle, { active: true });
        return inactiveParticle;
      }
      return null;
    },
    [createParticle]
  );

  // Return particle to pool
  const returnParticleToPool = useCallback((particle: Particle) => {
    particle.active = false;
    if (particle.trail) {
      particle.trail.length = 0;
    }
  }, []);

  // Enhanced particle update with type-specific behaviors
  const updateParticles = useCallback(
    (deltaTime: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dt = deltaTime * 0.016; // Normalize to 60fps baseline
      const time = performance.now() * 0.001;

      activeParticlesRef.current.forEach((particle, index) => {
        if (!particle.active) return;

        // Store previous position for trails
        if (particle.trail) {
          particle.trail.unshift({
            x: particle.x,
            y: particle.y,
            opacity: particle.opacity,
          });
          if (particle.trail.length > (adjustedConfig.trailLength || 5)) {
            particle.trail.pop();
          }
          // Update trail opacity
          particle.trail.forEach((point, i) => {
            point.opacity = particle.opacity * (1 - i / particle.trail!.length);
          });
        }

        // Type-specific movement and behavior
        switch (particle.type) {
          case "floating":
            particle.x += particle.vx * dt;
            particle.y += particle.vy * dt + Math.sin(time + index) * 0.1;
            break;

          case "network":
            particle.x += particle.vx * dt * 0.5;
            particle.y += particle.vy * dt * 0.5;
            break;

          case "sparks":
            particle.x += particle.vx * dt * 1.5;
            particle.y += particle.vy * dt * 1.5;
            particle.vy += 0.02; // Gravity effect
            break;

          case "geometric":
            particle.x += particle.vx * dt;
            particle.y += particle.vy * dt;
            if (
              particle.rotation !== undefined &&
              particle.rotationSpeed !== undefined
            ) {
              particle.rotation += particle.rotationSpeed * dt;
            }
            break;

          case "code":
            particle.y += particle.vy * dt * 2; // Falling code effect
            particle.x += Math.sin(time + index) * 0.2;
            break;

          case "energy":
            const energyRadius = 50 + Math.sin(time * 2 + index) * 20;
            particle.x += Math.cos(time + index) * 0.5;
            particle.y += Math.sin(time + index) * 0.5;
            if (particle.pulsePhase !== undefined) {
              particle.opacity =
                0.3 + Math.sin(time * 3 + particle.pulsePhase) * 0.4;
            }
            break;

          default:
            particle.x += particle.vx * dt;
            particle.y += particle.vy * dt;
        }

        // Update life and opacity
        particle.life -= deltaTime;
        const lifeRatio = particle.life / particle.maxLife;

        if (particle.type !== "energy") {
          particle.opacity = Math.max(0, lifeRatio * 0.8 + 0.2);
        }

        // Boundary handling
        const margin = particle.size * 2;
        if (particle.x < -margin) particle.x = canvas.width + margin;
        if (particle.x > canvas.width + margin) particle.x = -margin;
        if (particle.y < -margin) particle.y = canvas.height + margin;
        if (particle.y > canvas.height + margin) particle.y = -margin;

        // Respawn or return to pool when life ends
        if (particle.life <= 0) {
          if (Math.random() < (adjustedConfig.respawnRate || 0.02)) {
            const newParticle = createParticle(canvas);
            Object.assign(particle, newParticle);
          } else {
            returnParticleToPool(particle);
            activeParticlesRef.current.splice(index, 1);
          }
        }
      });

      // Maintain particle count by spawning new ones
      while (activeParticlesRef.current.length < adjustedConfig.particleCount) {
        const newParticle = getParticleFromPool(canvas);
        if (newParticle) {
          activeParticlesRef.current.push(newParticle);
        } else {
          break;
        }
      }
    },
    [adjustedConfig, createParticle, returnParticleToPool, getParticleFromPool]
  );

  // Enhanced rendering with type-specific visuals and connections
  const renderParticles = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // Render connections for network particles first (behind particles)
      if (theme === "refined-brutalist") {
        activeParticlesRef.current.forEach((particle, i) => {
          if (particle.type === "network" && particle.connectionRadius) {
            activeParticlesRef.current.slice(i + 1).forEach((otherParticle) => {
              if (otherParticle.type === "network") {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < particle.connectionRadius!) {
                  const opacity =
                    (1 - distance / particle.connectionRadius!) * 0.3;
                  ctx.save();
                  ctx.globalAlpha =
                    opacity * Math.min(particle.opacity, otherParticle.opacity);
                  ctx.strokeStyle = particle.color;
                  ctx.lineWidth = 1;
                  ctx.beginPath();
                  ctx.moveTo(particle.x, particle.y);
                  ctx.lineTo(otherParticle.x, otherParticle.y);
                  ctx.stroke();
                  ctx.restore();
                }
              }
            });
          }
        });
      }

      // Render particles with type-specific visuals
      activeParticlesRef.current.forEach((particle) => {
        if (!particle.active) return;

        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.strokeStyle = particle.color;

        // Render trails first
        if (particle.trail && particle.trail.length > 1) {
          ctx.lineWidth = particle.size * 0.5;
          ctx.lineCap = "round";
          ctx.beginPath();
          particle.trail.forEach((point, i) => {
            ctx.globalAlpha = point.opacity;
            if (i === 0) {
              ctx.moveTo(point.x, point.y);
            } else {
              ctx.lineTo(point.x, point.y);
            }
          });
          ctx.stroke();
          ctx.globalAlpha = particle.opacity; // Reset for main particle
        }

        // Type-specific rendering
        switch (particle.type) {
          case "floating":
            if (theme === "extreme-brutalist") {
              ctx.fillRect(
                Math.floor(particle.x - particle.size / 2),
                Math.floor(particle.y - particle.size / 2),
                Math.ceil(particle.size),
                Math.ceil(particle.size)
              );
            } else {
              ctx.beginPath();
              ctx.arc(
                particle.x,
                particle.y,
                particle.size / 2,
                0,
                Math.PI * 2
              );
              ctx.fill();
            }
            break;

          case "network":
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size / 2, 0, Math.PI * 2);
            ctx.fill();
            // Add glow effect for refined theme
            if (theme === "refined-brutalist") {
              ctx.shadowBlur = particle.size * 2;
              ctx.shadowColor = particle.color;
              ctx.fill();
              ctx.shadowBlur = 0;
            }
            break;

          case "sparks":
            ctx.save();
            ctx.translate(particle.x, particle.y);
            ctx.rotate(Math.atan2(particle.vy, particle.vx));
            ctx.fillRect(
              -particle.size,
              -particle.size / 4,
              particle.size * 2,
              particle.size / 2
            );
            ctx.restore();
            break;

          case "geometric":
            ctx.save();
            ctx.translate(particle.x, particle.y);
            if (particle.rotation !== undefined) {
              ctx.rotate(particle.rotation);
            }

            if (theme === "extreme-brutalist") {
              // Draw brutal geometric shapes
              const sides = Math.floor(Math.random() * 3) + 3; // 3-5 sides
              ctx.beginPath();
              for (let i = 0; i < sides; i++) {
                const angle = (i / sides) * Math.PI * 2;
                const x = Math.cos(angle) * particle.size;
                const y = Math.sin(angle) * particle.size;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
              }
              ctx.closePath();
              ctx.fill();
              ctx.lineWidth = 2;
              ctx.stroke();
            } else {
              ctx.fillRect(
                -particle.size / 2,
                -particle.size / 2,
                particle.size,
                particle.size
              );
            }
            ctx.restore();
            break;

          case "code":
            ctx.font = `${particle.size * 2}px monospace`;
            ctx.textAlign = "center";
            const codeChars = ["0", "1", "{", "}", "<", ">", "/", "\\"];
            const char =
              codeChars[Math.floor(Math.random() * codeChars.length)];
            ctx.fillText(char, particle.x, particle.y);
            break;

          case "energy":
            // Pulsing energy orb
            const pulseSize =
              particle.size * (1 + Math.sin(performance.now() * 0.01) * 0.3);
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, pulseSize / 2, 0, Math.PI * 2);
            ctx.fill();

            // Energy ring
            ctx.globalAlpha = particle.opacity * 0.5;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, pulseSize, 0, Math.PI * 2);
            ctx.stroke();
            break;

          default:
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size / 2, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
      });
    },
    [theme]
  );

  // Performance monitoring and adaptive quality
  const updatePerformanceMetrics = useCallback((deltaTime: number) => {
    const metrics = performanceMetricsRef.current;
    metrics.frameCount++;

    if (performance.now() - metrics.lastFpsCheck > 1000) {
      metrics.currentFps = metrics.frameCount;
      metrics.frameCount = 0;
      metrics.lastFpsCheck = performance.now();

      // Adaptive quality based on FPS
      if (metrics.currentFps < 30) {
        metrics.adaptiveQuality = Math.max(0.3, metrics.adaptiveQuality - 0.1);
      } else if (metrics.currentFps > 55) {
        metrics.adaptiveQuality = Math.min(1, metrics.adaptiveQuality + 0.05);
      }
    }
  }, []);

  // Optimized animation loop with performance monitoring
  const animate = useCallback(
    (currentTime: number) => {
      if (!isActive) return;

      const deltaTime = Math.min(currentTime - lastTimeRef.current, 32); // Cap at ~30fps minimum
      lastTimeRef.current = currentTime;

      updatePerformanceMetrics(deltaTime);

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");

      if (canvas && ctx) {
        // Skip frames if performance is poor
        const metrics = performanceMetricsRef.current;
        if (metrics.currentFps > 20 || metrics.frameCount % 2 === 0) {
          updateParticles(deltaTime);
          renderParticles(ctx);
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    },
    [isActive, updateParticles, renderParticles, updatePerformanceMetrics]
  );

  // Optimized canvas resizing with device pixel ratio support
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Set actual size in memory (scaled to account for extra pixel density)
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    // Scale the canvas back down using CSS
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";

    // Scale the drawing context so everything draws at the correct size
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    // Reinitialize particle system with new dimensions
    initializeParticlePool();
  }, [initializeParticlePool]);

  // Initialize and start animation with cleanup
  useEffect(() => {
    resizeCanvas();

    if (isActive) {
      lastTimeRef.current = performance.now();
      performanceMetricsRef.current = {
        frameCount: 0,
        lastFpsCheck: performance.now(),
        currentFps: 60,
        adaptiveQuality: 1,
      };
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, animate, resizeCanvas]);

  // Handle window resize with debouncing
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 100);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [resizeCanvas]);

  // Update particle system when theme or config changes
  useEffect(() => {
    if (canvasRef.current) {
      initializeParticlePool();
    }
  }, [theme, adjustedConfig, initializeParticlePool]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      // Clear particle pools
      particlePoolRef.current = [];
      activeParticlesRef.current = [];
    };
  }, []);

  return (
    <div className={`particle-system particle-system--${theme} ${className}`}>
      <canvas
        ref={canvasRef}
        className="particle-system__canvas"
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 1,
          imageRendering: theme === "extreme-brutalist" ? "pixelated" : "auto",
        }}
      />
      {/* Performance debug info (only in development) */}
      {process.env.NODE_ENV === "development" && (
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "rgba(0,0,0,0.7)",
            color: "white",
            padding: "4px 8px",
            fontSize: "12px",
            fontFamily: "monospace",
            borderRadius: "4px",
            zIndex: 1000,
          }}
        >
          FPS: {performanceMetricsRef.current.currentFps} | Particles:{" "}
          {activeParticlesRef.current.length} | Quality:{" "}
          {Math.round(performanceMetricsRef.current.adaptiveQuality * 100)}%
        </div>
      )}
    </div>
  );
};

export default ParticleSystem;
