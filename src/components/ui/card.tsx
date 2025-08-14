import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "relative border-4 border-white bg-black transition-all duration-300 ease-out overflow-hidden group",
  {
    variants: {
      variant: {
        default: "bg-black text-white border-white",
        elevated:
          "bg-brutalist-charcoal-100 text-white border-white shadow-brutalist-md",
        accent: "bg-brutalist-yellow text-black border-black",
        outline: "bg-transparent text-white border-white",
        interactive: "cursor-pointer hover:border-brutalist-yellow",
      },
      size: {
        sm: "min-h-[200px]",
        md: "min-h-[280px]",
        lg: "min-h-[360px]",
        xl: "min-h-[440px]",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
        xl: "p-12",
      },
      hover: {
        none: "",
        lift: "hover:transform hover:-translate-y-2 hover:shadow-brutalist-xl hover:border-brutalist-yellow transition-all duration-300",
        glow: "hover:shadow-accent-lg hover:border-brutalist-yellow transition-all duration-300",
        invert:
          "hover:bg-white hover:text-black hover:border-black transition-all duration-300",
        scale:
          "hover:scale-[1.02] hover:shadow-brutalist-lg hover:border-brutalist-yellow transition-all duration-300",
      },
      animation: {
        none: "",
        subtle: "hover:shadow-brutalist-md transition-all duration-200",
        smooth:
          "hover:shadow-brutalist-lg transition-all duration-300 ease-out",
        bounce: "hover:animate-bounce-subtle",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      padding: "md",
      hover: "none",
      animation: "smooth",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  isLoading?: boolean;
  hasImage?: boolean;
}

// Loading state component for cards
const CardLoadingState = () => (
  <div className="space-y-4">
    <div className="bg-brutalist-charcoal-100 h-4 animate-pulse rounded" />
    <div className="bg-brutalist-charcoal-100 h-4 w-3/4 animate-pulse rounded" />
    <div className="bg-brutalist-charcoal-100 h-20 animate-pulse rounded" />
    <div className="bg-brutalist-charcoal-100 h-4 w-1/2 animate-pulse rounded" />
  </div>
);

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      size,
      padding,
      hover,
      animation,
      isLoading,
      hasImage,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({ variant, size, padding, hover, animation }),
          isLoading && "animate-pulse",
          hasImage && "overflow-hidden",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <CardLoadingState />
        ) : (
          <>
            {children}
            {/* Brutalist design accent elements */}
            <div className="bg-brutalist-yellow absolute -top-1 -right-1 h-3 w-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="bg-brutalist-yellow absolute -bottom-1 -left-1 h-3 w-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </>
        )}
      </div>
    );
  }
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "centered" | "minimal";
  }
>(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-3",
      variant === "centered" && "items-center text-center",
      variant === "minimal" && "space-y-2",
      className
    )}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    variant?: "default" | "accent" | "minimal";
  }
>(({ className, level = 3, variant = "default", ...props }, ref) => {
  return React.createElement(
    `h${level}`,
    {
      ref,
      className: cn(
        "font-mono leading-tight font-bold tracking-wider uppercase",
        level === 1 && "text-4xl lg:text-5xl",
        level === 2 && "text-3xl lg:text-4xl",
        level === 3 && "text-2xl lg:text-3xl",
        level === 4 && "text-xl lg:text-2xl",
        level === 5 && "text-lg lg:text-xl",
        level === 6 && "text-base lg:text-lg",
        variant === "accent" && "text-brutalist-yellow",
        variant === "minimal" &&
          "text-base font-medium tracking-normal normal-case",
        className
      ),
      ...props,
    }
  );
});
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & {
    variant?: "default" | "muted" | "accent";
  }
>(({ className, variant = "default", ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-sm leading-relaxed",
      variant === "default" && "text-brutalist-off-white-100",
      variant === "muted" && "text-brutalist-charcoal-200",
      variant === "accent" && "text-brutalist-yellow",
      className
    )}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "padded" | "flush";
  }
>(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex-1",
      variant === "default" && "space-y-4",
      variant === "padded" && "space-y-4 p-2",
      variant === "flush" && "space-y-2",
      className
    )}
    {...props}
  />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "actions" | "minimal";
  }
>(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center",
      variant === "default" &&
        "border-brutalist-charcoal-200 justify-between border-t pt-4",
      variant === "actions" && "justify-end gap-2 pt-4",
      variant === "minimal" && "pt-2",
      className
    )}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

// Enhanced card components for specific use cases
const CardImage = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    src?: string;
    alt?: string;
    aspectRatio?: "square" | "video" | "portrait" | "landscape";
    loading?: "lazy" | "eager";
  }
>(
  (
    { className, src, alt, aspectRatio = "video", loading = "lazy", ...props },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        "bg-brutalist-charcoal-100 relative overflow-hidden",
        aspectRatio === "square" && "aspect-square",
        aspectRatio === "video" && "aspect-video",
        aspectRatio === "portrait" && "aspect-[3/4]",
        aspectRatio === "landscape" && "aspect-[4/3]",
        className
      )}
      {...props}
    >
      {src ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt || ""}
            loading={loading}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </>
      ) : (
        <div className="text-brutalist-charcoal-200 flex h-full w-full items-center justify-center">
          <div className="text-4xl">📷</div>
        </div>
      )}
    </div>
  )
);
CardImage.displayName = "CardImage";

const CardBadge = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & {
    variant?: "default" | "accent" | "outline";
  }
>(({ className, variant = "default", ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "inline-flex items-center px-2 py-1 text-xs font-bold tracking-wider uppercase",
      variant === "default" && "bg-brutalist-charcoal-100 text-white",
      variant === "accent" && "bg-brutalist-yellow text-black",
      variant === "outline" && "border border-white text-white",
      className
    )}
    {...props}
  />
));
CardBadge.displayName = "CardBadge";

const CardActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "horizontal" | "vertical" | "stacked";
  }
>(({ className, variant = "horizontal", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex gap-2",
      variant === "horizontal" && "flex-row",
      variant === "vertical" && "flex-col",
      variant === "stacked" && "flex-col sm:flex-row",
      className
    )}
    {...props}
  />
));
CardActions.displayName = "CardActions";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardImage,
  CardBadge,
  CardActions,
};
