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
        profileImage: "/images/testimonials/sarah-johnson.svg",
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
        profileImage: "/images/testimonials/david-chen.svg",
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
    speakingEvents: [
      {
        id: "react-conf-2024",
        title: "Building Brutalist UIs with Modern React",
        event: "React Conference 2024",
        date: "2024-03-15",
        location: "San Francisco, CA",
        type: "conference" as const,
        audience: 1200,
        recording: "https://youtube.com/watch?v=example",
        slides: "https://slides.com/example",
        description:
          "Exploring how to create bold, impactful user interfaces using React and modern CSS techniques.",
      },
      {
        id: "js-meetup-2024",
        title: "Performance Optimization in Next.js Applications",
        event: "JavaScript Meetup NYC",
        date: "2024-02-20",
        location: "New York, NY",
        type: "meetup" as const,
        audience: 150,
        slides: "https://slides.com/example2",
        description:
          "Deep dive into Next.js performance optimization techniques and real-world case studies.",
      },
      {
        id: "dev-podcast-2024",
        title: "The Future of Web Development",
        event: "Developer Insights Podcast",
        date: "2024-01-10",
        location: "Remote",
        type: "podcast" as const,
        audience: 5000,
        recording: "https://podcast.com/episode/123",
        description:
          "Discussion about emerging trends in web development and the evolution of developer tools.",
      },
    ],
    publications: [
      {
        id: "nextjs-performance-guide",
        title: "The Complete Guide to Next.js Performance Optimization",
        platform: "Dev.to",
        date: "2024-02-01",
        url: "https://dev.to/example/nextjs-performance",
        type: "tutorial" as const,
        readTime: 12,
        views: 25000,
        shares: 450,
        description:
          "Comprehensive guide covering all aspects of Next.js performance optimization from basics to advanced techniques.",
      },
      {
        id: "brutalist-design-case-study",
        title: "Case Study: Implementing Brutalist Design in Modern Web Apps",
        platform: "Medium",
        date: "2024-01-15",
        url: "https://medium.com/example/brutalist-design",
        type: "case-study" as const,
        readTime: 8,
        views: 18000,
        shares: 320,
        description:
          "Real-world case study of implementing brutalist design principles in a production web application.",
      },
      {
        id: "react-patterns-article",
        title: "Advanced React Patterns for Scalable Applications",
        platform: "CSS-Tricks",
        date: "2023-12-10",
        url: "https://css-tricks.com/example/react-patterns",
        type: "article" as const,
        readTime: 15,
        views: 32000,
        shares: 680,
        description:
          "Exploring advanced React patterns including compound components, render props, and custom hooks.",
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
