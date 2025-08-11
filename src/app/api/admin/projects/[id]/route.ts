import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const updateProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  content: z.string().optional(),
  technologies: z.array(z.string()),
  githubUrl: z.string().url().optional().or(z.literal("")),
  liveUrl: z.string().url().optional().or(z.literal("")),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED", "FEATURED"]),
  featured: z.boolean(),
  thumbnail: z.string().optional(),
  images: z.array(z.string()),
  videoUrl: z.string().url().optional().or(z.literal("")),
  publishedAt: z.string().optional().nullable(),
  categoryIds: z.array(z.string()),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const project = await db.project.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        categories: true,
        analytics: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Failed to fetch project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = updateProjectSchema.parse(body);

    // Check if project exists
    const existingProject = await db.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check if slug is unique (excluding current project)
    if (validatedData.slug !== existingProject.slug) {
      const slugExists = await db.project.findFirst({
        where: {
          slug: validatedData.slug,
          id: { not: id },
        },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "Slug already exists" },
          { status: 400 }
        );
      }
    }

    // Disconnect all categories first, then connect new ones
    await db.project.update({
      where: { id },
      data: {
        categories: {
          set: [],
        },
      },
    });

    const project = await db.project.update({
      where: { id },
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        description: validatedData.description,
        content: validatedData.content || "",
        technologies: validatedData.technologies,
        githubUrl: validatedData.githubUrl || null,
        liveUrl: validatedData.liveUrl || null,
        status: validatedData.status,
        featured: validatedData.featured,
        thumbnail: validatedData.thumbnail || null,
        images: validatedData.images,
        videoUrl: validatedData.videoUrl || null,
        publishedAt: validatedData.publishedAt
          ? new Date(validatedData.publishedAt)
          : null,
        categories: {
          connect: validatedData.categoryIds.map((id) => ({ id })),
        },
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        categories: true,
      },
    });

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Failed to update project:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const project = await db.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    await db.project.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
