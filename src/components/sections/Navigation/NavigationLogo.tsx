"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ThemeType } from "@/types/theme";

interface NavigationLogoProps {
  theme: ThemeType;
  className?: string;
}

export const NavigationLogo: React.FC<NavigationLogoProps> = ({
  theme,
  className = "",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const logoClasses = [
    "navigation-logo",
    `navigation-logo--${theme}`,
    isHovered ? "navigation-logo--hovered" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link
      href="/"
      className={logoClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Go to homepage"
    >
      {/* Main Logo Container */}
      <div className="navigation-logo__container">
        {/* Logo Text */}
        <div className="navigation-logo__text">
          <span className="navigation-logo__name">MUGISHA</span>
          <span className="navigation-logo__separator">.</span>
          <span className="navigation-logo__domain">DEV</span>
        </div>

        {/* Status Indicator */}
        <div className="navigation-logo__status">
          <div className="navigation-logo__status-dot"></div>
          <span className="navigation-logo__status-text">ONLINE</span>
        </div>

        {/* Glitch Effect Layers */}
        <div className="navigation-logo__glitch-layer navigation-logo__glitch-layer--1">
          <span className="navigation-logo__name">MUGISHA</span>
          <span className="navigation-logo__separator">.</span>
          <span className="navigation-logo__domain">DEV</span>
        </div>
        <div className="navigation-logo__glitch-layer navigation-logo__glitch-layer--2">
          <span className="navigation-logo__name">MUGISHA</span>
          <span className="navigation-logo__separator">.</span>
          <span className="navigation-logo__domain">DEV</span>
        </div>
      </div>

      {/* Shadow Layers */}
      <div className="navigation-logo__shadow navigation-logo__shadow--1"></div>
      <div className="navigation-logo__shadow navigation-logo__shadow--2"></div>
      <div className="navigation-logo__shadow navigation-logo__shadow--3"></div>

      {/* Border Effects */}
      <div className="navigation-logo__border-effect"></div>

      {/* Terminal Cursor */}
      <div className="navigation-logo__cursor">_</div>
    </Link>
  );
};
