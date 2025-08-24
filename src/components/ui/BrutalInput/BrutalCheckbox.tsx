"use client";

import React, { forwardRef, useState, useId, CSSProperties } from "react";
import { useTheme, useThemeClassName, useThemeStyles } from "@/hooks/useTheme";
import { ThemeType } from "@/types/theme";

export interface BrutalCheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  label?: string;
  description?: string;
  error?: string;
  success?: string;
  variant?: "default" | "outlined" | "filled";
  size?: "sm" | "md" | "lg";
  theme?: ThemeType;
  loading?: boolean;
  indeterminate?: boolean;
  validationState?: "default" | "error" | "success" | "warning";
}

/**
 * BrutalCheckbox - A theme-aware checkbox component with validation states
 *
 * Features:
 * - Theme-aware styling (extreme-brutalist vs refined-brutalist)
 * - Multiple variants (default, outlined, filled)
 * - Size variations (sm, md, lg)
 * - Indeterminate state support
 * - Real-time validation with visual feedback
 * - Accessibility features with proper ARIA labels
 */
export const BrutalCheckbox = forwardRef<HTMLInputElement, BrutalCheckboxProps>(
  (
    {
      label,
      description,
      error,
      success,
      variant = "default",
      size = "md",
      theme,
      loading = false,
      indeterminate = false,
      validationState = "default",
      className = "",
      id,
      checked,
      onChange,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const { currentTheme, config } = useTheme();
    const activeTheme = theme || currentTheme;
    const generatedId = useId();
    const checkboxId = id || generatedId;

    const [isFocused, setIsFocused] = useState(false);
    const [internalChecked, setInternalChecked] = useState(checked || false);

    // Determine validation state based on props
    const getValidationState = () => {
      if (error) return "error";
      if (success) return "success";
      return validationState;
    };

    const currentValidationState = getValidationState();

    // Generate theme-aware class names
    const checkboxClassName = useThemeClassName("brutal-checkbox", {
      "extreme-brutalist": "brutal-checkbox--extreme",
      "refined-brutalist": "brutal-checkbox--refined",
    });

    // Theme-aware styles
    const checkboxStyles = useThemeStyles(
      {},
      {
        "extreme-brutalist": {
          "--checkbox-font": config.typography.primary,
          "--checkbox-border-width": config.borders.width,
          "--checkbox-border-radius": "0px",
          "--checkbox-shadow": config.shadows.brutal,
          "--checkbox-animation-duration": config.animations.duration,
          "--checkbox-animation-easing": config.animations.easing,
        } as CSSProperties,
        "refined-brutalist": {
          "--checkbox-font": config.typography.primary,
          "--checkbox-border-width": config.borders.width,
          "--checkbox-border-radius": config.borders.radius || "4px",
          "--checkbox-shadow": config.shadows.subtle,
          "--checkbox-animation-duration": config.animations.duration,
          "--checkbox-animation-easing": config.animations.easing,
        } as CSSProperties,
      }
    );

    // Variant-specific styles
    const getVariantStyles = (): CSSProperties => {
      const baseStyles = {
        "--checkbox-bg": config.colors.bg,
        "--checkbox-text": config.colors.text,
        "--checkbox-border": config.colors.text,
        "--checkbox-accent": config.colors.accent,
        "--checkbox-highlight": config.colors.highlight,
        "--checkbox-check": config.colors.bg,
      } as CSSProperties;

      switch (variant) {
        case "default":
          return baseStyles;
        case "outlined":
          return {
            ...baseStyles,
            "--checkbox-bg": "transparent",
          } as CSSProperties;
        case "filled":
          return {
            ...baseStyles,
            "--checkbox-bg": `${config.colors.text}10`, // 10% opacity
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
            "--checkbox-size": "1rem",
            "--checkbox-font-size": config.typography.sizes.sm,
            "--checkbox-gap": "0.5rem",
            "--checkbox-check-size": "0.5rem",
          } as CSSProperties;
        case "md":
          return {
            "--checkbox-size": "1.25rem",
            "--checkbox-font-size": config.typography.sizes.base,
            "--checkbox-gap": "0.75rem",
            "--checkbox-check-size": "0.625rem",
          } as CSSProperties;
        case "lg":
          return {
            "--checkbox-size": "1.5rem",
            "--checkbox-font-size": config.typography.sizes.lg,
            "--checkbox-gap": "1rem",
            "--checkbox-check-size": "0.75rem",
          } as CSSProperties;
        default:
          return {} as CSSProperties;
      }
    };

    // Validation state styles
    const getValidationStyles = (): CSSProperties => {
      switch (currentValidationState) {
        case "error":
          return {
            "--checkbox-border": "#ef4444",
            "--checkbox-accent": "#ef4444",
            "--checkbox-glow": "rgba(239, 68, 68, 0.3)",
          } as CSSProperties;
        case "success":
          return {
            "--checkbox-border": config.colors.success,
            "--checkbox-accent": config.colors.success,
            "--checkbox-glow": `${config.colors.successRgb}, 0.3)`,
          } as CSSProperties;
        case "warning":
          return {
            "--checkbox-border": "#f59e0b",
            "--checkbox-accent": "#f59e0b",
            "--checkbox-glow": "rgba(245, 158, 11, 0.3)",
          } as CSSProperties;
        default:
          return {} as CSSProperties;
      }
    };

    // Combined styles
    const combinedStyles: CSSProperties = {
      ...checkboxStyles,
      ...getVariantStyles(),
      ...getSizeStyles(),
      ...getValidationStyles(),
    };

    // Handle checkbox change
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = event.target.checked;
      setInternalChecked(newChecked);
      onChange?.(event);
    };

    // Handle focus
    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(event);
    };

    // Handle blur
    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(event);
    };

    // Determine current checked state
    const isChecked = checked !== undefined ? checked : internalChecked;

    // Generate final class names
    const containerClassName = [
      "brutal-checkbox-container",
      `brutal-checkbox-container--${activeTheme}`,
      `brutal-checkbox-container--${variant}`,
      `brutal-checkbox-container--${size}`,
      `brutal-checkbox-container--${currentValidationState}`,
      isFocused && "brutal-checkbox-container--focused",
      isChecked && "brutal-checkbox-container--checked",
      indeterminate && "brutal-checkbox-container--indeterminate",
      loading && "brutal-checkbox-container--loading",
      props.disabled && "brutal-checkbox-container--disabled",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const finalCheckboxClassName = [
      checkboxClassName,
      `brutal-checkbox--${variant}`,
      `brutal-checkbox--${size}`,
      `brutal-checkbox--${activeTheme}`,
      `brutal-checkbox--${currentValidationState}`,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={containerClassName} style={combinedStyles}>
        <div className="brutal-checkbox__wrapper">
          {/* Hidden Native Checkbox */}
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className="brutal-checkbox__input"
            checked={isChecked}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-invalid={currentValidationState === "error"}
            aria-describedby={
              [
                error && `${checkboxId}-error`,
                success && `${checkboxId}-success`,
                description && `${checkboxId}-description`,
              ]
                .filter(Boolean)
                .join(" ") || undefined
            }
            {...props}
          />

          {/* Custom Checkbox Visual */}
          <div className={finalCheckboxClassName}>
            {/* Checkbox Box */}
            <div className="brutal-checkbox__box">
              {/* Check Mark */}
              {isChecked && !indeterminate && (
                <svg
                  className="brutal-checkbox__check"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20,6 9,17 4,12"></polyline>
                </svg>
              )}

              {/* Indeterminate Mark */}
              {indeterminate && (
                <div className="brutal-checkbox__indeterminate">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </div>
              )}

              {/* Loading Spinner */}
              {loading && (
                <div className="brutal-checkbox__loading">
                  <div className="brutal-checkbox__spinner"></div>
                </div>
              )}
            </div>

            {/* Effects Layer */}
            <div className="brutal-checkbox__effects" aria-hidden="true">
              {/* Focus ring */}
              <div className="brutal-checkbox__focus-ring"></div>

              {/* Glow effect for refined theme */}
              {activeTheme === "refined-brutalist" && (
                <div className="brutal-checkbox__glow"></div>
              )}

              {/* Glitch effect for extreme theme */}
              {activeTheme === "extreme-brutalist" && (
                <div className="brutal-checkbox__glitch"></div>
              )}
            </div>
          </div>

          {/* Label and Description */}
          {(label || description) && (
            <div className="brutal-checkbox__content">
              {label && (
                <label
                  htmlFor={checkboxId}
                  className={`brutal-checkbox__label brutal-checkbox__label--${activeTheme} brutal-checkbox__label--${currentValidationState}`}
                >
                  {label}
                  {props.required && (
                    <span
                      className="brutal-checkbox__required"
                      aria-label="required"
                    >
                      *
                    </span>
                  )}
                </label>
              )}

              {description && (
                <div
                  id={`${checkboxId}-description`}
                  className="brutal-checkbox__description"
                >
                  {description}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Helper Messages */}
        <div className="brutal-checkbox__helpers">
          {/* Error Message */}
          {error && (
            <div
              id={`${checkboxId}-error`}
              className="brutal-checkbox__message brutal-checkbox__message--error"
              role="alert"
            >
              <svg
                className="brutal-checkbox__message-icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && !error && (
            <div
              id={`${checkboxId}-success`}
              className="brutal-checkbox__message brutal-checkbox__message--success"
            >
              <svg
                className="brutal-checkbox__message-icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 12 2 2 4-4"></path>
                <circle cx="12" cy="12" r="10"></circle>
              </svg>
              {success}
            </div>
          )}
        </div>
      </div>
    );
  }
);

BrutalCheckbox.displayName = "BrutalCheckbox";
