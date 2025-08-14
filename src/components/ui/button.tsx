import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useAnnouncement } from "@/lib/accessibility";
import { ScreenReaderOnly } from "@/components/accessibility/screen-reader-only";

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

    // Enhanced focus styles for accessibility (WCAG compliant)
    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-yellow focus-visible:ring-offset-4 focus-visible:ring-offset-black",
    "focus:outline-none focus:ring-4 focus:ring-accent-yellow focus:ring-offset-4 focus:ring-offset-black",

    // Disabled styles
    "disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",

    // Loading styles
    "data-[loading=true]:cursor-wait",

    // Enhanced hover transform with sophisticated animations
    "hover:transform hover:scale-[1.05] hover:-translate-y-2",

    // Enhanced active state with haptic feedback simulation
    "active:transform active:scale-[0.95] active:translate-y-1",

    // Reduced motion support
    "motion-reduce:transition-none motion-reduce:hover:transform-none motion-reduce:active:transform-none",

    // Advanced micro-interaction support
    "group",
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
          "hover:shadow-[12px_12px_0px_rgba(255,255,0,0.8)]",
          "active:shadow-[4px_4px_0px_rgba(255,255,0,0.6)]",
          "focus:shadow-[8px_8px_0px_rgba(255,255,0,0.9)]",
          "touch:hover:bg-accent-yellow touch:hover:text-black touch:hover:border-black touch:hover:shadow-none",
          // Enhanced micro-interactions
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-accent-yellow before:via-yellow-300 before:to-accent-yellow before:opacity-0 before:blur-lg before:transition-all before:duration-300",
          "hover:before:opacity-40 hover:before:scale-110",
        ],
        ghost: [
          "bg-transparent text-white border-white",
          "hover:bg-white hover:text-black hover:border-black",
          "hover:shadow-[12px_12px_0px_rgba(255,255,255,0.8)]",
          "active:shadow-[4px_4px_0px_rgba(255,255,255,0.6)]",
          "focus:shadow-[8px_8px_0px_rgba(255,255,255,0.9)]",
          "touch:hover:bg-transparent touch:hover:text-white touch:hover:border-white touch:hover:shadow-none",
          // Enhanced micro-interactions
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-white before:via-gray-200 before:to-white before:opacity-0 before:blur-lg before:transition-all before:duration-300",
          "hover:before:opacity-30 hover:before:scale-110",
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
  // Enhanced accessibility props
  ariaLabel?: string;
  ariaDescribedBy?: string;
  announceOnClick?: string;
  announceOnLoad?: string;
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
      ariaLabel,
      ariaDescribedBy,
      announceOnClick,
      announceOnLoad,
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
    const announce = useAnnouncement();

    // Combine refs
    React.useImperativeHandle(ref, () => buttonRef.current!);

    // Announce loading state changes
    React.useEffect(() => {
      if (loading && announceOnLoad) {
        announce(announceOnLoad, "polite");
      }
    }, [loading, announceOnLoad, announce]);

    // Handle click with enhanced micro-interactions and haptic feedback simulation
    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (loading || disabled) return;

        // Create enhanced ripple effect
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
          }, 800);
        }

        // Enhanced haptic feedback simulation through visual and transform feedback
        setIsPressed(true);

        // Advanced haptic simulation - multi-stage feedback
        if (buttonRef.current) {
          const button = buttonRef.current;

          // Stage 1: Initial press (immediate feedback)
          button.style.transform = "scale(0.95) translateY(2px)";
          button.style.filter = "brightness(1.1)";

          // Stage 2: Bounce back (tactile response simulation)
          setTimeout(() => {
            button.style.transform = "scale(1.02) translateY(-1px)";
            button.style.filter = "brightness(1.05)";
          }, 50);

          // Stage 3: Settle (completion feedback)
          setTimeout(() => {
            button.style.transform = "";
            button.style.filter = "";
            setIsPressed(false);
          }, 150);
        }

        // Sound design consideration - trigger visual feedback for audio cue
        if (buttonRef.current) {
          const sparkle = document.createElement("div");
          sparkle.className =
            "absolute top-0 right-0 w-2 h-2 bg-current rounded-full animate-ping pointer-events-none";
          sparkle.style.opacity = "0.8";
          buttonRef.current.appendChild(sparkle);

          setTimeout(() => {
            if (sparkle.parentNode) {
              sparkle.parentNode.removeChild(sparkle);
            }
          }, 600);
        }

        // Announce click action if specified
        if (announceOnClick) {
          announce(announceOnClick, "polite");
        }

        // Call original onClick
        onClick?.(event);
      },
      [loading, disabled, onClick, announce, announceOnClick]
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
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        {...props}
      >
        {/* Enhanced ripple effects with sophisticated animations */}
        {ripples.map((ripple) => (
          <React.Fragment key={ripple.id}>
            {/* Primary ripple */}
            <span
              className="pointer-events-none absolute animate-ping"
              style={{
                left: ripple.x - 15,
                top: ripple.y - 15,
                width: 30,
                height: 30,
                borderRadius: "50%",
                backgroundColor: "currentColor",
                opacity: 0.4,
                animationDuration: "0.8s",
              }}
            />
            {/* Secondary ripple for depth */}
            <span
              className="pointer-events-none absolute animate-pulse"
              style={{
                left: ripple.x - 8,
                top: ripple.y - 8,
                width: 16,
                height: 16,
                borderRadius: "50%",
                backgroundColor: "currentColor",
                opacity: 0.6,
                animationDuration: "0.4s",
                animationDelay: "0.1s",
              }}
            />
          </React.Fragment>
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
          <ScreenReaderOnly>{loadingText || "Loading..."}</ScreenReaderOnly>
        )}

        {/* Enhanced accessibility context */}
        {isPressed && <ScreenReaderOnly>Button activated</ScreenReaderOnly>}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
