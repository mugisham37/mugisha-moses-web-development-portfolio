"use client";

import React, { useState, useEffect, useRef } from "react";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

interface NewsletterProps {
  className?: string;
}

interface NewsletterCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  subscriberCount: number;
  frequency: string;
}

interface NewsletterBenefit {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface PreviewCard {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishDate: string;
  engagement: {
    opens: number;
    clicks: number;
    shares: number;
  };
}

interface FormData {
  email: string;
  name: string;
  categories: string[];
  frequency: "weekly" | "biweekly" | "monthly";
}

interface FormErrors {
  email?: string;
  name?: string;
  categories?: string;
}

const newsletterCategories: NewsletterCategory[] = [
  {
    id: "tech-insights",
    name: "Tech Insights",
    description: "Latest trends, tools, and breakthrough technologies",
    icon: "🚀",
    subscriberCount: 2847,
    frequency: "Weekly",
  },
  {
    id: "dev-tips",
    name: "Dev Tips",
    description: "Practical coding tips, best practices, and tutorials",
    icon: "💡",
    subscriberCount: 3521,
    frequency: "Bi-weekly",
  },
  {
    id: "business-growth",
    name: "Business Growth",
    description: "Strategies for scaling tech businesses and teams",
    icon: "📈",
    subscriberCount: 1892,
    frequency: "Monthly",
  },
  {
    id: "case-studies",
    name: "Case Studies",
    description: "Real-world project breakdowns and lessons learned",
    icon: "📊",
    subscriberCount: 2156,
    frequency: "Monthly",
  },
];

const newsletterBenefits: NewsletterBenefit[] = [
  {
    id: "exclusive-content",
    icon: "🎯",
    title: "Exclusive Content",
    description: "Access to premium insights not available anywhere else",
  },
  {
    id: "early-access",
    icon: "⚡",
    title: "Early Access",
    description: "Get new tools, resources, and opportunities before others",
  },
  {
    id: "community-access",
    icon: "👥",
    title: "Community Access",
    description: "Join our private Discord community of 500+ developers",
  },
  {
    id: "free-resources",
    icon: "🎁",
    title: "Free Resources",
    description: "Monthly downloads: templates, checklists, and guides",
  },
];

const previewCards: PreviewCard[] = [
  {
    id: "next-js-performance",
    title: "Next.js 14 Performance Optimization: 5 Game-Changing Techniques",
    excerpt:
      "Discover how to reduce bundle size by 40% and improve Core Web Vitals with these advanced optimization strategies...",
    category: "Tech Insights",
    readTime: "8 min",
    publishDate: "2024-01-15",
    engagement: {
      opens: 4521,
      clicks: 892,
      shares: 156,
    },
  },
  {
    id: "typescript-patterns",
    title: "Advanced TypeScript Patterns That Will Make You a Better Developer",
    excerpt:
      "Master conditional types, template literals, and advanced generics to write more maintainable and type-safe code...",
    category: "Dev Tips",
    readTime: "12 min",
    publishDate: "2024-01-08",
    engagement: {
      opens: 3847,
      clicks: 721,
      shares: 203,
    },
  },
  {
    id: "scaling-teams",
    title:
      "From 5 to 50: How We Scaled Our Development Team Without Losing Quality",
    excerpt:
      "A detailed breakdown of our hiring process, onboarding system, and culture-building strategies that maintained code quality...",
    category: "Business Growth",
    readTime: "15 min",
    publishDate: "2024-01-01",
    engagement: {
      opens: 2934,
      clicks: 567,
      shares: 89,
    },
  },
];

export const Newsletter: React.FC<NewsletterProps> = ({ className = "" }) => {
  const { currentTheme } = useThemeContext();
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    name: "",
    categories: [],
    frequency: "weekly",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredBenefit, setHoveredBenefit] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isInView = useIntersectionObserver(containerRef, {
    threshold: 0.2,
    triggerOnce: true,
  });

