import { db } from "./db";
import { ProjectStatus, Prisma } from "@prisma/client";

export interface ProjectFilters {
  technologies?: string[];
  categories?: string[];
  status?: ProjectStatus[];
  search?: string;
  featured?: boolean;
}

export interface ProjectSortOptions {
  field: "createdAt" | "updatedAt" | "viewCount" | "likeCount" | "title";
  direction: "asc" | "desc";
}

export interface ProjectQueryOptions {
  filters?: ProjectFilters;
  sort?: ProjectSortOptions;
  limit?: number;
  offset?: number;
  includeAnalytics?: boolean;
}

// Get all projects (for sitemap generation)
export async function getAllProjects() {
  try {
    const projects = await db.project.findMany({
      where: {
        status: { not: "DRAFT" },
      },
      select: {
        slug: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return projects;
  } catch (error) {
    console.error("Error fetching all projects:", error);
    return [];
  }
}

// Get projects with filtering, sorting, and pagination
export async function getProjects(options: ProjectQueryOptions = {}) {
  const {
    filters = {},
    sort = { field: "createdAt", direction: "desc" },
    limit,
    offset = 0,
    includeAnalytics = false,
  } = options;

  const where: Prisma.ProjectWhereInput = {
    AND: [
      // Status filter
      filters.status?.length
        ? { status: { in: filters.status } }
        : { status: { not: "DRAFT" } },

      // Featured filter
      filters.featured !== undefined ? { featured: filters.featured } : {},

      // Technology filter
      filters.technologies?.length
        ? {
            technologies: {
              hasSome: filters.technologies,
            },
          }
        : {},

      // Category filter
      filters.categories?.length
        ? {
            categories: {
              some: {
                slug: { in: filters.categories },
              },
            },
          }
        : {},

      // Search filter
      filters.search
        ? {
            OR: [
              { title: { contains: filters.search, mode: "insensitive" } },
              {
                description: { contains: filters.search, mode: "insensitive" },
              },
              { content: { contains: filters.search, mode: "insensitive" } },
              { technologies: { hasSome: [filters.search] } },
            ],
          }
        : {},
    ],
  };

  const orderBy: Prisma.ProjectOrderByWithRelationInput = {
    [sort.field]: sort.direction,
  };

  const include: Prisma.ProjectInclude = {
    categories: true,
    author: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
    ...(includeAnalytics && {
      analytics: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    }),
  };

  const [projects, totalCount] = await Promise.all([
    db.project.findMany({
      where,
      include,
      orderBy,
      take: limit,
      skip: offset,
    }),
    db.project.count({ where }),
  ]);

  return {
    projects,
    totalCount,
    hasMore: limit ? offset + limit < totalCount : false,
  };
}

// Get a single project by slug
export async function getProjectBySlug(slug: string) {
  const project = await db.project.findUnique({
    where: { slug },
    include: {
      categories: true,
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      analytics: {
        orderBy: { createdAt: "desc" },
        take: 50,
      },
    },
  });

  return project;
}

// Get featured projects
export async function getFeaturedProjects(limit = 6) {
  const projects = await db.project.findMany({
    where: {
      featured: true,
      status: { not: "DRAFT" },
    },
    include: {
      categories: true,
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return projects;
}

// Get related projects based on technologies and categories
export async function getRelatedProjects(
  projectId: string,
  technologies: string[],
  categoryIds: string[],
  limit = 4
) {
  const projects = await db.project.findMany({
    where: {
      AND: [
        { id: { not: projectId } },
        { status: { not: "DRAFT" } },
        {
          OR: [
            { technologies: { hasSome: technologies } },
            { categories: { some: { id: { in: categoryIds } } } },
          ],
        },
      ],
    },
    include: {
      categories: true,
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { viewCount: "desc" },
    take: limit,
  });

  return projects;
}

// Get all unique technologies used in projects
export async function getProjectTechnologies() {
  const projects = await db.project.findMany({
    where: { status: { not: "DRAFT" } },
    select: { technologies: true },
  });

  const allTechnologies = projects.flatMap((project) => project.technologies);
  const uniqueTechnologies = [...new Set(allTechnologies)].sort();

  return uniqueTechnologies;
}

// Get all project categories
export async function getProjectCategories() {
  const categories = await db.projectCategory.findMany({
    include: {
      _count: {
        select: {
          projects: {
            where: { status: { not: "DRAFT" } },
          },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return categories;
}

// Increment project view count
export async function incrementProjectViews(
  projectId: string,
  metadata?: Record<string, unknown>
) {
  await Promise.all([
    // Update view count
    db.project.update({
      where: { id: projectId },
      data: { viewCount: { increment: 1 } },
    }),
    // Track analytics event
    db.projectAnalytics.create({
      data: {
        projectId,
        event: "view",
        metadata: JSON.parse(JSON.stringify(metadata || {})),
      },
    }),
  ]);
}

// Track project interaction
export async function trackProjectInteraction(
  projectId: string,
  event: string,
  metadata?: Record<string, unknown>
) {
  await db.projectAnalytics.create({
    data: {
      projectId,
      event,
      metadata: JSON.parse(JSON.stringify(metadata || {})),
    },
  });
}

// Get project analytics summary
export async function getProjectAnalytics(projectId: string, days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const analytics = await db.projectAnalytics.findMany({
    where: {
      projectId,
      createdAt: { gte: since },
    },
    orderBy: { createdAt: "desc" },
  });

  // Group by event type
  const eventCounts = analytics.reduce(
    (acc, item) => {
      acc[item.event] = (acc[item.event] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Group by day
  const dailyViews = analytics
    .filter((item) => item.event === "view")
    .reduce(
      (acc, item) => {
        const date = item.createdAt.toISOString().split("T")[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

  return {
    totalEvents: analytics.length,
    eventCounts,
    dailyViews,
    recentEvents: analytics.slice(0, 10),
  };
}

// Search projects with full-text search capabilities
export async function searchProjects(
  query: string,
  filters: Omit<ProjectFilters, "search"> = {},
  limit = 20
) {
  return getProjects({
    filters: { ...filters, search: query },
    sort: { field: "viewCount", direction: "desc" },
    limit,
  });
}
