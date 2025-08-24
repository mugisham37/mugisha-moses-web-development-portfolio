"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { TypewriterTextProps } from "./types";

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speed = 50,
  delay = 0,
  startDelay = 0,
  showCursor = true,
  cursorChar = "|",
  randomizeSpeed = true,
  preserveWhitespace = true,
  onComplete,
  className = "",
  theme,
}) => {
  const { currentTheme, config } = useThemeContext();
  const activeTheme = theme || currentTheme;

  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showCursorBlink, setShowCursorBlink] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  const typewriterRef = useRef<HTMLSpanElement>(null);
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const cursorRef = useRef<NodeJS.Timeout | null>(null);

  const isVisible = useIntersectionObserver(typewriterRef, {
    threshold: 0.3,
    rootMargin: "0px",
    triggerOnce: true,
  });

  // Clean up timers
  const cleanup = useCallback(() => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
    if (cursorRef.current) {
      clearInterval(cursorRef.current);
      cursorRef.current = null;
    }
  }, []);

  // Reset animation when text changes
  useEffect(() => {
    cleanup();
    setDisplayText("");
    setCurrentIndex(0);
    setIsComplete(false);
    setShowCursorBlink(true);
    setHasStarted(false);
  }, [text, cleanup]);

  // Calculate typing speed with optional randomization
  const getTypingSpeed = useCallback(() => {
    if (!randomizeSpeed) return speed;
    return speed + Math.random() * (speed * 0.4) - speed * 0.2;
  }, [speed, randomizeSpeed]);

  // Handle character typing
  const typeNextCharacter = useCallback(() => {
    if (currentIndex >= text.length) {
      setIsComplete(true);
      onComplete?.();
      return;
    }

    const char = text[currentIndex];

    // Handle special characters with different speeds
    let charSpeed = getTypingSpeed();
    if (char === " " && !preserveWhitespace) {
      charSpeed *= 0.5; // Faster for spaces
    } else if (char === "." || char === "!" || char === "?") {
      charSpeed *= 2; // Slower for punctuation
    } else if (char === "\n") {
      charSpeed *= 1.5; // Slower for line breaks
    }

    setDisplayText((prev) => prev + char);
    setCurrentIndex((prev) => prev + 1);

    animationRef.current = setTimeout(typeNextCharacter, charSpeed);
  }, [currentIndex, text, getTypingSpeed, preserveWhitespace, onComplete]);

  // Start typing animation
  useEffect(() => {
    if (!isVisible || hasStarted || isComplete) return;

    const startTyping = () => {
      setHasStarted(true);
      animationRef.current = setTimeout(typeNextCharacter, delay);
    };

    if (startDelay > 0) {
      animationRef.current = setTimeout(startTyping, startDelay);
    } else {
      startTyping();
    }

    return cleanup;
  }, [
    isVisible,
    hasStarted,
    isComplete,
    startDelay,
    delay,
    typeNextCharacter,
    cleanup,
  ]);

  // Cursor blinking effect
  useEffect(() => {
    if (!showCursor) return;

    cursorRef.current = setInterval(() => {
      setShowCursorBlink((prev) => !prev);
    }, 530);

    return () => {
      if (cursorRef.current) {
        clearInterval(cursorRef.current);
      }
    };
  }, [showCursor]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return (
    <span
      ref={typewriterRef}
      className={`typewriter-text typewriter-text--${activeTheme} ${className}`}
      style={
        {
          "--typewriter-color": config.colors.text,
          "--typewriter-accent": config.colors.accent,
          "--typewriter-font": config.typography.primary,
          "--typewriter-animation-duration": config.animations.duration,
          "--typewriter-animation-easing": config.animations.easing,
        } as React.CSSProperties & Record<string, string>
      }
    >
      <span className="typewriter-text__content">{displayText}</span>
      {showCursor && (
        <span
          className={`typewriter-cursor typewriter-cursor--${activeTheme} ${
            showCursorBlink
              ? "typewriter-cursor--visible"
              : "typewriter-cursor--hidden"
          }`}
          aria-hidden="true"
        >
          {cursorChar}
        </span>
      )}
    </span>
  );
};

export default TypewriterText;
