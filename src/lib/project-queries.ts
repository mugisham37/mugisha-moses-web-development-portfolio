import { db } from "./db";
import { ProjectStatus } from "@prisma/client";

export interface ProjectSearchFilters {
  technologies?: string[];
  categories?: string[];
  status?: ProjectStatus[];
  featured?: boolean;
}

export interface ProjectSearchResult {
  projects: Array<{
    id: string;
    title: string;
    slug: string;
    description: string;
    technologies: string[];
    githubUrl: string | null;
    liveUrl: string | null;
    status: ProjectStatus;
    featured: boolean;
    thumbnail: string | null;
    viewCount: number;
    likeCount: number;
    createdAt: Date;
    updatedAt: Date;
    publishedAt: Date | null;
    author: {
      id: string;
      name: string | null;
      email: string;
    };
    categories: Array<{
      id: string;
      name: string;
      slug: string;
      color: string;
    }>;
  }>;
  totalCount: number;
  hasMore: boolean;
}

export async function trackProjectInteraction(
  projectId: string,
  event: string,
  metadata: Record<string, unknown> = {}
): Promise<void> {
  await db.projectAnalytics.create({
    data: {
      projectId,
      event,
      metadata,
    },
  });

  // Update project view count if it's a view event
  if (event === "view") {
    await db.project.update({
      where: { id: projectId },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });
  }

  // Update project like count if it's a like event
  if (event === "like") {
    await db.project.update({
      where: { id: projectId },
      data: {
        likeCount: {
          increment: 1,
        },
      },
    });
  }
}

export async function getProjectAnalytics(
  projectId: string,
  days: number = 30
): Promise<{
  totalViews: number;
  totalLikes: number;
  recentEvents: Array<{
    event: string;
    metadata: unknown;
    createdAt: Date;
  }>;
  eventCounts: Record<string, number>;
}> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const [project, analytics] = await Promise.all([
    db.project.findUnique({
      where: { id: projectId },
      select: {
        viewCount: true,
        likeCount: true,
      },
    }),
    db.projectAnalytics.findMany({
      where: {
        projectId,
        createdAt: {
          gte: startDate,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
    }),
  ]);

  if (!project) {
    throw new Error("Project not found");
  }

  // Count events by type
  const eventCounts: Record<string, number> = {};
  analytics.forEach((analytic) => {
    eventCounts[analytic.event] = (eventCounts[analytic.event] || 0) + 1;
  });

  return {
    totalViews: project.viewCount,
    totalLikes: project.likeCount,
    recentEvents: analytics.map((a) => ({
      event: a.event,
      metadata: a.metadata,
      createdAt: a.createdAt,
    })),
    eventCounts,
  };
}

export async function searchProjects(
  query: string,
  filters: ProjectSearchFilters = {},
  limit: number = 10
): Promise<ProjectSearchResult> {
  const where: {
    status?: { in: ProjectStatus[] } | ProjectStatus;
    featured?: boolean;
    OR?: Array<{
      title?: { contains: string; mode: "insensitive" };
      description?: { contains: string; mode: "insensitive" };
      technologies?: { hasSome: string[] };
    }>;
    technologies?: { hasSome: string[] };
    categories?: { some: { slug: { in: string[] } } };
  } = {};

  // Add search query
  if (query.trim()) {
    where.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
      { technologies: { hasSome: [query] } },
    ];
  }

  // Add filters
  if (filters.status && filters.status.length > 0) {
    where.status = { in: filters.status };
  }

  if (filters.featured !== undefined) {
    where.featured = filters.featured;
  }

  if (filters.technologies && filters.technologies.length > 0) {
    where.technologies = { hasSome: filters.technologies };
  }

  if (filters.categories && filters.categories.length > 0) {
    where.categories = {
      some: {
        slug: { in: filters.categories },
      },
    };
  }

  // Get projects with pagination
  const [projects, totalCount] = await Promise.all([
    db.project.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        categories: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
          },
        },
      },
      orderBy: [
        { featured: "desc" },
        { publishedAt: "desc" },
        { createdAt: "desc" },
      ],
      take: limit + 1, // Take one extra to check if there are more
    }),
    db.project.count({ where }),
  ]);

  const hasMore = projects.length > limit;
  const resultProjects = hasMore ? projects.slice(0, limit) : projects;

  return {
    projects: resultProjects,
    totalCount,
    hasMore,
  };
}
