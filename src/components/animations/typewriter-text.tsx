"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TypewriterTextProps {
  texts: string[];
  speed?: number;
  deleteSpeed?: number;
  delayBetweenTexts?: number;
  className?: string;
  showCursor?: boolean;
  cursorClassName?: string;
  onComplete?: () => void;
}

export function TypewriterText({
  texts,
  speed = 100,
  deleteSpeed = 50,
  delayBetweenTexts = 2000,
  className = "",
  showCursor = true,
  cursorClassName = "",
  onComplete,
}: TypewriterTextProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  const typeText = useCallback(() => {
    const fullText = texts[currentTextIndex];

    if (isWaiting) {
      return;
    }

    if (!isDeleting) {
      // Typing
      if (currentText.length < fullText.length) {
        setCurrentText(fullText.substring(0, currentText.length + 1));
      } else {
        // Finished typing, wait before deleting
        setIsWaiting(true);
        setTimeout(() => {
          setIsWaiting(false);
          setIsDeleting(true);
        }, delayBetweenTexts);
      }
    } else {
      // Deleting
      if (currentText.length > 0) {
        setCurrentText(fullText.substring(0, currentText.length - 1));
      } else {
        // Finished deleting, move to next text
        setIsDeleting(false);
        setCurrentTextIndex((prev) => (prev + 1) % texts.length);

        if (currentTextIndex === texts.length - 1 && onComplete) {
          onComplete();
        }
      }
    }
  }, [
    texts,
    currentTextIndex,
    currentText,
    isDeleting,
    isWaiting,
    delayBetweenTexts,
    onComplete,
  ]);

  useEffect(() => {
    const timeout = setTimeout(typeText, isDeleting ? deleteSpeed : speed);

    return () => clearTimeout(timeout);
  }, [typeText, isDeleting, speed, deleteSpeed]);

  return (
    <div className="relative inline-block">
      <motion.span
        className={cn("inline-block", className)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {currentText}
      </motion.span>

      {showCursor && (
        <motion.span
          className={cn(
            "bg-brutalist-yellow ml-1 inline-block w-1",
            cursorClassName
          )}
          animate={{ opacity: [1, 0] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          style={{ height: "1em" }}
        />
      )}
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
  const [_completedWords, setCompletedWords] = useState(0);

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