  // Visibility animation
  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setIsVisible(true), 300);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  // Real-time validation
  const validateField = (
    field: keyof FormData,
    value: any
  ): string | undefined => {
    switch (field) {
      case "email":
        if (!value) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Invalid email format";
        return undefined;
      case "name":
        if (!value) return "Name is required";
        if (value.length < 2) return "Name must be at least 2 characters";
        return undefined;
      case "categories":
        if (!value || value.length === 0) return "Select at least one category";
        return undefined;
      default:
        return undefined;
    }
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Real-time validation
    const error = validateField(field, value);
    setFormErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const handleCategoryToggle = (categoryId: string) => {
    const newCategories = formData.categories.includes(categoryId)
      ? formData.categories.filter((id) => id !== categoryId)
      : [...formData.categories, categoryId];

    handleInputChange("categories", newCategories);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const errors: FormErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(
        key as keyof FormData,
        formData[key as keyof FormData]
      );
      if (error) errors[key as keyof FormErrors] = error;
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Track subscription
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "newsletter_signup", {
          event_category: "engagement",
          event_label: formData.categories.join(","),
          value: 1,
        });
      }

      setSubmitStatus("success");

      // Reset form after success
      setTimeout(() => {
        setFormData({
          email: "",
          name: "",
          categories: [],
          frequency: "weekly",
        });
        setSubmitStatus("idle");
      }, 3000);
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const newsletterClasses = [
    "newsletter",
    `newsletter--${currentTheme}`,
    isVisible ? "newsletter--visible" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={containerRef} className={newsletterClasses}>
      {/* Background Effects */}
      <div className="newsletter__background">
        <div className="newsletter__particles"></div>
        <div className="newsletter__grid"></div>
        <div className="newsletter__glow"></div>
        <div className="newsletter__stripes"></div>
      </div>

      {/* Shadow Layers */}
      <div className="newsletter__shadow newsletter__shadow--1"></div>
      <div className="newsletter__shadow newsletter__shadow--2"></div>

      {/* Border Effects */}
      <div className="newsletter__border newsletter__border--main"></div>
      <div className="newsletter__border newsletter__border--accent"></div>

      {/* Main Container */}
      <div className="newsletter__container">
        {/* Header Section */}
        <div className="newsletter__header">
          <div className="newsletter__title-container">
            <h2 className="newsletter__title">STAY AHEAD OF THE CURVE</h2>
            <div className="newsletter__subtitle">
              Join 10,000+ developers getting exclusive insights, tips, and
              resources delivered to their inbox
            </div>
          </div>

          {/* Stats */}
          <div className="newsletter__stats">
            <div className="newsletter__stat">
              <span className="newsletter__stat-number">10,247</span>
              <span className="newsletter__stat-label">Subscribers</span>
            </div>
            <div className="newsletter__stat">
              <span className="newsletter__stat-number">98%</span>
              <span className="newsletter__stat-label">Open Rate</span>
            </div>
            <div className="newsletter__stat">
              <span className="newsletter__stat-number">4.9/5</span>
              <span className="newsletter__stat-label">Rating</span>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="newsletter__content">
          {/* Left Column - Preview Cards */}
          <div className="newsletter__preview-section">
            <h3 className="newsletter__section-title">Recent Newsletters</h3>

            <div className="newsletter__preview-cards">
              {previewCards.map((card, index) => (
                <div
                  key={card.id}
                  className={`newsletter__preview-card ${
                    hoveredCard === card.id
                      ? "newsletter__preview-card--hovered"
                      : ""
                  }`}
                  onMouseEnter={() => setHoveredCard(card.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{ "--card-index": index } as React.CSSProperties}
                >
                  <div className="newsletter__preview-card-shadow"></div>
                  <div className="newsletter__preview-card-border"></div>

                  <div className="newsletter__preview-card-header">
                    <span className="newsletter__preview-card-category">
                      {card.category}
                    </span>
                    <span className="newsletter__preview-card-date">
                      {new Date(card.publishDate).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="newsletter__preview-card-title">
                    {card.title}
                  </h4>

                  <p className="newsletter__preview-card-excerpt">
                    {card.excerpt}
                  </p>

                  <div className="newsletter__preview-card-meta">
                    <span className="newsletter__preview-card-read-time">
                      📖 {card.readTime}
                    </span>
                    <div className="newsletter__preview-card-engagement">
                      <span>👁 {card.engagement.opens.toLocaleString()}</span>
                      <span>🔗 {card.engagement.clicks}</span>
                      <span>📤 {card.engagement.shares}</span>
                    </div>
                  </div>

                  <div className="newsletter__preview-card-strike"></div>
                  <div className="newsletter__preview-card-glow"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Signup Form */}
          <div className="newsletter__signup-section">
            <h3 className="newsletter__section-title">Subscribe Now</h3>

            {/* Benefits */}
            <div className="newsletter__benefits">
              {newsletterBenefits.map((benefit, index) => (
                <div
                  key={benefit.id}
                  className={`newsletter__benefit ${
                    hoveredBenefit === benefit.id
                      ? "newsletter__benefit--hovered"
                      : ""
                  }`}
                  onMouseEnter={() => setHoveredBenefit(benefit.id)}
                  onMouseLeave={() => setHoveredBenefit(null)}
                  style={{ "--benefit-index": index } as React.CSSProperties}
                >
                  <div className="newsletter__benefit-shadow"></div>
                  <div className="newsletter__benefit-border"></div>

                  <div className="newsletter__benefit-content">
                    <span className="newsletter__benefit-icon">
                      {benefit.icon}
                    </span>
                    <div className="newsletter__benefit-text">
                      <h5 className="newsletter__benefit-title">
                        {benefit.title}
                      </h5>
                      <p className="newsletter__benefit-description">
                        {benefit.description}
                      </p>
                    </div>
                  </div>

                  <div className="newsletter__benefit-strike"></div>
                  <div className="newsletter__benefit-glow"></div>
                </div>
              ))}
            </div>

            {/* Signup Form */}
            <form className="newsletter__form" onSubmit={handleSubmit}>
              {/* Basic Info */}
              <div className="newsletter__form-group">
                <label
                  className="newsletter__form-label"
                  htmlFor="newsletter-name"
                >
                  Name *
                </label>
                <input
                  id="newsletter-name"
                  type="text"
                  className={`newsletter__form-input ${
                    formErrors.name ? "newsletter__form-input--error" : ""
                  }`}
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Your name"
                  disabled={isSubmitting}
                />
                {formErrors.name && (
                  <span className="newsletter__form-error">
                    {formErrors.name}
                  </span>
                )}
              </div>

              <div className="newsletter__form-group">
                <label
                  className="newsletter__form-label"
                  htmlFor="newsletter-email"
                >
                  Email Address *
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  className={`newsletter__form-input ${
                    formErrors.email ? "newsletter__form-input--error" : ""
                  }`}
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="your@email.com"
                  disabled={isSubmitting}
                />
                {formErrors.email && (
                  <span className="newsletter__form-error">
                    {formErrors.email}
                  </span>
                )}
              </div>

              {/* Categories */}
              <div className="newsletter__form-group">
                <label className="newsletter__form-label">
                  Content Categories *
                </label>
                <div className="newsletter__categories">
                  {newsletterCategories.map((category) => (
                    <div
                      key={category.id}
                      className={`newsletter__category ${
                        formData.categories.includes(category.id)
                          ? "newsletter__category--selected"
                          : ""
                      } ${
                        hoveredCategory === category.id
                          ? "newsletter__category--hovered"
                          : ""
                      }`}
                      onClick={() => handleCategoryToggle(category.id)}
                      onMouseEnter={() => setHoveredCategory(category.id)}
                      onMouseLeave={() => setHoveredCategory(null)}
                    >
                      <div className="newsletter__category-shadow"></div>
                      <div className="newsletter__category-border"></div>

                      <div className="newsletter__category-content">
                        <div className="newsletter__category-header">
                          <span className="newsletter__category-icon">
                            {category.icon}
                          </span>
                          <div className="newsletter__category-info">
                            <h6 className="newsletter__category-name">
                              {category.name}
                            </h6>
                            <span className="newsletter__category-frequency">
                              {category.frequency}
                            </span>
                          </div>
                          <div className="newsletter__category-checkbox">
                            {formData.categories.includes(category.id) && "✓"}
                          </div>
                        </div>
                        <p className="newsletter__category-description">
                          {category.description}
                        </p>
                        <div className="newsletter__category-subscribers">
                          {category.subscriberCount.toLocaleString()}{" "}
                          subscribers
                        </div>
                      </div>

                      <div className="newsletter__category-strike"></div>
                      <div className="newsletter__category-glow"></div>
                    </div>
                  ))}
                </div>
                {formErrors.categories && (
                  <span className="newsletter__form-error">
                    {formErrors.categories}
                  </span>
                )}
              </div>

              {/* Frequency */}
              <div className="newsletter__form-group">
                <label className="newsletter__form-label">
                  Email Frequency
                </label>
                <div className="newsletter__frequency-options">
                  {[
                    {
                      value: "weekly",
                      label: "Weekly",
                      description: "Every Monday",
                    },
                    {
                      value: "biweekly",
                      label: "Bi-weekly",
                      description: "Every other Monday",
                    },
                    {
                      value: "monthly",
                      label: "Monthly",
                      description: "First Monday of month",
                    },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`newsletter__frequency-option ${
                        formData.frequency === option.value
                          ? "newsletter__frequency-option--selected"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="frequency"
                        value={option.value}
                        checked={formData.frequency === option.value}
                        onChange={(e) =>
                          handleInputChange("frequency", e.target.value as any)
                        }
                        disabled={isSubmitting}
                      />
                      <div className="newsletter__frequency-content">
                        <span className="newsletter__frequency-label">
                          {option.label}
                        </span>
                        <span className="newsletter__frequency-description">
                          {option.description}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`newsletter__submit-button ${
                  isSubmitting ? "newsletter__submit-button--loading" : ""
                } ${
                  submitStatus === "success"
                    ? "newsletter__submit-button--success"
                    : ""
                } ${
                  submitStatus === "error"
                    ? "newsletter__submit-button--error"
                    : ""
                }`}
                disabled={isSubmitting || submitStatus === "success"}
              >
                <div className="newsletter__submit-button-content">
                  {isSubmitting ? (
                    <>
                      <div className="newsletter__submit-button-spinner"></div>
                      <span>SUBSCRIBING...</span>
                    </>
                  ) : submitStatus === "success" ? (
                    <>
                      <span className="newsletter__submit-button-icon">✓</span>
                      <span>SUBSCRIBED!</span>
                    </>
                  ) : submitStatus === "error" ? (
                    <>
                      <span className="newsletter__submit-button-icon">✗</span>
                      <span>TRY AGAIN</span>
                    </>
                  ) : (
                    <>
                      <span>SUBSCRIBE NOW</span>
                      <div className="newsletter__submit-button-arrow">
                        <span className="newsletter__arrow-line"></span>
                        <span className="newsletter__arrow-head">&gt;</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Button Effects */}
                <div className="newsletter__submit-button-shadow"></div>
                <div className="newsletter__submit-button-border"></div>
                <div className="newsletter__submit-button-glow"></div>
                <div className="newsletter__submit-button-shimmer"></div>
                <div className="newsletter__submit-button-strike"></div>
              </button>

              {/* Privacy Notice */}
              <div className="newsletter__privacy-notice">
                <span className="newsletter__privacy-icon">🔒</span>
                <span className="newsletter__privacy-text">
                  Your email is safe with us. Unsubscribe anytime. No spam,
                  ever.
                </span>
              </div>
            </form>
          </div>
        </div>

        {/* Success Message */}
        {submitStatus === "success" && (
          <div className="newsletter__success-message">
            <div className="newsletter__success-content">
              <span className="newsletter__success-icon">🎉</span>
              <h4 className="newsletter__success-title">
                Welcome to the community!
              </h4>
              <p className="newsletter__success-text">
                Check your email for a confirmation link and your first
                newsletter.
              </p>
            </div>
          </div>
        )}

        {/* Main Strike Effect */}
        <div className="newsletter__main-strike"></div>
      </div>

      {/* Scan Lines */}
      <div className="newsletter__scan-lines">
        <div className="newsletter__scan-line newsletter__scan-line--1"></div>
        <div className="newsletter__scan-line newsletter__scan-line--2"></div>
      </div>
    </div>
  );
};
