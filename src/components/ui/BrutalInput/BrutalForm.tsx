"use client";

import React, { forwardRef, FormEvent, ReactNode } from "react";
import { useTheme, useThemeClassName } from "@/hooks/useTheme";
import { ThemeType } from "@/types/theme";

export interface BrutalFormProps
  extends React.FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
  theme?: ThemeType;
  variant?: "default" | "card" | "inline";
  spacing?: "compact" | "comfortable" | "spacious";
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  loading?: boolean;
  disabled?: boolean;
}

/**
 * BrutalForm - A theme-aware form container component
 *
 * Features:
 * - Theme-aware styling (extreme-brutalist vs refined-brutalist)
 * - Multiple variants (default, card, inline)
 * - Spacing variations (compact, comfortable, spacious)
 * - Loading and disabled states
 * - Accessibility features with proper form semantics
 */
export const BrutalForm = forwardRef<HTMLFormElement, BrutalFormProps>(
  (
    {
      children,
      theme,
      variant = "default",
      spacing = "comfortable",
      onSubmit,
      loading = false,
      disabled = false,
      className = "",
      ...props
    },
    ref
  ) => {
    const { currentTheme } = useTheme();
    const activeTheme = theme || currentTheme;

    // Generate theme-aware class names
    const formClassName = useThemeClassName("brutal-form", {
      "extreme-brutalist": "brutal-form--extreme",
      "refined-brutalist": "brutal-form--refined",
    });

    // Handle form submission
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      if (loading || disabled) {
        event.preventDefault();
        return;
      }
      onSubmit?.(event);
    };

    // Generate final class names
    const finalClassName = [
      formClassName,
      `brutal-form--${variant}`,
      `brutal-form--${spacing}`,
      `brutal-form--${activeTheme}`,
      loading && "brutal-form--loading",
      disabled && "brutal-form--disabled",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <form
        ref={ref}
        className={finalClassName}
        onSubmit={handleSubmit}
        aria-disabled={disabled || loading}
        {...props}
      >
        {children}

        {/* Loading overlay */}
        {loading && (
          <div className="brutal-form__loading-overlay" aria-hidden="true">
            <div className="brutal-form__loading-spinner">
              <div className="brutal-form__spinner"></div>
            </div>
          </div>
        )}
      </form>
    );
  }
);

BrutalForm.displayName = "BrutalForm";

// Form Field Group Component
export interface BrutalFormFieldProps {
  children: ReactNode;
  className?: string;
}

export const BrutalFormField: React.FC<BrutalFormFieldProps> = ({
  children,
  className = "",
}) => {
  return <div className={`brutal-form__field ${className}`}>{children}</div>;
};

// Form Actions Component
export interface BrutalFormActionsProps {
  children: ReactNode;
  align?: "left" | "center" | "right" | "between";
  className?: string;
}

export const BrutalFormActions: React.FC<BrutalFormActionsProps> = ({
  children,
  align = "left",
  className = "",
}) => {
  return (
    <div
      className={`brutal-form__actions brutal-form__actions--${align} ${className}`}
    >
      {children}
    </div>
  );
};

// Form Section Component
export interface BrutalFormSectionProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export const BrutalFormSection: React.FC<BrutalFormSectionProps> = ({
  children,
  title,
  description,
  className = "",
}) => {
  return (
    <div className={`brutal-form__section ${className}`}>
      {title && (
        <div className="brutal-form__section-header">
          <h3 className="brutal-form__section-title">{title}</h3>
          {description && (
            <p className="brutal-form__section-description">{description}</p>
          )}
        </div>
      )}
      <div className="brutal-form__section-content">{children}</div>
    </div>
  );
};
