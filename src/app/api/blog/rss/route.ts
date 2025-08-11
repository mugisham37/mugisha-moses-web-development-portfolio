import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const posts = await db.blogPost.findMany({
      where: {
        status: "PUBLISHED",
        publishedAt: {
          lte: new Date(),
        },
      },
      include: {
        author: {
          select: { name: true, email: true },
        },
        categories: true,
      },
      orderBy: { publishedAt: "desc" },
      take: 20,
    });

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000";
    const buildDate = new Date().toUTCString();

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Developer Portfolio Blog</title>
    <description>Latest insights on web development, technology, and software engineering</description>
    <link>${siteUrl}/blog</link>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${siteUrl}/api/blog/rss" rel="self" type="application/rss+xml"/>
    
    ${posts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt || post.content.substring(0, 200) + "..."}]]></description>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid>
      <pubDate>${post.publishedAt?.toUTCString()}</pubDate>
      <author>${post.author.email} (${post.author.name})</author>
      ${post.categories
        .map((category) => `<category>${category.name}</category>`)
        .join("")}
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

    return new NextResponse(rssXml, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "s-maxage=3600, stale-while-revalidate",
      },
    });
  } catch (error) {
    console.error("Failed to generate RSS feed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
