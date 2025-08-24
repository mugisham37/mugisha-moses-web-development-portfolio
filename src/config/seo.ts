/**
 * SEO Configuration
 * Centralized SEO settings and configurations
 */

import { portfolioData } from "@/data/portfolio";

export const seoConfig = {
  // Base configuration
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "https://your-domain.com",
  siteName: `${portfolioData.personal.name} - Portfolio`,
  defaultTitle: `${portfolioData.personal.name} - ${portfolioData.personal.title}`,
  defaultDescription: portfolioData.personal.bio,

  // Social media handles
  social: {
    twitter: portfolioData.social.twitter?.replace("@", "") || "",
    linkedin: portfolioData.social.linkedin || "",
    github: portfolioData.social.github || "",
  },

  // Default images
  images: {
    ogImage: "/images/og-homepage.jpg",
    twitterImage: "/images/twitter-homepage.jpg",
    favicon: "/favicon.ico",
    appleTouchIcon: "/apple-touch-icon.png",
    logo: "/images/logo.png",
  },

  // Analytics
  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID || "",
    googleTagManagerId: process.env.NEXT_PUBLIC_GTM_ID || "",
    microsoftClarityId: process.env.NEXT_PUBLIC_CLARITY_ID || "",
  },

  // Search Console verification
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || "",
    bing: process.env.NEXT_PUBLIC_BING_VERIFICATION || "",
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || "",
  },

  // Default keywords
  keywords: [
    portfolioData.personal.name,
    portfolioData.personal.title,
    ...portfolioData.skills.technical.map((skill) => skill.name),
    "portfolio",
    "web development",
    "brutalist design",
    "Next.js",
    "React",
    "TypeScript",
    "performance optimization",
    "full-stack developer",
    "system architecture",
  ],

  // Page-specific SEO configurations
  pages: {
    home: {
      title: `${portfolioData.personal.name} - ${portfolioData.personal.title}`,
      description: portfolioData.personal.bio,
      keywords: [
        portfolioData.personal.name,
        portfolioData.personal.title,
        "portfolio",
        "web developer",
        "brutalist design",
      ],
    },
    about: {
      title: `About ${portfolioData.personal.name} - Professional Background`,
      description: `Learn more about ${portfolioData.personal.name}, a ${portfolioData.personal.title} with expertise in modern web development and performance optimization.`,
      keywords: [
        "about",
        portfolioData.personal.name,
        "background",
        "experience",
        "skills",
      ],
    },
    projects: {
      title: `Projects by ${portfolioData.personal.name} - Portfolio Showcase`,
      description: `Explore the portfolio of ${portfolioData.personal.name}, featuring high-performance web applications and innovative solutions.`,
      keywords: [
        "projects",
        "portfolio",
        "web applications",
        "case studies",
        portfolioData.personal.name,
      ],
    },
    contact: {
      title: `Contact ${portfolioData.personal.name} - Get In Touch`,
      description: `Get in touch with ${portfolioData.personal.name} for web development projects, consulting, or collaboration opportunities.`,
      keywords: [
        "contact",
        "hire",
        "consultation",
        "web development services",
        portfolioData.personal.name,
      ],
    },
    services: {
      title: `Services by ${portfolioData.personal.name} - Web Development & Consulting`,
      description: `Professional web development services including full-stack development, performance optimization, and system architecture consulting.`,
      keywords: [
        "services",
        "web development",
        "consulting",
        "performance optimization",
        "full-stack development",
      ],
    },
    blog: {
      title: `Blog by ${portfolioData.personal.name} - Web Development Insights`,
      description: `Technical articles and insights about web development, performance optimization, and modern JavaScript frameworks.`,
      keywords: [
        "blog",
        "articles",
        "web development",
        "tutorials",
        "technical writing",
      ],
    },
  },

  // Structured data templates
  structuredData: {
    organization: {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: portfolioData.personal.name,
      description: portfolioData.personal.bio,
      founder: {
        "@type": "Person",
        name: portfolioData.personal.name,
      },
      areaServed: "Worldwide",
      serviceType: "Web Development",
    },
    person: {
      "@context": "https://schema.org",
      "@type": "Person",
      name: portfolioData.personal.name,
      jobTitle: portfolioData.personal.title,
      description: portfolioData.personal.bio,
      knowsAbout: portfolioData.skills.technical.map((skill) => skill.name),
    },
  },

  // Robots.txt configuration
  robots: {
    allow: ["/"],
    disallow: [
      "/api/",
      "/admin/",
      "/private/",
      "/_next/",
      "/test-*",
      "/*.json$",
      "/sitemap*.xml",
    ],
    blockedUserAgents: [
      "GPTBot",
      "ChatGPT-User",
      "CCBot",
      "anthropic-ai",
      "Claude-Web",
    ],
  },

  // Sitemap configuration
  sitemap: {
    changeFrequency: {
      homepage: "weekly" as const,
      about: "monthly" as const,
      projects: "weekly" as const,
      contact: "monthly" as const,
      services: "monthly" as const,
      blog: "weekly" as const,
      legal: "yearly" as const,
    },
    priority: {
      homepage: 1.0,
      projects: 0.9,
      about: 0.8,
      services: 0.8,
      contact: 0.7,
      blog: 0.6,
      legal: 0.3,
    },
  },
};

export default seoConfig;
