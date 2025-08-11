"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { AnimationWrapper } from "@/components/ui/animation";
import {
  projectInquirySchema,
  type ProjectInquiryFormData,
  budgetOptions,
  timelineOptions,
  projectTypeOptions,
} from "@/lib/contact-validation";
import { cn } from "@/lib/utils";

interface ProjectInquiryFormProps {
  className?: string;
  onSuccess?: (data: ProjectInquiryFormData) => void;
  onError?: (error: string) => void;
}

interface FormErrors {
  [key: string]: string;
}

export function ProjectInquiryForm({
  className,
  onSuccess,
  onError,
}: ProjectInquiryFormProps) {
  const [formData, setFormData] = useState<ProjectInquiryFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
    type: "PROJECT_INQUIRY",
    projectType: "",
    budget: "",
    timeline: "",
    requirements: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    field: keyof ProjectInquiryFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    try {
      projectInquirySchema.parse(formData);
      setErrors({});
      return true;
    } catch (error: any) {
      const newErrors: FormErrors = {};
      error.errors?.forEach((err: any) => {
        newErrors[err.path[0]] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setIsSubmitted(true);
        onSuccess?.(formData);

        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            name: "",
            email: "",
            subject: "",
            message: "",
            type: "PROJECT_INQUIRY",
            projectType: "",
            budget: "",
            timeline: "",
            requirements: "",
          });
          setIsSubmitted(false);
        }, 5000);
      } else {
        throw new Error(result.error || "Submission failed");
      }
    } catch (error: any) {
      console.error("Project inquiry submission error:", error);
      const errorMessage =
        error.message || "Failed to send inquiry. Please try again.";
      setErrors({ submit: errorMessage });
      onError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <AnimationWrapper type="fadeIn" className={className}>
        <Card variant="accent" padding="lg" className="text-center">
          <CardContent>
            <Typography variant="h3" className="mb-4">
              PROJECT INQUIRY RECEIVED!
            </Typography>
            <Typography variant="body" className="mb-4">
              Thank you for your detailed project inquiry. I'll review your
              requirements and get back to you within 24 hours with:
            </Typography>
            <ul className="mx-auto mb-6 max-w-md space-y-2 text-left">
              <li className="flex items-start">
                <span className="text-brutalist-yellow mr-2">•</span>
                Initial thoughts on your project
              </li>
              <li className="flex items-start">
                <span className="text-brutalist-yellow mr-2">•</span>
                Potential approach and timeline
              </li>
              <li className="flex items-start">
                <span className="text-brutalist-yellow mr-2">•</span>
                Next steps for moving forward
              </li>
            </ul>
            <div className="mx-auto h-1 w-16 bg-black"></div>
          </CardContent>
        </Card>
      </AnimationWrapper>
    );
  }

  return (
    <AnimationWrapper type="fadeIn" className={className}>
      <Card variant="default" padding="lg">
        <CardHeader>
          <CardTitle>PROJECT INQUIRY</CardTitle>
          <Typography variant="body" className="text-brutalist-off-white-100">
            Tell me about your project. The more details you provide, the better
            I can help you.
          </Typography>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-brutalist-yellow block font-mono text-sm font-bold tracking-wider uppercase"
                >
                  Name *
                </label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="YOUR FULL NAME"
                  className={cn(
                    "transition-all duration-200",
                    errors.name &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500"
                  )}
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <Typography variant="caption" className="text-red-400">
                    {errors.name}
                  </Typography>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-brutalist-yellow block font-mono text-sm font-bold tracking-wider uppercase"
                >
                  Email *
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="YOUR@EMAIL.COM"
                  className={cn(
                    "transition-all duration-200",
                    errors.email &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500"
                  )}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <Typography variant="caption" className="text-red-400">
                    {errors.email}
                  </Typography>
                )}
              </div>
            </div>

            {/* Project Type */}
            <div className="space-y-2">
              <label
                htmlFor="projectType"
                className="text-brutalist-yellow block font-mono text-sm font-bold tracking-wider uppercase"
              >
                Project Type *
              </label>
              <select
                id="projectType"
                value={formData.projectType}
                onChange={(e) =>
                  handleInputChange("projectType", e.target.value)
                }
                className={cn(
                  "bg-brutalist-charcoal-100 focus:ring-brutalist-yellow focus:border-brutalist-yellow flex h-12 w-full border-4 border-white px-4 py-3 font-mono text-base text-white focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                  errors.projectType &&
                    "border-red-500 focus:border-red-500 focus:ring-red-500"
                )}
                disabled={isSubmitting}
              >
                <option value="">SELECT PROJECT TYPE</option>
                {projectTypeOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    className="bg-brutalist-charcoal-100 text-white"
                  >
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.projectType && (
                <Typography variant="caption" className="text-red-400">
                  {errors.projectType}
                </Typography>
              )}
            </div>

            {/* Budget and Timeline */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="budget"
                  className="text-brutalist-yellow block font-mono text-sm font-bold tracking-wider uppercase"
                >
                  Budget Range *
                </label>
                <select
                  id="budget"
                  value={formData.budget}
                  onChange={(e) => handleInputChange("budget", e.target.value)}
                  className={cn(
                    "bg-brutalist-charcoal-100 focus:ring-brutalist-yellow focus:border-brutalist-yellow flex h-12 w-full border-4 border-white px-4 py-3 font-mono text-base text-white focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                    errors.budget &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500"
                  )}
                  disabled={isSubmitting}
                >
                  <option value="">SELECT BUDGET</option>
                  {budgetOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      className="bg-brutalist-charcoal-100 text-white"
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.budget && (
                  <Typography variant="caption" className="text-red-400">
                    {errors.budget}
                  </Typography>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="timeline"
                  className="text-brutalist-yellow block font-mono text-sm font-bold tracking-wider uppercase"
                >
                  Timeline *
                </label>
                <select
                  id="timeline"
                  value={formData.timeline}
                  onChange={(e) =>
                    handleInputChange("timeline", e.target.value)
                  }
                  className={cn(
                    "bg-brutalist-charcoal-100 focus:ring-brutalist-yellow focus:border-brutalist-yellow flex h-12 w-full border-4 border-white px-4 py-3 font-mono text-base text-white focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                    errors.timeline &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500"
                  )}
                  disabled={isSubmitting}
                >
                  <option value="">SELECT TIMELINE</option>
                  {timelineOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      className="bg-brutalist-charcoal-100 text-white"
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.timeline && (
                  <Typography variant="caption" className="text-red-400">
                    {errors.timeline}
                  </Typography>
                )}
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <label
                htmlFor="subject"
                className="text-brutalist-yellow block font-mono text-sm font-bold tracking-wider uppercase"
              >
                Project Title
              </label>
              <Input
                id="subject"
                type="text"
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                placeholder="GIVE YOUR PROJECT A NAME"
                className={cn(
                  "transition-all duration-200",
                  errors.subject &&
                    "border-red-500 focus:border-red-500 focus:ring-red-500"
                )}
                disabled={isSubmitting}
              />
              {errors.subject && (
                <Typography variant="caption" className="text-red-400">
                  {errors.subject}
                </Typography>
              )}
            </div>

            {/* Requirements */}
            <div className="space-y-2">
              <label
                htmlFor="requirements"
                className="text-brutalist-yellow block font-mono text-sm font-bold tracking-wider uppercase"
              >
                Detailed Requirements *
              </label>
              <textarea
                id="requirements"
                value={formData.requirements}
                onChange={(e) =>
                  handleInputChange("requirements", e.target.value)
                }
                placeholder="DESCRIBE YOUR PROJECT IN DETAIL:
• What problem are you solving?
• Who is your target audience?
• What features do you need?
• Any specific technologies or integrations?
• Design preferences or existing brand guidelines?
• Any existing systems to integrate with?"
                rows={8}
                className={cn(
                  "bg-brutalist-charcoal-100 placeholder:text-brutalist-off-white-100 focus:ring-brutalist-yellow focus:border-brutalist-yellow flex w-full resize-none border-4 border-white px-4 py-3 font-mono text-base text-white transition-all duration-200 focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                  errors.requirements &&
                    "border-red-500 focus:border-red-500 focus:ring-red-500"
                )}
                disabled={isSubmitting}
              />
              {errors.requirements && (
                <Typography variant="caption" className="text-red-400">
                  {errors.requirements}
                </Typography>
              )}
            </div>

            {/* Additional Message */}
            <div className="space-y-2">
              <label
                htmlFor="message"
                className="text-brutalist-yellow block font-mono text-sm font-bold tracking-wider uppercase"
              >
                Additional Information
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                placeholder="ANYTHING ELSE YOU'D LIKE TO SHARE?"
                rows={4}
                className={cn(
                  "bg-brutalist-charcoal-100 placeholder:text-brutalist-off-white-100 focus:ring-brutalist-yellow focus:border-brutalist-yellow flex w-full resize-none border-4 border-white px-4 py-3 font-mono text-base text-white transition-all duration-200 focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                  errors.message &&
                    "border-red-500 focus:border-red-500 focus:ring-red-500"
                )}
                disabled={isSubmitting}
              />
              {errors.message && (
                <Typography variant="caption" className="text-red-400">
                  {errors.message}
                </Typography>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="border-2 border-red-500 bg-red-500/10 p-4">
                <Typography variant="caption" className="text-red-400">
                  {errors.submit}
                </Typography>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="accent"
              size="lg"
              disabled={isSubmitting}
              className="w-full transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:transform"
            >
              {isSubmitting ? "SENDING INQUIRY..." : "SEND PROJECT INQUIRY"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </AnimationWrapper>
  );
}
