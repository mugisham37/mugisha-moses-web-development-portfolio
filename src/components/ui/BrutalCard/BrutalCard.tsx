"use client";

import React, { forwardRef, CSSProperties } from "react";
import { useTheme, useThemeClassName, useThemeStyles } from "@/hooks/useTheme";
import { ThemeType } from "@/types/theme";

export interface BrutalCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "flat" | "outlined";
  size?: "sm" | "md" | "lg" | "xl";
  theme?: ThemeType;
  interactive?: boolean;
  clipPath?: "none" | "corner" | "diagonal" | "hexagon" | "arrow";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  as?: "div" | "article" | "section" | "aside" | "main";
}

/**
 * BrutalCard - A theme-aware card component with layered effects
 *
 * Features:
 * - Theme-aware styling (extreme-brutalist vs refined-brutalist)
 * - Multiple variants (default, elevated, flat, outlined)
 * - Size variations (sm, md, lg, xl)
 * - Interactive hover effects with elevation and border animations
 * - Geometric clip-path styling for brutalist shapes
 * - Responsive behavior and accessibility features
 */
export const BrutalCard = forwardRef<HTMLDivElement, BrutalCardProps>(
  (
    {
      children,
      variant = "default",
      size = "md",
      theme,
      interactive = false,
      clipPath = "none",
      padding = "md",
      className = "",
      as = "div",
      onClick,
      onKeyDown,
      tabIndex,
      role,
      ...props
    },
    ref
  ) => {
    const { currentTheme, config } = useTheme();
    const activeTheme = theme || currentTheme;

    // Generate theme-aware class names
    const cardClassName = useThemeClassName("brutal-card", {
      "extreme-brutalist": "brutal-card--extreme",
      "refined-brutalist": "brutal-card--refined",
    });

    // Theme-aware styles
    const cardStyles = useThemeStyles(
      {},
      {
        "extreme-brutalist": {
          "--card-font": config.typography.primary,
          "--card-border-width": config.borders.width,
          "--card-border-radius": "0px",
          "--card-shadow": config.shadows.brutal,
          "--card-shadow-double": config.shadows.double,
          "--card-shadow-triple": config.shadows.triple,
          "--card-animation-duration": config.animations.duration,
          "--card-animation-easing": config.animations.easing,
        } as CSSProperties,
        "refined-brutalist": {
          "--card-font": config.typography.primary,
          "--card-border-width": config.borders.width,
          "--card-border-radius": config.borders.radius || "8px",
          "--card-shadow": config.shadows.subtle,
          "--card-shadow-elevated": config.shadows.elevated,
          "--card-shadow-glow": config.shadows.glow,
          "--card-animation-duration": config.animations.duration,
          "--card-animation-easing": config.animations.easing,
        } as CSSProperties,
      }
    );

    // Variant-specific styles
    const getVariantStyles = (): CSSProperties => {
      const baseStyles = {
        "--card-bg": config.colors.bg,
        "--card-text": config.colors.text,
        "--card-border": config.colors.text,
        "--card-accent": config.colors.accent,
        "--card-highlight": config.colors.highlight,
      } as CSSProperties;

      switch (variant) {
        case "default":
          return {
            ...baseStyles,
            "--card-shadow-active":
              activeTheme === "extreme-brutalist"
                ? config.shadows.brutal
                : config.shadows.subtle,
          } as CSSProperties;
        case "elevated":
          return {
            ...baseStyles,
            "--card-shadow-active":
              activeTheme === "extreme-brutalist"
                ? config.shadows.double
                : config.shadows.elevated,
          } as CSSProperties;
        case "flat":
          return {
            ...baseStyles,
            "--card-shadow-active": "none",
          } as CSSProperties;
        case "outlined":
          return {
            ...baseStyles,
            "--card-bg": "transparent",
            "--card-shadow-active": "none",
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
            "--card-min-height": "8rem",
            "--card-max-width": "20rem",
          } as CSSProperties;
        case "md":
          return {
            "--card-min-height": "12rem",
            "--card-max-width": "24rem",
          } as CSSProperties;
        case "lg":
          return {
            "--card-min-height": "16rem",
            "--card-max-width": "32rem",
          } as CSSProperties;
        case "xl":
          return {
            "--card-min-height": "20rem",
            "--card-max-width": "40rem",
          } as CSSProperties;
        default:
          return {} as CSSProperties;
      }
    };

    // Padding styles
    const getPaddingStyles = (): CSSProperties => {
      switch (padding) {
        case "none":
          return { "--card-padding": "0" } as CSSProperties;
        case "sm":
          return { "--card-padding": "0.75rem" } as CSSProperties;
        case "md":
          return { "--card-padding": "1.5rem" } as CSSProperties;
        case "lg":
          return { "--card-padding": "2rem" } as CSSProperties;
        case "xl":
          return { "--card-padding": "3rem" } as CSSProperties;
        default:
          return { "--card-padding": "1.5rem" } as CSSProperties;
      }
    };

    // Clip-path styles
    const getClipPathStyles = (): CSSProperties => {
      switch (clipPath) {
        case "corner":
          return {
            "--card-clip-path":
              "polygon(0 0, calc(100% - 1rem) 0, 100% 1rem, 100% 100%, 0 100%)",
          } as CSSProperties;
        case "diagonal":
          return {
            "--card-clip-path":
              "polygon(0 0, calc(100% - 2rem) 0, 100% 100%, 2rem 100%)",
          } as CSSProperties;
        case "hexagon":
          return {
            "--card-clip-path":
              "polygon(0 25%, 0 75%, 25% 100%, 75% 100%, 100% 75%, 100% 25%, 75% 0, 25% 0)",
          } as CSSProperties;
        case "arrow":
          return {
            "--card-clip-path":
              "polygon(0 0, calc(100% - 2rem) 0, 100% 50%, calc(100% - 2rem) 100%, 0 100%)",
          } as CSSProperties;
        case "none":
        default:
          return { "--card-clip-path": "none" } as CSSProperties;
      }
    };

    // Combined styles
    const combinedStyles: CSSProperties = {
      ...cardStyles,
      ...getVariantStyles(),
      ...getSizeStyles(),
      ...getPaddingStyles(),
      ...getClipPathStyles(),
      ...props.style,
    };

    // Handle keyboard interaction for interactive cards
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (interactive && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        onClick?.(event as any);
      }
      onKeyDown?.(event);
    };

    // Generate final class names
    const finalClassName = [
      cardClassName,
      `brutal-card--${variant}`,
      `brutal-card--${size}`,
      `brutal-card--${activeTheme}`,
      `brutal-card--padding-${padding}`,
      `brutal-card--clip-${clipPath}`,
      interactive && "brutal-card--interactive",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    // Interactive props
    const interactiveProps = interactive
      ? {
          onClick,
          onKeyDown: handleKeyDown,
          tabIndex: tabIndex ?? 0,
          role: role ?? (onClick ? "button" : "article"),
        }
      : {
          onClick,
          onKeyDown: handleKeyDown,
          tabIndex,
          role,
        };

    // Create the component based on the 'as' prop
    const Component = as;

    return (
      <Component
        ref={ref}
        className={finalClassName}
        style={combinedStyles}
        {...interactiveProps}
        {...props}
      >
        <div className="brutal-card__content">{children}</div>

        {/* Complex layered effects */}
        <div className="brutal-card__effects" aria-hidden="true">
          {/* Base shadow layer */}
          <div className="brutal-card__shadow"></div>

          {/* Border animation layer */}
          <div className="brutal-card__border-animation"></div>

          {/* Elevation effect */}
          <div className="brutal-card__elevation"></div>

          {/* Glow effect for refined theme */}
          {activeTheme === "refined-brutalist" && (
            <div className="brutal-card__glow"></div>
          )}

          {/* Glitch effect for extreme theme */}
          {activeTheme === "extreme-brutalist" && (
            <div className="brutal-card__glitch"></div>
          )}

          {/* Scan lines for extreme theme */}
          {activeTheme === "extreme-brutalist" && (
            <div className="brutal-card__scan-lines"></div>
          )}
        </div>

        {/* Accessibility enhancements */}
        {interactive && (
          <span className="sr-only">
            {onClick
              ? "Interactive card - press Enter or Space to activate"
              : ""}
          </span>
        )}
      </Component>
    );
  }
);

BrutalCard.displayName = "BrutalCard";
