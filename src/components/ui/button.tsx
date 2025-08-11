import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-mono font-bold uppercase tracking-wider transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 border-4 border-white",
  {
    variants: {
      variant: {
        primary: "bg-black text-white hover:bg-white hover:text-black hover:shadow-brutalist",
        secondary: "bg-white text-black hover:bg-black hover:text-white hover:shadow-brutalist",
        accent: "bg-brutalist-yellow text-black hover:bg-black hover:text-brutalist-yellow hover:shadow-brutalist-yellow",
        ghost: "bg-transparent text-white border-white hover:bg-white hover:text-black hover:shadow-brutalist",
      },
      size: {
        sm: "h-10 px-4 py-2 text-sm",
        md: "h-12 px-6 py-3 text-base",
        lg: "h-14 px-8 py-4 text-lg",
        xl: "h-16 px-10 py-5 text-xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };