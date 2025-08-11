import { NextResponse } from "next/server";
import { getAllBlogPosts } from "@/lib/blog-queries";
import { SITE_CONFIG } from "@/lib/constants";

export async function GET() {
  try {
    const posts = await getAllBlogPosts();
    const baseUrl = SITE_CONFIG.url;

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_CONFIG.name} - Blog</title>
    <description>${SITE_CONFIG.description}</description>
    <link>${baseUrl}/blog</link>
    <atom:link href="${baseUrl}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <managingEditor>${SITE_CONFIG.author.email} (${SITE_CONFIG.author.name})</managingEditor>
    <webMaster>${SITE_CONFIG.author.email} (${SITE_CONFIG.author.name})</webMaster>
    <generator>Next.js</generator>
    <image>
      <url>${baseUrl}/og-default.jpg</url>
      <title>${SITE_CONFIG.name} - Blog</title>
      <link>${baseUrl}/blog</link>
    </image>
    ${posts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt || post.content.substring(0, 200)}]]></description>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <pubDate>${post.publishedAt?.toUTCString() || post.updatedAt.toUTCString()}</pubDate>
      <author>${SITE_CONFIG.author.email} (${post.author.name || SITE_CONFIG.author.name})</author>
      ${post.categories.map((cat) => `<category><![CDATA[${cat.name}]]></category>`).join("")}
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

    return new NextResponse(rssXml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "s-maxage=3600, stale-while-revalidate",
      },
    });
  } catch (error) {
    console.error("Error generating RSS feed:", error);
    return new NextResponse("Error generating RSS feed", { status: 500 });
  }
}
