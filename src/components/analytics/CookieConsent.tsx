/**
 * Cookie Consent Component
 * GDPR-compliant cookie consent management
 */

"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import { trackEvent } from "@/utils/analytics";

interface CookieConsentProps {
  className?: string;
}

interface ConsentSettings {
  necessary: boolean;
  analytics: boolean;
  performance: boolean;
  marketing: boolean;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ className = "" }) => {
  const { currentTheme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consentSettings, setConsentSettings] = useState<ConsentSettings>({
    necessary: true, // Always required
    analytics: false,
    performance: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem("cookie_consent");
    const consentTimestamp = localStorage.getItem("cookie_consent_timestamp");

    if (!consent || !consentTimestamp) {
      setIsVisible(true);
    } else {
      // Check if consent is older than 1 year
      const oneYearAgo = Date.now() - 365 * 24 * 60 * 60 * 1000;
      if (parseInt(consentTimestamp) < oneYearAgo) {
        setIsVisible(true);
      } else {
        // Load existing consent settings
        try {
          const savedSettings = JSON.parse(consent);
          setConsentSettings(savedSettings);
        } catch (error) {
          console.error("Failed to parse saved consent settings:", error);
          setIsVisible(true);
        }
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted: ConsentSettings = {
      necessary: true,
      analytics: true,
      performance: true,
      marketing: true,
    };

    saveConsent(allAccepted);
    setIsVisible(false);

    trackEvent({
      action: "cookie_consent_accept_all",
      category: "privacy",
      custom_parameters: {
        consent_method: "accept_all",
      },
    });
  };

  const handleAcceptSelected = () => {
    saveConsent(consentSettings);
    setIsVisible(false);

    trackEvent({
      action: "cookie_consent_accept_selected",
      category: "privacy",
      custom_parameters: {
        consent_method: "selected",
        analytics_consent: consentSettings.analytics,
        performance_consent: consentSettings.performance,
        marketing_consent: consentSettings.marketing,
      },
    });
  };

  const handleRejectAll = () => {
    const onlyNecessary: ConsentSettings = {
      necessary: true,
      analytics: false,
      performance: false,
      marketing: false,
    };

    saveConsent(onlyNecessary);
    setIsVisible(false);

    trackEvent({
      action: "cookie_consent_reject_all",
      category: "privacy",
      custom_parameters: {
        consent_method: "reject_all",
      },
    });
  };

  const saveConsent = (settings: ConsentSettings) => {
    localStorage.setItem("cookie_consent", JSON.stringify(settings));
    localStorage.setItem("cookie_consent_timestamp", Date.now().toString());

    // Dispatch custom event for analytics provider
    window.dispatchEvent(
      new CustomEvent("analytics-consent-change", {
        detail: { consent: settings.analytics },
      })
    );

    // Dispatch event for performance monitoring
    window.dispatchEvent(
      new CustomEvent("performance-consent-change", {
        detail: { consent: settings.performance },
      })
    );
  };

  const handleSettingChange = (
    setting: keyof ConsentSettings,
    value: boolean
  ) => {
    if (setting === "necessary") return; // Cannot disable necessary cookies

    setConsentSettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);

    trackEvent({
      action: "cookie_consent_toggle_details",
      category: "privacy",
      custom_parameters: {
        details_shown: !showDetails,
      },
    });
  };

  if (!isVisible) return null;

  return (
    <div
      className={`cookie-consent cookie-consent--${currentTheme} ${className}`}
    >
      <div className="cookie-consent__backdrop" />

      <div className="cookie-consent__modal">
        <div className="cookie-consent__header">
          <h3 className="cookie-consent__title">🍪 COOKIE PREFERENCES</h3>
          <p className="cookie-consent__description">
            We use cookies to enhance your browsing experience, analyze site
            traffic, and provide personalized content. Choose your preferences
            below.
          </p>
        </div>

        <div className="cookie-consent__content">
          {!showDetails ? (
            <div className="cookie-consent__simple">
              <p className="cookie-consent__text">
                We respect your privacy. You can accept all cookies or customize
                your preferences.
              </p>

              <div className="cookie-consent__actions">
                <button
                  className="cookie-consent__button cookie-consent__button--primary"
                  onClick={handleAcceptAll}
                >
                  ACCEPT ALL
                </button>

                <button
                  className="cookie-consent__button cookie-consent__button--secondary"
                  onClick={toggleDetails}
                >
                  CUSTOMIZE
                </button>

                <button
                  className="cookie-consent__button cookie-consent__button--ghost"
                  onClick={handleRejectAll}
                >
                  REJECT ALL
                </button>
              </div>
            </div>
          ) : (
            <div className="cookie-consent__detailed">
              <div className="cookie-consent__categories">
                <div className="cookie-consent__category">
                  <div className="cookie-consent__category-header">
                    <label className="cookie-consent__category-label">
                      <input
                        type="checkbox"
                        checked={consentSettings.necessary}
                        disabled
                        className="cookie-consent__checkbox"
                      />
                      <span className="cookie-consent__category-name">
                        Necessary Cookies
                      </span>
                      <span className="cookie-consent__category-required">
                        REQUIRED
                      </span>
                    </label>
                  </div>
                  <p className="cookie-consent__category-description">
                    Essential for the website to function properly. These cannot
                    be disabled.
                  </p>
                </div>

                <div className="cookie-consent__category">
                  <div className="cookie-consent__category-header">
                    <label className="cookie-consent__category-label">
                      <input
                        type="checkbox"
                        checked={consentSettings.analytics}
                        onChange={(e) =>
                          handleSettingChange("analytics", e.target.checked)
                        }
                        className="cookie-consent__checkbox"
                      />
                      <span className="cookie-consent__category-name">
                        Analytics Cookies
                      </span>
                    </label>
                  </div>
                  <p className="cookie-consent__category-description">
                    Help us understand how visitors interact with our website by
                    collecting anonymous information.
                  </p>
                </div>

                <div className="cookie-consent__category">
                  <div className="cookie-consent__category-header">
                    <label className="cookie-consent__category-label">
                      <input
                        type="checkbox"
                        checked={consentSettings.performance}
                        onChange={(e) =>
                          handleSettingChange("performance", e.target.checked)
                        }
                        className="cookie-consent__checkbox"
                      />
                      <span className="cookie-consent__category-name">
                        Performance Cookies
                      </span>
                    </label>
                  </div>
                  <p className="cookie-consent__category-description">
                    Monitor website performance and help us improve loading
                    times and user experience.
                  </p>
                </div>

                <div className="cookie-consent__category">
                  <div className="cookie-consent__category-header">
                    <label className="cookie-consent__category-label">
                      <input
                        type="checkbox"
                        checked={consentSettings.marketing}
                        onChange={(e) =>
                          handleSettingChange("marketing", e.target.checked)
                        }
                        className="cookie-consent__checkbox"
                      />
                      <span className="cookie-consent__category-name">
                        Marketing Cookies
                      </span>
                    </label>
                  </div>
                  <p className="cookie-consent__category-description">
                    Used to track visitors across websites to display relevant
                    advertisements.
                  </p>
                </div>
              </div>

              <div className="cookie-consent__actions">
                <button
                  className="cookie-consent__button cookie-consent__button--primary"
                  onClick={handleAcceptSelected}
                >
                  SAVE PREFERENCES
                </button>

                <button
                  className="cookie-consent__button cookie-consent__button--ghost"
                  onClick={toggleDetails}
                >
                  BACK
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="cookie-consent__footer">
          <p className="cookie-consent__legal">
            By continuing to use this site, you agree to our{" "}
            <a href="/privacy" className="cookie-consent__link">
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href="/terms" className="cookie-consent__link">
              Terms of Service
            </a>
            .
          </p>
        </div>
      </div>

      <style jsx>{`
        .cookie-consent {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .cookie-consent__backdrop {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(4px);
        }

        .cookie-consent__modal {
          position: relative;
          background: var(--bg-primary);
          border: var(--border-brutal);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-brutal);
          max-width: 600px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
          font-family: var(--font-mono);
        }

        .cookie-consent--extreme-brutalist {
          --bg-primary: #000000;
          --text-primary: #ffffff;
          --text-secondary: #ffff00;
          --border-brutal: 4px solid #ffffff;
          --border-radius: 0;
          --shadow-brutal: 8px 8px 0 #ffff00;
          --font-mono: "JetBrains Mono", monospace;
        }

        .cookie-consent--refined-brutalist {
          --bg-primary: #1a1a1a;
          --text-primary: #f5f5f5;
          --text-secondary: #8b5cf6;
          --border-brutal: 2px solid #8b5cf6;
          --border-radius: 12px;
          --shadow-brutal: 0 20px 40px rgba(0, 0, 0, 0.5);
          --font-mono: "Inter", sans-serif;
        }

        .cookie-consent__header {
          padding: 24px 24px 16px;
          border-bottom: 2px solid var(--text-secondary);
        }

        .cookie-consent__title {
          margin: 0 0 12px 0;
          color: var(--text-primary);
          font-size: 18px;
          font-weight: bold;
        }

        .cookie-consent__description {
          margin: 0;
          color: var(--text-primary);
          font-size: 14px;
          line-height: 1.5;
          opacity: 0.9;
        }

        .cookie-consent__content {
          padding: 20px 24px;
        }

        .cookie-consent__text {
          margin: 0 0 20px 0;
          color: var(--text-primary);
          font-size: 14px;
          line-height: 1.5;
        }

        .cookie-consent__categories {
          margin-bottom: 24px;
        }

        .cookie-consent__category {
          margin-bottom: 20px;
          padding: 16px;
          border: 1px solid var(--text-secondary);
          border-radius: var(--border-radius);
        }

        .cookie-consent__category-header {
          margin-bottom: 8px;
        }

        .cookie-consent__category-label {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          color: var(--text-primary);
          font-weight: bold;
        }

        .cookie-consent__checkbox {
          width: 18px;
          height: 18px;
          accent-color: var(--text-secondary);
        }

        .cookie-consent__category-name {
          flex: 1;
        }

        .cookie-consent__category-required {
          background: var(--text-secondary);
          color: var(--bg-primary);
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: bold;
        }

        .cookie-consent__category-description {
          margin: 0;
          color: var(--text-primary);
          font-size: 12px;
          line-height: 1.4;
          opacity: 0.8;
        }

        .cookie-consent__actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .cookie-consent__button {
          padding: 12px 20px;
          border: 2px solid var(--text-secondary);
          border-radius: var(--border-radius);
          background: transparent;
          color: var(--text-primary);
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
        }

        .cookie-consent__button--primary {
          background: var(--text-secondary);
          color: var(--bg-primary);
        }

        .cookie-consent__button--primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }

        .cookie-consent__button--secondary:hover,
        .cookie-consent__button--ghost:hover {
          background: var(--text-secondary);
          color: var(--bg-primary);
        }

        .cookie-consent__footer {
          padding: 16px 24px;
          border-top: 1px solid var(--text-secondary);
          background: rgba(255, 255, 255, 0.05);
        }

        .cookie-consent__legal {
          margin: 0;
          color: var(--text-primary);
          font-size: 11px;
          line-height: 1.4;
          opacity: 0.7;
          text-align: center;
        }

        .cookie-consent__link {
          color: var(--text-secondary);
          text-decoration: underline;
        }

        .cookie-consent__link:hover {
          opacity: 0.8;
        }

        @media (max-width: 768px) {
          .cookie-consent {
            padding: 10px;
          }

          .cookie-consent__modal {
            max-height: 90vh;
          }

          .cookie-consent__header,
          .cookie-consent__content,
          .cookie-consent__footer {
            padding-left: 16px;
            padding-right: 16px;
          }

          .cookie-consent__actions {
            flex-direction: column;
          }

          .cookie-consent__button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default CookieConsent;
