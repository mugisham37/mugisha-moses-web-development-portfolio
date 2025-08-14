"use client";

import React from "react";
import { motion } from "framer-motion";
import { CTAButton } from "./cta-button";
import { Typography } from "./typography";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export function CTAButtonShowcase() {
  return (
    <div className="space-y-12">
      <div className="text-center">
        <Typography variant="h2" className="mb-4">
          Advanced CTA Button System
        </Typography>
        <Typography variant="large" className="mx-auto max-w-3xl text-gray-400">
          Sophisticated call-to-action buttons with micro-interactions, haptic
          feedback simulation, and advanced animations designed for maximum
          engagement and accessibility.
        </Typography>
      </div>

      {/* Basic Variants */}
      <motion.section
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Typography variant="h3" className="text-center">
          Button Variants with Enhanced Animations
        </Typography>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <motion.div variants={cardVariants}>
            <Card className="flex h-64 flex-col items-center justify-center space-y-4">
              <CardHeader className="text-center">
                <CardTitle className="text-lg">Primary CTA</CardTitle>
              </CardHeader>
              <CardContent>
                <CTAButton
                  variant="primary"
                  size="lg"
                  glowEffect={true}
                  sparkleEffect={true}
                  hapticIntensity="strong"
                  onClick={() => console.log("Primary CTA clicked")}
                >
                  GET STARTED
                </CTAButton>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card className="flex h-64 flex-col items-center justify-center space-y-4">
              <CardHeader className="text-center">
                <CardTitle className="text-lg">Accent CTA</CardTitle>
              </CardHeader>
              <CardContent>
                <CTAButton
                  variant="accent"
                  size="lg"
                  glowEffect={true}
                  sparkleEffect={true}
                  hapticIntensity="strong"
                  onClick={() => console.log("Accent CTA clicked")}
                >
                  VIEW PROJECTS
                </CTAButton>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card className="flex h-64 flex-col items-center justify-center space-y-4">
              <CardHeader className="text-center">
                <CardTitle className="text-lg">Ghost CTA</CardTitle>
              </CardHeader>
              <CardContent>
                <CTAButton
                  variant="ghost"
                  size="lg"
                  glowEffect={true}
                  sparkleEffect={true}
                  hapticIntensity="medium"
                  onClick={() => console.log("Ghost CTA clicked")}
                >
                  LEARN MORE
                </CTAButton>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card className="flex h-64 flex-col items-center justify-center space-y-4">
              <CardHeader className="text-center">
                <CardTitle className="text-lg">Secondary CTA</CardTitle>
              </CardHeader>
              <CardContent>
                <CTAButton
                  variant="secondary"
                  size="lg"
                  glowEffect={true}
                  sparkleEffect={true}
                  hapticIntensity="light"
                  onClick={() => console.log("Secondary CTA clicked")}
                >
                  CONTACT US
                </CTAButton>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.section>

      {/* Size Variants */}
      <motion.section
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Typography variant="h3" className="text-center">
          Size Variants with Consistent Animations
        </Typography>

        <div className="flex flex-wrap items-end justify-center gap-6">
          <motion.div variants={cardVariants}>
            <CTAButton
              variant="accent"
              size="sm"
              glowEffect={true}
              sparkleEffect={true}
              onClick={() => console.log("Small CTA clicked")}
            >
              SMALL
            </CTAButton>
          </motion.div>

          <motion.div variants={cardVariants}>
            <CTAButton
              variant="accent"
              size="md"
              glowEffect={true}
              sparkleEffect={true}
              onClick={() => console.log("Medium CTA clicked")}
            >
              MEDIUM
            </CTAButton>
          </motion.div>

          <motion.div variants={cardVariants}>
            <CTAButton
              variant="accent"
              size="lg"
              glowEffect={true}
              sparkleEffect={true}
              onClick={() => console.log("Large CTA clicked")}
            >
              LARGE
            </CTAButton>
          </motion.div>

          <motion.div variants={cardVariants}>
            <CTAButton
              variant="accent"
              size="xl"
              glowEffect={true}
              sparkleEffect={true}
              onClick={() => console.log("Extra Large CTA clicked")}
            >
              EXTRA LARGE
            </CTAButton>
          </motion.div>
        </div>
      </motion.section>

      {/* Haptic Intensity Demonstration */}
      <motion.section
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Typography variant="h3" className="text-center">
          Haptic Feedback Intensity Levels
        </Typography>
        <Typography
          variant="body"
          className="mx-auto max-w-2xl text-center text-gray-400"
        >
          Experience different levels of haptic feedback simulation through
          visual and transform feedback. Each intensity provides different
          tactile response patterns.
        </Typography>

        <div className="flex flex-wrap justify-center gap-6">
          <motion.div variants={cardVariants}>
            <CTAButton
              variant="ghost"
              size="lg"
              hapticIntensity="light"
              soundDesignFeedback={true}
              onClick={() => console.log("Light haptic feedback")}
            >
              LIGHT FEEDBACK
            </CTAButton>
          </motion.div>

          <motion.div variants={cardVariants}>
            <CTAButton
              variant="primary"
              size="lg"
              hapticIntensity="medium"
              soundDesignFeedback={true}
              onClick={() => console.log("Medium haptic feedback")}
            >
              MEDIUM FEEDBACK
            </CTAButton>
          </motion.div>

          <motion.div variants={cardVariants}>
            <CTAButton
              variant="accent"
              size="lg"
              hapticIntensity="strong"
              soundDesignFeedback={true}
              onClick={() => console.log("Strong haptic feedback")}
            >
              STRONG FEEDBACK
            </CTAButton>
          </motion.div>
        </div>
      </motion.section>

      {/* Special Effects Showcase */}
      <motion.section
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Typography variant="h3" className="text-center">
          Special Effects and Micro-Interactions
        </Typography>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <motion.div variants={cardVariants}>
            <Card className="flex h-48 flex-col items-center justify-center space-y-4">
              <CardHeader className="text-center">
                <CardTitle className="text-sm">Glow Effect Only</CardTitle>
              </CardHeader>
              <CardContent>
                <CTAButton
                  variant="accent"
                  size="md"
                  glowEffect={true}
                  sparkleEffect={false}
                  soundDesignFeedback={false}
                  onClick={() => console.log("Glow effect only")}
                >
                  GLOW ONLY
                </CTAButton>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card className="flex h-48 flex-col items-center justify-center space-y-4">
              <CardHeader className="text-center">
                <CardTitle className="text-sm">Sparkle Effect Only</CardTitle>
              </CardHeader>
              <CardContent>
                <CTAButton
                  variant="primary"
                  size="md"
                  glowEffect={false}
                  sparkleEffect={true}
                  soundDesignFeedback={false}
                  onClick={() => console.log("Sparkle effect only")}
                >
                  SPARKLE ONLY
                </CTAButton>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card className="flex h-48 flex-col items-center justify-center space-y-4">
              <CardHeader className="text-center">
                <CardTitle className="text-sm">All Effects</CardTitle>
              </CardHeader>
              <CardContent>
                <CTAButton
                  variant="ghost"
                  size="md"
                  glowEffect={true}
                  sparkleEffect={true}
                  soundDesignFeedback={true}
                  hapticIntensity="strong"
                  onClick={() => console.log("All effects enabled")}
                >
                  FULL EXPERIENCE
                </CTAButton>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.section>

      {/* Accessibility Features */}
      <motion.section
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Typography variant="h3" className="text-center">
          Accessibility and Focus States
        </Typography>
        <Typography
          variant="body"
          className="mx-auto max-w-2xl text-center text-gray-400"
        >
          All CTA buttons include WCAG 2.1 AA compliant focus indicators,
          keyboard navigation support, and screen reader compatibility with
          proper ARIA attributes.
        </Typography>

        <div className="flex flex-wrap justify-center gap-6">
          <motion.div variants={cardVariants}>
            <CTAButton
              variant="accent"
              size="lg"
              glowEffect={true}
              sparkleEffect={true}
              onClick={() => console.log("Accessible CTA clicked")}
              onHoverStart={() =>
                console.log("Hover started - accessible feedback")
              }
              onHoverEnd={() =>
                console.log("Hover ended - accessible feedback")
              }
            >
              TAB TO FOCUS
            </CTAButton>
          </motion.div>

          <motion.div variants={cardVariants}>
            <CTAButton
              variant="primary"
              size="lg"
              loading={true}
              loadingText="Processing..."
            >
              LOADING STATE
            </CTAButton>
          </motion.div>

          <motion.div variants={cardVariants}>
            <CTAButton variant="secondary" size="lg" disabled={true}>
              DISABLED STATE
            </CTAButton>
          </motion.div>
        </div>
      </motion.section>

      {/* Usage Guidelines */}
      <motion.section
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Typography variant="h3" className="text-center">
          Implementation Guidelines
        </Typography>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Best Practices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Typography variant="body" className="text-sm">
                • Use <code>hapticIntensity=&quot;strong&quot;</code> for
                primary actions
              </Typography>
              <Typography variant="body" className="text-sm">
                • Enable all effects for hero section CTAs
              </Typography>
              <Typography variant="body" className="text-sm">
                • Use <code>glowEffect</code> for accent and primary variants
              </Typography>
              <Typography variant="body" className="text-sm">
                • Implement proper analytics tracking in onClick handlers
              </Typography>
              <Typography variant="body" className="text-sm">
                • Test with keyboard navigation and screen readers
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Considerations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Typography variant="body" className="text-sm">
                • Effects use CSS transforms for 60fps performance
              </Typography>
              <Typography variant="body" className="text-sm">
                • Sparkle effects are automatically cleaned up
              </Typography>
              <Typography variant="body" className="text-sm">
                • Reduced motion preferences are respected
              </Typography>
              <Typography variant="body" className="text-sm">
                • 3D transforms use GPU acceleration
              </Typography>
              <Typography variant="body" className="text-sm">
                • Haptic simulation is lightweight and non-blocking
              </Typography>
            </CardContent>
          </Card>
        </div>
      </motion.section>
    </div>
  );
}
