"use client";

import React from "react";
import { useThemeContext } from "@/contexts/ThemeContext";
import { FooterBottom } from "./FooterBottom";

interface FooterBottomOnlyProps {
  className?: string;
}

export const FooterBottomOnly: React.FC<FooterBottomOnlyProps> = ({
  className = "",
}) => {
  const { currentTheme } = useThemeContext();

  const footerClasses = [
    "footer-section",
    "footer-section--bottom-only",
    `footer-section--${currentTheme}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <footer className={footerClasses} id="footerBottomSection">
      {/* Footer Bottom Section Only */}
      <FooterBottom />

      {/* Footer Background Effects */}
      <div className="footer-section__background">
        <div className="footer-section__particles"></div>
        <div className="footer-section__grid"></div>
        <div className="footer-section__glow"></div>
        <div className="footer-section__stripes"></div>
        <div className="footer-section__concrete-overlay"></div>
        <div className="footer-section__noise-texture"></div>
      </div>
    </footer>
  );
};
