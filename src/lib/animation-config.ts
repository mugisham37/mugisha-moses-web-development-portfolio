"use client";

// Animation configuration system for consistent animations across the portfolio

// Types for device capabilities
interface NavigatorWithDeviceMemory extends Navigator {
  deviceMemory?: number;
}

export const ANIMATION_DURATIONS = {
  fast: 0.3,
  normal: 0.6,
  slow: 0.9,
  slower: 1.2,
} as const;

export const ANIMATION_DELAYS = {
  none: 0,
  short: 0.1,
  medium: 0.2,
  long: 0.4,
} as const;

export const ANIMATION_EASINGS = {
  // Standard easings
  linear: [0, 0, 1, 1] as const,
  easeIn: [0.4, 0, 1, 1] as const,
  easeOut: [0, 0, 0.2, 1] as const,
  easeInOut: [0.4, 0, 0.2, 1] as const,

  // Brutalist easings
  brutalist: [0.25, 0.46, 0.45, 0.94] as const,
  sharp: [0.4, 0, 0.2, 1] as const,
  mechanical: [0.25, 0.46, 0.45, 0.94] as const,

  // Expressive easings
  elastic: [0.68, -0.55, 0.265, 1.55] as const,
  bounce: [0.34, 1.56, 0.64, 1] as const,
  smooth: [0.23, 1, 0.32, 1] as const,
  circOut: [0.08, 0.82, 0.17, 1] as const,
  backOut: [0.34, 1.56, 0.64, 1] as const,
} as const;

export const STAGGER_DELAYS = {
  tight: 0.05,
  normal: 0.1,
  relaxed: 0.15,
  loose: 0.2,
  dramatic: 0.3,
} as const;

export const VIEWPORT_THRESHOLDS = {
  immediate: 0,
  early: 0.1,
  normal: 0.2,
  late: 0.3,
  almost: 0.5,
} as const;

export const PARALLAX_SPEEDS = {
  subtle: 0.1,
  gentle: 0.3,
  normal: 0.5,
  strong: 0.7,
  dramatic: 1.0,
} as const;

// Animation presets for common use cases
export const ANIMATION_PRESETS = {
  // Hero section animations
  heroTitle: {
    variant: "brutalistSlam" as const,
    duration: ANIMATION_DURATIONS.slow,
    delay: ANIMATION_DELAYS.short,
    easing: ANIMATION_EASINGS.elastic,
  },
  heroSubtitle: {
    variant: "fadeInUp" as const,
    duration: ANIMATION_DURATIONS.normal,
    delay: ANIMATION_DELAYS.medium,
    easing: ANIMATION_EASINGS.brutalist,
  },
  heroCTA: {
    variant: "scaleInRotate" as const,
    duration: ANIMATION_DURATIONS.normal,
    delay: ANIMATION_DELAYS.long,
    easing: ANIMATION_EASINGS.bounce,
  },

  // Section animations
  sectionTitle: {
    variant: "fadeInUp" as const,
    duration: ANIMATION_DURATIONS.normal,
    delay: ANIMATION_DELAYS.short,
    easing: ANIMATION_EASINGS.brutalist,
  },
  sectionContent: {
    variant: "fadeInUp" as const,
    duration: ANIMATION_DURATIONS.normal,
    delay: ANIMATION_DELAYS.medium,
    easing: ANIMATION_EASINGS.smooth,
  },

  // Card animations
  cardGrid: {
    stagger: STAGGER_DELAYS.normal,
    variant: "scaleInRotate" as const,
    duration: ANIMATION_DURATIONS.normal,
    easing: ANIMATION_EASINGS.backOut,
  },
  cardHover: {
    variant: "morphIn" as const,
    duration: ANIMATION_DURATIONS.fast,
    easing: ANIMATION_EASINGS.sharp,
  },

  // Text animations
  textReveal: {
    stagger: STAGGER_DELAYS.tight,
    animation: "slideUp" as const,
    duration: ANIMATION_DURATIONS.fast,
  },
  textFade: {
    stagger: STAGGER_DELAYS.normal,
    animation: "fadeIn" as const,
    duration: ANIMATION_DURATIONS.normal,
  },

  // Navigation animations
  navItem: {
    variant: "slideInLeft" as const,
    duration: ANIMATION_DURATIONS.fast,
    easing: ANIMATION_EASINGS.sharp,
  },
  mobileMenu: {
    variant: "slideInDown" as const,
    duration: ANIMATION_DURATIONS.normal,
    easing: ANIMATION_EASINGS.brutalist,
  },

  // Page transitions
  pageEnter: {
    variant: "fadeInUp" as const,
    duration: ANIMATION_DURATIONS.normal,
    easing: ANIMATION_EASINGS.brutalist,
  },
  pageExit: {
    variant: "fadeInDown" as const,
    duration: ANIMATION_DURATIONS.fast,
    easing: ANIMATION_EASINGS.sharp,
  },
} as const;

