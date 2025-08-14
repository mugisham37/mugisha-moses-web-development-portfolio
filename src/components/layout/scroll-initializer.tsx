"use client";

import { useEffect } from "react";
import {
  handleHashScroll,
  enableSmoothScrollLinks,
  smoothScrollTo,
} from "@/lib/scroll-utils";

interface ScrollInitializerProps {
  hashScrollOffset?: number;
  enableSmoothLinks?: boolean;
  enableScrollRestoration?: boolean;
}

export function ScrollInitializer({
  hashScrollOffset = 80,
  enableSmoothLinks = true,
  enableScrollRestoration = true,
}: ScrollInitializerProps) {
  useEffect(() => {
    // Handle hash scroll on page load
    handleHashScroll(hashScrollOffset);

    // Enable smooth scrolling for internal links
    if (enableSmoothLinks) {
      enableSmoothScrollLinks(hashScrollOffset);
    }

    // Add CSS smooth scrolling behavior as fallback
    if (typeof document !== "undefined") {
      document.documentElement.style.scrollBehavior = "smooth";
    }

    // Enhanced keyboard navigation for scroll
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Home" && e.ctrlKey) {
        e.preventDefault();
        smoothScrollTo(0, { duration: 600 });
      } else if (e.key === "End" && e.ctrlKey) {
        e.preventDefault();
        smoothScrollTo(document.documentElement.scrollHeight, {
          duration: 600,
        });
      }
    };

    // Handle browser back/forward navigation with hash
    const handlePopState = () => {
      setTimeout(() => {
        handleHashScroll(hashScrollOffset);
      }, 100);
    };

    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("popstate", handlePopState);
      if (typeof document !== "undefined") {
        document.documentElement.style.scrollBehavior = "";
      }
    };
  }, [hashScrollOffset, enableSmoothLinks, enableScrollRestoration]);

  // This component doesn't render anything
  return null;
}
