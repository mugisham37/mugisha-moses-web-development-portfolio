"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Typography } from "@/components/ui/typography";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ViewportAnimation,
  StaggeredAnimation,
} from "@/components/animations/advanced-scroll-effects";
import { ScrollTextReveal } from "@/components/animations/scroll-reveal-system";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
  projectType: string;
  results: {
    metric: string;
    improvement: string;
  }[];
  linkedinUrl?: string;
  featured: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "CEO",
    company: "TechStart Inc.",
    content:
      "The team delivered a flawless e-commerce platform that increased our conversion rate by 340%. Their brutalist approach to problem-solving is exactly what we needed. No fluff, no compromises—just raw technical excellence that drives results.",
    rating: 5,
    avatar: "SC",
    projectType: "E-commerce Platform",
    results: [
      { metric: "Conversion Rate", improvement: "+340%" },
      { metric: "Page Load Speed", improvement: "+85%" },
      { metric: "Mobile Performance", improvement: "+92%" },
    ],
    linkedinUrl: "https://linkedin.com/in/sarah-chen",
    featured: true,
  },
  {
    id: "2",
    name: "Marcus Rodriguez",
    role: "CTO",
    company: "DataFlow Systems",
    content:
      "Exceptional technical expertise and uncompromising attention to detail. Our dashboard now handles 10x the traffic with zero downtime. The brutalist design philosophy translated perfectly into rock-solid architecture.",
    rating: 5,
    avatar: "MR",
    projectType: "Real-time Dashboard",
    results: [
      { metric: "Traffic Capacity", improvement: "+1000%" },
      { metric: "System Uptime", improvement: "99.99%" },
      { metric: "Response Time", improvement: "+75%" },
    ],
    linkedinUrl: "https://linkedin.com/in/marcus-rodriguez",
    featured: true,
  },
  {
    id: "3",
    name: "Emily Watson",
    role: "Director",
    company: "MedTech Innovations",
    content:
      "Working with this team was like having a technical co-founder. They didn't just build our MVP—they architected our entire digital future. The mobile app exceeded every expectation and launched us ahead of competitors.",
    rating: 5,
    avatar: "EW",
    projectType: "Mobile Health App",
    results: [
      { metric: "User Adoption", improvement: "+450%" },
      { metric: "App Store Rating", improvement: "4.8/5" },
      { metric: "Time to Market", improvement: "-60%" },
    ],
    linkedinUrl: "https://linkedin.com/in/emily-watson",
    featured: true,
  },
  {
    id: "4",
    name: "David Kim",
    role: "Founder",
    company: "FinanceFlow",
    content:
      "They transformed our complex financial data into an intuitive, powerful platform. The performance optimizations alone saved us $50K annually in server costs. This is what elite development looks like.",
    rating: 5,
    avatar: "DK",
    projectType: "Financial Platform",
    results: [
      { metric: "Server Costs", improvement: "-$50K/year" },
      { metric: "Processing Speed", improvement: "+300%" },
      { metric: "User Satisfaction", improvement: "+95%" },
    ],
    featured: true,
  },
  {
    id: "5",
    name: "Lisa Thompson",
    role: "VP Engineering",
    company: "CloudScale",
    content:
      "The consulting engagement revolutionized our development process. Code quality improved dramatically, deployment times dropped by 80%, and our team learned industry-leading practices that continue to pay dividends.",
    rating: 5,
    avatar: "LT",
    projectType: "Technical Consulting",
    results: [
      { metric: "Deployment Time", improvement: "-80%" },
      { metric: "Bug Reports", improvement: "-65%" },
      { metric: "Team Velocity", improvement: "+120%" },
    ],
    featured: false,
  },
];