// Responsive animation configurations
export const RESPONSIVE_ANIMATIONS = {
  mobile: {
    reducedMotion: true,
    shorterDurations: true,
    lessStagger: true,
    simpleEasings: true,
  },
  tablet: {
    reducedMotion: false,
    shorterDurations: false,
    lessStagger: false,
    simpleEasings: false,
  },
  desktop: {
    reducedMotion: false,
    shorterDurations: false,
    lessStagger: false,
    simpleEasings: false,
  },
} as const;

// Performance-optimized animation settings
export const PERFORMANCE_SETTINGS = {
  // Reduce animations on low-end devices
  lowEnd: {
    maxConcurrentAnimations: 3,
    reducedComplexity: true,
    disableParallax: true,
    simplifiedEasings: true,
  },

  // Standard settings for most devices
  standard: {
    maxConcurrentAnimations: 8,
    reducedComplexity: false,
    disableParallax: false,
    simplifiedEasings: false,
  },

  // High-performance settings for powerful devices
  highEnd: {
    maxConcurrentAnimations: 16,
    reducedComplexity: false,
    disableParallax: false,
    simplifiedEasings: false,
  },
} as const;

// Animation utility functions
export function getAnimationConfig(
  preset: keyof typeof ANIMATION_PRESETS,
  overrides?: Partial<
    (typeof ANIMATION_PRESETS)[keyof typeof ANIMATION_PRESETS]
  >
) {
  return {
    ...ANIMATION_PRESETS[preset],
    ...overrides,
  };
}

export function getResponsiveAnimationConfig(
  breakpoint: keyof typeof RESPONSIVE_ANIMATIONS
) {
  return RESPONSIVE_ANIMATIONS[breakpoint];
}

export function shouldReduceMotion(): boolean {
  if (typeof window === "undefined") return false;

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function getDevicePerformanceLevel(): keyof typeof PERFORMANCE_SETTINGS {
  if (typeof window === "undefined") return "standard";

  // Simple heuristic based on device capabilities
  const hardwareConcurrency = navigator.hardwareConcurrency || 4;
  const deviceMemory = (navigator as NavigatorWithDeviceMemory).deviceMemory || 4;

  if (hardwareConcurrency >= 8 && deviceMemory >= 8) {
    return "highEnd";
  } else if (hardwareConcurrency <= 2 || deviceMemory <= 2) {
    return "lowEnd";
  }

  return "standard";
}

// Animation sequence builder
// Types for animations
interface AnimationConfig {
  [key: string]: unknown;
}

export class AnimationSequenceBuilder {
  private sequence: Array<{
    element: string;
    animation: AnimationConfig;
    delay: number;
    duration: number;
  }> = [];

  add(
    element: string,
    animation: AnimationConfig,
    delay: number = 0,
    duration: number = ANIMATION_DURATIONS.normal
  ) {
    this.sequence.push({ element, animation, delay, duration });
    return this;
  }

  stagger(
    elements: string[],
    animation: AnimationConfig,
    staggerDelay: number = STAGGER_DELAYS.normal,
    duration: number = ANIMATION_DURATIONS.normal
  ) {
    elements.forEach((element, index) => {
      this.add(element, animation, index * staggerDelay, duration);
    });
    return this;
  }

  build() {
    return this.sequence.sort((a, b) => a.delay - b.delay);
  }

  clear() {
    this.sequence = [];
    return this;
  }
}

// Global animation state management
export class AnimationManager {
  private static instance: AnimationManager;
  private activeAnimations = new Set<string>();
  private performanceLevel: keyof typeof PERFORMANCE_SETTINGS;
  private reducedMotion: boolean;

  private constructor() {
    this.performanceLevel = getDevicePerformanceLevel();
    this.reducedMotion = shouldReduceMotion();

    if (typeof window !== "undefined") {
      // Listen for reduced motion preference changes
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      mediaQuery.addEventListener("change", (e) => {
        this.reducedMotion = e.matches;
      });
    }
  }

  static getInstance(): AnimationManager {
    if (!AnimationManager.instance) {
      AnimationManager.instance = new AnimationManager();
    }
    return AnimationManager.instance;
  }

  shouldAnimate(): boolean {
    if (this.reducedMotion) return false;

    const settings = PERFORMANCE_SETTINGS[this.performanceLevel];
    if (this.activeAnimations.size >= settings.maxConcurrentAnimations) {
      return false;
    }

    return true;
  }

  registerAnimation(animationId: string): void {
    this.activeAnimations.add(animationId);
  }

  unregisterAnimation(animationId: string): void {
    this.activeAnimations.delete(animationId);
  }

  getPerformanceLevel(): keyof typeof PERFORMANCE_SETTINGS {
    return this.performanceLevel;
  }

  isReducedMotion(): boolean {
    return this.reducedMotion;
  }
}

export const animationManager = AnimationManager.getInstance();
