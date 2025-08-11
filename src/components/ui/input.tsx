import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full border-4 border-white bg-brutalist-charcoal-100 px-4 py-3 font-mono text-base text-white placeholder:text-brutalist-off-white-100 focus:outline-none focus:ring-2 focus:ring-brutalist-yellow focus:border-brutalist-yellow disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };