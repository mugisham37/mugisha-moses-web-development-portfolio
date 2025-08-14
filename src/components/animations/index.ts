// Advanced Animation System Exports

// Core animation components
export {
  ViewportAnimation,
  StaggeredAnimation,
  ParallaxElement,
  ScrollProgressIndicator,
  SmoothPageTransition,
  MagneticElement,
  ReducedMotionWrapper,
  AnimatedCounter,
  advancedVariants,
  advancedEasing,
} from "./advanced-scroll-effects";

// Scroll reveal system
export {
  ScrollReveal,
  ScrollRevealStagger,
  MultiLayerParallax,
  ScrollTextReveal,
  ScrollMorph,
  revealVariants,
  easingFunctions,
} from "./scroll-reveal-system";

// Page transitions
export {
  PageTransition,
  LoadingTransition,
  RouteTransition,
  StaggeredPageReveal,
  SectionTransition,
  pageTransitionVariants,
  transitionConfigs,
} from "./page-transitions";

// Scroll navigation
export {
  ScrollNavigation,
  ScrollProgressWithSections,
  FloatingScrollIndicator,
} from "./scroll-navigation";

// Animation provider and context
export {
  AnimationProvider,
  useAnimationContext,
  withAnimationOptimization,
  useAnimationLifecycle,
  useOptimizedAnimation,
  AnimationPerformanceMonitor,
  AnimationDebugger,
} from "./animation-provider";

// Advanced hooks
export {
  useAdvancedInView,
  useAdvancedParallax,
  useStaggeredAnimation,
  useMagneticHover,
  useScrollVelocity,
  useMousePosition,
  useReducedMotion,
  useAnimationSequence,
  useAnimationPerformance,
} from "../hooks/use-advanced-animations";

// Configuration and utilities
export {
  ANIMATION_DURATIONS,
  ANIMATION_DELAYS,
  ANIMATION_EASINGS,
  STAGGER_DELAYS,
  VIEWPORT_THRESHOLDS,
  PARALLAX_SPEEDS,
  ANIMATION_PRESETS,
  RESPONSIVE_ANIMATIONS,
  PERFORMANCE_SETTINGS,
  getAnimationConfig,
  getResponsiveAnimationConfig,
  shouldReduceMotion,
  getDevicePerformanceLevel,
  AnimationSequenceBuilder,
  AnimationManager,
  animationManager,
} from "../../lib/animation-config";

// Showcase component
export { AnimationShowcase } from "./animation-showcase";

// Legacy components (for backward compatibility)
export {
  ScrollTriggered,
  ScrollStagger,
  ParallaxWrapper,
} from "./scroll-triggered";

export {
  AnimationWrapper,
  BrutalistMotion,
  StaggerContainer,
  StaggerItem,
  ScrollTrigger,
  animationVariants,
  brutalistTransitions,
} from "./animation";
