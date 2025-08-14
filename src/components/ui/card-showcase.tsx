"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardImage,
  CardBadge,
  CardActions,
} from "./card";
import { Button } from "./button";
import { Typography } from "./typography";

export function CardShowcase() {
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

  return (
    <div className="space-y-16 p-8">
      {/* Header */}
      <div className="space-y-4 text-center">
        <Typography variant="display" className="text-brutalist-yellow">
          Enhanced Card System
        </Typography>
        <Typography variant="h3" className="text-brutalist-off-white-100">
          Brutalist Design with Modern Refinements
        </Typography>
      </div>

      {/* Hover Effects Showcase */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="space-y-8"
      >
        <Typography variant="h2" className="text-center">
          Hover Effects
        </Typography>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <motion.div variants={cardVariants}>
            <Card hover="lift" className="h-64">
              <CardHeader>
                <CardBadge variant="accent">LIFT</CardBadge>
                <CardTitle level={4}>Lift Effect</CardTitle>
                <CardDescription>
                  Hover to see the card lift with enhanced shadow
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card hover="glow" className="h-64">
              <CardHeader>
                <CardBadge variant="outline">GLOW</CardBadge>
                <CardTitle level={4}>Glow Effect</CardTitle>
                <CardDescription>
                  Hover to see the accent glow effect
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card hover="invert" className="h-64">
              <CardHeader>
                <CardBadge>INVERT</CardBadge>
                <CardTitle level={4}>Invert Effect</CardTitle>
                <CardDescription>Hover to see color inversion</CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card hover="scale" className="h-64">
              <CardHeader>
                <CardBadge variant="accent">SCALE</CardBadge>
                <CardTitle level={4}>Scale Effect</CardTitle>
                <CardDescription>Hover to see subtle scaling</CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        </div>
      </motion.section>

      {/* Card Variants Showcase */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="space-y-8"
      >
        <Typography variant="h2" className="text-center">
          Card Variants
        </Typography>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <motion.div variants={cardVariants}>
            <Card variant="default" hover="lift">
              <CardHeader>
                <CardTitle level={4}>Default</CardTitle>
                <CardDescription>
                  Standard black background with white border
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Perfect for most content with high contrast and readability.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card variant="elevated" hover="glow">
              <CardHeader>
                <CardTitle level={4}>Elevated</CardTitle>
                <CardDescription>
                  Charcoal background with built-in shadow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Great for secondary content that needs subtle emphasis.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card variant="accent" hover="scale">
              <CardHeader>
                <CardTitle level={4}>Accent</CardTitle>
                <CardDescription variant="muted">
                  Yellow background for high impact
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-black">
                  Use sparingly for call-to-action or featured content.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card variant="outline" hover="invert">
              <CardHeader>
                <CardTitle level={4}>Outline</CardTitle>
                <CardDescription>Transparent with border only</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Minimal design for subtle content organization.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.section>

      {/* Loading States */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="space-y-8"
      >
        <Typography variant="h2" className="text-center">
          Loading States
        </Typography>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <motion.div variants={cardVariants}>
            <Card isLoading />
          </motion.div>
          <motion.div variants={cardVariants}>
            <Card variant="elevated" isLoading />
          </motion.div>
          <motion.div variants={cardVariants}>
            <Card variant="accent" isLoading />
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
