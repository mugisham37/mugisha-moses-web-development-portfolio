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