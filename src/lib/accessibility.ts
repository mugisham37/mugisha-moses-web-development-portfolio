/**
 * Comprehensive accessibility utilities for WCAG 2.1 AA compliance
 * Provides focus management, screen reader support, and keyboard navigation
 */

import { useEffect, useRef, useCallback } from "react";

// ARIA Live Region Types
export type LiveRegionPoliteness = "polite" | "assertive" | "off";

// Focus Management Types
export interface FocusOptions {
  preventScroll?: boolean;
  restoreOnUnmount?: boolean;
  selectTextOnFocus?: boolean;
}

export interface FocusTrapOptions {
  initialFocus?: HTMLElement | string;
  fallbackFocus?: HTMLElement | string;
  escapeDeactivates?: boolean;
  clickOutsideDeactivates?: boolean;
  returnFocusOnDeactivate?: boolean;
}

// Screen Reader Utilities
export class ScreenReaderUtils {
  private static liveRegions = new Map<string, HTMLElement>();

  /**
   * Announce message to screen readers
   */
  static announce(message: string, priority: LiveRegionPoliteness = "polite") {
    const regionId = `sr-live-${priority}`;
    let region = this.liveRegions.get(regionId);

    if (!region) {
      region = document.createElement("div");
      region.id = regionId;
      region.setAttribute("aria-live", priority);
      region.setAttribute("aria-atomic", "true");
      region.className = "sr-only";
      document.body.appendChild(region);
      this.liveRegions.set(regionId, region);
    }

    // Clear previous message and set new one
    region.textContent = "";
    setTimeout(() => {
      region!.textContent = message;
    }, 100);

    // Clear message after announcement
    setTimeout(() => {
      region!.textContent = "";
    }, 1000);
  }

  /**
   * Create a live region for dynamic content updates
   */
  static createLiveRegion(
    id: string,
    priority: LiveRegionPoliteness = "polite"
  ): HTMLElement {
    let region = this.liveRegions.get(id);

    if (!region) {
      region = document.createElement("div");
      region.id = id;
      region.setAttribute("aria-live", priority);
      region.setAttribute("aria-atomic", "true");
      region.className = "sr-only";
      document.body.appendChild(region);
      this.liveRegions.set(id, region);
    }

    return region;
  }

  /**
   * Update live region content
   */
  static updateLiveRegion(id: string, message: string) {
    const region = this.liveRegions.get(id);
    if (region) {
      region.textContent = message;
    }
  }

  /**
   * Remove live region
   */
  static removeLiveRegion(id: string) {
    const region = this.liveRegions.get(id);
    if (region && region.parentNode) {
      region.parentNode.removeChild(region);
      this.liveRegions.delete(id);
    }
  }
}

// Focus Management Utilities
export class FocusManager {
  private static focusHistory: HTMLElement[] = [];

  /**
   * Set focus to element with options
   */
  static setFocus(
    element: HTMLElement | string,
    options: FocusOptions = {}
  ): boolean {
    const targetElement =
      typeof element === "string" ? document.querySelector(element) : element;

    if (!targetElement || !(targetElement instanceof HTMLElement)) {
      return false;
    }

    // Store current focus for restoration
    if (options.restoreOnUnmount && document.activeElement) {
      this.focusHistory.push(document.activeElement as HTMLElement);
    }

    // Focus the element
    targetElement.focus({ preventScroll: options.preventScroll });

    // Select text if it's an input
    if (
      options.selectTextOnFocus &&
      (targetElement instanceof HTMLInputElement ||
        targetElement instanceof HTMLTextAreaElement)
    ) {
      targetElement.select();
    }

    return document.activeElement === targetElement;
  }

  /**
   * Restore previous focus
   */
  static restoreFocus(): boolean {
    const previousElement = this.focusHistory.pop();
    if (previousElement && document.contains(previousElement)) {
      previousElement.focus();
      return true;
    }
    return false;
  }

