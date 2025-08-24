"use client";

import React, { useState, useEffect, useRef } from "react";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

interface TypewriterTextProps {
  text: string;
  speed?: number;
  delay?: number;
  showCursor?: boolean;
  onComplete?: () => void;
  className?: string;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speed = 50,
  delay = 0,
  showCursor = true,
  onComplete,
  className = "",
}) => {
  const { currentTheme, config } = useThemeContext();
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showCursorBlink, setShowCursorBlink] = useState(true);
  const typewriterRef = useRef<HTMLSpanElement>(null);
  const isVisible = useIntersectionObserver(typewriterRef, {
    threshold: 0.3,
    rootMargin: "0px",
    triggerOnce: true,
  });

  // Reset animation when text changes
  useEffect(() => {
    setDisplayText("");
    setCurrentIndex(0);
    setIsComplete(false);
    setShowCursorBlink(true);
  }, [text]);

  // Typewriter animation effect
  useEffect(() => {
    if (!isVisible || isComplete) return;

    const startTyping = () => {
      if (currentIndex < text.length) {
        const timer = setTimeout(
          () => {
            setDisplayText((prev) => prev + text[currentIndex]);
            setCurrentIndex((prev) => prev + 1);
          },
          speed + Math.random() * 20
        ); // Add slight randomness for realism

        return timer;
      } else {
        setIsComplete(true);
        onComplete?.();
        return null;
      }
    };

    const timer =
      delay > 0 && currentIndex === 0
        ? setTimeout(startTyping, delay)
        : startTyping();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isVisible, currentIndex, text, speed, delay, isComplete, onComplete]);

  // Cursor blinking effect
  useEffect(() => {
    if (!showCursor) return;

    const blinkInterval = setInterval(() => {
      setShowCursorBlink((prev) => !prev);
    }, 530);

    return () => clearInterval(blinkInterval);
  }, [showCursor]);

  return (
    <span
      ref={typewriterRef}
      className={`typewriter-text typewriter-text--${currentTheme} ${className}`}
      style={
        {
          "--typewriter-color": config.colors.text,
          "--typewriter-accent": config.colors.accent,
          "--typewriter-font": config.typography.primary,
          "--typewriter-animation-duration": config.animations.duration,
          "--typewriter-animation-easing": config.animations.easing,
        } as React.CSSProperties
      }
    >
      {displayText}
      {showCursor && (
        <span
          className={`typewriter-cursor typewriter-cursor--${currentTheme} ${
            showCursorBlink
              ? "typewriter-cursor--visible"
              : "typewriter-cursor--hidden"
          }`}
          aria-hidden="true"
        >
          |
        </span>
      )}
    </span>
  );
};

export default TypewriterText;
