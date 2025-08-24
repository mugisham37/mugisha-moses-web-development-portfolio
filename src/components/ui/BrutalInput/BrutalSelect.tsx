"use client";

import React, {
  forwardRef,
  useState,
  useId,
  CSSProperties,
  useRef,
  useEffect,
} from "react";
import { useTheme, useThemeClassName, useThemeStyles } from "@/hooks/useTheme";
import { ThemeType } from "@/types/theme";

export interface BrutalSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface BrutalSelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  variant?: "default" | "outlined" | "filled" | "ghost";
  size?: "sm" | "md" | "lg";
  theme?: ThemeType;
  loading?: boolean;
  options: BrutalSelectOption[];
  placeholder?: string;
  validationState?: "default" | "error" | "success" | "warning";
  searchable?: boolean;
  clearable?: boolean;
  onClear?: () => void;
}

/**
 * BrutalSelect - A theme-aware select component with validation states
 *
 * Features:
 * - Theme-aware styling (extreme-brutalist vs refined-brutalist)
 * - Multiple variants (default, outlined, filled, ghost)
 * - Size variations (sm, md, lg)
 * - Searchable and clearable functionality
 * - Real-time validation with visual feedback
 * - Grouped options support
 */
export const BrutalSelect = forwardRef<HTMLSelectElement, BrutalSelectProps>(
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
      options = [],
      placeholder = "Select an option...",
      validationState = "default",
      searchable = false,
      clearable = false,
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
    const selectId = id || generatedId;

    const [isFocused, setIsFocused] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [internalValue, setInternalValue] = useState(value || "");

    const selectRef = useRef<HTMLSelectElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Determine validation state based on props
    const getValidationState = () => {
      if (error) return "error";
      if (success) return "success";
      return validationState;
    };

    const currentValidationState = getValidationState();

    // Generate theme-aware class names
    const selectClassName = useThemeClassName("brutal-select", {
      "extreme-brutalist": "brutal-select--extreme",
      "refined-brutalist": "brutal-select--refined",
    });

    // Theme-aware styles
    const selectStyles = useThemeStyles(
      {},
      {
        "extreme-brutalist": {
          "--select-font": config.typography.primary,
          "--select-border-width": config.borders.width,
          "--select-border-radius": "0px",
          "--select-shadow": config.shadows.brutal,
          "--select-animation-duration": config.animations.duration,
          "--select-animation-easing": config.animations.easing,
        } as CSSProperties,
        "refined-brutalist": {
          "--select-font": config.typography.primary,
          "--select-border-width": config.borders.width,
          "--select-border-radius": config.borders.radius || "8px",
          "--select-shadow": config.shadows.subtle,
          "--select-animation-duration": config.animations.duration,
          "--select-animation-easing": config.animations.easing,
        } as CSSProperties,
      }
    );

    // Variant-specific styles
    const getVariantStyles = (): CSSProperties => {
      const baseStyles = {
        "--select-bg": config.colors.bg,
        "--select-text": config.colors.text,
        "--select-border": config.colors.text,
        "--select-accent": config.colors.accent,
        "--select-highlight": config.colors.highlight,
        "--select-placeholder": `${config.colors.text}80`, // 50% opacity
      } as CSSProperties;

      switch (variant) {
        case "default":
          return baseStyles;
        case "outlined":
          return {
            ...baseStyles,
            "--select-bg": "transparent",
          } as CSSProperties;
        case "filled":
          return {
            ...baseStyles,
            "--select-bg": `${config.colors.text}10`, // 10% opacity
          } as CSSProperties;
        case "ghost":
          return {
            ...baseStyles,
            "--select-bg": "transparent",
            "--select-border": "transparent",
            "--select-shadow": "none",
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
            "--select-padding": "0.5rem 2rem 0.5rem 0.75rem",
            "--select-font-size": config.typography.sizes.sm,
            "--select-height": "2.5rem",
          } as CSSProperties;
        case "md":
          return {
            "--select-padding": "0.75rem 2.5rem 0.75rem 1rem",
            "--select-font-size": config.typography.sizes.base,
            "--select-height": "3rem",
          } as CSSProperties;
        case "lg":
          return {
            "--select-padding": "1rem 3rem 1rem 1.25rem",
            "--select-font-size": config.typography.sizes.lg,
            "--select-height": "3.5rem",
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
            "--select-border": "#ef4444",
            "--select-accent": "#ef4444",
            "--select-glow": "rgba(239, 68, 68, 0.3)",
          } as CSSProperties;
        case "success":
          return {
            "--select-border": config.colors.success,
            "--select-accent": config.colors.success,
            "--select-glow": `${config.colors.successRgb}, 0.3)`,
          } as CSSProperties;
        case "warning":
          return {
            "--select-border": "#f59e0b",
            "--select-accent": "#f59e0b",
            "--select-glow": "rgba(245, 158, 11, 0.3)",
          } as CSSProperties;
        default:
          return {} as CSSProperties;
      }
    };

    // Combined styles
    const combinedStyles: CSSProperties = {
      ...selectStyles,
      ...getVariantStyles(),
      ...getSizeStyles(),
      ...getValidationStyles(),
    };

    // Filter options based on search term
    const filteredOptions = searchable
      ? options.filter((option) =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : options;

    // Group options if they have groups
    const groupedOptions = filteredOptions.reduce(
      (groups, option) => {
        const group = option.group || "default";
        if (!groups[group]) {
          groups[group] = [];
        }
        groups[group].push(option);
        return groups;
      },
      {} as Record<string, BrutalSelectOption[]>
    );

    // Handle select change
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newValue = event.target.value;
      setInternalValue(newValue);
      onChange?.(event);
    };

    // Handle focus
    const handleFocus = (event: React.FocusEvent<HTMLSelectElement>) => {
      setIsFocused(true);
      onFocus?.(event);
    };

    // Handle blur
    const handleBlur = (event: React.FocusEvent<HTMLSelectElement>) => {
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
      } as React.ChangeEvent<HTMLSelectElement>;
      onChange?.(syntheticEvent);
    };

    // Get selected option label
    const getSelectedLabel = () => {
      const currentValue = value !== undefined ? value : internalValue;
      const selectedOption = options.find(
        (option) => option.value === currentValue
      );
      return selectedOption ? selectedOption.label : placeholder;
    };

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
          document.removeEventListener("mousedown", handleClickOutside);
      }
    }, [isOpen]);

    // Generate final class names
    const containerClassName = [
      "brutal-select-container",
      `brutal-select-container--${activeTheme}`,
      `brutal-select-container--${variant}`,
      `brutal-select-container--${size}`,
      `brutal-select-container--${currentValidationState}`,
      isFocused && "brutal-select-container--focused",
      isOpen && "brutal-select-container--open",
      loading && "brutal-select-container--loading",
      props.disabled && "brutal-select-container--disabled",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const finalSelectClassName = [
      selectClassName,
      `brutal-select--${variant}`,
      `brutal-select--${size}`,
      `brutal-select--${activeTheme}`,
      `brutal-select--${currentValidationState}`,
      clearable && (value || internalValue) && "brutal-select--clearable",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={containerClassName} style={combinedStyles}>
        {/* Label */}
        {label && (
          <label
            htmlFor={selectId}
            className={`brutal-select__label brutal-select__label--${activeTheme} brutal-select__label--${currentValidationState}`}
          >
            {label}
            {props.required && (
              <span className="brutal-select__required" aria-label="required">
                *
              </span>
            )}
          </label>
        )}

        {/* Select Container */}
        <div className="brutal-select__wrapper" ref={dropdownRef}>
          {/* Native Select (for accessibility and form submission) */}
          <select
            ref={ref || selectRef}
            id={selectId}
            className={finalSelectClassName}
            value={value !== undefined ? value : internalValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-invalid={currentValidationState === "error"}
            aria-describedby={
              [
                error && `${selectId}-error`,
                success && `${selectId}-success`,
                hint && `${selectId}-hint`,
              ]
                .filter(Boolean)
                .join(" ") || undefined
            }
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {Object.entries(groupedOptions).map(([groupName, groupOptions]) => {
              if (groupName === "default") {
                return groupOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </option>
                ));
              } else {
                return (
                  <optgroup key={groupName} label={groupName}>
                    {groupOptions.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                      >
                        {option.label}
                      </option>
                    ))}
                  </optgroup>
                );
              }
            })}
          </select>

          {/* Custom Dropdown Arrow */}
          <div className="brutal-select__arrow">
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
              <polyline points="6,9 12,15 18,9"></polyline>
            </svg>
          </div>

          {/* Clear Button */}
          {clearable &&
            (value || internalValue) &&
            !loading &&
            !props.disabled && (
              <button
                type="button"
                className="brutal-select__clear"
                onClick={handleClear}
                aria-label="Clear selection"
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
            <div className="brutal-select__loading">
              <div className="brutal-select__spinner"></div>
            </div>
          )}

          {/* Effects Layer */}
          <div className="brutal-select__effects" aria-hidden="true">
            {/* Focus ring */}
            <div className="brutal-select__focus-ring"></div>

            {/* Glow effect for refined theme */}
            {activeTheme === "refined-brutalist" && (
              <div className="brutal-select__glow"></div>
            )}

            {/* Glitch effect for extreme theme */}
            {activeTheme === "extreme-brutalist" && (
              <div className="brutal-select__glitch"></div>
            )}

            {/* Scan lines for extreme theme */}
            {activeTheme === "extreme-brutalist" && (
              <div className="brutal-select__scan-lines"></div>
            )}
          </div>
        </div>

        {/* Helper Text Row */}
        <div className="brutal-select__helpers">
          {/* Error Message */}
          {error && (
            <div
              id={`${selectId}-error`}
              className="brutal-select__message brutal-select__message--error"
              role="alert"
            >
              <svg
                className="brutal-select__message-icon"
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
              id={`${selectId}-success`}
              className="brutal-select__message brutal-select__message--success"
            >
              <svg
                className="brutal-select__message-icon"
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
              id={`${selectId}-hint`}
              className="brutal-select__message brutal-select__message--hint"
            >
              {hint}
            </div>
          )}
        </div>
      </div>
    );
  }
);

BrutalSelect.displayName = "BrutalSelect";