  /**
   * Get all focusable elements within a container
   */
  static getFocusableElements(container: HTMLElement): HTMLElement[] {
    const focusableSelectors = [
      'a[href]:not([tabindex="-1"])',
      'button:not([disabled]):not([tabindex="-1"])',
      'input:not([disabled]):not([tabindex="-1"])',
      'select:not([disabled]):not([tabindex="-1"])',
      'textarea:not([disabled]):not([tabindex="-1"])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]:not([tabindex="-1"])',
    ].join(", ");

    return Array.from(container.querySelectorAll(focusableSelectors)).filter(
      (element) => {
        return (
          element instanceof HTMLElement &&
          element.offsetWidth > 0 &&
          element.offsetHeight > 0 &&
          !element.hidden
        );
      }
    ) as HTMLElement[];
  }

  /**
   * Create a focus trap within a container
   */
  static createFocusTrap(
    container: HTMLElement,
    options: FocusTrapOptions = {}
  ): () => void {
    const focusableElements = this.getFocusableElements(container);
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    // Set initial focus
    if (options.initialFocus) {
      const initialElement =
        typeof options.initialFocus === "string"
          ? container.querySelector(options.initialFocus)
          : options.initialFocus;
      if (initialElement instanceof HTMLElement) {
        this.setFocus(initialElement);
      }
    } else if (firstFocusable) {
      this.setFocus(firstFocusable);
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        if (event.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstFocusable) {
            event.preventDefault();
            lastFocusable?.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastFocusable) {
            event.preventDefault();
            firstFocusable?.focus();
          }
        }
      } else if (event.key === "Escape" && options.escapeDeactivates) {
        event.preventDefault();
        deactivate();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        options.clickOutsideDeactivates &&
        !container.contains(event.target as Node)
      ) {
        deactivate();
      }
    };

    const deactivate = () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClickOutside);

      if (options.returnFocusOnDeactivate) {
        this.restoreFocus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    if (options.clickOutsideDeactivates) {
      document.addEventListener("click", handleClickOutside);
    }

    return deactivate;
  }
}

// Keyboard Navigation Utilities
export class KeyboardNavigation {
  /**
   * Handle arrow key navigation for lists/grids
   */
  static handleArrowNavigation(
    event: KeyboardEvent,
    elements: HTMLElement[],
    currentIndex: number,
    options: {
      orientation?: "horizontal" | "vertical" | "both";
      wrap?: boolean;
      columns?: number;
    } = {}
  ): number {
    const { orientation = "vertical", wrap = true, columns = 1 } = options;
    let newIndex = currentIndex;

    switch (event.key) {
      case "ArrowUp":
        if (orientation === "vertical" || orientation === "both") {
          event.preventDefault();
          newIndex = currentIndex - columns;
          if (newIndex < 0) {
            newIndex = wrap ? elements.length - 1 : 0;
          }
        }
        break;

      case "ArrowDown":
        if (orientation === "vertical" || orientation === "both") {
          event.preventDefault();
          newIndex = currentIndex + columns;
          if (newIndex >= elements.length) {
            newIndex = wrap ? 0 : elements.length - 1;
          }
        }
        break;

      case "ArrowLeft":
        if (orientation === "horizontal" || orientation === "both") {
          event.preventDefault();
          newIndex = currentIndex - 1;
          if (newIndex < 0) {
            newIndex = wrap ? elements.length - 1 : 0;
          }
        }
        break;

      case "ArrowRight":
        if (orientation === "horizontal" || orientation === "both") {
          event.preventDefault();
          newIndex = currentIndex + 1;
          if (newIndex >= elements.length) {
            newIndex = wrap ? 0 : elements.length - 1;
          }
        }
        break;

      case "Home":
        event.preventDefault();
        newIndex = 0;
        break;

      case "End":
        event.preventDefault();
        newIndex = elements.length - 1;
        break;
    }

    if (newIndex !== currentIndex && elements[newIndex]) {
      elements[newIndex].focus();
      return newIndex;
    }

    return currentIndex;
  }
}

