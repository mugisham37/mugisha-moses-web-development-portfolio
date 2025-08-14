"use client";

import React, { useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Typography } from "@/components/ui/typography";
// import { Button } from "@/components/ui/button"; // Replaced with CTAButton
import { CTAButton } from "@/components/ui/cta-button";
import { ThreeBackground } from "@/components/three/three-background";
import { CyclingTypewriter } from "@/components/animations/typewriter-text";
import { MetricsShowcase } from "@/components/animations/animated-counter";
import { ASCIIPortrait } from "@/components/animations/ascii-portrait";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { ScrollIndicator } from "@/components/ui/scroll-indicator";

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
  "CLOUD ENGINEER",
  "API ARCHITECT",
  "DATABASE DESIGNER",
  "DEVOPS ENTHUSIAST",
  "MOBILE DEVELOPER",
  "SECURITY ADVOCATE",
];

// Helper function to provide contextual descriptions for metrics
const getMetricDescription = (label: string): string => {
  const descriptions: Record<string, string> = {
    "YEARS EXPERIENCE": "Building scalable web applications",
    "PROJECTS COMPLETED": "Successful client deliveries",
    "TECHNOLOGIES MASTERED": "Modern development stack",
    "CLIENT SATISFACTION": "Positive feedback rate",
  };
  return descriptions[label] || "";
};

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
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
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
      {/* Three.js Background - Enhanced with particle effects */}
      <div className="absolute inset-0 z-0">
        <ThreeBackground />
      </div>

      {/* Content Overlay - Split Layout */}
      <Container size="xl" className="relative z-10">
        <motion.div
          className="grid min-h-screen grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {/* Left Side - Text Content */}
          <div className="space-y-8 lg:space-y-12">
            {/* Main Heading */}
            <ScrollReveal delay={0.1}>
              <motion.div variants={itemVariants} className="space-y-4">
                <Typography
                  variant="display"
                  className="text-white drop-shadow-lg"
                  style={{ fontSize: "clamp(3rem, 8vw, 6rem)" }}
                >
                  BRUTALIST
                </Typography>
                <Typography
                  variant="h1"
                  className="text-brutalist-yellow drop-shadow-lg"
                  style={{ fontSize: "clamp(1.5rem, 6vw, 3rem)" }}
                >
                  DEVELOPER
                </Typography>
              </motion.div>
            </ScrollReveal>

            {/* Enhanced Typewriter Animation */}
            <ScrollReveal delay={0.3}>
              <motion.div
                variants={itemVariants}
                className="flex h-12 items-center lg:h-16"
              >
                <CyclingTypewriter
                  specialties={developerSpecialties}
                  className="font-mono text-lg font-bold tracking-wide text-white uppercase md:text-xl lg:text-2xl xl:text-3xl"
                  speed={75}
                  deleteSpeed={35}
                  pauseDuration={2200}
                  startDelay={800}
                  showCursor={true}
                  cursorClassName="bg-brutalist-yellow shadow-brutalist-sm"
                  onSpecialtyChange={(specialty, index) => {
                    // Optional: Add analytics or other side effects
                    if (typeof window !== "undefined" && "gtag" in window) {
                      (window as { gtag: (...args: unknown[]) => void }).gtag(
                        "event",
                        "specialty_change",
                        {
                          specialty: specialty,
                        }
                      );
                    }
                  }}
                />
              </motion.div>
            </ScrollReveal>

            {/* Description */}
            <ScrollReveal delay={0.5}>
              <motion.div variants={itemVariants}>
                <Typography
                  variant="large"
                  className="text-brutalist-off-white-100 max-w-2xl leading-relaxed"
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

            {/* Enhanced Metrics with Staggered Animations */}
            <ScrollReveal delay={0.7}>
              <motion.div variants={itemVariants}>
                <MetricsShowcase
                  metrics={heroMetrics.map((metric, index) => ({
                    label: metric.label,
                    value: metric.value,
                    prefix: metric.prefix,
                    suffix: metric.suffix,
                    ariaLabel: `${metric.prefix || ""}${metric.value}${metric.suffix || ""} ${metric.label}`,
                    description: getMetricDescription(metric.label),
                  }))}
                  columns={2}
                  staggerDelay={150}
                  duration={2500}
                  easingFunction="easeOut"
                  showProgress={true}
                  onAllComplete={() => {
                    // Optional: trigger next animation or analytics event
                    if (typeof window !== "undefined" && "gtag" in window) {
                      (window as { gtag: (...args: unknown[]) => void }).gtag(
                        "event",
                        "hero_metrics_complete",
                        {
                          event_category: "engagement",
                          event_label: "hero_section",
                        }
                      );
                    }
                  }}
                />
              </motion.div>
            </ScrollReveal>

            {/* Advanced Call-to-Action Buttons */}
            <ScrollReveal delay={0.9}>
              <motion.div variants={itemVariants}>
                <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                  {/* Primary CTA - VIEW PROJECTS */}
                  <motion.div
                    initial={{ opacity: 0, x: -30, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{
                      delay: 1.2,
                      duration: 0.6,
                      ease: [0.25, 0.46, 0.45, 0.94],
                      type: "spring",
                      stiffness: 200,
                      damping: 20,
                    }}
                    whileHover={{
                      scale: 1.05,
                      y: -4,
                      rotateX: 5,
                      transition: {
                        duration: 0.3,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      },
                    }}
                    whileTap={{
                      scale: 0.95,
                      y: 0,
                      rotateX: 0,
                      transition: {
                        duration: 0.15,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      },
                    }}
                    whileFocus={{
                      scale: 1.02,
                      y: -2,
                      transition: {
                        duration: 0.2,
                        ease: "easeOut",
                      },
                    }}
                    className="group relative"
                  >
                    <motion.div
                      className="from-brutalist-yellow to-brutalist-yellow absolute inset-0 rounded-none bg-gradient-to-r via-yellow-300 opacity-0 blur-lg"
                      whileHover={{
                        opacity: 0.4,
                        scale: 1.1,
                        transition: { duration: 0.3 },
                      }}
                    />
                    <CTAButton
                      variant="accent"
                      size="lg"
                      className="w-full font-black tracking-widest shadow-[8px_8px_0px_rgba(0,0,0,1)] sm:w-auto sm:min-w-[200px]"
                      glowEffect={true}
                      sparkleEffect={true}
                      soundDesignFeedback={true}
                      hapticIntensity="strong"
                      onHoverStart={() => {
                        // Analytics for hover engagement
                        if (typeof window !== "undefined" && "gtag" in window) {
                          (
                            window as { gtag: (...args: unknown[]) => void }
                          ).gtag("event", "cta_hover", {
                            event_category: "engagement",
                            event_label: "view_projects_hover",
                          });
                        }
                      }}
                      onClick={() => {
                        // Analytics tracking
                        if (typeof window !== "undefined" && "gtag" in window) {
                          (
                            window as { gtag: (...args: unknown[]) => void }
                          ).gtag("event", "cta_click", {
                            event_category: "engagement",
                            event_label: "view_projects",
                            value: 1,
                          });
                        }

                        // Navigate to projects (placeholder for actual navigation)
                        console.log("Navigating to projects...");
                      }}
                      onClickComplete={() => {
                        console.log("CTA click animation completed");
                      }}
                    >
                      VIEW PROJECTS
                    </CTAButton>
                  </motion.div>

                  {/* Secondary CTA - GET IN TOUCH */}
                  <motion.div
                    initial={{ opacity: 0, x: 30, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{
                      delay: 1.4,
                      duration: 0.6,
                      ease: [0.25, 0.46, 0.45, 0.94],
                      type: "spring",
                      stiffness: 200,
                      damping: 20,
                    }}
                    whileHover={{
                      scale: 1.05,
                      y: -4,
                      rotateX: -5,
                      transition: {
                        duration: 0.3,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      },
                    }}
                    whileTap={{
                      scale: 0.95,
                      y: 0,
                      rotateX: 0,
                      transition: {
                        duration: 0.15,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      },
                    }}
                    whileFocus={{
                      scale: 1.02,
                      y: -2,
                      transition: {
                        duration: 0.2,
                        ease: "easeOut",
                      },
                    }}
                    className="group relative"
                  >
                    <motion.div
                      className="absolute inset-0 rounded-none bg-gradient-to-r from-white via-gray-200 to-white opacity-0 blur-lg"
                      whileHover={{
                        opacity: 0.3,
                        scale: 1.1,
                        transition: { duration: 0.3 },
                      }}
                    />
                    <CTAButton
                      variant="ghost"
                      size="lg"
                      className="w-full font-black tracking-widest shadow-[8px_8px_0px_rgba(255,255,255,0.3)] sm:w-auto sm:min-w-[200px]"
                      glowEffect={true}
                      sparkleEffect={true}
                      soundDesignFeedback={true}
                      hapticIntensity="medium"
                      onHoverStart={() => {
                        // Analytics for hover engagement
                        if (typeof window !== "undefined" && "gtag" in window) {
                          (
                            window as { gtag: (...args: unknown[]) => void }
                          ).gtag("event", "cta_hover", {
                            event_category: "engagement",
                            event_label: "get_in_touch_hover",
                          });
                        }
                      }}
                      onClick={() => {
                        // Analytics tracking
                        if (typeof window !== "undefined" && "gtag" in window) {
                          (
                            window as { gtag: (...args: unknown[]) => void }
                          ).gtag("event", "cta_click", {
                            event_category: "engagement",
                            event_label: "get_in_touch",
                            value: 1,
                          });
                        }

                        // Navigate to contact (placeholder for actual navigation)
                        console.log("Navigating to contact...");
                      }}
                      onClickComplete={() => {
                        console.log("Contact CTA click animation completed");
                      }}
                    >
                      GET IN TOUCH
                    </CTAButton>
                  </motion.div>
                </div>

                {/* Sound Design Consideration - Visual Feedback for Haptic Simulation */}
                <motion.div
                  className="mt-4 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.6, duration: 0.4 }}
                >
                  <motion.p
                    className="text-brutalist-off-white-100 font-mono text-xs tracking-wider uppercase"
                    animate={{
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    }}
                  >
                    ◆ INTERACTIVE EXPERIENCE ◆
                  </motion.p>
                </motion.div>
              </motion.div>
            </ScrollReveal>
          </div>

          {/* Right Side - ASCII Art Portrait */}
          <div className="flex items-center justify-center lg:justify-end">
            <ScrollReveal delay={1.1}>
              <motion.div variants={itemVariants} className="relative">
                <ASCIIPortrait
                  imageUrl="/images/portrait-placeholder.svg"
                  width={55}
                  height={42}
                  fontSize={11}
                  className="w-full max-w-md lg:max-w-lg xl:max-w-xl"
                  autoStart={true}
                  loop={true}
                  responsive={true}
                  accessibilityLabel="ASCII art portrait of Moses Mugisha, a brutalist developer"
                  performanceMode="balanced"
                  onComplete={() => {
                    // Optional: trigger other animations when ASCII art completes
                    console.log("ASCII art animation completed");
                  }}
                />

                {/* Decorative brutalist elements around ASCII art */}
                <div className="bg-brutalist-yellow absolute -top-4 -left-4 h-8 w-8 border-2 border-white"></div>
                <div className="border-brutalist-yellow absolute -top-4 -right-4 h-8 w-8 border-2 bg-white"></div>
                <div className="border-brutalist-yellow absolute -bottom-4 -left-4 h-8 w-8 border-2 bg-white"></div>
                <div className="bg-brutalist-yellow absolute -right-4 -bottom-4 h-8 w-8 border-2 border-white"></div>
              </motion.div>
            </ScrollReveal>
          </div>
        </motion.div>

        {/* Enhanced Scroll Indicator */}
        <ScrollIndicator
          text="SCROLL DOWN"
          variant="animated"
          position="center"
          hideAfterScroll={true}
          className="z-20"
        />
      </Container>
    </Section>
  );
}
