"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "./theme-provider";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  variant?: "button" | "dropdown" | "inline";
  className?: string;
}

const ThemeToggle = React.forwardRef<HTMLDivElement, ThemeToggleProps>(
  ({ variant = "button", className }, ref) => {
    const { theme, setTheme, actualTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted) {
      return null;
    }

    if (variant === "button") {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(actualTheme === "dark" ? "light" : "dark")}
          className={cn("h-10 w-10 p-0", className)}
        >
          {actualTheme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      );
    }

    if (variant === "inline") {
      return (
        <div ref={ref} className={cn("flex items-center gap-2", className)}>
          <button
            onClick={() => setTheme("light")}
            className={cn(
              "p-2 border-2 border-white transition-all duration-200",
              theme === "light" 
                ? "bg-white text-black" 
                : "bg-transparent text-white hover:bg-white hover:text-black"
            )}
          >
            <Sun className="h-4 w-4" />
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={cn(
              "p-2 border-2 border-white transition-all duration-200",
              theme === "dark" 
                ? "bg-white text-black" 
                : "bg-transparent text-white hover:bg-white hover:text-black"
            )}
          >
            <Moon className="h-4 w-4" />
          </button>
          <button
            onClick={() => setTheme("system")}
            className={cn(
              "p-2 border-2 border-white transition-all duration-200",
              theme === "system" 
                ? "bg-white text-black" 
                : "bg-transparent text-white hover:bg-white hover:text-black"
            )}
          >
            <Monitor className="h-4 w-4" />
          </button>
        </div>
      );
    }

    // Dropdown variant
    return (
      <div ref={ref} className={cn("relative", className)}>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as "light" | "dark" | "system")}
          className="bg-black text-white border-2 border-white font-mono text-sm uppercase tracking-wider p-2 focus:outline-none focus:ring-2 focus:ring-brutalist-yellow"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
      </div>
    );
  }
);

ThemeToggle.displayName = "ThemeToggle";

export { ThemeToggle };