"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAnimationContext } from "./animation-provider";

interface ScrollNavigationProps {
  sections: Array<{
    id: string;
    label: string;
    color?: string;
  }>;
  className?: string;
  position?: "left" | "right";
  showLabels?: boolean;
}

export function ScrollNavigation({
  sections,
  className,
  position = "right",
  showLabels = true,
}: ScrollNavigationProps) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id || "");
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const { reducedMotion } = useAnimationContext();

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -80% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [sections]);

  const handleSectionClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start",
      });
    }
  };

  if (reducedMotion) {
    return null; // Hide scroll navigation for reduced motion users
  }

  return (
    <motion.nav
      className={cn(
        "fixed top-1/2 z-40 -translate-y-1/2",
        position === "left" ? "left-8" : "right-8",
        className
      )}
      style={{ opacity }}
      initial={{ opacity: 0, x: position === "left" ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 1 }}
    >
      <ul className="space-y-4">
        {sections.map(({ id, label, color = "#ffff00" }) => {
          const isActive = activeSection === id;
          const isHovered = hoveredSection === id;

          return (
            <li key={id} className="relative">
              <motion.button
                className="group flex items-center"
                onClick={() => handleSectionClick(id)}
                onMouseEnter={() => setHoveredSection(id)}
                onMouseLeave={() => setHoveredSection(null)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Dot indicator */}
                <motion.div
                  className="relative h-3 w-3 rounded-full border-2 border-white"
                  animate={{
                    backgroundColor: isActive ? color : "transparent",
                    scale: isActive ? 1.2 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Pulse effect for active section */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ backgroundColor: color }}
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.8, 0, 0.8],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}
                </motion.div>

                {/* Label */}
                {showLabels && (
                  <motion.span
                    className={cn(
                      "ml-4 font-mono text-sm font-bold tracking-wider text-white uppercase",
                      position === "left" ? "order-first mr-4 ml-0" : ""
                    )}
                    initial={{ opacity: 0, x: position === "left" ? 10 : -10 }}
                    animate={{
                      opacity: isHovered || isActive ? 1 : 0,
                      x: 0,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {label}
                  </motion.span>
                )}

                {/* Connection line */}
                <motion.div
                  className={cn(
                    "absolute top-1/2 h-px bg-white/30",
                    position === "left"
                      ? "right-full mr-2 w-8"
                      : "left-full ml-2 w-8"
                  )}
                  animate={{
                    scaleX: isHovered || isActive ? 1 : 0,
                    backgroundColor: isActive ? color : "rgba(255,255,255,0.3)",
                  }}
                  transition={{ duration: 0.3 }}
                  style={{
                    transformOrigin: position === "left" ? "right" : "left",
                  }}
                />
              </motion.button>
            </li>
          );
        })}
      </ul>
    </motion.nav>
  );
}

// Enhanced scroll progress indicator with section markers
interface ScrollProgressWithSectionsProps {
  sections: Array<{
    id: string;
    label: string;
    color?: string;
  }>;
  className?: string;
  height?: number;
  showSectionMarkers?: boolean;
}

export function ScrollProgressWithSections({
  sections,
  className,
  height = 4,
  showSectionMarkers = true,
}: ScrollProgressWithSectionsProps) {
  const { scrollYProgress } = useScroll();
  const [sectionProgress, setSectionProgress] = useState<
    Record<string, number>
  >({});
  const { reducedMotion } = useAnimationContext();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const updateSectionProgress = () => {
      const progress: Record<string, number> = {};

      sections.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;
          const elementHeight = rect.height;
          const scrollTop = window.scrollY;
          const windowHeight = window.innerHeight;

          // Calculate how much of the section has been scrolled through
          const sectionStart = elementTop - windowHeight;
          const sectionEnd = elementTop + elementHeight;
          const sectionScrolled = Math.max(0, scrollTop - sectionStart);
          const sectionTotal = sectionEnd - sectionStart;
          const sectionPercent = Math.min(
            1,
            Math.max(0, sectionScrolled / sectionTotal)
          );

          progress[id] = sectionPercent;
        }
      });

      setSectionProgress(progress);
    };

    const handleScroll = () => {
      if (!reducedMotion) {
        requestAnimationFrame(updateSectionProgress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateSectionProgress(); // Initial calculation

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections, reducedMotion]);

  if (reducedMotion) {
    return null;
  }

  return (
    <div className={cn("fixed top-0 right-0 left-0 z-50", className)}>
      {/* Main progress bar */}
      <motion.div
        className="bg-brutalist-yellow h-1 origin-left"
        style={{ scaleX, height: `${height}px` }}
      />

      {/* Section markers */}
      {showSectionMarkers && (
        <div className="absolute inset-x-0 top-0 flex">
          {sections.map(({ id, color = "#ffff00" }, index) => {
            const progress = sectionProgress[id] || 0;
            const sectionWidth = 100 / sections.length;

            return (
              <motion.div
                key={id}
                className="relative"
                style={{
                  width: `${sectionWidth}%`,
                  height: `${height}px`,
                }}
              >
                <motion.div
                  className="h-full origin-left"
                  style={{
                    backgroundColor: color,
                    scaleX: progress,
                  }}
                  transition={{ duration: 0.1 }}
                />

                {/* Section divider */}
                {index < sections.length - 1 && (
                  <div
                    className="absolute top-0 right-0 w-px bg-white/20"
                    style={{ height: `${height}px` }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Floating scroll indicator with direction
export function FloatingScrollIndicator() {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");
  const [isVisible, setIsVisible] = useState(false);
  const lastScrollY = useRef(0);
  const { reducedMotion } = useAnimationContext();

  const { scrollYProgress } = useScroll();
  const progress = useTransform(scrollYProgress, [0, 1], [0, 100]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show indicator after scrolling a bit
      setIsVisible(currentScrollY > 100);

      // Determine scroll direction
      if (currentScrollY > lastScrollY.current) {
        setScrollDirection("down");
      } else if (currentScrollY < lastScrollY.current) {
        setScrollDirection("up");
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (reducedMotion || !isVisible) {
    return null;
  }

  return (
    <motion.div
      className="fixed bottom-8 left-8 z-40"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        {/* Circular progress */}
        <svg className="h-16 w-16 -rotate-90" viewBox="0 0 64 64">
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="2"
          />
          <motion.circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="#ffff00"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 28}`}
            strokeDashoffset={useTransform(
              progress,
              [0, 100],
              [2 * Math.PI * 28, 0]
            )}
          />
        </svg>

        {/* Direction arrow */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotate: scrollDirection === "up" ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg
            className="text-brutalist-yellow h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
}
