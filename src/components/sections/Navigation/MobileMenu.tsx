"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  description: string;
}

const mobileMenuItems: MenuItem[] = [
  {
    id: "home",
    label: "HOME",
    href: "/",
    description: "Back to home",
  },
  {
    id: "projects",
    label: "PROJECTS",
    href: "/projects",
    description: "View my work",
  },
  {
    id: "experience",
    label: "EXPERIENCE",
    href: "/experience",
    description: "My journey",
  },
  {
    id: "contact",
    label: "CONTACT",
    href: "/contact",
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
  const pathname = usePathname();

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
      <div className="mobile-menu__backdrop"></div>

      <div className="mobile-menu__container">
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

        <nav className="mobile-menu__nav">
          <ul className="mobile-menu__list">
            {mobileMenuItems.map((item, index) => {
              const isActive = pathname === item.href;

              return (
                <li
                  key={item.id}
                  className={`mobile-menu__item ${isActive ? "mobile-menu__item--active" : ""}`}
                  style={{ "--item-index": index } as React.CSSProperties}
                >
                  <Link
                    href={item.href}
                    className="mobile-menu__link"
                    onClick={onClose}
                    prefetch={true}
                  >
                    <div className="mobile-menu__link-content">
                      <div className="mobile-menu__link-main">
                        <span className="mobile-menu__link-text">
                          {item.label}
                        </span>
                      </div>
                      <span className="mobile-menu__link-description">
                        {item.description}
                      </span>
                    </div>

                    <div className="mobile-menu__link-arrow">
                      <span className="mobile-menu__arrow-line"></span>
                      <span className="mobile-menu__arrow-head">&gt;</span>
                    </div>

                    <div className="mobile-menu__link-shadow"></div>
                    <div className="mobile-menu__link-border"></div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mobile-menu__footer">
          <div className="mobile-menu__terminal">
            <span className="mobile-menu__terminal-text">
              &gt; MOBILE_NAVIGATION_ACTIVE
            </span>
            <span className="mobile-menu__terminal-cursor">_</span>
          </div>

          <div className="mobile-menu__cta">
            <Link
              href="/contact"
              className="mobile-menu__cta-button"
              onClick={onClose}
              prefetch={true}
            >
              <span className="mobile-menu__cta-text">HIRE ME</span>
              <div className="mobile-menu__cta-effects">
                <div className="mobile-menu__cta-shadow"></div>
                <div className="mobile-menu__cta-border"></div>
              </div>
            </Link>
          </div>
        </div>

        <div className="mobile-menu__scan-lines">
          <div className="mobile-menu__scan-line mobile-menu__scan-line--1"></div>
          <div className="mobile-menu__scan-line mobile-menu__scan-line--2"></div>
          <div className="mobile-menu__scan-line mobile-menu__scan-line--3"></div>
        </div>

        <div className="mobile-menu__grid-bg"></div>
      </div>
    </div>
  );
};
