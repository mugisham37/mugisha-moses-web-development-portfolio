import { useEffect, useState, RefObject } from "react";

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
  root?: Element | null;
}

export const useIntersectionObserver = (
  ref: RefObject<Element>,
  options: UseIntersectionObserverOptions = {}
): boolean => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  const {
    threshold = 0.1,
    rootMargin = "0px",
    triggerOnce = false,
    root = null,
  } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // If triggerOnce is true and we've already triggered, don't observe
    if (triggerOnce && hasTriggered) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;

        if (isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            setHasTriggered(true);
          }
        } else if (!triggerOnce && !hasTriggered) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
        root,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, threshold, rootMargin, triggerOnce, hasTriggered, root]);

  return isVisible;
};
