"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Container } from "@/components/layout/container";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { SmoothScrollLink } from "@/components/ui/smooth-scroll-link";
import { MobileNavigation } from "@/components/mobile/mobile-navigation";
import { SITE_CONFIG } from "@/lib/constants";
import { useIsMobile } from "@/hooks/use-mobile";
import { useScrollRestoration } from "@/hooks/use-scroll-restoration";
import { cn } from "@/lib/utils";
import { SkipNavigation } from "@/components/accessibility/skip-navigation";

interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
}

const navigationItems: NavigationItem[] = [
  { label: "HOME", href: "/" },
  { label: "PROJECTS", href: "/projects" },
  { label: "BLOG", href: "/blog" },
  { label: "SERVICES", href: "/services" },
  { label: "TESTIMONIALS", href: "/testimonials" },
  { label: "CONTACT", href: "/contact" },
];

interface MainHeaderProps {
  className?: string;
}

export function MainHeader({ className = "" }: MainHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const headerRef = useRef<HTMLElement>(null);

  // Initialize scroll restoration
  useScrollRestoration({
    enabled: true,
    restoreDelay: 150,
    saveThrottle: 100,
  });

  // Enhanced scroll behavior with direction detection
  const { scrollY } = useScroll();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrolled = currentScrollY > 20;

      // Determine scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }

      setIsScrolled(scrolled);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Enhanced keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }

      // Tab navigation enhancement
      if (event.key === "Tab" && isMobileMenuOpen) {
        const focusableElements = headerRef.current?.querySelectorAll(
          'a[href], button, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements && focusableElements.length > 0) {
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[
            focusableElements.length - 1
          ] as HTMLElement;

          if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          } else if (
            !event.shiftKey &&
            document.activeElement === lastElement
          ) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  // Enhanced mobile menu toggle with gesture support
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  // Handle mobile menu gestures
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (isMobileMenuOpen && e.touches.length === 1) {
        const touch = e.touches[0];
        const startX = touch.clientX;

        const handleTouchMove = (moveEvent: TouchEvent) => {
          const currentTouch = moveEvent.touches[0];
          const deltaX = currentTouch.clientX - startX;

          // Close menu on swipe right (> 100px)
          if (deltaX > 100) {
            setIsMobileMenuOpen(false);
            document.removeEventListener("touchmove", handleTouchMove);
          }
        };

        document.addEventListener("touchmove", handleTouchMove, {
          passive: true,
        });

        const handleTouchEnd = () => {
          document.removeEventListener("touchmove", handleTouchMove);
          document.removeEventListener("touchend", handleTouchEnd);
        };

        document.addEventListener("touchend", handleTouchEnd, { once: true });
      }
    },
    [isMobileMenuOpen]
  );

  return (
    <>
      {/* Enhanced Skip Navigation Links for Accessibility */}
      <SkipNavigation />

      <motion.header
        ref={headerRef}
        className={cn(
          "fixed top-0 right-0 left-0 z-50 transition-all duration-300",
          "border-b-4 border-transparent",
          isScrolled && [
            "border-white bg-black backdrop-blur-md",
            "shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
          ],
          !isScrolled && "bg-transparent",
          // Hide header on scroll down (mobile UX enhancement)
          isMobile &&
            scrollDirection === "down" &&
            isScrolled &&
            "-translate-y-full",
          className
        )}
        initial={{ y: -100, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          backdropFilter: isScrolled ? `blur(${16}px)` : `blur(${8}px)`,
        }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
          opacity: { duration: 0.3 },
        }}
        style={{
          backgroundColor: isScrolled
            ? `rgba(0, 0, 0, ${0.95})`
            : `rgba(0, 0, 0, ${0.8})`,
        }}
      >
        <Container>
          <div className="flex items-center justify-between py-4">
            {/* Enhanced Logo with micro-interactions */}
            <SmoothScrollLink
              href="/"
              className={cn(
                "group focus:ring-accent-yellow relative rounded-sm focus:ring-4 focus:outline-none",
                "transition-all duration-300 ease-out",
                "hover:-translate-y-0.5 hover:scale-105"
              )}
              aria-label="Go to homepage"
            >
              <Typography
                variant="h3"
                weight="bold"
                transform="uppercase"
                className={cn(
                  "text-white transition-all duration-300",
                  "group-hover:text-accent-yellow",
                  "font-mono tracking-wider",
                  "relative z-10"
                )}
              >
                {SITE_CONFIG.author.name.split(" ")[0]}
              </Typography>

              {/* Logo accent effect */}
              <motion.div
                className="bg-accent-yellow/10 absolute inset-0 -z-10 rounded-sm"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            </SmoothScrollLink>

            {/* Enhanced Desktop Navigation */}
            <nav
              className="hidden items-center space-x-8 lg:flex"
              role="navigation"
              aria-label="Main navigation"
            >
              {navigationItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                >
                  <SmoothScrollLink
                    href={item.href}
                    className={cn(
                      "group relative rounded-sm focus:ring-4 focus:outline-none",
                      "focus:ring-accent-yellow focus:ring-offset-2 focus:ring-offset-black",
                      "transition-all duration-300 ease-out",
                      "hover:-translate-y-1 hover:scale-105",
                      "block px-1 py-2",
                      isActiveLink(item.href)
                        ? "text-accent-yellow"
                        : "hover:text-accent-yellow text-white"
                    )}
                    aria-current={isActiveLink(item.href) ? "page" : undefined}
                  >
                    <Typography
                      variant="body"
                      weight="bold"
                      transform="uppercase"
                      spacing="wide"
                      className={cn(
                        "relative z-10 font-mono",
                        "transition-all duration-300"
                      )}
                    >
                      {item.label}
                    </Typography>

                    {/* Sophisticated hover underline */}
                    <motion.div
                      className="bg-accent-yellow absolute right-0 bottom-0 left-0 h-0.5 origin-left"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />

                    {/* Active indicator with enhanced animation */}
                    {isActiveLink(item.href) && (
                      <motion.div
                        className="bg-accent-yellow absolute right-0 bottom-0 left-0 h-1"
                        layoutId="activeIndicator"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}

                    {/* Background glow effect */}
                    <motion.div
                      className="bg-accent-yellow/5 absolute inset-0 -z-10 rounded-sm"
                      initial={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </SmoothScrollLink>
                </motion.div>
              ))}
            </nav>

            {/* Enhanced CTA Button - Desktop */}
            <motion.div
              className="hidden lg:block"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Button
                variant="accent"
                size="md"
                className={cn(
                  "font-mono tracking-wide uppercase",
                  "hover:shadow-accent-lg hover:scale-105",
                  "transition-all duration-300 ease-out",
                  "hover:border-accent-yellow border-4 border-black"
                )}
                asChild
              >
                <Link href="/contact">Get In Touch</Link>
              </Button>
            </motion.div>

            {/* Enhanced Mobile Menu Button */}
            <motion.button
              className={cn(
                "relative h-12 w-12 rounded-sm focus:ring-4 focus:outline-none lg:hidden",
                "focus:ring-accent-yellow focus:ring-offset-2 focus:ring-offset-black",
                "transition-all duration-300 ease-out",
                "hover:scale-105 hover:bg-white/10",
                "border-2 border-transparent hover:border-white/20"
              )}
              onClick={toggleMobileMenu}
              onTouchStart={handleTouchStart}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center gap-1"
                animate={isMobileMenuOpen ? "open" : "closed"}
              >
                <motion.span
                  className="block h-0.5 w-6 rounded-full bg-white"
                  variants={{
                    closed: { rotate: 0, y: 0, backgroundColor: "#ffffff" },
                    open: { rotate: 45, y: 4, backgroundColor: "#ffff00" },
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
                <motion.span
                  className="block h-0.5 w-6 rounded-full bg-white"
                  variants={{
                    closed: { opacity: 1, scaleX: 1 },
                    open: { opacity: 0, scaleX: 0 },
                  }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="block h-0.5 w-6 rounded-full bg-white"
                  variants={{
                    closed: { rotate: 0, y: 0, backgroundColor: "#ffffff" },
                    open: { rotate: -45, y: -4, backgroundColor: "#ffff00" },
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              </motion.div>

              {/* Button background effect */}
              <motion.div
                className="bg-accent-yellow/10 absolute inset-0 rounded-sm"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            </motion.button>
          </div>
        </Container>
      </motion.header>

      {/* Enhanced Mobile Menu Overlay */}
      <AnimatePresence mode="wait">
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* Enhanced Backdrop with blur */}
            <motion.div
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(16px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              onClick={() => setIsMobileMenuOpen(false)}
              transition={{ duration: 0.3 }}
            />

            {/* Enhanced Mobile Menu */}
            <motion.nav
              id="mobile-menu"
              className={cn(
                "absolute top-0 right-0 h-full w-80 max-w-[85vw]",
                "border-accent-yellow overflow-y-auto border-l-4",
                "bg-black shadow-2xl"
              )}
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                opacity: { duration: 0.2 },
              }}
              role="navigation"
              aria-label="Mobile navigation"
              onTouchStart={handleTouchStart}
            >
              <div className="p-6 pt-20">
                {/* Enhanced Mobile Navigation Items */}
                <div className="space-y-2">
                  {navigationItems.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 30, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 30, scale: 0.9 }}
                      transition={{
                        delay: index * 0.1,
                        duration: 0.4,
                        ease: "easeOut",
                      }}
                    >
                      <SmoothScrollLink
                        href={item.href}
                        className={cn(
                          "group relative block rounded-sm focus:ring-4 focus:outline-none",
                          "focus:ring-accent-yellow focus:ring-offset-2 focus:ring-offset-black",
                          "transition-all duration-300 ease-out",
                          "hover:-translate-x-2 hover:scale-105",
                          "border-l-4 border-transparent p-4",
                          "hover:border-accent-yellow hover:bg-white/5",
                          isActiveLink(item.href)
                            ? "text-accent-yellow border-accent-yellow bg-white/10"
                            : "hover:text-accent-yellow text-white"
                        )}
                        aria-current={
                          isActiveLink(item.href) ? "page" : undefined
                        }
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Typography
                          variant="h4"
                          weight="bold"
                          transform="uppercase"
                          spacing="wide"
                          className={cn(
                            "font-mono transition-all duration-300",
                            "group-hover:translate-x-2"
                          )}
                        >
                          {item.label}
                        </Typography>

                        {/* Mobile active indicator */}
                        {isActiveLink(item.href) && (
                          <motion.div
                            className="bg-accent-yellow absolute top-1/2 right-4 h-2 w-2 -translate-y-1/2 rounded-full"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                          />
                        )}

                        {/* Hover effect background */}
                        <motion.div
                          className="from-accent-yellow/5 absolute inset-0 rounded-sm bg-gradient-to-r to-transparent"
                          initial={{ scaleX: 0, originX: 0 }}
                          whileHover={{ scaleX: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      </SmoothScrollLink>
                    </motion.div>
                  ))}
                </div>

                {/* Enhanced Mobile CTA */}
                <motion.div
                  className="mt-12 px-4"
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 30, scale: 0.9 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                >
                  <Button
                    variant="accent"
                    size="lg"
                    className={cn(
                      "w-full font-mono tracking-wide uppercase",
                      "hover:shadow-accent-xl hover:scale-105",
                      "transition-all duration-300 ease-out",
                      "border-4 border-black hover:border-white"
                    )}
                    asChild
                  >
                    <Link href="/contact">Get In Touch</Link>
                  </Button>
                </motion.div>

                {/* Enhanced Social Links */}
                <motion.div
                  className="border-accent-yellow/30 mt-12 border-t-2 px-4 pt-8"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ delay: 0.7, duration: 0.4 }}
                >
                  <Typography
                    variant="caption"
                    transform="uppercase"
                    spacing="wide"
                    className="text-accent-yellow mb-6 font-mono font-bold"
                  >
                    Connect
                  </Typography>
                  <div className="space-y-4">
                    {[
                      { label: "GitHub", href: SITE_CONFIG.author.github },
                      { label: "LinkedIn", href: SITE_CONFIG.author.linkedin },
                    ].map((social, index) => (
                      <motion.div
                        key={social.label}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                      >
                        <Link
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            "group flex items-center justify-between",
                            "rounded-sm border-2 border-white/20 p-3",
                            "hover:border-accent-yellow hover:bg-white/5",
                            "focus:ring-accent-yellow focus:ring-4 focus:outline-none",
                            "transition-all duration-300 ease-out",
                            "hover:-translate-y-1 hover:scale-105"
                          )}
                        >
                          <Typography
                            variant="body"
                            className="group-hover:text-accent-yellow font-mono text-white uppercase transition-colors duration-300"
                          >
                            {social.label}
                          </Typography>
                          <motion.div
                            className="group-hover:bg-accent-yellow h-2 w-2 rounded-full bg-white"
                            whileHover={{ scale: 1.5 }}
                            transition={{ duration: 0.2 }}
                          />
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Navigation Component */}
      <MobileNavigation />

      {/* Scroll Progress Indicator */}
      <ScrollProgress
        color="accent"
        height="thin"
        position="top"
        smooth={true}
        className="z-50"
      />
    </>
  );
}
