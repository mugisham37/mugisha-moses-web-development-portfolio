"use client";

import React from "react";
import { ThemeDetector, useThemeDetector } from "@/components/theme";

const ScrollThemeDemo: React.FC = () => {
  const { scrollProgress, isTransitioning, activeTheme, getThemeClass } =
    useThemeDetector();

  return (
    <ThemeDetector>
      <div className="scroll-theme-demo">
        {/* Fixed header showing current state */}
        <div className="fixed top-4 right-4 z-50 p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
          <div className="text-sm font-mono">
            <div>Theme: {activeTheme}</div>
            <div>Progress: {(scrollProgress * 100).toFixed(1)}%</div>
            <div>Transitioning: {isTransitioning ? "Yes" : "No"}</div>
          </div>
        </div>

        {/* Hero section - Extreme Brutalist */}
        <section className="min-h-screen flex items-center justify-center bg-current text-current">
          <div className="text-center">
            <h1
              className={`text-6xl font-bold mb-8 ${getThemeClass("hero-title")}`}
            >
              EXTREME BRUTALIST
            </h1>
            <p className="text-xl mb-8">
              This section uses the extreme brutalist theme with harsh borders
              and high contrast.
            </p>
            <div className="brutal-border p-6 bg-accent text-current inline-block">
              <span className="font-code">SCROLL DOWN TO SEE TRANSITION</span>
            </div>
          </div>
        </section>

        {/* Transition zone */}
        <section className="min-h-screen flex items-center justify-center bg-current text-current">
          <div className="text-center">
            <h2
              className={`text-5xl font-bold mb-8 ${getThemeClass("section-title")}`}
            >
              TRANSITION ZONE
            </h2>
            <p className="text-lg mb-8">
              Watch the theme smoothly transition as you scroll through this
              area.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`brutal-border p-6 bg-secondary text-current ${getThemeClass("demo-card")}`}
                >
                  <h3 className="text-xl font-bold mb-4">Card {i}</h3>
                  <p>This card adapts to the current theme automatically.</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Refined section */}
        <section className="min-h-screen flex items-center justify-center bg-current text-current">
          <div className="text-center">
            <h2
              className={`text-5xl font-bold mb-8 ${getThemeClass("section-title")}`}
            >
              REFINED BRUTALIST
            </h2>
            <p className="text-lg mb-8">
              This section uses the refined brutalist theme with softer edges
              and gradients.
            </p>
            <div className="brutal-border p-8 bg-highlight text-current inline-block">
              <span className="font-code">PROFESSIONAL & POLISHED</span>
            </div>
          </div>
        </section>

        {/* Final section */}
        <section className="min-h-screen flex items-center justify-center bg-current text-current">
          <div className="text-center">
            <h2
              className={`text-4xl font-bold mb-8 ${getThemeClass("section-title")}`}
            >
              THEME DETECTION COMPLETE
            </h2>
            <p className="text-lg mb-8">
              The scroll-based theme detection system is working perfectly!
            </p>
            <div className="space-y-4">
              <div className="brutal-border p-4 bg-success text-current">
                ✓ Smooth transitions between themes
              </div>
              <div className="brutal-border p-4 bg-success text-current">
                ✓ Hysteresis prevents rapid switching
              </div>
              <div className="brutal-border p-4 bg-success text-current">
                ✓ Performance optimized with throttling
              </div>
            </div>
          </div>
        </section>
      </div>
    </ThemeDetector>
  );
};

export default ScrollThemeDemo;
