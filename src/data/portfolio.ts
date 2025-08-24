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
    clients: [],
    recommendations: [],
    contributions: [],
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
