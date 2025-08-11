import { NextRequest, NextResponse } from "next/server";
import { searchProjects } from "@/lib/project-queries";
import { z } from "zod";

const searchSchema = z.object({
  q: z.string().min(1).max(100),
  technologies: z.string().optional(),
  categories: z.string().optional(),
  status: z.string().optional(),
  featured: z.string().optional(),
  limit: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Validate search parameters
    const validatedParams = searchSchema.safeParse({
      q: searchParams.get("q") || "",
      technologies: searchParams.get("technologies") || undefined,
      categories: searchParams.get("categories") || undefined,
      status: searchParams.get("status") || undefined,
      featured: searchParams.get("featured") || undefined,
      limit: searchParams.get("limit") || undefined,
    });

    if (!validatedParams.success) {
      return NextResponse.json(
        {
          error: "Invalid search parameters",
          details: validatedParams.error.errors,
        },
        { status: 400 }
      );
    }

    const { q, technologies, categories, status, featured, limit } =
      validatedParams.data;

    // Parse filters
    const filters = {
      technologies: technologies?.split(",").filter(Boolean),
      categories: categories?.split(",").filter(Boolean),
      status: status?.split(",").filter(Boolean) as any,
      featured:
        featured === "true" ? true : featured === "false" ? false : undefined,
    };

    const searchLimit = limit ? parseInt(limit, 10) : 10;

    // Perform search
    const results = await searchProjects(q, filters, searchLimit);

    return NextResponse.json({
      success: true,
      data: {
        projects: results.projects,
        totalCount: results.totalCount,
        hasMore: results.hasMore,
        query: q,
        filters,
      },
    });
  } catch (error) {
    console.error("Project search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validatedBody = searchSchema.safeParse(body);

    if (!validatedBody.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: validatedBody.error.errors },
        { status: 400 }
      );
    }

    const { q, technologies, categories, status, featured, limit } =
      validatedBody.data;

    // Parse filters
    const filters = {
      technologies: technologies?.split(",").filter(Boolean),
      categories: categories?.split(",").filter(Boolean),
      status: status?.split(",").filter(Boolean) as any,
      featured:
        featured === "true" ? true : featured === "false" ? false : undefined,
    };

    const searchLimit = limit ? parseInt(limit, 10) : 10;

    // Perform search
    const results = await searchProjects(q, filters, searchLimit);

    return NextResponse.json({
      success: true,
      data: {
        projects: results.projects,
        totalCount: results.totalCount,
        hasMore: results.hasMore,
        query: q,
        filters,
      },
    });
  } catch (error) {
    console.error("Project search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
