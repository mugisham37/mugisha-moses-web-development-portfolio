import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProjectStatus } from "@prisma/client";
import { z } from "zod";

const bulkActionSchema = z.object({
  action: z.enum([
    "publish",
    "draft",
    "archive",
    "delete",
    "feature",
    "unfeature",
  ]),
  projectIds: z.array(z.string()).min(1, "At least one project ID is required"),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, projectIds } = bulkActionSchema.parse(body);

    let updateData: {
      status?: ProjectStatus;
      publishedAt?: Date | null;
      featured?: boolean;
    } = {};
    let deleteProjects = false;

    switch (action) {
      case "publish":
        updateData = {
          status: ProjectStatus.ACTIVE,
          publishedAt: new Date(),
        };
        break;
      case "draft":
        updateData = {
          status: ProjectStatus.DRAFT,
          publishedAt: null,
        };
        break;
      case "archive":
        updateData = { status: ProjectStatus.ARCHIVED };
        break;
      case "feature":
        updateData = { featured: true };
        break;
      case "unfeature":
        updateData = { featured: false };
        break;
      case "delete":
        deleteProjects = true;
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    if (deleteProjects) {
      // Delete projects
      await db.project.deleteMany({
        where: {
          id: { in: projectIds },
        },
      });
    } else {
      // Update projects
      await db.project.updateMany({
        where: {
          id: { in: projectIds },
        },
        data: updateData,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully ${action}ed ${projectIds.length} project(s)`,
    });
  } catch (error) {
    console.error("Bulk action failed:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
