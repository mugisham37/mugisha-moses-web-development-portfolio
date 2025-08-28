"use client";

import React, { useState, useEffect, useRef } from "react";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

interface ContactProps {
  className?: string;
}

interface ContactMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
  action: string;
  response: string;
}

interface ServiceBenefit {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface ProjectShowcase {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  duration: string;
  completedDate: string;
  results: {
    performance: string;
    satisfaction: string;
    delivery: string;
  };
}

interface FormData {
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const contactMethods: ContactMethod[] = [
  {
    id: "quick-chat",
    name: "Quick Discovery Call",
    description:
      "15-minute call to discuss your project vision and requirements",
    icon: "⚡",
    action: "Book Call",
    response: "Usually responds within 2 hours",
  },
  {
    id: "project-brief",
    name: "Detailed Consultation",
    description:
      "Comprehensive project planning and technical architecture review",
    icon: "�",
    action: "Schedule Meeting",
    response: "Full proposal within 24 hours",
  },
  {
    id: "direct-message",
    name: "Direct Communication",
    description:
      "Send your project details and get personalized recommendations",
    icon: "�",
    action: "Send Message",
    response: "Response within 4-6 hours",
  },
];

const serviceBenefits: ServiceBenefit[] = [
  {
    id: "full-stack-expertise",
    icon: "🚀",
    title: "Full-Stack Expertise",
    description: "End-to-end development from concept to deployment and beyond",
  },
  {
    id: "rapid-delivery",
    icon: "⚡",
    title: "Rapid Delivery",
    description: "Agile development process with weekly milestones and updates",
  },
  {
    id: "ongoing-support",
    icon: "🛠️",
    title: "Ongoing Support",
    description: "Post-launch maintenance, updates, and feature enhancements",
  },
  {
    id: "transparent-process",
    icon: "👁️",
    title: "Transparent Process",
    description: "Real-time project tracking with daily progress updates",
  },
];

const projectShowcases: ProjectShowcase[] = [
  {
    id: "ecommerce-platform",
    title: "E-Commerce Platform: From Concept to $2M Revenue",
    excerpt:
      "Built a scalable e-commerce platform using Next.js, Stripe, and AWS that handles 10K+ daily transactions with 99.9% uptime...",
    category: "Full-Stack Development",
    duration: "3 months",
    completedDate: "2024-01-15",
    results: {
      performance: "40% faster load times",
      satisfaction: "98% client satisfaction",
      delivery: "Delivered 2 weeks early",
    },
  },
  {
    id: "saas-dashboard",
    title: "SaaS Analytics Dashboard: Real-Time Data Visualization",
    excerpt:
      "Developed a comprehensive analytics dashboard with real-time data processing, custom charts, and automated reporting features...",
    category: "Web Application",
    duration: "2 months",
    completedDate: "2024-01-08",
    results: {
      performance: "60% improved user engagement",
      satisfaction: "100% client satisfaction",
      delivery: "On-time delivery",
    },
  },
  {
    id: "mobile-app",
    title: "Mobile App: Cross-Platform Solution for 50K+ Users",
    excerpt:
      "Created a React Native mobile application with offline capabilities, push notifications, and seamless user experience...",
    category: "Mobile Development",
    duration: "4 months",
    completedDate: "2024-01-01",
    results: {
      performance: "4.8/5 app store rating",
      satisfaction: "95% client satisfaction",
      delivery: "Delivered on schedule",
    },
  },
];

const projectTypes = [
  { value: "web-development", label: "Web Development" },
  { value: "mobile-app", label: "Mobile App" },
  { value: "full-stack", label: "Full-Stack Solution" },
  { value: "ecommerce", label: "E-Commerce Platform" },
  { value: "saas", label: "SaaS Application" },
  { value: "consulting", label: "Technical Consulting" },
  { value: "other", label: "Other" },
];

const budgetRanges = [
  { value: "5k-15k", label: "$5K - $15K" },
  { value: "15k-30k", label: "$15K - $30K" },
  { value: "30k-50k", label: "$30K - $50K" },
  { value: "50k+", label: "$50K+" },
  { value: "discuss", label: "Let&apos;s Discuss" },
];

const timelineOptions = [
  { value: "asap", label: "ASAP" },
  { value: "1-2-months", label: "1-2 Months" },
  { value: "3-6-months", label: "3-6 Months" },
  { value: "6+-months", label: "6+ Months" },
  { value: "flexible", label: "Flexible" },
];

export const Contact: React.FC<ContactProps> = ({ className = "" }) => {
  const { currentTheme } = useThemeContext();
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    projectType: "",
    budget: "",
    timeline: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [hoveredMethod, setHoveredMethod] = useState<string | null>(null);
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
    value: string
  ): string | undefined => {
    switch (field) {
      case "name":
        if (!value) return "Name is required";
        if (value.length < 2) return "Name must be at least 2 characters";
        return undefined;
      case "email":
        if (!value) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Invalid email format";
        return undefined;
      case "message":
        if (!value) return "Message is required";
        if (value.length < 10) return "Message must be at least 10 characters";
        return undefined;
      default:
        return undefined;
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Real-time validation for required fields
    if (["name", "email", "message"].includes(field)) {
      const error = validateField(field, value);
      setFormErrors((prev) => ({
        ...prev,
        [field]: error,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const errors: FormErrors = {};
    const requiredFields: (keyof FormData)[] = ["name", "email", "message"];

    requiredFields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) errors[field as keyof FormErrors] = error;
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

      // Track contact form submission
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "contact_form_submit", {
          event_category: "engagement",
          event_label: formData.projectType || "general",
          value: 1,
        });
      }

      setSubmitStatus("success");

      // Reset form after success
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          company: "",
          projectType: "",
          budget: "",
          timeline: "",
          message: "",
        });
        setSubmitStatus("idle");
      }, 3000);
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactClasses = [
    "contact",
    `contact--${currentTheme}`,
    isVisible ? "contact--visible" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={containerRef} className={contactClasses}>
      {/* Background Effects */}
      <div className="contact__background">
        <div className="contact__particles"></div>
        <div className="contact__grid"></div>
        <div className="contact__glow"></div>
        <div className="contact__stripes"></div>
      </div>

      {/* Shadow Layers */}
      <div className="contact__shadow contact__shadow--1"></div>
      <div className="contact__shadow contact__shadow--2"></div>

      {/* Border Effects */}
      <div className="contact__border contact__border--main"></div>
      <div className="contact__border contact__border--accent"></div>

      {/* Main Container */}
      <div className="contact__container">
        {/* Header Section */}
        <div className="contact__header">
          <div className="contact__title-container">
            <h2 className="contact__title">
              LET&apos;S BUILD SOMETHING AMAZING
            </h2>
            <div className="contact__subtitle">
              Ready to turn your vision into reality? Let&apos;s discuss your
              project and create something extraordinary together.
            </div>
          </div>

          {/* Stats */}
          <div className="contact__stats">
            <div className="contact__stat">
              <span className="contact__stat-number">50+</span>
              <span className="contact__stat-label">Projects Delivered</span>
            </div>
            <div className="contact__stat">
              <span className="contact__stat-number">2-4h</span>
              <span className="contact__stat-label">Response Time</span>
            </div>
            <div className="contact__stat">
              <span className="contact__stat-number">100%</span>
              <span className="contact__stat-label">Client Satisfaction</span>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="contact__content">
          {/* Left Column - Project Showcases */}
          <div className="contact__preview-section">
            <h3 className="contact__section-title">
              Recent Project Success Stories
            </h3>

            <div className="contact__preview-cards">
              {projectShowcases.map((project, index) => (
                <div
                  key={project.id}
                  className={`contact__preview-card ${
                    hoveredCard === project.id
                      ? "contact__preview-card--hovered"
                      : ""
                  }`}
                  onMouseEnter={() => setHoveredCard(project.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{ "--card-index": index } as React.CSSProperties}
                >
                  <div className="contact__preview-card-shadow"></div>
                  <div className="contact__preview-card-border"></div>

                  <div className="contact__preview-card-header">
                    <span className="contact__preview-card-category">
                      {project.category}
                    </span>
                    <span className="contact__preview-card-date">
                      {new Date(project.completedDate).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="contact__preview-card-title">
                    {project.title}
                  </h4>

                  <p className="contact__preview-card-excerpt">
                    {project.excerpt}
                  </p>

                  <div className="contact__preview-card-meta">
                    <span className="contact__preview-card-read-time">
                      ⏱️ {project.duration}
                    </span>
                    <div className="contact__preview-card-engagement">
                      <span>� {project.results.performance}</span>
                      <span>� {project.results.satisfaction}</span>
                      <span>� {project.results.delivery}</span>
                    </div>
                  </div>

                  <div className="contact__preview-card-strike"></div>
                  <div className="contact__preview-card-glow"></div>
                </div>
              ))}
            </div>

            {/* Contact Methods */}
            <div className="contact__methods-section">
              <h4 className="contact__methods-title">
                How Would You Like to Connect?
              </h4>
              <div className="contact__methods">
                {contactMethods.map((method, index) => (
                  <div
                    key={method.id}
                    className={`contact__method ${
                      hoveredMethod === method.id
                        ? "contact__method--hovered"
                        : ""
                    }`}
                    onMouseEnter={() => setHoveredMethod(method.id)}
                    onMouseLeave={() => setHoveredMethod(null)}
                    style={{ "--method-index": index } as React.CSSProperties}
                  >
                    <div className="contact__method-shadow"></div>
                    <div className="contact__method-border"></div>

                    <div className="contact__method-content">
                      <div className="contact__method-header">
                        <span className="contact__method-icon">
                          {method.icon}
                        </span>
                        <h5 className="contact__method-name">{method.name}</h5>
                      </div>

                      <p className="contact__method-description">
                        {method.description}
                      </p>

                      <div className="contact__method-response">
                        {method.response}
                      </div>

                      <button className="contact__method-button">
                        {method.action}
                      </button>
                    </div>

                    <div className="contact__method-strike"></div>
                    <div className="contact__method-glow"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="contact__signup-section">
            <h3 className="contact__section-title">Start Your Project</h3>

            {/* Service Benefits */}
            <div className="contact__benefits">
              {serviceBenefits.map((benefit, index) => (
                <div
                  key={benefit.id}
                  className={`contact__benefit ${
                    hoveredBenefit === benefit.id
                      ? "contact__benefit--hovered"
                      : ""
                  }`}
                  onMouseEnter={() => setHoveredBenefit(benefit.id)}
                  onMouseLeave={() => setHoveredBenefit(null)}
                  style={{ "--benefit-index": index } as React.CSSProperties}
                >
                  <div className="contact__benefit-shadow"></div>
                  <div className="contact__benefit-border"></div>

                  <div className="contact__benefit-content">
                    <span className="contact__benefit-icon">
                      {benefit.icon}
                    </span>
                    <div className="contact__benefit-text">
                      <h5 className="contact__benefit-title">
                        {benefit.title}
                      </h5>
                      <p className="contact__benefit-description">
                        {benefit.description}
                      </p>
                    </div>
                  </div>

                  <div className="contact__benefit-strike"></div>
                  <div className="contact__benefit-glow"></div>
                </div>
              ))}
            </div>

            {/* Contact Form */}
            <form className="contact__form" onSubmit={handleSubmit}>
              {/* Basic Info Row */}
              <div className="contact__form-row">
                <div className="contact__form-group">
                  <label
                    className="contact__form-label"
                    htmlFor="newsletter-name"
                  >
                    Name *
                  </label>
                  <input
                    id="newsletter-name"
                    type="text"
                    className={`contact__form-input ${
                      formErrors.name ? "contact__form-input--error" : ""
                    }`}
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Your full name"
                    disabled={isSubmitting}
                  />
                  {formErrors.name && (
                    <span className="contact__form-error">
                      {formErrors.name}
                    </span>
                  )}
                </div>

                <div className="contact__form-group">
                  <label
                    className="contact__form-label"
                    htmlFor="newsletter-email"
                  >
                    Email *
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    className={`contact__form-input ${
                      formErrors.email ? "contact__form-input--error" : ""
                    }`}
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="your@email.com"
                    disabled={isSubmitting}
                  />
                  {formErrors.email && (
                    <span className="contact__form-error">
                      {formErrors.email}
                    </span>
                  )}
                </div>
              </div>

              {/* Company */}
              <div className="contact__form-group">
                <label
                  className="contact__form-label"
                  htmlFor="newsletter-company"
                >
                  Company (Optional)
                </label>
                <input
                  id="newsletter-company"
                  type="text"
                  className="contact__form-input"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  placeholder="Your company name"
                  disabled={isSubmitting}
                />
              </div>

              {/* Project Details Row */}
              <div className="contact__form-row">
                <div className="contact__form-group">
                  <label
                    className="contact__form-label"
                    htmlFor="newsletter-project-type"
                  >
                    Project Type
                  </label>
                  <select
                    id="newsletter-project-type"
                    className="contact__form-select"
                    value={formData.projectType}
                    onChange={(e) =>
                      handleInputChange("projectType", e.target.value)
                    }
                    disabled={isSubmitting}
                  >
                    <option value="">Select project type</option>
                    {projectTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="contact__form-group">
                  <label
                    className="contact__form-label"
                    htmlFor="newsletter-budget"
                  >
                    Budget Range
                  </label>
                  <select
                    id="newsletter-budget"
                    className="contact__form-select"
                    value={formData.budget}
                    onChange={(e) =>
                      handleInputChange("budget", e.target.value)
                    }
                    disabled={isSubmitting}
                  >
                    <option value="">Select budget range</option>
                    {budgetRanges.map((range) => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Timeline */}
              <div className="contact__form-group">
                <label
                  className="contact__form-label"
                  htmlFor="newsletter-timeline"
                >
                  Timeline
                </label>
                <select
                  id="newsletter-timeline"
                  className="contact__form-select"
                  value={formData.timeline}
                  onChange={(e) =>
                    handleInputChange("timeline", e.target.value)
                  }
                  disabled={isSubmitting}
                >
                  <option value="">Select timeline</option>
                  {timelineOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div className="contact__form-group">
                <label
                  className="contact__form-label"
                  htmlFor="newsletter-message"
                >
                  Project Details *
                </label>
                <textarea
                  id="newsletter-message"
                  className={`contact__form-textarea ${
                    formErrors.message ? "contact__form-input--error" : ""
                  }`}
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  placeholder="Tell me about your project, goals, and any specific requirements..."
                  rows={6}
                  disabled={isSubmitting}
                />
                {formErrors.message && (
                  <span className="contact__form-error">
                    {formErrors.message}
                  </span>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`contact__submit-button ${
                  isSubmitting ? "contact__submit-button--loading" : ""
                } ${
                  submitStatus === "success"
                    ? "contact__submit-button--success"
                    : ""
                } ${
                  submitStatus === "error"
                    ? "contact__submit-button--error"
                    : ""
                }`}
                disabled={isSubmitting || submitStatus === "success"}
              >
                <div className="contact__submit-button-content">
                  {isSubmitting ? (
                    <>
                      <div className="contact__submit-button-spinner"></div>
                      <span>SENDING MESSAGE...</span>
                    </>
                  ) : submitStatus === "success" ? (
                    <>
                      <span className="contact__submit-button-icon">✓</span>
                      <span>MESSAGE SENT!</span>
                    </>
                  ) : submitStatus === "error" ? (
                    <>
                      <span className="contact__submit-button-icon">✗</span>
                      <span>TRY AGAIN</span>
                    </>
                  ) : (
                    <>
                      <span>SEND MESSAGE</span>
                      <div className="contact__submit-button-arrow">
                        <span className="contact__arrow-line"></span>
                        <span className="contact__arrow-head">&gt;</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Button Effects */}
                <div className="contact__submit-button-shadow"></div>
                <div className="contact__submit-button-border"></div>
                <div className="contact__submit-button-glow"></div>
                <div className="contact__submit-button-shimmer"></div>
                <div className="contact__submit-button-strike"></div>
              </button>

              {/* Privacy Notice */}
              <div className="contact__privacy-notice">
                <span className="contact__privacy-icon">🔒</span>
                <span className="contact__privacy-text">
                  Your information is secure and will never be shared. I&apos;ll
                  respond within 2-4 hours.
                </span>
              </div>
            </form>
          </div>
        </div>

        {/* Success Message */}
        {submitStatus === "success" && (
          <div className="contact__success-message">
            <div className="contact__success-content">
              <span className="contact__success-icon">🚀</span>
              <h4 className="contact__success-title">
                Message received! Let&apos;s build something amazing.
              </h4>
              <p className="contact__success-text">
                I&apos;ll review your project details and get back to you within
                2-4 hours with next steps.
              </p>
            </div>
          </div>
        )}

        {/* Main Strike Effect */}
        <div className="contact__main-strike"></div>
      </div>

      {/* Scan Lines */}
      <div className="contact__scan-lines">
        <div className="contact__scan-line contact__scan-line--1"></div>
        <div className="contact__scan-line contact__scan-line--2"></div>
      </div>
    </div>
  );
};
