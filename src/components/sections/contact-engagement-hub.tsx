"use client";

import React, { useState } from "react";
import { Typography } from "@/components/ui/typography";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ViewportAnimation,
  StaggeredAnimation,
} from "@/components/animations/advanced-scroll-effects";
import { ScrollTextReveal } from "@/components/animations/scroll-reveal-system";

interface ContactMethod {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: string;
  href: string;
  availability: string;
  responseTime: string;
  featured: boolean;
}

const contactMethods: ContactMethod[] = [
  {
    id: "consultation",
    title: "FREE CONSULTATION",
    description:
      "30-minute strategy session to discuss your project goals, technical requirements, and success metrics.",
    icon: "🎯",
    action: "BOOK CONSULTATION",
    href: "/consultation",
    availability: "Mon-Fri, 9AM-6PM EST",
    responseTime: "Same day",
    featured: true,
  },
  {
    id: "email",
    title: "DIRECT EMAIL",
    description:
      "Send detailed project requirements and get a comprehensive proposal within 24 hours.",
    icon: "📧",
    action: "SEND EMAIL",
    href: "mailto:contact@example.com",
    availability: "24/7 monitoring",
    responseTime: "< 24 hours",
    featured: true,
  },
  {
    id: "linkedin",
    title: "LINKEDIN CONNECT",
    description:
      "Connect for professional networking, industry insights, and project collaboration opportunities.",
    icon: "💼",
    action: "CONNECT ON LINKEDIN",
    href: "https://linkedin.com/in/username",
    availability: "Professional hours",
    responseTime: "< 48 hours",
    featured: false,
  },
  {
    id: "github",
    title: "CODE REVIEW",
    description:
      "Need a technical audit? Share your repository for expert code review and optimization recommendations.",
    icon: "⚡",
    action: "REQUEST REVIEW",
    href: "https://github.com/username",
    availability: "By appointment",
    responseTime: "3-5 days",
    featured: false,
  },
];

interface ProjectType {
  id: string;
  name: string;
  description: string;
  priceRange: string;
  timeline: string;
  complexity: "Simple" | "Medium" | "Complex";
  popular: boolean;
}

const projectTypes: ProjectType[] = [
  {
    id: "web-app",
    name: "Web Application",
    description: "Custom web applications with modern frameworks",
    priceRange: "$5K - $50K",
    timeline: "6-12 weeks",
    complexity: "Medium",
    popular: true,
  },
  {
    id: "mobile-app",
    name: "Mobile Application",
    description: "Cross-platform mobile apps with native performance",
    priceRange: "$8K - $100K",
    timeline: "8-16 weeks",
    complexity: "Complex",
    popular: true,
  },
  {
    id: "consulting",
    name: "Technical Consulting",
    description: "Architecture review and optimization strategies",
    priceRange: "$200 - $500/hr",
    timeline: "1-4 weeks",
    complexity: "Simple",
    popular: false,
  },
  {
    id: "performance",
    name: "Performance Optimization",
    description: "Speed up existing applications and improve UX",
    priceRange: "$3K - $20K",
    timeline: "2-6 weeks",
    complexity: "Medium",
    popular: true,
  },
];

interface ContactMethodCardProps {
  method: ContactMethod;
  index: number;
  onSelect: (method: ContactMethod) => void;
}

