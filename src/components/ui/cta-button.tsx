"use client";

import React, { useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Button, ButtonProps } from "./button";
import { cn } from "@/lib/utils";

interface CTAButtonProps extends Omit<ButtonProps, "children"> {
  children: React.ReactNode;
  glowEffect?: boolean;
  sparkleEffect?: boolean;
  soundDesignFeedback?: boolean;
  hapticIntensity?: "light" | "medium" | "strong";
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  onClickComplete?: () => void;
}

export function CTAButton({
  children,
  className,
  glowEffect = true,
  sparkleEffect = true,
  soundDesignFeedback = true,
  hapticIntensity = "medium",
  onHoverStart,
  onHoverEnd,
  onClickComplete,
  onClick,
  ...props
}: CTAButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [sparkles, setSparkles] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]);

  // Motion values for advanced animations
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(0, { stiffness: 300, damping: 30 });
  const rotateY = useSpring(0, { stiffness: 300, damping: 30 });

  // Transform motion values for 3D effect
  const transform = useTransform(
    [x, y, rotateX, rotateY],
    ([x, y, rotateX, rotateY]) =>
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateX(${x}px) translateY(${y}px)`
  );

  // Handle mouse move for 3D tilt effect
  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!buttonRef.current) return;

      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseX = event.clientX - centerX;
      const mouseY = event.clientY - centerY;

      // Calculate rotation based on mouse position
      const rotateXValue = (mouseY / rect.height) * -10;
      const rotateYValue = (mouseX / rect.width) * 10;

      rotateX.set(rotateXValue);
      rotateY.set(rotateYValue);
    },
    []
  );

  // Handle mouse enter
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    onHoverStart?.();

    // Create sparkle effects
    if (sparkleEffect && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const newSparkles = Array.from({ length: 3 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
      }));

      setSparkles((prev) => [...prev, ...newSparkles]);

      // Remove sparkles after animation
      setTimeout(() => {
        setSparkles((prev) =>
          prev.filter(
            (sparkle) =>
              !newSparkles.some((newSparkle) => newSparkle.id === sparkle.id)
          )
        );
      }, 1000);
    }
  }, [sparkleEffect, onHoverStart]);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    onHoverEnd?.();
  }, [rotateX, rotateY, onHoverEnd]);

  // Enhanced click handler
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      // Haptic feedback simulation based on intensity
      if (buttonRef.current && soundDesignFeedback) {
        const button = buttonRef.current;
        const intensity = {
          light: { scale: 0.98, duration: 100 },
          medium: { scale: 0.95, duration: 150 },
          strong: { scale: 0.92, duration: 200 },
        }[hapticIntensity];

        // Multi-stage haptic simulation
        button.style.transform = `scale(${intensity.scale}) translateY(2px)`;
        button.style.filter = "brightness(1.2) saturate(1.1)";

        setTimeout(() => {
          button.style.transform = "scale(1.02) translateY(-1px)";
          button.style.filter = "brightness(1.05)";
        }, intensity.duration / 3);

        setTimeout(() => {
          button.style.transform = "";
          button.style.filter = "";
          onClickComplete?.();
        }, intensity.duration);

        // Sound design visual feedback
        const pulse = document.createElement("div");
        pulse.className =
          "absolute inset-0 border-4 border-current opacity-50 animate-ping pointer-events-none";
        button.appendChild(pulse);

        setTimeout(() => {
          if (pulse.parentNode) {
            pulse.parentNode.removeChild(pulse);
          }
        }, 600);
      }

      onClick?.(event);
    },
    [onClick, soundDesignFeedback, hapticIntensity, onClickComplete]
  );

  return (
    <motion.div
      className="group relative"
      style={{ transform }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glow effect */}
      {glowEffect && (
        <motion.div
          className="absolute inset-0 rounded-none opacity-0 blur-lg"
          style={{
            background:
              props.variant === "accent"
                ? "linear-gradient(45deg, #ffff00, #ffff33, #ffff00)"
                : "linear-gradient(45deg, #ffffff, #f0f0f0, #ffffff)",
          }}
          animate={{
            opacity: isHovered ? 0.4 : 0,
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      )}

      {/* Main button */}
      <Button
        ref={buttonRef}
        className={cn(
          "relative z-10 transition-all duration-300",
          // Enhanced shadows and transforms
          "hover:shadow-[16px_16px_0px_rgba(0,0,0,0.8)]",
          "active:shadow-[6px_6px_0px_rgba(0,0,0,0.8)]",
          // 3D perspective enhancements
          "transform-gpu will-change-transform",
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {children}

        {/* Sparkle effects */}
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            className="pointer-events-none absolute h-1 w-1 rounded-full bg-current"
            style={{
              left: sparkle.x,
              top: sparkle.y,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 1,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Micro-interaction indicator */}
        {soundDesignFeedback && (
          <motion.div
            className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-current opacity-0"
            animate={{
              opacity: isHovered ? [0, 1, 0] : 0,
              scale: isHovered ? [0, 1.5, 0] : 0,
            }}
            transition={{
              duration: 0.8,
              repeat: isHovered ? Infinity : 0,
              repeatType: "loop",
            }}
          />
        )}
      </Button>

      {/* Accessibility enhancement - screen reader feedback */}
      <span className="sr-only">
        {isHovered ? "Button is focused and ready to activate" : ""}
      </span>
    </motion.div>
  );
}
