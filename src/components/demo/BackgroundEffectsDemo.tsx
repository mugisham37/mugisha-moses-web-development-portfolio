"use client";

import React, { useState } from "react";
import { ThemeDetector, useThemeDetector } from "@/components/theme";
import { BackgroundEffects } from "@/components/effects";

const BackgroundEffectsDemo: React.FC = () => {
  const { activeTheme, getThemeClass } = useThemeDetector();
  const [effectsConfig, setEffectsConfig] = useState({
    enableGrid: true,
    enableScanLines: true,
    enableNoise: true,
    enableStripes: true,
  });

  const toggleEffect = (effect: keyof typeof effectsConfig) => {
    setEffectsConfig((prev) => ({
      ...prev,
      [effect]: !prev[effect],
    }));
  };

  return (
    <ThemeDetector>
      <div className="background-effects-demo relative">
        {/* Background Effects Layer */}
        <BackgroundEffects
          theme={activeTheme}
          isActive={true}
          enableGrid={effectsConfig.enableGrid}
          enableScanLines={effectsConfig.enableScanLines}
          enableNoise={effectsConfig.enableNoise}
          enableStripes={effectsConfig.enableStripes}
          className="fixed inset-0"
        />

        {/* Controls Panel */}
        <div className="fixed top-4 left-4 z-50 p-4 bg-current/90 backdrop-blur-sm brutal-border">
          <h3 className="text-lg font-bold mb-4 text-current">
            Effects Controls
          </h3>
          <div className="space-y-2">
            {Object.entries(effectsConfig).map(([key, enabled]) => (
              <label
                key={key}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={() =>
                    toggleEffect(key as keyof typeof effectsConfig)
                  }
                  className="brutal-checkbox"
                />
                <span className="text-current capitalize">
                  {key
                    .replace("enable", "")
                    .replace(/([A-Z])/g, " $1")
                    .trim()}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Theme Info Panel */}
        <div className="fixed top-4 right-4 z-50 p-4 bg-current/90 backdrop-blur-sm brutal-border">
          <div className="text-sm font-code text-current">
            <div>
              Current Theme: <strong>{activeTheme}</strong>
            </div>
            <div>Grid: {effectsConfig.enableGrid ? "✓" : "✗"}</div>
            <div>Scan Lines: {effectsConfig.enableScanLines ? "✓" : "✗"}</div>
            <div>Noise: {effectsConfig.enableNoise ? "✓" : "✗"}</div>
            <div>Stripes: {effectsConfig.enableStripes ? "✓" : "✗"}</div>
          </div>
        </div>

        {/* Content Sections */}
        <section className="min-h-screen flex items-center justify-center relative z-10">
          <div className="text-center max-w-4xl mx-auto p-8">
            <h1
              className={`text-6xl font-bold mb-8 text-current ${getThemeClass("hero-title")}`}
            >
              BACKGROUND EFFECTS
            </h1>
            <p className="text-xl mb-8 text-current">
              Experience the layered background effects system with grid
              patterns, scan lines, noise textures, and animated stripes.
            </p>
            <div className="brutal-border p-6 bg-accent text-current inline-block">
              <span className="font-code">SCROLL TO SEE THEME TRANSITIONS</span>
            </div>
          </div>
        </section>

        <section className="min-h-screen flex items-center justify-center relative z-10">
          <div className="text-center max-w-4xl mx-auto p-8">
            <h2
              className={`text-5xl font-bold mb-8 text-current ${getThemeClass("section-title")}`}
            >
              GRID BACKGROUND
            </h2>
            <p className="text-lg mb-8 text-current">
              Animated grid patterns that adapt to the current theme with
              different colors, opacity, and animation speeds.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="brutal-border p-6 bg-secondary text-current">
                <h3 className="text-xl font-bold mb-4">Extreme Theme</h3>
                <p>
                  Sharp, high-contrast grid with intersection dots and faster
                  animation.
                </p>
              </div>
              <div className="brutal-border p-6 bg-secondary text-current">
                <h3 className="text-xl font-bold mb-4">Refined Theme</h3>
                <p>
                  Subtle grid with glow effects and smoother animation patterns.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="min-h-screen flex items-center justify-center relative z-10">
          <div className="text-center max-w-4xl mx-auto p-8">
            <h2
              className={`text-5xl font-bold mb-8 text-current ${getThemeClass("section-title")}`}
            >
              SCAN LINES
            </h2>
            <p className="text-lg mb-8 text-current">
              Terminal-inspired scan lines that create a retro-futuristic
              atmosphere with glitch effects and color variations.
            </p>
            <div className="space-y-4">
              <div className="brutal-border p-4 bg-highlight text-current">
                ✓ Multiple colored scan lines with random speeds
              </div>
              <div className="brutal-border p-4 bg-highlight text-current">
                ✓ Glitch effects and flicker animations
              </div>
              <div className="brutal-border p-4 bg-highlight text-current">
                ✓ Theme-aware colors and blend modes
              </div>
            </div>
          </div>
        </section>

        <section className="min-h-screen flex items-center justify-center relative z-10">
          <div className="text-center max-w-4xl mx-auto p-8">
            <h2
              className={`text-5xl font-bold mb-8 text-current ${getThemeClass("section-title")}`}
            >
              NOISE TEXTURE
            </h2>
            <p className="text-lg mb-8 text-current">
              Subtle noise textures that add depth and authenticity to the
              brutalist aesthetic without overwhelming the content.
            </p>
            <div className="brutal-border p-8 bg-success text-current">
              <span className="font-code text-2xl">TEXTURE OVERLAY ACTIVE</span>
            </div>
          </div>
        </section>

        <section className="min-h-screen flex items-center justify-center relative z-10">
          <div className="text-center max-w-4xl mx-auto p-8">
            <h2
              className={`text-5xl font-bold mb-8 text-current ${getThemeClass("section-title")}`}
            >
              BACKGROUND STRIPES
            </h2>
            <p className="text-lg mb-8 text-current">
              Animated diagonal stripes that create movement and visual interest
              while maintaining the brutalist design language.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["Diagonal", "Horizontal", "Vertical"].map((direction, i) => (
                <div
                  key={i}
                  className="brutal-border p-4 bg-secondary text-current"
                >
                  <h3 className="font-bold mb-2">{direction}</h3>
                  <p className="text-sm">
                    Stripe patterns in {direction.toLowerCase()} orientation
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="min-h-screen flex items-center justify-center relative z-10">
          <div className="text-center max-w-4xl mx-auto p-8">
            <h2
              className={`text-4xl font-bold mb-8 text-current ${getThemeClass("section-title")}`}
            >
              EFFECTS SYSTEM COMPLETE
            </h2>
            <p className="text-lg mb-8 text-current">
              All background effects are working together to create a cohesive
              and immersive brutalist experience.
            </p>
            <div className="space-y-4">
              <div className="brutal-border p-4 bg-success text-current">
                ✓ Performance optimized with requestAnimationFrame
              </div>
              <div className="brutal-border p-4 bg-success text-current">
                ✓ Theme-aware colors and animations
              </div>
              <div className="brutal-border p-4 bg-success text-current">
                ✓ Responsive design with mobile optimizations
              </div>
              <div className="brutal-border p-4 bg-success text-current">
                ✓ Accessibility support with reduced motion preferences
              </div>
            </div>
          </div>
        </section>
      </div>
    </ThemeDetector>
  );
};

export default BackgroundEffectsDemo;
