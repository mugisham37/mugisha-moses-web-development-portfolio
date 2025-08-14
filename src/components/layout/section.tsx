import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  background?:
    | "default"
    | "muted"
    | "accent"
    | "light"
    | "dark-gradient"
    | "light-gradient"
    | "accent-gradient"
    | "textured-dark"
    | "textured-light";
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, padding = "lg", background = "default", ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(
          // Padding variants
          {
            "py-0": padding === "none",
            "py-8": padding === "sm",
            "py-12": padding === "md",
            "py-16": padding === "lg",
            "py-24": padding === "xl",
          },
          // Background variants with enhanced visual balance
          {
            // Core backgrounds
            "bg-black text-white transition-colors duration-500":
              background === "default",
            "bg-brutalist-charcoal-100 text-white transition-colors duration-500":
              background === "muted",
            "bg-brutalist-yellow text-black transition-colors duration-500":
              background === "accent",
            "bg-white text-black transition-colors duration-500":
              background === "light",

            // Gradient backgrounds for visual depth
            "via-brutalist-charcoal-200 bg-gradient-to-br from-black to-black text-white transition-all duration-500":
              background === "dark-gradient",
            "via-brutalist-off-white-200 to-brutalist-off-white-100 bg-gradient-to-br from-white text-black transition-all duration-500":
              background === "light-gradient",
            "from-brutalist-yellow via-accent-yellow-light to-brutalist-yellow bg-gradient-to-br text-black transition-all duration-500":
              background === "accent-gradient",

            // Textured backgrounds for subtle visual interest
            "relative overflow-hidden bg-black text-white transition-colors duration-500":
              background === "textured-dark",
            "relative overflow-hidden bg-white text-black transition-colors duration-500":
              background === "textured-light",
          },
          className
        )}
        {...props}
      >
        {/* Subtle texture overlays for enhanced visual depth */}
        {background === "textured-dark" && (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px] opacity-5" />
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_49%,rgba(255,255,255,0.05)_50%,transparent_51%)] bg-[length:40px_40px] opacity-3" />
          </>
        )}
        {background === "textured-light" && (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[length:20px_20px] opacity-5" />
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_49%,rgba(0,0,0,0.05)_50%,transparent_51%)] bg-[length:40px_40px] opacity-3" />
          </>
        )}

        {/* Content wrapper for proper z-index layering */}
        <div className="relative z-10">{props.children}</div>
      </section>
    );
  }
);
Section.displayName = "Section";

export { Section };
