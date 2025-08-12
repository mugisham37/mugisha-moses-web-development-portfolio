"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StarRating } from "./star-rating";

interface TestimonialSubmissionFormProps {
  onSubmit?: (data: TestimonialFormData) => Promise<void>;
  className?: string;
}

interface TestimonialFormData {
  name: string;
  email: string;
  role: string;
  company?: string;
  content: string;
  rating: number;
  projectType?: string;
  videoUrl?: string;
  linkedinProfile?: string;
  allowPublic: boolean;
  allowMarketing: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  role?: string;
  company?: string;
  content?: string;
  rating?: string;
  projectType?: string;
  videoUrl?: string;
  linkedinProfile?: string;
  allowPublic?: string;
  allowMarketing?: string;
}

export function TestimonialSubmissionForm({
  onSubmit,
  className = "",
}: TestimonialSubmissionFormProps) {
  const [formData, setFormData] = useState<TestimonialFormData>({
    name: "",
    email: "",
    role: "",
    company: "",
    content: "",
    rating: 5,
    projectType: "",
    videoUrl: "",
    linkedinProfile: "",
    allowPublic: true,
    allowMarketing: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.role.trim()) {
      newErrors.role = "Role/Position is required";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Testimonial content is required";
    } else if (formData.content.trim().length < 50) {
      newErrors.content = "Please provide at least 50 characters";
    }

    if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = "Please provide a rating between 1 and 5 stars";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Default API call
        const response = await fetch("/api/testimonials", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Failed to submit testimonial");
        }
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      // Handle error (show toast, etc.)
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    field: keyof TestimonialFormData,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={className}
      >
        <Card className="bg-brutalist-charcoal-100 p-12 text-center">
          <div className="space-y-6">
            <div className="text-6xl">🎉</div>
            <Typography
              variant="h2"
              className="text-brutalist-yellow text-2xl font-bold uppercase"
            >
              Thank You!
            </Typography>
            <Typography
              variant="body"
              className="mx-auto max-w-md text-gray-300"
            >
              Your testimonial has been submitted successfully. We&apos;ll review it
              and get back to you soon.
            </Typography>
            <Button
              variant="accent"
              onClick={() => {
                setIsSubmitted(false);
                setFormData({
                  name: "",
                  email: "",
                  role: "",
                  company: "",
                  content: "",
                  rating: 5,
                  projectType: "",
                  videoUrl: "",
                  linkedinProfile: "",
                  allowPublic: true,
                  allowMarketing: false,
                });
              }}
            >
              Submit Another Testimonial
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className="p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2 text-center">
            <Typography variant="h2" className="text-2xl font-bold uppercase">
              Share Your Experience
            </Typography>
            <Typography variant="body" className="text-gray-400">
              Help others discover the quality of our work by sharing your
              project experience.
            </Typography>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="John Doe"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <span className="text-sm text-red-400">{errors.name}</span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="john@company.com"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <span className="text-sm text-red-400">{errors.email}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="role">Role/Position *</Label>
                <Input
                  id="role"
                  type="text"
                  value={formData.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                  placeholder="CEO, CTO, Founder, etc."
                  className={errors.role ? "border-red-500" : ""}
                />
                {errors.role && (
                  <span className="text-sm text-red-400">{errors.role}</span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company (Optional)</Label>
                <Input
                  id="company"
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  placeholder="Your Company Name"
                />
              </div>
            </div>

            {/* Project Information */}
            <div className="space-y-2">
              <Label htmlFor="projectType">Project Type (Optional)</Label>
              <select
                id="projectType"
                value={formData.projectType}
                onChange={(e) =>
                  handleInputChange("projectType", e.target.value)
                }
                className="focus:border-brutalist-yellow w-full border-2 border-white bg-black px-4 py-3 text-white focus:outline-none"
              >
                <option value="">Select project type</option>
                <option value="web-development">Web Development</option>
                <option value="mobile-app">Mobile App Development</option>
                <option value="full-stack">Full-Stack Development</option>
                <option value="performance">Performance Optimization</option>
                <option value="consulting">Technical Consulting</option>
                <option value="maintenance">Maintenance & Support</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <Label>Overall Rating *</Label>
              <div className="flex items-center gap-4">
                <StarRating
                  rating={formData.rating}
                  interactive={true}
                  onChange={(rating) => handleInputChange("rating", rating)}
                  size="lg"
                />
                <span className="font-mono text-gray-400">
                  {formData.rating}/5 stars
                </span>
              </div>
              {errors.rating && (
                <span className="text-sm text-red-400">{errors.rating}</span>
              )}
            </div>

            {/* Testimonial Content */}
            <div className="space-y-2">
              <Label htmlFor="content">Your Testimonial *</Label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                placeholder="Share your experience working with us. What challenges did we solve? What results did you achieve? How was the process?"
                rows={6}
                className={`focus:border-brutalist-yellow resize-vertical w-full border-2 border-white bg-black px-4 py-3 text-white focus:outline-none ${errors.content ? "border-red-500" : ""} `}
              />
              <div className="flex justify-between text-sm text-gray-400">
                <span>{formData.content.length}/500 characters</span>
                <span>Minimum 50 characters</span>
              </div>
              {errors.content && (
                <span className="text-sm text-red-400">{errors.content}</span>
              )}
            </div>

            {/* Video URL (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="videoUrl">Video Testimonial URL (Optional)</Label>
              <Input
                id="videoUrl"
                type="url"
                value={formData.videoUrl}
                onChange={(e) => handleInputChange("videoUrl", e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
              />
              <span className="text-xs text-gray-500">
                If you have a video testimonial, please provide the URL
                (YouTube, Vimeo, etc.)
              </span>
            </div>

            {/* LinkedIn Profile (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="linkedinProfile">
                LinkedIn Profile (Optional)
              </Label>
              <Input
                id="linkedinProfile"
                type="url"
                value={formData.linkedinProfile || ""}
                onChange={(e) =>
                  handleInputChange("linkedinProfile", e.target.value)
                }
                placeholder="https://linkedin.com/in/your-profile"
              />
              <span className="text-xs text-gray-500">
                Your LinkedIn profile helps us verify your testimonial
              </span>
            </div>

            {/* Permissions */}
            <div className="space-y-4 rounded border border-gray-700 p-4">
              <Typography variant="h4" className="font-bold">
                Usage Permissions
              </Typography>

              <div className="space-y-3">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={formData.allowPublic}
                    onChange={(e) =>
                      handleInputChange("allowPublic", e.target.checked)
                    }
                    className="accent-brutalist-yellow mt-1 h-4 w-4"
                  />
                  <div>
                    <span className="text-sm font-medium">
                      Allow public display of this testimonial
                    </span>
                    <p className="text-xs text-gray-400">
                      Your testimonial may be displayed on our website and
                      portfolio
                    </p>
                  </div>
                </label>

                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={formData.allowMarketing}
                    onChange={(e) =>
                      handleInputChange("allowMarketing", e.target.checked)
                    }
                    className="accent-brutalist-yellow mt-1 h-4 w-4"
                  />
                  <div>
                    <span className="text-sm font-medium">
                      Allow use in marketing materials
                    </span>
                    <p className="text-xs text-gray-400">
                      Your testimonial may be used in proposals, case studies,
                      and marketing content
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="accent"
              size="lg"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "Submitting..." : "Submit Testimonial"}
            </Button>
          </form>
        </div>
      </Card>
    </motion.div>
  );
}
