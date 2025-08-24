"use client";

import React, { useEffect, useState } from "react";
import { ThemeType } from "@/types/theme";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeType;
  className?: string;
}

interface MenuItem {
  id: string;
  label: string;
  href: string;
  badge?: string;
  description: string;
}

const mobileMenuItems: MenuItem[] = [
  {
    id: "home",
    label: "HOME",
    href: "#hero",
    description: "Back to top",
  },
  {
    id: "projects",
    label: "PROJECTS",
    href: "#projects",
    badge: "NEW",
    description: "View my work",
  },
  {
    id: "experience",
    label: "EXPERIENCE",
    href: "#experience",
    description: "My journey",
  },
  {
    id: "results",
    label: "RESULTS",
    href: "#results",
    badge: "HOT",
    description: "Success stories",
  },
  {
    id: "contact",
    label: "CONTACT",
    href: "#contact",
    description: "Let's connect",
  },
];

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  theme,
  className = "",
}) => {
  const [animationState, setAnimationState] = useState<
    "closed" | "opening" | "open" | "closing"
  >("closed");

  // Handle animation states
  useEffect(() => {
    if (isOpen) {
      setAnimationState("opening");
      const timer = setTimeout(() => setAnimationState("open"), 50);
      return () => clearTimeout(timer);
    } else {
      if (animationState === "open") {
        setAnimationState("closing");
        const timer = setTimeout(() => setAnimationState("closed"), 300);
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, animationState]);

  // Handle menu item click
  const handleItemClick = (item: MenuItem) => {
    // Smooth scroll to section
    const element = document.querySelector(item.href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }

    // Close menu after a short delay
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (animationState === "closed") {
    return null;
  }

  const overlayClasses = [
    "mobile-menu",
    `mobile-menu--${theme}`,
    `mobile-menu--${animationState}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={overlayClasses}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation menu"
    >
      {/* Backdrop */}
      <div className="mobile-menu__backdrop"></div>

      {/* Menu Container */}
      <div className="mobile-menu__container">
        {/* Header */}
        <div className="mobile-menu__header">
          <div className="mobile-menu__logo">
            <span className="mobile-menu__logo-text">MUGISHA.DEV</span>
            <div className="mobile-menu__status">
              <div className="mobile-menu__status-dot"></div>
              <span className="mobile-menu__status-text">MOBILE</span>
            </div>
          </div>

          <button
            className="mobile-menu__close"
            onClick={onClose}
            aria-label="Close menu"
          >
            <span className="mobile-menu__close-line"></span>
            <span className="mobile-menu__close-line"></span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="mobile-menu__nav">
          <ul className="mobile-menu__list">
            {mobileMenuItems.map((item, index) => (
              <li
                key={item.id}
                className="mobile-menu__item"
                style={{ "--item-index": index } as React.CSSProperties}
              >
                <button
                  className="mobile-menu__link"
                  onClick={() => handleItemClick(item)}
                >
                  <div className="mobile-menu__link-content">
                    <div className="mobile-menu__link-main">
                      <span className="mobile-menu__link-text">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="mobile-menu__badge">{item.badge}</span>
                      )}
                    </div>
                    <span className="mobile-menu__link-description">
                      {item.description}
                    </span>
                  </div>

                  <div className="mobile-menu__link-arrow">
                    <span className="mobile-menu__arrow-line"></span>
                    <span className="mobile-menu__arrow-head">&gt;</span>
                  </div>

                  {/* Hover Effects */}
                  <div className="mobile-menu__link-shadow"></div>
                  <div className="mobile-menu__link-border"></div>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="mobile-menu__footer">
          <div className="mobile-menu__terminal">
            <span className="mobile-menu__terminal-text">
              &gt; MOBILE_NAVIGATION_ACTIVE
            </span>
            <span className="mobile-menu__terminal-cursor">_</span>
          </div>

          <div className="mobile-menu__cta">
            <button
              className="mobile-menu__cta-button"
              onClick={() =>
                handleItemClick({
                  id: "contact",
                  label: "CONTACT",
                  href: "#contact",
                  description: "Let's connect",
                })
              }
            >
              <span className="mobile-menu__cta-text">HIRE ME</span>
              <div className="mobile-menu__cta-effects">
                <div className="mobile-menu__cta-shadow"></div>
                <div className="mobile-menu__cta-border"></div>
              </div>
            </button>
          </div>
        </div>

        {/* Scan Lines Effect */}
        <div className="mobile-menu__scan-lines">
          <div className="mobile-menu__scan-line mobile-menu__scan-line--1"></div>
          <div className="mobile-menu__scan-line mobile-menu__scan-line--2"></div>
          <div className="mobile-menu__scan-line mobile-menu__scan-line--3"></div>
        </div>

        {/* Grid Background */}
        <div className="mobile-menu__grid-bg"></div>
      </div>
    </div>
  );
};
