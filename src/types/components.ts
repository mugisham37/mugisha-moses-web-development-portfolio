// Component prop type definitions

import { ReactNode, CSSProperties } from "react";
import { ThemeType } from "./theme";

export interface BaseComponentProps {
  children?: ReactNode;
  className?: string;
  theme?: ThemeType;
  style?: CSSProperties;
}

export interface BrutalButtonProps extends BaseComponentProps {
  variant: "primary" | "secondary" | "ghost";
  size: "sm" | "md" | "lg";
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export interface BrutalCardProps extends BaseComponentProps {
  variant?: "default" | "elevated" | "outlined";
  padding?: "sm" | "md" | "lg";
  hover?: boolean;
}

export interface BrutalInputProps extends BaseComponentProps {
  type?: "text" | "email" | "password" | "textarea";
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  label?: string;
  required?: boolean;
}

export interface AnimatedTextProps extends BaseComponentProps {
  text: string;
  animation?: "typewriter" | "glitch" | "fade" | "slide";
  delay?: number;
  duration?: number;
}

export interface TypewriterTextProps extends BaseComponentProps {
  text: string;
  speed?: number;
  delay?: number;
  cursor?: boolean;
  loop?: boolean;
}

export interface GlitchTextProps extends BaseComponentProps {
  text: string;
  intensity?: "low" | "medium" | "high";
  duration?: number;
  trigger?: "hover" | "auto" | "manual";
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl";
  backdrop?: boolean;
}
