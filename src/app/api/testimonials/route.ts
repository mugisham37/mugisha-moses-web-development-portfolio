import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { TestimonialQueries } from "@/lib/db-utils";
import { db } from "@/lib/db";
import { z } from "zod";

// Schema for testimonial submission
const testimonialSubmissionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  role: z.string().min(1, "Role is required"),
  company: z.string().optional(),
  content: z.string().min(50, "Content must be at least 50 characters"),
  rating: z.number().min(1).max(5),
  projectType: z.string().optional(),
  videoUrl: z.string().url().optional().or(z.literal("")),
  linkedinProfile: z.string().url().optional().or(z.literal("")),
  allowPublic: z.boolean().default(true),
  allowMarketing: z.boolean().default(false),
  source: z.string().optional(),
  linkedinRecommendationId: z.string().optional(),
});

// GET /api/testimonials - Get testimonials with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");
    const approved = searchParams.get("approved");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");

    const options = {
      ...(featured !== null && { featured: featured === "true" }),
      ...(approved !== null && { approved: approved === "true" }),
      ...(limit && { limit: parseInt(limit) }),
      ...(offset && { offset: parseInt(offset) }),
    };

    const testimonials = await TestimonialQueries.getAll(options);

    return NextResponse.json({
      success: true,
      data: testimonials,
      count: testimonials.length,
    });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch testimonials",
      },
      { status: 500 }
    );
  }
}

// POST /api/testimonials - Submit new testimonial
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = testimonialSubmissionSchema.parse(body);

    // Create testimonial (requires admin approval by default)
    const testimonial = await db.testimonial.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        role: validatedData.role,
        company: validatedData.company || null,
        content: validatedData.content,
        rating: validatedData.rating,
        videoUrl: validatedData.videoUrl || null,
        linkedinProfile: validatedData.linkedinProfile || null,
        source: validatedData.source || "direct",
        linkedinRecommendationId:
          validatedData.linkedinRecommendationId || null,
        featured: false, // Admin sets featured status
        approved: false, // Requires admin approval
      },
      include: {
        author: true,
      },
    });

    // TODO: Send notification email to admin about new testimonial
    // TODO: Send confirmation email to client

    return NextResponse.json({
      success: true,
      data: testimonial,
      message:
        "Testimonial submitted successfully. It will be reviewed before publication.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    console.error("Error creating testimonial:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit testimonial",
      },
      { status: 500 }
    );
  }
}

// PUT /api/testimonials - Update testimonial (admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Testimonial ID is required" },
        { status: 400 }
      );
    }

    const testimonial = await db.testimonial.update({
      where: { id },
      data: updateData,
      include: {
        author: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update testimonial",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/testimonials - Delete testimonial (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Testimonial ID is required" },
        { status: 400 }
      );
    }

    await db.testimonial.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete testimonial",
      },
      { status: 500 }
    );
  }
}
