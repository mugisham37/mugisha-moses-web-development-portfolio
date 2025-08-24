"use client";

import React, { forwardRef, CSSProperties } from "react";
import { useTheme, useThemeClassName, useThemeStyles } from "@/hooks/useTheme";
import { ThemeType } from "@/types/theme";

export interface BrutalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  theme?: ThemeType;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

/**
 * BrutalButton - A theme-aware button component with complex animations
 *
 * Features:
 * - Theme-aware styling (extreme-brutalist vs refined-brutalist)
 * - Multiple variants (primary, secondary, ghost)
 * - Size variations (sm, md, lg)
 * - Complex hover effects (shimmer, glow, strike animations)
 * - Loading states and accessibility features
 */
export const BrutalButton = forwardRef<HTMLButtonElement, BrutalButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      theme,
      loading = false,
      disabled = false,
      fullWidth = false,
      className = "",
      onClick,
      ...props
    },
    ref
  ) => {
    const { currentTheme, config } = useTheme();
    const activeTheme = theme || currentTheme;

    // Generate theme-aware class names
    const buttonClassName = useThemeClassName("brutal-button", {
      "extreme-brutalist": "brutal-button--extreme",
      "refined-brutalist": "brutal-button--refined",
    });

    // Theme-aware styles
    const buttonStyles = useThemeStyles(
      {},
      {
        "extreme-brutalist": {
          "--button-font": config.typography.primary,
          "--button-border-width": config.borders.width,
          "--button-border-radius": "0px",
          "--button-shadow": config.shadows.brutal,
          "--button-animation-duration": config.animations.duration,
          "--button-animation-easing": config.animations.easing,
        } as CSSProperties,
        "refined-brutalist": {
          "--button-font": config.typography.primary,
          "--button-border-width": config.borders.width,
          "--button-border-radius": config.borders.radius || "8px",
          "--button-shadow": config.shadows.subtle,
          "--button-animation-duration": config.animations.duration,
          "--button-animation-easing": config.animations.easing,
        } as CSSProperties,
      }
    );

    // Variant-specific styles
    const getVariantStyles = (): CSSProperties => {
      const baseStyles = {
        "--button-bg": "transparent",
        "--button-text": config.colors.text,
        "--button-border": config.colors.text,
        "--button-accent": config.colors.accent,
        "--button-highlight": config.colors.highlight,
      } as CSSProperties;

      switch (variant) {
        case "primary":
          return {
            ...baseStyles,
            "--button-bg": config.colors.accent,
            "--button-text": config.colors.bg,
            "--button-border": config.colors.accent,
          } as CSSProperties;
        case "secondary":
          return {
            ...baseStyles,
            "--button-bg": config.colors.bg,
            "--button-text": config.colors.text,
            "--button-border": config.colors.text,
          } as CSSProperties;
        case "ghost":
          return {
            ...baseStyles,
            "--button-bg": "transparent",
            "--button-text": config.colors.text,
            "--button-border": config.colors.text,
          } as CSSProperties;
        default:
          return baseStyles;
      }
    };

    // Size-specific styles
    const getSizeStyles = (): CSSProperties => {
      switch (size) {
        case "sm":
          return {
            "--button-padding": "0.5rem 1rem",
            "--button-font-size": config.typography.sizes.sm,
            "--button-height": "2.5rem",
            "--button-min-width": "4rem",
          } as CSSProperties;
        case "md":
          return {
            "--button-padding": "0.75rem 1.5rem",
            "--button-font-size": config.typography.sizes.base,
            "--button-height": "3rem",
            "--button-min-width": "6rem",
          } as CSSProperties;
        case "lg":
          return {
            "--button-padding": "1rem 2rem",
            "--button-font-size": config.typography.sizes.lg,
            "--button-height": "3.5rem",
            "--button-min-width": "8rem",
          } as CSSProperties;
        default:
          return {} as CSSProperties;
      }
    };

    // Combined styles
    const combinedStyles: CSSProperties = {
      ...buttonStyles,
      ...getVariantStyles(),
      ...getSizeStyles(),
      ...(fullWidth && { width: "100%" }),
    };

    // Handle click with loading state
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (loading || disabled) return;
      onClick?.(event);
    };

    // Generate final class names
    const finalClassName = [
      buttonClassName,
      `brutal-button--${variant}`,
      `brutal-button--${size}`,
      `brutal-button--${activeTheme}`,
      loading && "brutal-button--loading",
      disabled && "brutal-button--disabled",
      fullWidth && "brutal-button--full-width",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        className={finalClassName}
        style={combinedStyles}
        onClick={handleClick}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        <span className="brutal-button__content">
          {loading && (
            <span className="brutal-button__spinner" aria-hidden="true">
              <span className="brutal-button__spinner-inner"></span>
            </span>
          )}
          <span
            className={`brutal-button__text ${loading ? "brutal-button__text--loading" : ""}`}
          >
            {children}
          </span>
        </span>

        {/* Complex layered effects */}
        <div className="brutal-button__effects" aria-hidden="true">
          {/* Base shadow layer */}
          <div className="brutal-button__shadow"></div>

          {/* Border animation layer */}
          <div className="brutal-button__border-animation"></div>

          {/* Shimmer effect */}
          <div className="brutal-button__shimmer"></div>

          {/* Strike animation */}
          <div className="brutal-button__strike"></div>

          {/* Glow effect for refined theme */}
          {activeTheme === "refined-brutalist" && (
            <div className="brutal-button__glow"></div>
          )}

          {/* Glitch effect for extreme theme */}
          {activeTheme === "extreme-brutalist" && (
            <div className="brutal-button__glitch"></div>
          )}
        </div>

        {/* Accessibility enhancements */}
        <span className="sr-only">
          {loading && "Loading, please wait"}
          {disabled && "Button is disabled"}
        </span>
      </button>
    );
  }
);

BrutalButton.displayName = "BrutalButton";
