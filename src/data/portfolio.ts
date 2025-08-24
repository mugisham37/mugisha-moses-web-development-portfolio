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
          "Exploring how to create bold, impactful user interfaces using React and modern CSS techniques while maintaining accessibility and performance.",
      },
      {
        id: "nextjs-conf-2024",
        title: "Scaling Next.js Applications to Handle Millions of Users",
        event: "Next.js Conference 2024",
        date: "2024-02-28",
        location: "Austin, TX",
        type: "conference" as const,
        audience: 2500,
        recording: "https://youtube.com/watch?v=nextjs-scaling",
        slides: "https://slides.com/nextjs-scaling",
        description:
          "Advanced strategies for scaling Next.js applications including server-side optimization, caching strategies, and performance monitoring.",
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
          "Deep dive into Next.js performance optimization techniques and real-world case studies showing 50%+ improvement in Core Web Vitals.",
      },
      {
        id: "web-dev-workshop-2024",
        title: "Full-Stack TypeScript Workshop: From Zero to Production",
        event: "Web Development Bootcamp",
        date: "2024-01-25",
        location: "Seattle, WA",
        type: "workshop" as const,
        audience: 80,
        slides: "https://slides.com/typescript-workshop",
        description:
          "Hands-on workshop covering full-stack TypeScript development with Next.js, Prisma, and deployment strategies.",
      },
      {
        id: "dev-podcast-2024",
        title:
          "The Future of Web Development: AI, Performance, and Developer Experience",
        event: "Developer Insights Podcast",
        date: "2024-01-10",
        location: "Remote",
        type: "podcast" as const,
        audience: 5000,
        recording: "https://podcast.com/episode/123",
        description:
          "Discussion about emerging trends in web development, AI integration, and the evolution of developer tools and workflows.",
      },
      {
        id: "tech-talk-2023",
        title: "Building Design Systems That Scale",
        event: "Tech Talk Series",
        date: "2023-12-15",
        location: "Remote",
        type: "meetup" as const,
        audience: 300,
        recording: "https://youtube.com/watch?v=design-systems",
        slides: "https://slides.com/design-systems",
        description:
          "Comprehensive guide to building and maintaining design systems that can scale across multiple teams and products.",
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
          "Comprehensive guide covering all aspects of Next.js performance optimization from basics to advanced techniques including Core Web Vitals improvement.",
      },
      {
        id: "typescript-enterprise-guide",
        title:
          "TypeScript in Enterprise Applications: Best Practices and Patterns",
        platform: "Smashing Magazine",
        date: "2024-01-20",
        url: "https://smashingmagazine.com/typescript-enterprise",
        type: "article" as const,
        readTime: 18,
        views: 42000,
        shares: 890,
        description:
          "Deep dive into TypeScript patterns and practices for large-scale enterprise applications with real-world examples.",
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
          "Real-world case study of implementing brutalist design principles in a production web application with performance considerations.",
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
          "Exploring advanced React patterns including compound components, render props, and custom hooks for building maintainable applications.",
      },
      {
        id: "web-performance-whitepaper",
        title: "Web Performance Optimization: A Technical Whitepaper",
        platform: "GitHub",
        date: "2023-11-15",
        url: "https://github.com/example/web-performance-whitepaper",
        type: "whitepaper" as const,
        readTime: 25,
        views: 15000,
        shares: 280,
        description:
          "Technical whitepaper covering comprehensive web performance optimization strategies with benchmarks and case studies.",
      },
      {
        id: "design-systems-tutorial",
        title: "Building Design Systems with React and Storybook",
        platform: "LogRocket Blog",
        date: "2023-10-20",
        url: "https://blog.logrocket.com/design-systems-react-storybook",
        type: "tutorial" as const,
        readTime: 14,
        views: 28000,
        shares: 520,
        description:
          "Step-by-step tutorial for creating scalable design systems using React, Storybook, and modern tooling.",
      },
    ],
  },
  results: {
    comparisons: [
      {
        title: "E-commerce Platform Optimization",
        client: "TechCorp Enterprise",
        before: [
          { metric: "Page Load Time", value: "4.2s", icon: "⏱️" },
          { metric: "Conversion Rate", value: "2.1%", icon: "📈" },
          { metric: "Monthly Revenue", value: "$45K", icon: "💰" },
          { metric: "User Satisfaction", value: "3.2/5", icon: "⭐" },
        ],
        after: [
          { metric: "Page Load Time", value: "1.1s", icon: "⚡" },
          { metric: "Conversion Rate", value: "5.8%", icon: "🚀" },
          { metric: "Monthly Revenue", value: "$127K", icon: "💎" },
          { metric: "User Satisfaction", value: "4.9/5", icon: "🌟" },
        ],
        impact: {
          highlight: "Revenue Increase",
          value: "+182%",
        },
      },
      {
        title: "SaaS Application Modernization",
        client: "GrowthCo",
        before: [
          { metric: "System Uptime", value: "94.2%", icon: "⚠️" },
          { metric: "Response Time", value: "850ms", icon: "🐌" },
          { metric: "User Retention", value: "67%", icon: "📉" },
          { metric: "Support Tickets", value: "340/mo", icon: "🎫" },
        ],
        after: [
          { metric: "System Uptime", value: "99.9%", icon: "✅" },
          { metric: "Response Time", value: "120ms", icon: "⚡" },
          { metric: "User Retention", value: "94%", icon: "📊" },
          { metric: "Support Tickets", value: "45/mo", icon: "🎯" },
        ],
        impact: {
          highlight: "Performance Boost",
          value: "+607%",
        },
      },
    ],
    revenue: {
      generated: 2500000,
      saved: 850000,
      improvement: 340,
    },
    achievements: [
      {
        year: 2020,
        title: "First Enterprise Client",
        description:
          "Landed first major enterprise contract, delivering a full-stack platform modernization project.",
        icon: "🏢",
        current: false,
      },
      {
        year: 2021,
        title: "Performance Optimization Breakthrough",
        description:
          "Achieved 400% performance improvement for a high-traffic e-commerce platform.",
        icon: "⚡",
        current: false,
      },
      {
        year: 2022,
        title: "$1M Revenue Milestone",
        description:
          "Generated over $1M in direct revenue for clients through optimization and development projects.",
        icon: "💰",
        current: false,
      },
      {
        year: 2023,
        title: "Next.js Performance Toolkit",
        description:
          "Released performance toolkit that became featured in Next.js official documentation.",
        icon: "🛠️",
        current: false,
      },
      {
        year: 2024,
        title: "Current: Innovation Focus",
        description:
          "Leading cutting-edge projects in AI integration, performance optimization, and brutalist design systems.",
        icon: "🚀",
        current: true,
      },
    ],
  },
};
