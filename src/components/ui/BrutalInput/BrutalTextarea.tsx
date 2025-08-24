"use client";

import React, { forwardRef, useState, useId, CSSProperties } from "react";
import { useTheme, useThemeClassName, useThemeStyles } from "@/hooks/useTheme";
import { ThemeType } from "@/types/theme";

export interface BrutalTextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  variant?: "default" | "outlined" | "filled" | "ghost";
  size?: "sm" | "md" | "lg";
  theme?: ThemeType;
  loading?: boolean;
  clearable?: boolean;
  showCharacterCount?: boolean;
  maxLength?: number;
  validationState?: "default" | "error" | "success" | "warning";
  autoResize?: boolean;
  minRows?: number;
  maxRows?: number;
  onClear?: () => void;
}

/**
 * BrutalTextarea - A theme-aware textarea component with validation states
 *
 * Features:
 * - Theme-aware styling (extreme-brutalist vs refined-brutalist)
 * - Multiple variants (default, outlined, filled, ghost)
 * - Size variations (sm, md, lg)
 * - Auto-resize functionality
 * - Real-time validation with visual feedback
 * - Character count and clearable functionality
 */
export const BrutalTextarea = forwardRef<
  HTMLTextAreaElement,
  BrutalTextareaProps
>(
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
      clearable = false,
      showCharacterCount = false,
      maxLength,
      validationState = "default",
      autoResize = false,
      minRows = 3,
      maxRows = 10,
      onClear,
      className = "",
      id,
      value,
      onChange,
      onFocus,
      onBlur,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const { currentTheme, config } = useTheme();
    const activeTheme = theme || currentTheme;
    const generatedId = useId();
    const textareaId = id || generatedId;

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
    const textareaClassName = useThemeClassName("brutal-textarea", {
      "extreme-brutalist": "brutal-textarea--extreme",
      "refined-brutalist": "brutal-textarea--refined",
    });

    // Theme-aware styles
    const textareaStyles = useThemeStyles(
      {},
      {
        "extreme-brutalist": {
          "--textarea-font": config.typography.primary,
          "--textarea-border-width": config.borders.width,
          "--textarea-border-radius": "0px",
          "--textarea-shadow": config.shadows.brutal,
          "--textarea-animation-duration": config.animations.duration,
          "--textarea-animation-easing": config.animations.easing,
        } as CSSProperties,
        "refined-brutalist": {
          "--textarea-font": config.typography.primary,
          "--textarea-border-width": config.borders.width,
          "--textarea-border-radius": config.borders.radius || "8px",
          "--textarea-shadow": config.shadows.subtle,
          "--textarea-animation-duration": config.animations.duration,
          "--textarea-animation-easing": config.animations.easing,
        } as CSSProperties,
      }
    );

    // Variant-specific styles
    const getVariantStyles = (): CSSProperties => {
      const baseStyles = {
        "--textarea-bg": config.colors.bg,
        "--textarea-text": config.colors.text,
        "--textarea-border": config.colors.text,
        "--textarea-accent": config.colors.accent,
        "--textarea-highlight": config.colors.highlight,
        "--textarea-placeholder": `${config.colors.text}80`, // 50% opacity
      } as CSSProperties;

      switch (variant) {
        case "default":
          return baseStyles;
        case "outlined":
          return {
            ...baseStyles,
            "--textarea-bg": "transparent",
          } as CSSProperties;
        case "filled":
          return {
            ...baseStyles,
            "--textarea-bg": `${config.colors.text}10`, // 10% opacity
          } as CSSProperties;
        case "ghost":
          return {
            ...baseStyles,
            "--textarea-bg": "transparent",
            "--textarea-border": "transparent",
            "--textarea-shadow": "none",
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
            "--textarea-padding": "0.5rem 0.75rem",
            "--textarea-font-size": config.typography.sizes.sm,
            "--textarea-min-height": "4rem",
          } as CSSProperties;
        case "md":
          return {
            "--textarea-padding": "0.75rem 1rem",
            "--textarea-font-size": config.typography.sizes.base,
            "--textarea-min-height": "6rem",
          } as CSSProperties;
        case "lg":
          return {
            "--textarea-padding": "1rem 1.25rem",
            "--textarea-font-size": config.typography.sizes.lg,
            "--textarea-min-height": "8rem",
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
            "--textarea-border": "#ef4444",
            "--textarea-accent": "#ef4444",
            "--textarea-glow": "rgba(239, 68, 68, 0.3)",
          } as CSSProperties;
        case "success":
          return {
            "--textarea-border": config.colors.success,
            "--textarea-accent": config.colors.success,
            "--textarea-glow": `${config.colors.successRgb}, 0.3)`,
          } as CSSProperties;
        case "warning":
          return {
            "--textarea-border": "#f59e0b",
            "--textarea-accent": "#f59e0b",
            "--textarea-glow": "rgba(245, 158, 11, 0.3)",
          } as CSSProperties;
        default:
          return {} as CSSProperties;
      }
    };

    // Auto-resize functionality
    const calculateRows = (text: string): number => {
      if (!autoResize) return rows;

      const lineCount = text.split("\n").length;
      const calculatedRows = Math.max(
        minRows,
        Math.min(maxRows, lineCount + 1)
      );
      return calculatedRows;
    };

    // Combined styles
    const combinedStyles: CSSProperties = {
      ...textareaStyles,
      ...getVariantStyles(),
      ...getSizeStyles(),
      ...getValidationStyles(),
    };

    // Handle textarea change
    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = event.target.value;
      setInternalValue(newValue);
      onChange?.(event);
    };

    // Handle focus
    const handleFocus = (event: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
      onFocus?.(event);
    };

    // Handle blur
    const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
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
      } as React.ChangeEvent<HTMLTextAreaElement>;
      onChange?.(syntheticEvent);
    };

    // Calculate character count
    const currentValue = value !== undefined ? value : internalValue;
    const characterCount = String(currentValue).length;
    const isOverLimit = maxLength ? characterCount > maxLength : false;

    // Calculate dynamic rows
    const dynamicRows = autoResize ? calculateRows(String(currentValue)) : rows;

    // Generate final class names
    const containerClassName = [
      "brutal-textarea-container",
      `brutal-textarea-container--${activeTheme}`,
      `brutal-textarea-container--${variant}`,
      `brutal-textarea-container--${size}`,
      `brutal-textarea-container--${currentValidationState}`,
      isFocused && "brutal-textarea-container--focused",
      loading && "brutal-textarea-container--loading",
      props.disabled && "brutal-textarea-container--disabled",
      autoResize && "brutal-textarea-container--auto-resize",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const finalTextareaClassName = [
      textareaClassName,
      `brutal-textarea--${variant}`,
      `brutal-textarea--${size}`,
      `brutal-textarea--${activeTheme}`,
      `brutal-textarea--${currentValidationState}`,
      clearable && currentValue && "brutal-textarea--clearable",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={containerClassName} style={combinedStyles}>
        {/* Label */}
        {label && (
          <label
            htmlFor={textareaId}
            className={`brutal-textarea__label brutal-textarea__label--${activeTheme} brutal-textarea__label--${currentValidationState}`}
          >
            {label}
            {props.required && (
              <span className="brutal-textarea__required" aria-label="required">
                *
              </span>
            )}
          </label>
        )}

        {/* Textarea Container */}
        <div className="brutal-textarea__wrapper">
          {/* Textarea Field */}
          <textarea
            ref={ref}
            id={textareaId}
            className={finalTextareaClassName}
            value={value !== undefined ? value : internalValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            rows={dynamicRows}
            maxLength={maxLength}
            aria-invalid={currentValidationState === "error"}
            aria-describedby={
              [
                error && `${textareaId}-error`,
                success && `${textareaId}-success`,
                hint && `${textareaId}-hint`,
                showCharacterCount && `${textareaId}-count`,
              ]
                .filter(Boolean)
                .join(" ") || undefined
            }
            {...props}
          />

          {/* Clear Button */}
          {clearable && currentValue && !loading && !props.disabled && (
            <button
              type="button"
              className="brutal-textarea__clear"
              onClick={handleClear}
              aria-label="Clear textarea"
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
            <div className="brutal-textarea__loading">
              <div className="brutal-textarea__spinner"></div>
            </div>
          )}

          {/* Effects Layer */}
          <div className="brutal-textarea__effects" aria-hidden="true">
            {/* Focus ring */}
            <div className="brutal-textarea__focus-ring"></div>

            {/* Glow effect for refined theme */}
            {activeTheme === "refined-brutalist" && (
              <div className="brutal-textarea__glow"></div>
            )}

            {/* Glitch effect for extreme theme */}
            {activeTheme === "extreme-brutalist" && (
              <div className="brutal-textarea__glitch"></div>
            )}

            {/* Scan lines for extreme theme */}
            {activeTheme === "extreme-brutalist" && (
              <div className="brutal-textarea__scan-lines"></div>
            )}
          </div>
        </div>

        {/* Helper Text Row */}
        <div className="brutal-textarea__helpers">
          {/* Error Message */}
          {error && (
            <div
              id={`${textareaId}-error`}
              className="brutal-textarea__message brutal-textarea__message--error"
              role="alert"
            >
              <svg
                className="brutal-textarea__message-icon"
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
              id={`${textareaId}-success`}
              className="brutal-textarea__message brutal-textarea__message--success"
            >
              <svg
                className="brutal-textarea__message-icon"
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
              id={`${textareaId}-hint`}
              className="brutal-textarea__message brutal-textarea__message--hint"
            >
              {hint}
            </div>
          )}

          {/* Character Count */}
          {showCharacterCount && (
            <div
              id={`${textareaId}-count`}
              className={`brutal-textarea__count ${
                isOverLimit ? "brutal-textarea__count--over-limit" : ""
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

BrutalTextarea.displayName = "BrutalTextarea";
