"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Eye,
  EyeOff,
  Check,
  X,
  AlertCircle,
  ChevronDown,
  Search,
  Calendar,
  Clock,
  Phone,
  Mail,
  User,
  Lock,
} from "lucide-react";

interface MobileFormFieldProps {
  label: string;
  type?:
    | "text"
    | "email"
    | "password"
    | "tel"
    | "url"
    | "search"
    | "number"
    | "date"
    | "time"
    | "textarea"
    | "select";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  success?: string;
  hint?: string;
  options?: Array<{ value: string; label: string }>;
  rows?: number;
  maxLength?: number;
  pattern?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  icon?: React.ReactNode;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
}

/**
 * Mobile-optimized form field with enhanced UX and accessibility
 */
export function MobileFormField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  success,
  hint,
  options = [],
  rows = 4,
  maxLength,
  pattern,
  autoComplete,
  autoFocus = false,
  icon,
  onFocus,
  onBlur,
  className = "",
}: MobileFormFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const selectRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Auto-focus handling
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Close select dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsSelectOpen(false);
      }
    };

    if (isSelectOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isSelectOpen]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    onFocus?.();

    // Haptic feedback
    if ("vibrate" in navigator) {
      navigator.vibrate(10);
    }
  }, [onFocus]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onBlur?.();
  }, [onBlur]);

  const handlePasswordToggle = useCallback(() => {
    setShowPassword(!showPassword);
    // Haptic feedback
    if ("vibrate" in navigator) {
      navigator.vibrate(15);
    }
  }, [showPassword]);

  const handleSelectOption = useCallback(
    (optionValue: string) => {
      onChange(optionValue);
      setIsSelectOpen(false);
      // Haptic feedback
      if ("vibrate" in navigator) {
        navigator.vibrate(20);
      }
    },
    [onChange]
  );

  // Get appropriate icon for input type
  const getTypeIcon = () => {
    if (icon) return icon;

    switch (type) {
      case "email":
        return <Mail className="h-5 w-5" />;
      case "password":
        return <Lock className="h-5 w-5" />;
      case "tel":
        return <Phone className="h-5 w-5" />;
      case "search":
        return <Search className="h-5 w-5" />;
      case "date":
        return <Calendar className="h-5 w-5" />;
      case "time":
        return <Clock className="h-5 w-5" />;
      default:
        return <User className="h-5 w-5" />;
    }
  };

  // Determine input mode for mobile keyboards
  const getInputMode = () => {
    switch (type) {
      case "email":
        return "email";
      case "tel":
        return "tel";
      case "number":
        return "numeric";
      case "url":
        return "url";
      case "search":
        return "search";
      default:
        return "text";
    }
  };

  const hasError = Boolean(error);
  const hasSuccess = Boolean(success);
  const hasValue = Boolean(value);

  const baseInputClasses = cn(
    "w-full px-4 py-4 pr-12 font-mono text-base",
    "border-4 border-white bg-black text-white",
    "transition-all duration-300 ease-out",
    "focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:border-yellow-400",
    "placeholder:text-white/40 placeholder:font-mono placeholder:uppercase placeholder:tracking-wider",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    hasError && "border-red-400 focus:ring-red-400 focus:border-red-400",
    hasSuccess &&
      "border-green-400 focus:ring-green-400 focus:border-green-400",
    isFocused &&
      "transform scale-[1.02] shadow-[8px_8px_0px_rgba(255,255,0,0.3)]",
    "min-h-[56px]", // Enhanced touch target
    className
  );

  return (
    <div className="space-y-3">
      {/* Label */}
      <motion.label
        className={cn(
          "block font-mono text-sm font-bold tracking-wider uppercase",
          "transition-colors duration-200",
          hasError
            ? "text-red-400"
            : hasSuccess
              ? "text-green-400"
              : "text-white",
          required && "after:ml-1 after:text-red-400 after:content-['*']"
        )}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {label}
      </motion.label>

      {/* Input Container */}
      <div className="relative">
        {/* Icon */}
        <div
          className={cn(
            "absolute top-1/2 left-4 z-10 -translate-y-1/2",
            "transition-colors duration-200",
            hasError
              ? "text-red-400"
              : hasSuccess
                ? "text-green-400"
                : isFocused
                  ? "text-yellow-400"
                  : "text-white/60"
          )}
        >
          {getTypeIcon()}
        </div>

        {/* Input Field */}
        {type === "textarea" ? (
          <motion.textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            rows={rows}
            maxLength={maxLength}
            autoComplete={autoComplete}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={cn(baseInputClasses, "resize-none pl-12")}
            style={{ fontSize: "16px" }} // Prevent iOS zoom
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          />
        ) : type === "select" ? (
          <div ref={selectRef} className="relative">
            <motion.button
              type="button"
              onClick={() => setIsSelectOpen(!isSelectOpen)}
              className={cn(
                baseInputClasses,
                "cursor-pointer pr-12 pl-12 text-left",
                "flex items-center justify-between"
              )}
              whileTap={{ scale: 0.98 }}
            >
              <span className={cn(hasValue ? "text-white" : "text-white/40")}>
                {hasValue
                  ? options.find((opt) => opt.value === value)?.label || value
                  : placeholder || "Select an option"}
              </span>
              <ChevronDown
                className={cn(
                  "h-5 w-5 transition-transform duration-200",
                  isSelectOpen && "rotate-180"
                )}
              />
            </motion.button>

            {/* Dropdown */}
            <AnimatePresence>
              {isSelectOpen && (
                <motion.div
                  className="absolute top-full right-0 left-0 z-20 mt-2 max-h-60 overflow-y-auto border-4 border-white bg-black shadow-[8px_8px_0px_rgba(255,255,255,0.3)]"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  {options.map((option) => (
                    <motion.button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelectOption(option.value)}
                      className={cn(
                        "w-full px-4 py-4 text-left font-mono transition-colors duration-200",
                        "hover:bg-yellow-400 hover:text-black",
                        "focus:bg-yellow-400 focus:text-black focus:outline-none",
                        "border-b-2 border-white/10 last:border-b-0",
                        "flex min-h-[56px] items-center",
                        value === option.value && "bg-yellow-400 text-black"
                      )}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {option.label}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <motion.input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type={
              type === "password" ? (showPassword ? "text" : "password") : type
            }
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            maxLength={maxLength}
            pattern={pattern}
            autoComplete={autoComplete}
            inputMode={getInputMode()}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={cn(baseInputClasses, "pl-12")}
            style={{ fontSize: "16px" }} // Prevent iOS zoom
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          />
        )}

        {/* Password Toggle */}
        {type === "password" && (
          <motion.button
            type="button"
            onClick={handlePasswordToggle}
            className="absolute top-1/2 right-4 flex min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center text-white/60 transition-colors duration-200 hover:text-white"
            aria-label={showPassword ? "Hide password" : "Show password"}
            whileTap={{ scale: 0.9 }}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </motion.button>
        )}

        {/* Status Icons */}
        {(hasError || hasSuccess) && type !== "password" && (
          <div className="absolute top-1/2 right-4 -translate-y-1/2">
            {hasError && <X className="h-5 w-5 text-red-400" />}
            {hasSuccess && <Check className="h-5 w-5 text-green-400" />}
          </div>
        )}

        {/* Character Count */}
        {maxLength && (
          <div className="absolute right-4 bottom-2 font-mono text-xs text-white/40">
            {value.length}/{maxLength}
          </div>
        )}
      </div>

      {/* Messages */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            className="flex items-center gap-2 text-red-400"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span className="font-mono text-sm tracking-wider uppercase">
              {error}
            </span>
          </motion.div>
        )}

        {success && !error && (
          <motion.div
            className="flex items-center gap-2 text-green-400"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Check className="h-4 w-4 flex-shrink-0" />
            <span className="font-mono text-sm tracking-wider uppercase">
              {success}
            </span>
          </motion.div>
        )}

        {hint && !error && !success && (
          <motion.div
            className="font-mono text-sm text-white/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {hint}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Mobile-optimized form container with enhanced UX
 */
interface MobileFormProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
  className?: string;
  title?: string;
  description?: string;
}

export function MobileForm({
  children,
  onSubmit,
  isSubmitting = false,
  className = "",
  title,
  description,
}: MobileFormProps) {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const isMobile = useIsMobile();

  // Handle keyboard visibility on mobile
  useEffect(() => {
    if (!isMobile) return;

    const handleResize = () => {
      const viewportHeight =
        window.visualViewport?.height || window.innerHeight;
      const windowHeight = window.screen.height;
      const keyboardThreshold = windowHeight * 0.75;

      setKeyboardVisible(viewportHeight < keyboardThreshold);
    };

    window.visualViewport?.addEventListener("resize", handleResize);
    window.addEventListener("resize", handleResize);

    return () => {
      window.visualViewport?.removeEventListener("resize", handleResize);
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Haptic feedback
    if ("vibrate" in navigator) {
      navigator.vibrate(50);
    }

    onSubmit(e);
  };

  return (
    <motion.form
      ref={formRef}
      onSubmit={handleSubmit}
      className={cn(
        "space-y-6 border-4 border-white bg-black p-6",
        "transition-all duration-300",
        keyboardVisible && "pb-20", // Extra padding when keyboard is visible
        isSubmitting && "pointer-events-none opacity-75",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Form Header */}
      {(title || description) && (
        <div className="space-y-3 border-b-2 border-white/20 pb-6">
          {title && (
            <motion.h2
              className="font-mono text-2xl font-bold tracking-wider text-white uppercase"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {title}
            </motion.h2>
          )}
          {description && (
            <motion.p
              className="font-mono text-sm leading-relaxed text-white/80"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {description}
            </motion.p>
          )}
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-6">{children}</div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isSubmitting && (
          <motion.div
            className="absolute inset-0 z-10 flex items-center justify-center bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex flex-col items-center gap-4">
              <motion.div
                className="h-12 w-12 rounded-full border-4 border-white/20 border-t-yellow-400"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="font-mono text-sm tracking-wider text-white uppercase">
                Submitting...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.form>
  );
}
