"use client";

import React from "react";
import { useThemeContext } from "@/contexts/ThemeContext";

interface FooterBottomProps {
  className?: string;
}

export const FooterBottom: React.FC<FooterBottomProps> = ({
  className = "",
}) => {
  const { currentTheme } = useThemeContext();

  const footerBottomClasses = [
    "footer-bottom",
    `footer-bottom--${currentTheme}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className={footerBottomClasses}>
      <div className="footer-bottom__container">
        {/* Legal Links Section */}
        <div className="footer-bottom__legal">
          <div className="legal-links">
            <a
              href="/privacy"
              className="legal-link"
              aria-label="Privacy Policy"
            >
              <span className="legal-link__text">PRIVACY</span>
              <div className="legal-link__underline"></div>
            </a>
            <span className="legal-separator">|</span>
            <a
              href="/terms"
              className="legal-link"
              aria-label="Terms of Service"
            >
              <span className="legal-link__text">TERMS</span>
              <div className="legal-link__underline"></div>
            </a>
            <span className="legal-separator">|</span>
            <a
              href="/cookies"
              className="legal-link"
              aria-label="Cookie Policy"
            >
              <span className="legal-link__text">COOKIES</span>
              <div className="legal-link__underline"></div>
            </a>
          </div>
        </div>

        {/* Copyright and Professional Information */}
        <div className="footer-bottom__info">
          <div className="copyright-section">
            <div className="copyright-text">
              <span className="copyright-symbol">©</span>
              <span className="copyright-year">{currentYear}</span>
              <span className="copyright-name">DEVELOPER PORTFOLIO</span>
            </div>
            <div className="professional-info">
              <span className="info-item">
                <span className="info-icon">🏢</span>
                <span className="info-text">INDEPENDENT CONTRACTOR</span>
              </span>
              <span className="info-separator">•</span>
              <span className="info-item">
                <span className="info-icon">📍</span>
                <span className="info-text">REMOTE WORLDWIDE</span>
              </span>
              <span className="info-separator">•</span>
              <span className="info-item">
                <span className="info-icon">⚡</span>
                <span className="info-text">AVAILABLE FOR PROJECTS</span>
              </span>
            </div>
          </div>
        </div>

        {/* Built With Credits */}
        <div className="footer-bottom__credits">
          <div className="built-with">
            <span className="built-text">BUILT WITH</span>
            <div className="tech-stack">
              <span className="tech-item">
                <span className="tech-icon">⚛️</span>
                <span className="tech-name">NEXT.JS</span>
              </span>
              <span className="tech-separator">+</span>
              <span className="tech-item">
                <span className="tech-icon">🎨</span>
                <span className="tech-name">TYPESCRIPT</span>
              </span>
              <span className="tech-separator">+</span>
              <span className="tech-item">
                <span className="tech-icon">💀</span>
                <span className="tech-name">BRUTALISM</span>
              </span>
            </div>
          </div>
        </div>

        {/* Back to Top Button */}
        <div className="footer-bottom__navigation">
          <button
            onClick={handleBackToTop}
            className="back-to-top-btn"
            aria-label="Back to top"
            type="button"
          >
            <div className="back-to-top-btn__content">
              <div className="back-to-top-btn__icon">
                <span className="arrow-up">↑</span>
                <div className="icon-effects">
                  <div className="icon-glow"></div>
                  <div className="icon-pulse"></div>
                </div>
              </div>
              <div className="back-to-top-btn__text">
                <span className="btn-label">BACK TO TOP</span>
                <div className="btn-subtext">SCROLL TO HERO</div>
              </div>
            </div>

            {/* Button Effects */}
            <div className="back-to-top-btn__effects">
              <div className="btn-shadow"></div>
              <div className="btn-border"></div>
              <div className="btn-shimmer"></div>
              <div className="btn-strike"></div>
            </div>
          </button>
        </div>

        {/* Terminal Status Line */}
        <div className="footer-bottom__terminal">
          <div className="terminal-line">
            <span className="terminal-prompt">$</span>
            <span className="terminal-command">portfolio.status</span>
            <span className="terminal-output">
              <span className="status-indicator"></span>
              <span className="status-text">ONLINE & READY</span>
            </span>
            <span className="terminal-cursor">_</span>
          </div>
        </div>
      </div>

      {/* Footer Bottom Background Effects */}
      <div className="footer-bottom__background">
        <div className="footer-bottom__scan-lines"></div>
        <div className="footer-bottom__grid-overlay"></div>
        <div className="footer-bottom__noise"></div>
      </div>
    </div>
  );
};
