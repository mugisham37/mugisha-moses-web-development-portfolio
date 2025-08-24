import { useState, useEffect, useRef } from "react";
import { useIntersectionObserver } from "./useIntersectionObserver";

interface UseAnimatedCounterOptions {
  end: number;
  start?: number;
  duration?: number;
  easing?: (t: number) => number;
  formatValue?: (value: number) => string;
}

export const useAnimatedCounter = (options: UseAnimatedCounterOptions) => {
  const [count, setCount] = useState(options.start || 0);
  const [isAnimating, setIsAnimating] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(ref, {
    threshold: 0.5,
    rootMargin: "0px",
    triggerOnce: true,
  });

  useEffect(() => {
    if (!isVisible || isAnimating) return;

    setIsAnimating(true);
    const startTime = Date.now();
    const startValue = options.start || 0;
    const endValue = options.end;
    const duration = options.duration || 2000;
    const easing = options.easing || ((t: number) => 1 - Math.pow(1 - t, 3)); // easeOutCubic

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easing(progress);
      const current = startValue + (endValue - startValue) * easedProgress;

      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, options, isAnimating]);

  return {
    count: options.formatValue ? options.formatValue(count) : Math.floor(count),
    ref,
    isAnimating,
  };
};
