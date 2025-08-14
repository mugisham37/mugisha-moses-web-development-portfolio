"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  ScreenReaderOnly,
  Status,
  Alert,
} from "@/components/accessibility/screen-reader-only";
import { useAnnouncement } from "@/lib/accessibility";

// Form Context
interface FormContextValue {
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  setFieldError: (name: string, error: string) => void;
  clearFieldError: (name: string) => void;
  setFieldTouched: (name: string, touched: boolean) => void;
}

const FormContext = React.createContext<FormContextValue | null>(null);

export function useFormContext() {
  const context = React.useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a Form component");
  }
  return context;
}

// Form Provider
interface FormProps {
  children: React.ReactNode;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
  noValidate?: boolean;
}

export function Form({
  children,
  onSubmit,
  className = "",
  noValidate = true,
}: FormProps) {
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const announce = useAnnouncement();

  const setFieldError = React.useCallback((name: string, error: string) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  const clearFieldError = React.useCallback((name: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }, []);

  const setFieldTouched = React.useCallback(
    (name: string, touched: boolean) => {
      setTouched((prev) => ({ ...prev, [name]: touched }));
    },
    []
  );

  const handleSubmit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsSubmitting(true);

      try {
        await onSubmit?.(event);
        announce("Form submitted successfully", "polite");
      } catch (error) {
        announce(
          "Form submission failed. Please check for errors.",
          "assertive"
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSubmit, announce]
  );

  const contextValue: FormContextValue = {
    errors,
    touched,
    isSubmitting,
    setFieldError,
    clearFieldError,
    setFieldTouched,
  };

  return (
    <FormContext.Provider value={contextValue}>
      <form
        onSubmit={handleSubmit}
        className={cn("space-y-6", className)}
        noValidate={noValidate}
        role="form"
      >
        {children}

        {/* Form-level error announcement */}
        {Object.keys(errors).length > 0 && (
          <Alert>
            Form has {Object.keys(errors).length} error
            {Object.keys(errors).length > 1 ? "s" : ""}
          </Alert>
        )}

        {/* Submission status */}
        {isSubmitting && <Status>Submitting form...</Status>}
      </form>
    </FormContext.Provider>
  );
}

// Form Field
interface FormFieldProps {
  children: React.ReactNode;
  name: string;
  className?: string;
}

export function FormField({ children, name, className = "" }: FormFieldProps) {
  const { errors, touched } = useFormContext();
  const hasError = touched[name] && errors[name];

  return (
    <div
      className={cn("form-field", hasError && "form-field--error", className)}
      role="group"
      aria-labelledby={`${name}-label`}
      aria-describedby={hasError ? `${name}-error` : undefined}
    >
      {children}
    </div>
  );
}

// Enhanced Input with accessibility
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  description?: string;
  required?: boolean;
  validate?: (value: string) => string | undefined;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      name,
      label,
      description,
      required = false,
      validate,
      className = "",
      onBlur,
      onChange,
      ...props
    },
    ref
  ) => {
    const { errors, touched, setFieldError, clearFieldError, setFieldTouched } =
      useFormContext();
    const hasError = touched[name] && errors[name];
    const inputId = `${name}-input`;
    const errorId = `${name}-error`;
    const descriptionId = `${name}-description`;

    const handleBlur = React.useCallback(
      (event: React.FocusEvent<HTMLInputElement>) => {
        setFieldTouched(name, true);

        if (validate) {
          const error = validate(event.target.value);
          if (error) {
            setFieldError(name, error);
          } else {
            clearFieldError(name);
          }
        }

        onBlur?.(event);
      },
      [name, validate, setFieldTouched, setFieldError, clearFieldError, onBlur]
    );

    const handleChange = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        // Clear error on change if field was previously touched
        if (touched[name] && errors[name]) {
          clearFieldError(name);
        }

        onChange?.(event);
      },
      [name, touched, errors, clearFieldError, onChange]
    );

    return (
      <FormField name={name}>
        <Label
          htmlFor={inputId}
          id={`${name}-label`}
          className={cn(
            "mb-2 block text-sm font-medium",
            hasError && "text-red-600",
            required && "after:ml-1 after:text-red-500 after:content-['*']"
          )}
        >
          {label}
        </Label>

        {description && (
          <p id={descriptionId} className="mb-2 text-sm text-gray-600">
            {description}
          </p>
        )}

        <Input
          ref={ref}
          id={inputId}
          name={name}
          required={required}
          aria-required={required}
          aria-invalid={hasError}
          aria-describedby={cn(
            description && descriptionId,
            hasError && errorId
          )}
          className={cn(
            hasError &&
              "border-red-500 focus:border-red-500 focus:ring-red-500",
            className
          )}
          onBlur={handleBlur}
          onChange={handleChange}
          {...props}
        />

        {hasError && (
          <div
            id={errorId}
            className="mt-2 text-sm text-red-600"
            role="alert"
            aria-live="polite"
          >
            {errors[name]}
          </div>
        )}
      </FormField>
    );
  }
);

