/**
 * SEO Components Barrel Export
 * Centralized exports for all SEO-related components and utilities
 */

export {
  StructuredData,
  HomepageStructuredData,
  ArticleStructuredData,
  PersonStructuredData,
  OrganizationStructuredData,
} from "./StructuredData";
export {
  MetaTags,
  HomepageMetaTags,
  ProjectMetaTags,
  ContactMetaTags,
} from "./MetaTags";
export { SEOProvider, useSEO, usePageSEO, SEOUpdater } from "./SEOProvider";

// Re-export utilities
export {
  generateMetadata,
  generateStructuredData,
  generateBreadcrumbData,
  generateFAQData,
  generatePortfolioWorkData,
  generateServiceData,
  generateHomepageStructuredData,
  generateSocialMetaTags,
  validateSEOData,
  generateCanonicalUrl,
  generateHreflangTags,
  type SEOConfig,
} from "@/utils/seo-helpers";
