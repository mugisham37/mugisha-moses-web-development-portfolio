"use client";

import { useState, useEffect, useCallback } from "react";

interface UseScrollProgressOptions {
  throttleMs?: number;
  element?: HTMLElement | null;
}

interface ScrollProgressData {
  scrollY: number;
  scrollX: number;
  progress: number; // 0-1 representing scroll progress
  direction: "up" | "down" | "none";
  isScrolling: boolean;
}

export const useScrollProgress = (
  options: UseScrollProgressOptions = {}
): number => {
  const scrollData = useScrollProgressData(options);
  return scrollData.progress;
};

export const useScrollProgressData = (
  options: UseScrollProgressOptions = {}
): ScrollProgressData => {
  const { throttleMs = 16, element } = options; // ~60fps by default

  const [scrollData, setScrollData] = useState<ScrollProgressData>({
    scrollY: 0,
    scrollX: 0,
    progress: 0,
    direction: "none",
    isScrolling: false,
  });

  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const updateScrollData = useCallback(() => {
    // Skip on server-side rendering
    if (typeof window === "undefined") return;

    const target = element || window;
    const scrollElement = element || document.documentElement;

    const scrollY = element ? element.scrollTop : window.scrollY;
    const scrollX = element ? element.scrollLeft : window.scrollX;

    // Calculate total scrollable height
    const scrollHeight = element
      ? element.scrollHeight - element.clientHeight
      : document.documentElement.scrollHeight - window.innerHeight;

    // Calculate progress (0-1)
    const progress = scrollHeight > 0 ? Math.min(scrollY / scrollHeight, 1) : 0;

    // Determine scroll direction
    let direction: "up" | "down" | "none" = "none";
    if (scrollY > lastScrollY) {
      direction = "down";
    } else if (scrollY < lastScrollY) {
      direction = "up";
    }

    setScrollData({
      scrollY,
      scrollX,
      progress,
      direction,
      isScrolling: true,
    });

    setLastScrollY(scrollY);

    // Clear existing timeout
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }

    // Set scroll end timeout
    const timeout = setTimeout(() => {
      setScrollData((prev) => ({
        ...prev,
        isScrolling: false,
        direction: "none",
      }));
    }, 150);

    setScrollTimeout(timeout);
  }, [element, lastScrollY, scrollTimeout]);

  useEffect(() => {
    // Skip on server-side rendering
    if (typeof window === "undefined") return;

    const target = element || window;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateScrollData();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Throttled scroll handler
    let lastTime = 0;
    const throttledHandler = () => {
      const now = Date.now();
      if (now - lastTime >= throttleMs) {
        handleScroll();
        lastTime = now;
      }
    };

    target.addEventListener("scroll", throttledHandler, { passive: true });

    // Initial calculation
    updateScrollData();

    return () => {
      target.removeEventListener("scroll", throttledHandler);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [element, throttleMs, updateScrollData, scrollTimeout]);

  return scrollData;
};
