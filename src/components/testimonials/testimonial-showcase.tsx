"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { TestimonialCarousel } from "./testimonial-carousel";
import { TestimonialGrid } from "./testimonial-grid";
import { TestimonialStats } from "./testimonial-stats";
import { ClientLogoShowcase } from "./client-logo-showcase";
import { TestimonialAggregation } from "./testimonial-aggregation";
import { TestimonialSubmissionForm } from "./testimonial-submission-form";
import type { Testimonial } from "@prisma/client";

interface TestimonialWithAuthor extends Testimonial {
  author?: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  } | null;
}

interface TestimonialShowcaseProps {
  className?: string;
}

type ViewMode = "carousel" | "grid" | "stats" | "submit";

export function TestimonialShowcase({
  className = "",
}: TestimonialShowcaseProps) {
  const [testimonials, setTestimonials] = useState<TestimonialWithAuthor[]>([]);
  const [featuredTestimonials, setFeaturedTestimonials] = useState<
    TestimonialWithAuthor[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("carousel");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all approved testimonials
      const [allResponse, featuredResponse] = await Promise.all([
        fetch("/api/testimonials?approved=true"),
        fetch("/api/testimonials/featured"),
      ]);

      const [allData, featuredData] = await Promise.all([
        allResponse.json(),
        featuredResponse.json(),
      ]);

      if (allData.success && featuredData.success) {
        setTestimonials(allData.data);
        setFeaturedTestimonials(featuredData.data);
      } else {
        throw new Error("Failed to fetch testimonials");
      }
    } catch (err) {
      setError("Failed to load testimonials");
      console.error("Error fetching testimonials:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTestimonialSubmit = async (data: {
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
  }) => {
    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        // Refresh testimonials after successful submission
        await fetchTestimonials();
        return result;
      } else {
        throw new Error(result.error || "Failed to submit testimonial");
      }
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      throw error;
    }
  };

  if (loading) {
    return (
      <Section className={className}>
        <Container>
          <div className="py-20 text-center">
            <div className="animate-pulse space-y-8">
              <div className="mx-auto h-12 w-1/3 rounded bg-gray-700"></div>
              <div className="mx-auto h-6 w-1/2 rounded bg-gray-700"></div>
              <div className="mx-auto h-64 w-full rounded bg-gray-700"></div>
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  if (error) {
    return (
      <Section className={className}>
        <Container>
          <div className="py-20 text-center">
            <Typography
              variant="h2"
              className="mb-4 text-2xl font-bold text-red-400 uppercase"
            >
              Error Loading Testimonials
            </Typography>
            <Typography variant="body" className="mb-8 text-gray-400">
              {error}
            </Typography>
            <Button variant="accent" onClick={fetchTestimonials}>
              Try Again
            </Button>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <div className={className}>
      {/* Hero Section */}
      <Section className="py-20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Typography
              variant="display"
              className="mb-6 text-5xl font-bold uppercase md:text-6xl"
            >
              Client Success Stories
            </Typography>
            <Typography
              variant="h2"
              className="mx-auto mb-12 max-w-3xl text-xl text-gray-300"
            >
              Real results from real clients. See why industry leaders choose
              our brutalist approach to web development.
            </Typography>

            {/* View Mode Selector */}
            <div className="mb-12 flex flex-wrap justify-center gap-4">
              {[
                { key: "carousel" as ViewMode, label: "Featured", icon: "🎯" },
                { key: "grid" as ViewMode, label: "All Reviews", icon: "📋" },
                { key: "stats" as ViewMode, label: "Statistics", icon: "📊" },
                { key: "submit" as ViewMode, label: "Share Yours", icon: "✍️" },
              ].map(({ key, label, icon }) => (
                <Button
                  key={key}
                  variant={viewMode === key ? "accent" : "secondary"}
                  onClick={() => setViewMode(key)}
                  className="font-mono text-sm uppercase"
                >
                  <span className="mr-2">{icon}</span>
                  {label}
                </Button>
              ))}
            </div>
          </motion.div>
        </Container>
      </Section>

      {/* Dynamic Content Based on View Mode */}
      <Section className="pb-20">
        <Container>
          {viewMode === "carousel" && (
            <motion.div
              key="carousel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <TestimonialCarousel
                testimonials={featuredTestimonials}
                autoPlay={true}
                autoPlayInterval={6000}
                showNavigation={true}
                showIndicators={true}
              />
            </motion.div>
          )}

          {viewMode === "grid" && (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <TestimonialGrid
                testimonials={testimonials}
                showFilters={true}
                itemsPerPage={9}
              />
            </motion.div>
          )}

          {viewMode === "stats" && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-12"
            >
              <TestimonialAggregation
                testimonials={testimonials}
                showDetailedBreakdown={true}
                showTrends={true}
              />
              <TestimonialStats testimonials={testimonials} />
            </motion.div>
          )}

          {viewMode === "submit" && (
            <motion.div
              key="submit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <TestimonialSubmissionForm onSubmit={handleTestimonialSubmit} />
            </motion.div>
          )}
        </Container>
      </Section>

      {/* Client Logo Showcase */}
      {viewMode !== "submit" && (
        <Section className="bg-brutalist-charcoal-100 py-20">
          <Container>
            <ClientLogoShowcase
              clients={[]} // Empty array for now, can be populated from API
              title="Trusted by Industry Leaders"
              subtitle="Companies that chose excellence and achieved extraordinary results"
              showIndustry={true}
              showTestimonialCount={true}
              autoScroll={true}
            />
          </Container>
        </Section>
      )}

      {/* Call to Action */}
      {viewMode !== "submit" && (
        <Section className="py-20">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Typography
                variant="h2"
                className="mb-6 text-3xl font-bold uppercase"
              >
                Ready to Join Our Success Stories?
              </Typography>
              <Typography
                variant="body"
                className="mx-auto mb-8 max-w-2xl text-gray-300"
              >
                Experience the same level of excellence that our clients rave
                about. Let&apos;s build something extraordinary together.
              </Typography>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  variant="accent"
                  size="lg"
                  onClick={() => setViewMode("submit")}
                  className="font-mono uppercase"
                >
                  Share Your Experience
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="font-mono uppercase"
                >
                  Start Your Project
                </Button>
              </div>
            </motion.div>
          </Container>
        </Section>
      )}
    </div>
  );
}
