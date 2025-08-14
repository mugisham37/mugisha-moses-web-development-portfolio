"use client";

import React, { useRef, useCallback, useEffect } from "react";
import { useKeyboardNavigation } from "@/lib/accessibility";
import { cn } from "@/lib/utils";

interface KeyboardNavigationProps {
  children: React.ReactNode;
  orientation?: "horizontal" | "vertical" | "both";
  wrap?: boolean;
  columns?: number;
  className?: string;
  onNavigate?: (index: number, element: HTMLElement) => void;
}

/**
 * Keyboard navigation container that handles arrow key navigation
 * for lists, grids, and other navigable content
 */
export function KeyboardNavigation({
  children,
  orientation = "vertical",
  wrap = true,
  columns = 1,
  className = "",
  onNavigate,
}: KeyboardNavigationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<HTMLElement[]>([]);

  // Update focusable elements when children change
  useEffect(() => {
    if (containerRef.current) {
      const focusableElements = Array.from(
        containerRef.current.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => {
        return (
          element instanceof HTMLElement &&
          element.offsetWidth > 0 &&
          element.offsetHeight > 0 &&
          !element.hidden
        );
      }) as HTMLElement[];

      elementsRef.current = focusableElements;
    }
  }, [children]);

  const { handleKeyDown } = useKeyboardNavigation(elementsRef.current, {
    orientation,
    wrap,
    columns,
  });

  const handleContainerKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const currentIndex = elementsRef.current.indexOf(
        document.activeElement as HTMLElement
      );

      if (currentIndex !== -1) {
        const originalIndex = currentIndex;
        handleKeyDown(event.nativeEvent);

        // Check if focus changed and call onNavigate
        setTimeout(() => {
          const newIndex = elementsRef.current.indexOf(
            document.activeElement as HTMLElement
          );
          if (newIndex !== -1 && newIndex !== originalIndex && onNavigate) {
            onNavigate(newIndex, elementsRef.current[newIndex]);
          }
        }, 0);
      }
    },
    [handleKeyDown, onNavigate]
  );

  return (
    <div
      ref={containerRef}
      className={cn("keyboard-navigation-container", className)}
      onKeyDown={handleContainerKeyDown}
      role={
        orientation === "both"
          ? "grid"
          : orientation === "horizontal"
            ? "menubar"
            : "menu"
      }
    >
      {children}
    </div>
  );
}

/**
 * Navigation item wrapper that provides proper ARIA attributes
 */
interface NavigationItemProps {
  children: React.ReactNode;
  index?: number;
  isActive?: boolean;
  className?: string;
  onClick?: () => void;
}

export function NavigationItem({
  children,
  index,
  isActive = false,
  className = "",
  onClick,
}: NavigationItemProps) {
  return (
    <div
      className={cn(
        "keyboard-navigation-item",
        isActive && "keyboard-navigation-item--active",
        className
      )}
      role="menuitem"
      aria-current={isActive ? "true" : undefined}
      tabIndex={isActive ? 0 : -1}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

/**
 * Hook for custom keyboard navigation implementation
 */
export function useCustomKeyboardNavigation(
  elements: HTMLElement[],
  options: {
    orientation?: "horizontal" | "vertical" | "both";
    wrap?: boolean;
    columns?: number;
    onNavigate?: (index: number, element: HTMLElement) => void;
  } = {}
) {
  const currentIndexRef = useRef(0);
  const {
    orientation = "vertical",
    wrap = true,
    columns = 1,
    onNavigate,
  } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      let newIndex = currentIndexRef.current;

      switch (event.key) {
        case "ArrowUp":
          if (orientation === "vertical" || orientation === "both") {
            event.preventDefault();
            newIndex = currentIndexRef.current - columns;
            if (newIndex < 0) {
              newIndex = wrap ? elements.length - 1 : 0;
            }
          }
          break;

        case "ArrowDown":
          if (orientation === "vertical" || orientation === "both") {
            event.preventDefault();
            newIndex = currentIndexRef.current + columns;
            if (newIndex >= elements.length) {
              newIndex = wrap ? 0 : elements.length - 1;
            }
          }
          break;

        case "ArrowLeft":
          if (orientation === "horizontal" || orientation === "both") {
            event.preventDefault();
            newIndex = currentIndexRef.current - 1;
            if (newIndex < 0) {
              newIndex = wrap ? elements.length - 1 : 0;
            }
          }
          break;

        case "ArrowRight":
          if (orientation === "horizontal" || orientation === "both") {
            event.preventDefault();
            newIndex = currentIndexRef.current + 1;
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

      if (newIndex !== currentIndexRef.current && elements[newIndex]) {
        currentIndexRef.current = newIndex;
        elements[newIndex].focus();

        if (onNavigate) {
          onNavigate(newIndex, elements[newIndex]);
        }
      }
    },
    [elements, orientation, wrap, columns, onNavigate]
  );

  return {
    handleKeyDown,
    currentIndex: currentIndexRef.current,
    setCurrentIndex: (index: number) => {
      currentIndexRef.current = index;
    },
  };
}
