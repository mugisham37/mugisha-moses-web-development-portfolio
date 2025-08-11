"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { StarRating } from "./star-rating";
import type { Testimonial } from "@prisma/client";

interface TestimonialWithAuthor extends Testimonial {
  author?: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  } | null;
}

interface TestimonialStatsProps {
  testimonials: TestimonialWithAuthor[];
  className?: string;
}

interface StatsData {
  totalTestimonials: number;
  averageRating: number;
  fiveStarCount: number;
  fiveStarPercentage: number;
  videoTestimonials: number;
  featuredTestimonials: number;
  companiesCount: number;
  recentTestimonials: number;
}

export function TestimonialStats({
  testimonials,
  className = "",
}: TestimonialStatsProps) {
  const stats: StatsData = {
    totalTestimonials: testimonials.length,
    averageRating:
      testimonials.length > 0
        ? testimonials.reduce((sum, t) => sum + t.rating, 0) /
          testimonials.length
        : 0,
    fiveStarCount: testimonials.filter((t) => t.rating === 5).length,
    fiveStarPercentage:
      testimonials.length > 0
        ? (testimonials.filter((t) => t.rating === 5).length /
            testimonials.length) *
          100
        : 0,
    videoTestimonials: testimonials.filter((t) => t.videoUrl).length,
    featuredTestimonials: testimonials.filter((t) => t.featured).length,
    companiesCount: new Set(testimonials.map((t) => t.company).filter(Boolean))
      .size,
    recentTestimonials: testimonials.filter((t) => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return new Date(t.createdAt) > thirtyDaysAgo;
    }).length,
  };

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: testimonials.filter((t) => t.rating === rating).length,
    percentage:
      testimonials.length > 0
        ? (testimonials.filter((t) => t.rating === rating).length /
            testimonials.length) *
          100
        : 0,
  }));

  if (testimonials.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="space-y-4">
          <div className="text-4xl">📊</div>
          <Typography
            variant="h3"
            className="text-xl font-bold text-gray-400 uppercase"
          >
            No Statistics Available
          </Typography>
          <Typography variant="body" className="text-gray-500">
            Statistics will appear once testimonials are submitted.
          </Typography>
        </div>
      </Card>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="p-6 text-center">
            <Typography
              variant="display"
              className="text-brutalist-yellow mb-2 text-4xl font-bold"
            >
              {stats.totalTestimonials}
            </Typography>
            <Typography
              variant="body"
              className="font-mono text-sm text-gray-300 uppercase"
            >
              Total Testimonials
            </Typography>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <Card className="p-6 text-center">
            <div className="mb-2 flex items-center justify-center">
              <Typography
                variant="display"
                className="text-brutalist-yellow mr-2 text-4xl font-bold"
              >
                {stats.averageRating.toFixed(1)}
              </Typography>
              <StarRating rating={Math.round(stats.averageRating)} size="sm" />
            </div>
            <Typography
              variant="body"
              className="font-mono text-sm text-gray-300 uppercase"
            >
              Average Rating
            </Typography>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Card className="p-6 text-center">
            <Typography
              variant="display"
              className="text-brutalist-yellow mb-2 text-4xl font-bold"
            >
              {Math.round(stats.fiveStarPercentage)}%
            </Typography>
            <Typography
              variant="body"
              className="font-mono text-sm text-gray-300 uppercase"
            >
              Five Star Reviews
            </Typography>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Card className="p-6 text-center">
            <Typography
              variant="display"
              className="text-brutalist-yellow mb-2 text-4xl font-bold"
            >
              {stats.companiesCount}
            </Typography>
            <Typography
              variant="body"
              className="font-mono text-sm text-gray-300 uppercase"
            >
              Companies Served
            </Typography>
          </Card>
        </motion.div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Rating Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="p-6">
            <Typography
              variant="h3"
              className="mb-6 text-xl font-bold uppercase"
            >
              Rating Distribution
            </Typography>
            <div className="space-y-4">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-4">
                  <div className="flex w-20 items-center gap-2">
                    <span className="font-mono text-sm">{rating}</span>
                    <span className="text-brutalist-yellow">★</span>
                  </div>
                  <div className="h-3 flex-1 overflow-hidden bg-gray-700">
                    <motion.div
                      className="bg-brutalist-yellow h-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      viewport={{ once: true }}
                    />
                  </div>
                  <div className="w-16 text-right">
                    <span className="font-mono text-sm text-gray-400">
                      {count} ({Math.round(percentage)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Additional Metrics */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="p-6">
            <Typography
              variant="h3"
              className="mb-6 text-xl font-bold uppercase"
            >
              Content Breakdown
            </Typography>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="body" className="font-medium">
                    Video Testimonials
                  </Typography>
                  <Typography variant="caption" className="text-gray-400">
                    Rich multimedia content
                  </Typography>
                </div>
                <div className="text-right">
                  <Typography
                    variant="h4"
                    className="text-brutalist-yellow font-bold"
                  >
                    {stats.videoTestimonials}
                  </Typography>
                  <Typography variant="caption" className="text-gray-400">
                    {testimonials.length > 0
                      ? Math.round(
                          (stats.videoTestimonials / testimonials.length) * 100
                        )
                      : 0}
                    %
                  </Typography>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="body" className="font-medium">
                    Featured Reviews
                  </Typography>
                  <Typography variant="caption" className="text-gray-400">
                    Highlighted testimonials
                  </Typography>
                </div>
                <div className="text-right">
                  <Typography
                    variant="h4"
                    className="text-brutalist-yellow font-bold"
                  >
                    {stats.featuredTestimonials}
                  </Typography>
                  <Typography variant="caption" className="text-gray-400">
                    {testimonials.length > 0
                      ? Math.round(
                          (stats.featuredTestimonials / testimonials.length) *
                            100
                        )
                      : 0}
                    %
                  </Typography>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="body" className="font-medium">
                    Recent Reviews
                  </Typography>
                  <Typography variant="caption" className="text-gray-400">
                    Last 30 days
                  </Typography>
                </div>
                <div className="text-right">
                  <Typography
                    variant="h4"
                    className="text-brutalist-yellow font-bold"
                  >
                    {stats.recentTestimonials}
                  </Typography>
                  <Typography variant="caption" className="text-gray-400">
                    This month
                  </Typography>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <Card className="bg-brutalist-charcoal-100 p-8 text-center">
          <Typography
            variant="h2"
            className="mb-4 text-2xl font-bold uppercase"
          >
            Client Satisfaction Summary
          </Typography>
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div>
              <Typography
                variant="display"
                className="text-brutalist-yellow text-3xl font-bold"
              >
                {Math.round(stats.fiveStarPercentage)}%
              </Typography>
              <Typography
                variant="caption"
                className="font-mono text-gray-300 uppercase"
              >
                5-Star Reviews
              </Typography>
            </div>
            <div>
              <Typography
                variant="display"
                className="text-brutalist-yellow text-3xl font-bold"
              >
                {stats.averageRating.toFixed(1)}/5
              </Typography>
              <Typography
                variant="caption"
                className="font-mono text-gray-300 uppercase"
              >
                Average Rating
              </Typography>
            </div>
            <div>
              <Typography
                variant="display"
                className="text-brutalist-yellow text-3xl font-bold"
              >
                100%
              </Typography>
              <Typography
                variant="caption"
                className="font-mono text-gray-300 uppercase"
              >
                Project Success
              </Typography>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