const ContactMethodCard: React.FC<ContactMethodCardProps> = ({
  method,
  index,
  onSelect,
}) => {
  return (
    <ViewportAnimation
      variant="brutalistSlam"
      delay={index * 0.15}
      easing="elastic"
    >
      <Card
        className={`group h-full cursor-pointer border-4 transition-all duration-300 ${
          method.featured
            ? "border-brutalist-yellow bg-brutalist-yellow hover:text-brutalist-yellow text-black hover:bg-black"
            : "border-black bg-white hover:bg-black hover:text-white"
        }`}
        onClick={() => onSelect(method)}
      >
        <CardHeader>
          <div className="mb-4 text-4xl">{method.icon}</div>
          <CardTitle className="text-lg font-bold uppercase">
            {method.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Typography variant="body" className="mb-6 text-sm">
            {method.description}
          </Typography>

          <div className="mb-6 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-mono uppercase opacity-80">
                Availability
              </span>
              <span className="font-mono">{method.availability}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="font-mono uppercase opacity-80">
                Response Time
              </span>
              <span className="font-mono">{method.responseTime}</span>
            </div>
          </div>

          <Button
            variant={method.featured ? "secondary" : "primary"}
            size="sm"
            className="w-full font-mono text-xs uppercase"
          >
            {method.action}
          </Button>
        </CardContent>
      </Card>
    </ViewportAnimation>
  );
};

interface ProjectTypeCardProps {
  projectType: ProjectType;
  index: number;
  onSelect: (projectType: ProjectType) => void;
}

const ProjectTypeCard: React.FC<ProjectTypeCardProps> = ({
  projectType,
  index,
  onSelect,
}) => {
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Simple":
        return "text-green-500";
      case "Medium":
        return "text-brutalist-yellow";
      case "Complex":
        return "text-red-500";
      default:
        return "text-brutalist-charcoal-200";
    }
  };

  return (
    <ViewportAnimation variant="fadeInUp" delay={index * 0.1}>
      <Card
        className={`group cursor-pointer border-4 border-black bg-white transition-all duration-300 hover:bg-black hover:text-white ${
          projectType.popular ? "ring-brutalist-yellow ring-2" : ""
        }`}
        onClick={() => onSelect(projectType)}
      >
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <Typography variant="h4" className="text-lg font-bold uppercase">
              {projectType.name}
            </Typography>
            {projectType.popular && (
              <span className="bg-brutalist-yellow px-2 py-1 font-mono text-xs text-black uppercase">
                POPULAR
              </span>
            )}
          </div>

          <Typography
            variant="body"
            className="text-brutalist-charcoal-200 mb-4 text-sm group-hover:text-white"
          >
            {projectType.description}
          </Typography>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="font-mono uppercase opacity-80">
                Price Range
              </span>
              <span className="font-mono font-bold">
                {projectType.priceRange}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono uppercase opacity-80">Timeline</span>
              <span className="font-mono">{projectType.timeline}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono uppercase opacity-80">Complexity</span>
              <span
                className={`font-mono font-bold ${getComplexityColor(projectType.complexity)}`}
              >
                {projectType.complexity}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </ViewportAnimation>
  );
};

