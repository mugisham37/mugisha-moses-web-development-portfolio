import { PortfolioData } from "../types/portfolio";

export const portfolioData: PortfolioData = {
  hero: {
    headlines: [
      "BRUTAL DEVELOPER",
      "SYSTEM ARCHITECT",
      "PERFORMANCE ENGINEER",
      "DIGITAL CRAFTSMAN",
    ],
    subtitles: [
      "Building systems that scale beyond expectations",
      "Crafting experiences that convert visitors to customers",
      "Engineering solutions that generate measurable ROI",
      "Architecting platforms that handle millions of users",
    ],
    metrics: [
      {
        value: 150,
        label: "Projects Delivered",
        format: "number",
      },
      {
        value: 2.5,
        label: "Million Revenue Generated",
        format: "currency",
      },
      {
        value: 99.9,
        label: "Uptime Achieved",
        format: "percentage",
      },
      {
        value: 50,
        label: "Performance Improvement",
        format: "percentage",
      },
    ],
    valueProposition:
      "I don't just write code—I engineer solutions that transform businesses, optimize performance, and deliver measurable results that directly impact your bottom line.",
    ctaButtons: [
      {
        text: "START PROJECT",
        variant: "primary",
        action: "contact",
      },
      {
        text: "VIEW PORTFOLIO",
        variant: "secondary",
        action: "scroll-to-projects",
      },
    ],
  },
  socialProof: {
    clients: [
      {
        name: "TechCorp Enterprise",
        logo: "/images/clients/techcorp.svg",
        tier: "enterprise" as const,
        project: {
          description: "Full-stack platform modernization",
          value: "$2.5M",
          duration: "18 months",
        },
      },
      {
        name: "StartupX",
        logo: "/images/clients/startupx.svg",
        tier: "startup" as const,
        project: {
          description: "MVP development and scaling",
          value: "$150K",
          duration: "6 months",
        },
      },
      {
        name: "GrowthCo",
        logo: "/images/clients/growthco.svg",
        tier: "growth" as const,
        project: {
          description: "Performance optimization and infrastructure",
          value: "$500K",
          duration: "12 months",
        },
      },
    ],
    recommendations: [
      {
        id: "rec-1",
        name: "Sarah Johnson",
        title: "CTO",
        company: "TechCorp Enterprise",
        content:
          "Moses delivered exceptional results on our platform modernization. His technical expertise and attention to detail transformed our legacy system into a scalable, high-performance solution.",
        profileImage: "/images/testimonials/sarah-johnson.jpg",
        linkedinUrl: "https://linkedin.com/in/sarah-johnson",
        mutualConnections: 47,
        date: "2024-01-15",
      },
      {
        id: "rec-2",
        name: "David Chen",
        title: "Founder & CEO",
        company: "StartupX",
        content:
          "Working with Moses was a game-changer for our startup. He built our MVP from scratch and helped us scale to handle millions of users. Highly recommended!",
        profileImage: "/images/testimonials/david-chen.jpg",
        linkedinUrl: "https://linkedin.com/in/david-chen",
        mutualConnections: 23,
        date: "2024-02-20",
      },
    ],
    contributions: [
      {
        name: "NextJS Performance Toolkit",
        role: "Core Maintainer",
        stats: {
          stars: 2847,
          forks: 342,
          downloads: 125000,
        },
        impact: "Improved performance for 10,000+ applications",
        recognition: "Featured in Next.js official documentation",
      },
      {
        name: "React Brutalist UI",
        role: "Creator",
        stats: {
          stars: 1523,
          forks: 189,
          downloads: 45000,
        },
        impact: "Adopted by 500+ design systems",
        recognition: "Trending on GitHub for 2 weeks",
      },
    ],
  },
  results: {
    comparisons: [],
    revenue: {
      generated: 0,
      saved: 0,
      improvement: 0,
    },
    achievements: [],
  },
};
