"use client";

import React from "react";
import { Typography } from "@/components/ui/typography";

interface SkipNavProps {
  links?: Array<{
    href: string;
    label: string;
  }>;
  className?: string;
}

const defaultLinks = [
  { href: "#main-content", label: "Skip to main content" },
  { href: "#navigation", label: "Skip to navigation" },
  { href: "#footer", label: "Skip to footer" },
];

export function SkipNav({
  links = defaultLinks,
  className = "",
}: SkipNavProps) {
  return (
    <div className={`sr-only focus-within:not-sr-only ${className}`}>
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="bg-accent absolute top-4 left-4 z-[100] -translate-y-full transform rounded-sm px-4 py-2 font-mono text-sm font-bold tracking-wide text-black uppercase transition-transform duration-200 focus:translate-y-0 focus:ring-4 focus:ring-white focus:outline-none"
        >
          <Typography variant="sm" weight="bold" transform="uppercase">
            {link.label}
          </Typography>
        </a>
      ))}
    </div>
  );
}
