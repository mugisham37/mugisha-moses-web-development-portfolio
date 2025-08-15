/**
 * Client-side accessibility hooks for React components
 * Provides screen reader announcements, focus management, and keyboard navigation
 */

"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  ScreenReaderUtils,
  FocusManager,
  type LiveRegionPoliteness,
} from "@/lib/accessibility";

/**
 * Hook for announcing messages to screen readers
 */
export function useAnnouncement() {
  const announce = useCallback(
    (message: string, priority: LiveRegionPoliteness = "polite") => {
      if (typeof window !== "undefined") {
        ScreenReaderUtils.announce(message, priority);
      }
    },
    []
  );

  return announce;
}

/**
 * Hook for managing focus with restoration
 */
export function useFocusManagement() {
  const setFocus = useCallback(
    (
      element: HTMLElement | string,
      options?: {
        preventScroll?: boolean;
        restoreOnUnmount?: boolean;
        selectTextOnFocus?: boolean;
      }
    ) => {
      if (typeof window !== "undefined") {
        return FocusManager.setFocus(element, options);
      }
      return false;
    },
    []
  );

  const restoreFocus = useCallback(() => {
    if (typeof window !== "undefined") {
      return FocusManager.restoreFocus();
    }
    return false;
  }, []);

  return { setFocus, restoreFocus };
}

/**
 * Hook for creating and managing focus traps
 */
export function useFocusTrap(
  containerRef: React.RefObject<HTMLElement>,
  isActive: boolean = false,
  options?: {
    initialFocus?: HTMLElement | string;
    fallbackFocus?: HTMLElement | string;
    escapeDeactivates?: boolean;
    clickOutsideDeactivates?: boolean;
    returnFocusOnDeactivate?: boolean;
  }
) {
  const deactivateRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current || typeof window === "undefined") {
      return;
    }

    const container = containerRef.current;
    deactivateRef.current = FocusManager.createFocusTrap(container, options);

    return () => {
      if (deactivateRef.current) {
        deactivateRef.current();
        deactivateRef.current = null;
      }
    };
  }, [isActive, containerRef, options]);

  const deactivate = useCallback(() => {
    if (deactivateRef.current) {
      deactivateRef.current();
      deactivateRef.current = null;
    }
  }, []);

  return { deactivate };
}

/**
 * Hook for keyboard navigation in lists/grids
 */
export function useKeyboardNavigation(
  elementsRef: React.RefObject<HTMLElement[]>,
  options?: {
    orientation?: "horizontal" | "vertical" | "both";
    wrap?: boolean;
    columns?: number;
  }
) {
  const currentIndexRef = useRef(0);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!elementsRef.current || typeof window === "undefined") return;

      const elements = elementsRef.current;
      const newIndex =
        require("@/lib/accessibility").KeyboardNavigation.handleArrowNavigation(
          event,
          elements,
          currentIndexRef.current,
          options
        );

      currentIndexRef.current = newIndex;
    },
    [elementsRef, options]
  );

  return { handleKeyDown, currentIndex: currentIndexRef.current };
}

/**
 * Hook for live region management
 */
export function useLiveRegion(
  id: string,
  priority: LiveRegionPoliteness = "polite"
) {
  const regionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      regionRef.current = ScreenReaderUtils.createLiveRegion(id, priority);
    }

    return () => {
      if (typeof window !== "undefined") {
        ScreenReaderUtils.removeLiveRegion(id);
      }
    };
  }, [id, priority]);

  const updateRegion = useCallback(
    (message: string) => {
      if (typeof window !== "undefined") {
        ScreenReaderUtils.updateLiveRegion(id, message);
      }
    },
    [id]
  );

  return { updateRegion };
}

/**
 * Hook for reduced motion preference
 */
export function useReducedMotion() {
  const prefersReducedMotion = useCallback(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  return prefersReducedMotion();
}

/**
 * Hook for high contrast preference
 */
export function useHighContrast() {
  const prefersHighContrast = useCallback(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-contrast: high)").matches;
  }, []);

  return prefersHighContrast();
}
