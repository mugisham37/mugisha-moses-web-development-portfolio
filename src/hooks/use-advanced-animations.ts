"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  useInView,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useAnimation,
} from "framer-motion";

// Types for better type safety
interface InViewOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
  onEnter?: () => void;
  onLeave?: () => void;
  onProgress?: (progress: number) => void;
}

interface AnimationData {
  [key: string]: unknown;
}

interface AnimationSequenceStep {
  animation: AnimationData;
  duration?: number;
  delay?: number;
}

// Advanced intersection observer hook with multiple thresholds
export function useAdvancedInView(
  options: InViewOptions = {}
) {
  const {
    threshold = 0.1,
    rootMargin = "0px",
    triggerOnce = true,
    onEnter,
    onLeave,
    onProgress,
  } = options;

  const ref = useRef<HTMLElement>(null);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [intersectionRatio, setIntersectionRatio] = useState(0);

  const isInView = useInView(ref, {
    amount: typeof threshold === 'number' ? threshold : 0.1,
    once: triggerOnce,
  });

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIntersectionRatio(entry.intersectionRatio);
        onProgress?.(entry.intersectionRatio);

        if (entry.isIntersecting && !hasTriggered) {
          setHasTriggered(true);
          onEnter?.();
        } else if (!entry.isIntersecting && hasTriggered && !triggerOnce) {
          setHasTriggered(false);
          onLeave?.();
        }
      },
      {
        threshold: Array.isArray(threshold) ? threshold : [threshold],
        rootMargin,
      }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [
    threshold,
    rootMargin,
    triggerOnce,
    hasTriggered,
    onEnter,
    onLeave,
    onProgress,
  ]);

  return {
    ref,
    isInView,
    hasTriggered,
    intersectionRatio,
  };
}

// Advanced parallax hook with multiple effects
export function useAdvancedParallax(
  options: {
    speed?: number;
    direction?: "vertical" | "horizontal";
    scale?: boolean;
    rotate?: boolean;
    opacity?: boolean;
    blur?: boolean;
    offset?: [string, string];
  } = {}
) {
  const {
    speed = 0.5,
    direction = "vertical",
    scale = false,
    rotate = false,
    opacity = false,
    blur = false,
    offset = ["start end", "end start"],
  } = options;

  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset,
  });

  // Create smooth spring animations - always call hooks unconditionally
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };

  // Always create all transforms, but with conditional values
  const yTransform = useTransform(
    scrollYProgress,
    [0, 1],
    direction === "vertical" ? [0, speed * -100] : [0, 0]
  );
  
  const xTransform = useTransform(
    scrollYProgress,
    [0, 1],
    direction === "horizontal" ? [0, speed * -100] : [0, 0]
  );
  
  const scaleTransform = useTransform(
    scrollYProgress, 
    [0, 0.5, 1], 
    scale ? [1, 1 + speed * 0.2, 1] : [1, 1, 1]
  );
  
  const rotateTransform = useTransform(
    scrollYProgress, 
    [0, 1], 
    rotate ? [0, speed * 360] : [0, 0]
  );
  
  const opacityTransform = useTransform(
    scrollYProgress, 
    [0, 0.5, 1], 
    opacity ? [1, 0.5, 1] : [1, 1, 1]
  );
  
  const filterTransform = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    blur ? [`blur(0px)`, `blur(${speed * 5}px)`, `blur(0px)`] : [`blur(0px)`, `blur(0px)`, `blur(0px)`]
  );

  // Apply spring animations to all transforms
  const y = useSpring(yTransform, springConfig);
  const x = useSpring(xTransform, springConfig);
  const scaleSpring = useSpring(scaleTransform, springConfig);
  const rotateSpring = useSpring(rotateTransform, springConfig);
  const opacitySpring = useSpring(opacityTransform, springConfig);

  const transforms = {
    y,
    x,
    scale: scale ? scaleSpring : undefined,
    rotate: rotate ? rotateSpring : undefined,
    opacity: opacity ? opacitySpring : undefined,
    filter: blur ? filterTransform : undefined,
  };

  return { ref, ...transforms };
}

