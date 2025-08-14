"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import {
  Home,
  FolderOpen,
  FileText,
  Briefcase,
  MessageSquare,
  Star,
  Menu,
  X,
  ChevronRight,
  Wifi,
  Battery,
  Signal,
} from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { useTouchGestures } from "@/hooks/use-touch-gestures";
import { useIsMobile } from "@/hooks/use-mobile";
import { SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

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
 * Enhanced Mobile-optimized navigation with advanced touch gestures and native-like experience
 * Features swipe gestures, haptic feedback, large touch targets, and smooth animations
 */
export function MobileNavigation({ className = "" }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);
  const [isConnected, setIsConnected] = useState(true);
  const [batteryLevel, setBatteryLevel] = useState(100);
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const menuRef = useRef<HTMLDivElement>(null);
  const lastTapTime = useRef(0);

  // Enhanced connectivity and battery status
  useEffect(() => {
    const updateConnectionStatus = () => {
      setIsConnected(navigator.onLine);
    };

    const updateBatteryStatus = async () => {
      if ("getBattery" in navigator) {
        try {
          const battery = await (navigator as any).getBattery();
          setBatteryLevel(Math.round(battery.level * 100));
        } catch (error) {
          // Fallback for browsers that don't support battery API
          setBatteryLevel(100);
        }
      }
    };

    window.addEventListener("online", updateConnectionStatus);
    window.addEventListener("offline", updateConnectionStatus);
    updateBatteryStatus();

    return () => {
      window.removeEventListener("online", updateConnectionStatus);
      window.removeEventListener("offline", updateConnectionStatus);
    };
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
    setDragProgress(0);
  }, [pathname]);

  // Enhanced keyboard handling
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        setDragProgress(0);
      }

      // Enhanced accessibility - arrow key navigation
      if (isOpen && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
        event.preventDefault();
        const focusableElements = menuRef.current?.querySelectorAll(
          "a[href], button:not([disabled])"
        );

        if (focusableElements && focusableElements.length > 0) {
          const currentIndex = Array.from(focusableElements).indexOf(
            document.activeElement as Element
          );

          let nextIndex;
          if (event.key === "ArrowDown") {
            nextIndex =
              currentIndex < focusableElements.length - 1
                ? currentIndex + 1
                : 0;
          } else {
            nextIndex =
              currentIndex > 0
                ? currentIndex - 1
                : focusableElements.length - 1;
          }

          (focusableElements[nextIndex] as HTMLElement).focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Enhanced body scroll prevention with viewport handling
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      // Add safe area padding for devices with notches
      document.body.style.paddingTop = "env(safe-area-inset-top)";
      document.body.style.paddingBottom = "env(safe-area-inset-bottom)";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.body.style.paddingTop = "";
      document.body.style.paddingBottom = "";

      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.body.style.paddingTop = "";
      document.body.style.paddingBottom = "";
    };
  }, [isOpen]);

  // Enhanced touch gestures with haptic feedback
  const { attachGestures } = useTouchGestures({
    onSwipeRight: () => {
      if (!isOpen) {
        setIsOpen(true);
        // Haptic feedback simulation
        if ("vibrate" in navigator) {
          navigator.vibrate(50);
        }
      }
    },
    onSwipeLeft: () => {
      if (isOpen) {
        setIsOpen(false);
        setDragProgress(0);
        // Haptic feedback simulation
        if ("vibrate" in navigator) {
          navigator.vibrate(30);
        }
      }
    },
    swipeThreshold: 75, // Increased threshold for better UX
  });

  // Enhanced drag handling for menu
  const handleDrag = useCallback((event: any, info: PanInfo) => {
    const { offset } = info;
    const progress = Math.max(0, Math.min(1, offset.x / 300));
    setDragProgress(progress);
  }, []);

  const handleDragEnd = useCallback((event: any, info: PanInfo) => {
    const { offset, velocity } = info;
    const shouldClose = offset.x > 150 || velocity.x > 500;

    if (shouldClose) {
      setIsOpen(false);
      setDragProgress(0);
      // Haptic feedback
      if ("vibrate" in navigator) {
        navigator.vibrate(30);
      }
    } else {
      setDragProgress(0);
    }
  }, []);

  // Double tap to close
  const handleDoubleTap = useCallback(() => {
    const now = Date.now();
    if (now - lastTapTime.current < 300) {
      setIsOpen(false);
      setDragProgress(0);
      // Haptic feedback
      if ("vibrate" in navigator) {
        navigator.vibrate([30, 50, 30]);
      }
    }
    lastTapTime.current = now;
  }, []);

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  // Enhanced menu toggle with animation states
  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
    setDragProgress(0);
    // Haptic feedback
    if ("vibrate" in navigator) {
      navigator.vibrate(40);
    }
  }, []);

  // Only render on mobile devices
  if (!isMobile) {
    return null;
  }

  return (
    <>
      {/* Enhanced Mobile Menu Button with Status Indicators */}
      <motion.div className="safe-area-inset fixed top-0 right-0 z-50">
        {/* Status Bar Simulation */}
        <div className="flex w-full items-center justify-between border-b-2 border-white/20 bg-black/90 px-4 py-2 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="font-mono text-xs text-white">
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Signal
              className={cn(
                "h-3 w-3",
                isConnected ? "text-white" : "text-red-400"
              )}
            />
            <Wifi
              className={cn(
                "h-3 w-3",
                isConnected ? "text-white" : "text-red-400"
              )}
            />
            <div className="flex items-center gap-1">
              <Battery
                className={cn(
                  "h-3 w-3",
                  batteryLevel > 20 ? "text-white" : "text-red-400"
                )}
              />
              <span className="font-mono text-xs text-white">
                {batteryLevel}%
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced Menu Button */}
        <motion.button
          className={cn(
            "flex h-14 w-14 items-center justify-center",
            "border-4 border-white bg-black text-white",
            "transition-all duration-300 ease-out",
            "focus:ring-4 focus:ring-yellow-400 focus:outline-none",
            "active:scale-95 active:bg-yellow-400 active:text-black",
            "safe-area-inset",
            className
          )}
          onClick={toggleMenu}
          onTouchStart={() => {
            // Immediate visual feedback
            if ("vibrate" in navigator) {
              navigator.vibrate(10);
            }
          }}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation-menu"
          whileTap={{ scale: 0.9 }}
          style={{
            minWidth: "56px",
            minHeight: "56px",
            touchAction: "manipulation",
          }}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -180, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 180, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <X className="h-7 w-7" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 180, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: -180, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Menu className="h-7 w-7" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Button press indicator */}
          <motion.div
            className="absolute inset-0 bg-yellow-400 opacity-0"
            animate={{ opacity: isOpen ? 0.2 : 0 }}
            transition={{ duration: 0.2 }}
          />
        </motion.button>
      </motion.div>

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

            {/* Enhanced Menu Panel with Native-like Experience */}
            <motion.nav
              ref={menuRef}
              id="mobile-navigation-menu"
              className={cn(
                "absolute inset-y-0 right-0 w-full max-w-sm",
                "border-l-4 border-white bg-black",
                "safe-area-inset overflow-y-auto",
                "scrollbar-thin scrollbar-track-black scrollbar-thumb-yellow-400"
              )}
              initial={{ x: "100%", opacity: 0 }}
              animate={{
                x: dragProgress > 0 ? `${100 - dragProgress * 100}%` : 0,
                opacity: 1,
              }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 40,
                duration: 0.5,
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 300 }}
              dragElastic={0.2}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
              onTouchStart={handleDoubleTap}
              ref={attachGestures}
              role="navigation"
              aria-label="Mobile navigation menu"
              style={{
                touchAction: "pan-x",
              }}
            >
              <div className="flex h-full flex-col safe-area-inset">
                {/* Drag Indicator */}
                <div className="flex justify-center py-3 border-b-2 border-white/10">
                  <div className="w-12 h-1 bg-white/40 rounded-full" />
                </div>

                <div className="flex-1 p-6 pt-8">
                  {/* Enhanced Brand Section */}
                  <motion.div 
                    className="mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-yellow-400 border-2 border-white flex items-center justify-center">
                        <Typography
                          variant="h3"
                          weight="bold"
                          className="text-black font-mono"
                        >
                          {SITE_CONFIG.author.name.charAt(0)}
                        </Typography>
                      </div>
                      <div>
                        <Typography
                          variant="h3"
                          weight="bold"
                          transform="uppercase"
                          className="text-yellow-400 leading-tight"
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
                    </div>
                    
                    {/* Status Indicator */}
                    <div className="flex items-center gap-2 text-green-400">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <Typography variant="caption" className="font-mono uppercase">
                        Available for Projects
                      </Typography>
                    </div>
                  </motion.div>

                  {/* Enhanced Navigation Items */}
                  <div className="flex-1 space-y-3">
                    {navigationItems.map((item, index) => {
                      const Icon = item.icon;
                      const isActive = isActiveLink(item.href);

                      return (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, x: 30, scale: 0.9 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          transition={{ 
                            delay: 0.2 + (index * 0.1),
                            duration: 0.4,
                            ease: "easeOut"
                          }}
                        >
                          <Link
                            href={item.href}
                            className={cn(
                              "group flex items-center gap-4 p-5 transition-all duration-300",
                              "border-2 focus:ring-4 focus:ring-yellow-400 focus:outline-none",
                              "active:scale-98 active:bg-yellow-400 active:text-black active:border-yellow-400",
                              isActive
                                ? "border-yellow-400 bg-yellow-400 text-black shadow-[4px_4px_0px_rgba(0,0,0,0.3)]"
                                : "border-white/20 text-white hover:border-white hover:bg-white/10"
                            )}
                            style={{
                              minHeight: "64px", // Enhanced touch target
                              touchAction: "manipulation",
                            }}
                            aria-current={isActive ? "page" : undefined}
                            onClick={() => {
                              // Haptic feedback on navigation
                              if ('vibrate' in navigator) {
                                navigator.vibrate(25);
                              }
                            }}
                          >
                            <div className={cn(
                              "flex items-center justify-center w-10 h-10 border-2 transition-all duration-300",
                              isActive 
                                ? "border-black bg-black text-yellow-400" 
                                : "border-white/40 group-hover:border-white group-hover:bg-white group-hover:text-black"
                            )}>
                              <Icon className="h-5 w-5 flex-shrink-0" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <Typography
                                variant="body"
                                weight="bold"
                                transform="uppercase"
                                className="font-mono leading-tight truncate"
                              >
                                {item.label}
                              </Typography>
                              <Typography
                                variant="caption"
                                className={cn(
                                  "font-mono text-sm leading-tight truncate",
                                  isActive ? "text-black/70" : "text-white/60 group-hover:text-black/60"
                                )}
                              >
                                {item.description}
                              </Typography>
                            </div>

                            <ChevronRight className={cn(
                              "h-5 w-5 flex-shrink-0 transition-transform duration-300",
                              "group-hover:translate-x-1",
                              isActive ? "text-black/70" : "text-white/40 group-hover:text-black/60"
                            )} />

                            {/* Active indicator */}
                            {isActive && (
                              <motion.div
                                className="absolute left-0 top-0 bottom-0 w-1 bg-black"
                                layoutId="activeIndicator"
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                              />
                            )}

                            {/* Hover effect background */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100"
                              transition={{ duration: 0.3 }}
                            />
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
