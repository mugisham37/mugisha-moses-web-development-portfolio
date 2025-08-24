/**
 * Meta Tags Component
 * Renders additional meta tags for SEO optimization
 */

import {
  generateSocialMetaTags,
  generateCanonicalUrl,
} from "@/utils/seo-helpers";
import { portfolioData } from "@/data/portfolio";

interface MetaTagsProps {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  twitterImage?: string;
  noIndex?: boolean;
  additionalTags?: Record<string, string>;
}

export function MetaTags({
  title,
  description,
  keywords = [],
  canonicalUrl,
  ogImage,
  twitterImage,
  noIndex = false,
  additionalTags = {},
}: MetaTagsProps) {
  const socialTags = generateSocialMetaTags({
    title,
    description,
    keywords,
    canonicalUrl,
    ogImage,
    twitterImage,
    noIndex,
  });

  const allTags = {
    ...socialTags,
    ...additionalTags,
  };

  return (
    <>
      {/* Canonical URL */}
      {canonicalUrl && (
        <link rel="canonical" href={generateCanonicalUrl(canonicalUrl)} />
      )}

      {/* Keywords */}
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(", ")} />
      )}

      {/* Robots */}
      <meta
        name="robots"
        content={noIndex ? "noindex, nofollow" : "index, follow"}
      />
      <meta
        name="googlebot"
        content={
          noIndex
            ? "noindex, nofollow"
            : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        }
      />

      {/* Author and Publisher */}
      <meta name="author" content={portfolioData.personal.name} />
      <meta name="publisher" content={portfolioData.personal.name} />
      <meta name="creator" content={portfolioData.personal.name} />

      {/* Language and Locale */}
      <meta name="language" content="en-US" />
      <meta httpEquiv="content-language" content="en-US" />

      {/* Viewport and Mobile */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta
        name="format-detection"
        content="telephone=no, email=no, address=no"
      />

      {/* Apple Touch Icons and PWA */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />
      <meta
        name="apple-mobile-web-app-title"
        content={portfolioData.personal.name}
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/manifest.json" />

      {/* Theme Colors */}
      <meta name="theme-color" content="#000000" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="msapplication-config" content="/browserconfig.xml" />

      {/* Security Headers */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      <meta name="referrer" content="strict-origin-when-cross-origin" />

      {/* Performance Hints */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link
        rel="preconnect"
        href="https://fonts.googleapis.com"
        crossOrigin="anonymous"
      />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />

      {/* Social Media and Open Graph Tags */}
      {Object.entries(allTags).map(([property, content]) => {
        if (property.startsWith("og:")) {
          return <meta key={property} property={property} content={content} />;
        } else if (property.startsWith("twitter:")) {
          return <meta key={property} name={property} content={content} />;
        } else {
          return <meta key={property} name={property} content={content} />;
        }
      })}

      {/* Rich Snippets Support */}
      <meta
        name="application-name"
        content={portfolioData.personal.name + " - Portfolio"}
      />
      <meta name="msapplication-tooltip" content={description} />
      <meta name="msapplication-starturl" content="/" />
      <meta name="msapplication-navbutton-color" content="#000000" />

      {/* Verification Tags (to be filled with actual verification codes) */}
      {/* <meta name="google-site-verification" content="your-google-verification-code" /> */}
      {/* <meta name="bing-site-verification" content="your-bing-verification-code" /> */}
      {/* <meta name="yandex-verification" content="your-yandex-verification-code" /> */}
    </>
  );
}

/**
 * Homepage Meta Tags
 * Optimized meta tags for the main portfolio page
 */
export function HomepageMetaTags() {
  return (
    <MetaTags
      title={`${portfolioData.personal.name} - ${portfolioData.personal.title}`}
      description={portfolioData.personal.bio}
      keywords={[
        portfolioData.personal.name,
        portfolioData.personal.title,
        ...portfolioData.skills.technical.map((skill) => skill.name),
        "portfolio",
        "web development",
        "brutalist design",
        "Next.js",
        "React",
        "TypeScript",
      ]}
      canonicalUrl="/"
      ogImage="/images/og-homepage.jpg"
      twitterImage="/images/twitter-homepage.jpg"
    />
  );
}

/**
 * Project Meta Tags
 * For individual project pages
 */
export function ProjectMetaTags({
  projectName,
  description,
  technologies,
  slug,
}: {
  projectName: string;
  description: string;
  technologies: string[];
  slug: string;
}) {
  return (
    <MetaTags
      title={`${projectName} - ${portfolioData.personal.name}`}
      description={description}
      keywords={[
        projectName,
        portfolioData.personal.name,
        ...technologies,
        "project",
        "case study",
      ]}
      canonicalUrl={`/projects/${slug}`}
      ogImage={`/images/projects/${slug}-og.jpg`}
      twitterImage={`/images/projects/${slug}-twitter.jpg`}
    />
  );
}

/**
 * Contact Meta Tags
 * For contact and about pages
 */
export function ContactMetaTags() {
  return (
    <MetaTags
      title={`Contact ${portfolioData.personal.name} - Get In Touch`}
      description={`Get in touch with ${portfolioData.personal.name} for web development projects, consulting, or collaboration opportunities.`}
      keywords={[
        "contact",
        portfolioData.personal.name,
        "hire",
        "consultation",
        "web development services",
        "freelance developer",
      ]}
      canonicalUrl="/contact"
      ogImage="/images/og-contact.jpg"
      twitterImage="/images/twitter-contact.jpg"
    />
  );
}
