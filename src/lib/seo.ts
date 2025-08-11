import { Metadata } from "next";
import { SITE_CONFIG } from "./constants";

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  noIndex?: boolean;
  canonical?: string;
}

export function generateMetadata({
  title,
  description = SITE_CONFIG.description,
  keywords = [],
  image,
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  author = SITE_CONFIG.author.name,
  section,
  tags = [],
  noIndex = false,
  canonical,
}: SEOProps = {}): Metadata {
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
  ];

  const metadata: Metadata = {
    title: metaTitle,
    description,
    keywords: allKeywords,
    authors: [
      {
        name: author,
        url: SITE_CONFIG.url,
      },
    ],
    creator: author,
    publisher: SITE_CONFIG.name,
    robots: noIndex
      ? "noindex, nofollow"
      : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    openGraph: {
      type,
      locale: "en_US",
      url: metaUrl,
      title: metaTitle,
      description,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: title || SITE_CONFIG.name,
        },
      ],
      ...(type === "article" && {
        publishedTime,
        modifiedTime,
        authors: [author],
        section,
        tags,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description,
      creator: `@${SITE_CONFIG.author.name.toLowerCase().replace(/\s+/g, "")}`,
      images: [metaImage],
    },
    alternates: {
      canonical: canonical || metaUrl,
    },
    other: {
      "theme-color": "#000000",
      "color-scheme": "dark light",
    },
  };

  return metadata;
}

export function generateBreadcrumbJsonLd(
  breadcrumbs: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${SITE_CONFIG.url}${crumb.url}`,
    })),
  };
}

export function generatePersonJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_CONFIG.author.name,
    url: SITE_CONFIG.url,
    email: SITE_CONFIG.author.email,
    jobTitle: "Full-Stack Developer",
    worksFor: {
      "@type": "Organization",
      name: "Freelance",
    },
    sameAs: [SITE_CONFIG.author.github, SITE_CONFIG.author.linkedin],
    knowsAbout: [
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "PostgreSQL",
      "Web Development",
      "Full-Stack Development",
    ],
  };
}

export function generateWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    author: {
      "@type": "Person",
      name: SITE_CONFIG.author.name,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_CONFIG.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateProjectJsonLd(project: {
  id: string;
  title: string;
  description: string;
  slug: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${SITE_CONFIG.url}/projects/${project.slug}`,
    name: project.title,
    description: project.description,
    url: `${SITE_CONFIG.url}/projects/${project.slug}`,
    author: {
      "@type": "Person",
      name: SITE_CONFIG.author.name,
      url: SITE_CONFIG.url,
    },
    dateCreated: project.createdAt.toISOString(),
    dateModified: project.updatedAt.toISOString(),
    keywords: project.technologies,
    ...(project.thumbnail && {
      image: project.thumbnail.startsWith("http")
        ? project.thumbnail
        : `${SITE_CONFIG.url}${project.thumbnail}`,
    }),
    ...(project.githubUrl && {
      codeRepository: project.githubUrl,
    }),
    ...(project.liveUrl && {
      workExample: project.liveUrl,
    }),
  };
}

export function generateBlogPostJsonLd(post: {
  id: string;
  title: string;
  excerpt?: string;
  content: string;
  slug: string;
  publishedAt?: Date;
  updatedAt: Date;
  readingTime: number;
  categories: Array<{ name: string; slug: string }>;
  tags: Array<{ name: string; slug: string }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${SITE_CONFIG.url}/blog/${post.slug}`,
    headline: post.title,
    description: post.excerpt || post.content.substring(0, 160),
    url: `${SITE_CONFIG.url}/blog/${post.slug}`,
    author: {
      "@type": "Person",
      name: SITE_CONFIG.author.name,
      url: SITE_CONFIG.url,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    datePublished:
      post.publishedAt?.toISOString() || post.updatedAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    articleSection: post.categories.map((cat) => cat.name),
    keywords: post.tags.map((tag) => tag.name),
    timeRequired: `PT${post.readingTime}M`,
    inLanguage: "en-US",
    isAccessibleForFree: true,
  };
}

export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    founder: {
      "@type": "Person",
      name: SITE_CONFIG.author.name,
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: SITE_CONFIG.author.email,
      contactType: "customer service",
    },
    sameAs: [SITE_CONFIG.author.github, SITE_CONFIG.author.linkedin],
  };
}
