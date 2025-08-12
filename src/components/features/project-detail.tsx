"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ImageGallery } from "@/components/ui/image-gallery";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import {
  ExternalLink,
  Github,
  Eye,
  Heart,
  Calendar,
  User,
} from "lucide-react";
import { ProjectWithRelations } from "@/lib/types";
import { useProjectAnalytics } from "@/lib/hooks/use-project-analytics";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

interface ProjectDetailProps {
  project: ProjectWithRelations;
  relatedProjects?: ProjectWithRelations[];
  onViewIncrement?: () => void;
  className?: string;
}

// Convert project images to gallery format
const convertToGalleryImages = (images: string[], title: string) => {
  return images.map((image, index) => ({
    src: image,
    alt: `${title} - Image ${index + 1}`,
    caption: `Project screenshot ${index + 1}`,
  }));
};

export function ProjectDetail({
  project,
  relatedProjects = [],
  onViewIncrement,
  className,
}: ProjectDetailProps) {
  const [hasIncrementedView, setHasIncrementedView] = useState(false);
  const { trackView, trackClick, trackTimeSpent, trackScroll } =
    useProjectAnalytics(project.id);

  // Increment view count and track analytics on mount
  useEffect(() => {
    if (!hasIncrementedView) {
      // Server-side view increment
      if (onViewIncrement) {
        onViewIncrement();
      }

      // Client-side analytics tracking
      trackView({
        projectTitle: project.title,
        projectSlug: project.slug,
        technologies: project.technologies,
        categories: project.categories.map((cat) => cat.name),
      });

      setHasIncrementedView(true);
    }
  }, [hasIncrementedView, onViewIncrement, trackView, project]);

  // Track time spent on page
  useEffect(() => {
    const startTime = Date.now();

    const handleBeforeUnload = () => {
      const timeSpent = Date.now() - startTime;
      trackTimeSpent(timeSpent, {
        projectTitle: project.title,
        projectSlug: project.slug,
      });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // Track time spent when component unmounts
      const timeSpent = Date.now() - startTime;
      trackTimeSpent(timeSpent, {
        projectTitle: project.title,
        projectSlug: project.slug,
      });
    };
  }, [trackTimeSpent, project]);

  // Track scroll progress
  useEffect(() => {
    let lastScrollPercentage = 0;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = Math.round((scrollTop / docHeight) * 100);

      // Track every 25% milestone
      if (scrollPercentage >= lastScrollPercentage + 25) {
        trackScroll(scrollPercentage, {
          projectTitle: project.title,
          projectSlug: project.slug,
        });
        lastScrollPercentage = scrollPercentage;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [trackScroll, project]);

  return (
    <div className={cn("space-y-8", className)}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Categories */}
        {project.categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.categories.map((category) => (
              <span
                key={category.id}
                className="bg-gray-800 px-3 py-1 font-mono text-sm text-white"
                style={{ borderLeft: `4px solid ${category.color}` }}
              >
                {category.name.toUpperCase()}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <Typography variant="display" className="text-white">
          {project.title}
        </Typography>

        {/* Description */}
        <Typography variant="h6" className="max-w-4xl text-gray-300">
          {project.description}
        </Typography>

        {/* Meta information */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="font-mono">
              {project.author.name || "ANONYMOUS"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="font-mono">
              {new Date(project.createdAt)
                .toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
                .toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span className="font-mono">{project.viewCount} VIEWS</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            <span className="font-mono">{project.likeCount} LIKES</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-4">
          {project.liveUrl && (
            <Button variant="accent" size="lg" asChild>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackClick("live_site_button", {
                    projectTitle: project.title,
                    projectSlug: project.slug,
                    url: project.liveUrl,
                  })
                }
              >
                <ExternalLink className="mr-2 h-5 w-5" />
                VIEW LIVE SITE
              </a>
            </Button>
          )}
          {project.githubUrl && (
            <Button variant="secondary" size="lg" asChild>
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackClick("github_button", {
                    projectTitle: project.title,
                    projectSlug: project.slug,
                    url: project.githubUrl,
                  })
                }
              >
                <Github className="mr-2 h-5 w-5" />
                VIEW SOURCE CODE
              </a>
            </Button>
          )}
        </div>
      </motion.div>

      {/* Image Gallery */}
      {project.images.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Typography variant="h4" className="mb-6 text-white">
            PROJECT GALLERY
          </Typography>
          <ImageGallery
            images={convertToGalleryImages(project.images, project.title)}
            title={project.title}
            showThumbnails={true}
            showControls={true}
            enableKeyboard={true}
            enableSwipe={true}
            onImageChange={(index) => {
              // Track gallery interaction
              trackClick("gallery_navigation", {
                projectTitle: project.title,
                projectSlug: project.slug,
                imageIndex: index,
              });
            }}
          />
        </motion.div>
      )}

      {/* Video */}
      {project.videoUrl && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Typography variant="h4" className="mb-6 text-white">
            PROJECT DEMO
          </Typography>
          <div className="aspect-video border border-white">
            <iframe
              src={project.videoUrl}
              title={`${project.title} Demo`}
              className="h-full w-full"
              allowFullScreen
            />
          </div>
        </motion.div>
      )}

      {/* Technologies */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Typography variant="h4" className="mb-6 text-white">
          TECHNOLOGIES USED
        </Typography>
        <div className="flex flex-wrap gap-3">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="bg-white px-4 py-2 font-mono text-lg font-bold text-black"
            >
              {tech.toUpperCase()}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Content */}
      {project.content && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Typography variant="h4" className="mb-6 text-white">
            PROJECT DETAILS
          </Typography>
          <Card className="border-white bg-black p-8">
            <div
              className="prose prose-invert prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: project.content }}
            />
          </Card>
        </motion.div>
      )}

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Typography variant="h4" className="mb-6 text-white">
            RELATED PROJECTS
          </Typography>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {relatedProjects.map((relatedProject) => (
              <Link
                key={relatedProject.id}
                href={`/projects/${relatedProject.slug}`}
                className="group"
              >
                <Card hover="lift" className="h-full overflow-hidden bg-black">
                  {relatedProject.thumbnail && (
                    <div className="relative aspect-video overflow-hidden">
                      <ResponsiveImage
                        src={relatedProject.thumbnail}
                        alt={`${relatedProject.title} - Related project thumbnail`}
                        fill
                        aspectRatio="video"
                        className="transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        quality={75}
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <Typography
                      variant="h6"
                      className="group-hover:text-accent mb-2 text-white transition-colors"
                    >
                      {relatedProject.title}
                    </Typography>
                    <Typography
                      variant="sm"
                      className="line-clamp-2 text-gray-400"
                    >
                      {relatedProject.description}
                    </Typography>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
