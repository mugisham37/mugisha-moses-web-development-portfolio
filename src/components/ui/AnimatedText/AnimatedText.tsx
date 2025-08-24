"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { AnimatedTextProps, AnimationType, AnimationConfig } from "./types";

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  children,
  animation = "fadeIn",
  delay = 0,
  duration = 600,
  stagger = false,
  staggerDelay = 100,
  easing = "cubic-bezier(0.4, 0, 0.2, 1)",
  onComplete,
  className = "",
  theme,
}) => {
  const { currentTheme, config } = useThemeContext();
  const activeTheme = theme || currentTheme;

  const [isAnimating, setIsAnimating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [staggerIndex, setStaggerIndex] = useState(0);

  const animatedRef = useRef<HTMLSpanElement>(null);
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const staggerRef = useRef<NodeJS.Timeout | null>(null);

  const isVisible = useIntersectionObserver(animatedRef, {
    threshold: 0.1,
    rootMargin: "50px",
    triggerOnce: true,
  });

  // Animation configurations
  const animationConfigs: Record<AnimationType, AnimationConfig> = {
    fadeIn: {
      duration,
      delay,
      easing,
      transform: "none",
      opacity: 0,
    },
    slideUp: {
      duration,
      delay,
      easing,
      transform: "translateY(30px)",
      opacity: 0,
    },
    slideDown: {
      duration,
      delay,
      easing,
      transform: "translateY(-30px)",
      opacity: 0,
    },
    slideLeft: {
      duration,
      delay,
      easing,
      transform: "translateX(30px)",
      opacity: 0,
    },
    slideRight: {
      duration,
      delay,
      easing,
      transform: "translateX(-30px)",
      opacity: 0,
    },
    scaleIn: {
      duration,
      delay,
      easing,
      transform: "scale(0.8)",
      opacity: 0,
    },
    rotateIn: {
      duration,
      delay,
      easing,
      transform: "rotate(-10deg) scale(0.8)",
      opacity: 0,
    },
    bounceIn: {
      duration,
      delay,
      easing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      transform: "scale(0.3)",
      opacity: 0,
    },
    flipIn: {
      duration,
      delay,
      easing,
      transform: "perspective(400px) rotateY(90deg)",
      opacity: 0,
    },
  };

  const currentConfig = animationConfigs[animation];

  // Clean up timers
  const cleanup = useCallback(() => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
    if (staggerRef.current) {
      clearTimeout(staggerRef.current);
      staggerRef.current = null;
    }
  }, []);

  // Split text into words/characters for stagger effect
  const getStaggerElements = useCallback(() => {
    if (!stagger || typeof children !== "string") {
      return [children];
    }

    // Split by words for better readability
    return children.split(" ").map((word, index) => (
      <span key={index} className="animated-text__word">
        {word}
        {index < children.split(" ").length - 1 ? " " : ""}
      </span>
    ));
  }, [children, stagger]);

  const staggerElements = getStaggerElements();

  // Start animation
  const startAnimation = useCallback(() => {
    if (isAnimating || isComplete) return;

    setIsAnimating(true);

    if (stagger && staggerElements.length > 1) {
      // Animate elements with stagger
      let currentIndex = 0;

      const animateNext = () => {
        if (currentIndex >= staggerElements.length) {
          setIsComplete(true);
          setIsAnimating(false);
          onComplete?.();
          return;
        }

        setStaggerIndex(currentIndex);
        currentIndex++;

        staggerRef.current = setTimeout(animateNext, staggerDelay);
      };

      animationRef.current = setTimeout(animateNext, delay);
    } else {
      // Single animation
      animationRef.current = setTimeout(() => {
        setIsComplete(true);
        setIsAnimating(false);
        onComplete?.();
      }, delay + duration);
    }
  }, [
    isAnimating,
    isComplete,
    stagger,
    staggerElements.length,
    delay,
    duration,
    staggerDelay,
    onComplete,
  ]);

  // Trigger animation when visible
  useEffect(() => {
    if (isVisible && !isAnimating && !isComplete) {
      startAnimation();
    }

    return cleanup;
  }, [isVisible, isAnimating, isComplete, startAnimation, cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Get animation styles for element
  const getElementStyles = (index: number) => {
    const baseStyles = {
      "--animation-duration": `${currentConfig.duration}ms`,
      "--animation-delay": `${currentConfig.delay}ms`,
      "--animation-easing": currentConfig.easing,
      "--text-color": config.colors.text,
      "--text-accent": config.colors.accent,
      "--text-font": config.typography.primary,
    } as React.CSSProperties & Record<string, string>;

    if (!stagger || staggerElements.length === 1) {
      return {
        ...baseStyles,
        opacity: isComplete ? 1 : currentConfig.opacity,
        transform: isComplete ? "none" : currentConfig.transform,
        transition: `all ${currentConfig.duration}ms ${currentConfig.easing} ${currentConfig.delay}ms`,
      };
    }

    // Stagger animation styles
    const isElementAnimated = index <= staggerIndex;
    const elementDelay = currentConfig.delay + index * staggerDelay;

    return {
      ...baseStyles,
      opacity: isElementAnimated ? 1 : currentConfig.opacity,
      transform: isElementAnimated ? "none" : currentConfig.transform,
      transition: `all ${currentConfig.duration}ms ${currentConfig.easing} ${elementDelay}ms`,
    };
  };

  return (
    <span
      ref={animatedRef}
      className={`animated-text animated-text--${activeTheme} animated-text--${animation} ${
        isAnimating ? "animated-text--animating" : ""
      } ${isComplete ? "animated-text--complete" : ""} ${className}`}
      style={getElementStyles(0)}
    >
      {stagger && staggerElements.length > 1 ? (
        staggerElements.map((element, index) => (
          <span
            key={index}
            className={`animated-text__element animated-text__element--${index <= staggerIndex ? "animated" : "pending"}`}
            style={getElementStyles(index)}
          >
            {element}
          </span>
        ))
      ) : (
        <span className="animated-text__content">{children}</span>
      )}
    </span>
  );
};

export default AnimatedText;
