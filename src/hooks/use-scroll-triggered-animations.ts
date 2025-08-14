"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useAnimationContext } from "@/components/animations/animation-provider";

interface ScrollTriggeredAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
  staggerDelay?: number;
  onEnter?: () => void;
  onLeave?: () => void;
}

export function useScrollTriggeredAnimation(
  options: ScrollTriggeredAnimationOptions = {}
) {
  const {
    threshold = 0.1,
    triggerOnce = true,
    delay = 0,
    onEnter,
    onLeave,
  } = options;

  const ref = useRef<HTMLElement>(null);
  const [hasTriggered, setHasTriggered] = useState(false);
  const { reducedMotion } = useAnimationContext();

  const isInView = useInView(ref, {
    amount: typeof threshold === 'number' ? threshold : 0.1,
    once: triggerOnce,
  });

  useEffect(() => {
    if (isInView && !hasTriggered) {
      const optimizedDelay = reducedMotion ? 0 : delay;
      const timer = setTimeout(() => {
        setHasTriggered(true);
        onEnter?.();
      }, optimizedDelay);

      return () => clearTimeout(timer);
    } else if (!isInView && hasTriggered && !triggerOnce) {
      setHasTriggered(false);
      onLeave?.();
    }
  }, [
    isInView,
    hasTriggered,
    delay,
    triggerOnce,
    onEnter,
    onLeave,
    reducedMotion,
  ]);

  return {
    ref,
    isInView,
    hasTriggered,
  };
}

export function useStaggeredScrollAnimation(
  itemCount: number,
  options: ScrollTriggeredAnimationOptions = {}
) {
  const { staggerDelay = 0.1, ...restOptions } = options;
  const containerRef = useRef<HTMLElement>(null);
  const [triggeredItems, setTriggeredItems] = useState<boolean[]>(
    new Array(itemCount).fill(false)
  );

  const isInView = useInView(containerRef, {
    amount: typeof (restOptions.threshold || 0.1) === 'number' ? (restOptions.threshold || 0.1) : 0.1,
    once: restOptions.triggerOnce !== false,
  });

  useEffect(() => {
    if (isInView) {
      const timers: NodeJS.Timeout[] = [];

      for (let i = 0; i < itemCount; i++) {
        const timer = setTimeout(
          () => {
            setTriggeredItems((prev) => {
              const newState = [...prev];
              newState[i] = true;
              return newState;
            });
          },
          (restOptions.delay || 0) + i * staggerDelay
        );

        timers.push(timer);
      }

      return () => {
        timers.forEach(clearTimeout);
      };
    }
  }, [isInView, itemCount, staggerDelay, restOptions.delay]);

  return {
    containerRef,
    isInView,
    triggeredItems,
  };
}

export function useParallaxScroll(speed: number = 0.5) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.pageYOffset * speed);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return offset;
}

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(
    null
  );
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        setScrollDirection("down");
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection("up");
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return scrollDirection;
}

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, scrollPercent)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return progress;
}