interface TestimonialCardProps {
  testimonial: Testimonial;
  isActive: boolean;
  onClick: () => void;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
  isActive,
  onClick,
}) => {
  return (
    <Card
      className={`group cursor-pointer border-4 transition-all duration-300 ${
        isActive
          ? "border-brutalist-yellow bg-brutalist-yellow text-black"
          : "border-black bg-white hover:bg-black hover:text-white"
      }`}
      onClick={onClick}
    >
      <CardContent className="p-8">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold ${
                isActive
                  ? "text-brutalist-yellow bg-black"
                  : "bg-brutalist-yellow text-black"
              }`}
            >
              {testimonial.avatar}
            </div>
            <div>
              <Typography variant="h4" className="text-lg font-bold">
                {testimonial.name}
              </Typography>
              <Typography variant="body" className="text-sm opacity-80">
                {testimonial.role}, {testimonial.company}
              </Typography>
              <Typography
                variant="caption"
                className="font-mono text-xs uppercase opacity-60"
              >
                {testimonial.projectType}
              </Typography>
            </div>
          </div>
          <div className="flex">
            {[...Array(testimonial.rating)].map((_, i) => (
              <span
                key={i}
                className={isActive ? "text-black" : "text-brutalist-yellow"}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <Typography variant="body" className="mb-6 text-base leading-relaxed">
          "{testimonial.content}"
        </Typography>

        {/* Results */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {testimonial.results.map((result, index) => (
            <div key={index} className="text-center">
              <Typography
                variant="h4"
                className={`text-xl font-bold ${isActive ? "text-black" : "text-brutalist-yellow"}`}
              >
                {result.improvement}
              </Typography>
              <Typography
                variant="caption"
                className="font-mono text-xs uppercase opacity-80"
              >
                {result.metric}
              </Typography>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

interface CarouselControlsProps {
  currentIndex: number;
  totalItems: number;
  onPrevious: () => void;
  onNext: () => void;
  onDotClick: (index: number) => void;
  isAutoPlaying: boolean;
  onToggleAutoPlay: () => void;
}

const CarouselControls: React.FC<CarouselControlsProps> = ({
  currentIndex,
  totalItems,
  onPrevious,
  onNext,
  onDotClick,
  isAutoPlaying,
  onToggleAutoPlay,
}) => {
  return (
    <div className="flex items-center justify-center space-x-6">
      <Button
        variant="secondary"
        size="sm"
        onClick={onPrevious}
        className="font-mono text-xs uppercase"
      >
        ← PREV
      </Button>

      <div className="flex space-x-2">
        {[...Array(totalItems)].map((_, index) => (
          <button
            key={index}
            onClick={() => onDotClick(index)}
            className={`h-3 w-3 border-2 border-black transition-all duration-300 ${
              index === currentIndex
                ? "bg-brutalist-yellow"
                : "hover:bg-brutalist-charcoal-200 bg-white"
            }`}
          />
        ))}
      </div>

      <Button
        variant="secondary"
        size="sm"
        onClick={onNext}
        className="font-mono text-xs uppercase"
      >
        NEXT →
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleAutoPlay}
        className="font-mono text-xs uppercase"
      >
        {isAutoPlaying ? "PAUSE" : "PLAY"}
      </Button>
    </div>
  );
};

export const TestimonialCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextTestimonial = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const previousTestimonial = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  }, []);

  const goToTestimonial = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlaying((prev) => !prev);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(nextTestimonial, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextTestimonial]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        previousTestimonial();
      } else if (event.key === "ArrowRight") {
        nextTestimonial();
      } else if (event.key === " ") {
        event.preventDefault();
        toggleAutoPlay();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextTestimonial, previousTestimonial, toggleAutoPlay]);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="space-y-12">
      {/* Header */}
      <StaggeredAnimation className="space-y-6 text-center" staggerDelay={0.15}>
        <ViewportAnimation variant="brutalistSlam" delay={0.1} easing="elastic">
          <ScrollTextReveal
            text="CLIENT VICTORIES"
            className="text-brutalist-yellow font-mono text-4xl font-bold uppercase md:text-6xl"
            stagger={0.05}
            animation="rotateIn"
          />
        </ViewportAnimation>

        <ViewportAnimation variant="fadeInUp" delay={0.3}>
          <Typography
            variant="body"
            className="text-brutalist-off-white-100 mx-auto max-w-2xl"
          >
            Real results from real clients who achieved extraordinary success
            with our elite development services. Every testimonial represents a
            digital transformation that exceeded expectations.
          </Typography>
        </ViewportAnimation>
      </StaggeredAnimation>

      {/* Main Testimonial Display */}
      <ViewportAnimation variant="scaleInRotate" delay={0.5}>
        <TestimonialCard
          testimonial={currentTestimonial}
          isActive={true}
          onClick={() => {}}
        />
      </ViewportAnimation>

      {/* Carousel Controls */}
      <ViewportAnimation variant="fadeInUp" delay={0.7}>
        <CarouselControls
          currentIndex={currentIndex}
          totalItems={testimonials.length}
          onPrevious={previousTestimonial}
          onNext={nextTestimonial}
          onDotClick={goToTestimonial}
          isAutoPlaying={isAutoPlaying}
          onToggleAutoPlay={toggleAutoPlay}
        />
      </ViewportAnimation>

      {/* Social Proof Stats */}
      <ViewportAnimation variant="fadeInUp" delay={0.9}>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="text-center">
            <Typography
              variant="h2"
              className="text-brutalist-yellow text-3xl font-bold md:text-4xl"
            >
              {testimonials.length * 10}+
            </Typography>
            <Typography
              variant="caption"
              className="text-brutalist-off-white-100 font-mono text-xs uppercase"
            >
              Projects Delivered
            </Typography>
          </div>
          <div className="text-center">
            <Typography
              variant="h2"
              className="text-brutalist-yellow text-3xl font-bold md:text-4xl"
            >
              98%
            </Typography>
            <Typography
              variant="caption"
              className="text-brutalist-off-white-100 font-mono text-xs uppercase"
            >
              Client Satisfaction
            </Typography>
          </div>
          <div className="text-center">
            <Typography
              variant="h2"
              className="text-brutalist-yellow text-3xl font-bold md:text-4xl"
            >
              24/7
            </Typography>
            <Typography
              variant="caption"
              className="text-brutalist-off-white-100 font-mono text-xs uppercase"
            >
              Support Available
            </Typography>
          </div>
          <div className="text-center">
            <Typography
              variant="h2"
              className="text-brutalist-yellow text-3xl font-bold md:text-4xl"
            >
              5.0
            </Typography>
            <Typography
              variant="caption"
              className="text-brutalist-off-white-100 font-mono text-xs uppercase"
            >
              Average Rating
            </Typography>
          </div>
        </div>
      </ViewportAnimation>

      {/* Call to Action */}
      <ViewportAnimation variant="brutalistSlam" delay={1.1}>
        <div className="border-brutalist-yellow rounded-none border-4 bg-black p-8 text-center">
          <Typography
            variant="h3"
            className="text-brutalist-yellow mb-4 text-2xl font-bold uppercase"
          >
            READY TO JOIN THE SUCCESS STORIES?
          </Typography>
          <Typography
            variant="body"
            className="text-brutalist-off-white-100 mb-6"
          >
            These results aren't accidents. They're the inevitable outcome of
            elite development practices, brutalist precision, and uncompromising
            commitment to excellence.
          </Typography>
          <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Button variant="accent" size="lg">
              START YOUR PROJECT →
            </Button>
            <Button variant="secondary" size="lg">
              VIEW ALL TESTIMONIALS
            </Button>
          </div>
        </div>
      </ViewportAnimation>
    </div>
  );
};
