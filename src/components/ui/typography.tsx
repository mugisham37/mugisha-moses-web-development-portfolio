import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const typographyVariants = cva("", {
  variants: {
    variant: {
      display: "font-mono font-bold uppercase tracking-tight text-display leading-none",
      h1: "font-mono font-bold uppercase tracking-tight text-6xl leading-tight",
      h2: "font-mono font-bold uppercase tracking-tight text-5xl leading-tight",
      h3: "font-mono font-bold uppercase tracking-tight text-4xl leading-tight",
      h4: "font-mono font-bold uppercase tracking-tight text-3xl leading-tight",
      h5: "font-mono font-bold uppercase tracking-tight text-2xl leading-tight",
      h6: "font-mono font-bold uppercase tracking-tight text-xl leading-tight",
      body: "font-sans text-base leading-relaxed",
      large: "font-sans text-lg leading-relaxed",
      small: "font-sans text-sm leading-relaxed",
      caption: "font-mono text-xs uppercase tracking-wider",
      code: "font-mono text-sm bg-brutalist-charcoal-100 px-2 py-1 border border-white",
      // Additional variants for compatibility
      sm: "font-sans text-sm leading-relaxed",
      xs: "font-sans text-xs leading-relaxed",
      xl: "font-mono font-bold uppercase tracking-tight text-5xl leading-tight",
    },
    weight: {
      normal: "font-normal",
      bold: "font-bold",
    },
    transform: {
      none: "",
      uppercase: "uppercase",
      lowercase: "lowercase",
      capitalize: "capitalize",
    },
    spacing: {
      tight: "tracking-tight",
      normal: "tracking-normal",
      wide: "tracking-wide",
      wider: "tracking-wider",
    },
  },
  defaultVariants: {
    variant: "body",
    weight: "normal",
    transform: "none",
    spacing: "normal",
  },
});

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: React.ElementType;
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant, weight, transform, spacing, as, ...props }, ref) => {
    const Component = as || getDefaultElement(variant);
    
    return React.createElement(Component as React.ElementType, {
      className: cn(typographyVariants({ variant, weight, transform, spacing, className })),
      ref,
      ...props,
    });
  }
);

Typography.displayName = "Typography";

function getDefaultElement(variant: TypographyProps["variant"]): React.ElementType {
  switch (variant) {
    case "display":
    case "h1":
      return "h1";
    case "h2":
      return "h2";
    case "h3":
      return "h3";
    case "h4":
      return "h4";
    case "h5":
      return "h5";
    case "h6":
      return "h6";
    case "caption":
    case "small":
    case "sm":
    case "xs":
      return "small";
    case "code":
      return "code";
    case "xl":
      return "h2";
    default:
      return "p";
  }
}

export { Typography, typographyVariants };