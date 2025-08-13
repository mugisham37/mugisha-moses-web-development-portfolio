"use client";

import React from "react";
import { Button } from "./button";
import {
  Download,
  ArrowRight,
  Heart,
  Star,
  Send,
  Trash2,
  Plus,
  Check,
  X,
  ExternalLink,
} from "lucide-react";

export function ButtonShowcase() {
  const [loadingStates, setLoadingStates] = React.useState<
    Record<string, boolean>
  >({});

  const handleLoadingDemo = (buttonId: string) => {
    setLoadingStates((prev) => ({ ...prev, [buttonId]: true }));
    setTimeout(() => {
      setLoadingStates((prev) => ({ ...prev, [buttonId]: false }));
    }, 2000);
  };

  return (
    <div className="space-y-12 bg-black p-8 text-white">
      <div className="space-y-4 text-center">
        <h1 className="text-accent-yellow font-mono text-4xl font-bold tracking-wider uppercase">
          Advanced Button System
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-300">
          Sophisticated button components with multiple variants, advanced
          animations, loading states, and comprehensive accessibility features.
        </p>
      </div>

      {/* Button Variants */}
      <section className="space-y-6">
        <h2 className="border-b-4 border-white pb-2 font-mono text-2xl font-bold tracking-wider uppercase">
          Button Variants
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-accent-yellow font-mono text-lg font-bold">
              Primary
            </h3>
            <div className="space-y-3">
              <Button variant="primary" size="sm">
                Small Primary
              </Button>
              <Button variant="primary" size="md">
                Medium Primary
              </Button>
              <Button variant="primary" size="lg">
                Large Primary
              </Button>
              <Button variant="primary" size="xl">
                XL Primary
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-accent-yellow font-mono text-lg font-bold">
              Secondary
            </h3>
            <div className="space-y-3">
              <Button variant="secondary" size="sm">
                Small Secondary
              </Button>
              <Button variant="secondary" size="md">
                Medium Secondary
              </Button>
              <Button variant="secondary" size="lg">
                Large Secondary
              </Button>
              <Button variant="secondary" size="xl">
                XL Secondary
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-accent-yellow font-mono text-lg font-bold">
              Accent
            </h3>
            <div className="space-y-3">
              <Button variant="accent" size="sm">
                Small Accent
              </Button>
              <Button variant="accent" size="md">
                Medium Accent
              </Button>
              <Button variant="accent" size="lg">
                Large Accent
              </Button>
              <Button variant="accent" size="xl">
                XL Accent
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-accent-yellow font-mono text-lg font-bold">
              Ghost
            </h3>
            <div className="space-y-3">
              <Button variant="ghost" size="sm">
                Small Ghost
              </Button>
              <Button variant="ghost" size="md">
                Medium Ghost
              </Button>
              <Button variant="ghost" size="lg">
                Large Ghost
              </Button>
              <Button variant="ghost" size="xl">
                XL Ghost
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Button States */}
      <section className="space-y-6">
        <h2 className="border-b-4 border-white pb-2 font-mono text-2xl font-bold tracking-wider uppercase">
          Button States
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-4">
            <h3 className="text-accent-yellow font-mono text-lg font-bold">
              Normal States
            </h3>
            <div className="space-y-3">
              <Button variant="primary">Normal Button</Button>
              <Button variant="primary" disabled>
                Disabled Button
              </Button>
              <Button variant="destructive">Destructive Button</Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-accent-yellow font-mono text-lg font-bold">
              Loading States
            </h3>
            <div className="space-y-3">
              <Button
                variant="primary"
                loading={loadingStates.loading1}
                onClick={() => handleLoadingDemo("loading1")}
              >
                Click to Load
              </Button>
              <Button
                variant="accent"
                loading={loadingStates.loading2}
                loadingText="Processing..."
                onClick={() => handleLoadingDemo("loading2")}
              >
                Custom Loading Text
              </Button>
              <Button variant="secondary" loading>
                Always Loading
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-accent-yellow font-mono text-lg font-bold">
              Focus States
            </h3>
            <div className="space-y-3">
              <Button variant="primary">Tab to Focus</Button>
              <Button variant="accent">Keyboard Navigation</Button>
              <Button variant="ghost">Accessibility Ready</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Buttons with Icons */}
      <section className="space-y-6">
        <h2 className="border-b-4 border-white pb-2 font-mono text-2xl font-bold tracking-wider uppercase">
          Buttons with Icons
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-4">
            <h3 className="text-accent-yellow font-mono text-lg font-bold">
              Left Icons
            </h3>
            <div className="space-y-3">
              <Button variant="primary" leftIcon={<Download />}>
                Download
              </Button>
              <Button variant="accent" leftIcon={<Plus />}>
                Add New
              </Button>
              <Button variant="secondary" leftIcon={<Heart />}>
                Like
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-accent-yellow font-mono text-lg font-bold">
              Right Icons
            </h3>
            <div className="space-y-3">
              <Button variant="primary" rightIcon={<ArrowRight />}>
                Continue
              </Button>
              <Button variant="accent" rightIcon={<ExternalLink />}>
                Open Link
              </Button>
              <Button variant="ghost" rightIcon={<Send />}>
                Send Message
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-accent-yellow font-mono text-lg font-bold">
              Both Icons
            </h3>
            <div className="space-y-3">
              <Button
                variant="primary"
                leftIcon={<Star />}
                rightIcon={<ArrowRight />}
              >
                Featured
              </Button>
              <Button
                variant="destructive"
                leftIcon={<Trash2 />}
                rightIcon={<X />}
              >
                Delete
              </Button>
              <Button
                variant="accent"
                leftIcon={<Check />}
                rightIcon={<ArrowRight />}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demos */}
      <section className="space-y-6">
        <h2 className="border-b-4 border-white pb-2 font-mono text-2xl font-bold tracking-wider uppercase">
          Interactive Demos
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-accent-yellow font-mono text-lg font-bold">
              Hover Effects Demo
            </h3>
            <p className="text-sm text-gray-400">
              Hover over these buttons to see the sophisticated animations
              including scale, shadow, and color transitions.
            </p>
            <div className="space-y-3">
              <Button variant="primary" size="lg">
                Hover for Scale + Shadow
              </Button>
              <Button variant="accent" size="lg">
                Hover for Color Inversion
              </Button>
              <Button variant="ghost" size="lg">
                Hover for Background Fill
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-accent-yellow font-mono text-lg font-bold">
              Click Feedback Demo
            </h3>
            <p className="text-sm text-gray-400">
              Click these buttons to see the tactile feedback through
              micro-animations and ripple effects.
            </p>
            <div className="space-y-3">
              <Button variant="primary" size="lg">
                Click for Ripple Effect
              </Button>
              <Button variant="secondary" size="lg">
                Click for Scale Animation
              </Button>
              <Button variant="accent" size="lg">
                Click for Press Feedback
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Accessibility Features */}
      <section className="space-y-6">
        <h2 className="border-b-4 border-white pb-2 font-mono text-2xl font-bold tracking-wider uppercase">
          Accessibility Features
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-accent-yellow font-mono text-lg font-bold">
              Keyboard Navigation
            </h3>
            <p className="text-sm text-gray-400">
              All buttons support full keyboard navigation with Tab, Enter, and
              Space keys. Focus indicators meet WCAG guidelines.
            </p>
            <div className="space-y-3">
              <Button variant="primary">Tab to Focus</Button>
              <Button variant="accent">Press Enter/Space</Button>
              <Button variant="ghost">Keyboard Accessible</Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-accent-yellow font-mono text-lg font-bold">
              Screen Reader Support
            </h3>
            <p className="text-sm text-gray-400">
              Buttons include proper ARIA labels, loading announcements, and
              semantic markup for screen readers.
            </p>
            <div className="space-y-3">
              <Button
                variant="primary"
                loading={loadingStates.screenReader}
                loadingText="Processing your request"
                onClick={() => handleLoadingDemo("screenReader")}
              >
                Screen Reader Demo
              </Button>
              <Button variant="accent" disabled>
                Disabled State Announced
              </Button>
              <Button variant="ghost" aria-label="Close dialog">
                <X />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Features */}
      <section className="space-y-6">
        <h2 className="border-b-4 border-white pb-2 font-mono text-2xl font-bold tracking-wider uppercase">
          Performance & Motion
        </h2>
        <div className="space-y-4">
          <p className="text-sm text-gray-400">
            All animations respect user preferences for reduced motion and use
            hardware acceleration for smooth 60fps performance. Buttons include
            touch-friendly sizing and haptic feedback simulation.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" size="lg">
              Hardware Accelerated
            </Button>
            <Button variant="accent" size="lg">
              Reduced Motion Friendly
            </Button>
            <Button variant="secondary" size="lg">
              Touch Optimized
            </Button>
            <Button variant="ghost" size="lg">
              60fps Animations
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
