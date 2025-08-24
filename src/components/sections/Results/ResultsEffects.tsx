"use client";

import React, { useEffect, useRef } from "react";
import "./ResultsEffects.css";

interface ResultsEffectsProps {
  theme: "extreme-brutalist" | "refined-brutalist";
  isVisible: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

export const ResultsEffects: React.FC<ResultsEffectsProps> = ({
  theme,
  isVisible,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Particle colors based on theme
    const colors =
      theme === "extreme-brutalist"
        ? ["#ffff00", "#00ff00", "#00ffff", "#ffffff"]
        : ["#8b5cf6", "#10b981", "#06b6d4", "#f5f5f5"];

    // Create particles
    const createParticle = (): Particle => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        maxLife: Math.random() * 200 + 100,
      };
    };

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < 50; i++) {
        particlesRef.current.push(createParticle());
      }
    };

    // Update particles
    const updateParticles = () => {
      const rect = canvas.getBoundingClientRect();

      particlesRef.current.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life++;

        // Fade out over time
        particle.opacity = Math.max(0, 1 - particle.life / particle.maxLife);

        // Wrap around edges
        if (particle.x < 0) particle.x = rect.width;
        if (particle.x > rect.width) particle.x = 0;
        if (particle.y < 0) particle.y = rect.height;
        if (particle.y > rect.height) particle.y = 0;

        // Remove dead particles and create new ones
        if (particle.life >= particle.maxLife) {
          particlesRef.current[index] = createParticle();
        }
      });
    };

    // Draw particles
    const drawParticles = () => {
      const rect = canvas.getBoundingClientRect();

      particlesRef.current.forEach((particle) => {
        ctx.save();
        ctx.globalAlpha = particle.opacity * 0.6;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Add glow effect
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = particle.size * 2;
        ctx.fill();

        ctx.restore();
      });
    };

    // Draw golden grid
    const drawGrid = () => {
      const rect = canvas.getBoundingClientRect();
      const gridSize = 50;
      const gridColor = theme === "extreme-brutalist" ? "#ffff00" : "#8b5cf6";

      ctx.save();
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = 0.1;

      // Vertical lines
      for (let x = 0; x <= rect.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, rect.height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = 0; y <= rect.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(rect.width, y);
        ctx.stroke();
      }

      ctx.restore();
    };

    // Animation loop
    const animate = () => {
      if (!isVisible) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      drawGrid();
      updateParticles();
      drawParticles();

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    initParticles();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [theme, isVisible]);

  return (
    <div className={`results-effects results-effects--${theme}`}>
      {/* Success Particles Canvas */}
      <canvas
        ref={canvasRef}
        className="results-particles"
        aria-hidden="true"
      />

      {/* Golden Grid Background */}
      <div className="results-grid-bg">
        <div className="grid-lines grid-lines--vertical"></div>
        <div className="grid-lines grid-lines--horizontal"></div>
      </div>

      {/* Animated Background Gradients */}
      <div className="results-gradients">
        <div className="gradient-orb gradient-orb--1"></div>
        <div className="gradient-orb gradient-orb--2"></div>
        <div className="gradient-orb gradient-orb--3"></div>
      </div>

      {/* Success Streams */}
      <div className="success-streams">
        <div className="stream stream--1"></div>
        <div className="stream stream--2"></div>
        <div className="stream stream--3"></div>
      </div>
    </div>
  );
};
