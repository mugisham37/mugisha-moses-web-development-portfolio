"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import { BrutalButton } from "@/components/ui";
import { motion, AnimatePresence } from "framer-motion";

interface CookieConsentProps {
  className?: string;
}

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export const CookieConsent: React.FC<CookieConsentProps> = ({
  className = "",
}) => {
  const { currentTheme, config } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    preferences: false,
  });

  // Check if consent has been given
  useEffect(() => {
    const consentGiven = localStorage.getItem("cookie-consent");
    if (!consentGiven) {
      // Show after a short delay to not interfere with page load
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };

    localStorage.setItem("cookie-consent", JSON.stringify(allAccepted));
    localStorage.setItem("cookie-consent-date", new Date().toISOString());

    // Initialize analytics if accepted
    if (allAccepted.analytics && typeof window !== "undefined") {
      // Initialize Google Analytics or other analytics
      console.log("Analytics initialized");
    }

    setIsVisible(false);
  };

  const handleAcceptSelected = () => {
    localStorage.setItem("cookie-consent", JSON.stringify(preferences));
    localStorage.setItem("cookie-consent-date", new Date().toISOString());

    // Initialize services based on preferences
    if (preferences.analytics && typeof window !== "undefined") {
      console.log("Analytics initialized");
    }

    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const minimal = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };

    localStorage.setItem("cookie-consent", JSON.stringify(minimal));
    localStorage.setItem("cookie-consent-date", new Date().toISOString());

    setIsVisible(false);
  };

  const handlePreferenceChange = (key: keyof CookiePreferences) => {
    if (key === "necessary") return; // Can't disable necessary cookies

    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={`cookie-consent cookie-consent--${currentTheme} ${className}`}
          style={
            {
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 10000,
              "--consent-bg": config.colors.secondary,
              "--consent-text": config.colors.primary,
              "--consent-accent": config.colors.accent,
              "--consent-border": `${config.borders.width} ${config.borders.style} ${config.colors.primary}`,
              "--consent-shadow":
                config.shadows.brutal || config.shadows.subtle,
              "--consent-radius": config.borders.radius || "0px",
            } as React.CSSProperties
          }
        >
          <div className="cookie-consent__container">
            <div className="cookie-consent__content">
              <div className="cookie-consent__header">
                <h3 className="cookie-consent__title">
                  {currentTheme === "extreme-brutalist"
                    ? "🍪 COOKIE PROTOCOL DETECTED"
                    : "🍪 Cookie Preferences"}
                </h3>

                <p className="cookie-consent__description">
                  {currentTheme === "extreme-brutalist"
                    ? "This site uses cookies to enhance your brutal experience and analyze performance metrics."
                    : "We use cookies to improve your experience and analyze site performance."}{" "}
                  <button
                    className="cookie-consent__details-toggle"
                    onClick={() => setShowDetails(!showDetails)}
                  >
                    {showDetails ? "Hide details" : "Learn more"}
                  </button>
                </p>
              </div>

              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="cookie-consent__details"
                  >
                    <div className="cookie-consent__categories">
                      <div className="cookie-category">
                        <label className="cookie-category__label">
                          <input
                            type="checkbox"
                            checked={preferences.necessary}
                            disabled
                            className="cookie-category__checkbox"
                          />
                          <span className="cookie-category__name">
                            Necessary
                          </span>
                          <span className="cookie-category__required">
                            (Required)
                          </span>
                        </label>
                        <p className="cookie-category__description">
                          Essential for site functionality and security.
                        </p>
                      </div>

                      <div className="cookie-category">
                        <label className="cookie-category__label">
                          <input
                            type="checkbox"
                            checked={preferences.analytics}
                            onChange={() => handlePreferenceChange("analytics")}
                            className="cookie-category__checkbox"
                          />
                          <span className="cookie-category__name">
                            Analytics
                          </span>
                        </label>
                        <p className="cookie-category__description">
                          Help us understand how visitors interact with our
                          site.
                        </p>
                      </div>

                      <div className="cookie-category">
                        <label className="cookie-category__label">
                          <input
                            type="checkbox"
                            checked={preferences.marketing}
                            onChange={() => handlePreferenceChange("marketing")}
                            className="cookie-category__checkbox"
                          />
                          <span className="cookie-category__name">
                            Marketing
                          </span>
                        </label>
                        <p className="cookie-category__description">
                          Used to track visitors across websites for marketing
                          purposes.
                        </p>
                      </div>

                      <div className="cookie-category">
                        <label className="cookie-category__label">
                          <input
                            type="checkbox"
                            checked={preferences.preferences}
                            onChange={() =>
                              handlePreferenceChange("preferences")
                            }
                            className="cookie-category__checkbox"
                          />
                          <span className="cookie-category__name">
                            Preferences
                          </span>
                        </label>
                        <p className="cookie-category__description">
                          Remember your settings and preferences.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="cookie-consent__actions">
                <BrutalButton
                  variant="ghost"
                  size="sm"
                  onClick={handleRejectAll}
                  className="cookie-consent__reject"
                >
                  {currentTheme === "extreme-brutalist"
                    ? "REJECT ALL"
                    : "Reject All"}
                </BrutalButton>

                {showDetails && (
                  <BrutalButton
                    variant="secondary"
                    size="sm"
                    onClick={handleAcceptSelected}
                    className="cookie-consent__accept-selected"
                  >
                    {currentTheme === "extreme-brutalist"
                      ? "ACCEPT SELECTED"
                      : "Accept Selected"}
                  </BrutalButton>
                )}

                <BrutalButton
                  variant="primary"
                  size="sm"
                  onClick={handleAcceptAll}
                  className="cookie-consent__accept-all"
                >
                  {currentTheme === "extreme-brutalist"
                    ? "ACCEPT ALL"
                    : "Accept All"}
                </BrutalButton>
              </div>
            </div>

            {/* Animated border effect */}
            <div className="cookie-consent__border-animation"></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
