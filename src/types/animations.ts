// Animation type definitions

export interface AnimationConfig {
  duration: number;
  delay?: number;
  easing?: string;
  iterations?: number | "infinite";
  direction?: "normal" | "reverse" | "alternate" | "alternate-reverse";
  fillMode?: "none" | "forwards" | "backwards" | "both";
}

export interface KeyframeAnimation {
  name: string;
  keyframes: Record<string, CSSStyleDeclaration>;
  config: AnimationConfig;
}

export interface ParticleConfig {
  count: number;
  size: {
    min: number;
    max: number;
  };
  speed: {
    min: number;
    max: number;
  };
  color: string | string[];
  opacity: {
    min: number;
    max: number;
  };
  lifetime: {
    min: number;
    max: number;
  };
}

export interface ScrollAnimationConfig {
  threshold: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
  stagger?: number;
}

export interface UseAnimatedCounterOptions {
  end: number;
  start?: number;
  duration?: number;
  easing?: (t: number) => number;
  formatValue?: (value: number) => string;
}

export interface UseIntersectionObserverOptions {
  threshold: number | number[];
  rootMargin: string;
  triggerOnce: boolean;
}

export interface UseParallaxOptions {
  speed: number;
  direction?: "up" | "down" | "left" | "right";
  disabled?: boolean;
}
