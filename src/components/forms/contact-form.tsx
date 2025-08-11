"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { AnimationWrapper } from "@/components/ui/animation";
import {
  generalContactSchema,
  type GeneralContactFormData,
} from "@/lib/contact-validation";
import { cn } from "@/lib/utils";

interface ContactFormProps {
  className?: string;
  onSuccess?: (data: GeneralContactFormData) => void;
  onError?: (error: string) => void;
}

interface FormErrors {
  [key: string]: string;
}

export function ContactForm({
  className,
  onSuccess,
  onError,
}: ContactFormProps) {
  const [formData, setFormData] = useState<GeneralContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
    type: "GENERAL",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    field: keyof GeneralContactFormData,
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
      generalContactSchema.parse(formData);
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
            type: "GENERAL",
          });
          setIsSubmitted(false);
        }, 3000);
      } else {
        throw new Error(result.error || "Submission failed");
      }
    } catch (error: any) {
      console.error("Contact form submission error:", error);
      const errorMessage =
        error.message || "Failed to send message. Please try again.";
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
              MESSAGE SENT!
            </Typography>
            <Typography variant="body" className="mb-6">
              Thank you for reaching out. I'll get back to you within 24 hours.
            </Typography>
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
          <CardTitle>GET IN TOUCH</CardTitle>
          <Typography variant="body" className="text-brutalist-off-white-100">
            Ready to start your next project? Let's discuss your ideas.
          </Typography>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
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

            {/* Email Field */}
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

            {/* Subject Field */}
            <div className="space-y-2">
              <label
                htmlFor="subject"
                className="text-brutalist-yellow block font-mono text-sm font-bold tracking-wider uppercase"
              >
                Subject
              </label>
              <Input
                id="subject"
                type="text"
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                placeholder="WHAT'S THIS ABOUT?"
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

            {/* Message Field */}
            <div className="space-y-2">
              <label
                htmlFor="message"
                className="text-brutalist-yellow block font-mono text-sm font-bold tracking-wider uppercase"
              >
                Message *
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                placeholder="TELL ME ABOUT YOUR PROJECT OR QUESTION..."
                rows={6}
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
              {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </AnimationWrapper>
  );
}
