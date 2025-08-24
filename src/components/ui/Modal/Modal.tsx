"use client";

import React, {
  forwardRef,
  useEffect,
  useRef,
  useCallback,
  CSSProperties,
  ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { useTheme, useThemeClassName, useThemeStyles } from "@/hooks/useTheme";
import { ThemeType } from "@/types/theme";

export interface ModalProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  variant?: "default" | "brutal" | "minimal" | "floating";
  theme?: ThemeType;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  title?: string;
  description?: string;
  className?: string;
  backdropClassName?: string;
  contentClassName?: string;
  overlayBlur?: boolean;
  preventScroll?: boolean;
  initialFocus?: React.RefObject<HTMLElement>;
  finalFocus?: React.RefObject<HTMLElement>;
  trapFocus?: boolean;
  role?: "dialog" | "alertdialog";
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
}

/**
 * Modal - A theme-aware modal component with advanced features
 *
 * Features:
 * - Theme-aware styling (extreme-brutalist vs refined-brutalist)
 * - Multiple size variations (sm, md, lg, xl, full)
 * - Backdrop blur effects and focus management
 * - Accessibility features including keyboard navigation and ARIA labels
 * - Responsive behavior for mobile devices
 * - Portal rendering for proper z-index stacking
 * - Focus trapping and restoration
 * - Scroll prevention and body lock
 */
