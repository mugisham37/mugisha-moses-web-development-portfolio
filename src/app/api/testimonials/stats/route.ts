import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/testimonials/stats - Get testimonial statistics
export async function GET() {
  try {
    const [
      totalCount,
      approvedCount,
      featuredCount,
      videoCount,
      averageRating,
      ratingDistribution,
      recentCount,
      companiesCount,
    ] = await Promise.all([
      // Total testimonials
      db.testimonial.count(),

      // Approved testimonials
      db.testimonial.count({
        where: { approved: true },
      }),

      // Featured testimonials
      db.testimonial.count({
        where: { featured: true, approved: true },
      }),

      // Video testimonials
      db.testimonial.count({
        where: {
          videoUrl: { not: null },
          approved: true,
        },
      }),

      // Average rating
      db.testimonial.aggregate({
        where: { approved: true },
        _avg: { rating: true },
      }),

      // Rating distribution
      db.testimonial.groupBy({
        by: ["rating"],
        where: { approved: true },
        _count: { rating: true },
        orderBy: { rating: "desc" },
      }),

      // Recent testimonials (last 30 days)
      db.testimonial.count({
        where: {
          approved: true,
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),

      // Unique companies
      db.testimonial.findMany({
        where: {
          approved: true,
          company: { not: null },
        },
        select: { company: true },
        distinct: ["company"],
      }),
    ]);

    const stats = {
      total: totalCount,
      approved: approvedCount,
      featured: featuredCount,
      video: videoCount,
      averageRating: averageRating._avg.rating || 0,
      recent: recentCount,
      companies: companiesCount.length,
      ratingDistribution: ratingDistribution.map((item) => ({
        rating: item.rating,
        count: item._count.rating,
        percentage:
          approvedCount > 0 ? (item._count.rating / approvedCount) * 100 : 0,
      })),
      fiveStarPercentage:
        approvedCount > 0
          ? ((ratingDistribution.find((r) => r.rating === 5)?._count.rating ||
              0) /
              approvedCount) *
            100
          : 0,
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching testimonial stats:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch testimonial statistics",
      },
      { status: 500 }
    );
  }
}
