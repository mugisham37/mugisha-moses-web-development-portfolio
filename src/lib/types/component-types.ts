/**
 * Type definitions for component props used in lazy loading
 */

import { BlogPost, ProjectWithRelations } from "../types";

// Generic component props type
export type GenericComponentProps = Record<string, unknown>;

// Admin component prop types
export interface BlogEditorProps extends GenericComponentProps {
  post?: BlogPost;
}

export interface ProjectEditorProps extends GenericComponentProps {
  project?: ProjectWithRelations;
}

export interface AdminAnalyticsDashboardProps extends GenericComponentProps {
  // Add specific props if needed
  className?: string;
}

export interface ThreeBackgroundProps extends GenericComponentProps {
  className?: string;
}

export interface TestimonialCarouselProps extends GenericComponentProps {
  testimonials: Array<{
    id: string;
    name: string;
    email: string;
    content: string;
    rating: number;
    status: string;
    role?: string | null;
    company?: string | null;
    website?: string | null;
    linkedinUrl?: string | null;
    projectType?: string | null;
    featured: boolean;
    createdAt: Date;
    updatedAt: Date;
    author?: {
      id: string;
      name: string | null;
      email: string;
      image: string | null;
    } | null;
  }>;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showNavigation?: boolean;
  showIndicators?: boolean;
  className?: string;
}
