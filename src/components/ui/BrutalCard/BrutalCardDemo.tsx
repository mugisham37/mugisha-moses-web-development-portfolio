"use client";

import React from "react";
import { BrutalCard } from "./BrutalCard";

/**
 * BrutalCardDemo - Demonstrates all BrutalCard variants and features
 */
export const BrutalCardDemo: React.FC = () => {
  return (
    <div className="p-8 space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">BrutalCard Component Demo</h2>
        <p className="text-muted">
          Showcasing all variants, sizes, and interactive features of the
          BrutalCard component.
        </p>
      </div>

      {/* Basic Variants */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Basic Variants</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <BrutalCard variant="default">
            <h4 className="font-bold mb-2">Default Card</h4>
            <p className="text-sm">Standard card with brutal shadow effects.</p>
          </BrutalCard>

          <BrutalCard variant="elevated">
            <h4 className="font-bold mb-2">Elevated Card</h4>
            <p className="text-sm">Pre-elevated with enhanced shadow depth.</p>
          </BrutalCard>

          <BrutalCard variant="flat">
            <h4 className="font-bold mb-2">Flat Card</h4>
            <p className="text-sm">Minimal styling, shadows on hover only.</p>
          </BrutalCard>

          <BrutalCard variant="outlined">
            <h4 className="font-bold mb-2">Outlined Card</h4>
            <p className="text-sm">Transparent background with border only.</p>
          </BrutalCard>
        </div>
      </section>

      {/* Interactive Cards */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Interactive Cards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <BrutalCard
            variant="default"
            interactive
            onClick={() => alert("Default card clicked!")}
          >
            <h4 className="font-bold mb-2">Clickable Card</h4>
            <p className="text-sm">Click me to see the interaction!</p>
          </BrutalCard>

          <BrutalCard
            variant="elevated"
            interactive
            onClick={() => alert("Elevated card clicked!")}
          >
            <h4 className="font-bold mb-2">Interactive Elevated</h4>
            <p className="text-sm">Enhanced hover effects with elevation.</p>
          </BrutalCard>

          <BrutalCard
            variant="outlined"
            interactive
            onClick={() => alert("Outlined card clicked!")}
          >
            <h4 className="font-bold mb-2">Interactive Outlined</h4>
            <p className="text-sm">Fills with accent color on hover.</p>
          </BrutalCard>
        </div>
      </section>

      {/* Size Variants */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Size Variants</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <BrutalCard size="sm" variant="default">
            <h4 className="font-bold mb-2">Small</h4>
            <p className="text-xs">Compact card size.</p>
          </BrutalCard>

          <BrutalCard size="md" variant="default">
            <h4 className="font-bold mb-2">Medium</h4>
            <p className="text-sm">Default card size.</p>
          </BrutalCard>

          <BrutalCard size="lg" variant="default">
            <h4 className="font-bold mb-2">Large</h4>
            <p className="text-sm">Larger card with more space.</p>
          </BrutalCard>

          <BrutalCard size="xl" variant="default">
            <h4 className="font-bold mb-2">Extra Large</h4>
            <p className="text-sm">Maximum card size for featured content.</p>
          </BrutalCard>
        </div>
      </section>

      {/* Clip Path Variants */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Geometric Shapes (Clip Paths)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <BrutalCard clipPath="none" variant="default">
            <h4 className="font-bold mb-2">None</h4>
            <p className="text-sm">Standard rectangle.</p>
          </BrutalCard>

          <BrutalCard clipPath="corner" variant="default">
            <h4 className="font-bold mb-2">Corner</h4>
            <p className="text-sm">Cut corner effect.</p>
          </BrutalCard>

          <BrutalCard clipPath="diagonal" variant="default">
            <h4 className="font-bold mb-2">Diagonal</h4>
            <p className="text-sm">Diagonal cut edges.</p>
          </BrutalCard>

          <BrutalCard clipPath="hexagon" variant="default">
            <h4 className="font-bold mb-2">Hexagon</h4>
            <p className="text-sm">Hexagonal shape.</p>
          </BrutalCard>

          <BrutalCard clipPath="arrow" variant="default">
            <h4 className="font-bold mb-2">Arrow</h4>
            <p className="text-sm">Arrow-like shape.</p>
          </BrutalCard>
        </div>
      </section>

      {/* Padding Variants */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Padding Variants</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <BrutalCard padding="none" variant="outlined">
            <div className="bg-accent text-bg p-2">
              <h4 className="font-bold mb-1">None</h4>
              <p className="text-xs">No padding.</p>
            </div>
          </BrutalCard>

          <BrutalCard padding="sm" variant="default">
            <h4 className="font-bold mb-2">Small</h4>
            <p className="text-sm">Minimal padding.</p>
          </BrutalCard>

          <BrutalCard padding="md" variant="default">
            <h4 className="font-bold mb-2">Medium</h4>
            <p className="text-sm">Default padding.</p>
          </BrutalCard>

          <BrutalCard padding="lg" variant="default">
            <h4 className="font-bold mb-2">Large</h4>
            <p className="text-sm">Generous padding.</p>
          </BrutalCard>

          <BrutalCard padding="xl" variant="default">
            <h4 className="font-bold mb-2">Extra Large</h4>
            <p className="text-sm">Maximum padding.</p>
          </BrutalCard>
        </div>
      </section>

      {/* Complex Example */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Complex Examples</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BrutalCard
            variant="elevated"
            size="lg"
            clipPath="corner"
            interactive
            onClick={() => alert("Complex card clicked!")}
            className="bg-accent text-bg"
          >
            <div className="space-y-4">
              <h4 className="font-bold text-lg">Featured Project</h4>
              <p className="text-sm opacity-90">
                This is a complex card combining multiple features: elevated
                variant, large size, corner clip path, and interactive behavior.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono">2024</span>
                <span className="text-xs">Click to learn more →</span>
              </div>
            </div>
          </BrutalCard>

          <BrutalCard
            variant="outlined"
            size="lg"
            clipPath="hexagon"
            interactive
            padding="xl"
            onClick={() => alert("Hexagon card clicked!")}
          >
            <div className="text-center space-y-4">
              <h4 className="font-bold text-lg">Geometric Design</h4>
              <p className="text-sm">
                Hexagonal card with outlined variant and extra large padding for
                a unique geometric presentation.
              </p>
              <div className="text-xs font-mono">HOVER TO INTERACT</div>
            </div>
          </BrutalCard>
        </div>
      </section>

      {/* Accessibility Example */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Accessibility Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BrutalCard
            interactive
            onClick={() => alert("Accessible card activated!")}
            role="button"
            aria-label="Accessible interactive card example"
          >
            <h4 className="font-bold mb-2">Keyboard Accessible</h4>
            <p className="text-sm mb-4">
              This card can be activated with Enter or Space keys. It includes
              proper ARIA labels and focus management.
            </p>
            <p className="text-xs text-muted">
              Try tabbing to this card and pressing Enter or Space.
            </p>
          </BrutalCard>

          <BrutalCard as="article" role="article">
            <h4 className="font-bold mb-2">Semantic HTML</h4>
            <p className="text-sm mb-4">
              This card uses semantic HTML with proper roles. It renders as an
              article element instead of a div.
            </p>
            <p className="text-xs text-muted">
              Screen readers will announce this as an article.
            </p>
          </BrutalCard>
        </div>
      </section>
    </div>
  );
};

export default BrutalCardDemo;
