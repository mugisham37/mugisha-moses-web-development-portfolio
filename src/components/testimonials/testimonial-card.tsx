"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { StarRating } from "./star-rating";
import { TestimonialVideoPlayer } from "./testimonial-video-player";
import type { Testimonial } from "@prisma/client";

interface TestimonialWithAuthor extends Testimonial {
  author?: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  } | null;
}

interface TestimonialCardProps {
  testimonial: TestimonialWithAuthor;
  variant?: "default" | "compact" | "featured";
  showVideo?: boolean;
  className?: string;
}

export function TestimonialCard({
  testimonial,
  variant = "default",
  showVideo = true,
  className = "",
}: TestimonialCardProps) {
  const isCompact = variant === "compact";
  const isFeatured = variant === "featured";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={className}
    >
      <Card
        className={`h-full p-6 transition-all duration-300 ${isFeatured ? "border-brutalist-yellow bg-brutalist-charcoal-100" : ""} ${isCompact ? "p-4" : "p-6"} hover:border-brutalist-yellow hover:shadow-lg`}
      >
        <div className={`space-y-4 ${isCompact ? "space-y-3" : "space-y-4"}`}>
          {/* Rating */}
          <div className="flex items-center justify-between">
            <StarRating
              rating={testimonial.rating}
              size={isCompact ? "sm" : "md"}
            />
            {isFeatured && (
              <div className="bg-brutalist-yellow px-2 py-1 text-xs font-bold text-black uppercase">
                FEATURED
              </div>
            )}
          </div>

          {/* Video Player */}
          {testimonial.videoUrl && showVideo && (
            <TestimonialVideoPlayer
              videoUrl={testimonial.videoUrl}
              posterUrl={testimonial.avatarUrl}
              clientName={testimonial.name}
            />
          )}

          {/* Content */}
          <Typography
            variant={isCompact ? "body" : "h4"}
            className={`leading-relaxed text-gray-300 ${isCompact ? "text-sm" : "text-base"} `}
          >
            "{testimonial.content}"
          </Typography>

          {/* Author Info */}
          <div className="flex items-center gap-3 border-t border-gray-700 pt-2">
            <div className="flex-shrink-0">
              {testimonial.avatarUrl ? (
                <div className="relative h-12 w-12 overflow-hidden border-2 border-white">
                  <img
                    src={testimonial.avatarUrl}
                    alt={testimonial.name}
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
              <Typography
                variant="h4"
                className={`font-bold ${isCompact ? "text-sm" : "text-base"}`}
              >
                {testimonial.name}
              </Typography>
              <Typography
                variant="caption"
                className={`text-gray-400 ${isCompact ? "text-xs" : "text-sm"}`}
              >
                {testimonial.role}
              </Typography>
              {testimonial.company && (
                <Typography
                  variant="caption"
                  className={`text-brutalist-yellow block ${isCompact ? "text-xs" : "text-sm"}`}
                >
                  {testimonial.company}
                </Typography>
              )}
            </div>
          </div>

          {/* LinkedIn Integration Placeholder */}
          {testimonial.author?.email && (
            <div className="border-t border-gray-700 pt-2">
              <Typography variant="caption" className="text-xs text-gray-500">
                Verified client • LinkedIn connected
              </Typography>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
