"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ScreenReaderOnlyProps {
  children: React.ReactNode;
  as?: "span" | "div" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  className?: string;
  focusable?: boolean;
}

/**
 * Component for content that should only be visible to screen readers
 * Provides better semantic structure and context for assistive technologies
 */
export function ScreenReaderOnly({
  children,
  as = "span",
  className = "",
  focusable = false,
}: ScreenReaderOnlyProps) {
  const Component = as;
  
  return (
    <Component
      className={cn(
        "sr-only",
        focusable &&
          "focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50",
        focusable &&
          "focus:bg-accent-yellow focus:px-2 focus:py-1 focus:text-black",
        focusable && "focus:rounded-sm focus:border-2 focus:border-black",
        className
      )}
      {...(focusable ? { tabIndex: 0 } : {})}
    >
      {children}
    </Component>
  );
}

/**
 * Live region component for dynamic content announcements
 */
interface LiveRegionProps {
  children: React.ReactNode;
  politeness?: "polite" | "assertive" | "off";
  atomic?: boolean;
  relevant?: "additions" | "removals" | "text" | "all";
  className?: string;
}

export function LiveRegion({
  children,
  politeness = "polite",
  atomic = true,
  relevant = "all",
  className = "",
}: LiveRegionProps) {
  return (
    <div
      className={cn("sr-only", className)}
      aria-live={politeness}
      aria-atomic={atomic}
      aria-relevant={relevant}
    >
      {children}
    </div>
  );
}

/**
 * Status component for important status updates
 */
interface StatusProps {
  children: React.ReactNode;
  className?: string;
}

export function Status({ children, className = "" }: StatusProps) {
  return (
    <div
      className={cn("sr-only", className)}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {children}
    </div>
  );
}

/**
 * Alert component for urgent announcements
 */
interface AlertProps {
  children: React.ReactNode;
  className?: string;
}

export function Alert({ children, className = "" }: AlertProps) {
  return (
    <div
      className={cn("sr-only", className)}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      {children}
    </div>
  );
}
