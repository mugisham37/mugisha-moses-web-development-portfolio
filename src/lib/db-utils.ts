import { db } from "./db";
import type { 
  Project, 
  BlogPost, 
  User, 
  ProjectCategory, 
  BlogCategory, 
  BlogTag, 
  Testimonial, 
  GitHubRepository, 
  ContactSubmission,
  PageView,
  Prisma
} from "@prisma/client";

// Type definitions for complex queries
export type ProjectWithRelations = Project & {
  author: User;
  categories: ProjectCategory[];
  analytics: { event: string; metadata: any; createdAt: Date }[];
};

export type BlogPostWithRelations = BlogPost & {
  author: User;
  categories: BlogCategory[];
  tags: BlogTag[];
  analytics: { event: string; metadata: any; createdAt: Date }[];
};

export type GitHubRepositoryWithContributions = GitHubRepository & {
  contributions: { date: Date; count: number; level: number }[];
};

// Project Queries
export class ProjectQueries {
  static async getAll(options?: {
    status?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
    includeRelations?: boolean;
  }) {
    const { status, featured, limit, offset, includeRelations = true } = options || {};

    return db.project.findMany({
      where: {
        ...(status && { status: status as any }),
        ...(featured !== undefined && { featured }),
        publishedAt: { not: null },
      },
      include: includeRelations ? {
        author: true,
        categories: true,
        analytics: {
          select: { event: true, metadata: true, createdAt: true },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      } : undefined,
      orderBy: [
        { featured: "desc" },
        { publishedAt: "desc" },
      ],
      ...(limit && { take: limit }),
      ...(offset && { skip: offset }),
    });
  }

  static async getBySlug(slug: string): Promise<ProjectWithRelations | null> {
    return db.project.findUnique({
      where: { slug },
      include: {
        author: true,
        categories: true,
        analytics: {
          select: { event: true, metadata: true, createdAt: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  static async getFeatured(limit = 6): Promise<ProjectWithRelations[]> {
    return db.project.findMany({
      where: {
        featured: true,
        publishedAt: { not: null },
      },
      include: {
        author: true,
        categories: true,
        analytics: {
          select: { event: true, metadata: true, createdAt: true },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
      orderBy: { publishedAt: "desc" },
      take: limit,
    });
  }

  static async incrementViewCount(id: string) {
    return db.$transaction([
      db.project.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      }),
      db.projectAnalytics.create({
        data: {
          projectId: id,
          event: "view",
          metadata: { timestamp: new Date() },
        },
      }),
    ]);
  }

  static async getPopular(limit = 10) {
    return db.project.findMany({
      where: { publishedAt: { not: null } },
      orderBy: { viewCount: "desc" },
      take: limit,
      include: {
        author: true,
        categories: true,
      },
    });
  }
}

// Blog Post Queries
export class BlogQueries {
  static async getAll(options?: {
    status?: string;
    featured?: boolean;
    categorySlug?: string;
    tagSlug?: string;
    limit?: number;
    offset?: number;
  }) {
    const { status, featured, categorySlug, tagSlug, limit, offset } = options || {};

    return db.blogPost.findMany({
      where: {
        ...(status && { status: status as any }),
        ...(featured !== undefined && { featured }),
        ...(categorySlug && {
          categories: { some: { slug: categorySlug } },
        }),
        ...(tagSlug && {
          tags: { some: { slug: tagSlug } },
        }),
        publishedAt: { not: null },
      },
      include: {
        author: true,
        categories: true,
        tags: true,
        analytics: {
          select: { event: true, metadata: true, createdAt: true },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
      orderBy: [
        { featured: "desc" },
        { publishedAt: "desc" },
      ],
      ...(limit && { take: limit }),
      ...(offset && { skip: offset }),
    });
  }

  static async getBySlug(slug: string): Promise<BlogPostWithRelations | null> {
    return db.blogPost.findUnique({
      where: { slug },
      include: {
        author: true,
        categories: true,
        tags: true,
        analytics: {
          select: { event: true, metadata: true, createdAt: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  static async getFeatured(limit = 3): Promise<BlogPostWithRelations[]> {
    return db.blogPost.findMany({
      where: {
        featured: true,
        publishedAt: { not: null },
      },
      include: {
        author: true,
        categories: true,
        tags: true,
        analytics: {
          select: { event: true, metadata: true, createdAt: true },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
      orderBy: { publishedAt: "desc" },
      take: limit,
    });
  }

  static async incrementViewCount(id: string) {
    return db.$transaction([
      db.blogPost.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      }),
      db.blogAnalytics.create({
        data: {
          postId: id,
          event: "view",
          metadata: { timestamp: new Date() },
        },
      }),
    ]);
  }

  static async search(query: string, limit = 10) {
    return db.blogPost.findMany({
      where: {
        AND: [
          { publishedAt: { not: null } },
          {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { excerpt: { contains: query, mode: "insensitive" } },
              { content: { contains: query, mode: "insensitive" } },
            ],
          },
        ],
      },
      include: {
        author: true,
        categories: true,
        tags: true,
      },
      orderBy: { publishedAt: "desc" },
      take: limit,
    });
  }
}

// GitHub Queries
export class GitHubQueries {
  static async getAllRepositories(): Promise<GitHubRepositoryWithContributions[]> {
    return db.gitHubRepository.findMany({
      include: {
        contributions: {
          orderBy: { date: "desc" },
          take: 365, // Last year of contributions
        },
      },
      orderBy: { starCount: "desc" },
    });
  }

  static async getTopRepositories(limit = 6) {
    return db.gitHubRepository.findMany({
      where: { isPrivate: false },
      orderBy: { starCount: "desc" },
      take: limit,
    });
  }

  static async updateRepository(githubId: number, data: Partial<GitHubRepository>) {
    return db.gitHubRepository.upsert({
      where: { githubId },
      update: {
        ...data,
        lastSyncAt: new Date(),
      },
      create: {
        githubId,
        ...data,
        lastSyncAt: new Date(),
      } as any,
    });
  }

  static async getContributionStats() {
    const result = await db.gitHubContribution.aggregate({
      _sum: { count: true },
      _max: { date: true },
      _min: { date: true },
    });

    const totalContributions = result._sum.count || 0;
    const latestDate = result._max.date;
    const earliestDate = result._min.date;

    return {
      totalContributions,
      latestDate,
      earliestDate,
    };
  }
}

// Analytics Queries
export class AnalyticsQueries {
  static async recordPageView(data: {
    path: string;
    sessionId: string;
    userId?: string;
    userAgent?: string;
    referer?: string;
    country?: string;
    city?: string;
  }) {
    return db.pageView.create({ data });
  }

  static async getPageViews(options?: {
    path?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }) {
    const { path, startDate, endDate, limit } = options || {};

    return db.pageView.findMany({
      where: {
        ...(path && { path }),
        ...(startDate && endDate && {
          createdAt: { gte: startDate, lte: endDate },
        }),
      },
      orderBy: { createdAt: "desc" },
      ...(limit && { take: limit }),
    });
  }

  static async getPopularPages(limit = 10) {
    return db.pageView.groupBy({
      by: ["path"],
      _count: { path: true },
      orderBy: { _count: { path: "desc" } },
      take: limit,
    });
  }

  static async getVisitorStats(days = 30) {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [totalViews, uniqueVisitors, topCountries] = await Promise.all([
      db.pageView.count({
        where: { createdAt: { gte: startDate } },
      }),
      db.pageView.findMany({
        where: { createdAt: { gte: startDate } },
        distinct: ["sessionId"],
        select: { sessionId: true },
      }),
      db.pageView.groupBy({
        by: ["country"],
        where: { 
          createdAt: { gte: startDate },
          country: { not: null },
        },
        _count: { country: true },
        orderBy: { _count: { country: "desc" } },
        take: 10,
      }),
    ]);

    return {
      totalViews,
      uniqueVisitors: uniqueVisitors.length,
      topCountries,
    };
  }
}

// Testimonial Queries
export class TestimonialQueries {
  static async getFeatured(limit = 6) {
    return db.testimonial.findMany({
      where: {
        featured: true,
        approved: true,
      },
      include: { author: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  static async getAll(options?: {
    approved?: boolean;
    featured?: boolean;
    limit?: number;
    offset?: number;
  }) {
    const { approved, featured, limit, offset } = options || {};

    return db.testimonial.findMany({
      where: {
        ...(approved !== undefined && { approved }),
        ...(featured !== undefined && { featured }),
      },
      include: { author: true },
      orderBy: { createdAt: "desc" },
      ...(limit && { take: limit }),
      ...(offset && { skip: offset }),
    });
  }
}

// Contact Queries
export class ContactQueries {
  static async create(data: Omit<ContactSubmission, "id" | "createdAt" | "updatedAt">) {
    return db.contactSubmission.create({ data });
  }

  static async getAll(options?: {
    status?: string;
    type?: string;
    responded?: boolean;
    limit?: number;
    offset?: number;
  }) {
    const { status, type, responded, limit, offset } = options || {};

    return db.contactSubmission.findMany({
      where: {
        ...(status && { status: status as any }),
        ...(type && { type: type as any }),
        ...(responded !== undefined && { responded }),
      },
      orderBy: { createdAt: "desc" },
      ...(limit && { take: limit }),
      ...(offset && { skip: offset }),
    });
  }

  static async markAsResponded(id: string) {
    return db.contactSubmission.update({
      where: { id },
      data: {
        responded: true,
        status: "RESPONDED",
        updatedAt: new Date(),
      },
    });
  }
}

// General utility functions
export class DatabaseUtils {
  static async healthCheck(): Promise<boolean> {
    try {
      await db.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }

  static async getStats() {
    const [
      projectCount,
      blogPostCount,
      testimonialCount,
      contactCount,
      pageViewCount,
    ] = await Promise.all([
      db.project.count({ where: { publishedAt: { not: null } } }),
      db.blogPost.count({ where: { publishedAt: { not: null } } }),
      db.testimonial.count({ where: { approved: true } }),
      db.contactSubmission.count(),
      db.pageView.count(),
    ]);

    return {
      projects: projectCount,
      blogPosts: blogPostCount,
      testimonials: testimonialCount,
      contacts: contactCount,
      pageViews: pageViewCount,
    };
  }

  static async cleanup() {
    // Clean up old analytics data (older than 1 year)
    const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);

    await Promise.all([
      db.pageView.deleteMany({
        where: { createdAt: { lt: oneYearAgo } },
      }),
      db.projectAnalytics.deleteMany({
        where: { createdAt: { lt: oneYearAgo } },
      }),
      db.blogAnalytics.deleteMany({
        where: { createdAt: { lt: oneYearAgo } },
      }),
    ]);
  }
}