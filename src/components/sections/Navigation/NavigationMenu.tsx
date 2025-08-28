"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
    id: "projects",
    label: "PROJECTS",
    href: "/projects",
    badge: "NEW",
    commitCount: 247,
  },
  {
    id: "experience",
    label: "EXPERIENCE",
    href: "/experience",
    commitCount: 1337,
  },
  {
    id: "contact",
    label: "CONTACT",
    href: "/contact",
    hasIndicator: true,
  },
];

export const NavigationMenu: React.FC<NavigationMenuProps> = ({
  theme,
  className = "",
}) => {
  const [activeItem, setActiveItem] = useState("projects");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const router = useRouter();

  const handleItemClick = (item: MenuItem) => {
    setActiveItem(item.id);

    // Check if it's a page navigation or section scroll
    if (item.href.startsWith("/")) {
      // Navigate to page using Next.js router
      router.push(item.href);
    } else {
      // Smooth scroll to section
      const element = document.querySelector(item.href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
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
              {item.href.startsWith("/") ? (
                <Link
                  href={item.href}
                  className="navigation-menu__link"
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className="navigation-menu__text">{item.label}</span>
                  {item.badge && (
                    <span className="navigation-menu__badge">{item.badge}</span>
                  )}
                  {item.commitCount && (
                    <span className="navigation-menu__commit-count">
                      [{item.commitCount}]
                    </span>
                  )}
                  {item.hasIndicator && (
                    <div className="navigation-menu__indicator">
                      <div className="navigation-menu__pulse"></div>
                    </div>
                  )}
                  <div className="navigation-menu__underline"></div>
                  <div className="navigation-menu__glitch">
                    <span className="navigation-menu__glitch-text">
                      {item.label}
                    </span>
                  </div>
                  <div className="navigation-menu__shadow"></div>
                </Link>
              ) : (
                <button
                  className="navigation-menu__link"
                  onClick={() => handleItemClick(item)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className="navigation-menu__text">{item.label}</span>
                  {item.badge && (
                    <span className="navigation-menu__badge">{item.badge}</span>
                  )}
                  {item.commitCount && (
                    <span className="navigation-menu__commit-count">
                      [{item.commitCount}]
                    </span>
                  )}
                  {item.hasIndicator && (
                    <div className="navigation-menu__indicator">
                      <div className="navigation-menu__pulse"></div>
                    </div>
                  )}
                  <div className="navigation-menu__underline"></div>
                  <div className="navigation-menu__glitch">
                    <span className="navigation-menu__glitch-text">
                      {item.label}
                    </span>
                  </div>
                  <div className="navigation-menu__shadow"></div>
                </button>
              )}
            </li>
          );
        })}
      </ul>

      <div className="navigation-menu__terminal">
        <span className="navigation-menu__terminal-text">&gt; NAVIGATING_</span>
        <span className="navigation-menu__terminal-cursor">|</span>
      </div>
    </div>
  );
};
