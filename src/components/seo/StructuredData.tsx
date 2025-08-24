/**
 * Structured Data Component
 * Renders JSON-LD structured data for enhanced search results
 */

import {
  generateHomepageStructuredData,
  generateStructuredData,
} from "@/utils/seo-helpers";

interface StructuredDataProps {
  type?: "homepage" | "person" | "website" | "article" | "organization";
  data?: any;
  customData?: Record<string, any>[];
}

export function StructuredData({
  type = "homepage",
  data,
  customData,
}: StructuredDataProps) {
  let structuredData: any[] = [];

  switch (type) {
    case "homepage":
      structuredData = generateHomepageStructuredData();
      break;
    case "person":
    case "website":
    case "article":
    case "organization":
      const generated = generateStructuredData(type, data);
      if (generated) {
        structuredData = [generated];
      }
      break;
  }

  // Add custom structured data if provided
  if (customData) {
    structuredData = [...structuredData, ...customData];
  }

  // Filter out null/undefined entries
  structuredData = structuredData.filter(Boolean);

  if (structuredData.length === 0) {
    return null;
  }

  return (
    <>
      {structuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data, null, 2),
          }}
        />
      ))}
    </>
  );
}

/**
 * Homepage Structured Data Component
 * Includes all relevant structured data for the main portfolio page
 */
export function HomepageStructuredData() {
  return <StructuredData type="homepage" />;
}

/**
 * Article Structured Data Component
 * For blog posts or articles
 */
export function ArticleStructuredData({
  title,
  description,
  publishedDate,
  modifiedDate,
  image,
  url,
}: {
  title: string;
  description: string;
  publishedDate?: string;
  modifiedDate?: string;
  image?: string;
  url?: string;
}) {
  return (
    <StructuredData
      type="article"
      data={{
        title,
        description,
        publishedDate,
        modifiedDate,
        image,
        url,
      }}
    />
  );
}

/**
 * Person Structured Data Component
 * For about pages or personal profiles
 */
export function PersonStructuredData() {
  return <StructuredData type="person" />;
}

/**
 * Organization Structured Data Component
 * For business/service pages
 */
export function OrganizationStructuredData() {
  return <StructuredData type="organization" />;
}
