import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await db.blogPost.findUnique({
      where: {
        slug: params.slug,
        status: "PUBLISHED",
        publishedAt: {
          lte: new Date(),
        },
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        categories: true,
        tags: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Track view
    await db.blogAnalytics.create({
      data: {
        postId: post.id,
        event: "view",
        metadata: {
          userAgent: request.headers.get("user-agent"),
          referer: request.headers.get("referer"),
        },
      },
    });

    // Update view count
    await db.blogPost.update({
      where: { id: post.id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Failed to fetch blog post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
