"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TypewriterTextProps {
  texts: string[];
  speed?: number;
  deleteSpeed?: number;
  delayBetweenTexts?: number;
  pauseOnHover?: boolean;
  className?: string;
  showCursor?: boolean;
  cursorClassName?: string;
  onComplete?: () => void;
  onTextChange?: (text: string, index: number) => void;
  loop?: boolean;
  startDelay?: number;
}

export function TypewriterText({
  texts,
  speed = 80,
  deleteSpeed = 40,
  delayBetweenTexts = 2000,
  pauseOnHover = true,
  className = "",
  showCursor = true,
  cursorClassName = "",
  onComplete,
  onTextChange,
  loop = true,
  startDelay = 0,
}: TypewriterTextProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Enhanced typing with realistic timing variations
  const getTypingSpeed = useCallback(
    (char: string, isDeleting: boolean) => {
      const baseSpeed = isDeleting ? deleteSpeed : speed;

      // Add realistic variations based on character type
      if (char === " ") return baseSpeed * 0.5; // Faster for spaces
      if (char === "." || char === "," || char === "!") return baseSpeed * 1.5; // Slower for punctuation
      if (char === char.toUpperCase() && char !== char.toLowerCase())
        return baseSpeed * 1.1; // Slightly slower for capitals

      // Add small random variation for natural feel
      return baseSpeed + (Math.random() - 0.5) * 20;
    },
    [speed, deleteSpeed]
  );

  const typeText = useCallback(() => {
    if (isPaused || isWaiting || !hasStarted || isComplete) {
      return;
    }

    const fullText = texts[currentTextIndex];

    if (!isDeleting) {
      // Typing phase
      if (currentText.length < fullText.length) {
        const nextChar = fullText[currentText.length];
        const newText = fullText.substring(0, currentText.length + 1);
        setCurrentText(newText);

        if (onTextChange) {
          onTextChange(newText, currentTextIndex);
        }

        // Schedule next character with realistic timing
        const nextSpeed = getTypingSpeed(nextChar, false);
        timeoutRef.current = setTimeout(typeText, nextSpeed);
      } else {
        // Finished typing current text
        setIsWaiting(true);
        timeoutRef.current = setTimeout(() => {
          setIsWaiting(false);
          if (loop || currentTextIndex < texts.length - 1) {
            setIsDeleting(true);
          } else {
            setIsComplete(true);
            if (onComplete) {
              onComplete();
            }
          }
        }, delayBetweenTexts);
      }
    } else {
      // Deleting phase
      if (currentText.length > 0) {
        const newText = fullText.substring(0, currentText.length - 1);
        setCurrentText(newText);

        if (onTextChange) {
          onTextChange(newText, currentTextIndex);
        }

        // Schedule next deletion
        const nextSpeed = getTypingSpeed(
          currentText[currentText.length - 1],
          true
        );
        timeoutRef.current = setTimeout(typeText, nextSpeed);
      } else {
        // Finished deleting, move to next text
        setIsDeleting(false);
        const nextIndex = (currentTextIndex + 1) % texts.length;
        setCurrentTextIndex(nextIndex);

        // Check if we've completed a full cycle
        if (!loop && nextIndex === 0) {
          setIsComplete(true);
          if (onComplete) {
            onComplete();
          }
        } else {
          // Small pause before starting next text
          timeoutRef.current = setTimeout(typeText, 200);
        }
      }
    }
  }, [
    texts,
    currentTextIndex,
    currentText,
    isDeleting,
    isWaiting,
    isPaused,
    hasStarted,
    isComplete,
    delayBetweenTexts,
    onComplete,
    onTextChange,
    loop,
    getTypingSpeed,
  ]);

  // Start animation after initial delay
  useEffect(() => {
    if (startDelay > 0) {
      const startTimeout = setTimeout(() => {
        setHasStarted(true);
      }, startDelay);
      return () => clearTimeout(startTimeout);
    } else {
      setHasStarted(true);
    }
  }, [startDelay]);

  // Main animation loop
  useEffect(() => {
    if (hasStarted && !isComplete) {
      typeText();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [typeText, hasStarted, isComplete]);

  // Pause/resume functionality
  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) {
      setIsPaused(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) {
      setIsPaused(false);
    }
  }, [pauseOnHover]);

  // Enhanced cursor with accessibility support and visual improvements
  const CursorComponent = () => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    return (
      <motion.span
        className={cn(
          "bg-brutalist-yellow shadow-brutalist-sm ml-1 inline-block w-1",
          cursorClassName
        )}
        animate={
          prefersReducedMotion
            ? {}
            : {
                opacity: [1, 0],
                scaleY: [1, 0.8, 1],
              }
        }
        transition={
          prefersReducedMotion
            ? {}
            : {
                duration: 0.8,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }
        }
        style={{
          height: "1em",
          opacity: prefersReducedMotion ? 1 : undefined,
          borderRadius: "1px",
        }}
        aria-hidden="true"
      />
    );
  };

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="text"
      aria-live="polite"
      aria-label={`Cycling through: ${texts.join(", ")}`}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={`${currentTextIndex}-${currentText.length}`}
          className={cn("inline-block", className)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.2,
            ease: "easeOut",
          }}
        >
          {currentText}
        </motion.span>
      </AnimatePresence>

      {showCursor && <CursorComponent />}

      {/* Screen reader friendly text */}
      <span className="sr-only">
        Currently displaying: {texts[currentTextIndex]}
      </span>
    </div>
  );
}

