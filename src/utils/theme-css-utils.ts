"use client";

import { ThemeType, ThemeConfig } from "@/types/theme";

// CSS-in-JS utility functions for theme-aware styling
export class ThemeCSSUtils {
  private theme: ThemeType;
  private config: ThemeConfig;

  constructor(theme: ThemeType, config: ThemeConfig) {
    this.theme = theme;
    this.config = config;
  }

  // Generate theme-aware CSS custom properties
  getCSSVariables(): Record<string, string> {
    return {
      "--theme-primary": this.config.colors.primary,
      "--theme-secondary": this.config.colors.secondary,
      "--theme-accent": this.config.colors.accent,
      "--theme-highlight": this.config.colors.highlight,
      "--theme-success": this.config.colors.success,
      "--theme-bg": this.config.colors.bg,
      "--theme-text": this.config.colors.text,
      "--theme-font-primary": this.config.typography.primary,
      "--theme-font-code": this.config.typography.code,
      "--theme-border-width": this.config.borders.width,
      "--theme-border-style": this.config.borders.style,
      "--theme-border-radius": this.config.borders.radius || "0px",
      "--theme-animation-duration": this.config.animations.duration,
      "--theme-animation-easing": this.config.animations.easing,
      "--theme-shadow-brutal": this.config.shadows.brutal || "none",
      "--theme-shadow-subtle": this.config.shadows.subtle || "none",
      "--theme-shadow-double": this.config.shadows.double || "none",
      "--theme-shadow-triple": this.config.shadows.triple || "none",
      "--theme-shadow-elevated": this.config.shadows.elevated || "none",
      "--theme-shadow-glow": this.config.shadows.glow || "none",
    };
  }

  // Generate brutal button styles
  getBrutalButtonStyles(
    variant: "primary" | "secondary" | "ghost" = "primary"
  ): React.CSSProperties {
    const baseStyles: React.CSSProperties = {
      fontFamily: this.config.typography.primary,
      fontSize: this.config.typography.sizes.base,
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      border: `${this.config.borders.width} ${this.config.borders.style} ${this.config.colors.text}`,
      borderRadius: this.config.borders.radius || "0px",
      transition: `all ${this.config.animations.duration} ${this.config.animations.easing}`,
      cursor: "pointer",
      position: "relative",
      overflow: "hidden",
      userSelect: "none",
    };

    switch (variant) {
      case "primary":
        return {
          ...baseStyles,
          backgroundColor: this.config.colors.accent,
          color:
            this.theme === "extreme-brutalist"
              ? this.config.colors.primary
              : this.config.colors.bg,
          boxShadow: this.config.shadows.brutal || this.config.shadows.subtle,
        };

      case "secondary":
        return {
          ...baseStyles,
          backgroundColor: "transparent",
          color: this.config.colors.text,
          borderColor: this.config.colors.accent,
          boxShadow: this.config.shadows.subtle || "none",
        };

      case "ghost":
        return {
          ...baseStyles,
          backgroundColor: "transparent",
          color: this.config.colors.text,
          border: "none",
          boxShadow: "none",
        };

      default:
        return baseStyles;
    }
  }

  // Generate brutal card styles
  getBrutalCardStyles(): React.CSSProperties {
    return {
      backgroundColor: this.config.colors.bg,
      color: this.config.colors.text,
      border: `${this.config.borders.width} ${this.config.borders.style} ${this.config.colors.text}`,
      borderRadius: this.config.borders.radius || "0px",
      boxShadow: this.config.shadows.brutal || this.config.shadows.elevated,
      transition: `all ${this.config.animations.duration} ${this.config.animations.easing}`,
      position: "relative",
      overflow: "hidden",
    };
  }

  // Generate brutal input styles
  getBrutalInputStyles(): React.CSSProperties {
    return {
      fontFamily: this.config.typography.primary,
      fontSize: this.config.typography.sizes.base,
      backgroundColor: this.config.colors.bg,
      color: this.config.colors.text,
      border: `${this.config.borders.width} ${this.config.borders.style} ${this.config.colors.text}`,
      borderRadius: this.config.borders.radius || "0px",
      padding: this.theme === "extreme-brutalist" ? "12px 16px" : "16px 20px",
      transition: `all ${this.config.animations.duration} ${this.config.animations.easing}`,
      outline: "none",
    };
  }

  // Generate theme-aware hover effects
  getHoverEffects(
    element: "button" | "card" | "input" = "button"
  ): React.CSSProperties {
    const baseHover: React.CSSProperties = {
      transform:
        this.theme === "extreme-brutalist"
          ? "translate(-2px, -2px)"
          : "translateY(-2px)",
      transition: `all ${this.config.animations.duration} ${this.config.animations.easing}`,
    };

    switch (element) {
      case "button":
        return {
          ...baseHover,
          boxShadow:
            this.theme === "extreme-brutalist"
              ? this.config.shadows.double || this.config.shadows.brutal
              : this.config.shadows.glow || this.config.shadows.elevated,
        };

      case "card":
        return {
          ...baseHover,
          borderColor: this.config.colors.accent,
          boxShadow:
            this.theme === "extreme-brutalist"
              ? this.config.shadows.triple || this.config.shadows.double
              : this.config.shadows.glow || this.config.shadows.elevated,
        };

      case "input":
        return {
          borderColor: this.config.colors.accent,
          boxShadow:
            this.theme === "extreme-brutalist"
              ? `0 0 0 2px ${this.config.colors.accent}`
              : this.config.shadows.glow ||
                `0 0 0 2px ${this.config.colors.accent}`,
        };

      default:
        return baseHover;
    }
  }

