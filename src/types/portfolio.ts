export interface PortfolioData {
  hero: {
    headlines: string[];
    subtitles: string[];
    metrics: Array<{
      value: number | string;
      label: string;
      format?: "number" | "currency" | "percentage";
    }>;
    valueProposition: string;
    ctaButtons: Array<{
      text: string;
      variant: "primary" | "secondary";
      action: string;
    }>;
  };

  socialProof: {
    clients: Array<{
      name: string;
      logo: string;
      tier: "enterprise" | "growth" | "startup";
      project: {
        description: string;
        value: string;
        duration: string;
      };
    }>;

    recommendations: Array<{
      id: string;
      name: string;
      title: string;
      company: string;
      content: string;
      profileImage: string;
      linkedinUrl: string;
      mutualConnections: number;
      date: string;
    }>;

    contributions: Array<{
      name: string;
      role: string;
      stats: {
        stars: number;
        forks: number;
        downloads: number;
      };
      impact: string;
      recognition: string;
    }>;

    speakingEvents: Array<{
      id: string;
      title: string;
      event: string;
      date: string;
      location: string;
      type: "conference" | "meetup" | "workshop" | "podcast";
      audience: number;
      recording?: string;
      slides?: string;
      description: string;
    }>;

    publications: Array<{
      id: string;
      title: string;
      platform: string;
      date: string;
      url: string;
      type: "article" | "tutorial" | "case-study" | "whitepaper";
      readTime: number;
      views: number;
      shares: number;
      description: string;
    }>;
  };

  results: {
    comparisons: Array<{
      title: string;
      client: string;
      before: Array<{
        metric: string;
        value: string;
        icon: string;
      }>;
      after: Array<{
        metric: string;
        value: string;
        icon: string;
      }>;
      impact: {
        highlight: string;
        value: string;
      };
    }>;

    revenue: {
      generated: number;
      saved: number;
      improvement: number;
    };

    achievements: Array<{
      year: number;
      title: string;
      description: string;
      icon: string;
      current?: boolean;
    }>;
  };

  resources: {
    downloads: Array<{
      id: string;
      title: string;
      description: string;
      type: "guide" | "template" | "toolkit" | "checklist" | "whitepaper";
      format: "pdf" | "zip" | "figma" | "notion";
      size: string;
      downloadUrl: string;
      previewImage: string;
      downloadCount: number;
      rating: number;
      tags: string[];
      lastUpdated: string;
    }>;
  };
}
