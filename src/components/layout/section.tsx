import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  background?: "default" | "muted" | "accent";
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, padding = "lg", background = "default", ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(
          {
            "py-0": padding === "none",
            "py-8": padding === "sm",
            "py-12": padding === "md",
            "py-16": padding === "lg",
            "py-24": padding === "xl",
          },
          {
            "bg-black text-white": background === "default",
            "bg-brutalist-charcoal-100 text-white": background === "muted",
            "bg-brutalist-yellow text-black": background === "accent",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Section.displayName = "Section";

export { Section };