  // Generate animation keyframes
  getAnimationKeyframes(
    animationType: "glitch" | "pulse" | "float" | "shake"
  ): string {
    switch (animationType) {
      case "glitch":
        return this.theme === "extreme-brutalist"
          ? `
            @keyframes brutalGlitch {
              0%, 100% { transform: translate(0); }
              10% { transform: translate(-2px, 2px); }
              20% { transform: translate(2px, -2px); }
              30% { transform: translate(-2px, -2px); }
              40% { transform: translate(2px, 2px); }
              50% { transform: translate(-2px, 2px); }
              60% { transform: translate(2px, -2px); }
              70% { transform: translate(-2px, -2px); }
              80% { transform: translate(2px, 2px); }
              90% { transform: translate(-2px, 2px); }
            }
          `
          : `
            @keyframes refinedGlitch {
              0%, 100% { transform: translate(0); opacity: 1; }
              25% { transform: translate(1px, -1px); opacity: 0.9; }
              50% { transform: translate(-1px, 1px); opacity: 0.8; }
              75% { transform: translate(1px, 1px); opacity: 0.9; }
            }
          `;

      case "pulse":
        return this.theme === "extreme-brutalist"
          ? `
            @keyframes brutalPulse {
              0%, 100% { 
                box-shadow: ${this.config.shadows.brutal || "8px 8px 0 #000"};
                transform: scale(1);
              }
              50% { 
                box-shadow: ${this.config.shadows.double || "12px 12px 0 #000, 16px 16px 0 #fff"};
                transform: scale(1.02);
              }
            }
          `
          : `
            @keyframes refinedPulse {
              0%, 100% { 
                box-shadow: ${this.config.shadows.subtle || "0 4px 12px rgba(0,0,0,0.1)"};
                transform: scale(1);
              }
              50% { 
                box-shadow: ${this.config.shadows.glow || "0 8px 24px rgba(139,92,246,0.3)"};
                transform: scale(1.01);
              }
            }
          `;

      case "float":
        return `
          @keyframes gentleFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
        `;

      case "shake":
        return this.theme === "extreme-brutalist"
          ? `
            @keyframes brutalShake {
              0%, 100% { transform: translateX(0); }
              10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
              20%, 40%, 60%, 80% { transform: translateX(4px); }
            }
          `
          : `
            @keyframes refinedShake {
              0%, 100% { transform: translateX(0); }
              25% { transform: translateX(-2px); }
              75% { transform: translateX(2px); }
            }
          `;

      default:
        return "";
    }
  }

  // Generate responsive styles
  getResponsiveStyles(
    mobile: React.CSSProperties,
    tablet?: React.CSSProperties,
    desktop?: React.CSSProperties
  ): string {
    return `
      /* Mobile styles */
      ${this.cssObjectToString(mobile)}
      
      /* Tablet styles */
      @media (min-width: 768px) {
        ${tablet ? this.cssObjectToString(tablet) : ""}
      }
      
      /* Desktop styles */
      @media (min-width: 1024px) {
        ${desktop ? this.cssObjectToString(desktop) : ""}
      }
    `;
  }

  // Helper method to convert CSS object to string
  private cssObjectToString(styles: React.CSSProperties): string {
    return Object.entries(styles)
      .map(([key, value]) => {
        const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
        return `${cssKey}: ${value};`;
      })
      .join(" ");
  }
}

// Factory function to create theme CSS utils
export const createThemeCSSUtils = (theme: ThemeType, config: ThemeConfig) => {
  return new ThemeCSSUtils(theme, config);
};

// Utility functions for common theme operations
export const themeUtils = {
  // Generate theme-aware class name
  getThemeClassName: (
    baseClass: string,
    theme: ThemeType,
    variants?: string[]
  ) => {
    const classes = [baseClass, `${baseClass}--${theme}`];
    if (variants) {
      classes.push(...variants);
    }
    return classes.join(" ");
  },

  // Interpolate between theme values during transitions
  interpolateThemeValue: (
    fromValue: string | number,
    toValue: string | number,
    progress: number
  ): string | number => {
    if (typeof fromValue === "number" && typeof toValue === "number") {
      return fromValue + (toValue - fromValue) * progress;
    }
    return progress > 0.5 ? toValue : fromValue;
  },

  // Generate theme-aware CSS custom properties
  generateCSSVariables: (config: ThemeConfig): Record<string, string> => {
    return {
      "--theme-primary": config.colors.primary,
      "--theme-secondary": config.colors.secondary,
      "--theme-accent": config.colors.accent,
      "--theme-highlight": config.colors.highlight,
      "--theme-success": config.colors.success,
      "--theme-bg": config.colors.bg,
      "--theme-text": config.colors.text,
      "--theme-font-primary": config.typography.primary,
      "--theme-font-code": config.typography.code,
      "--theme-border-width": config.borders.width,
      "--theme-border-style": config.borders.style,
      "--theme-border-radius": config.borders.radius || "0px",
      "--theme-animation-duration": config.animations.duration,
      "--theme-animation-easing": config.animations.easing,
    };
  },
};
