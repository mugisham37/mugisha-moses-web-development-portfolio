"use client";

import React, { useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { ThreeBackground } from "@/components/three/three-background";
import { TypewriterText } from "@/components/animations/typewriter-text";
import { AnimatedCounter } from "@/components/animations/animated-counter";
import { SkillVisualization } from "@/components/animations/skill-visualization";
import { ScrollReveal } from "@/components/animations/scroll-reveal";

interface HeroMetric {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
}

const heroMetrics: HeroMetric[] = [
  { label: "YEARS EXPERIENCE", value: 8, suffix: "+" },
  { label: "PROJECTS COMPLETED", value: 150, suffix: "+" },
  { label: "TECHNOLOGIES MASTERED", value: 25, suffix: "+" },
  { label: "CLIENT SATISFACTION", value: 100, suffix: "%" },
];

const developerSpecialties = [
  "FULL-STACK DEVELOPER",
  "REACT SPECIALIST",
  "NODE.JS EXPERT",
  "TYPESCRIPT MASTER",
  "UI/UX ARCHITECT",
  "PERFORMANCE OPTIMIZER",
];

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Slightly faster stagger for better performance
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 }, // Reduced distance for smoother animation
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6, // Shorter duration for 60fps performance
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  return (
    <Section
      ref={sectionRef}
      padding="none"
      background="default"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* Three.js Background - Optimized for 60fps performance */}
      <div className="absolute inset-0 z-0">
        <ThreeBackground />
      </div>

      {/* Content Overlay */}
      <Container className="relative z-10">
        <motion.div
          className="space-y-12 text-center"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {/* Main Heading */}
          <ScrollReveal delay={0.1}>
            <motion.div variants={itemVariants} className="space-y-4">
              <Typography
                variant="display"
                className="text-white drop-shadow-lg"
                style={{ fontSize: "clamp(4rem, 12vw, 8rem)" }}
              >
                BRUTALIST
              </Typography>
              <Typography
                variant="h1"
                className="text-brutalist-yellow drop-shadow-lg"
                style={{ fontSize: "clamp(2rem, 8vw, 4rem)" }}
              >
                DEVELOPER
              </Typography>
            </motion.div>
          </ScrollReveal>

          {/* Typewriter Animation */}
          <ScrollReveal delay={0.3}>
            <motion.div
              variants={itemVariants}
              className="flex h-16 items-center justify-center"
            >
              <TypewriterText
                texts={developerSpecialties}
                className="font-mono text-2xl font-bold tracking-wide text-white uppercase md:text-3xl lg:text-4xl"
                speed={80} // Slightly faster for better performance
                deleteSpeed={40} // Slightly faster for better performance
                delayBetweenTexts={1800} // Slightly shorter delay for better user engagement
              />
            </motion.div>
          </ScrollReveal>

          {/* Description */}
          <ScrollReveal delay={0.5}>
            <motion.div variants={itemVariants}>
              <Typography
                variant="large"
                className="text-brutalist-off-white-100 mx-auto max-w-3xl leading-relaxed"
              >
                Elite Next.js 14 developer crafting{" "}
                <span className="text-brutalist-yellow font-bold">
                  high-performance web applications
                </span>{" "}
                with brutalist design aesthetics and cutting-edge full-stack
                functionality. Transforming complex problems into elegant
                digital solutions.
              </Typography>
            </motion.div>
          </ScrollReveal>

          {/* Metrics */}
          <ScrollReveal delay={0.7}>
            <motion.div variants={itemVariants}>
              <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4">
                {heroMetrics.map((metric, index) => (
                  <div
                    key={metric.label}
                    className="hover:bg-brutalist-yellow group border-4 border-white bg-black/50 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:text-black"
                  >
                    <div className="space-y-2">
                      <AnimatedCounter
                        end={metric.value}
                        duration={2000}
                        delay={index * 200}
                        prefix={metric.prefix}
                        suffix={metric.suffix}
                        className="text-brutalist-yellow font-mono text-3xl font-bold group-hover:text-black md:text-4xl"
                      />
                      <Typography
                        variant="caption"
                        className="font-mono text-white group-hover:text-black"
                      >
                        {metric.label}
                      </Typography>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </ScrollReveal>

          {/* Skills Visualization */}
          <ScrollReveal delay={0.9}>
            <motion.div variants={itemVariants}>
              <SkillVisualization />
            </motion.div>
          </ScrollReveal>

          {/* Call-to-Action Buttons */}
          <ScrollReveal delay={1.1}>
            <motion.div variants={itemVariants}>
              <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
                <motion.div
                  whileHover={{ scale: 1.03, y: -1 }} // Reduced scale for smoother 60fps animation
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }} // Optimized spring settings
                >
                  <Button
                    variant="accent"
                    size="xl"
                    className="shadow-brutalist-lg hover:shadow-brutalist-yellow-lg min-w-[200px] transform transition-all duration-150" // Faster transition for 60fps
                  >
                    VIEW PROJECTS
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.03, y: -1 }} // Reduced scale for smoother 60fps animation
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }} // Optimized spring settings
                >
                  <Button
                    variant="ghost"
                    size="xl"
                    className="shadow-brutalist-lg hover:shadow-brutalist-lg min-w-[200px] transform transition-all duration-150" // Faster transition for 60fps
                  >
                    GET IN TOUCH
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.03, y: -1 }} // Reduced scale for smoother 60fps animation
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }} // Optimized spring settings
                >
                  <Button
                    variant="secondary"
                    size="xl"
                    className="shadow-brutalist-lg hover:shadow-brutalist-lg min-w-[200px] transform transition-all duration-150" // Faster transition for 60fps
                  >
                    DOWNLOAD CV
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </ScrollReveal>

          {/* Scroll Indicator */}
          <ScrollReveal delay={1.3}>
            <motion.div
              variants={itemVariants}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 transform"
            >
              <motion.div
                animate={{ y: [0, 8, 0] }} // Reduced movement for smoother animation
                transition={{
                  duration: 1.8, // Slightly faster for better performance
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatType: "reverse", // More efficient animation
                }}
                className="flex flex-col items-center space-y-2 text-white"
              >
                <Typography variant="caption" className="font-mono">
                  SCROLL DOWN
                </Typography>
                <div className="flex h-10 w-6 justify-center rounded-full border-2 border-white">
                  <motion.div
                    animate={{ y: [0, 10, 0] }} // Reduced movement for smoother animation
                    transition={{
                      duration: 1.8, // Slightly faster for better performance
                      repeat: Infinity,
                      ease: "easeInOut",
                      repeatType: "reverse", // More efficient animation
                    }}
                    className="bg-brutalist-yellow mt-2 h-3 w-1 rounded-full"
                  />
                </div>
              </motion.div>
            </motion.div>
          </ScrollReveal>
        </motion.div>
      </Container>
    </Section>
  );
}
