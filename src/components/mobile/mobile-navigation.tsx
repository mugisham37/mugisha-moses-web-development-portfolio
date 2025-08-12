"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  FolderOpen,
  FileText,
  Briefcase,
  MessageSquare,
  Star,
  Menu,
  X,
} from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { useTouchGestures } from "@/hooks/use-touch-gestures";
import { useIsMobile } from "@/hooks/use-mobile";
import { SITE_CONFIG } from "@/lib/constants";

interface NavigationItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const navigationItems: NavigationItem[] = [
  {
    label: "HOME",
    href: "/",
    icon: Home,
    description: "Back to homepage",
  },
  {
    label: "PROJECTS",
    href: "/projects",
    icon: FolderOpen,
    description: "View my work",
  },
  {
    label: "BLOG",
    href: "/blog",
    icon: FileText,
    description: "Read my thoughts",
  },
  {
    label: "SERVICES",
    href: "/services",
    icon: Briefcase,
    description: "What I offer",
  },
  {
    label: "TESTIMONIALS",
    href: "/testimonials",
    icon: Star,
    description: "Client feedback",
  },
  {
    label: "CONTACT",
    href: "/contact",
    icon: MessageSquare,
    description: "Get in touch",
  },
];

interface MobileNavigationProps {
  className?: string;
}

/**
 * Mobile-optimized navigation with touch gestures and brutalist styling
 * Features swipe gestures, large touch targets, and smooth animations
 */
export function MobileNavigation({ className = "" }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isMobile = useIsMobile();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [isOpen]);

  // Touch gestures for menu
  const { attachGestures } = useTouchGestures({
    onSwipeRight: () => {
      if (!isOpen) setIsOpen(true);
    },
    onSwipeLeft: () => {
      if (isOpen) setIsOpen(false);
    },
    swipeThreshold: 50,
  });

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  // Only render on mobile devices
  if (!isMobile) {
    return null;
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        className={`fixed top-4 right-4 z-50 flex h-12 w-12 items-center justify-center border-4 border-white bg-black text-white transition-all duration-200 hover:bg-white hover:text-black focus:ring-4 focus:ring-yellow-400 focus:outline-none ${className}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        whileTap={{ scale: 0.95 }}
        style={{
          minWidth: "48px",
          minHeight: "48px",
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Panel */}
            <motion.nav
              className="absolute inset-y-0 right-0 w-full max-w-sm border-l-4 border-white bg-black"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.4,
              }}
              ref={attachGestures}
              role="navigation"
              aria-label="Mobile navigation"
            >
              <div className="flex h-full flex-col p-6 pt-20">
                {/* Brand */}
                <div className="mb-8">
                  <Typography
                    variant="h2"
                    weight="bold"
                    transform="uppercase"
                    className="text-yellow-400"
                  >
                    {SITE_CONFIG.author.name.split(" ")[0]}
                  </Typography>
                  <Typography
                    variant="caption"
                    className="font-mono tracking-wider text-white/60 uppercase"
                  >
                    Developer Portfolio
                  </Typography>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 space-y-2">
                  {navigationItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = isActiveLink(item.href);

                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href={item.href}
                          className={`group flex items-center gap-4 rounded-none border-2 p-4 transition-all duration-200 focus:ring-4 focus:ring-yellow-400 focus:outline-none ${
                            isActive
                              ? "border-yellow-400 bg-yellow-400 text-black"
                              : "border-white/20 text-white hover:border-white hover:bg-white hover:text-black"
                          }`}
                          style={{
                            minHeight: "56px", // Large touch target
                          }}
                          aria-current={isActive ? "page" : undefined}
                        >
                          <Icon className="h-6 w-6 flex-shrink-0" />
                          <div className="flex-1">
                            <Typography
                              variant="body"
                              weight="bold"
                              transform="uppercase"
                              className="font-mono"
                            >
                              {item.label}
                            </Typography>
                            <Typography
                              variant="caption"
                              className={`font-mono ${
                                isActive ? "text-black/70" : "text-white/60"
                              }`}
                            >
                              {item.description}
                            </Typography>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Social Links */}
                <motion.div
                  className="border-t-2 border-white/20 pt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Typography
                    variant="caption"
                    transform="uppercase"
                    spacing="wide"
                    className="mb-4 font-mono text-white/60"
                  >
                    Connect
                  </Typography>
                  <div className="flex gap-3">
                    <Link
                      href={SITE_CONFIG.author.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-12 w-12 items-center justify-center border-2 border-white/20 text-white transition-all duration-200 hover:border-white hover:bg-white hover:text-black focus:ring-4 focus:ring-yellow-400 focus:outline-none"
                    >
                      <span className="sr-only">GitHub</span>
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </Link>
                    <Link
                      href={SITE_CONFIG.author.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-12 w-12 items-center justify-center border-2 border-white/20 text-white transition-all duration-200 hover:border-white hover:bg-white hover:text-black focus:ring-4 focus:ring-yellow-400 focus:outline-none"
                    >
                      <span className="sr-only">LinkedIn</span>
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </Link>
                  </div>
                </motion.div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
