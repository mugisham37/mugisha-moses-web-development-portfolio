"use client";

import React, { useState } from "react";
import { ThemeType } from "@/types/theme";

interface NavigationMenuProps {
  theme: ThemeType;
  className?: string;
}

interface MenuItem {
  id: string;
  label: string;
  href: string;
  badge?: string;
  commitCount?: number;
  hasIndicator?: boolean;
}

const menuItems: MenuItem[] = [
  {
    id: "home",
    label: "HOME",
    href: "#hero",
    hasIndicator: true,
  },
  {
    id: "projects",
    label: "PROJECTS",
    href: "#projects",
    badge: "NEW",
    commitCount: 247,
  },
  {
    id: "experience",
    label: "EXPERIENCE",
    href: "#experience",
    commitCount: 1337,
  },
  {
    id: "results",
    label: "RESULTS",
    href: "#results",
    badge: "HOT",
  },
  {
    id: "contact",
    label: "CONTACT",
    href: "#contact",
    hasIndicator: true,
  },
];

export const NavigationMenu: React.FC<NavigationMenuProps> = ({
  theme,
  className = "",
}) => {
  const [activeItem, setActiveItem] = useState("home");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleItemClick = (item: MenuItem) => {
    setActiveItem(item.id);

    // Smooth scroll to section
    const element = document.querySelector(item.href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const menuClasses = [
    "navigation-menu",
    `navigation-menu--${theme}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={menuClasses}>
      <ul className="navigation-menu__list">
        {menuItems.map((item) => {
          const isActive = activeItem === item.id;
          const isHovered = hoveredItem === item.id;

          const itemClasses = [
            "navigation-menu__item",
            `navigation-menu__item--${theme}`,
            isActive ? "navigation-menu__item--active" : "",
            isHovered ? "navigation-menu__item--hovered" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <li key={item.id} className={itemClasses}>
              <button
                className="navigation-menu__link"
                onClick={() => handleItemClick(item)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                aria-current={isActive ? "page" : undefined}
              >
                {/* Main Text */}
                <span className="navigation-menu__text">{item.label}</span>

                {/* Badge */}
                {item.badge && (
                  <span className="navigation-menu__badge">{item.badge}</span>
                )}

                {/* Commit Counter */}
                {item.commitCount && (
                  <span className="navigation-menu__commit-count">
                    [{item.commitCount}]
                  </span>
                )}

                {/* Pulse Indicator */}
                {item.hasIndicator && (
                  <div className="navigation-menu__indicator">
                    <div className="navigation-menu__pulse"></div>
                  </div>
                )}

                {/* Underline Animation */}
                <div className="navigation-menu__underline"></div>

                {/* Glitch Effect */}
                <div className="navigation-menu__glitch">
                  <span className="navigation-menu__glitch-text">
                    {item.label}
                  </span>
                </div>

                {/* Shadow Effects */}
                <div className="navigation-menu__shadow"></div>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Terminal Indicator */}
      <div className="navigation-menu__terminal">
        <span className="navigation-menu__terminal-text">&gt; NAVIGATING_</span>
        <span className="navigation-menu__terminal-cursor">|</span>
      </div>
    </div>
  );
};
