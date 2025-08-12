"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";

// Mock testimonials data - in production this would come from the database
const testimonials = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "CTO",
    company: "TechFlow Solutions",
    content:
      "The brutalist approach to our web application was exactly what we needed. Clean, fast, and incredibly effective. Our conversion rates increased by 340% after launch.",
    rating: 5,
    avatarUrl: "/testimonials/sarah-chen.jpg",
    serviceType: "web-development",
    projectOutcome: "340% increase in conversions",
    featured: true,
  },
  {
    id: "2",
    name: "Marcus Rodriguez",
    role: "Founder",
    company: "StartupForge",
    content:
      "They delivered our mobile app 2 weeks ahead of schedule with zero bugs. The performance is incredible - 60fps animations and instant loading. Worth every penny.",
    rating: 5,
    avatarUrl: "/testimonials/marcus-rodriguez.jpg",
    serviceType: "mobile-app",
    projectOutcome: "Delivered 2 weeks early",
    featured: true,
  },
  {
    id: "3",
    name: "Dr. Emily Watson",
    role: "Director",
    company: "MedTech Innovations",
    content:
      "The full-stack solution they built handles 10,000+ concurrent users without breaking a sweat. The architecture is bulletproof and the code quality is exceptional.",
    rating: 5,
    avatarUrl: "/testimonials/emily-watson.jpg",
    serviceType: "full-stack",
    projectOutcome: "10,000+ concurrent users",
    featured: true,
  },
  {
    id: "4",
    name: "James Park",
    role: "VP Engineering",
    company: "DataDrive Corp",
    content:
      "Their performance optimization reduced our loading times by 75% and improved our Lighthouse scores to 98. The technical expertise is unmatched.",
    rating: 5,
    avatarUrl: "/testimonials/james-park.jpg",
    serviceType: "performance",
    projectOutcome: "75% faster loading times",
    featured: true,
  },
  {
    id: "5",
    name: "Lisa Thompson",
    role: "Product Manager",
    company: "InnovateLab",
    content:
      "The consulting engagement transformed our entire development process. Code quality improved dramatically and our team velocity doubled.",
    rating: 5,
    avatarUrl: "/testimonials/lisa-thompson.jpg",
    serviceType: "consulting",
    projectOutcome: "2x team velocity",
    featured: false,
  },
  {
    id: "6",
    name: "Alex Kumar",
    role: "CEO",
    company: "GrowthHack Pro",
    content:
      "24/7 maintenance service keeps our platform running flawlessly. Zero downtime in 8 months and proactive issue resolution. Exceptional service.",
    rating: 5,
    avatarUrl: "/testimonials/alex-kumar.jpg",
    serviceType: "maintenance",
    projectOutcome: "Zero downtime in 8 months",
    featured: false,
  },
];

interface ServiceTestimonialsProps {
  serviceId?: string;
  showAll?: boolean;
}