// Color Contrast Utilities
export class ColorContrast {
  /**
   * Calculate relative luminance of a color
   */
  static getRelativeLuminance(color: string): number {
    const rgb = this.hexToRgb(color);
    if (!rgb) return 0;

    const [r, g, b] = rgb.map((c) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  /**
   * Calculate contrast ratio between two colors
   */
  static getContrastRatio(color1: string, color2: string): number {
    const lum1 = this.getRelativeLuminance(color1);
    const lum2 = this.getRelativeLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  }

  /**
   * Check if color combination meets WCAG standards
   */
  static meetsWCAG(
    foreground: string,
    background: string,
    level: "AA" | "AAA" = "AA",
    size: "normal" | "large" = "normal"
  ): boolean {
    const ratio = this.getContrastRatio(foreground, background);
    const threshold =
      level === "AAA"
        ? size === "large"
          ? 4.5
          : 7
        : size === "large"
          ? 3
          : 4.5;
    return ratio >= threshold;
  }

  /**
   * Convert hex color to RGB
   */
  private static hexToRgb(hex: string): [number, number, number] | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16),
        ]
      : null;
  }
}

// React Hooks for Accessibility
export function useAnnouncement() {
  return useCallback(
    (message: string, priority: LiveRegionPoliteness = "polite") => {
      ScreenReaderUtils.announce(message, priority);
    },
    []
  );
}

export function useFocusManagement() {
  return {
    setFocus: useCallback(
      (element: HTMLElement | string, options?: FocusOptions) => {
        return FocusManager.setFocus(element, options);
      },
      []
    ),
    restoreFocus: useCallback(() => {
      return FocusManager.restoreFocus();
    }, []),
    getFocusableElements: useCallback((container: HTMLElement) => {
      return FocusManager.getFocusableElements(container);
    }, []),
  };
}

export function useFocusTrap(
  containerRef: React.RefObject<HTMLElement>,
  isActive: boolean,
  options: FocusTrapOptions = {}
) {
  const deactivateRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (isActive && containerRef.current) {
      deactivateRef.current = FocusManager.createFocusTrap(
        containerRef.current,
        options
      );
    } else if (deactivateRef.current) {
      deactivateRef.current();
      deactivateRef.current = null;
    }

    return () => {
      if (deactivateRef.current) {
        deactivateRef.current();
      }
    };
  }, [isActive, containerRef, options]);
}

export function useKeyboardNavigation(
  elements: HTMLElement[],
  options: {
    orientation?: "horizontal" | "vertical" | "both";
    wrap?: boolean;
    columns?: number;
  } = {}
) {
  const currentIndexRef = useRef(0);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const newIndex = KeyboardNavigation.handleArrowNavigation(
        event,
        elements,
        currentIndexRef.current,
        options
      );
      currentIndexRef.current = newIndex;
    },
    [elements, options]
  );

  return { handleKeyDown, currentIndex: currentIndexRef.current };
}

// Accessibility Testing Utilities
export class AccessibilityTesting {
  /**
   * Check if element has proper ARIA labels
   */
  static hasAccessibleName(element: HTMLElement): boolean {
    return !!(
      element.getAttribute("aria-label") ||
      element.getAttribute("aria-labelledby") ||
      element.textContent?.trim() ||
      (element instanceof HTMLInputElement && element.labels?.length)
    );
  }

  /**
   * Check if interactive element is keyboard accessible
   */
  static isKeyboardAccessible(element: HTMLElement): boolean {
    const tabIndex = element.getAttribute("tabindex");
    return (
      element.tagName === "BUTTON" ||
      element.tagName === "A" ||
      element.tagName === "INPUT" ||
      element.tagName === "SELECT" ||
      element.tagName === "TEXTAREA" ||
      (tabIndex !== null && tabIndex !== "-1")
    );
  }

  /**
   * Audit element for common accessibility issues
   */
  static auditElement(element: HTMLElement): string[] {
    const issues: string[] = [];

    // Check for accessible name
    if (!this.hasAccessibleName(element)) {
      issues.push("Element lacks accessible name");
    }

    // Check for keyboard accessibility
    if (!this.isKeyboardAccessible(element)) {
      issues.push("Element is not keyboard accessible");
    }

    // Check for proper roles
    const role = element.getAttribute("role");
    if (element.onclick && !role && element.tagName !== "BUTTON") {
      issues.push("Interactive element should have proper role or be a button");
    }

    return issues;
  }
}

// Export all utilities
export {
  ScreenReaderUtils,
  FocusManager,
  KeyboardNavigation,
  ColorContrast,
  AccessibilityTesting,
};
