"use client";

import React, { useState } from "react";
import {
  BrutalForm,
  BrutalFormField,
  BrutalFormActions,
  BrutalFormSection,
  BrutalInput,
  BrutalTextarea,
  BrutalSelect,
  BrutalCheckbox,
  BrutalRadio,
  BrutalSelectOption,
  BrutalRadioOption,
} from "./index";
import { BrutalButton } from "../BrutalButton";

/**
 * BrutalFormDemo - A demonstration component showcasing all form components
 *
 * This component demonstrates:
 * - All form input types with validation
 * - Theme-aware styling
 * - Real-time validation feedback
 * - Form submission handling
 * - Responsive behavior
 */
export const BrutalFormDemo: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    country: "",
    newsletter: false,
    experience: "",
    terms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Country options for select
  const countryOptions: BrutalSelectOption[] = [
    { value: "us", label: "United States" },
    { value: "ca", label: "Canada" },
    { value: "uk", label: "United Kingdom" },
    { value: "de", label: "Germany" },
    { value: "fr", label: "France" },
    { value: "jp", label: "Japan" },
    { value: "au", label: "Australia" },
  ];

  // Experience options for radio
  const experienceOptions: BrutalRadioOption[] = [
    {
      value: "beginner",
      label: "Beginner",
      description: "0-2 years of experience",
    },
    {
      value: "intermediate",
      label: "Intermediate",
      description: "2-5 years of experience",
    },
    {
      value: "advanced",
      label: "Advanced",
      description: "5+ years of experience",
    },
    {
      value: "expert",
      label: "Expert",
      description: "10+ years of experience",
    },
  ];

  // Validation function
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
    }

    if (!formData.country) {
      newErrors.country = "Please select your country";
    }

    if (!formData.experience) {
      newErrors.experience = "Please select your experience level";
    }

    if (!formData.terms) {
      newErrors.terms = "You must accept the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Form submitted:", formData);
      alert("Form submitted successfully!");

      // Reset form
      setFormData({
        name: "",
        email: "",
        message: "",
        country: "",
        newsletter: false,
        experience: "",
        terms: false,
      });
    } catch (error) {
      console.error("Submission error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="brutal-form-demo"
      style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem" }}
    >
      <h2 style={{ marginBottom: "2rem", textAlign: "center" }}>
        Brutal Form Components Demo
      </h2>

      <BrutalForm
        variant="card"
        spacing="comfortable"
        onSubmit={handleSubmit}
        loading={isSubmitting}
      >
        <BrutalFormSection
          title="Personal Information"
          description="Please provide your basic information"
        >
          <BrutalFormField>
            <BrutalInput
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              error={errors.name}
              required
              clearable
              onClear={() => handleInputChange("name", "")}
            />
          </BrutalFormField>

          <BrutalFormField>
            <BrutalInput
              type="email"
              label="Email Address"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              error={errors.email}
              success={
                formData.email && !errors.email
                  ? "Valid email address"
                  : undefined
              }
              required
              clearable
              onClear={() => handleInputChange("email", "")}
            />
          </BrutalFormField>

          <BrutalFormField>
            <BrutalSelect
              label="Country"
              placeholder="Select your country"
              options={countryOptions}
              value={formData.country}
              onChange={(e) => handleInputChange("country", e.target.value)}
              error={errors.country}
              required
              clearable
              onClear={() => handleInputChange("country", "")}
            />
          </BrutalFormField>
        </BrutalFormSection>

        <BrutalFormSection
          title="Experience & Message"
          description="Tell us about your experience and what you'd like to share"
        >
          <BrutalFormField>
            <BrutalRadio
              label="Experience Level"
              options={experienceOptions}
              value={formData.experience}
              onChange={(e) => handleInputChange("experience", e.target.value)}
              error={errors.experience}
              required
              orientation="vertical"
              spacing="comfortable"
            />
          </BrutalFormField>

          <BrutalFormField>
            <BrutalTextarea
              label="Message"
              placeholder="Tell us about yourself and your interests..."
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              error={errors.message}
              hint="Minimum 10 characters required"
              required
              rows={4}
              maxLength={500}
              showCharacterCount
              clearable
              onClear={() => handleInputChange("message", "")}
            />
          </BrutalFormField>
        </BrutalFormSection>

        <BrutalFormSection title="Preferences">
          <BrutalFormField>
            <BrutalCheckbox
              label="Subscribe to Newsletter"
              description="Receive updates about new features and announcements"
              checked={formData.newsletter}
              onChange={(e) =>
                handleInputChange("newsletter", e.target.checked)
              }
            />
          </BrutalFormField>

          <BrutalFormField>
            <BrutalCheckbox
              label="I accept the Terms and Conditions"
              description="Please read and accept our terms and conditions to continue"
              checked={formData.terms}
              onChange={(e) => handleInputChange("terms", e.target.checked)}
              error={errors.terms}
              required
            />
          </BrutalFormField>
        </BrutalFormSection>

        <BrutalFormActions align="between">
          <BrutalButton
            type="button"
            variant="ghost"
            onClick={() => {
              setFormData({
                name: "",
                email: "",
                message: "",
                country: "",
                newsletter: false,
                experience: "",
                terms: false,
              });
              setErrors({});
            }}
            disabled={isSubmitting}
          >
            Reset Form
          </BrutalButton>

          <BrutalButton
            type="submit"
            variant="primary"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Form"}
          </BrutalButton>
        </BrutalFormActions>
      </BrutalForm>

      {/* Form Data Display (for demo purposes) */}
      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          background: "rgba(0,0,0,0.05)",
          borderRadius: "8px",
        }}
      >
        <h3>Current Form Data:</h3>
        <pre style={{ fontSize: "0.875rem", overflow: "auto" }}>
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div>
    </div>
  );
};
