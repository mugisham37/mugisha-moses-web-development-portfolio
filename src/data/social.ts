export interface SocialPlatform {
  id: string;
  name: string;
  handle: string;
  url: string;
  icon: string;
  color: string;
  followers: number;
  engagement: {
    likes: number;
    shares: number;
    comments: number;
  };
  recentActivity: Array<{
    id: string;
    type: "post" | "article" | "video" | "project";
    title: string;
    description: string;
    date: string;
    url: string;
    metrics: {
      views?: number;
      likes?: number;
      shares?: number;
      comments?: number;
    };
  }>;
  stats: {
    totalPosts: number;
    totalViews: number;
    avgEngagement: number;
  };
}

export const socialPlatforms: SocialPlatform[] = [
  {
    id: "github",
    name: "GitHub",
    handle: "@moses-developer",
    url: "https://github.com/moses-developer",
    icon: "🐙",
    color: "#333333",
    followers: 2847,
    engagement: {
      likes: 15420,
      shares: 892,
      comments: 1240,
    },
    recentActivity: [
      {
        id: "gh-1",
        type: "project",
        title: "NextJS Performance Toolkit v2.0",
        description:
          "Major update with new performance monitoring features and React 18 support",
        date: "2024-02-15",
        url: "https://github.com/moses-developer/nextjs-performance-toolkit",
        metrics: {
          views: 8420,
          likes: 342,
          shares: 89,
        },
      },
      {
        id: "gh-2",
        type: "project",
        title: "React Brutalist UI Components",
        description:
          "New component library with 50+ brutalist-styled React components",
        date: "2024-02-10",
        url: "https://github.com/moses-developer/react-brutalist-ui",
        metrics: {
          views: 5680,
          likes: 234,
          shares: 67,
        },
      },
      {
        id: "gh-3",
        type: "post",
        title: "TypeScript Performance Optimization Tips",
        description:
          "Gist with advanced TypeScript optimization techniques for large codebases",
        date: "2024-02-05",
        url: "https://gist.github.com/moses-developer/typescript-optimization",
        metrics: {
          views: 3240,
          likes: 156,
          shares: 43,
        },
      },
    ],
    stats: {
      totalPosts: 127,
      totalViews: 450000,
      avgEngagement: 8.4,
    },
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    handle: "@moses-developer",
    url: "https://linkedin.com/in/moses-developer",
    icon: "💼",
    color: "#0077B5",
    followers: 12500,
    engagement: {
      likes: 28400,
      shares: 1850,
      comments: 3200,
    },
    recentActivity: [
      {
        id: "li-1",
        type: "article",
        title: "The Future of Web Performance: Core Web Vitals 2024",
        description:
          "Deep dive into upcoming changes to Core Web Vitals and how to prepare your applications",
        date: "2024-02-18",
        url: "https://linkedin.com/pulse/future-web-performance-core-web-vitals-2024-moses-developer",
        metrics: {
          views: 15600,
          likes: 892,
          shares: 234,
          comments: 156,
        },
      },
      {
        id: "li-2",
        type: "post",
        title: "Just shipped a major performance optimization",
        description:
          "Reduced load time by 73% for a client's e-commerce platform. Here's how...",
        date: "2024-02-12",
        url: "https://linkedin.com/posts/moses-developer/performance-optimization",
        metrics: {
          views: 8900,
          likes: 445,
          shares: 89,
          comments: 67,
        },
      },
      {
        id: "li-3",
        type: "article",
        title: "Building Scalable Design Systems with React",
        description:
          "Lessons learned from building design systems for enterprise applications",
        date: "2024-02-08",
        url: "https://linkedin.com/pulse/building-scalable-design-systems-react-moses-developer",
        metrics: {
          views: 12300,
          likes: 678,
          shares: 145,
          comments: 89,
        },
      },
    ],
    stats: {
      totalPosts: 89,
      totalViews: 680000,
      avgEngagement: 12.7,
    },
  },
  {
    id: "twitter",
    name: "Twitter/X",
    handle: "@moses_dev",
    url: "https://twitter.com/moses_dev",
    icon: "🐦",
    color: "#1DA1F2",
    followers: 8900,
    engagement: {
      likes: 45600,
      shares: 3400,
      comments: 2100,
    },
    recentActivity: [
      {
        id: "tw-1",
        type: "post",
        title: "Thread: Next.js 14 Performance Tips",
        description:
          "10-tweet thread covering advanced Next.js 14 performance optimization techniques",
        date: "2024-02-20",
        url: "https://twitter.com/moses_dev/status/1234567890",
        metrics: {
          views: 25600,
          likes: 1240,
          shares: 340,
          comments: 89,
        },
      },
      {
        id: "tw-2",
        type: "post",
        title: "Live coding session announcement",
        description:
          "Building a brutalist portfolio with Next.js 14 - tomorrow 2PM EST",
        date: "2024-02-16",
        url: "https://twitter.com/moses_dev/status/1234567891",
        metrics: {
          views: 12400,
          likes: 567,
          shares: 123,
          comments: 45,
        },
      },
      {
        id: "tw-3",
        type: "post",
        title: "TypeScript tip of the day",
        description: "Using conditional types to create better API interfaces",
        date: "2024-02-14",
        url: "https://twitter.com/moses_dev/status/1234567892",
        metrics: {
          views: 8900,
          likes: 423,
          shares: 89,
          comments: 34,
        },
      },
    ],
    stats: {
      totalPosts: 456,
      totalViews: 890000,
      avgEngagement: 15.2,
    },
  },
  {
    id: "youtube",
    name: "YouTube",
    handle: "@MosesDeveloper",
    url: "https://youtube.com/@MosesDeveloper",
    icon: "📺",
    color: "#FF0000",
    followers: 15600,
    engagement: {
      likes: 34500,
      shares: 2100,
      comments: 4800,
    },
    recentActivity: [
      {
        id: "yt-1",
        type: "video",
        title: "Building a Brutalist Portfolio with Next.js 14",
        description:
          "Complete tutorial series covering design, development, and deployment",
        date: "2024-02-22",
        url: "https://youtube.com/watch?v=brutalist-portfolio",
        metrics: {
          views: 45600,
          likes: 2340,
          shares: 456,
          comments: 234,
        },
      },
      {
        id: "yt-2",
        type: "video",
        title: "React Performance Optimization Masterclass",
        description:
          "Advanced techniques for optimizing React applications for production",
        date: "2024-02-15",
        url: "https://youtube.com/watch?v=react-performance",
        metrics: {
          views: 32100,
          likes: 1890,
          shares: 234,
          comments: 156,
        },
      },
      {
        id: "yt-3",
        type: "video",
        title: "TypeScript Advanced Patterns Deep Dive",
        description:
          "Exploring advanced TypeScript patterns for enterprise applications",
        date: "2024-02-08",
        url: "https://youtube.com/watch?v=typescript-patterns",
        metrics: {
          views: 28900,
          likes: 1560,
          shares: 189,
          comments: 123,
        },
      },
    ],
    stats: {
      totalPosts: 67,
      totalViews: 1200000,
      avgEngagement: 18.9,
    },
  },
  {
    id: "dev-to",
    name: "Dev.to",
    handle: "@moses_developer",
    url: "https://dev.to/moses_developer",
    icon: "👨‍💻",
    color: "#0A0A0A",
    followers: 5600,
    engagement: {
      likes: 18900,
      shares: 890,
      comments: 1200,
    },
    recentActivity: [
      {
        id: "dev-1",
        type: "article",
        title: "The Complete Guide to Next.js Performance Optimization",
        description:
          "Comprehensive guide covering all aspects of Next.js performance optimization",
        date: "2024-02-01",
        url: "https://dev.to/moses_developer/nextjs-performance-guide",
        metrics: {
          views: 25000,
          likes: 1240,
          shares: 234,
          comments: 89,
        },
      },
      {
        id: "dev-2",
        type: "article",
        title: "Building Accessible Brutalist UIs",
        description:
          "How to create bold, impactful designs while maintaining accessibility",
        date: "2024-01-25",
        url: "https://dev.to/moses_developer/accessible-brutalist-ui",
        metrics: {
          views: 18600,
          likes: 890,
          shares: 156,
          comments: 67,
        },
      },
      {
        id: "dev-3",
        type: "article",
        title: "TypeScript Utility Types You Should Know",
        description: "Advanced TypeScript utility types for better type safety",
        date: "2024-01-20",
        url: "https://dev.to/moses_developer/typescript-utility-types",
        metrics: {
          views: 14200,
          likes: 678,
          shares: 123,
          comments: 45,
        },
      },
    ],
    stats: {
      totalPosts: 34,
      totalViews: 320000,
      avgEngagement: 11.3,
    },
  },
  {
    id: "medium",
    name: "Medium",
    handle: "@moses.developer",
    url: "https://medium.com/@moses.developer",
    icon: "📝",
    color: "#00AB6C",
    followers: 4200,
    engagement: {
      likes: 12600,
      shares: 560,
      comments: 890,
    },
    recentActivity: [
      {
        id: "med-1",
        type: "article",
        title: "Case Study: Implementing Brutalist Design in Modern Web Apps",
        description:
          "Real-world case study of implementing brutalist design principles",
        date: "2024-01-15",
        url: "https://medium.com/@moses.developer/brutalist-design-case-study",
        metrics: {
          views: 18000,
          likes: 890,
          shares: 145,
          comments: 67,
        },
      },
      {
        id: "med-2",
        type: "article",
        title: "The Psychology of Web Performance",
        description:
          "How performance impacts user behavior and business metrics",
        date: "2024-01-08",
        url: "https://medium.com/@moses.developer/psychology-web-performance",
        metrics: {
          views: 14500,
          likes: 678,
          shares: 123,
          comments: 45,
        },
      },
      {
        id: "med-3",
        type: "article",
        title: "Building Design Systems That Scale",
        description: "Lessons learned from building enterprise design systems",
        date: "2023-12-20",
        url: "https://medium.com/@moses.developer/design-systems-scale",
        metrics: {
          views: 12300,
          likes: 567,
          shares: 89,
          comments: 34,
        },
      },
    ],
    stats: {
      totalPosts: 28,
      totalViews: 240000,
      avgEngagement: 9.8,
    },
  },
];
