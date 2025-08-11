import { db } from "./db";
import { ProjectStatus } from "@prisma/client";

const sampleProjects = [
  {
    title: "E-Commerce Platform",
    slug: "ecommerce-platform",
    description:
      "A full-stack e-commerce platform built with Next.js, featuring real-time inventory management, payment processing, and admin dashboard.",
    content: `
      <h2>Project Overview</h2>
      <p>This e-commerce platform represents a complete solution for online retail businesses, built with modern web technologies and following brutalist design principles.</p>
      
      <h3>Key Features</h3>
      <ul>
        <li>Real-time inventory management</li>
        <li>Secure payment processing with Stripe</li>
        <li>Advanced product filtering and search</li>
        <li>Admin dashboard with analytics</li>
        <li>Mobile-responsive design</li>
      </ul>
      
      <h3>Technical Implementation</h3>
      <p>The platform uses Next.js 14 with App Router for optimal performance, PostgreSQL for data persistence, and Redis for caching. The frontend implements a brutalist design system with sharp edges, high contrast, and industrial aesthetics.</p>
    `,
    technologies: [
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "Stripe",
      "Redis",
      "Tailwind CSS",
    ],
    githubUrl: "https://github.com/example/ecommerce-platform",
    liveUrl: "https://ecommerce-demo.example.com",
    status: ProjectStatus.FEATURED,
    featured: true,
    thumbnail: "/images/projects/ecommerce-thumb.jpg",
    images: [
      "/images/projects/ecommerce-1.jpg",
      "/images/projects/ecommerce-2.jpg",
      "/images/projects/ecommerce-3.jpg",
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    viewCount: 1250,
    likeCount: 89,
  },
  {
    title: "Task Management Dashboard",
    slug: "task-management-dashboard",
    description:
      "A collaborative task management application with real-time updates, team collaboration features, and advanced project tracking.",
    content: `
      <h2>Project Overview</h2>
      <p>A comprehensive task management solution designed for modern development teams, featuring real-time collaboration and advanced project tracking capabilities.</p>
      
      <h3>Core Features</h3>
      <ul>
        <li>Real-time collaborative editing</li>
        <li>Advanced project analytics</li>
        <li>Team member management</li>
        <li>Customizable workflows</li>
        <li>Integration with popular tools</li>
      </ul>
    `,
    technologies: [
      "React",
      "Node.js",
      "Socket.io",
      "MongoDB",
      "Express",
      "Material-UI",
    ],
    githubUrl: "https://github.com/example/task-dashboard",
    liveUrl: "https://tasks-demo.example.com",
    status: ProjectStatus.ACTIVE,
    featured: true,
    thumbnail: "/images/projects/tasks-thumb.jpg",
    images: ["/images/projects/tasks-1.jpg", "/images/projects/tasks-2.jpg"],
    viewCount: 890,
    likeCount: 67,
  },
  {
    title: "AI Content Generator",
    slug: "ai-content-generator",
    description:
      "An AI-powered content generation tool that helps creators produce high-quality articles, social media posts, and marketing copy.",
    content: `
      <h2>Project Overview</h2>
      <p>This AI content generator leverages advanced language models to help content creators produce engaging and high-quality content across multiple formats.</p>
    `,
    technologies: [
      "Python",
      "FastAPI",
      "OpenAI API",
      "React",
      "PostgreSQL",
      "Docker",
    ],
    githubUrl: "https://github.com/example/ai-content-generator",
    liveUrl: "https://ai-content.example.com",
    status: ProjectStatus.ACTIVE,
    featured: false,
    thumbnail: "/images/projects/ai-content-thumb.jpg",
    images: ["/images/projects/ai-content-1.jpg"],
    viewCount: 654,
    likeCount: 45,
  },
  {
    title: "Cryptocurrency Tracker",
    slug: "crypto-tracker",
    description:
      "A real-time cryptocurrency tracking application with portfolio management, price alerts, and market analysis tools.",
    content: `
      <h2>Project Overview</h2>
      <p>A comprehensive cryptocurrency tracking solution with real-time price updates, portfolio management, and advanced market analysis features.</p>
    `,
    technologies: ["Vue.js", "Nuxt.js", "CoinGecko API", "Chart.js", "Vuetify"],
    githubUrl: "https://github.com/example/crypto-tracker",
    liveUrl: "https://crypto-tracker.example.com",
    status: ProjectStatus.ACTIVE,
    featured: false,
    thumbnail: "/images/projects/crypto-thumb.jpg",
    images: ["/images/projects/crypto-1.jpg", "/images/projects/crypto-2.jpg"],
    viewCount: 432,
    likeCount: 28,
  },
  {
    title: "Social Media Analytics",
    slug: "social-media-analytics",
    description:
      "A comprehensive social media analytics platform that tracks engagement, audience growth, and content performance across multiple platforms.",
    content: `
      <h2>Project Overview</h2>
      <p>This analytics platform provides deep insights into social media performance, helping businesses optimize their social media strategy.</p>
    `,
    technologies: [
      "Angular",
      "D3.js",
      "Node.js",
      "MySQL",
      "Twitter API",
      "Instagram API",
    ],
    githubUrl: "https://github.com/example/social-analytics",
    status: ProjectStatus.ARCHIVED,
    featured: false,
    thumbnail: "/images/projects/social-thumb.jpg",
    images: ["/images/projects/social-1.jpg"],
    viewCount: 321,
    likeCount: 19,
  },
  {
    title: "Weather Forecast App",
    slug: "weather-forecast-app",
    description:
      "A beautiful weather application with detailed forecasts, interactive maps, and location-based weather alerts.",
    content: `
      <h2>Project Overview</h2>
      <p>A modern weather application that provides accurate forecasts with an intuitive and visually appealing interface.</p>
    `,
    technologies: [
      "React Native",
      "OpenWeather API",
      "Redux",
      "React Navigation",
    ],
    githubUrl: "https://github.com/example/weather-app",
    liveUrl: "https://weather-app.example.com",
    status: ProjectStatus.ACTIVE,
    featured: false,
    thumbnail: "/images/projects/weather-thumb.jpg",
    images: [
      "/images/projects/weather-1.jpg",
      "/images/projects/weather-2.jpg",
      "/images/projects/weather-3.jpg",
    ],
    viewCount: 567,
    likeCount: 34,
  },
];

const sampleCategories = [
  {
    name: "Web Development",
    slug: "web-development",
    description: "Full-stack web applications and websites",
    color: "#FFFF00",
  },
  {
    name: "Mobile Apps",
    slug: "mobile-apps",
    description: "Native and cross-platform mobile applications",
    color: "#FF6B6B",
  },
  {
    name: "AI & Machine Learning",
    slug: "ai-ml",
    description: "Artificial intelligence and machine learning projects",
    color: "#4ECDC4",
  },
  {
    name: "Data Analytics",
    slug: "data-analytics",
    description: "Data visualization and analytics platforms",
    color: "#45B7D1",
  },
  {
    name: "E-Commerce",
    slug: "ecommerce",
    description: "Online shopping and e-commerce solutions",
    color: "#96CEB4",
  },
  {
    name: "Productivity Tools",
    slug: "productivity",
    description: "Tools and applications to enhance productivity",
    color: "#FFEAA7",
  },
];

export async function seedProjects() {
  try {
    console.log("🌱 Seeding project categories...");

    // Create categories first
    const createdCategories = await Promise.all(
      sampleCategories.map(async (category) => {
        return await db.projectCategory.upsert({
          where: { slug: category.slug },
          update: category,
          create: category,
        });
      })
    );

    console.log(`✅ Created ${createdCategories.length} project categories`);

    // Get the first user (admin) to assign as project author
    const adminUser = await db.user.findFirst({
      where: { role: "ADMIN" },
    });

    if (!adminUser) {
      throw new Error("No admin user found. Please run admin seed first.");
    }

    console.log("🌱 Seeding projects...");

    // Create projects
    const createdProjects = await Promise.all(
      sampleProjects.map(async (project, index) => {
        // Assign categories based on project type
        const categoryAssignments = [];

        if (
          project.technologies.includes("Next.js") ||
          project.technologies.includes("React")
        ) {
          categoryAssignments.push(
            createdCategories.find((c) => c.slug === "web-development")!.id
          );
        }
        if (project.technologies.includes("React Native")) {
          categoryAssignments.push(
            createdCategories.find((c) => c.slug === "mobile-apps")!.id
          );
        }
        if (
          project.technologies.includes("OpenAI API") ||
          project.technologies.includes("Python")
        ) {
          categoryAssignments.push(
            createdCategories.find((c) => c.slug === "ai-ml")!.id
          );
        }
        if (
          project.title.includes("Analytics") ||
          project.technologies.includes("D3.js")
        ) {
          categoryAssignments.push(
            createdCategories.find((c) => c.slug === "data-analytics")!.id
          );
        }
        if (
          project.title.includes("E-Commerce") ||
          project.title.includes("E-commerce")
        ) {
          categoryAssignments.push(
            createdCategories.find((c) => c.slug === "ecommerce")!.id
          );
        }
        if (
          project.title.includes("Task") ||
          project.title.includes("Management")
        ) {
          categoryAssignments.push(
            createdCategories.find((c) => c.slug === "productivity")!.id
          );
        }

        // Default to web development if no specific category
        if (categoryAssignments.length === 0) {
          categoryAssignments.push(
            createdCategories.find((c) => c.slug === "web-development")!.id
          );
        }

        return await db.project.upsert({
          where: { slug: project.slug },
          update: {
            ...project,
            authorId: adminUser.id,
            publishedAt: new Date(),
            categories: {
              set: categoryAssignments.map((id) => ({ id })),
            },
          },
          create: {
            ...project,
            authorId: adminUser.id,
            publishedAt: new Date(),
            categories: {
              connect: categoryAssignments.map((id) => ({ id })),
            },
          },
        });
      })
    );

    console.log(`✅ Created ${createdProjects.length} projects`);

    // Create some sample analytics data
    console.log("🌱 Seeding project analytics...");

    const analyticsEvents = ["view", "click", "share", "like"];
    const analyticsData = [];

    for (const project of createdProjects) {
      // Generate random analytics events for the past 30 days
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        // Generate 1-10 random events per day
        const eventsPerDay = Math.floor(Math.random() * 10) + 1;

        for (let j = 0; j < eventsPerDay; j++) {
          const event =
            analyticsEvents[Math.floor(Math.random() * analyticsEvents.length)];
          analyticsData.push({
            projectId: project.id,
            event,
            metadata: {
              userAgent: "seed-data",
              timestamp: date.toISOString(),
              synthetic: true,
            },
            createdAt: date,
          });
        }
      }
    }

    await db.projectAnalytics.createMany({
      data: analyticsData,
    });

    console.log(`✅ Created ${analyticsData.length} analytics events`);
    console.log("🎉 Project seeding completed successfully!");

    return {
      categories: createdCategories,
      projects: createdProjects,
      analyticsEvents: analyticsData.length,
    };
  } catch (error) {
    console.error("❌ Error seeding projects:", error);
    throw error;
  }
}

// Function to clean up project data (useful for testing)
export async function cleanupProjects() {
  try {
    console.log("🧹 Cleaning up project data...");

    await db.projectAnalytics.deleteMany();
    await db.project.deleteMany();
    await db.projectCategory.deleteMany();

    console.log("✅ Project data cleanup completed");
  } catch (error) {
    console.error("❌ Error cleaning up projects:", error);
    throw error;
  }
}
