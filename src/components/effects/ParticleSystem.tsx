"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { ThemeType } from "@/types/theme";

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
}

interface ParticleSystemProps {
  theme: ThemeType;
  isActive: boolean;
  particleCount?: number;
  particleSize?: number;
  speed?: number;
  colors?: string[];
  className?: string;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  theme,
  isActive,
  particleCount = 100,
  particleSize = 2,
  speed = 1,
  colors = ["#ffff00", "#00ffff", "#000000"],
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const lastTimeRef = useRef<number>(0);

  // Initialize particles
  const initializeParticles = useCallback(() => {
    const particles: Particle[] = [];
    const canvas = canvasRef.current;
    if (!canvas) return particles;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * speed * 2,
        vy: (Math.random() - 0.5) * speed * 2,
        size: Math.random() * particleSize + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.8 + 0.2,
        life: Math.random() * 1000 + 500,
        maxLife: Math.random() * 1000 + 500,
      });
    }

    return particles;
  }, [particleCount, particleSize, speed, colors]);

  // Update particle positions and properties
  const updateParticles = useCallback(
    (deltaTime: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx * deltaTime * 0.01;
        particle.y += particle.vy * deltaTime * 0.01;

        // Update life
        particle.life -= deltaTime;

        // Update opacity based on life
        particle.opacity = Math.max(0, particle.life / particle.maxLife);

        // Wrap around screen edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Respawn particle if life is over
        if (particle.life <= 0) {
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
          particle.vx = (Math.random() - 0.5) * speed * 2;
          particle.vy = (Math.random() - 0.5) * speed * 2;
          particle.life = particle.maxLife;
          particle.color = colors[Math.floor(Math.random() * colors.length)];
        }
      });
    },
    [speed, colors]
  );

  // Render particles
  const renderParticles = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      particlesRef.current.forEach((particle) => {
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;

        // Theme-specific particle rendering
        if (theme === "extreme-brutalist") {
          // Sharp, pixelated particles
          ctx.fillRect(
            Math.floor(particle.x),
            Math.floor(particle.y),
            Math.ceil(particle.size),
            Math.ceil(particle.size)
          );
        } else {
          // Smooth, circular particles
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });
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
        updateParticles(deltaTime);
        renderParticles(ctx);
      }

      animationRef.current = requestAnimationFrame(animate);
    },
    [isActive, updateParticles, renderParticles]
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

    // Reinitialize particles with new dimensions
    particlesRef.current = initializeParticles();
  }, [initializeParticles]);

  // Initialize and start animation
  useEffect(() => {
    resizeCanvas();
    particlesRef.current = initializeParticles();

    if (isActive) {
      lastTimeRef.current = performance.now();
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, animate, initializeParticles, resizeCanvas]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [resizeCanvas]);

  // Update particles when theme changes
  useEffect(() => {
    particlesRef.current = initializeParticles();
  }, [theme, initializeParticles]);

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
        }}
      />
    </div>
  );
};

export default ParticleSystem;
