/**
 * Dynamic Sitemap Generation
 * Generates sitemap.xml for search engine crawling
 */

import { MetadataRoute } from "next";
import { portfolioData } from "@/data/portfolio";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://your-domain.com";
  const currentDate = new Date().toISOString();

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: currentDate,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ];

  // Dynamic project pages
  const projectPages =
    portfolioData.projects?.map((project) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: project.updatedAt || currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })) || [];

  // Dynamic blog pages (if blog exists)
  const blogPages =
    portfolioData.blog?.posts?.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt || post.publishedAt || currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })) || [];

  // Dynamic service pages
  const servicePages =
    portfolioData.services?.map((service) => ({
      url: `${baseUrl}/services/${service.slug}`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })) || [];

  // Combine all pages
  return [...staticPages, ...projectPages, ...blogPages, ...servicePages];
}

/**
 * Generate sitemap index for large sites (future use)
 */
export function generateSitemapIndex(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://your-domain.com";
  const currentDate = new Date().toISOString();

  return [
    {
      url: `${baseUrl}/sitemap-main.xml`,
      lastModified: currentDate,
    },
    {
      url: `${baseUrl}/sitemap-projects.xml`,
      lastModified: currentDate,
    },
    {
      url: `${baseUrl}/sitemap-blog.xml`,
      lastModified: currentDate,
    },
  ];
}
