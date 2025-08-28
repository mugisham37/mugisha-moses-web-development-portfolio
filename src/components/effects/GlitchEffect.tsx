"use client";

import React, { useRef, useEffect, useCallback, useState } from "react";
import { ThemeType } from "@/types/theme";

interface GlitchEffectProps {
  theme: ThemeType;
  isActive: boolean;
  intensity?: number;
  frequency?: number;
  duration?: number;
  className?: string;
  children?: React.ReactNode;
  trigger?: "auto" | "hover" | "manual";
  onGlitchStart?: () => void;
  onGlitchEnd?: () => void;
  enablePerformanceMonitoring?: boolean;
}

export const GlitchEffect: React.FC<GlitchEffectProps> = ({
  theme,
  isActive,
  intensity = 1,
  frequency = 0.1,
  duration = 200,
  className = "",
  children,
  trigger = "auto",
  onGlitchStart,
  onGlitchEnd,
  enablePerformanceMonitoring = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const glitchTimeoutRef = useRef<NodeJS.Timeout>();
  const animationRef = useRef<number>();
  const [isGlitching, setIsGlitching] = useState(false);
  const performanceRef = useRef<{ startTime: number; frameCount: number }>({
    startTime: 0,
    frameCount: 0,
  });

  const triggerGlitch = useCallback(() => {
    const container = containerRef.current;
    if (!container || !isActive || isGlitching) return;

    setIsGlitching(true);
    onGlitchStart?.();

    // Performance monitoring start
    if (enablePerformanceMonitoring) {
      performanceRef.current.startTime = performance.now();
      performanceRef.current.frameCount = 0;
    }

    // Add glitch class
    container.classList.add("glitch-active");

    // Enhanced glitch effects based on theme
    const glitchLayers = container.querySelectorAll(".glitch-layer");
    const glitchContent = container.querySelector(
      ".glitch-content"
    ) as HTMLElement;

    if (theme === "extreme-brutalist") {
      // Aggressive glitch effects
      glitchLayers.forEach((layer) => {
        const element = layer as HTMLElement;
        const offsetX = (Math.random() - 0.5) * intensity * 15;
        const offsetY = (Math.random() - 0.5) * intensity * 8;
        const rotation = (Math.random() - 0.5) * intensity * 5;
        const scale = 1 + (Math.random() - 0.5) * intensity * 0.2;
        const hue = Math.random() * 360;

        element.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg) scale(${scale})`;
        element.style.filter = `hue-rotate(${hue}deg) saturate(${2 + intensity}) contrast(${1.5 + intensity})`;

        // Add scan line effect
        element.style.background = `linear-gradient(90deg, transparent 0%, rgba(255,255,0,0.1) 50%, transparent 100%)`;
        element.style.backgroundSize = `${20 + Math.random() * 30}px 100%`;
        element.style.animation = `glitch-scan ${duration}ms linear infinite`;
      });

      // Distort main content
      if (glitchContent) {
        glitchContent.style.filter = `blur(${intensity}px) contrast(${1.5 + intensity * 0.5})`;
        glitchContent.style.textShadow = `${intensity * 2}px 0 #ff0000, -${intensity * 2}px 0 #00ffff`;
      }
    } else {
      // Refined glitch effects
      glitchLayers.forEach((layer) => {
        const element = layer as HTMLElement;
        const offsetX = (Math.random() - 0.5) * intensity * 5;
        const offsetY = (Math.random() - 0.5) * intensity * 3;
        const hue = Math.random() * 60 + 240; // Purple/blue range

        element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        element.style.filter = `hue-rotate(${hue}deg) saturate(${1.2 + intensity * 0.3})`;
      });

      if (glitchContent) {
        glitchContent.style.filter = `blur(${intensity * 0.5}px) hue-rotate(${Math.random() * 30}deg)`;
      }
    }

    // Performance monitoring during animation
    if (enablePerformanceMonitoring) {
      const monitorFrame = () => {
        performanceRef.current.frameCount++;
        if (performanceRef.current.frameCount < duration / 16) {
          requestAnimationFrame(monitorFrame);
        }
      };
      requestAnimationFrame(monitorFrame);
    }

    // Remove glitch effect after duration
    setTimeout(() => {
      container.classList.remove("glitch-active");
      glitchLayers.forEach((layer) => {
        const element = layer as HTMLElement;
        element.style.transform = "";
        element.style.filter = "";
        element.style.background = "";
        element.style.backgroundSize = "";
        element.style.animation = "";
      });

      if (glitchContent) {
        glitchContent.style.filter = "";
        glitchContent.style.textShadow = "";
      }

      setIsGlitching(false);
      onGlitchEnd?.();

      // Performance monitoring end
      if (enablePerformanceMonitoring) {
        const endTime = performance.now();
        const duration = endTime - performanceRef.current.startTime;
        const fps = (performanceRef.current.frameCount / duration) * 1000;
        console.log(
          `Glitch effect performance: ${fps.toFixed(2)} FPS over ${duration.toFixed(2)}ms`
        );

        if (fps < 30) {
          console.warn(
            "Glitch effect performance below 30 FPS, consider reducing intensity"
          );
        }
      }
    }, duration);
  }, [
    isActive,
    intensity,
    duration,
    theme,
    isGlitching,
    onGlitchStart,
    onGlitchEnd,
    enablePerformanceMonitoring,
  ]);

  // Trigger-based glitch activation
  useEffect(() => {
    if (!isActive || trigger !== "auto") return;

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
  }, [isActive, frequency, triggerGlitch, trigger]);

  // Manual trigger method
  const manualTrigger = useCallback(() => {
    if (trigger === "manual") {
      triggerGlitch();
    }
  }, [trigger, triggerGlitch]);

  // Expose manual trigger method
  useEffect(() => {
    if (trigger === "manual" && containerRef.current) {
      (containerRef.current as any).triggerGlitch = manualTrigger;
    }
  }, [trigger, manualTrigger]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (glitchTimeoutRef.current) {
        clearTimeout(glitchTimeoutRef.current);
        glitchTimeoutRef.current = undefined;
      }
      const currentAnimationFrame = animationRef.current;
      if (currentAnimationFrame) {
        cancelAnimationFrame(currentAnimationFrame);
        animationRef.current = undefined;
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
      onMouseEnter={trigger === "hover" ? triggerGlitch : undefined}
      data-glitch-active={isGlitching}
    >
      {/* Original content */}
      <div className="glitch-content">{children}</div>

      {/* Enhanced glitch layers */}
      {theme === "extreme-brutalist" ? (
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
              zIndex: 1,
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
              zIndex: 2,
            }}
          >
            {children}
          </div>
          <div
            className="glitch-layer glitch-layer--yellow"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              mixBlendMode: "overlay",
              opacity: 0.4,
              zIndex: 3,
            }}
          >
            {children}
          </div>
        </>
      ) : (
        <>
          <div
            className="glitch-layer glitch-layer--purple"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              mixBlendMode: "soft-light",
              opacity: 0.6,
              zIndex: 1,
            }}
          >
            {children}
          </div>
          <div
            className="glitch-layer glitch-layer--cyan-refined"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              mixBlendMode: "color-dodge",
              opacity: 0.3,
              zIndex: 2,
            }}
          >
            {children}
          </div>
        </>
      )}

      <style jsx>{`
        /* Extreme Brutalist Theme */
        .glitch-effect--extreme-brutalist .glitch-layer--red {
          color: #ff0000;
          text-shadow:
            3px 0 #ff0000,
            -1px 0 #ff0000;
        }

        .glitch-effect--extreme-brutalist .glitch-layer--cyan {
          color: #00ffff;
          text-shadow:
            -3px 0 #00ffff,
            1px 0 #00ffff;
        }

        .glitch-effect--extreme-brutalist .glitch-layer--yellow {
          color: #ffff00;
          text-shadow:
            0 2px #ffff00,
            0 -2px #ffff00;
        }

        /* Refined Brutalist Theme */
        .glitch-effect--refined-brutalist .glitch-layer--purple {
          color: #8b5cf6;
          text-shadow: 2px 0 rgba(139, 92, 246, 0.7);
        }

        .glitch-effect--refined-brutalist .glitch-layer--cyan-refined {
          color: #06b6d4;
          text-shadow: -2px 0 rgba(6, 182, 212, 0.7);
        }

        /* Active glitch animations */
        .glitch-effect.glitch-active {
          animation: glitch-shake 0.2s ease-in-out;
        }

        .glitch-effect--extreme-brutalist.glitch-active {
          animation: glitch-shake-brutal 0.15s linear infinite;
        }

        .glitch-effect--refined-brutalist.glitch-active {
          animation: glitch-shake-refined 0.3s ease-in-out;
        }

        /* Keyframe animations */
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

        @keyframes glitch-shake-brutal {
          0%,
          100% {
            transform: translate(0) skew(0deg);
          }
          10% {
            transform: translate(-4px, 2px) skew(1deg);
          }
          20% {
            transform: translate(4px, -2px) skew(-1deg);
          }
          30% {
            transform: translate(-2px, 4px) skew(2deg);
          }
          40% {
            transform: translate(2px, -4px) skew(-2deg);
          }
          50% {
            transform: translate(-4px, -2px) skew(1deg);
          }
          60% {
            transform: translate(4px, 2px) skew(-1deg);
          }
          70% {
            transform: translate(-2px, -4px) skew(2deg);
          }
          80% {
            transform: translate(2px, 4px) skew(-2deg);
          }
          90% {
            transform: translate(-4px, -2px) skew(1deg);
          }
        }

        @keyframes glitch-shake-refined {
          0%,
          100% {
            transform: translate(0) scale(1);
          }
          25% {
            transform: translate(-1px, 1px) scale(1.01);
          }
          50% {
            transform: translate(1px, -1px) scale(0.99);
          }
          75% {
            transform: translate(-1px, -1px) scale(1.01);
          }
        }

        @keyframes glitch-scan {
          0% {
            background-position: -100% 0;
          }
          100% {
            background-position: 100% 0;
          }
        }

        /* Performance optimizations */
        .glitch-effect {
          will-change: transform;
          backface-visibility: hidden;
          perspective: 1000px;
        }

        .glitch-layer {
          will-change: transform, filter;
          backface-visibility: hidden;
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .glitch-effect.glitch-active,
          .glitch-effect--extreme-brutalist.glitch-active,
          .glitch-effect--refined-brutalist.glitch-active {
            animation: none;
          }

          .glitch-layer {
            transition: opacity 0.2s ease;
          }

          .glitch-effect.glitch-active .glitch-layer {
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
};

export default GlitchEffect;
