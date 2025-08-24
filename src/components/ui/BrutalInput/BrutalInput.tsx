"use client";

import React, { forwardRef, useState, useId, CSSProperties } from "react";
import { useTheme, useThemeClassName, useThemeStyles } from "@/hooks/useTheme";
import { ThemeType } from "@/types/theme";

export interface BrutalInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  variant?: "default" | "outlined" | "filled" | "ghost";
  size?: "sm" | "md" | "lg";
  theme?: ThemeType;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  clearable?: boolean;
  showCharacterCount?: boolean;
  maxLength?: number;
  validationState?: "default" | "error" | "success" | "warning";
  onClear?: () => void;
}

/**
 * BrutalInput - A theme-aware input component with validation states
 *
 * Features:
 * - Theme-aware styling (extreme-brutalist vs refined-brutalist)
 * - Multiple variants (default, outlined, filled, ghost)
 * - Size variations (sm, md, lg)
 * - Real-time validation with visual feedback
 * - Focus effects and accessibility features
 * - Character count and clearable functionality
 * - Icon support with positioning options
 */
export const BrutalInput = forwardRef<HTMLInputElement, BrutalInputProps>(
  (
    {
      label,
      error,
      success,
      hint,
      variant = "default",
      size = "md",
      theme,
      loading = false,
      icon,
      iconPosition = "left",
      clearable = false,
      showCharacterCount = false,
      maxLength,
      validationState = "default",
      onClear,
      className = "",
      id,
      value,
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
    const inputId = id || generatedId;

    const [isFocused, setIsFocused] = useState(false);
    const [internalValue, setInternalValue] = useState(value || "");

    // Determine validation state based on props
    const getValidationState = () => {
      if (error) return "error";
      if (success) return "success";
      return validationState;
    };

    const currentValidationState = getValidationState();

    // Generate theme-aware class names
    const inputClassName = useThemeClassName("brutal-input", {
      "extreme-brutalist": "brutal-input--extreme",
      "refined-brutalist": "brutal-input--refined",
    });

    // Theme-aware styles
    const inputStyles = useThemeStyles(
      {},
      {
        "extreme-brutalist": {
          "--input-font": config.typography.primary,
          "--input-border-width": config.borders.width,
          "--input-border-radius": "0px",
          "--input-shadow": config.shadows.brutal,
          "--input-animation-duration": config.animations.duration,
          "--input-animation-easing": config.animations.easing,
        } as CSSProperties,
        "refined-brutalist": {
          "--input-font": config.typography.primary,
          "--input-border-width": config.borders.width,
          "--input-border-radius": config.borders.radius || "8px",
          "--input-shadow": config.shadows.subtle,
          "--input-animation-duration": config.animations.duration,
          "--input-animation-easing": config.animations.easing,
        } as CSSProperties,
      }
    );

    // Variant-specific styles
    const getVariantStyles = (): CSSProperties => {
      const baseStyles = {
        "--input-bg": config.colors.bg,
        "--input-text": config.colors.text,
        "--input-border": config.colors.text,
        "--input-accent": config.colors.accent,
        "--input-highlight": config.colors.highlight,
        "--input-placeholder": `${config.colors.text}80`, // 50% opacity
      } as CSSProperties;

      switch (variant) {
        case "default":
          return baseStyles;
        case "outlined":
          return {
            ...baseStyles,
            "--input-bg": "transparent",
          } as CSSProperties;
        case "filled":
          return {
            ...baseStyles,
            "--input-bg": `${config.colors.text}10`, // 10% opacity
          } as CSSProperties;
        case "ghost":
          return {
            ...baseStyles,
            "--input-bg": "transparent",
            "--input-border": "transparent",
            "--input-shadow": "none",
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
            "--input-padding": "0.5rem 0.75rem",
            "--input-font-size": config.typography.sizes.sm,
            "--input-height": "2.5rem",
            "--input-icon-size": "1rem",
          } as CSSProperties;
        case "md":
          return {
            "--input-padding": "0.75rem 1rem",
            "--input-font-size": config.typography.sizes.base,
            "--input-height": "3rem",
            "--input-icon-size": "1.25rem",
          } as CSSProperties;
        case "lg":
          return {
            "--input-padding": "1rem 1.25rem",
            "--input-font-size": config.typography.sizes.lg,
            "--input-height": "3.5rem",
            "--input-icon-size": "1.5rem",
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
            "--input-border": "#ef4444",
            "--input-accent": "#ef4444",
            "--input-glow": "rgba(239, 68, 68, 0.3)",
          } as CSSProperties;
        case "success":
          return {
            "--input-border": config.colors.success,
            "--input-accent": config.colors.success,
            "--input-glow": `${config.colors.successRgb}, 0.3)`,
          } as CSSProperties;
        case "warning":
          return {
            "--input-border": "#f59e0b",
            "--input-accent": "#f59e0b",
            "--input-glow": "rgba(245, 158, 11, 0.3)",
          } as CSSProperties;
        default:
          return {} as CSSProperties;
      }
    };

    // Combined styles
    const combinedStyles: CSSProperties = {
      ...inputStyles,
      ...getVariantStyles(),
      ...getSizeStyles(),
      ...getValidationStyles(),
    };

    // Handle input change
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setInternalValue(newValue);
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

    // Handle clear
    const handleClear = () => {
      setInternalValue("");
      onClear?.();
      // Create synthetic event for onChange
      const syntheticEvent = {
        target: { value: "" },
        currentTarget: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange?.(syntheticEvent);
    };

    // Calculate character count
    const currentValue = value !== undefined ? value : internalValue;
    const characterCount = String(currentValue).length;
    const isOverLimit = maxLength ? characterCount > maxLength : false;

    // Generate final class names
    const containerClassName = [
      "brutal-input-container",
      `brutal-input-container--${activeTheme}`,
      `brutal-input-container--${variant}`,
      `brutal-input-container--${size}`,
      `brutal-input-container--${currentValidationState}`,
      isFocused && "brutal-input-container--focused",
      loading && "brutal-input-container--loading",
      props.disabled && "brutal-input-container--disabled",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const finalInputClassName = [
      inputClassName,
      `brutal-input--${variant}`,
      `brutal-input--${size}`,
      `brutal-input--${activeTheme}`,
      `brutal-input--${currentValidationState}`,
      icon && `brutal-input--with-icon-${iconPosition}`,
      clearable && currentValue && "brutal-input--clearable",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={containerClassName} style={combinedStyles}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={`brutal-input__label brutal-input__label--${activeTheme} brutal-input__label--${currentValidationState}`}
          >
            {label}
            {props.required && (
              <span className="brutal-input__required" aria-label="required">
                *
              </span>
            )}
          </label>
        )}

        {/* Input Container */}
        <div className="brutal-input__wrapper">
          {/* Left Icon */}
          {icon && iconPosition === "left" && (
            <div className="brutal-input__icon brutal-input__icon--left">
              {icon}
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            id={inputId}
            className={finalInputClassName}
            value={value !== undefined ? value : internalValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            maxLength={maxLength}
            aria-invalid={currentValidationState === "error"}
            aria-describedby={
              [
                error && `${inputId}-error`,
                success && `${inputId}-success`,
                hint && `${inputId}-hint`,
                showCharacterCount && `${inputId}-count`,
              ]
                .filter(Boolean)
                .join(" ") || undefined
            }
            {...props}
          />

          {/* Right Icon */}
          {icon && iconPosition === "right" && (
            <div className="brutal-input__icon brutal-input__icon--right">
              {icon}
            </div>
          )}

          {/* Clear Button */}
          {clearable && currentValue && !loading && !props.disabled && (
            <button
              type="button"
              className="brutal-input__clear"
              onClick={handleClear}
              aria-label="Clear input"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}

          {/* Loading Spinner */}
          {loading && (
            <div className="brutal-input__loading">
              <div className="brutal-input__spinner"></div>
            </div>
          )}

          {/* Effects Layer */}
          <div className="brutal-input__effects" aria-hidden="true">
            {/* Focus ring */}
            <div className="brutal-input__focus-ring"></div>

            {/* Glow effect for refined theme */}
            {activeTheme === "refined-brutalist" && (
              <div className="brutal-input__glow"></div>
            )}

            {/* Glitch effect for extreme theme */}
            {activeTheme === "extreme-brutalist" && (
              <div className="brutal-input__glitch"></div>
            )}

            {/* Scan lines for extreme theme */}
            {activeTheme === "extreme-brutalist" && (
              <div className="brutal-input__scan-lines"></div>
            )}
          </div>
        </div>

        {/* Helper Text Row */}
        <div className="brutal-input__helpers">
          {/* Error Message */}
          {error && (
            <div
              id={`${inputId}-error`}
              className="brutal-input__message brutal-input__message--error"
              role="alert"
            >
              <svg
                className="brutal-input__message-icon"
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
              id={`${inputId}-success`}
              className="brutal-input__message brutal-input__message--success"
            >
              <svg
                className="brutal-input__message-icon"
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

          {/* Hint */}
          {hint && !error && !success && (
            <div
              id={`${inputId}-hint`}
              className="brutal-input__message brutal-input__message--hint"
            >
              {hint}
            </div>
          )}

          {/* Character Count */}
          {showCharacterCount && (
            <div
              id={`${inputId}-count`}
              className={`brutal-input__count ${
                isOverLimit ? "brutal-input__count--over-limit" : ""
              }`}
            >
              {characterCount}
              {maxLength && `/${maxLength}`}
            </div>
          )}
        </div>
      </div>
    );
  }
);

BrutalInput.displayName = "BrutalInput";
