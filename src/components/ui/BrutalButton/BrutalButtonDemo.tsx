"use client";

import React, { useState } from "react";
import { BrutalButton } from "./BrutalButton";
import { useTheme } from "@/hooks/useTheme";

/**
 * BrutalButtonDemo - Comprehensive demonstration of BrutalButton features
 *
 * This component showcases:
 * - All button variants (primary, secondary, ghost)
 * - All sizes (sm, md, lg)
 * - Theme awareness (extreme vs refined brutalist)
 * - Interactive states (loading, disabled)
 * - Complex hover animations
 * - Accessibility features
 */
export const BrutalButtonDemo: React.FC = () => {
  const { currentTheme, setTheme } = useTheme();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );

  const handleLoadingDemo = (buttonId: string) => {
    setLoadingStates((prev) => ({ ...prev, [buttonId]: true }));

    // Simulate async operation
    setTimeout(() => {
      setLoadingStates((prev) => ({ ...prev, [buttonId]: false }));
    }, 2000);
  };

  const toggleTheme = () => {
    setTheme(
      currentTheme === "extreme-brutalist"
        ? "refined-brutalist"
        : "extreme-brutalist"
    );
  };

  return (
    <div className="brutal-button-demo">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-current">
            BrutalButton Component Demo
          </h1>
          <p className="text-lg text-current mb-4">
            Current Theme: <strong>{currentTheme}</strong>
          </p>
          <BrutalButton onClick={toggleTheme} variant="secondary" size="sm">
            Toggle Theme
          </BrutalButton>
        </div>

        {/* Variants Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-current">
            Button Variants
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-current">Primary</h3>
              <BrutalButton
                variant="primary"
                onClick={() => console.log("Primary clicked")}
              >
                Primary Button
              </BrutalButton>
              <BrutalButton
                variant="primary"
                loading={loadingStates.primary}
                onClick={() => handleLoadingDemo("primary")}
              >
                {loadingStates.primary ? "Loading..." : "Click for Loading"}
              </BrutalButton>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-current">Secondary</h3>
              <BrutalButton
                variant="secondary"
                onClick={() => console.log("Secondary clicked")}
              >
                Secondary Button
              </BrutalButton>
              <BrutalButton
                variant="secondary"
                loading={loadingStates.secondary}
                onClick={() => handleLoadingDemo("secondary")}
              >
                {loadingStates.secondary
                  ? "Processing..."
                  : "Click for Loading"}
              </BrutalButton>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-current">Ghost</h3>
              <BrutalButton
                variant="ghost"
                onClick={() => console.log("Ghost clicked")}
              >
                Ghost Button
              </BrutalButton>
              <BrutalButton
                variant="ghost"
                loading={loadingStates.ghost}
                onClick={() => handleLoadingDemo("ghost")}
              >
                {loadingStates.ghost ? "Working..." : "Click for Loading"}
              </BrutalButton>
            </div>
          </div>
        </section>

        {/* Sizes Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-current">Button Sizes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-current">Small</h3>
              <BrutalButton size="sm" variant="primary">
                Small Button
              </BrutalButton>
              <BrutalButton size="sm" variant="secondary">
                Small Secondary
              </BrutalButton>
              <BrutalButton size="sm" variant="ghost">
                Small Ghost
              </BrutalButton>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-current">
                Medium (Default)
              </h3>
              <BrutalButton size="md" variant="primary">
                Medium Button
              </BrutalButton>
              <BrutalButton size="md" variant="secondary">
                Medium Secondary
              </BrutalButton>
              <BrutalButton size="md" variant="ghost">
                Medium Ghost
              </BrutalButton>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-current">Large</h3>
              <BrutalButton size="lg" variant="primary">
                Large Button
              </BrutalButton>
              <BrutalButton size="lg" variant="secondary">
                Large Secondary
              </BrutalButton>
              <BrutalButton size="lg" variant="ghost">
                Large Ghost
              </BrutalButton>
            </div>
          </div>
        </section>

        {/* States Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-current">
            Button States
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-current">Normal</h3>
              <BrutalButton variant="primary">Normal State</BrutalButton>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-current">Loading</h3>
              <BrutalButton variant="primary" loading>
                Loading State
              </BrutalButton>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-current">Disabled</h3>
              <BrutalButton variant="primary" disabled>
                Disabled State
              </BrutalButton>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-current">Full Width</h3>
              <BrutalButton variant="primary" fullWidth>
                Full Width Button
              </BrutalButton>
            </div>
          </div>
        </section>

        {/* Theme Comparison Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-current">
            Theme Comparison
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-current">
                Extreme Brutalist
              </h3>
              <div className="space-y-3">
                <BrutalButton variant="primary" theme="extreme-brutalist">
                  Extreme Primary
                </BrutalButton>
                <BrutalButton variant="secondary" theme="extreme-brutalist">
                  Extreme Secondary
                </BrutalButton>
                <BrutalButton variant="ghost" theme="extreme-brutalist">
                  Extreme Ghost
                </BrutalButton>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-current">
                Refined Brutalist
              </h3>
              <div className="space-y-3">
                <BrutalButton variant="primary" theme="refined-brutalist">
                  Refined Primary
                </BrutalButton>
                <BrutalButton variant="secondary" theme="refined-brutalist">
                  Refined Secondary
                </BrutalButton>
                <BrutalButton variant="ghost" theme="refined-brutalist">
                  Refined Ghost
                </BrutalButton>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Demo Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-current">
            Interactive Demo
          </h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <BrutalButton
                variant="primary"
                onClick={() => alert("Primary action executed!")}
              >
                Execute Primary Action
              </BrutalButton>

              <BrutalButton
                variant="secondary"
                onClick={() => console.log("Secondary action logged")}
              >
                Log Secondary Action
              </BrutalButton>

              <BrutalButton
                variant="ghost"
                onClick={() => {
                  const result = confirm("Are you sure you want to proceed?");
                  console.log("Ghost action result:", result);
                }}
              >
                Confirm Ghost Action
              </BrutalButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BrutalButton
                variant="primary"
                size="lg"
                loading={loadingStates.interactive}
                onClick={() => handleLoadingDemo("interactive")}
                fullWidth
              >
                {loadingStates.interactive
                  ? "Processing Request..."
                  : "Start Long Process"}
              </BrutalButton>

              <BrutalButton
                variant="secondary"
                size="lg"
                onClick={() => {
                  const timestamp = new Date().toLocaleTimeString();
                  console.log(`Button clicked at ${timestamp}`);
                  alert(`Action completed at ${timestamp}`);
                }}
                fullWidth
              >
                Timestamp Action
              </BrutalButton>
            </div>
          </div>
        </section>

        {/* Accessibility Demo Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-current">
            Accessibility Features
          </h2>
          <div className="space-y-4">
            <p className="text-current">
              All buttons support keyboard navigation (Tab, Enter, Space) and
              screen readers. Try navigating with your keyboard:
            </p>
            <div className="flex flex-wrap gap-4">
              <BrutalButton
                variant="primary"
                onClick={() => console.log("Keyboard accessible button 1")}
              >
                Focus Me First
              </BrutalButton>

              <BrutalButton
                variant="secondary"
                onClick={() => console.log("Keyboard accessible button 2")}
              >
                Then Focus Me
              </BrutalButton>

              <BrutalButton
                variant="ghost"
                onClick={() => console.log("Keyboard accessible button 3")}
              >
                Finally Focus Me
              </BrutalButton>

              <BrutalButton
                variant="primary"
                disabled
                onClick={() => console.log("This should not fire")}
              >
                Skip Me (Disabled)
              </BrutalButton>
            </div>
          </div>
        </section>

        {/* Animation Effects Demo */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-current">
            Animation Effects
          </h2>
          <div className="space-y-4">
            <p className="text-current">
              Hover over these buttons to see the complex layered animations:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-current">Shimmer Effect</h4>
                <BrutalButton variant="primary" size="lg">
                  Hover for Shimmer
                </BrutalButton>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-current">Strike Animation</h4>
                <BrutalButton variant="secondary" size="lg">
                  Hover for Strike
                </BrutalButton>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-current">
                  {currentTheme === "extreme-brutalist"
                    ? "Glitch Effect"
                    : "Glow Effect"}
                </h4>
                <BrutalButton variant="ghost" size="lg">
                  Hover for{" "}
                  {currentTheme === "extreme-brutalist" ? "Glitch" : "Glow"}
                </BrutalButton>
              </div>
            </div>
          </div>
        </section>

        {/* Usage Instructions */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-current">
            Usage Instructions
          </h2>
          <div className="bg-current text-bg p-6 rounded-lg">
            <pre className="text-sm overflow-x-auto">
              {`import { BrutalButton } from '@/components/ui/BrutalButton';

// Basic usage
<BrutalButton onClick={handleClick}>
  Click Me
</BrutalButton>

// With all props
<BrutalButton
  variant="primary"
  size="lg"
  theme="extreme-brutalist"
  loading={isLoading}
  disabled={isDisabled}
  fullWidth
  className="custom-class"
  onClick={handleClick}
>
  Advanced Button
</BrutalButton>`}
            </pre>
          </div>
        </section>
      </div>
    </div>
  );
};
