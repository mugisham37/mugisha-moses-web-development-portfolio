"use client";

import React, { useRef } from "react";
import { useFocusTrap, FocusTrapOptions } from "@/lib/accessibility";

interface FocusTrapProps {
  children: React.ReactNode;
  isActive: boolean;
  options?: FocusTrapOptions;
  className?: string;
}

/**
 * Focus trap component that manages keyboard focus within a container
 * Essential for modals, dropdowns, and other overlay components
 */
export function FocusTrap({
  children,
  isActive,
  options = {},
  className = "",
}: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Use the focus trap hook
  useFocusTrap(containerRef as React.RefObject<HTMLElement>, isActive, {
    escapeDeactivates: true,
    clickOutsideDeactivates: false,
    returnFocusOnDeactivate: true,
    ...options,
  });

  return (
    <div ref={containerRef} className={className} data-focus-trap={isActive}>
      {children}
    </div>
  );
}

/**
 * Hook for managing focus trap in custom components
 */
export function useFocusTrapContainer(
  isActive: boolean,
  options: FocusTrapOptions = {}
) {
  const containerRef = useRef<HTMLDivElement>(null);

  useFocusTrap(containerRef as React.RefObject<HTMLElement>, isActive, {
    escapeDeactivates: true,
    clickOutsideDeactivates: false,
    returnFocusOnDeactivate: true,
    ...options,
  });

  return containerRef;
}
