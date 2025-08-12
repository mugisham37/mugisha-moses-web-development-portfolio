import { db } from "./db";

export interface TestimonialQueryOptions {
  featured?: boolean;
  approved?: boolean;
  limit?: number;
  offset?: number;
}

export const TestimonialQueries = {
  async getAll(options: TestimonialQueryOptions = {}) {
    const where: {
      featured?: boolean;
      approved?: boolean;
    } = {};

    if (options.featured !== undefined) {
      where.featured = options.featured;
    }

    if (options.approved !== undefined) {
      where.approved = options.approved;
    }

    return await db.testimonial.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      ...(options.limit && { take: options.limit }),
      ...(options.offset && { skip: options.offset }),
    });
  },

  async getById(id: string) {
    return await db.testimonial.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  },

  async getFeatured(limit = 6) {
    return await db.testimonial.findMany({
      where: {
        featured: true,
        approved: true,
      },
      include: {
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
  },
};
