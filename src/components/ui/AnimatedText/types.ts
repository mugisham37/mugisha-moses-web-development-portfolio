export interface BaseAnimatedTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  onComplete?: () => void;
  theme?: "extreme-brutalist" | "refined-brutalist";
}

export interface TypewriterTextProps
  extends Omit<BaseAnimatedTextProps, "children"> {
  text: string;
  speed?: number;
  showCursor?: boolean;
  cursorChar?: string;
  startDelay?: number;
  randomizeSpeed?: boolean;
  preserveWhitespace?: boolean;
}

export interface GlitchTextProps extends BaseAnimatedTextProps {
  intensity?: "low" | "medium" | "high";
  trigger?: "hover" | "auto" | "manual";
  glitchDuration?: number;
  glitchInterval?: number;
  colors?: string[];
  isActive?: boolean;
}

export interface AnimatedTextProps extends BaseAnimatedTextProps {
  animation?:
    | "fadeIn"
    | "slideUp"
    | "slideDown"
    | "slideLeft"
    | "slideRight"
    | "scaleIn"
    | "rotateIn"
    | "bounceIn"
    | "flipIn";
  stagger?: boolean;
  staggerDelay?: number;
  easing?: string;
}

export type AnimationType =
  | "fadeIn"
  | "slideUp"
  | "slideDown"
  | "slideLeft"
  | "slideRight"
  | "scaleIn"
  | "rotateIn"
  | "bounceIn"
  | "flipIn";

export interface AnimationConfig {
  duration: number;
  delay: number;
  easing: string;
  transform: string;
  opacity: number;
}
