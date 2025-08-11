// Application constants
export const SITE_CONFIG = {
  name: "Brutalist Developer Portfolio",
  description: "Elite Next.js 14 developer portfolio with brutalist design",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  author: {
    name: "Developer Name",
    email: "developer@example.com",
    github: "https://github.com/username",
    linkedin: "https://linkedin.com/in/username",
  },
} as const;

export const BRUTALIST_COLORS = {
  black: "#000000",
  white: "#FFFFFF",
  yellow: "#FFFF00",
  charcoal: {
    100: "#1A1A1A",
    200: "#2A2A2A",
  },
  offWhite: {
    100: "#F8F8F8",
    200: "#F0F0F0",
  },
  yellowVariants: {
    100: "#FEF08A",
    200: "#EAB308",
  },
} as const;

export const ANIMATION_DURATIONS = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
} as const;
