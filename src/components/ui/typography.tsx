import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const typographyVariants = cva(
  "transition-all duration-300 ease-out text-crisp font-feature-normal",
  {
    variants: {
      variant: {
        // Enhanced display variants with fluid responsive scaling
        display: [
          "font-mono font-black uppercase tracking-tighter leading-none",
          "text-fluid-display typography-scale-display",
          "text-balance font-feature-display",
        ].join(" "),

        // Enhanced heading hierarchy with improved responsive scaling
        h1: [
          "font-mono font-bold uppercase tracking-tight leading-tight",
          "text-fluid-7xl typography-scale-hero",
          "text-balance font-feature-mono",
        ].join(" "),

        h2: [
          "font-mono font-bold uppercase tracking-tight leading-tight",
          "text-fluid-6xl",
          "text-balance font-feature-mono",
        ].join(" "),

        h3: [
          "font-mono font-bold uppercase tracking-tight leading-snug",
          "text-fluid-5xl typography-scale-heading",
          "text-balance font-feature-mono",
        ].join(" "),

        h4: [
          "font-mono font-bold uppercase tracking-tight leading-snug",
          "text-fluid-4xl",
          "text-balance font-feature-mono",
        ].join(" "),

        h5: [
          "font-mono font-semibold uppercase tracking-normal leading-normal",
          "text-fluid-3xl",
          "text-balance font-feature-mono",
        ].join(" "),

        h6: [
          "font-mono font-semibold uppercase tracking-normal leading-normal",
          "text-fluid-2xl",
          "text-balance font-feature-mono",
        ].join(" "),

        // Enhanced body text variants with optimal readability
        body: [
          "font-sans font-normal leading-loose",
          "text-fluid-base typography-scale-body",
          "text-pretty font-feature-normal",
        ].join(" "),

        bodyLarge: [
          "font-sans font-normal leading-relaxed",
          "text-fluid-lg",
          "text-pretty font-feature-normal",
        ].join(" "),

        bodySmall: [
          "font-sans font-normal leading-relaxed",
          "text-fluid-sm",
          "text-pretty font-feature-normal",
        ].join(" "),

        // Enhanced specialized text variants
        lead: [
          "font-sans font-medium leading-relaxed",
          "text-fluid-xl",
          "text-pretty font-feature-normal",
        ].join(" "),

        subtitle: [
          "font-mono font-medium uppercase tracking-wide leading-normal",
          "text-fluid-lg",
          "text-balance font-feature-mono",
        ].join(" "),

        caption: [
          "font-mono font-normal uppercase tracking-wider leading-tight",
          "text-fluid-sm",
          "text-balance font-feature-mono",
        ].join(" "),

        overline: [
          "font-mono font-bold uppercase tracking-widest leading-none",
          "text-fluid-xs",
          "text-balance font-feature-mono",
        ].join(" "),

        // Enhanced code and technical text
        code: [
          "font-mono font-normal leading-tight",
          "text-sm font-feature-mono",
          "bg-brutalist-charcoal-100 dark:bg-brutalist-charcoal-200",
          "px-2 py-1 border border-white dark:border-gray-300",
          "rounded-none",
        ].join(" "),

        codeBlock: [
          "font-mono font-normal leading-relaxed",
          "text-sm font-feature-mono",
          "bg-brutalist-charcoal-100 dark:bg-brutalist-charcoal-200",
          "p-4 border-2 border-white dark:border-gray-300",
          "rounded-none overflow-x-auto",
        ].join(" "),

        // Enhanced legacy compatibility variants
        large: [
          "font-sans font-normal leading-relaxed",
          "text-fluid-lg",
          "text-pretty font-feature-normal",
        ].join(" "),

        small: [
          "font-sans font-normal leading-relaxed",
          "text-fluid-sm",
          "text-pretty font-feature-normal",
        ].join(" "),

        sm: [
          "font-sans font-normal leading-relaxed",
          "text-fluid-sm",
          "text-pretty font-feature-normal",
        ].join(" "),

        xs: [
          "font-sans font-normal leading-relaxed",
          "text-fluid-xs",
          "text-pretty font-feature-normal",
        ].join(" "),

        xl: [
          "font-mono font-bold uppercase tracking-tight leading-tight",
          "text-fluid-5xl",
          "text-balance font-feature-mono",
        ].join(" "),

        // New enhanced variants for better hierarchy
        hero: [
          "font-mono font-black uppercase tracking-tighter leading-none",
          "text-fluid-8xl typography-scale-hero",
          "text-balance font-feature-display",
        ].join(" "),

        subhero: [
          "font-sans font-medium leading-snug",
          "text-fluid-2xl",
          "text-pretty font-feature-normal",
        ].join(" "),

        quote: [
          "font-sans font-medium italic leading-relaxed",
          "text-fluid-xl",
          "text-pretty font-feature-normal",
        ].join(" "),

        label: [
          "font-mono font-semibold uppercase tracking-wide leading-tight",
          "text-fluid-xs",
          "text-balance font-feature-mono",
        ].join(" "),
      },

      weight: {
        light: "font-light",
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
        extrabold: "font-extrabold",
        black: "font-black",
      },

      transform: {
        none: "",
        uppercase: "uppercase",
        lowercase: "lowercase",
        capitalize: "capitalize",
      },

      spacing: {
        tighter: "tracking-tighter",
        tight: "tracking-tight",
        normal: "tracking-normal",
        wide: "tracking-wide",
        wider: "tracking-wider",
        widest: "tracking-widest",
      },

      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
        justify: "text-justify",
      },

      color: {
        default: "",
        primary: "text-primary",
        secondary: "text-secondary",
        accent: "text-accent",
        muted: "text-muted-foreground",
        success: "text-green-500",
        warning: "text-yellow-500",
        error: "text-red-500",
        info: "text-blue-500",
      },
    },

    defaultVariants: {
      variant: "body",
      weight: "normal",
      transform: "none",
      spacing: "normal",
      align: "left",
      color: "default",
    },
  }
);

