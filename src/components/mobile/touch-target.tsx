"use client";

import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { optimizeTouchTarget } from "@/lib/mobile-utils";

interface TouchTargetProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "minimum" | "recommended" | "large";
  variant?: "button" | "link" | "icon" | "custom";
  hapticFeedback?: boolean;
  children: React.ReactNode;
  disabled?: boolean;
  asChild?: boolean;
}

/**
 * Touch-optimized target component with proper sizing and feedback
 * Ensures WCAG compliance and provides haptic feedback on supported devices
 */
export const TouchTarget = forwardRef<HTMLDivElement, TouchTargetProps>(
  (
    {
      size = "recommended",
      variant = "button",
      hapticFeedback = true,
      children,
      disabled = false,
      asChild = false,
      className,
      onClick,
      onTouchStart,
      onTouchEnd,
      ...props
    },
    ref
  ) => {
    const touchTargetStyles = optimizeTouchTarget(size);

    const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
      if (disabled) return;

      // Provide haptic feedback on supported devices
      if (hapticFeedback && "vibrate" in navigator) {
        navigator.vibrate(10); // Short vibration
      }

      onTouchStart?.(event);
    };

    const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
      if (disabled) return;
      onTouchEnd?.(event);
    };

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      onClick?.(event);
    };

    const baseClasses = cn(
      "relative inline-flex items-center justify-center",
      "focus:outline-none focus:ring-4 focus:ring-yellow-400",
      "transition-all duration-200 ease-out",
      "select-none touch-manipulation", // Optimize for touch
      {
        // Variant styles
        "border-4 border-white bg-black text-white hover:bg-white hover:text-black":
          variant === "button",
        "text-white hover:text-yellow-400 underline-offset-4 hover:underline":
          variant === "link",
        "rounded-none border-2 border-white/20 hover:border-white":
          variant === "icon",
        // Disabled state
        "opacity-50 pointer-events-none": disabled,
      },
      className
    );

    if (asChild) {
      return (
        <div
          ref={ref}
          className={baseClasses}
          style={{
            minWidth: touchTargetStyles.minWidth,
            minHeight: touchTargetStyles.minHeight,
            padding: touchTargetStyles.padding,
          }}
          onClick={handleClick}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          {...props}
        >
          {children}
        </div>
      );
    }

    return (
      <motion.div
        ref={ref}
        className={baseClasses}
        style={{
          minWidth: touchTargetStyles.minWidth,
          minHeight: touchTargetStyles.minHeight,
          padding: touchTargetStyles.padding,
        }}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        transition={{ duration: 0.1 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

TouchTarget.displayName = "TouchTarget";

/**
 * Touch-optimized button component
 */
export const TouchButton = forwardRef<
  HTMLDivElement,
  Omit<TouchTargetProps, "variant">
>(({ children, ...props }, ref) => (
  <TouchTarget ref={ref} variant="button" {...props}>
    {children}
  </TouchTarget>
));

TouchButton.displayName = "TouchButton";

/**
 * Touch-optimized link component
 */
export const TouchLink = forwardRef<
  HTMLDivElement,
  Omit<TouchTargetProps, "variant">
>(({ children, ...props }, ref) => (
  <TouchTarget ref={ref} variant="link" {...props}>
    {children}
  </TouchTarget>
));

TouchLink.displayName = "TouchLink";

/**
 * Touch-optimized icon button component
 */
export const TouchIconButton = forwardRef<
  HTMLDivElement,
  Omit<TouchTargetProps, "variant">
>(({ children, ...props }, ref) => (
  <TouchTarget ref={ref} variant="icon" size="large" {...props}>
    {children}
  </TouchTarget>
));

TouchIconButton.displayName = "TouchIconButton";

/**
 * Hook for touch target optimization
 */
export function useTouchTarget(
  size: "minimum" | "recommended" | "large" = "recommended"
) {
  const styles = optimizeTouchTarget(size);

  return {
    style: styles,
    className: "touch-manipulation select-none",
    "data-touch-target": size,
  };
}
