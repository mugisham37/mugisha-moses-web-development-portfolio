"use client";

import React, { useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SmoothScrollLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  offset?: number;
  duration?: number;
  external?: boolean;
  onClick?: () => void;
  [key: string]: unknown;
}

export function SmoothScrollLink({
  href,
  children,
  className = "",
  offset = 80, // Account for fixed header
  duration = 800,
  external = false,
  onClick,
  ...props
}: SmoothScrollLinkProps) {
  const router = useRouter();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Call custom onClick if provided
      if (onClick) {
        onClick();
      }

      // Handle external links normally
      if (external || href.startsWith("http") || href.startsWith("mailto")) {
        return;
      }

      // Handle hash links (same page)
      if (href.startsWith("#")) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          const targetPosition = targetElement.offsetTop - offset;

          // Smooth scroll to target
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });

          // Update URL hash without triggering navigation
          if (window.history.replaceState) {
            window.history.replaceState(null, "", href);
          }
        }
        return;
      }

      // Handle internal page navigation with smooth scroll to top
      if (href.startsWith("/")) {
        e.preventDefault();

        // Smooth scroll to top first
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

        // Navigate after scroll animation
        setTimeout(() => {
          router.push(href);
        }, duration / 2);
        return;
      }
    },
    [href, offset, duration, external, onClick, router]
  );

  // For external links, use regular anchor tag
  if (external || href.startsWith("http") || href.startsWith("mailto")) {
    return (
      <a
        href={href}
        className={className}
        onClick={handleClick}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        {...props}
      >
        {children}
      </a>
    );
  }

  // For internal links, use Next.js Link with custom click handler
  return (
    <Link href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}

// Hook for programmatic smooth scrolling
export function useSmoothScroll() {
  const scrollToElement = useCallback(
    (
      elementId: string,
      offset: number = 80,
      behavior: ScrollBehavior = "smooth"
    ) => {
      const element = document.getElementById(elementId);
      if (element) {
        const targetPosition = element.offsetTop - offset;
        window.scrollTo({
          top: targetPosition,
          behavior,
        });
      }
    },
    []
  );

  const scrollToTop = useCallback((behavior: ScrollBehavior = "smooth") => {
    window.scrollTo({
      top: 0,
      behavior,
    });
  }, []);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior,
    });
  }, []);

  return {
    scrollToElement,
    scrollToTop,
    scrollToBottom,
  };
}