export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      children,
      isOpen,
      onClose,
      size = "md",
      variant = "default",
      theme,
      closeOnBackdropClick = true,
      closeOnEscape = true,
      showCloseButton = true,
      title,
      description,
      className = "",
      backdropClassName = "",
      contentClassName = "",
      overlayBlur = true,
      preventScroll = true,
      initialFocus,
      finalFocus,
      trapFocus = true,
      role = "dialog",
      ariaLabelledBy,
      ariaDescribedBy,
    },
    ref
  ) => {
    const { currentTheme, config } = useTheme();
    const activeTheme = theme || currentTheme;

    // Refs for focus management
    const modalRef = useRef<HTMLDivElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);

    // Generate theme-aware class names
    const modalClassName = useThemeClassName("brutal-modal", {
      "extreme-brutalist": "brutal-modal--extreme",
      "refined-brutalist": "brutal-modal--refined",
    });

    // Theme-aware styles
    const modalStyles = useThemeStyles(
      {},
      {
        "extreme-brutalist": {
          "--modal-font": config.typography.primary,
          "--modal-border-width": config.borders.width,
          "--modal-border-radius": "0px",
          "--modal-shadow": config.shadows.triple || config.shadows.brutal,
          "--modal-animation-duration": config.animations.duration,
          "--modal-animation-easing": config.animations.easing,
          "--modal-backdrop-blur": overlayBlur ? "blur(8px)" : "none",
        } as CSSProperties,
        "refined-brutalist": {
          "--modal-font": config.typography.primary,
          "--modal-border-width": config.borders.width,
          "--modal-border-radius": config.borders.radius || "12px",
          "--modal-shadow": config.shadows.elevated || config.shadows.subtle,
          "--modal-animation-duration": config.animations.duration,
          "--modal-animation-easing": config.animations.easing,
          "--modal-backdrop-blur": overlayBlur ? "blur(12px)" : "none",
        } as CSSProperties,
      }
    );

    // Size-specific styles
    const getSizeStyles = (): CSSProperties => {
      switch (size) {
        case "sm":
          return {
            "--modal-width": "400px",
            "--modal-max-width": "90vw",
            "--modal-max-height": "80vh",
            "--modal-padding": "1.5rem",
          } as CSSProperties;
        case "md":
          return {
            "--modal-width": "500px",
            "--modal-max-width": "90vw",
            "--modal-max-height": "85vh",
            "--modal-padding": "2rem",
          } as CSSProperties;
        case "lg":
          return {
            "--modal-width": "700px",
            "--modal-max-width": "95vw",
            "--modal-max-height": "90vh",
            "--modal-padding": "2.5rem",
          } as CSSProperties;
        case "xl":
          return {
            "--modal-width": "900px",
            "--modal-max-width": "95vw",
            "--modal-max-height": "95vh",
            "--modal-padding": "3rem",
          } as CSSProperties;
        case "full":
          return {
            "--modal-width": "100vw",
            "--modal-max-width": "100vw",
            "--modal-max-height": "100vh",
            "--modal-padding": "2rem",
          } as CSSProperties;
        default:
          return {} as CSSProperties;
      }
    };

    // Variant-specific styles
    const getVariantStyles = (): CSSProperties => {
      const baseStyles = {
        "--modal-bg": config.colors.bg,
        "--modal-text": config.colors.text,
        "--modal-border": config.colors.text,
        "--modal-accent": config.colors.accent,
        "--modal-backdrop-bg":
          activeTheme === "extreme-brutalist"
            ? "rgba(0, 0, 0, 0.9)"
            : "rgba(0, 0, 0, 0.7)",
      } as CSSProperties;

      switch (variant) {
        case "brutal":
          return {
            ...baseStyles,
            "--modal-shadow":
              activeTheme === "extreme-brutalist"
                ? config.shadows.triple
                : config.shadows.elevated,
            "--modal-border-width":
              activeTheme === "extreme-brutalist" ? "8px" : "4px",
          } as CSSProperties;
        case "minimal":
          return {
            ...baseStyles,
            "--modal-shadow": "none",
            "--modal-border-width": "1px",
            "--modal-backdrop-bg": "rgba(0, 0, 0, 0.5)",
          } as CSSProperties;
        case "floating":
          return {
            ...baseStyles,
            "--modal-shadow":
              activeTheme === "extreme-brutalist"
                ? config.shadows.double
                : config.shadows.glow,
            "--modal-backdrop-bg": "rgba(0, 0, 0, 0.3)",
          } as CSSProperties;
        default:
          return baseStyles;
      }
    };

    // Combined styles
    const combinedStyles: CSSProperties = {
      ...modalStyles,
      ...getSizeStyles(),
      ...getVariantStyles(),
    };

    // Focus trap implementation
    const getFocusableElements = useCallback((container: HTMLElement) => {
      const focusableSelectors = [
        "button:not([disabled])",
        "input:not([disabled])",
        "textarea:not([disabled])",
        "select:not([disabled])",
        "a[href]",
        '[tabindex]:not([tabindex="-1"])',
        '[contenteditable="true"]',
      ].join(", ");

      return Array.from(
        container.querySelectorAll(focusableSelectors)
      ) as HTMLElement[];
    }, []);

    const handleKeyDown = useCallback(
      (event: KeyboardEvent) => {
        if (!isOpen || !modalRef.current) return;

        // Handle Escape key
        if (event.key === "Escape" && closeOnEscape) {
          event.preventDefault();
          onClose();
          return;
        }

        // Handle Tab key for focus trapping
        if (event.key === "Tab" && trapFocus) {
          const focusableElements = getFocusableElements(modalRef.current);

          if (focusableElements.length === 0) return;

          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (event.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
              event.preventDefault();
              lastElement.focus();
            }
          } else {
            // Tab
            if (document.activeElement === lastElement) {
              event.preventDefault();
              firstElement.focus();
            }
          }
        }
      },
      [isOpen, closeOnEscape, trapFocus, onClose, getFocusableElements]
    );

    // Handle backdrop click
    const handleBackdropClick = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        if (closeOnBackdropClick && event.target === backdropRef.current) {
          onClose();
        }
      },
      [closeOnBackdropClick, onClose]
    );

    // Handle close button click
    const handleCloseClick = useCallback(() => {
      onClose();
    }, [onClose]);

    // Effect for managing modal state
    useEffect(() => {
      if (isOpen) {
        // Store the currently focused element
        previousActiveElement.current = document.activeElement as HTMLElement;

        // Prevent body scroll if requested
        if (preventScroll) {
          document.body.style.overflow = "hidden";
        }

        // Add keyboard event listener
        document.addEventListener("keydown", handleKeyDown);

        // Focus management
        setTimeout(() => {
          if (initialFocus?.current) {
            initialFocus.current.focus();
          } else if (modalRef.current) {
            const focusableElements = getFocusableElements(modalRef.current);
            if (focusableElements.length > 0) {
              focusableElements[0].focus();
            } else {
              modalRef.current.focus();
            }
          }
        }, 100);
      } else {
        // Restore body scroll
        if (preventScroll) {
          document.body.style.overflow = "";
        }

        // Remove keyboard event listener
        document.removeEventListener("keydown", handleKeyDown);

        // Restore focus to the previously focused element
        if (finalFocus?.current) {
          finalFocus.current.focus();
        } else if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      }

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        if (preventScroll) {
          document.body.style.overflow = "";
        }
      };
    }, [
      isOpen,
      preventScroll,
      handleKeyDown,
      initialFocus,
      finalFocus,
      getFocusableElements,
    ]);

    // Don't render if not open
    if (!isOpen) return null;

    // Generate final class names
    const backdropFinalClassName = [
      "brutal-modal__backdrop",
      `brutal-modal__backdrop--${activeTheme}`,
      `brutal-modal__backdrop--${variant}`,
      overlayBlur && "brutal-modal__backdrop--blur",
      backdropClassName,
    ]
      .filter(Boolean)
      .join(" ");

    const modalFinalClassName = [
      modalClassName,
      `brutal-modal--${variant}`,
      `brutal-modal--${size}`,
      `brutal-modal--${activeTheme}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const contentFinalClassName = [
      "brutal-modal__content",
      `brutal-modal__content--${activeTheme}`,
      `brutal-modal__content--${variant}`,
      contentClassName,
    ]
      .filter(Boolean)
      .join(" ");

    // Modal content
    const modalContent = (
      <div
        ref={backdropRef}
        className={backdropFinalClassName}
        onClick={handleBackdropClick}
        style={combinedStyles}
      >
        <div
          ref={ref || modalRef}
          className={modalFinalClassName}
          role={role}
          aria-modal="true"
          aria-labelledby={
            ariaLabelledBy || (title ? "modal-title" : undefined)
          }
          aria-describedby={
            ariaDescribedBy || (description ? "modal-description" : undefined)
          }
          tabIndex={-1}
        >
          <div className={contentFinalClassName}>
            {/* Modal Header */}
            {(title || showCloseButton) && (
              <div className="brutal-modal__header">
                {title && (
                  <h2 id="modal-title" className="brutal-modal__title">
                    {title}
                  </h2>
                )}
                {showCloseButton && (
                  <button
                    type="button"
                    className="brutal-modal__close-button"
                    onClick={handleCloseClick}
                    aria-label="Close modal"
                  >
                    <span
                      className="brutal-modal__close-icon"
                      aria-hidden="true"
                    >
                      {activeTheme === "extreme-brutalist" ? "✕" : "×"}
                    </span>
                  </button>
                )}
              </div>
            )}

            {/* Modal Description */}
            {description && (
              <p id="modal-description" className="brutal-modal__description">
                {description}
              </p>
            )}

            {/* Modal Body */}
            <div className="brutal-modal__body">{children}</div>
          </div>

          {/* Complex layered effects */}
          <div className="brutal-modal__effects" aria-hidden="true">
            {/* Base shadow layer */}
            <div className="brutal-modal__shadow"></div>

            {/* Border animation layer */}
            <div className="brutal-modal__border-animation"></div>

            {/* Glow effect for refined theme */}
            {activeTheme === "refined-brutalist" && (
              <div className="brutal-modal__glow"></div>
            )}

            {/* Glitch effect for extreme theme */}
            {activeTheme === "extreme-brutalist" && (
              <div className="brutal-modal__glitch"></div>
            )}

            {/* Scan lines for extreme theme */}
            {activeTheme === "extreme-brutalist" && (
              <div className="brutal-modal__scan-lines"></div>
            )}
          </div>
        </div>
      </div>
    );

    // Render modal using portal
    return typeof window !== "undefined"
      ? createPortal(modalContent, document.body)
      : null;
  }
);

Modal.displayName = "Modal";
