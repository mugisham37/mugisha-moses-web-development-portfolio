"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { ThemeType } from "@/types/theme";

interface GlitchEffectProps {
  theme: ThemeType;
  isActive: boolean;
  intensity?: number;
  frequency?: number;
  duration?: number;
  className?: string;
  children?: React.ReactNode;
}

export const GlitchEffect: React.FC<GlitchEffectProps> = ({
  theme,
  isActive,
  intensity = 1,
  frequency = 0.1,
  duration = 200,
  className = "",
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const glitchTimeoutRef = useRef<NodeJS.Timeout>();
  const animationRef = useRef<number>();

  const triggerGlitch = useCallback(() => {
    const container = containerRef.current;
    if (!container || !isActive) return;

    // Add glitch class
    container.classList.add("glitch-active");

    // Create glitch layers
    const glitchLayers = container.querySelectorAll(".glitch-layer");
    glitchLayers.forEach((layer) => {
      const element = layer as HTMLElement;
      const offsetX = (Math.random() - 0.5) * intensity * 10;
      const offsetY = (Math.random() - 0.5) * intensity * 5;
      const hue = Math.random() * 360;

      element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      element.style.filter = `hue-rotate(${hue}deg) saturate(${1 + intensity})`;
    });

    // Remove glitch effect after duration
    setTimeout(() => {
      container.classList.remove("glitch-active");
      glitchLayers.forEach((layer) => {
        const element = layer as HTMLElement;
        element.style.transform = "";
        element.style.filter = "";
      });
    }, duration);
  }, [isActive, intensity, duration]);

  // Random glitch triggering
  useEffect(() => {
    if (!isActive) return;

    const scheduleNextGlitch = () => {
      const delay = Math.random() * (1000 / frequency) + 500;
      glitchTimeoutRef.current = setTimeout(() => {
        triggerGlitch();
        scheduleNextGlitch();
      }, delay);
    };

    scheduleNextGlitch();

    return () => {
      if (glitchTimeoutRef.current) {
        clearTimeout(glitchTimeoutRef.current);
      }
    };
  }, [isActive, frequency, triggerGlitch]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (glitchTimeoutRef.current) {
        clearTimeout(glitchTimeoutRef.current);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`glitch-effect glitch-effect--${theme} ${className}`}
      style={{
        position: "relative",
        display: "inline-block",
      }}
    >
      {/* Original content */}
      <div className="glitch-content">{children}</div>

      {/* Glitch layers for extreme brutalist theme */}
      {theme === "extreme-brutalist" && (
        <>
          <div
            className="glitch-layer glitch-layer--red"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              mixBlendMode: "multiply",
              opacity: 0.8,
            }}
          >
            {children}
          </div>
          <div
            className="glitch-layer glitch-layer--cyan"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              mixBlendMode: "screen",
              opacity: 0.6,
            }}
          >
            {children}
          </div>
        </>
      )}

      <style jsx>{`
        .glitch-effect--extreme-brutalist .glitch-layer--red {
          color: #ff0000;
          text-shadow: 2px 0 #ff0000;
        }

        .glitch-effect--extreme-brutalist .glitch-layer--cyan {
          color: #00ffff;
          text-shadow: -2px 0 #00ffff;
        }

        .glitch-effect.glitch-active {
          animation: glitch-shake 0.2s ease-in-out;
        }

        @keyframes glitch-shake {
          0%,
          100% {
            transform: translate(0);
          }
          10% {
            transform: translate(-2px, 1px);
          }
          20% {
            transform: translate(2px, -1px);
          }
          30% {
            transform: translate(-1px, 2px);
          }
          40% {
            transform: translate(1px, -2px);
          }
          50% {
            transform: translate(-2px, -1px);
          }
          60% {
            transform: translate(2px, 1px);
          }
          70% {
            transform: translate(-1px, -2px);
          }
          80% {
            transform: translate(1px, 2px);
          }
          90% {
            transform: translate(-2px, -1px);
          }
        }

        .glitch-effect--refined-brutalist .glitch-content {
          transition: all 0.3s ease;
        }

        .glitch-effect--refined-brutalist.glitch-active .glitch-content {
          filter: blur(1px) hue-rotate(90deg);
        }
      `}</style>
    </div>
  );
};

export default GlitchEffect;
