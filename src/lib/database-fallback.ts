/**
 * Database fallback configuration
 * This file provides fallback data when database is not available
 */

export const fallbackProjectCategories = [
  {
    id: "1",
    name: "Web Development",
    slug: "web-development",
    description: "Modern web applications and websites",
    _count: { projects: 5 },
  },
  {
    id: "2",
    name: "Mobile Development",
    slug: "mobile-development",
    description: "Native and cross-platform mobile apps",
    _count: { projects: 3 },
  },
  {
    id: "3",
    name: "Full Stack",
    slug: "full-stack",
    description: "End-to-end application development",
    _count: { projects: 4 },
  },
];

export const fallbackTechnologies = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "PostgreSQL",
  "Prisma",
  "Tailwind CSS",
  "React Native",
  "Express.js",
];

export const fallbackProjects = [
  {
    id: "1",
    title: "E-commerce Platform",
    slug: "ecommerce-platform",
    description:
      "A modern e-commerce platform built with Next.js and TypeScript",
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Stripe"],
    githubUrl: "https://github.com/mugisham37/ecommerce-platform",
    liveUrl: "https://ecommerce-demo.vercel.app",
    status: "COMPLETED" as const,
    featured: true,
    thumbnail: "/images/placeholders/project-1.svg",
    images: ["/images/placeholders/project-1.svg"],
    viewCount: 150,
    likeCount: 25,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-03-01"),
    publishedAt: new Date("2024-03-01"),
    author: {
      id: "1",
      name: "Mugisha Moses",
      email: "mugisha.moses.dev@gmail.com",
    },
    categories: [
      {
        id: "1",
        name: "Web Development",
        slug: "web-development",
        color: "#3B82F6",
      },
    ],
  },
  {
    id: "2",
    title: "Task Management App",
    slug: "task-management-app",
    description:
      "A collaborative task management application with real-time updates",
    technologies: ["React", "Node.js", "Socket.io", "MongoDB"],
    githubUrl: "https://github.com/mugisham37/task-manager",
    liveUrl: "https://task-manager-demo.vercel.app",
    status: "COMPLETED" as const,
    featured: true,
    thumbnail: "/images/placeholders/project-2.svg",
    images: ["/images/placeholders/project-2.svg"],
    viewCount: 120,
    likeCount: 18,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-04-01"),
    publishedAt: new Date("2024-04-01"),
    author: {
      id: "1",
      name: "Mugisha Moses",
      email: "mugisha.moses.dev@gmail.com",
    },
    categories: [
      {
        id: "3",
        name: "Full Stack",
        slug: "full-stack",
        color: "#10B981",
      },
    ],
  },
];

export function isDatabaseAvailable(): boolean {
  return (
    process.env.DATABASE_URL !== undefined &&
    !process.env.DATABASE_URL.includes("username:password")
  );
}