export function ServiceTestimonials({
  serviceId,
  showAll = false,
}: ServiceTestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filteredTestimonials, setFilteredTestimonials] =
    useState(testimonials);

  useEffect(() => {
    if (serviceId) {
      // Filter testimonials for specific service
      const filtered = testimonials.filter((t) => t.serviceType === serviceId);
      setFilteredTestimonials(filtered);
    } else if (!showAll) {
      // Show only featured testimonials
      const featured = testimonials.filter((t) => t.featured);
      setFilteredTestimonials(featured);
    } else {
      setFilteredTestimonials(testimonials);
    }
    setCurrentIndex(0);
  }, [serviceId, showAll]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredTestimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) =>
        (prev - 1 + filteredTestimonials.length) % filteredTestimonials.length
    );
  };

  if (filteredTestimonials.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Typography
          variant="h3"
          className="mb-4 text-2xl font-bold text-gray-400"
        >
          NO TESTIMONIALS YET
        </Typography>
        <Typography variant="body" className="text-gray-500">
          Be the first to experience our elite services and share your success
          story.
        </Typography>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Main Testimonial Carousel */}
      <div className="relative">
        <Card className="flex min-h-[400px] items-center p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <TestimonialContent
                testimonial={filteredTestimonials[currentIndex]}
              />
            </motion.div>
          </AnimatePresence>
        </Card>

        {/* Navigation */}
        {filteredTestimonials.length > 1 && (
          <div className="mt-6 flex items-center justify-center gap-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={prevTestimonial}
              className="h-12 w-12 p-0"
            >
              ←
            </Button>

            <div className="flex gap-2">
              {filteredTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-3 w-3 border-2 transition-colors ${
                    index === currentIndex
                      ? "bg-brutalist-yellow border-brutalist-yellow"
                      : "hover:border-brutalist-yellow border-white bg-transparent"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={nextTestimonial}
              className="h-12 w-12 p-0"
            >
              →
            </Button>
          </div>
        )}
      </div>

      {/* Testimonial Grid (for showing all) */}
      {showAll && filteredTestimonials.length > 1 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTestimonials.slice(1).map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="h-full p-6">
                <TestimonialContent testimonial={testimonial} compact />
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <Card className="bg-brutalist-charcoal-100 p-8">
          <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-4">
            <div>
              <Typography
                variant="display"
                className="text-brutalist-yellow mb-2 text-4xl font-bold"
              >
                98%
              </Typography>
              <Typography variant="body" className="text-gray-300">
                Client Satisfaction
              </Typography>
            </div>
            <div>
              <Typography
                variant="display"
                className="text-brutalist-yellow mb-2 text-4xl font-bold"
              >
                150+
              </Typography>
              <Typography variant="body" className="text-gray-300">
                Projects Delivered
              </Typography>
            </div>
            <div>
              <Typography
                variant="display"
                className="text-brutalist-yellow mb-2 text-4xl font-bold"
              >
                24/7
              </Typography>
              <Typography variant="body" className="text-gray-300">
                Support Available
              </Typography>
            </div>
            <div>
              <Typography
                variant="display"
                className="text-brutalist-yellow mb-2 text-4xl font-bold"
              >
                0
              </Typography>
              <Typography variant="body" className="text-gray-300">
                Failed Projects
              </Typography>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

interface TestimonialContentProps {
  testimonial: (typeof testimonials)[0];
  compact?: boolean;
}

function TestimonialContent({
  testimonial,
  compact = false,
}: TestimonialContentProps) {
  return (
    <div className={`text-center ${compact ? "space-y-4" : "space-y-6"}`}>
      {/* Rating */}
      <div className="flex justify-center gap-1">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`text-2xl ${
              i < testimonial.rating ? "text-brutalist-yellow" : "text-gray-600"
            }`}
          >
            ★
          </span>
        ))}
      </div>

      {/* Content */}
      <Typography
        variant={compact ? "body" : "h2"}
        className={`${compact ? "text-lg" : "text-2xl"} mx-auto max-w-4xl leading-relaxed text-gray-300`}
      >
        &ldquo;{testimonial.content}&rdquo;
      </Typography>

      {/* Outcome */}
      {testimonial.projectOutcome && (
        <div className="bg-brutalist-yellow inline-block px-4 py-2 font-mono text-sm font-bold tracking-wider text-black uppercase">
          {testimonial.projectOutcome}
        </div>
      )}

      {/* Author */}
      <div className="flex items-center justify-center gap-4">
        <div className="bg-brutalist-charcoal-100 flex h-16 w-16 items-center justify-center border-2 border-white">
          <span className="text-2xl">👤</span>
        </div>
        <div className="text-left">
          <Typography variant="h4" className="font-bold">
            {testimonial.name}
          </Typography>
          <Typography variant="caption" className="text-gray-400">
            {testimonial.role}
          </Typography>
          <Typography variant="caption" className="text-brutalist-yellow block">
            {testimonial.company}
          </Typography>
        </div>
      </div>
    </div>
  );
}
