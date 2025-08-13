import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  [
    // Base styles
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "font-mono font-bold uppercase tracking-wider",
    "border-4 border-solid",
    "touch-manipulation",
    "min-h-touch min-w-touch",
    "relative overflow-hidden",
    "transition-all duration-300 ease-out",
    "transform-gpu will-change-transform",

    // Focus styles for accessibility
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-black",

    // Disabled styles
    "disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",

    // Loading styles
    "data-[loading=true]:cursor-wait",

    // Hover transform base
    "hover:transform hover:scale-[1.02] hover:-translate-y-1",

    // Active state
    "active:transform active:scale-[0.98] active:translate-y-0",

    // Reduced motion support
    "motion-reduce:transition-none motion-reduce:hover:transform-none motion-reduce:active:transform-none",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-black text-white border-white",
          "hover:bg-white hover:text-black hover:border-black",
          "hover:shadow-brutalist-lg",
          "active:shadow-brutalist-sm",
          // Touch device fallbacks
          "touch:hover:bg-black touch:hover:text-white touch:hover:border-white touch:hover:shadow-none",
        ],
        secondary: [
          "bg-white text-black border-black",
          "hover:bg-black hover:text-white hover:border-white",
          "hover:shadow-brutalist-lg",
          "active:shadow-brutalist-sm",
          "touch:hover:bg-white touch:hover:text-black touch:hover:border-black touch:hover:shadow-none",
        ],
        accent: [
          "bg-accent-yellow text-black border-black",
          "hover:bg-black hover:text-accent-yellow hover:border-accent-yellow",
          "hover:shadow-accent-lg",
          "active:shadow-accent-sm",
          "touch:hover:bg-accent-yellow touch:hover:text-black touch:hover:border-black touch:hover:shadow-none",
        ],
        ghost: [
          "bg-transparent text-white border-white",
          "hover:bg-white hover:text-black hover:border-black",
          "hover:shadow-brutalist-lg",
          "active:shadow-brutalist-sm",
          "touch:hover:bg-transparent touch:hover:text-white touch:hover:border-white touch:hover:shadow-none",
        ],
        destructive: [
          "bg-red-600 text-white border-red-600",
          "hover:bg-red-700 hover:border-red-700",
          "hover:shadow-[8px_8px_0px_rgba(220,38,38,0.3)]",
          "active:shadow-[4px_4px_0px_rgba(220,38,38,0.3)]",
          "touch:hover:bg-red-600 touch:hover:border-red-600 touch:hover:shadow-none",
        ],
      },
      size: {
        sm: ["h-10 px-4 py-2 text-sm min-h-[44px]", "gap-1.5"],
        md: ["h-12 px-6 py-3 text-base min-h-[48px]", "gap-2"],
        lg: ["h-14 px-8 py-4 text-lg min-h-[52px]", "gap-2.5"],
        xl: ["h-16 px-10 py-5 text-xl min-h-[56px]", "gap-3"],
      },
      loading: {
        true: "cursor-wait",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      loading: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      loadingText,

      children,
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    const [isPressed, setIsPressed] = React.useState(false);
    const [ripples, setRipples] = React.useState<
      Array<{ id: number; x: number; y: number }>
    >([]);
    const buttonRef = React.useRef<HTMLButtonElement>(null);

    // Combine refs
    React.useImperativeHandle(ref, () => buttonRef.current!);

    // Handle click with micro-interactions
    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (loading || disabled) return;

        // Create ripple effect
        const rect = buttonRef.current?.getBoundingClientRect();
        if (rect) {
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;
          const newRipple = { id: Date.now(), x, y };

          setRipples((prev) => [...prev, newRipple]);

          // Remove ripple after animation
          setTimeout(() => {
            setRipples((prev) =>
              prev.filter((ripple) => ripple.id !== newRipple.id)
            );
          }, 600);
        }

        // Haptic feedback simulation (visual feedback for sound design consideration)
        setIsPressed(true);
        setTimeout(() => setIsPressed(false), 150);

        // Call original onClick
        onClick?.(event);
      },
      [loading, disabled, onClick]
    );

    // Handle keyboard interactions
    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === "Enter" || event.key === " ") {
          setIsPressed(true);
        }
        props.onKeyDown?.(event);
      },
      [props]
    );

    const handleKeyUp = React.useCallback(
      (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === "Enter" || event.key === " ") {
          setIsPressed(false);
        }
        props.onKeyUp?.(event);
      },
      [props]
    );

    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || loading;

    return (
      <Comp
        ref={buttonRef}
        className={cn(
          buttonVariants({ variant, size, loading, className }),
          isPressed && "translate-y-0 scale-[0.98] transform"
        )}
        disabled={isDisabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        data-loading={loading}
        aria-disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        {/* Ripple effects */}
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="pointer-events-none absolute animate-ping"
            style={{
              left: ripple.x - 10,
              top: ripple.y - 10,
              width: 20,
              height: 20,
              borderRadius: "50%",
              backgroundColor: "currentColor",
              opacity: 0.3,
            }}
          />
        ))}

        {/* Loading spinner */}
        {loading && (
          <Loader2
            className={cn(
              "animate-spin",
              size === "sm" && "h-3 w-3",
              size === "md" && "h-4 w-4",
              size === "lg" && "h-5 w-5",
              size === "xl" && "h-6 w-6"
            )}
            aria-hidden="true"
          />
        )}

        {/* Left icon */}
        {!loading && leftIcon && (
          <span
            className={cn(
              "flex-shrink-0",
              size === "sm" && "[&>*]:h-3 [&>*]:w-3",
              size === "md" && "[&>*]:h-4 [&>*]:w-4",
              size === "lg" && "[&>*]:h-5 [&>*]:w-5",
              size === "xl" && "[&>*]:h-6 [&>*]:w-6"
            )}
            aria-hidden="true"
          >
            {leftIcon}
          </span>
        )}

        {/* Button text */}
        <span className={cn(loading && "opacity-70")}>
          {loading && loadingText ? loadingText : children}
        </span>

        {/* Right icon */}
        {!loading && rightIcon && (
          <span
            className={cn(
              "flex-shrink-0",
              size === "sm" && "[&>*]:h-3 [&>*]:w-3",
              size === "md" && "[&>*]:h-4 [&>*]:w-4",
              size === "lg" && "[&>*]:h-5 [&>*]:w-5",
              size === "xl" && "[&>*]:h-6 [&>*]:w-6"
            )}
            aria-hidden="true"
          >
            {rightIcon}
          </span>
        )}

        {/* Screen reader loading announcement */}
        {loading && (
          <span className="sr-only">{loadingText || "Loading..."}</span>
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
