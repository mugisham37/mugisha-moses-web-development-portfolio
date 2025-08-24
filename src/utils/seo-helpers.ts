/**
 * SEO Helper Utilities
 * Provides utilities for dynamic metadata generation, structured data, and SEO optimization
 */

import { Metadata } from "next";
import { portfolioData } from "@/data/portfolio";

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl?: string;
  ogImage?: string;
  twitterImage?: string;
  structuredData?: Record<string, any>;
  noIndex?: boolean;
}

/**
 * Generate dynamic metadata for pages
 */
export function generateMetadata(config: SEOConfig): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://your-domain.com";
  const canonicalUrl = config.canonicalUrl
    ? `${baseUrl}${config.canonicalUrl}`
    : baseUrl;

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    authors: [{ name: portfolioData.personal.name }],
    creator: portfolioData.personal.name,
    publisher: portfolioData.personal.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: config.canonicalUrl || "/",
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: canonicalUrl,
      title: config.title,
      description: config.description,
      siteName: portfolioData.personal.name + " - Portfolio",
      images: [
        {
          url: config.ogImage || "/images/og-image.jpg",
          width: 1200,
          height: 630,
          alt: config.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: config.title,
      description: config.description,
      creator: portfolioData.social.twitter,
      images: [
        config.twitterImage || config.ogImage || "/images/twitter-card.jpg",
      ],
    },
    robots: {
      index: !config.noIndex,
      follow: !config.noIndex,
      googleBot: {
        index: !config.noIndex,
        follow: !config.noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    other: {
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "black-translucent",
      "apple-mobile-web-app-title": portfolioData.personal.name,
      "theme-color": "#000000",
      "msapplication-TileColor": "#000000",
    },
  };
}

/**
 * Generate structured data for different page types
 */
export function generateStructuredData(
  type: "person" | "website" | "article" | "organization",
  data?: any
) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://your-domain.com";

  switch (type) {
    case "person":
      return {
        "@context": "https://schema.org",
        "@type": "Person",
        name: portfolioData.personal.name,
        jobTitle: portfolioData.personal.title,
        description: portfolioData.personal.bio,
        url: baseUrl,
        image: `${baseUrl}/images/profile-photo.jpg`,
        sameAs: [
          portfolioData.social.linkedin,
          portfolioData.social.github,
          portfolioData.social.twitter,
        ].filter(Boolean),
        knowsAbout: portfolioData.skills.technical.map((skill) => skill.name),
        alumniOf:
          portfolioData.experience.education?.map((edu) => ({
            "@type": "EducationalOrganization",
            name: edu.institution,
          })) || [],
        worksFor: portfolioData.experience.current?.company
          ? {
              "@type": "Organization",
              name: portfolioData.experience.current.company,
            }
          : undefined,
      };

    case "website":
      return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: portfolioData.personal.name + " - Portfolio",
        description: portfolioData.personal.bio,
        url: baseUrl,
        author: {
          "@type": "Person",
          name: portfolioData.personal.name,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${baseUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      };

    case "organization":
      return {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: portfolioData.personal.name,
        description: portfolioData.personal.bio,
        url: baseUrl,
        logo: `${baseUrl}/images/logo.png`,
        image: `${baseUrl}/images/profile-photo.jpg`,
        founder: {
          "@type": "Person",
          name: portfolioData.personal.name,
        },
        areaServed: "Worldwide",
        serviceType: "Web Development",
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          addressCountry: portfolioData.personal.location?.country || "US",
          addressLocality: portfolioData.personal.location?.city,
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: portfolioData.contact.phone,
          contactType: "customer service",
          email: portfolioData.contact.email,
        },
      };

    case "article":
      return {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: data?.title || portfolioData.personal.name + " - Portfolio",
        description: data?.description || portfolioData.personal.bio,
        author: {
          "@type": "Person",
          name: portfolioData.personal.name,
        },
        publisher: {
          "@type": "Organization",
          name: portfolioData.personal.name,
          logo: {
            "@type": "ImageObject",
            url: `${baseUrl}/images/logo.png`,
          },
        },
        datePublished: data?.publishedDate || new Date().toISOString(),
        dateModified: data?.modifiedDate || new Date().toISOString(),
        image: data?.image || `${baseUrl}/images/og-image.jpg`,
        url: data?.url || baseUrl,
      };

    default:
      return null;
  }
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbData(
  breadcrumbs: Array<{ name: string; url: string }>
) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://your-domain.com";

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${baseUrl}${crumb.url}`,
    })),
  };
}

/**
 * Generate FAQ structured data
 */
export function generateFAQData(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate portfolio work structured data
 */
export function generatePortfolioWorkData() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://your-domain.com";

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: portfolioData.personal.name + " - Portfolio",
    description: "Professional portfolio showcasing web development expertise",
    author: {
      "@type": "Person",
      name: portfolioData.personal.name,
    },
    url: baseUrl,
    image: `${baseUrl}/images/portfolio-showcase.jpg`,
    dateCreated: portfolioData.portfolio.launchDate || new Date().toISOString(),
    genre: "Web Development Portfolio",
    inLanguage: "en-US",
    isAccessibleForFree: true,
    keywords: portfolioData.skills.technical
      .map((skill) => skill.name)
      .join(", "),
  };
}

/**
 * Generate service structured data
 */
export function generateServiceData() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://your-domain.com";

  return (
    portfolioData.services?.map((service) => ({
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.name,
      description: service.description,
      provider: {
        "@type": "Person",
        name: portfolioData.personal.name,
      },
      areaServed: "Worldwide",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: service.name,
        itemListElement:
          service.features?.map((feature, index) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: feature,
            },
          })) || [],
      },
    })) || []
  );
}

/**
 * Combine all structured data for the homepage
 */
export function generateHomepageStructuredData() {
  return [
    generateStructuredData("person"),
    generateStructuredData("website"),
    generateStructuredData("organization"),
    generatePortfolioWorkData(),
    ...generateServiceData(),
  ].filter(Boolean);
}

/**
 * Generate meta tags for social sharing
 */
export function generateSocialMetaTags(config: SEOConfig) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://your-domain.com";

  return {
    // Open Graph
    "og:type": "website",
    "og:title": config.title,
    "og:description": config.description,
    "og:image": config.ogImage || `${baseUrl}/images/og-image.jpg`,
    "og:url": config.canonicalUrl
      ? `${baseUrl}${config.canonicalUrl}`
      : baseUrl,
    "og:site_name": portfolioData.personal.name + " - Portfolio",
    "og:locale": "en_US",

    // Twitter Card
    "twitter:card": "summary_large_image",
    "twitter:title": config.title,
    "twitter:description": config.description,
    "twitter:image":
      config.twitterImage ||
      config.ogImage ||
      `${baseUrl}/images/twitter-card.jpg`,
    "twitter:creator": portfolioData.social.twitter,
    "twitter:site": portfolioData.social.twitter,

    // Additional meta tags
    "theme-color": "#000000",
    "msapplication-TileColor": "#000000",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": portfolioData.personal.name,
  };
}

/**
 * Validate and sanitize SEO data
 */
export function validateSEOData(config: SEOConfig): SEOConfig {
  return {
    ...config,
    title:
      config.title.length > 60
        ? config.title.substring(0, 57) + "..."
        : config.title,
    description:
      config.description.length > 160
        ? config.description.substring(0, 157) + "..."
        : config.description,
    keywords: config.keywords.slice(0, 10), // Limit to 10 keywords
  };
}

/**
 * Generate canonical URL
 */
export function generateCanonicalUrl(path: string = "/"): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://your-domain.com";
  return `${baseUrl}${path}`;
}

/**
 * Generate hreflang tags for internationalization (future use)
 */
export function generateHreflangTags(currentLocale: string = "en") {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://your-domain.com";

  // For now, just return English
  return {
    en: baseUrl,
    "x-default": baseUrl,
  };
}
