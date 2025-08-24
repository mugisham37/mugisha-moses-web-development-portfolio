"use client";

import React from "react";
import { useThemeContext } from "@/contexts/ThemeContext";
import { UltimateCTA } from "./UltimateCTA";
import { Newsletter } from "./Newsletter";
import { Resources } from "./Resources";
import { SocialPlatforms } from "./SocialPlatforms";

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  const { currentTheme } = useThemeContext();

  const footerClasses = [
    "footer-section",
    `footer-section--${currentTheme}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <footer className={footerClasses} id="footerSection">
      {/* Ultimate CTA Section */}
      <UltimateCTA />

      {/* Newsletter Section */}
      <Newsletter />

      {/* Resources Section */}
      <Resources />

      {/* Social Platforms Section */}
      <SocialPlatforms />

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
