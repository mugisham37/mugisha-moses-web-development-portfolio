import { NextRequest, NextResponse } from "next/server";
import { TestimonialQueries } from "@/lib/db-utils";

// GET /api/testimonials/featured - Get featured testimonials
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");

    const testimonials = await TestimonialQueries.getFeatured(
      limit ? parseInt(limit) : 6
    );

    return NextResponse.json({
      success: true,
      data: testimonials,
      count: testimonials.length,
    });
  } catch (error) {
    console.error("Error fetching featured testimonials:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch featured testimonials",
      },
      { status: 500 }
    );
  }
}