export const ContactEngagementHub: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState<ContactMethod | null>(
    null
  );
  const [selectedProjectType, setSelectedProjectType] =
    useState<ProjectType | null>(null);

  const handleMethodSelect = (method: ContactMethod) => {
    setSelectedMethod(method);
    // In a real implementation, this would handle the contact method action
    if (method.href.startsWith("http")) {
      window.open(method.href, "_blank");
    } else if (method.href.startsWith("mailto:")) {
      window.location.href = method.href;
    } else {
      // Navigate to internal route
      console.log(`Navigate to: ${method.href}`);
    }
  };

  const handleProjectTypeSelect = (projectType: ProjectType) => {
    setSelectedProjectType(projectType);
    // In a real implementation, this would pre-fill a contact form or navigate to a specific page
    console.log(`Selected project type: ${projectType.name}`);
  };

  return (
    <div className="space-y-16">
      {/* Header */}
      <StaggeredAnimation className="space-y-6 text-center" staggerDelay={0.15}>
        <ViewportAnimation variant="brutalistSlam" delay={0.1} easing="elastic">
          <ScrollTextReveal
            text="LET'S BUILD SOMETHING EXTRAORDINARY"
            className="text-brutalist-yellow font-mono text-3xl font-bold uppercase md:text-5xl"
            stagger={0.03}
            animation="slideUp"
          />
        </ViewportAnimation>

        <ViewportAnimation variant="fadeInUp" delay={0.3}>
          <Typography
            variant="body"
            className="text-brutalist-off-white-100 mx-auto max-w-3xl"
          >
            Ready to transform your vision into digital dominance? Choose your
            preferred engagement method and let's discuss how we can build
            something that doesn't just meet expectations—it obliterates them.
          </Typography>
        </ViewportAnimation>
      </StaggeredAnimation>

      {/* Contact Methods */}
      <div className="space-y-8">
        <ViewportAnimation variant="fadeInUp" delay={0.5}>
          <Typography
            variant="h3"
            className="text-center text-2xl font-bold text-white uppercase"
          >
            CHOOSE YOUR ENGAGEMENT METHOD
          </Typography>
        </ViewportAnimation>

        <StaggeredAnimation
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
          staggerDelay={0.1}
        >
          {contactMethods.map((method, index) => (
            <ContactMethodCard
              key={method.id}
              method={method}
              index={index}
              onSelect={handleMethodSelect}
            />
          ))}
        </StaggeredAnimation>
      </div>

      {/* Project Types */}
      <div className="space-y-8">
        <ViewportAnimation variant="fadeInUp" delay={0.7}>
          <Typography
            variant="h3"
            className="text-center text-2xl font-bold text-white uppercase"
          >
            WHAT ARE YOU LOOKING TO BUILD?
          </Typography>
        </ViewportAnimation>

        <StaggeredAnimation
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
          staggerDelay={0.1}
        >
          {projectTypes.map((projectType, index) => (
            <ProjectTypeCard
              key={projectType.id}
              projectType={projectType}
              index={index}
              onSelect={handleProjectTypeSelect}
            />
          ))}
        </StaggeredAnimation>
      </div>

      {/* Availability & Response Times */}
      <ViewportAnimation variant="scaleInRotate" delay={0.9}>
        <div className="rounded-none border-4 border-white bg-black p-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 text-4xl">⚡</div>
              <Typography
                variant="h4"
                className="text-brutalist-yellow mb-2 text-lg font-bold uppercase"
              >
                RAPID RESPONSE
              </Typography>
              <Typography
                variant="body"
                className="text-brutalist-off-white-100 text-sm"
              >
                Most inquiries answered within 24 hours. Urgent projects get
                same-day response.
              </Typography>
            </div>

            <div className="text-center">
              <div className="mb-4 text-4xl">🎯</div>
              <Typography
                variant="h4"
                className="text-brutalist-yellow mb-2 text-lg font-bold uppercase"
              >
                STRATEGIC APPROACH
              </Typography>
              <Typography
                variant="body"
                className="text-brutalist-off-white-100 text-sm"
              >
                Every project starts with deep discovery to ensure we build
                exactly what you need.
              </Typography>
            </div>

            <div className="text-center">
              <div className="mb-4 text-4xl">🚀</div>
              <Typography
                variant="h4"
                className="text-brutalist-yellow mb-2 text-lg font-bold uppercase"
              >
                ELITE EXECUTION
              </Typography>
              <Typography
                variant="body"
                className="text-brutalist-off-white-100 text-sm"
              >
                No compromises. No shortcuts. Just brutalist precision that
                delivers results.
              </Typography>
            </div>
          </div>
        </div>
      </ViewportAnimation>

      {/* Emergency Contact */}
      <ViewportAnimation variant="brutalistSlam" delay={1.1}>
        <div className="rounded-none border-4 border-red-500 bg-red-500 p-6 text-center">
          <Typography
            variant="h4"
            className="mb-2 text-xl font-bold text-black uppercase"
          >
            URGENT PROJECT? NEED IMMEDIATE HELP?
          </Typography>
          <Typography variant="body" className="mb-4 text-black">
            Critical issues and emergency projects get priority treatment.
          </Typography>
          <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Button
              variant="secondary"
              size="lg"
              className="bg-black text-white hover:bg-white hover:text-black"
            >
              EMERGENCY CONTACT
            </Button>
            <Typography
              variant="caption"
              className="font-mono text-xs text-black"
            >
              Response within 2 hours
            </Typography>
          </div>
        </div>
      </ViewportAnimation>
    </div>
  );
};
