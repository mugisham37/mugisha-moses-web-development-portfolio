import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@localhost" },
    update: {},
    create: {
      email: "admin@localhost",
      name: "Admin User",
      role: "ADMIN",
    },
  });

  console.log("✅ Created admin user:", adminUser.email);

  // Create sample project categories
  const webDevCategory = await prisma.projectCategory.upsert({
    where: { slug: "web-development" },
    update: {},
    create: {
      name: "Web Development",
      slug: "web-development",
      description: "Full-stack web applications and websites",
      color: "#FFFF00",
    },
  });

  const mobileCategory = await prisma.projectCategory.upsert({
    where: { slug: "mobile-development" },
    update: {},
    create: {
      name: "Mobile Development",
      slug: "mobile-development",
      description: "iOS and Android applications",
      color: "#FF00FF",
    },
  });

  console.log("✅ Created project categories");

  // Create sample blog categories
  const techCategory = await prisma.blogCategory.upsert({
    where: { slug: "technology" },
    update: {},
    create: {
      name: "Technology",
      slug: "technology",
      description: "Latest tech trends and insights",
      color: "#00FFFF",
    },
  });

  const tutorialCategory = await prisma.blogCategory.upsert({
    where: { slug: "tutorials" },
    update: {},
    create: {
      name: "Tutorials",
      slug: "tutorials",
      description: "Step-by-step guides and tutorials",
      color: "#FF0000",
    },
  });

  console.log("✅ Created blog categories");

  // Create sample blog tags
  const reactTag = await prisma.blogTag.upsert({
    where: { slug: "react" },
    update: {},
    create: {
      name: "React",
      slug: "react",
    },
  });

  const nextjsTag = await prisma.blogTag.upsert({
    where: { slug: "nextjs" },
    update: {},
    create: {
      name: "Next.js",
      slug: "nextjs",
    },
  });

  const typescriptTag = await prisma.blogTag.upsert({
    where: { slug: "typescript" },
    update: {},
    create: {
      name: "TypeScript",
      slug: "typescript",
    },
  });

  console.log("✅ Created blog tags");

  // Create sample project
  const sampleProject = await prisma.project.upsert({
    where: { slug: "brutalist-portfolio" },
    update: {},
    create: {
      title: "Brutalist Developer Portfolio",
      slug: "brutalist-portfolio",
      description: "A cutting-edge developer portfolio built with Next.js 14 and brutalist design principles",
      content: "This portfolio showcases modern web development techniques with a bold, industrial aesthetic.",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL"],
      githubUrl: "https://github.com/username/brutalist-portfolio",
      liveUrl: "https://brutalist-portfolio.vercel.app",
      status: "FEATURED",
      featured: true,
      authorId: adminUser.id,
      publishedAt: new Date(),
      categories: {
        connect: [{ id: webDevCategory.id }],
      },
    },
  });

  console.log("✅ Created sample project:", sampleProject.title);

  // Create sample testimonial
  const sampleTestimonial = await prisma.testimonial.create({
    data: {
      name: "Jane Smith",
      role: "CTO",
      company: "Tech Startup Inc.",
      content: "Outstanding work! The brutalist design perfectly captures our brand's bold vision. The technical execution is flawless.",
      rating: 5,
      featured: true,
      approved: true,
      authorId: adminUser.id,
    },
  });

  console.log("✅ Created sample testimonial");

  console.log("🎉 Database seeded successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error seeding database:", e);
    await prisma.$disconnect();
    process.exit(1);
  });