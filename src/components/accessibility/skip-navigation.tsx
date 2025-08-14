"use client";

import React from "react";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

interface SkipLink {
  href: string;
  label: string;
  description?: string;
}

interface SkipNavigationProps {
  links?: SkipLink[];
  className?: string;
}

const defaultSkipLinks: SkipLink[] = [
  {
    href: "#main-content",
    label: "Skip to main content",
    description: "Jump to the main content area",
  },
  {
    href: "#navigation",
    label: "Skip to navigation",
    description: "Jump to the main navigation menu",
  },
  {
    href: "#search",
    label: "Skip to search",
    description: "Jump to the search functionality",
  },
  {
    href: "#footer",
    label: "Skip to footer",
    description: "Jump to the footer section",
  },
];

/**
 * Enhanced skip navigation component for improved accessibility
 * Provides keyboard users with quick navigation options
 */
export function SkipNavigation({
  links = defaultSkipLinks,
  className = "",
}: SkipNavigationProps) {
  const handleSkipClick = (href: string) => {
    const target = document.querySelector(href);
    if (target instanceof HTMLElement) {
      // Set focus to target element
      target.focus();

      // If target is not focusable, make it temporarily focusable
      if (!target.hasAttribute("tabindex")) {
        target.setAttribute("tabindex", "-1");
        target.addEventListener(
          "blur",
          () => target.removeAttribute("tabindex"),
          { once: true }
        );
      }

      // Smooth scroll to target
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // Announce to screen readers
      const announcement = `Skipped to ${target.getAttribute("aria-label") || target.textContent || href}`;
      const liveRegion = document.createElement("div");
      liveRegion.setAttribute("aria-live", "polite");
      liveRegion.setAttribute("aria-atomic", "true");
      liveRegion.className = "sr-only";
      liveRegion.textContent = announcement;
      document.body.appendChild(liveRegion);

      setTimeout(() => {
        document.body.removeChild(liveRegion);
      }, 1000);
    }
  };

  return (
    <nav
      className={cn("sr-only focus-within:not-sr-only", className)}
      aria-label="Skip navigation"
    >
      <div className="fixed top-4 left-4 z-[9999] flex flex-col gap-2">
        {links.map((link) => (
          <button
            key={link.href}
            onClick={() => handleSkipClick(link.href)}
            className={cn(
              // Base styles
              "-translate-y-full transform opacity-0",
              "focus:translate-y-0 focus:opacity-100",
              "transition-all duration-200 ease-out",

              // Visual design
              "bg-accent-yellow text-black",
              "border-4 border-black",
              "rounded-sm px-6 py-3",

              // Typography
              "font-mono text-sm font-bold tracking-wide uppercase",

              // Interactive states
              "hover:scale-105 hover:bg-yellow-300",
              "active:scale-95 active:bg-yellow-500",

              // Focus styles
              "focus:ring-4 focus:ring-white focus:outline-none",
              "focus:ring-offset-4 focus:ring-offset-black",

              // Shadow for depth
              "shadow-[4px_4px_0px_rgba(0,0,0,0.3)]",
              "hover:shadow-[6px_6px_0px_rgba(0,0,0,0.3)]"
            )}
            aria-describedby={
              link.description ? `skip-desc-${link.href.slice(1)}` : undefined
            }
          >
            <Typography
              variant="label"
              weight="bold"
              transform="uppercase"
              className="text-black"
            >
              {link.label}
            </Typography>

            {link.description && (
              <span id={`skip-desc-${link.href.slice(1)}`} className="sr-only">
                {link.description}
              </span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