// Staggered animation controller
export function useStaggeredAnimation(
  itemCount: number,
  options: {
    staggerDelay?: number;
    initialDelay?: number;
    threshold?: number;
    triggerOnce?: boolean;
  } = {}
) {
  const {
    staggerDelay = 0.1,
    initialDelay = 0,
    threshold = 0.1,
    triggerOnce = true,
  } = options;

  const ref = useRef<HTMLElement>(null);
  const controls = useAnimation();
  const [triggeredItems, setTriggeredItems] = useState<boolean[]>(
    new Array(itemCount).fill(false)
  );

  const isInView = useInView(ref, {
    amount: typeof threshold === 'number' ? threshold : 0.1,
    once: triggerOnce,
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
          initialDelay * 1000 + i * staggerDelay * 1000
        );

        timers.push(timer);
      }

      return () => {
        timers.forEach(clearTimeout);
      };
    }
  }, [isInView, itemCount, staggerDelay, initialDelay]);

  return {
    ref,
    controls,
    isInView,
    triggeredItems,
  };
}

// Magnetic hover effect hook
export function useMagneticHover(
  options: {
    strength?: number;
    restoreSpeed?: number;
    maxDistance?: number;
  } = {}
) {
  const { strength = 0.3, maxDistance = 50 } = options;

  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance < maxDistance) {
        x.set(deltaX * strength);
        y.set(deltaY * strength);
      }
    },
    [strength, maxDistance, x, y]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  return {
    ref,
    x: springX,
    y: springY,
  };
}

// Scroll velocity hook
export function useScrollVelocity() {
  const [velocity, setVelocity] = useState(0);
  const [direction, setDirection] = useState<"up" | "down">("down");
  const lastScrollY = useRef(0);
  const lastTimestamp = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentTimestamp = Date.now();

      if (lastTimestamp.current) {
        const deltaY = currentScrollY - lastScrollY.current;
        const deltaTime = currentTimestamp - lastTimestamp.current;
        const currentVelocity = Math.abs(deltaY / deltaTime);

        setVelocity(currentVelocity);
        setDirection(deltaY > 0 ? "down" : "up");
      }

      lastScrollY.current = currentScrollY;
      lastTimestamp.current = currentTimestamp;
    };

    const throttledScroll = throttle(handleScroll, 16);
    window.addEventListener("scroll", throttledScroll, { passive: true });

    return () => window.removeEventListener("scroll", throttledScroll);
  }, []);

  return { velocity, direction };
}

// Mouse position hook
export function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return mousePosition;
}

// Reduced motion preference hook
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}

// Animation sequence controller
export function useAnimationSequence() {
  const controls = useAnimation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const playSequence = useCallback(
    async (
      sequence: Array<AnimationSequenceStep>
    ) => {
      setIsPlaying(true);
      setCurrentStep(0);

      for (let i = 0; i < sequence.length; i++) {
        const { animation, duration = 0.5, delay = 0 } = sequence[i];
        setCurrentStep(i);

        if (delay > 0) {
          await new Promise((resolve) => setTimeout(resolve, delay * 1000));
        }

        await controls.start({
          ...animation,
          transition: { duration },
        });
      }

      setIsPlaying(false);
    },
    [controls]
  );

  const stopSequence = useCallback(() => {
    controls.stop();
    setIsPlaying(false);
  }, [controls]);

  return {
    controls,
    currentStep,
    isPlaying,
    playSequence,
    stopSequence,
  };
}

// Utility function for throttling
function throttle<T extends (...args: never[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function (this: unknown, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Performance monitoring hook
export function useAnimationPerformance() {
  const [fps, setFps] = useState(60);
  const [frameTime, setFrameTime] = useState(0);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  useEffect(() => {
    let animationId: number;

    const measurePerformance = (currentTime: number) => {
      frameCount.current++;
      const deltaTime = currentTime - lastTime.current;

      if (deltaTime >= 1000) {
        const currentFps = Math.round((frameCount.current * 1000) / deltaTime);
        setFps(currentFps);
        setFrameTime(deltaTime / frameCount.current);

        frameCount.current = 0;
        lastTime.current = currentTime;
      }

      animationId = requestAnimationFrame(measurePerformance);
    };

    animationId = requestAnimationFrame(measurePerformance);

    return () => cancelAnimationFrame(animationId);
  }, []);

  return { fps, frameTime };
}
