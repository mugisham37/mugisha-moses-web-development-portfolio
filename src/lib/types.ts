// Global type definitions
export interface User {
  id: string;
  email: string;
  name?: string;
  role: "USER" | "ADMIN";
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED" | "FEATURED";
  featured: boolean;
  thumbnail?: string;
  images: string[];
  videoUrl?: string;
  viewCount: number;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  status: "DRAFT" | "PUBLISHED" | "SCHEDULED" | "ARCHIVED";
  featured: boolean;
  publishedAt?: Date;
  viewCount: number;
  readingTime: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface GitHubRepository {
  id: string;
  githubId: number;
  name: string;
  fullName: string;
  description?: string;
  language?: string;
  starCount: number;
  forkCount: number;
  watcherCount: number;
  htmlUrl: string;
  cloneUrl: string;
  isPrivate: boolean;
  isFork: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
  pushedAt?: Date;
  lastSyncAt: Date;
}

// Extended project types for showcase system
export interface ProjectCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  _count?: {
    projects: number;
  };
}

export interface ProjectWithRelations extends Project {
  categories: ProjectCategory[];
  author: {
    id: string;
    name: string | null;
    email: string;
  };
  analytics?: ProjectAnalytics[];
}

export interface ProjectAnalytics {
  id: string;
  projectId: string;
  event: string;
  metadata?: any;
  createdAt: Date;
}

export interface ProjectFilters {
  technologies?: string[];
  categories?: string[];
  status?: Project["status"][];
  search?: string;
  featured?: boolean;
}

export interface ProjectSortOptions {
  field: "createdAt" | "updatedAt" | "viewCount" | "likeCount" | "title";
  direction: "asc" | "desc";
}

export interface ProjectGridProps {
  projects: ProjectWithRelations[];
  loading?: boolean;
  viewMode?: "grid" | "masonry" | "list";
  showFilters?: boolean;
  showSearch?: boolean;
  showSort?: boolean;
}

export interface ProjectCardProps {
  project: ProjectWithRelations;
  variant?: "default" | "compact" | "featured";
  showMetrics?: boolean;
  showCategories?: boolean;
  interactive?: boolean;
}
