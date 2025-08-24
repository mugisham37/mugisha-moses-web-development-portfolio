"use client";

import React, { useState, useEffect } from "react";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useScrollProgressData } from "@/hooks/useScrollProgress";
import { NavigationLogo } from "./NavigationLogo";
import { NavigationMenu } from "./NavigationMenu";
import { NavigationCTA } from "./NavigationCTA";
import { MobileMenu } from "./MobileMenu";

interface NavigationProps {
  className?: string;
}

export const Navigation: React.FC<NavigationProps> = ({ className = "" }) => {
  const { currentTheme, config } = useThemeContext();
  const { scrollY, progress } = useScrollProgressData();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Update scroll state
  useEffect(() => {
    setIsScrolled(scrollY > 50);
  }, [scrollY]);

  // Close mobile menu when theme changes or screen resizes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentTheme]);

  // Handle mobile menu toggle
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const navigationClasses = [
    "navigation",
    `navigation--${currentTheme}`,
    isScrolled ? "navigation--scrolled" : "",
    isMobileMenuOpen ? "navigation--mobile-open" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <nav
        className={navigationClasses}
        style={
          {
            "--scroll-progress": progress,
            "--scroll-y": `${scrollY}px`,
          } as React.CSSProperties
        }
      >
        <div className="navigation__container">
          {/* Logo Section */}
          <div className="navigation__logo-section">
            <NavigationLogo theme={currentTheme} />
          </div>

          {/* Desktop Menu */}
          <div className="navigation__menu-section">
            <NavigationMenu theme={currentTheme} />
          </div>

          {/* CTA Section */}
          <div className="navigation__cta-section">
            <NavigationCTA theme={currentTheme} />
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={`navigation__mobile-toggle navigation__mobile-toggle--${currentTheme}`}
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            <div className="navigation__hamburger">
              <span className="navigation__hamburger-line"></span>
              <span className="navigation__hamburger-line"></span>
              <span className="navigation__hamburger-line"></span>
            </div>
          </button>
        </div>

        {/* Scroll Progress Indicator */}
        <div
          className="navigation__progress"
          style={{ transform: `scaleX(${progress})` }}
        />
      </nav>

      {/* Mobile Menu Overlay */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        theme={currentTheme}
      />
    </>
  );
};
