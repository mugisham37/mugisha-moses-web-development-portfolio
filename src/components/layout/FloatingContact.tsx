"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { BrutalButton } from "@/components/ui";
import { motion, AnimatePresence } from "framer-motion";

interface FloatingContactProps {
  className?: string;
}

export const FloatingContact: React.FC<FloatingContactProps> = ({
  className = "",
}) => {
  const { currentTheme, config } = useTheme();
  const { scrollProgress } = useScrollProgress();
  const [isVisible, setIsVisible] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [lastShowTime, setLastShowTime] = useState(0);

  // Show floating contact based on scroll behavior and timing
  useEffect(() => {
    const now = Date.now();
    const timeSinceLastShow = now - lastShowTime;
    const minInterval = 30000; // 30 seconds minimum between shows

    // Show conditions:
    // 1. User has scrolled past 25% but not at the very end
    // 2. Hasn't been shown recently
    // 3. User hasn't interacted with it yet (or it's been a while)
    const shouldShow =
      scrollProgress > 0.25 &&
      scrollProgress < 0.9 &&
      timeSinceLastShow > minInterval &&
      (!hasInteracted || timeSinceLastShow > 120000); // 2 minutes after interaction

    if (shouldShow && !isVisible) {
      setIsVisible(true);
      setLastShowTime(now);

      // Auto-hide after 10 seconds if no interaction
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 10000);

      return () => clearTimeout(hideTimer);
    }
  }, [scrollProgress, lastShowTime, hasInteracted, isVisible]);

  const handleContactClick = () => {
    setHasInteracted(true);
    setIsVisible(false);
    // Navigate to contact page
    window.location.href = "http://localhost:3000/contact";
  };

  const handleDismiss = () => {
    setHasInteracted(true);
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`floating-contact floating-contact--${currentTheme} ${className}`}
          style={
            {
              position: "fixed",
              bottom: "2rem",
              right: "2rem",
              zIndex: 1000,
              maxWidth: "320px",
              "--contact-bg": config.colors.secondary,
              "--contact-text": config.colors.primary,
              "--contact-accent": config.colors.accent,
              "--contact-border": `${config.borders.width} ${config.borders.style} ${config.colors.primary}`,
              "--contact-shadow":
                config.shadows.brutal || config.shadows.subtle,
              "--contact-radius": config.borders.radius || "0px",
            } as React.CSSProperties
          }
        >
          <div className="floating-contact__container">
            <button
              className="floating-contact__dismiss"
              onClick={handleDismiss}
              aria-label="Dismiss contact reminder"
            >
              ×
            </button>

            <div className="floating-contact__content">
              <div className="floating-contact__icon">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  💬
                </motion.div>
              </div>

              <div className="floating-contact__text">
                <h4 className="floating-contact__title">
                  {currentTheme === "extreme-brutalist"
                    ? "READY TO BUILD SOMETHING BRUTAL?"
                    : "Ready to discuss your project?"}
                </h4>
                <p className="floating-contact__description">
                  {currentTheme === "extreme-brutalist"
                    ? "Let's create something that breaks the internet."
                    : "Let's explore how we can work together."}
                </p>
              </div>

              <div className="floating-contact__actions">
                <BrutalButton
                  variant="primary"
                  size="sm"
                  onClick={handleContactClick}
                  className="floating-contact__cta"
                >
                  {currentTheme === "extreme-brutalist"
                    ? "GET STARTED"
                    : "Contact Me"}
                </BrutalButton>
              </div>
            </div>

            {/* Animated border effect */}
            <div className="floating-contact__border-animation"></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingContact;
