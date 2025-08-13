import { db } from "./db";
import { ProjectStatus } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { 
  fallbackProjectCategories, 
  fallbackTechnologies, 
  fallbackProjects,
  isDatabaseAvailable 
} from "./database-fallback";

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
  metadata: Prisma.InputJsonValue = {}
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

export async function getProjects({
  filters = {},
  sort = { field: "createdAt", direction: "desc" },
  limit = 10,
  offset = 0,
}: {
  filters?: ProjectSearchFilters & { search?: string };
  sort?: {
    field: "createdAt" | "updatedAt" | "viewCount" | "likeCount" | "title";
    direction: "asc" | "desc";
  };
  limit?: number;
  offset?: number;
} = {}): Promise<ProjectSearchResult> {
  // Check if database is available
  if (!isDatabaseAvailable()) {
    console.warn('Database not available, using fallback projects');
    const filteredProjects = fallbackProjects.slice(offset, offset + limit);
    return {
      projects: filteredProjects as ProjectSearchResult['projects'],
      totalCount: fallbackProjects.length,
      hasMore: offset + limit < fallbackProjects.length,
    };
  }

  try {
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
  if (filters.search?.trim()) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
      { technologies: { hasSome: [filters.search] } },
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

  // Build orderBy
  const orderBy: Record<string, "asc" | "desc">[] = [];
  if (sort.field === "title") {
    orderBy.push({ title: sort.direction });
  } else if (sort.field === "viewCount") {
    orderBy.push({ viewCount: sort.direction });
  } else if (sort.field === "likeCount") {
    orderBy.push({ likeCount: sort.direction });
  } else if (sort.field === "updatedAt") {
    orderBy.push({ updatedAt: sort.direction });
  } else {
    orderBy.push({ createdAt: sort.direction });
  }

  // Always add secondary sort for consistency
  orderBy.push({ featured: "desc" });
  orderBy.push({ createdAt: "desc" });

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
      orderBy,
      skip: offset,
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
  } catch (error) {
    console.error('Error fetching projects:', error);
    // Return fallback data on database error
    const filteredProjects = fallbackProjects.slice(offset, offset + limit);
    return {
      projects: filteredProjects,
      totalCount: fallbackProjects.length,
      hasMore: offset + limit < fallbackProjects.length,
    };
  }
}

export async function getProjectCategories(): Promise<
  Array<{
    id: string;
    name: string;
    slug: string;
    color?: string;
    projectCount: number;
  }>
> {
  // Check if database is available
  if (!isDatabaseAvailable()) {
    console.warn('Database not available, using fallback categories');
    return fallbackProjectCategories.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      color: '#3B82F6', // Default blue color
      projectCount: cat._count.projects
    }));
  }

  try {
    const categories = await db.projectCategory.findMany({
      include: {
        _count: {
          select: {
            projects: {
              where: {
                status: "ACTIVE",
              },
            },
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      color: category.color || '#3B82F6',
      projectCount: category._count.projects,
    }));
  } catch (error) {
    console.error('Error fetching project categories:', error);
    // Return fallback data on database error
    return fallbackProjectCategories.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      color: '#3B82F6',
      projectCount: cat._count.projects
    }));
  }
}

export async function getProjectTechnologies(): Promise<
  Array<{
    name: string;
    count: number;
  }>
> {
  // Check if database is available
  if (!isDatabaseAvailable()) {
    console.warn('Database not available, using fallback technologies');
    return fallbackTechnologies.map(tech => ({
      name: tech,
      count: Math.floor(Math.random() * 5) + 1 // Random count for demo
    }));
  }

  try {
    // Get all projects with their technologies
    const projects = await db.project.findMany({
      where: {
        status: "ACTIVE",
      },
      select: {
        technologies: true,
      },
    });

    // Count technology usage
    const techCounts: Record<string, number> = {};
    projects.forEach((project) => {
      project.technologies.forEach((tech) => {
        techCounts[tech] = (techCounts[tech] || 0) + 1;
      });
    });

    // Convert to array and sort by count
    return Object.entries(techCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error('Error fetching project technologies:', error);
    // Return fallback data on database error
    return fallbackTechnologies.map(tech => ({
      name: tech,
      count: Math.floor(Math.random() * 5) + 1
    }));
  }
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
