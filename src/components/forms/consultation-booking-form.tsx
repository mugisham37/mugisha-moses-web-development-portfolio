"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { AnimationWrapper } from "@/components/ui/animation";
import {
  consultationBookingSchema,
  type ConsultationBookingFormData,
  serviceTypeOptions,
} from "@/lib/contact-validation";
import { cn } from "@/lib/utils";

interface ConsultationBookingFormProps {
  className?: string;
  onSuccess?: (data: ConsultationBookingFormData) => void;
  onError?: (error: string) => void;
}

interface FormErrors {
  [key: string]: string;
}

// Timezone options (simplified list)
const timezoneOptions = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Paris", label: "Central European Time (CET)" },
  { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
  { value: "Australia/Sydney", label: "Australian Eastern Time (AET)" },
  { value: "UTC", label: "Coordinated Universal Time (UTC)" },
];

// Time slot options
const timeSlotOptions = [
  { value: "09:00", label: "9:00 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "14:00", label: "2:00 PM" },
  { value: "15:00", label: "3:00 PM" },
  { value: "16:00", label: "4:00 PM" },
];

export function ConsultationBookingForm({
  className,
  onSuccess,
  onError,
}: ConsultationBookingFormProps) {
  const [formData, setFormData] = useState<ConsultationBookingFormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    serviceType: "",
    preferredDate: "",
    preferredTime: "",
    timezone: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  // Detect user's timezone
  useEffect(() => {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const matchingTimezone = timezoneOptions.find(
      (tz) => tz.value === userTimezone
    );

    if (matchingTimezone) {
      setFormData((prev) => ({ ...prev, timezone: userTimezone }));
    } else {
      // Default to UTC if user's timezone is not in our list
      setFormData((prev) => ({ ...prev, timezone: "UTC" }));
    }
  }, []);

  const handleInputChange = (
    field: keyof ConsultationBookingFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Fetch available slots when date changes
    if (field === "preferredDate" && value) {
      fetchAvailableSlots(value, formData.timezone);
    }
  };

  const fetchAvailableSlots = async (date: string, timezone: string) => {
    try {
      const response = await fetch(
        `/api/contact/consultation?date=${date}&timezone=${timezone}`
      );
      const result = await response.json();

      if (result.success) {
        setAvailableSlots(result.availableSlots);
      }
    } catch (error) {
      console.error("Failed to fetch available slots:", error);
    }
  };

  const validateForm = (): boolean => {
    try {
      consultationBookingSchema.parse(formData);
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
      const response = await fetch("/api/contact/consultation", {
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
            phone: "",
            company: "",
            serviceType: "",
            preferredDate: "",
            preferredTime: "",
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
            message: "",
          });
          setIsSubmitted(false);
        }, 5000);
      } else {
        throw new Error(result.error || "Booking failed");
      }
    } catch (error: any) {
      console.error("Consultation booking error:", error);
      const errorMessage =
        error.message || "Failed to book consultation. Please try again.";
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
              CONSULTATION BOOKED!
            </Typography>
            <Typography variant="body" className="mb-4">
              Thank you for booking a consultation. I'll confirm your preferred
              time slot and send you a calendar invite within 24 hours.
            </Typography>
            <div className="mb-6 rounded-none border-2 border-black bg-black/20 p-4">
              <Typography variant="body" className="font-bold">
                {formData.serviceType} Consultation
              </Typography>
              <Typography variant="caption">
                {formData.preferredDate} at {formData.preferredTime} (
                {formData.timezone})
              </Typography>
            </div>
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
          <CardTitle>BOOK CONSULTATION</CardTitle>
          <Typography variant="body" className="text-brutalist-off-white-100">
            Schedule a free consultation to discuss your project needs and how I
            can help.
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

            {/* Contact Information */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="text-brutalist-yellow block font-mono text-sm font-bold tracking-wider uppercase"
                >
                  Phone
                </label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className={cn(
                    "transition-all duration-200",
                    errors.phone &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500"
                  )}
                  disabled={isSubmitting}
                />
                {errors.phone && (
                  <Typography variant="caption" className="text-red-400">
                    {errors.phone}
                  </Typography>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="company"
                  className="text-brutalist-yellow block font-mono text-sm font-bold tracking-wider uppercase"
                >
                  Company
                </label>
                <Input
                  id="company"
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  placeholder="YOUR COMPANY NAME"
                  className={cn(
                    "transition-all duration-200",
                    errors.company &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500"
                  )}
                  disabled={isSubmitting}
                />
                {errors.company && (
                  <Typography variant="caption" className="text-red-400">
                    {errors.company}
                  </Typography>
                )}
              </div>
            </div>

            {/* Service Type */}
            <div className="space-y-2">
              <label
                htmlFor="serviceType"
                className="text-brutalist-yellow block font-mono text-sm font-bold tracking-wider uppercase"
              >
                Service Type *
              </label>
              <select
                id="serviceType"
                value={formData.serviceType}
                onChange={(e) =>
                  handleInputChange("serviceType", e.target.value)
                }
                className={cn(
                  "bg-brutalist-charcoal-100 focus:ring-brutalist-yellow focus:border-brutalist-yellow flex h-12 w-full border-4 border-white px-4 py-3 font-mono text-base text-white focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                  errors.serviceType &&
                    "border-red-500 focus:border-red-500 focus:ring-red-500"
                )}
                disabled={isSubmitting}
              >
                <option value="">SELECT SERVICE TYPE</option>
                {serviceTypeOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    className="bg-brutalist-charcoal-100 text-white"
                  >
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.serviceType && (
                <Typography variant="caption" className="text-red-400">
                  {errors.serviceType}
                </Typography>
              )}
            </div>

            {/* Scheduling */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <label
                  htmlFor="preferredDate"
                  className="text-brutalist-yellow block font-mono text-sm font-bold tracking-wider uppercase"
                >
                  Preferred Date *
                </label>
                <Input
                  id="preferredDate"
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) =>
                    handleInputChange("preferredDate", e.target.value)
                  }
                  min={getMinDate()}
                  className={cn(
                    "transition-all duration-200",
                    errors.preferredDate &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500"
                  )}
                  disabled={isSubmitting}
                />
                {errors.preferredDate && (
                  <Typography variant="caption" className="text-red-400">
                    {errors.preferredDate}
                  </Typography>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="preferredTime"
                  className="text-brutalist-yellow block font-mono text-sm font-bold tracking-wider uppercase"
                >
                  Preferred Time *
                </label>
                <select
                  id="preferredTime"
                  value={formData.preferredTime}
                  onChange={(e) =>
                    handleInputChange("preferredTime", e.target.value)
                  }
                  className={cn(
                    "bg-brutalist-charcoal-100 focus:ring-brutalist-yellow focus:border-brutalist-yellow flex h-12 w-full border-4 border-white px-4 py-3 font-mono text-base text-white focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                    errors.preferredTime &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500"
                  )}
                  disabled={isSubmitting}
                >
                  <option value="">SELECT TIME</option>
                  {timeSlotOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      className="bg-brutalist-charcoal-100 text-white"
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.preferredTime && (
                  <Typography variant="caption" className="text-red-400">
                    {errors.preferredTime}
                  </Typography>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="timezone"
                  className="text-brutalist-yellow block font-mono text-sm font-bold tracking-wider uppercase"
                >
                  Timezone *
                </label>
                <select
                  id="timezone"
                  value={formData.timezone}
                  onChange={(e) =>
                    handleInputChange("timezone", e.target.value)
                  }
                  className={cn(
                    "bg-brutalist-charcoal-100 focus:ring-brutalist-yellow focus:border-brutalist-yellow flex h-12 w-full border-4 border-white px-4 py-3 font-mono text-base text-white focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                    errors.timezone &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500"
                  )}
                  disabled={isSubmitting}
                >
                  <option value="">SELECT TIMEZONE</option>
                  {timezoneOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      className="bg-brutalist-charcoal-100 text-white"
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.timezone && (
                  <Typography variant="caption" className="text-red-400">
                    {errors.timezone}
                  </Typography>
                )}
              </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label
                htmlFor="message"
                className="text-brutalist-yellow block font-mono text-sm font-bold tracking-wider uppercase"
              >
                Consultation Details *
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                placeholder="TELL ME ABOUT YOUR CONSULTATION NEEDS:
• What challenges are you facing?
• What goals do you want to achieve?
• Any specific questions you'd like to discuss?
• Current project status or timeline?"
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
              {isSubmitting ? "BOOKING CONSULTATION..." : "BOOK CONSULTATION"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </AnimationWrapper>
  );
}
