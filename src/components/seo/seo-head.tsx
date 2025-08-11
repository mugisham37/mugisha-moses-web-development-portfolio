import Head from "next/head";
import { SITE_CONFIG } from "@/lib/constants";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  noIndex?: boolean;
  canonical?: string;
  additionalMetaTags?: Array<{
    name?: string;
    property?: string;
    content: string;
  }>;
  structuredData?: Record<string, any> | Array<Record<string, any>>;
}

export function SEOHead({
  title,
  description = SITE_CONFIG.description,
  keywords = [],
  image,
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  author = SITE_CONFIG.author.name,
  noIndex = false,
  canonical,
  additionalMetaTags = [],
  structuredData,
}: SEOHeadProps) {
  const metaTitle = title ? `${title} | ${SITE_CONFIG.name}` : SITE_CONFIG.name;

  const metaUrl = url ? `${SITE_CONFIG.url}${url}` : SITE_CONFIG.url;
  const metaImage = image
    ? image.startsWith("http")
      ? image
      : `${SITE_CONFIG.url}${image}`
    : `${SITE_CONFIG.url}/og-default.jpg`;

  const allKeywords = [
    ...keywords,
    "developer",
    "portfolio",
    "brutalist",
    "next.js",
    "typescript",
    "react",
    "web development",
    "full-stack",
  ].join(", ");

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{metaTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />
      <meta name="author" content={author} />
      <meta name="creator" content={author} />
      <meta name="publisher" content={SITE_CONFIG.name} />

      {/* Robots */}
      <meta
        name="robots"
        content={
          noIndex
            ? "noindex, nofollow"
            : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        }
      />

      {/* Canonical URL */}
      <link rel="canonical" href={canonical || metaUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:site_name" content={SITE_CONFIG.name} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title || SITE_CONFIG.name} />
      <meta property="og:locale" content="en_US" />

      {/* Article specific Open Graph tags */}
      {type === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === "article" && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === "article" && (
        <meta property="article:author" content={author} />
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={metaImage} />
      <meta
        name="twitter:creator"
        content={`@${SITE_CONFIG.author.name.toLowerCase().replace(/\s+/g, "")}`}
      />

      {/* Additional Meta Tags */}
      {additionalMetaTags.map((tag, index) => (
        <meta
          key={index}
          {...(tag.name && { name: tag.name })}
          {...(tag.property && { property: tag.property })}
          content={tag.content}
        />
      ))}

      {/* Theme and App Meta */}
      <meta name="theme-color" content="#000000" />
      <meta name="color-scheme" content="dark light" />
      <meta name="format-detection" content="telephone=no" />

      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData, null, 2),
          }}
        />
      )}

      {/* RSS Feed */}
      <link
        rel="alternate"
        type="application/rss+xml"
        title="Blog RSS Feed"
        href="/blog/rss.xml"
      />

      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link rel="preconnect" href="https://api.github.com" />
    </Head>
  );
}
