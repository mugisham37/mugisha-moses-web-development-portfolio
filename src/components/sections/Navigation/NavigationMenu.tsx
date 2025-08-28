"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeType } from "@/types/theme";

interface NavigationMenuProps {
  theme: ThemeType;
  className?: string;
}

interface MenuItem {
  id: string;
  label: string;
  href: string;
}

const menuItems: MenuItem[] = [
  {
    id: "projects",
    label: "PROJECTS",
    href: "/projects",
  },
  {
    id: "experience",
    label: "EXPERIENCE",
    href: "/experience",
  },
  {
    id: "contact",
    label: "CONTACT",
    href: "/contact",
  },
];

export const NavigationMenu: React.FC<NavigationMenuProps> = ({
  theme,
  className = "",
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const pathname = usePathname();

  const handleMouseEnter = useCallback((itemId: string) => {
    setHoveredItem(itemId);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredItem(null);
  }, []);

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
          const isActive = pathname === item.href;
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
              <Link
                href={item.href}
                className="navigation-menu__link"
                onMouseEnter={() => handleMouseEnter(item.id)}
                onMouseLeave={handleMouseLeave}
                aria-current={isActive ? "page" : undefined}
                prefetch={true}
              >
                <span className="navigation-menu__text">{item.label}</span>
                <div className="navigation-menu__underline"></div>
                <div className="navigation-menu__glitch">
                  <span className="navigation-menu__glitch-text">
                    {item.label}
                  </span>
                </div>
                <div className="navigation-menu__shadow"></div>
              </Link>
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
