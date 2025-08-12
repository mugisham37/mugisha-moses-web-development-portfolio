"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { AnimationWrapper } from "@/components/ui/animation";
import { ContactForm } from "@/components/forms/contact-form";
import { ProjectInquiryForm } from "@/components/forms/project-inquiry-form";
import { ConsultationBookingForm } from "@/components/forms/consultation-booking-form";
import { MessageSquare, Briefcase, Calendar, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactFormSelectorProps {
  className?: string;
  defaultForm?: "general" | "project" | "consultation";
}

type FormType = "general" | "project" | "consultation" | null;

const formOptions = [
  {
    type: "general" as const,
    title: "General Contact",
    description: "Ask questions, share ideas, or just say hello",
    icon: MessageSquare,
    color: "default" as const,
  },
  {
    type: "project" as const,
    title: "Project Inquiry",
    description: "Get a detailed quote for your project",
    icon: Briefcase,
    color: "accent" as const,
  },
  {
    type: "consultation" as const,
    title: "Book Consultation",
    description: "Schedule a free consultation call",
    icon: Calendar,
    color: "interactive" as const,
  },
];

export function ContactFormSelector({
  className,
  defaultForm,
}: ContactFormSelectorProps) {
  const searchParams = useSearchParams();
  const [selectedForm, setSelectedForm] = useState<FormType>(
    defaultForm || null
  );
  const [, setServiceContext] = useState<{
    service?: string;
    tier?: string;
    type?: string;
  }>({});

  // Handle URL parameters for service-specific inquiries
  useEffect(() => {
    const service = searchParams.get("service");
    const tier = searchParams.get("tier");
    const type = searchParams.get("type");

    setServiceContext({
      service: service || undefined,
      tier: tier || undefined,
      type: type || undefined,
    });

    // Auto-select form based on URL parameters
    if (type === "consultation") {
      setSelectedForm("consultation");
    } else if (service) {
      setSelectedForm("project");
    } else if (type) {
      setSelectedForm("general");
    }
  }, [searchParams]);

  const handleFormSuccess = (data: Record<string, unknown>) => {
    console.log("Form submitted successfully:", data);
  };

  const handleFormError = (error: string) => {
    console.error("Form submission error:", error);
  };

  const handleBackToSelector = () => {
    setSelectedForm(null);
  };

  // Show form selector
  if (!selectedForm) {
    return (
      <AnimationWrapper type="fadeIn" className={className}>
        <div className="space-y-6">
          <div className="mb-8 text-center">
            <Typography variant="h2" className="mb-4">
              LET&apos;S WORK TOGETHER
            </Typography>
            <Typography
              variant="body"
              className="text-brutalist-off-white-100 mx-auto max-w-2xl"
            >
              Choose the best way to get in touch. I&apos;ll respond to all
              inquiries within 24 hours.
            </Typography>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {formOptions.map((option, index) => {
              const IconComponent = option.icon;

              return (
                <AnimationWrapper
                  key={option.type}
                  type="slideIn"
                  delay={index * 0.1}
                >
                  <Card
                    variant={option.color}
                    padding="lg"
                    hover="lift"
                    className="group h-full cursor-pointer text-center"
                    onClick={() => setSelectedForm(option.type)}
                  >
                    <CardHeader>
                      <div
                        className={cn(
                          "mx-auto mb-4 border-4 p-4 transition-all duration-200",
                          option.color === "accent"
                            ? "text-brutalist-yellow border-black bg-black"
                            : "group-hover:border-brutalist-yellow group-hover:bg-brutalist-yellow border-white bg-transparent text-white group-hover:text-black"
                        )}
                      >
                        <IconComponent size={32} />
                      </div>
                      <CardTitle className="mb-2">{option.title}</CardTitle>
                    </CardHeader>

                    <CardContent>
                      <Typography
                        variant="body"
                        className={cn(
                          "mb-6",
                          option.color === "accent"
                            ? "text-black"
                            : "text-brutalist-off-white-100"
                        )}
                      >
                        {option.description}
                      </Typography>

                      <Button
                        variant={
                          option.color === "accent" ? "secondary" : "accent"
                        }
                        size="md"
                        className="w-full transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:transform"
                      >
                        SELECT
                      </Button>
                    </CardContent>
                  </Card>
                </AnimationWrapper>
              );
            })}
          </div>

          {/* Quick stats or testimonial */}
          <AnimationWrapper type="fadeIn" delay={0.4}>
            <Card variant="elevated" padding="lg" className="text-center">
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div>
                    <Typography
                      variant="h3"
                      className="text-brutalist-yellow mb-2"
                    >
                      24H
                    </Typography>
                    <Typography
                      variant="caption"
                      className="text-brutalist-off-white-100"
                    >
                      RESPONSE TIME
                    </Typography>
                  </div>
                  <div>
                    <Typography
                      variant="h3"
                      className="text-brutalist-yellow mb-2"
                    >
                      100%
                    </Typography>
                    <Typography
                      variant="caption"
                      className="text-brutalist-off-white-100"
                    >
                      CLIENT SATISFACTION
                    </Typography>
                  </div>
                  <div>
                    <Typography
                      variant="h3"
                      className="text-brutalist-yellow mb-2"
                    >
                      50+
                    </Typography>
                    <Typography
                      variant="caption"
                      className="text-brutalist-off-white-100"
                    >
                      PROJECTS DELIVERED
                    </Typography>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimationWrapper>
        </div>
      </AnimationWrapper>
    );
  }

  // Show selected form
  const selectedOption = formOptions.find(
    (option) => option.type === selectedForm
  );

  return (
    <div className={className}>
      {/* Back button */}
      <AnimationWrapper type="slideIn">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackToSelector}
          className="hover:bg-brutalist-yellow mb-6 flex items-center gap-2 hover:text-black"
        >
          <ArrowLeft size={16} />
          BACK TO OPTIONS
        </Button>
      </AnimationWrapper>

      {/* Form header */}
      <AnimationWrapper type="fadeIn" delay={0.1}>
        <div className="mb-8 text-center">
          <Typography variant="h3" className="mb-2">
            {selectedOption?.title.toUpperCase()}
          </Typography>
          <Typography variant="body" className="text-brutalist-off-white-100">
            {selectedOption?.description}
          </Typography>
        </div>
      </AnimationWrapper>

      {/* Render selected form */}
      <AnimationWrapper type="slideIn" delay={0.2}>
        {selectedForm === "general" && (
          <ContactForm
            onSuccess={handleFormSuccess}
            onError={handleFormError}
          />
        )}

        {selectedForm === "project" && (
          <ProjectInquiryForm
            onSuccess={handleFormSuccess}
            onError={handleFormError}
          />
        )}

        {selectedForm === "consultation" && (
          <ConsultationBookingForm
            onSuccess={handleFormSuccess}
            onError={handleFormError}
          />
        )}
      </AnimationWrapper>
    </div>
  );
}
