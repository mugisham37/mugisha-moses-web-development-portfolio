"use client";

import { useState, useEffect, useCallback } from "react";
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

interface AggregationStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: { rating: number; count: number; percentage: number }[];
  fiveStarPercentage: number;
  recentReviews: number;
  videoReviews: number;
  verifiedReviews: number;
  responseRate: number;
  recommendationRate: number;
}

interface TestimonialAggregationProps {
  testimonials: TestimonialWithAuthor[];
  showDetailedBreakdown?: boolean;
  showTrends?: boolean;
  className?: string;
}

export function TestimonialAggregation({
  testimonials,
  showDetailedBreakdown = true,
  showTrends = true,
  className = "",
}: TestimonialAggregationProps) {
  const [stats, setStats] = useState<AggregationStats | null>(null);
  const [loading, setLoading] = useState(true);

  const calculateStats = useCallback(async () => {
    setLoading(true);

    try {
      // Calculate local stats
      const totalReviews = testimonials.length;
      const averageRating =
        totalReviews > 0
          ? testimonials.reduce((sum, t) => sum + t.rating, 0) / totalReviews
          : 0;

      // Rating distribution
      const ratingCounts = [5, 4, 3, 2, 1].map((rating) => ({
        rating,
        count: testimonials.filter((t) => t.rating === rating).length,
        percentage:
          totalReviews > 0
            ? (testimonials.filter((t) => t.rating === rating).length /
                totalReviews) *
              100
            : 0,
      }));

      const fiveStarCount = testimonials.filter((t) => t.rating === 5).length;
      const fiveStarPercentage =
        totalReviews > 0 ? (fiveStarCount / totalReviews) * 100 : 0;

      // Recent reviews (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentReviews = testimonials.filter(
        (t) => new Date(t.createdAt) > thirtyDaysAgo
      ).length;

      // Video reviews
      const videoReviews = testimonials.filter((t) => t.videoUrl).length;

      // Verified reviews (those with author connections)
      const verifiedReviews = testimonials.filter((t) => t.author).length;

      // Mock additional metrics (in production, these would come from API)
      const responseRate = 85; // Percentage of clients who leave reviews
      const recommendationRate = 96; // Percentage who would recommend

      setStats({
        totalReviews,
        averageRating,
        ratingDistribution: ratingCounts,
        fiveStarPercentage,
        recentReviews,
        videoReviews,
        verifiedReviews,
        responseRate,
        recommendationRate,
      });
    } catch (error) {
      console.error("Error calculating testimonial stats:", error);
    } finally {
      setLoading(false);
    }
  }, [testimonials]);

  useEffect(() => {
    calculateStats();
  }, [calculateStats]);

  if (loading || !stats) {
    return (
      <Card className={`p-8 text-center ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="mx-auto h-8 w-1/3 rounded bg-gray-700"></div>
          <div className="mx-auto h-4 w-1/2 rounded bg-gray-700"></div>
        </div>
      </Card>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Overall Rating Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="bg-brutalist-charcoal-100 p-8 text-center">
          <div className="space-y-6">
            <Typography variant="h2" className="text-2xl font-bold uppercase">
              Client Review Aggregation
            </Typography>

            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <Typography
                  variant="display"
                  className="text-brutalist-yellow text-6xl font-bold"
                >
                  {stats.averageRating.toFixed(1)}
                </Typography>
                <div className="mt-2 flex justify-center">
                  <StarRating
                    rating={Math.round(stats.averageRating)}
                    size="lg"
                  />
                </div>
                <Typography variant="body" className="mt-2 text-gray-300">
                  Average Rating
                </Typography>
              </div>

              <div className="h-20 w-px bg-gray-600"></div>

              <div className="text-center">
                <Typography
                  variant="display"
                  className="text-brutalist-yellow text-6xl font-bold"
                >
                  {stats.totalReviews}
                </Typography>
                <Typography variant="body" className="mt-2 text-gray-300">
                  Total Reviews
                </Typography>
              </div>

              <div className="h-20 w-px bg-gray-600"></div>

              <div className="text-center">
                <Typography
                  variant="display"
                  className="text-brutalist-yellow text-6xl font-bold"
                >
                  {Math.round(stats.fiveStarPercentage)}%
                </Typography>
                <Typography variant="body" className="mt-2 text-gray-300">
                  Five Star Reviews
                </Typography>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Detailed Breakdown */}
      {showDetailedBreakdown && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Rating Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-6">
              <Typography
                variant="h3"
                className="mb-6 text-xl font-bold uppercase"
              >
                Rating Distribution
              </Typography>
              <div className="space-y-4">
                {stats.ratingDistribution.map(
                  ({ rating, count, percentage }) => (
                    <div key={rating} className="flex items-center gap-4">
                      <div className="flex w-20 items-center gap-2">
                        <span className="font-mono text-sm">{rating}</span>
                        <span className="text-brutalist-yellow">★</span>
                      </div>
                      <div className="h-4 flex-1 overflow-hidden bg-gray-700">
                        <motion.div
                          className="bg-brutalist-yellow h-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                      <div className="w-20 text-right">
                        <span className="font-mono text-sm text-gray-400">
                          {count} ({Math.round(percentage)}%)
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </Card>
          </motion.div>

          {/* Review Quality Metrics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="p-6">
              <Typography
                variant="h3"
                className="mb-6 text-xl font-bold uppercase"
              >
                Review Quality
              </Typography>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Typography variant="body" className="font-medium">
                      Video Testimonials
                    </Typography>
                    <Typography variant="caption" className="text-gray-400">
                      Rich multimedia reviews
                    </Typography>
                  </div>
                  <div className="text-right">
                    <Typography
                      variant="h4"
                      className="text-brutalist-yellow font-bold"
                    >
                      {stats.videoReviews}
                    </Typography>
                    <Typography variant="caption" className="text-gray-400">
                      {stats.totalReviews > 0
                        ? Math.round(
                            (stats.videoReviews / stats.totalReviews) * 100
                          )
                        : 0}
                      %
                    </Typography>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Typography variant="body" className="font-medium">
                      Verified Reviews
                    </Typography>
                    <Typography variant="caption" className="text-gray-400">
                      From authenticated clients
                    </Typography>
                  </div>
                  <div className="text-right">
                    <Typography
                      variant="h4"
                      className="text-brutalist-yellow font-bold"
                    >
                      {stats.verifiedReviews}
                    </Typography>
                    <Typography variant="caption" className="text-gray-400">
                      {stats.totalReviews > 0
                        ? Math.round(
                            (stats.verifiedReviews / stats.totalReviews) * 100
                          )
                        : 0}
                      %
                    </Typography>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Typography variant="body" className="font-medium">
                      Recent Activity
                    </Typography>
                    <Typography variant="caption" className="text-gray-400">
                      Reviews in last 30 days
                    </Typography>
                  </div>
                  <div className="text-right">
                    <Typography
                      variant="h4"
                      className="text-brutalist-yellow font-bold"
                    >
                      {stats.recentReviews}
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
      )}

      {/* Business Impact Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="p-8">
          <Typography
            variant="h3"
            className="mb-6 text-center text-xl font-bold uppercase"
          >
            Business Impact Metrics
          </Typography>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="text-center">
              <Typography
                variant="display"
                className="text-brutalist-yellow mb-2 text-3xl font-bold"
              >
                {Math.round(stats.fiveStarPercentage)}%
              </Typography>
              <Typography
                variant="body"
                className="font-mono text-sm text-gray-300 uppercase"
              >
                Excellent Ratings
              </Typography>
            </div>
            <div className="text-center">
              <Typography
                variant="display"
                className="text-brutalist-yellow mb-2 text-3xl font-bold"
              >
                {stats.responseRate}%
              </Typography>
              <Typography
                variant="body"
                className="font-mono text-sm text-gray-300 uppercase"
              >
                Response Rate
              </Typography>
            </div>
            <div className="text-center">
              <Typography
                variant="display"
                className="text-brutalist-yellow mb-2 text-3xl font-bold"
              >
                {stats.recommendationRate}%
              </Typography>
              <Typography
                variant="body"
                className="font-mono text-sm text-gray-300 uppercase"
              >
                Would Recommend
              </Typography>
            </div>
            <div className="text-center">
              <Typography
                variant="display"
                className="text-brutalist-yellow mb-2 text-3xl font-bold"
              >
                100%
              </Typography>
              <Typography
                variant="body"
                className="font-mono text-sm text-gray-300 uppercase"
              >
                Project Success
              </Typography>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Trends (if enabled) */}
      {showTrends && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="p-6">
            <Typography
              variant="h3"
              className="mb-6 text-xl font-bold uppercase"
            >
              Review Trends
            </Typography>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="mb-2 flex items-center justify-center gap-2">
                  <span className="text-2xl text-green-400">↗</span>
                  <Typography variant="h4" className="font-bold text-green-400">
                    +{stats.recentReviews}
                  </Typography>
                </div>
                <Typography variant="body" className="text-gray-400">
                  New reviews this month
                </Typography>
              </div>
              <div className="text-center">
                <div className="mb-2 flex items-center justify-center gap-2">
                  <span className="text-brutalist-yellow text-2xl">⭐</span>
                  <Typography
                    variant="h4"
                    className="text-brutalist-yellow font-bold"
                  >
                    {stats.averageRating.toFixed(1)}
                  </Typography>
                </div>
                <Typography variant="body" className="text-gray-400">
                  Consistent quality rating
                </Typography>
              </div>
              <div className="text-center">
                <div className="mb-2 flex items-center justify-center gap-2">
                  <span className="text-2xl text-blue-400">📹</span>
                  <Typography variant="h4" className="font-bold text-blue-400">
                    {Math.round(
                      (stats.videoReviews / stats.totalReviews) * 100
                    )}
                    %
                  </Typography>
                </div>
                <Typography variant="body" className="text-gray-400">
                  Video testimonial rate
                </Typography>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
