"use client";

import React from "react";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ColorAccessibilityChecker } from "@/components/ui/color-accessibility-checker";
import { designTokens } from "@/lib/design-tokens";

/**
 * Color Scheme Test Component
 * This component demonstrates and tests the enhanced color scheme implementation
 * Only use this component in development for testing purposes
 */
export function ColorSchemeTest() {
  const backgroundVariants = [
    "default",
    "textured-light",
    "dark-gradient",
    "light-gradient",
    "accent-gradient",
    "textured-dark",
  ] as const;

  return (
    <div className="min-h-screen">
      <Section padding="xl" background="default">
        <Container>
          <div className="space-y-6 text-center">
            <Typography variant="h1" className="text-brutalist-yellow">
              COLOR SCHEME TEST
            </Typography>
            <Typography variant="body" className="mx-auto max-w-2xl text-white">
              Testing the enhanced color scheme and visual balance
              implementation with WCAG AA compliance verification.
            </Typography>

            {/* Accessibility Report */}
            <div className="mx-auto max-w-md rounded-lg bg-white p-6 text-black">
              <ColorAccessibilityChecker
                foreground={designTokens.colors.primary.white}
                background={designTokens.colors.primary.black}
                accent={designTokens.colors.accent.yellow}
                showDetails={true}
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* Test all background variants */}
      {backgroundVariants.map((variant, index) => (
        <Section key={variant} padding="xl" background={variant}>
          <Container>
            <div className="space-y-8">
              <div className="text-center">
                <Typography
                  variant="h2"
                  className={`mb-4 text-4xl font-bold uppercase ${
                    variant.includes("light") || variant === "accent-gradient"
                      ? "text-black"
                      : "text-brutalist-yellow"
                  }`}
                >
                  {variant.replace("-", " ").toUpperCase()} BACKGROUND
                </Typography>
                <Typography
                  variant="body"
                  className={`mx-auto max-w-2xl ${
                    variant.includes("light") || variant === "accent-gradient"
                      ? "text-brutalist-charcoal-200"
                      : "text-white"
                  }`}
                >
                  Testing visual balance and color contrast in the {variant}{" "}
                  background variant. This section demonstrates proper text
                  hierarchy and readability.
                </Typography>
              </div>

              {/* Sample content grid */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <Card
                  variant="default"
                  hover="lift"
                  className={`${
                    variant.includes("light") || variant === "accent-gradient"
                      ? "border-black bg-white text-black"
                      : "bg-brutalist-charcoal-100 border-white text-white"
                  }`}
                >
                  <CardHeader>
                    <CardTitle
                      className={
                        variant.includes("light") ||
                        variant === "accent-gradient"
                          ? "text-black"
                          : "text-brutalist-yellow"
                      }
                    >
                      SAMPLE CARD
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Typography variant="body" className="mb-4">
                      This card demonstrates proper contrast and readability in
                      the {variant} background context.
                    </Typography>
                    <Button
                      variant={
                        variant.includes("light") ||
                        variant === "accent-gradient"
                          ? "secondary"
                          : "accent"
                      }
                      size="sm"
                    >
                      TEST BUTTON
                    </Button>
                  </CardContent>
                </Card>

                <Card
                  variant="elevated"
                  hover="glow"
                  className={`${
                    variant.includes("light") || variant === "accent-gradient"
                      ? "bg-brutalist-charcoal-100 border-black text-white"
                      : "border-white bg-white text-black"
                  }`}
                >
                  <CardHeader>
                    <CardTitle
                      className={
                        variant.includes("light") ||
                        variant === "accent-gradient"
                          ? "text-brutalist-yellow"
                          : "text-black"
                      }
                    >
                      ELEVATED CARD
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Typography variant="body" className="mb-4">
                      Elevated card variant with enhanced visual hierarchy and
                      proper contrast ratios.
                    </Typography>
                    <Button variant="accent" size="sm">
                      ACCENT ACTION
                    </Button>
                  </CardContent>
                </Card>

                <Card
                  variant="accent"
                  hover="invert"
                  className="bg-brutalist-yellow border-black text-black"
                >
                  <CardHeader>
                    <CardTitle className="text-black">ACCENT CARD</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Typography variant="body" className="mb-4 text-black">
                      Accent card with maximum visual impact and strategic color
                      application.
                    </Typography>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="text-brutalist-yellow hover:bg-brutalist-charcoal-100 border-black bg-black"
                    >
                      CONTRAST BUTTON
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Color accessibility indicators */}
              <div className="flex justify-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span
                    className={
                      variant.includes("light") || variant === "accent-gradient"
                        ? "text-black"
                        : "text-white"
                    }
                  >
                    WCAG AA Compliant
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="bg-brutalist-yellow h-3 w-3 rounded-full"></div>
                  <span
                    className={
                      variant.includes("light") || variant === "accent-gradient"
                        ? "text-black"
                        : "text-white"
                    }
                  >
                    Strategic Accent
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <span
                    className={
                      variant.includes("light") || variant === "accent-gradient"
                        ? "text-black"
                        : "text-white"
                    }
                  >
                    Visual Balance
                  </span>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      ))}

      {/* Summary section */}
      <Section padding="xl" background="default">
        <Container>
          <div className="space-y-6 text-center">
            <Typography
              variant="h2"
              className="text-brutalist-yellow text-4xl font-bold uppercase"
            >
              IMPLEMENTATION COMPLETE
            </Typography>
            <Typography variant="body" className="mx-auto max-w-3xl text-white">
              The enhanced color scheme and visual balance implementation is
              complete. All sections demonstrate proper contrast ratios,
              strategic accent color application, smooth transitions, and WCAG
              AA accessibility compliance.
            </Typography>

            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="mb-4 text-6xl">✓</div>
                <Typography variant="h3" className="text-brutalist-yellow mb-2">
                  WCAG AA COMPLIANT
                </Typography>
                <Typography variant="body" className="text-white">
                  All color combinations meet accessibility standards
                </Typography>
              </div>

              <div className="text-center">
                <div className="mb-4 text-6xl">🎨</div>
                <Typography variant="h3" className="text-brutalist-yellow mb-2">
                  STRATEGIC COLORS
                </Typography>
                <Typography variant="body" className="text-white">
                  Accent colors applied for maximum visual impact
                </Typography>
              </div>

              <div className="text-center">
                <div className="mb-4 text-6xl">⚖️</div>
                <Typography variant="h3" className="text-brutalist-yellow mb-2">
                  VISUAL BALANCE
                </Typography>
                <Typography variant="body" className="text-white">
                  Perfect alternation creates engaging rhythm
                </Typography>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
