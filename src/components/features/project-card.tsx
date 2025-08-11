"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Github, Eye, Heart } from "lucide-react";
import { ProjectWithRelations } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: ProjectWithRelations;
  variant?: "default" | "compact" | "featured";
  showMetrics?: boolean;
  showCategories?: boolean;
  interactive?: boolean;
  className?: string;
}

export function ProjectCard({
  project,
  variant = "default",
  showMetrics = true,
  showCategories = true,
  interactive = true,
  className,
}: ProjectCardProps) {
  const isCompact = variant === "compact";
  const isFeatured = variant === "featured";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={interactive ? { y: -4 } : undefined}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn("group", className)}
    >
      <Card
        variant={isFeatured ? "accent" : "default"}
        hover={interactive ? "lift" : "none"}
        className={cn(
          "h-full overflow-hidden bg-black",
          isFeatured && "border-accent shadow-brutalist-accent-lg"
        )}
      >
        {/* Project Image */}
        <div className="relative aspect-video overflow-hidden">
          {project.thumbnail ? (
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gray-900">
              <Typography variant="h4" className="text-gray-600">
                NO IMAGE
              </Typography>
            </div>
          )}

          {/* Overlay with actions */}
          <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="flex h-full items-center justify-center gap-2">
              {project.liveUrl && (
                <Button
                  variant="accent"
                  size="sm"
                  asChild
                  className="transform transition-transform hover:scale-110"
                >
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="h-4 w-4" />
                    LIVE
                  </a>
                </Button>
              )}
              {project.githubUrl && (
                <Button
                  variant="secondary"
                  size="sm"
                  asChild
                  className="transform transition-transform hover:scale-110"
                >
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Github className="h-4 w-4" />
                    CODE
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Status badge */}
          {project.featured && (
            <div className="absolute top-4 left-4">
              <div className="bg-accent px-2 py-1 font-mono text-xs font-bold text-black">
                FEATURED
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className={cn("p-6", isCompact && "p-4")}>
          {/* Categories */}
          {showCategories && project.categories.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {project.categories.slice(0, 3).map((category) => (
                <span
                  key={category.id}
                  className="bg-gray-800 px-2 py-1 font-mono text-xs text-white"
                  style={{ borderLeft: `3px solid ${category.color}` }}
                >
                  {category.name.toUpperCase()}
                </span>
              ))}
              {project.categories.length > 3 && (
                <span className="bg-gray-800 px-2 py-1 font-mono text-xs text-gray-400">
                  +{project.categories.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Title */}
          <Typography
            variant={isFeatured ? "h3" : isCompact ? "h5" : "h4"}
            className="group-hover:text-accent mb-2 line-clamp-2 text-white transition-colors"
          >
            {project.title}
          </Typography>

          {/* Description */}
          <Typography
            variant="body"
            className={cn(
              "mb-4 line-clamp-3 text-gray-300",
              isCompact && "line-clamp-2 text-sm"
            )}
          >
            {project.description}
          </Typography>

          {/* Technologies */}
          <div className="mb-4 flex flex-wrap gap-1">
            {project.technologies.slice(0, isCompact ? 4 : 6).map((tech) => (
              <span
                key={tech}
                className="bg-white px-2 py-1 font-mono text-xs font-bold text-black"
              >
                {tech.toUpperCase()}
              </span>
            ))}
            {project.technologies.length > (isCompact ? 4 : 6) && (
              <span className="bg-gray-700 px-2 py-1 font-mono text-xs text-gray-300">
                +{project.technologies.length - (isCompact ? 4 : 6)}
              </span>
            )}
          </div>

          {/* Metrics */}
          {showMetrics && (
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span className="font-mono">{project.viewCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                <span className="font-mono">{project.likeCount}</span>
              </div>
              <div className="ml-auto font-mono text-xs">
                {new Date(project.createdAt).getFullYear()}
              </div>
            </div>
          )}

          {/* View Details Button */}
          <div className="mt-4">
            <Button
              variant="primary"
              size="sm"
              asChild
              className="w-full transform transition-transform hover:scale-[1.02]"
            >
              <Link href={`/projects/${project.slug}`}>VIEW DETAILS</Link>
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// Skeleton loader for project cards
export function ProjectCardSkeleton({
  variant = "default",
}: {
  variant?: "default" | "compact" | "featured";
}) {
  const isCompact = variant === "compact";

  return (
    <Card className="h-full overflow-hidden bg-black">
      {/* Image skeleton */}
      <div className="aspect-video animate-pulse bg-gray-800" />

      {/* Content skeleton */}
      <div className={cn("p-6", isCompact && "p-4")}>
        {/* Categories skeleton */}
        <div className="mb-3 flex gap-2">
          <div className="h-6 w-16 animate-pulse bg-gray-800" />
          <div className="h-6 w-20 animate-pulse bg-gray-800" />
        </div>

        {/* Title skeleton */}
        <div className="mb-2 h-6 w-3/4 animate-pulse bg-gray-800" />

        {/* Description skeleton */}
        <div className="mb-4 space-y-2">
          <div className="h-4 w-full animate-pulse bg-gray-800" />
          <div className="h-4 w-2/3 animate-pulse bg-gray-800" />
        </div>

        {/* Technologies skeleton */}
        <div className="mb-4 flex gap-1">
          <div className="h-6 w-12 animate-pulse bg-gray-800" />
          <div className="h-6 w-16 animate-pulse bg-gray-800" />
          <div className="h-6 w-14 animate-pulse bg-gray-800" />
        </div>

        {/* Metrics skeleton */}
        <div className="mb-4 flex gap-4">
          <div className="h-4 w-8 animate-pulse bg-gray-800" />
          <div className="h-4 w-8 animate-pulse bg-gray-800" />
          <div className="ml-auto h-4 w-12 animate-pulse bg-gray-800" />
        </div>

        {/* Button skeleton */}
        <div className="h-10 w-full animate-pulse bg-gray-800" />
      </div>
    </Card>
  );
}
