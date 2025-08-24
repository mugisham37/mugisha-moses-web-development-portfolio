"use client";

import { useEffect, useState, useRef, RefObject } from "react";

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
  root?: Element | null;
}

interface IntersectionObserverResult {
  isVisible: boolean;
  hasTriggered: boolean;
  entry: IntersectionObserverEntry | null;
}

export const useIntersectionObserver = (
  ref: RefObject<Element>,
  options: UseIntersectionObserverOptions = {}
): IntersectionObserverResult => {
  const {
    threshold = 0.1,
    rootMargin = "0px",
    triggerOnce = false,
    root = null,
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  // Store the observer instance
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Skip on server-side rendering
    if (typeof window === "undefined") return;

    const element = ref.current;
    if (!element) return;

    // Create intersection observer
    observerRef.current = new IntersectionObserver(
      ([observerEntry]) => {
        const isIntersecting = observerEntry.isIntersecting;

        setEntry(observerEntry);
        setIsVisible(isIntersecting);

        if (isIntersecting && !hasTriggered) {
          setHasTriggered(true);
        }

        // If triggerOnce is true and element has been visible, stop observing
        if (triggerOnce && isIntersecting && !hasTriggered) {
          observerRef.current?.unobserve(element);
        }
      },
      {
        threshold,
        rootMargin,
        root,
      }
    );

    // Start observing
    observerRef.current.observe(element);

    // Cleanup function
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [ref, threshold, rootMargin, triggerOnce, root, hasTriggered]);

  // Reset state when ref changes
  useEffect(() => {
    if (!triggerOnce) {
      setIsVisible(false);
      setHasTriggered(false);
      setEntry(null);
    }
  }, [ref, triggerOnce]);

  return {
    isVisible,
    hasTriggered,
    entry,
  };
};

// Hook for multiple elements
export const useIntersectionObserverMultiple = (
  refs: RefObject<Element>[],
  options: UseIntersectionObserverOptions = {}
) => {
  const [visibilityMap, setVisibilityMap] = useState<Map<Element, boolean>>(
    new Map()
  );
  const [entriesMap, setEntriesMap] = useState<
    Map<Element, IntersectionObserverEntry>
  >(new Map());

  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Skip on server-side rendering
    if (typeof window === "undefined") return;

    const elements = refs
      .map((ref) => ref.current)
      .filter((el): el is Element => el !== null);

    if (elements.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setVisibilityMap((prev) => {
            const newMap = new Map(prev);
            newMap.set(entry.target, entry.isIntersecting);
            return newMap;
          });

          setEntriesMap((prev) => {
            const newMap = new Map(prev);
            newMap.set(entry.target, entry);
            return newMap;
          });
        });
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || "0px",
        root: options.root || null,
      }
    );

    elements.forEach((element) => {
      observerRef.current?.observe(element);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [refs, options.threshold, options.rootMargin, options.root]);

  return {
    visibilityMap,
    entriesMap,
    getVisibility: (element: Element) => visibilityMap.get(element) || false,
    getEntry: (element: Element) => entriesMap.get(element) || null,
  };
};
