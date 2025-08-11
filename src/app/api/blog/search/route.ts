import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!query || query.length < 2) {
      return NextResponse.json({ posts: [] });
    }

    const posts = await db.blogPost.findMany({
      where: {
        status: "PUBLISHED",
        publishedAt: {
          lte: new Date(),
        },
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { excerpt: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        publishedAt: true,
        readingTime: true,
        categories: {
          select: {
            name: true,
            slug: true,
            color: true,
          },
        },
        tags: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
      take: limit,
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Failed to search blog posts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
