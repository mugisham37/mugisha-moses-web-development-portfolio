import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const currentSlug = searchParams.get("current");

    if (!currentSlug) {
      return NextResponse.json(
        { error: "Current slug is required" },
        { status: 400 }
      );
    }

    // Get current post to find its published date
    const currentPost = await db.blogPost.findUnique({
      where: { slug: currentSlug },
      select: { publishedAt: true },
    });

    if (!currentPost || !currentPost.publishedAt) {
      return NextResponse.json({ prev: null, next: null });
    }

    const [prevPost, nextPost] = await Promise.all([
      // Previous post (older)
      db.blogPost.findFirst({
        where: {
          status: "PUBLISHED",
          publishedAt: {
            lt: currentPost.publishedAt,
          },
        },
        select: {
          title: true,
          slug: true,
          excerpt: true,
        },
        orderBy: { publishedAt: "desc" },
      }),
      // Next post (newer)
      db.blogPost.findFirst({
        where: {
          status: "PUBLISHED",
          publishedAt: {
            gt: currentPost.publishedAt,
          },
        },
        select: {
          title: true,
          slug: true,
          excerpt: true,
        },
        orderBy: { publishedAt: "asc" },
      }),
    ]);

    return NextResponse.json({
      prev: prevPost,
      next: nextPost,
    });
  } catch (error) {
    console.error("Failed to fetch navigation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