interface TypewriterWordProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

export function TypewriterWord({
  text,
  delay = 0,
  speed = 100,
  className = "",
  onComplete,
}: TypewriterWordProps) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setHasStarted(true);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!hasStarted || currentIndex >= text.length) {
      if (currentIndex >= text.length && onComplete) {
        onComplete();
      }
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayText(text.substring(0, currentIndex + 1));
      setCurrentIndex(currentIndex + 1);
    }, speed);

    return () => clearTimeout(timeout);
  }, [hasStarted, currentIndex, text, speed, onComplete]);

  return (
    <motion.span
      className={cn("inline-block", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: hasStarted ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {displayText}
    </motion.span>
  );
}

interface StaggeredTypewriterProps {
  words: string[];
  delay?: number;
  wordDelay?: number;
  speed?: number;
  className?: string;
  wordClassName?: string;
  onComplete?: () => void;
}

export function StaggeredTypewriter({
  words,
  delay = 0,
  wordDelay = 200,
  speed = 100,
  className = "",
  wordClassName = "",
  onComplete,
}: StaggeredTypewriterProps) {
  const [, setCompletedWords] = useState(0);

  const handleWordComplete = useCallback(() => {
    setCompletedWords((prev) => {
      const newCount = prev + 1;
      if (newCount === words.length && onComplete) {
        onComplete();
      }
      return newCount;
    });
  }, [words.length, onComplete]);

  return (
    <div className={cn("inline-block", className)}>
      {words.map((word, index) => (
        <React.Fragment key={index}>
          <TypewriterWord
            text={word}
            delay={delay + index * wordDelay}
            speed={speed}
            className={cn("inline-block", wordClassName)}
            onComplete={
              index === words.length - 1 ? handleWordComplete : undefined
            }
          />
          {index < words.length - 1 && (
            <span className="inline-block">&nbsp;</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// Enhanced Typewriter specifically for cycling developer specialties
interface CyclingTypewriterProps {
  specialties: string[];
  className?: string;
  speed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
  showCursor?: boolean;
  cursorClassName?: string;
  startDelay?: number;
  onSpecialtyChange?: (specialty: string, index: number) => void;
}

export function CyclingTypewriter({
  specialties,
  className = "",
  speed = 75,
  deleteSpeed = 35,
  pauseDuration = 2200,
  showCursor = true,
  cursorClassName = "",
  startDelay = 0,
  onSpecialtyChange,
}: CyclingTypewriterProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Realistic typing speed with character-based variations
  const getRealisticSpeed = useCallback(
    (char: string, isDeleting: boolean) => {
      const baseSpeed = isDeleting ? deleteSpeed : speed;

      // Character-specific timing adjustments
      const adjustments: Record<string, number> = {
        " ": 0.3, // Faster for spaces
        ".": 1.8, // Slower for periods
        ",": 1.5, // Slower for commas
        "!": 1.8, // Slower for exclamation
        "?": 1.8, // Slower for questions
        "-": 1.2, // Slightly slower for hyphens
        "/": 1.3, // Slower for slashes
      };

      const multiplier = adjustments[char] || 1;

      // Add slight randomness for natural feel
      const randomVariation = 0.8 + Math.random() * 0.4; // 0.8 to 1.2

      return Math.round(baseSpeed * multiplier * randomVariation);
    },
    [speed, deleteSpeed]
  );

  const animate = useCallback(() => {
    if (isPaused || !hasStarted) return;

    const currentSpecialty = specialties[currentIndex];

    if (!isDeleting) {
      // Typing phase
      if (displayText.length < currentSpecialty.length) {
        const nextChar = currentSpecialty[displayText.length];
        const newText = currentSpecialty.substring(0, displayText.length + 1);
        setDisplayText(newText);

        const nextSpeed = getRealisticSpeed(nextChar, false);
        timeoutRef.current = setTimeout(animate, nextSpeed);
      } else {
        // Finished typing, pause before deleting
        timeoutRef.current = setTimeout(() => {
          setIsDeleting(true);
          animate();
        }, pauseDuration);
      }
    } else {
      // Deleting phase
      if (displayText.length > 0) {
        const newText = currentSpecialty.substring(0, displayText.length - 1);
        setDisplayText(newText);

        const currentChar = displayText[displayText.length - 1];
        const nextSpeed = getRealisticSpeed(currentChar, true);
        timeoutRef.current = setTimeout(animate, nextSpeed);
      } else {
        // Finished deleting, move to next specialty
        setIsDeleting(false);
        const nextIndex = (currentIndex + 1) % specialties.length;
        setCurrentIndex(nextIndex);

        if (onSpecialtyChange) {
          onSpecialtyChange(specialties[nextIndex], nextIndex);
        }

        // Brief pause before starting next specialty
        timeoutRef.current = setTimeout(animate, 150);
      }
    }
  }, [
    specialties,
    currentIndex,
    displayText,
    isDeleting,
    isPaused,
    hasStarted,
    pauseDuration,
    getRealisticSpeed,
    onSpecialtyChange,
  ]);

  // Initialize animation
  useEffect(() => {
    if (startDelay > 0) {
      const startTimeout = setTimeout(() => {
        setHasStarted(true);
      }, startDelay);
      return () => clearTimeout(startTimeout);
    } else {
      setHasStarted(true);
    }
  }, [startDelay]);

  // Start animation loop
  useEffect(() => {
    if (hasStarted) {
      animate();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [animate, hasStarted]);

  // Pause/resume on hover
  const handleMouseEnter = () => {
    setIsPaused(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  // Enhanced cursor component
  const EnhancedCursor = () => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    return (
      <motion.span
        className={cn(
          "bg-brutalist-yellow shadow-brutalist-sm ml-1 inline-block w-1",
          cursorClassName
        )}
        animate={
          prefersReducedMotion
            ? {}
            : {
                opacity: [1, 0.3, 1],
                scaleY: [1, 0.9, 1],
              }
        }
        transition={
          prefersReducedMotion
            ? {}
            : {
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
              }
        }
        style={{
          height: "1em",
          borderRadius: "1px",
          opacity: prefersReducedMotion ? 1 : undefined,
        }}
        aria-hidden="true"
      />
    );
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="text"
      aria-live="polite"
      aria-label={`Developer specialty: ${specialties[currentIndex]}`}
    >
      <motion.span
        key={`${currentIndex}-${displayText.length}`}
        className={cn("inline-block", className)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {displayText}
      </motion.span>

      {showCursor && <EnhancedCursor />}

      {/* Screen reader support */}
      <span className="sr-only">{specialties[currentIndex]}</span>
    </div>
  );
}
