"use client";

import React, { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { HeroContent } from "./HeroContent";

// Dynamically import canvas-based effects to avoid SSR issues
const ParticleSystem = dynamic(
  () => import("@/components/effects/ParticleSystem"),
  {
    ssr: false,
    loading: () => <div className="hero__effect-loading" aria-hidden="true" />,
  }
);

const BackgroundEffects = dynamic(
  () =>
    import("@/components/effects/BackgroundEffects").then((mod) => ({
      default: mod.BackgroundEffects,
    })),
  {
    ssr: false,
    loading: () => <div className="hero__effect-loading" aria-hidden="true" />,
  }
);

interface HeroWithEffectsProps {
  children?: React.ReactNode;
  className?: string;
  enableCanvasEffects?: boolean;
}

export const HeroWithEffects: React.FC<HeroWithEffectsProps> = ({
  children,
  className = "",
  enableCanvasEffects = true,
}) => {
  const { currentTheme, config } = useThemeContext();
  const heroRef = useRef<HTMLElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const isVisible = useIntersectionObserver(heroRef, {
    threshold: 0.1,
    rootMargin: "0px",
    triggerOnce: false,
  });

  // Ensure component is mounted before rendering canvas effects
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Apply theme-specific background effects
  useEffect(() => {
    if (heroRef.current) {
      const heroElement = heroRef.current;

      // Add theme-specific classes
      heroElement.classList.remove(
        "hero--extreme-brutalist",
        "hero--refined-brutalist"
      );
      heroElement.classList.add(`hero--${currentTheme}`);

      // Apply dynamic CSS properties
      heroElement.style.setProperty("--hero-bg", config.colors.bg);
      heroElement.style.setProperty("--hero-text", config.colors.text);
      heroElement.style.setProperty("--hero-accent", config.colors.accent);
      heroElement.style.setProperty(
        "--hero-highlight",
        config.colors.highlight
      );
      heroElement.style.setProperty(
        "--hero-border-width",
        config.borders.width
      );
      heroElement.style.setProperty(
        "--hero-border-radius",
        config.borders.radius || "0px"
      );
      heroElement.style.setProperty(
        "--hero-animation-duration",
        config.animations.duration
      );
      heroElement.style.setProperty(
        "--hero-animation-easing",
        config.animations.easing
      );
    }
  }, [currentTheme, config]);

  return (
    <section
      ref={heroRef}
      className={`hero hero--with-effects ${className}`}
      id="hero"
      data-section="hero"
      role="banner"
      aria-label="Hero section"
    >
      {/* Background Effects Layer */}
      <div className="hero__background-effects">
        {/* CSS-based fallback effects */}
        <div className="hero__background-pattern" aria-hidden="true" />
        <div className="hero__background-grid" aria-hidden="true" />
        <div className="hero__background-stripes" aria-hidden="true" />
        <div className="hero__scan-lines" aria-hidden="true" />
        <div className="hero__noise-texture" aria-hidden="true" />

        {/* Canvas-based effects (dynamically loaded) */}
        {isMounted && enableCanvasEffects && (
          <>
            <ParticleSystem
              theme={currentTheme}
              isActive={isVisible}
              config={{
                particleCount: currentTheme === "extreme-brutalist" ? 100 : 60,
                size: {
                  min: currentTheme === "extreme-brutalist" ? 2 : 1,
                  max: currentTheme === "extreme-brutalist" ? 6 : 4,
                },
                speed: currentTheme === "extreme-brutalist" ? 1.5 : 0.8,
                colors: [
                  config.colors.accent,
                  config.colors.highlight,
                  config.colors.text,
                ],
                particleTypes:
                  currentTheme === "extreme-brutalist"
                    ? ["geometric", "sparks", "code"]
                    : ["floating", "network", "energy"],
              }}
              performanceMode="medium"
            />

            <BackgroundEffects
              theme={currentTheme}
              isActive={isVisible}
              enableGrid={true}
              enableScanLines={true}
              enableNoise={true}
              enableStripes={true}
            />
          </>
        )}
      </div>

      {/* Content Container */}
      <div className="hero__container">
        <div className="hero__grid">{children || <HeroContent />}</div>
      </div>

      {/* Performance Optimization Overlay */}
      <div className="hero__performance-overlay" aria-hidden="true" />
    </section>
  );
};

export default HeroWithEffects;
