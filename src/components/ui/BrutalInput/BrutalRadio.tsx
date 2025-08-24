"use client";

import React, { forwardRef, useState, useId, CSSProperties } from "react";
import { useTheme, useThemeClassName, useThemeStyles } from "@/hooks/useTheme";
import { ThemeType } from "@/types/theme";

export interface BrutalRadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface BrutalRadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  options: BrutalRadioOption[];
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  variant?: "default" | "outlined" | "filled";
  size?: "sm" | "md" | "lg";
  theme?: ThemeType;
  loading?: boolean;
  validationState?: "default" | "error" | "success" | "warning";
  orientation?: "vertical" | "horizontal";
  spacing?: "compact" | "comfortable" | "spacious";
}

/**
 * BrutalRadio - A theme-aware radio group component with validation states
 *
 * Features:
 * - Theme-aware styling (extreme-brutalist vs refined-brutalist)
 * - Multiple variants (default, outlined, filled)
 * - Size variations (sm, md, lg)
 * - Horizontal and vertical orientations
 * - Real-time validation with visual feedback
 * - Accessibility features with proper ARIA labels and keyboard navigation
 */
export const BrutalRadio = forwardRef<HTMLInputElement, BrutalRadioProps>(
  (
    {
      options = [],
      label,
      error,
      success,
      hint,
      variant = "default",
      size = "md",
      theme,
      loading = false,
      validationState = "default",
      orientation = "vertical",
      spacing = "comfortable",
      className = "",
      id,
      name,
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
    const radioGroupId = id || generatedId;
    const radioName = name || `radio-group-${generatedId}`;

    const [focusedValue, setFocusedValue] = useState<string | null>(null);
    const [internalValue, setInternalValue] = useState(value || "");

    // Determine validation state based on props
    const getValidationState = () => {
      if (error) return "error";
      if (success) return "success";
      return validationState;
    };

    const currentValidationState = getValidationState();

    // Generate theme-aware class names
    const radioClassName = useThemeClassName("brutal-radio", {
      "extreme-brutalist": "brutal-radio--extreme",
      "refined-brutalist": "brutal-radio--refined",
    });

    // Theme-aware styles
    const radioStyles = useThemeStyles(
      {},
      {
        "extreme-brutalist": {
          "--radio-font": config.typography.primary,
          "--radio-border-width": config.borders.width,
          "--radio-border-radius": "50%",
          "--radio-shadow": config.shadows.brutal,
          "--radio-animation-duration": config.animations.duration,
          "--radio-animation-easing": config.animations.easing,
        } as CSSProperties,
        "refined-brutalist": {
          "--radio-font": config.typography.primary,
          "--radio-border-width": config.borders.width,
          "--radio-border-radius": "50%",
          "--radio-shadow": config.shadows.subtle,
          "--radio-animation-duration": config.animations.duration,
          "--radio-animation-easing": config.animations.easing,
        } as CSSProperties,
      }
    );

    // Variant-specific styles
    const getVariantStyles = (): CSSProperties => {
      const baseStyles = {
        "--radio-bg": config.colors.bg,
        "--radio-text": config.colors.text,
        "--radio-border": config.colors.text,
        "--radio-accent": config.colors.accent,
        "--radio-highlight": config.colors.highlight,
        "--radio-dot": config.colors.accent,
      } as CSSProperties;

      switch (variant) {
        case "default":
          return baseStyles;
        case "outlined":
          return {
            ...baseStyles,
            "--radio-bg": "transparent",
          } as CSSProperties;
        case "filled":
          return {
            ...baseStyles,
            "--radio-bg": `${config.colors.text}10`, // 10% opacity
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
            "--radio-size": "1rem",
            "--radio-font-size": config.typography.sizes.sm,
            "--radio-gap": "0.5rem",
            "--radio-dot-size": "0.375rem",
          } as CSSProperties;
        case "md":
          return {
            "--radio-size": "1.25rem",
            "--radio-font-size": config.typography.sizes.base,
            "--radio-gap": "0.75rem",
            "--radio-dot-size": "0.5rem",
          } as CSSProperties;
        case "lg":
          return {
            "--radio-size": "1.5rem",
            "--radio-font-size": config.typography.sizes.lg,
            "--radio-gap": "1rem",
            "--radio-dot-size": "0.625rem",
          } as CSSProperties;
        default:
          return {} as CSSProperties;
      }
    };

    // Spacing-specific styles
    const getSpacingStyles = (): CSSProperties => {
      switch (spacing) {
        case "compact":
          return {
            "--radio-item-spacing": "0.5rem",
          } as CSSProperties;
        case "comfortable":
          return {
            "--radio-item-spacing": "1rem",
          } as CSSProperties;
        case "spacious":
          return {
            "--radio-item-spacing": "1.5rem",
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
            "--radio-border": "#ef4444",
            "--radio-accent": "#ef4444",
            "--radio-glow": "rgba(239, 68, 68, 0.3)",
          } as CSSProperties;
        case "success":
          return {
            "--radio-border": config.colors.success,
            "--radio-accent": config.colors.success,
            "--radio-glow": `${config.colors.successRgb}, 0.3)`,
          } as CSSProperties;
        case "warning":
          return {
            "--radio-border": "#f59e0b",
            "--radio-accent": "#f59e0b",
            "--radio-glow": "rgba(245, 158, 11, 0.3)",
          } as CSSProperties;
        default:
          return {} as CSSProperties;
      }
    };

    // Combined styles
    const combinedStyles: CSSProperties = {
      ...radioStyles,
      ...getVariantStyles(),
      ...getSizeStyles(),
      ...getSpacingStyles(),
      ...getValidationStyles(),
    };

    // Handle radio change
    const handleChange = (optionValue: string) => {
      setInternalValue(optionValue);
      // Create synthetic event for onChange
      const syntheticEvent = {
        target: { value: optionValue, name: radioName },
        currentTarget: { value: optionValue, name: radioName },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange?.(syntheticEvent);
    };

    // Handle focus
    const handleFocus = (
      optionValue: string,
      event: React.FocusEvent<HTMLInputElement>
    ) => {
      setFocusedValue(optionValue);
      onFocus?.(event);
    };

    // Handle blur
    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      setFocusedValue(null);
      onBlur?.(event);
    };

    // Determine current value
    const currentValue = value !== undefined ? value : internalValue;

    // Generate final class names
    const containerClassName = [
      "brutal-radio-group",
      `brutal-radio-group--${activeTheme}`,
      `brutal-radio-group--${variant}`,
      `brutal-radio-group--${size}`,
      `brutal-radio-group--${currentValidationState}`,
      `brutal-radio-group--${orientation}`,
      `brutal-radio-group--${spacing}`,
      loading && "brutal-radio-group--loading",
      props.disabled && "brutal-radio-group--disabled",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        className={containerClassName}
        style={combinedStyles}
        role="radiogroup"
        aria-labelledby={label ? `${radioGroupId}-label` : undefined}
        aria-describedby={
          [
            error && `${radioGroupId}-error`,
            success && `${radioGroupId}-success`,
            hint && `${radioGroupId}-hint`,
          ]
            .filter(Boolean)
            .join(" ") || undefined
        }
        aria-invalid={currentValidationState === "error"}
      >
        {/* Group Label */}
        {label && (
          <div
            id={`${radioGroupId}-label`}
            className={`brutal-radio-group__label brutal-radio-group__label--${activeTheme} brutal-radio-group__label--${currentValidationState}`}
          >
            {label}
            {props.required && (
              <span
                className="brutal-radio-group__required"
                aria-label="required"
              >
                *
              </span>
            )}
          </div>
        )}

        {/* Radio Options */}
        <div className="brutal-radio-group__options">
          {options.map((option, index) => {
            const isSelected = currentValue === option.value;
            const isFocused = focusedValue === option.value;
            const isDisabled = props.disabled || option.disabled;
            const optionId = `${radioGroupId}-option-${index}`;

            const optionClassName = [
              "brutal-radio-option",
              `brutal-radio-option--${activeTheme}`,
              `brutal-radio-option--${variant}`,
              `brutal-radio-option--${size}`,
              `brutal-radio-option--${currentValidationState}`,
              isSelected && "brutal-radio-option--selected",
              isFocused && "brutal-radio-option--focused",
              isDisabled && "brutal-radio-option--disabled",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <div key={option.value} className={optionClassName}>
                <div className="brutal-radio-option__wrapper">
                  {/* Hidden Native Radio */}
                  <input
                    ref={index === 0 ? ref : undefined}
                    type="radio"
                    id={optionId}
                    name={radioName}
                    value={option.value}
                    checked={isSelected}
                    disabled={isDisabled}
                    onChange={() => handleChange(option.value)}
                    onFocus={(e) => handleFocus(option.value, e)}
                    onBlur={handleBlur}
                    className="brutal-radio-option__input"
                    aria-describedby={
                      option.description ? `${optionId}-description` : undefined
                    }
                    {...props}
                  />

                  {/* Custom Radio Visual */}
                  <div className={radioClassName}>
                    {/* Radio Circle */}
                    <div className="brutal-radio__circle">
                      {/* Radio Dot */}
                      {isSelected && (
                        <div className="brutal-radio__dot">
                          {loading && isSelected && (
                            <div className="brutal-radio__spinner"></div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Effects Layer */}
                    <div className="brutal-radio__effects" aria-hidden="true">
                      {/* Focus ring */}
                      <div className="brutal-radio__focus-ring"></div>

                      {/* Glow effect for refined theme */}
                      {activeTheme === "refined-brutalist" && (
                        <div className="brutal-radio__glow"></div>
                      )}

                      {/* Glitch effect for extreme theme */}
                      {activeTheme === "extreme-brutalist" && (
                        <div className="brutal-radio__glitch"></div>
                      )}
                    </div>
                  </div>

                  {/* Label and Description */}
                  <div className="brutal-radio-option__content">
                    <label
                      htmlFor={optionId}
                      className={`brutal-radio-option__label brutal-radio-option__label--${activeTheme} brutal-radio-option__label--${currentValidationState}`}
                    >
                      {option.label}
                    </label>

                    {option.description && (
                      <div
                        id={`${optionId}-description`}
                        className="brutal-radio-option__description"
                      >
                        {option.description}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Helper Messages */}
        <div className="brutal-radio-group__helpers">
          {/* Error Message */}
          {error && (
            <div
              id={`${radioGroupId}-error`}
              className="brutal-radio-group__message brutal-radio-group__message--error"
              role="alert"
            >
              <svg
                className="brutal-radio-group__message-icon"
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
              id={`${radioGroupId}-success`}
              className="brutal-radio-group__message brutal-radio-group__message--success"
            >
              <svg
                className="brutal-radio-group__message-icon"
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
              id={`${radioGroupId}-hint`}
              className="brutal-radio-group__message brutal-radio-group__message--hint"
            >
              {hint}
            </div>
          )}
        </div>
      </div>
    );
  }
);

BrutalRadio.displayName = "BrutalRadio";