export interface TypographyProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "color">,
    VariantProps<typeof typographyVariants> {
  as?: React.ElementType;
  responsive?: boolean;
  truncate?: boolean;
  gradient?: boolean;
  fluid?: boolean;
  balance?: boolean;
  pretty?: boolean;
  optimize?: boolean;
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  (
    {
      className,
      variant,
      weight,
      transform,
      spacing,
      align,
      color,
      as,
      responsive = true,
      truncate = false,
      gradient = false,
      fluid = true,
      balance = true,
      pretty = true,
      optimize = true,
      ...props
    },
    ref
  ) => {
    const Component = as || getDefaultElement(variant);

    const combinedClassName = cn(
      typographyVariants({
        variant,
        weight,
        transform,
        spacing,
        align,
        color,
      }),
      {
        // Enhanced responsive font scaling
        "responsive-text": responsive && !fluid,
        // Text truncation utility
        truncate: truncate,
        // Gradient text effect for accent elements
        "bg-gradient-to-r from-accent to-accent-foreground bg-clip-text text-transparent":
          gradient,
        // Enhanced text wrapping
        "text-balance": balance && !pretty,
        "text-pretty": pretty && !balance,
        // Enhanced text rendering optimization
        "text-crisp": optimize,
        // Font feature settings based on variant
        "font-feature-mono":
          variant?.includes("h") || variant === "display" || variant === "hero",
        "font-feature-normal":
          !variant?.includes("h") &&
          variant !== "display" &&
          variant !== "hero",
      },
      className
    );

    return React.createElement(Component as React.ElementType, {
      className: combinedClassName,
      ref,
      ...props,
    });
  }
);

Typography.displayName = "Typography";

function getDefaultElement(
  variant: TypographyProps["variant"]
): React.ElementType {
  switch (variant) {
    case "display":
    case "hero":
    case "h1":
      return "h1";
    case "h2":
    case "xl":
      return "h2";
    case "h3":
      return "h3";
    case "h4":
      return "h4";
    case "h5":
      return "h5";
    case "h6":
      return "h6";
    case "lead":
    case "subtitle":
    case "subhero":
    case "quote":
      return "p";
    case "caption":
    case "overline":
    case "label":
    case "small":
    case "sm":
    case "xs":
      return "small";
    case "code":
      return "code";
    case "codeBlock":
      return "pre";
    case "bodyLarge":
    case "bodySmall":
    case "body":
    case "large":
    default:
      return "p";
  }
}

export { Typography, typographyVariants };
