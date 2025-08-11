"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { TestimonialCard } from "./testimonial-card";
import {
  linkedInIntegration,
  isLinkedInConfigured,
} from "@/lib/linkedin-integration";
import type { Testimonial } from "@prisma/client";

interface LinkedInTestimonialsProps {
  className?: string;
}

interface LinkedInRecommendation {
  id: string;
  recommender: {
    id: string;
    firstName: string;
    lastName: string;
    headline: string;
    profilePicture?: string;
    publicProfileUrl: string;
  };
  text: string;
  createdAt: Date;
}

export function LinkedInTestimonials({
  className = "",
}: LinkedInTestimonialsProps) {
  const [recommendations, setRecommendations] = useState<
    LinkedInRecommendation[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importingIds, setImportingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isLinkedInConfigured()) {
      fetchRecommendations();
    }
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);

    try {
      // In a real implementation, you'd get the profile ID from user settings
      const profileId = "your-profile-id";
      const data = await linkedInIntegration.getRecommendations(profileId);
      setRecommendations(data);
    } catch (err) {
      setError("Failed to fetch LinkedIn recommendations");
      console.error("LinkedIn fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const importRecommendation = async (recommendationId: string) => {
    setImportingIds((prev) => new Set(prev).add(recommendationId));

    try {
      const testimonialData =
        await linkedInIntegration.importRecommendation(recommendationId);

      // Submit to testimonials API
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...testimonialData,
          source: "linkedin",
          linkedinRecommendationId: recommendationId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Remove from recommendations list
        setRecommendations((prev) =>
          prev.filter((rec) => rec.id !== recommendationId)
        );

        // Show success message
        alert("LinkedIn recommendation imported successfully!");
      } else {
        throw new Error(result.error || "Failed to import recommendation");
      }
    } catch (err) {
      console.error("Import error:", err);
      alert("Failed to import LinkedIn recommendation");
    } finally {
      setImportingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(recommendationId);
        return newSet;
      });
    }
  };

  if (!isLinkedInConfigured()) {
    return (
      <Card className={`p-8 text-center ${className}`}>
        <div className="space-y-4">
          <div className="text-4xl">🔗</div>
          <Typography
            variant="h3"
            className="text-xl font-bold text-gray-400 uppercase"
          >
            LinkedIn Integration Not Configured
          </Typography>
          <Typography variant="body" className="text-gray-500">
            Configure LinkedIn API credentials to import recommendations as
            testimonials.
          </Typography>
        </div>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h2" className="text-2xl font-bold uppercase">
            LinkedIn Recommendations
          </Typography>
          <Typography variant="body" className="text-gray-400">
            Import LinkedIn recommendations as testimonials
          </Typography>
        </div>
        <Button
          variant="secondary"
          onClick={fetchRecommendations}
          disabled={loading}
          className="font-mono uppercase"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-red-500 bg-red-900/20 p-4">
          <Typography variant="body" className="text-red-400">
            {error}
          </Typography>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <Card className="p-8 text-center">
          <div className="animate-pulse space-y-4">
            <div className="mx-auto h-8 w-1/3 rounded bg-gray-700"></div>
            <div className="mx-auto h-4 w-1/2 rounded bg-gray-700"></div>
          </div>
        </Card>
      )}

      {/* Recommendations Grid */}
      {!loading && recommendations.length > 0 && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {recommendations.map((recommendation, index) => (
            <motion.div
              key={recommendation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <LinkedInRecommendationCard
                recommendation={recommendation}
                onImport={() => importRecommendation(recommendation.id)}
                isImporting={importingIds.has(recommendation.id)}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && recommendations.length === 0 && !error && (
        <Card className="p-8 text-center">
          <div className="space-y-4">
            <div className="text-4xl">💼</div>
            <Typography
              variant="h3"
              className="text-xl font-bold text-gray-400 uppercase"
            >
              No New Recommendations
            </Typography>
            <Typography variant="body" className="text-gray-500">
              All LinkedIn recommendations have been imported or none are
              available.
            </Typography>
          </div>
        </Card>
      )}

      {/* LinkedIn Connection Status */}
      <Card className="bg-brutalist-charcoal-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h4" className="font-bold">
              LinkedIn Integration Status
            </Typography>
            <Typography variant="body" className="text-gray-400">
              Connected and syncing recommendations
            </Typography>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <Typography variant="caption" className="text-green-400 uppercase">
              Active
            </Typography>
          </div>
        </div>
      </Card>
    </div>
  );
}

interface LinkedInRecommendationCardProps {
  recommendation: LinkedInRecommendation;
  onImport: () => void;
  isImporting: boolean;
}

function LinkedInRecommendationCard({
  recommendation,
  onImport,
  isImporting,
}: LinkedInRecommendationCardProps) {
  return (
    <Card className="hover:border-brutalist-yellow p-6 transition-all duration-300">
      <div className="space-y-4">
        {/* LinkedIn Badge */}
        <div className="flex items-center justify-between">
          <div className="bg-blue-600 px-3 py-1 text-xs font-bold text-white uppercase">
            LinkedIn Recommendation
          </div>
          <a
            href={recommendation.recommender.publicProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brutalist-yellow text-sm hover:underline"
          >
            View Profile →
          </a>
        </div>

        {/* Recommender Info */}
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            {recommendation.recommender.profilePicture ? (
              <div className="relative h-12 w-12 overflow-hidden border-2 border-white">
                <img
                  src={recommendation.recommender.profilePicture}
                  alt={`${recommendation.recommender.firstName} ${recommendation.recommender.lastName}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="bg-brutalist-charcoal-100 flex h-12 w-12 items-center justify-center border-2 border-white">
                <span className="text-lg">👤</span>
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <Typography variant="h4" className="font-bold">
              {recommendation.recommender.firstName}{" "}
              {recommendation.recommender.lastName}
            </Typography>
            <Typography variant="caption" className="text-gray-400">
              {recommendation.recommender.headline}
            </Typography>
          </div>
        </div>

        {/* Recommendation Text */}
        <Typography variant="body" className="leading-relaxed text-gray-300">
          "{recommendation.text}"
        </Typography>

        {/* Date */}
        <Typography variant="caption" className="text-gray-500">
          Recommended on{" "}
          {new Date(recommendation.createdAt).toLocaleDateString()}
        </Typography>

        {/* Import Button */}
        <div className="border-t border-gray-700 pt-4">
          <Button
            variant="accent"
            size="sm"
            onClick={onImport}
            disabled={isImporting}
            className="w-full font-mono uppercase"
          >
            {isImporting ? "Importing..." : "Import as Testimonial"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
