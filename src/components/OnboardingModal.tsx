"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Stepper, { Step } from "./Stepper";
import OnboardingLoader from "./OnboardingLoader";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  // Step 1
  name: string;
  company: string;
  email: string;
  role: string;

  // Step 2
  projectType: string;
  projectDescription: string;

  // Step 3
  timeline: string;
  budget: string;
  requirements: string;

  // Step 4
  phoneNumber: string;
  preferCall: boolean;
}

const initialFormData: FormData = {
  name: "",
  company: "",
  email: "",
  role: "",
  projectType: "",
  projectDescription: "",
  timeline: "",
  budget: "",
  requirements: "",
  phoneNumber: "",
  preferCall: false,
};

export default function OnboardingModal({
  isOpen,
  onClose,
}: OnboardingModalProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [, setIsSubmitting] = useState(false);

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Validation functions for each step
  const validateStep1 = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.projectType) {
      newErrors.projectType = "Please select a project type";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.timeline) {
      newErrors.timeline = "Please select a timeline";
    }

    if (!formData.budget) {
      newErrors.budget = "Please select a budget range";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep4 = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (formData.preferCall && !formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required when preferring a call";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Function to validate current step
  const validateCurrentStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return validateStep1();
      case 2:
        return validateStep2();
      case 3:
        return validateStep3();
      case 4:
        return validateStep4();
      default:
        return true;
    }
  };

  const handleSubmit = () => {
    // Start the loading process
    setIsSubmitting(true);
    setIsLoading(true);
  };

  const handleLoadingComplete = async () => {
    try {
      // Send email with form data
      const response = await fetch("/api/send-onboarding-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      const result = await response.json();
      console.log("Email sent successfully:", result);

      // Reset form and close modal
      setFormData(initialFormData);
      setErrors({});
      setIsLoading(false);
      setIsSubmitting(false);
      onClose();

      // Show success message
      alert(
        "Thank you! Your project details have been sent successfully. I'll review everything and get back to you within 24-48 hours."
      );
    } catch (error) {
      console.error("Error sending email:", error);
      setIsLoading(false);
      setIsSubmitting(false);

      // Show error message but keep modal open
      alert(
        "There was an issue sending your information. Please try again or contact me directly at mugisham505@gmail.com"
      );
    }
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setErrors({});
    setIsLoading(false);
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center"
      >
        {/* Backdrop with blur */}
        <motion.div
          initial={{ backdropFilter: "blur(0px)" }}
          animate={{ backdropFilter: "blur(8px)" }}
          exit={{ backdropFilter: "blur(0px)" }}
          className="absolute inset-0 bg-black/20"
          onClick={handleClose}
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="relative w-full max-w-2xl mx-4 bg-white shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Stepper Content */}
          <div className="p-6 pb-4">
            <Stepper
              initialStep={1}
              onStepChange={() => {}}
              onFinalStepCompleted={handleSubmit}
              backButtonText="Previous"
              nextButtonText="Continue"
              stepCircleContainerClassName="bg-white border-gray-200"
              contentClassName="pb-8"
              validateStep={validateCurrentStep}
            >
              {/* Step 1: Tell Me About You */}
              <Step>
                <div className="space-y-6 pb-4">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-black mb-2">
                      Tell Me About You
                    </h2>
                    <p className="text-gray-600">
                      Hi there! I&apos;m excited to potentially work together.
                      Let&apos;s start with the basics.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => updateFormData("name", e.target.value)}
                        className={`w-full px-4 py-3 border focus:outline-none transition-colors ${
                          errors.name
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-300 focus:border-black"
                        }`}
                        placeholder="Your full name"
                        required
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Company/Role
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) =>
                          updateFormData("company", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors"
                        placeholder="Your company or current role"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          updateFormData("email", e.target.value)
                        }
                        className={`w-full px-4 py-3 border focus:outline-none transition-colors ${
                          errors.email
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-300 focus:border-black"
                        }`}
                        placeholder="your@email.com"
                        required
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        What best describes you?
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) => updateFormData("role", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors bg-white"
                      >
                        <option value="">Select your role</option>
                        <option value="startup-founder">Startup Founder</option>
                        <option value="business-owner">Business Owner</option>
                        <option value="product-manager">Product Manager</option>
                        <option value="marketing-manager">
                          Marketing Manager
                        </option>
                        <option value="developer">Developer</option>
                        <option value="designer">Designer</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </Step>

              {/* Step 2: What Do You Want to Build? */}
              <Step>
                <div className="space-y-6 pb-4">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-black mb-2">
                      What Do You Want to Build?
                    </h2>
                    <p className="text-gray-600">
                      What kind of project are you looking to create?
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-3">
                        Project Type *
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { value: "website", label: "Website" },
                          { value: "web-app", label: "Web App" },
                          { value: "mobile-app", label: "Mobile App" },
                          { value: "e-commerce", label: "E-commerce" },
                          { value: "portfolio", label: "Portfolio" },
                          { value: "other", label: "Other" },
                        ].map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() =>
                              updateFormData("projectType", option.value)
                            }
                            className={`p-3 border text-left transition-all ${
                              formData.projectType === option.value
                                ? "border-black bg-black text-white"
                                : errors.projectType
                                ? "border-red-500 hover:border-red-400"
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                      {errors.projectType && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.projectType}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Briefly describe your vision
                      </label>
                      <textarea
                        value={formData.projectDescription}
                        onChange={(e) =>
                          updateFormData("projectDescription", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors resize-none"
                        rows={4}
                        placeholder="Tell me about your project in 2-3 sentences..."
                      />
                    </div>
                  </div>
                </div>
              </Step>

              {/* Step 3: Project Details */}
              <Step>
                <div className="space-y-6 pb-4">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-black mb-2">
                      Project Details
                    </h2>
                    <p className="text-gray-600">
                      Help me understand your timeline and requirements.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        When do you need this completed? *
                      </label>
                      <select
                        value={formData.timeline}
                        onChange={(e) =>
                          updateFormData("timeline", e.target.value)
                        }
                        className={`w-full px-4 py-3 border focus:outline-none transition-colors bg-white ${
                          errors.timeline
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-300 focus:border-black"
                        }`}
                        required
                      >
                        <option value="">Select timeline</option>
                        <option value="asap">ASAP</option>
                        <option value="1-2-months">1-2 months</option>
                        <option value="3-6-months">3-6 months</option>
                        <option value="just-exploring">Just exploring</option>
                      </select>
                      {errors.timeline && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.timeline}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        What&apos;s your budget range? *
                      </label>
                      <select
                        value={formData.budget}
                        onChange={(e) =>
                          updateFormData("budget", e.target.value)
                        }
                        className={`w-full px-4 py-3 border focus:outline-none transition-colors bg-white ${
                          errors.budget
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-300 focus:border-black"
                        }`}
                        required
                      >
                        <option value="">Select budget range</option>
                        <option value="under-5k">Under $5,000</option>
                        <option value="5k-15k">$5,000 - $15,000</option>
                        <option value="15k-30k">$15,000 - $30,000</option>
                        <option value="30k-50k">$30,000 - $50,000</option>
                        <option value="50k-plus">$50,000+</option>
                        <option value="discuss">Let&apos;s discuss</option>
                      </select>
                      {errors.budget && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.budget}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Any specific features or requirements?
                      </label>
                      <textarea
                        value={formData.requirements}
                        onChange={(e) =>
                          updateFormData("requirements", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors resize-none"
                        rows={4}
                        placeholder="Optional: Any specific features, integrations, or requirements..."
                      />
                    </div>
                  </div>
                </div>
              </Step>

              {/* Step 4: Let's Connect */}
              <Step>
                <div className="space-y-6 pb-4">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-black mb-2">
                      Let&apos;s Connect
                    </h2>
                    <p className="text-gray-600">
                      Perfect! Here&apos;s what happens next:
                    </p>
                  </div>

                  {/* Summary */}
                  <div className="bg-gray-50 p-4 border border-gray-200 space-y-2">
                    <h3 className="font-semibold text-black">
                      Project Summary:
                    </h3>
                    <p className="text-sm text-gray-700">
                      <strong>Project:</strong>{" "}
                      {formData.projectType || "Not specified"} for{" "}
                      {formData.name || "Client"}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Timeline:</strong>{" "}
                      {formData.timeline || "Not specified"}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Budget:</strong>{" "}
                      {formData.budget || "Not specified"}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="text-center space-y-2">
                      <p className="text-gray-700">
                        ✅ I&apos;ll review your project details
                      </p>
                      <p className="text-gray-700">
                        ✅ Get back to you within 24-48 hours
                      </p>
                      <p className="text-gray-700">
                        ✅ Discuss next steps and timeline
                      </p>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <input
                          type="checkbox"
                          id="preferCall"
                          checked={formData.preferCall}
                          onChange={(e) =>
                            updateFormData("preferCall", e.target.checked)
                          }
                          className="w-4 h-4 text-black border-gray-300 focus:ring-black"
                        />
                        <label
                          htmlFor="preferCall"
                          className="text-sm font-medium text-black"
                        >
                          Prefer a quick call instead?
                        </label>
                      </div>

                      {formData.preferCall && (
                        <div>
                          <input
                            type="tel"
                            value={formData.phoneNumber}
                            onChange={(e) =>
                              updateFormData("phoneNumber", e.target.value)
                            }
                            className={`w-full px-4 py-3 border focus:outline-none transition-colors ${
                              errors.phoneNumber
                                ? "border-red-500 focus:border-red-500"
                                : "border-gray-300 focus:border-black"
                            }`}
                            placeholder="Your phone number"
                          />
                          {errors.phoneNumber && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.phoneNumber}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Step>
            </Stepper>
          </div>
        </motion.div>
      </motion.div>

      {/* Onboarding Loader */}
      <OnboardingLoader
        loading={isLoading}
        onComplete={handleLoadingComplete}
        formData={{
          name: formData.name,
          projectType: formData.projectType,
          timeline: formData.timeline,
          budget: formData.budget,
        }}
      />
    </AnimatePresence>
  );
}
