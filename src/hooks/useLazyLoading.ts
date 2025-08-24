"use client";

import { useState, useEffect, useRef, RefObject } from "react";
import { useIntersectionObserver } from "./useIntersectionObserver";

interface UseLazyLoadingOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  enabled?: boolean;
  delay?: number;
}

interface UseLazyLoadingReturn {
  ref: RefObject<HTMLElement>;
  isVisible: boolean;
  isLoaded: boolean;
  load: () => void;
  reset: () => void;
}

export const useLazyLoading = (
  options: UseLazyLoadingOptions = {}
): UseLazyLoadingReturn => {
  const {
    threshold = 0.1,
    rootMargin = "50px",
    triggerOnce = true,
    enabled = true,
    delay = 0,
  } = options;

  const [isLoaded, setIsLoaded] = useState(!enabled);
  const [shouldLoad, setShouldLoad] = useState(!enabled);
  const ref = useRef<HTMLElement>(null);

  const isVisible = useIntersectionObserver(ref, {
    threshold,
    rootMargin,
    triggerOnce,
  });

  useEffect(() => {
    if (!enabled) return;

    if (isVisible && !shouldLoad) {
      if (delay > 0) {
        const timer = setTimeout(() => {
          setShouldLoad(true);
        }, delay);

        return () => clearTimeout(timer);
      } else {
        setShouldLoad(true);
      }
    }
  }, [isVisible, shouldLoad, enabled, delay]);

  const load = () => {
    setShouldLoad(true);
    setIsLoaded(true);
  };

  const reset = () => {
    setIsLoaded(false);
    setShouldLoad(false);
  };

  useEffect(() => {
    if (shouldLoad && !isLoaded) {
      setIsLoaded(true);
    }
  }, [shouldLoad, isLoaded]);

  return {
    ref,
    isVisible: shouldLoad,
    isLoaded,
    load,
    reset,
  };
};