FormInput.displayName = "FormInput";

// Textarea component
interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label: string;
  description?: string;
  required?: boolean;
  validate?: (value: string) => string | undefined;
}

export const FormTextarea = React.forwardRef<
  HTMLTextAreaElement,
  FormTextareaProps
>(
  (
    {
      name,
      label,
      description,
      required = false,
      validate,
      className = "",
      onBlur,
      onChange,
      ...props
    },
    ref
  ) => {
    const { errors, touched, setFieldError, clearFieldError, setFieldTouched } =
      useFormContext();
    const hasError = touched[name] && errors[name];
    const textareaId = `${name}-textarea`;
    const errorId = `${name}-error`;
    const descriptionId = `${name}-description`;

    const handleBlur = React.useCallback(
      (event: React.FocusEvent<HTMLTextAreaElement>) => {
        setFieldTouched(name, true);

        if (validate) {
          const error = validate(event.target.value);
          if (error) {
            setFieldError(name, error);
          } else {
            clearFieldError(name);
          }
        }

        onBlur?.(event);
      },
      [name, validate, setFieldTouched, setFieldError, clearFieldError, onBlur]
    );

    const handleChange = React.useCallback(
      (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        // Clear error on change if field was previously touched
        if (touched[name] && errors[name]) {
          clearFieldError(name);
        }

        onChange?.(event);
      },
      [name, touched, errors, clearFieldError, onChange]
    );

    return (
      <FormField name={name}>
        <Label
          htmlFor={textareaId}
          id={`${name}-label`}
          className={cn(
            "mb-2 block text-sm font-medium",
            hasError && "text-red-600",
            required && "after:ml-1 after:text-red-500 after:content-['*']"
          )}
        >
          {label}
        </Label>

        {description && (
          <p id={descriptionId} className="mb-2 text-sm text-gray-600">
            {description}
          </p>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          name={name}
          required={required}
          aria-required={required}
          aria-invalid={hasError}
          aria-describedby={cn(
            description && descriptionId,
            hasError && errorId
          )}
          className={cn(
            "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            hasError &&
              "border-red-500 focus:border-red-500 focus:ring-red-500",
            className
          )}
          onBlur={handleBlur}
          onChange={handleChange}
          {...props}
        />

        {hasError && (
          <div
            id={errorId}
            className="mt-2 text-sm text-red-600"
            role="alert"
            aria-live="polite"
          >
            {errors[name]}
          </div>
        )}
      </FormField>
    );
  }
);

FormTextarea.displayName = "FormTextarea";

// Form Submit Button
interface FormSubmitProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loadingText?: string;
}

export function FormSubmit({
  children,
  loadingText = "Submitting...",
  className = "",
  ...props
}: FormSubmitProps) {
  const { isSubmitting } = useFormContext();

  return (
    <button
      type="submit"
      disabled={isSubmitting}
      aria-disabled={isSubmitting}
      className={cn(
        "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      {isSubmitting ? loadingText : children}

      {isSubmitting && (
        <ScreenReaderOnly>Form is being submitted</ScreenReaderOnly>
      )}
    </button>
  );
}
