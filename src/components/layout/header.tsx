"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Container } from "@/components/layout/container";
import { SITE_CONFIG } from "@/lib/constants";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const pathname = usePathname();
  const isMobile = useIsMobile();

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
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

  // Hide desktop header on mobile devices
  if (isMobile) {
    return null;
  }

  return (
    <>
      <motion.header
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "border-b-4 border-white bg-black/95 backdrop-blur-sm"
            : "bg-transparent"
        } ${className}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Container>
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link
              href="/"
              className="group focus:ring-accent rounded-sm focus:ring-4 focus:outline-none"
              aria-label="Go to homepage"
            >
              <Typography
                variant="h3"
                weight="bold"
                transform="uppercase"
                className="group-hover:text-accent text-white transition-colors duration-200"
              >
                {SITE_CONFIG.author.name.split(" ")[0]}
              </Typography>
            </Link>

            {/* Desktop Navigation */}
            <nav
              className="hidden items-center space-x-8 lg:flex"
              role="navigation"
            >
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group focus:ring-accent relative rounded-sm focus:ring-4 focus:outline-none ${
                    isActiveLink(item.href)
                      ? "text-accent"
                      : "hover:text-accent text-white"
                  } transition-colors duration-200`}
                  aria-current={isActiveLink(item.href) ? "page" : undefined}
                >
                  <Typography
                    variant="body"
                    weight="bold"
                    transform="uppercase"
                    spacing="wide"
                    className="font-mono"
                  >
                    {item.label}
                  </Typography>

                  {/* Active indicator */}
                  {isActiveLink(item.href) && (
                    <motion.div
                      className="bg-accent absolute right-0 -bottom-2 left-0 h-1"
                      layoutId="activeIndicator"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* CTA Button - Desktop */}
            <div className="hidden lg:block">
              <Button
                variant="accent"
                size="md"
                className="font-mono tracking-wide uppercase"
                asChild
              >
                <Link href="/contact">Get In Touch</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="focus:ring-accent relative h-8 w-8 rounded-sm focus:ring-4 focus:outline-none lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center"
                animate={isMobileMenuOpen ? "open" : "closed"}
              >
                <motion.span
                  className="mb-1 block h-0.5 w-6 bg-white"
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: 45, y: 6 },
                  }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="mb-1 block h-0.5 w-6 bg-white"
                  variants={{
                    closed: { opacity: 1 },
                    open: { opacity: 0 },
                  }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="block h-0.5 w-6 bg-white"
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: -45, y: -6 },
                  }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>
            </button>
          </div>
        </Container>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Menu */}
            <motion.nav
              id="mobile-menu"
              className="absolute top-0 right-0 h-full w-80 max-w-[80vw] overflow-y-auto border-l-4 border-white bg-black"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              role="navigation"
              aria-label="Mobile navigation"
            >
              <div className="p-6 pt-20">
                {/* Mobile Navigation Items */}
                <div className="space-y-6">
                  {navigationItems.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        className={`group focus:ring-accent block rounded-sm focus:ring-4 focus:outline-none ${
                          isActiveLink(item.href)
                            ? "text-accent"
                            : "hover:text-accent text-white"
                        } transition-colors duration-200`}
                        aria-current={
                          isActiveLink(item.href) ? "page" : undefined
                        }
                      >
                        <Typography
                          variant="h4"
                          weight="bold"
                          transform="uppercase"
                          spacing="wide"
                          className="font-mono"
                        >
                          {item.label}
                        </Typography>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Mobile CTA */}
                <motion.div
                  className="mt-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button
                    variant="accent"
                    size="lg"
                    className="w-full font-mono tracking-wide uppercase"
                    asChild
                  >
                    <Link href="/contact">Get In Touch</Link>
                  </Button>
                </motion.div>

                {/* Social Links */}
                <motion.div
                  className="mt-12 border-t-2 border-white/20 pt-8"
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
                  <div className="space-y-3">
                    <Link
                      href={SITE_CONFIG.author.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-accent focus:ring-accent block rounded-sm text-white transition-colors duration-200 focus:ring-4 focus:outline-none"
                    >
                      <Typography
                        variant="body"
                        className="font-mono uppercase"
                      >
                        GitHub
                      </Typography>
                    </Link>
                    <Link
                      href={SITE_CONFIG.author.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-accent focus:ring-accent block rounded-sm text-white transition-colors duration-200 focus:ring-4 focus:outline-none"
                    >
                      <Typography
                        variant="body"
                        className="font-mono uppercase"
                      >
                        LinkedIn
                      </Typography>
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
