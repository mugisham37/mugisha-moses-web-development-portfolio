/**
 * Typography Showcase Component
 * Demonstrates the enhanced typography system
 */

import React from "react";
import { Typography } from "./typography";

export function TypographyShowcase() {
  return (
    <div className="mx-auto max-w-4xl space-y-12 p-8">
      <div className="space-y-6">
        <Typography variant="h2" className="border-accent border-b-4 pb-2">
          Enhanced Typography System
        </Typography>

        <Typography variant="body" className="text-muted-foreground">
          Demonstrating the refined typography scale with Space Mono and Inter
          fonts, responsive scaling, and improved hierarchy.
        </Typography>
      </div>

      {/* Display and Headings */}
      <section className="space-y-6">
        <Typography variant="h3">Display & Headings</Typography>

        <div className="space-y-4">
          <Typography variant="display" className="text-accent">
            Display Text
          </Typography>

          <Typography variant="h1">Heading Level 1</Typography>

          <Typography variant="h2">Heading Level 2</Typography>

          <Typography variant="h3">Heading Level 3</Typography>

          <Typography variant="h4">Heading Level 4</Typography>

          <Typography variant="h5">Heading Level 5</Typography>

          <Typography variant="h6">Heading Level 6</Typography>
        </div>
      </section>

      {/* Body Text Variants */}
      <section className="space-y-6">
        <Typography variant="h3">Body Text Variants</Typography>

        <div className="space-y-4">
          <Typography variant="lead">
            This is lead text that introduces important content with emphasis
            and larger sizing.
          </Typography>

          <Typography variant="bodyLarge">
            This is large body text that provides enhanced readability for
            important content while maintaining the clean, modern aesthetic of
            the design system.
          </Typography>

          <Typography variant="body">
            This is regular body text that forms the foundation of readable
            content. It uses Inter font for optimal readability and includes
            proper line height and letter spacing for comfortable reading across
            all devices.
          </Typography>

          <Typography variant="bodySmall">
            This is small body text used for secondary information, captions, or
            supplementary content that needs to be readable but less prominent.
          </Typography>
        </div>
      </section>

      {/* Specialized Text */}
      <section className="space-y-6">
        <Typography variant="h3">Specialized Text</Typography>

        <div className="space-y-4">
          <Typography variant="subtitle">
            Subtitle Text for Section Headers
          </Typography>

          <Typography variant="caption">
            Caption text for images and small details
          </Typography>

          <Typography variant="overline">
            Overline text for categories
          </Typography>

          <Typography variant="code">inline code text</Typography>

          <Typography variant="codeBlock">
            {`// Code block example
function enhancedTypography() {
  return "Beautiful, responsive typography";
}`}
          </Typography>
        </div>
      </section>

      {/* Typography Utilities */}
      <section className="space-y-6">
        <Typography variant="h3">Typography Utilities</Typography>

        <div className="space-y-4">
          <Typography variant="body" weight="light">
            Light weight text for subtle emphasis
          </Typography>

          <Typography variant="body" weight="medium">
            Medium weight text for moderate emphasis
          </Typography>

          <Typography variant="body" weight="bold">
            Bold weight text for strong emphasis
          </Typography>

          <Typography variant="body" spacing="tight">
            Tight letter spacing for compact text
          </Typography>

          <Typography variant="body" spacing="wide">
            Wide letter spacing for expanded text
          </Typography>

          <Typography variant="body" align="center">
            Center aligned text for special layouts
          </Typography>

          <Typography variant="body" color="accent">
            Accent colored text for highlights
          </Typography>

          <Typography variant="body" gradient>
            Gradient text effect for special emphasis
          </Typography>

          <Typography variant="body" truncate className="max-w-xs">
            This text will be truncated when it exceeds the container width
          </Typography>
        </div>
      </section>

      {/* Responsive Scaling Demo */}
      <section className="space-y-6">
        <Typography variant="h3">Responsive Scaling</Typography>

        <div className="space-y-4">
          <Typography variant="body">
            The typography system includes responsive scaling that adapts to
            different screen sizes. Resize your browser window to see the text
            scale smoothly across breakpoints.
          </Typography>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Typography variant="h4">Mobile First</Typography>
              <Typography variant="body">
                Text starts at mobile-optimized sizes and scales up for larger
                screens.
              </Typography>
            </div>

            <div className="space-y-2">
              <Typography variant="h4">Fluid Scaling</Typography>
              <Typography variant="body">
                Uses CSS clamp() for smooth scaling between breakpoints.
              </Typography>
            </div>
          </div>
        </div>
      </section>

      {/* Accessibility Features */}
      <section className="space-y-6">
        <Typography variant="h3">Accessibility Features</Typography>

        <div className="space-y-4">
          <Typography variant="body">
            The enhanced typography system includes several accessibility
            improvements:
          </Typography>

          <ul className="ml-6 space-y-2">
            <li>
              <Typography variant="body">
                • Optimal contrast ratios for WCAG AA compliance
              </Typography>
            </li>
            <li>
              <Typography variant="body">
                • Improved font loading with proper fallbacks
              </Typography>
            </li>
            <li>
              <Typography variant="body">
                • Better text wrapping with text-balance and text-pretty
              </Typography>
            </li>
            <li>
              <Typography variant="body">
                • Responsive font sizes that maintain readability
              </Typography>
            </li>
            <li>
              <Typography variant="body">
                • Proper semantic HTML elements for screen readers
              </Typography>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}

export default TypographyShowcase;
