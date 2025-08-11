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

  const designCategory = await prisma.projectCategory.upsert({
    where: { slug: "ui-ux-design" },
    update: {},
    create: {
      name: "UI/UX Design",
      slug: "ui-ux-design",
      description: "User interface and experience design projects",
      color: "#00FF00",
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

  const thoughtsCategory = await prisma.blogCategory.upsert({
    where: { slug: "thoughts" },
    update: {},
    create: {
      name: "Thoughts",
      slug: "thoughts",
      description: "Personal insights and reflections",
      color: "#FFA500",
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

  const brutalistTag = await prisma.blogTag.upsert({
    where: { slug: "brutalist-design" },
    update: {},
    create: {
      name: "Brutalist Design",
      slug: "brutalist-design",
    },
  });

  console.log("✅ Created blog tags");

  // Create sample projects
  const sampleProject = await prisma.project.upsert({
    where: { slug: "brutalist-portfolio" },
    update: {},
    create: {
      title: "Brutalist Developer Portfolio",
      slug: "brutalist-portfolio",
      description: "A cutting-edge developer portfolio built with Next.js 14 and brutalist design principles",
      content: "This portfolio showcases modern web development techniques with a bold, industrial aesthetic. Built with Next.js 14, TypeScript, Tailwind CSS, and Prisma for a full-stack experience.",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL", "Framer Motion"],
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

  const ecommerceProject = await prisma.project.upsert({
    where: { slug: "brutalist-ecommerce" },
    update: {},
    create: {
      title: "Brutalist E-commerce Platform",
      slug: "brutalist-ecommerce",
      description: "A bold e-commerce platform with industrial design aesthetics",
      content: "An e-commerce platform that breaks conventional design rules with raw, concrete-inspired interfaces.",
      technologies: ["React", "Node.js", "MongoDB", "Stripe", "Docker"],
      githubUrl: "https://github.com/username/brutalist-ecommerce",
      liveUrl: "https://brutalist-shop.vercel.app",
      status: "ACTIVE",
      featured: false,
      authorId: adminUser.id,
      publishedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      categories: {
        connect: [{ id: webDevCategory.id }],
      },
    },
  });

  const mobileApp = await prisma.project.upsert({
    where: { slug: "brutalist-mobile-app" },
    update: {},
    create: {
      title: "Brutalist Mobile App",
      slug: "brutalist-mobile-app",
      description: "A React Native app with brutalist design principles",
      content: "Mobile application showcasing how brutalist design can work effectively on mobile platforms.",
      technologies: ["React Native", "TypeScript", "Expo", "Firebase"],
      githubUrl: "https://github.com/username/brutalist-mobile",
      status: "ACTIVE",
      featured: false,
      authorId: adminUser.id,
      publishedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
      categories: {
        connect: [{ id: mobileCategory.id }],
      },
    },
  });

  console.log("✅ Created sample projects");

  // Create sample blog posts
  const blogPost1 = await prisma.blogPost.upsert({
    where: { slug: "brutalist-design-in-web-development" },
    update: {},
    create: {
      title: "Brutalist Design in Web Development",
      slug: "brutalist-design-in-web-development",
      excerpt: "Exploring how brutalist design principles can create powerful and memorable web experiences.",
      content: `# Brutalist Design in Web Development

Brutalist design, inspired by the architectural movement of the same name, brings raw, uncompromising aesthetics to digital interfaces. This approach challenges conventional design wisdom and creates memorable, impactful experiences.

## Key Principles

1. **Raw Materials**: Use basic HTML elements without excessive styling
2. **High Contrast**: Bold color combinations that demand attention
3. **Geometric Shapes**: Sharp edges and angular compositions
4. **Typography**: Monospace fonts and uppercase text
5. **Asymmetry**: Deliberately unbalanced layouts

## Implementation in Code

\`\`\`css
.brutalist-button {
  background: #000;
  color: #fff;
  border: 4px solid #fff;
  font-family: 'Space Mono', monospace;
  text-transform: uppercase;
  padding: 16px 32px;
  transition: none;
}

.brutalist-button:hover {
  background: #fff;
  color: #000;
  transform: translate(-4px, -4px);
  box-shadow: 4px 4px 0 #000;
}
\`\`\`

This design philosophy creates interfaces that are impossible to ignore and leave lasting impressions on users.`,
      metaTitle: "Brutalist Design in Web Development - Bold Digital Aesthetics",
      metaDescription: "Learn how to implement brutalist design principles in web development for powerful, memorable user experiences.",
      status: "PUBLISHED",
      featured: true,
      publishedAt: new Date(),
      readingTime: 5,
      authorId: adminUser.id,
      categories: {
        connect: [{ id: techCategory.id }, { id: tutorialCategory.id }],
      },
      tags: {
        connect: [{ id: brutalistTag.id }, { id: reactTag.id }],
      },
    },
  });

  const blogPost2 = await prisma.blogPost.upsert({
    where: { slug: "next-js-14-performance-optimization" },
    update: {},
    create: {
      title: "Next.js 14 Performance Optimization Techniques",
      slug: "next-js-14-performance-optimization",
      excerpt: "Advanced techniques for optimizing Next.js 14 applications for maximum performance.",
      content: `# Next.js 14 Performance Optimization

Next.js 14 introduces powerful new features for building high-performance web applications. Here are the key optimization techniques every developer should know.

## Server Components

Server Components allow you to render components on the server, reducing client-side JavaScript and improving performance.

\`\`\`tsx
// app/components/ServerComponent.tsx
export default async function ServerComponent() {
  const data = await fetch('https://api.example.com/data');
  const posts = await data.json();
  
  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
\`\`\`

## Image Optimization

Use the Next.js Image component for automatic optimization:

\`\`\`tsx
import Image from 'next/image';

export default function OptimizedImage() {
  return (
    <Image
      src="/hero-image.jpg"
      alt="Hero image"
      width={1200}
      height={600}
      priority
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
    />
  );
}
\`\`\`

These techniques can significantly improve your application's Core Web Vitals scores.`,
      metaTitle: "Next.js 14 Performance Optimization - Advanced Techniques",
      metaDescription: "Master Next.js 14 performance optimization with Server Components, image optimization, and more.",
      status: "PUBLISHED",
      featured: false,
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      readingTime: 8,
      authorId: adminUser.id,
      categories: {
        connect: [{ id: tutorialCategory.id }],
      },
      tags: {
        connect: [{ id: nextjsTag.id }, { id: typescriptTag.id }],
      },
    },
  });

  console.log("✅ Created sample blog posts");

  // Create sample testimonials
  const testimonial1 = await prisma.testimonial.create({
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

  const testimonial2 = await prisma.testimonial.create({
    data: {
      name: "Michael Chen",
      role: "Product Manager",
      company: "Digital Agency Co.",
      content: "The portfolio showcases incredible attention to detail and innovative design thinking. Highly recommended!",
      rating: 5,
      featured: true,
      approved: true,
      authorId: adminUser.id,
    },
  });

  const testimonial3 = await prisma.testimonial.create({
    data: {
      name: "Sarah Johnson",
      role: "Creative Director",
      company: "Design Studio",
      content: "A perfect blend of technical expertise and creative vision. The brutalist aesthetic is executed brilliantly.",
      rating: 5,
      featured: false,
      approved: true,
      authorId: adminUser.id,
    },
  });

  console.log("✅ Created sample testimonials");

  // Create sample GitHub repositories
  const repo1 = await prisma.gitHubRepository.create({
    data: {
      githubId: 123456789,
      name: "brutalist-portfolio",
      fullName: "username/brutalist-portfolio",
      description: "A brutalist developer portfolio built with Next.js 14",
      language: "TypeScript",
      starCount: 42,
      forkCount: 8,
      watcherCount: 15,
      htmlUrl: "https://github.com/username/brutalist-portfolio",
      cloneUrl: "https://github.com/username/brutalist-portfolio.git",
      isPrivate: false,
      isFork: false,
      isArchived: false,
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
      pushedAt: new Date(),
    },
  });

  const repo2 = await prisma.gitHubRepository.create({
    data: {
      githubId: 987654321,
      name: "react-brutalist-ui",
      fullName: "username/react-brutalist-ui",
      description: "A React component library with brutalist design principles",
      language: "JavaScript",
      starCount: 128,
      forkCount: 23,
      watcherCount: 45,
      htmlUrl: "https://github.com/username/react-brutalist-ui",
      cloneUrl: "https://github.com/username/react-brutalist-ui.git",
      isPrivate: false,
      isFork: false,
      isArchived: false,
      createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      pushedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  });

  console.log("✅ Created sample GitHub repositories");

  // Create sample contact submissions
  await prisma.contactSubmission.create({
    data: {
      name: "Alex Rodriguez",
      email: "alex@example.com",
      subject: "Project Inquiry",
      message: "I'm interested in discussing a potential web development project with brutalist design elements.",
      type: "PROJECT_INQUIRY",
      projectType: "E-commerce Website",
      budget: "$10,000 - $25,000",
      timeline: "3-4 months",
      status: "NEW",
    },
  });

  await prisma.contactSubmission.create({
    data: {
      name: "Emma Wilson",
      email: "emma@startup.com",
      subject: "Consultation Request",
      message: "Would like to schedule a consultation to discuss our startup's design needs.",
      type: "CONSULTATION",
      status: "IN_PROGRESS",
    },
  });

  console.log("✅ Created sample contact submissions");

  // Create sample analytics data
  const paths = ["/", "/projects", "/blog", "/contact", "/about"];
  const countries = ["US", "CA", "GB", "DE", "FR", "AU", "JP"];
  
  for (let i = 0; i < 100; i++) {
    await prisma.pageView.create({
      data: {
        path: paths[Math.floor(Math.random() * paths.length)],
        sessionId: `session_${Math.random().toString(36).substr(2, 9)}`,
        country: countries[Math.floor(Math.random() * countries.length)],
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      },
    });
  }

  console.log("✅ Created sample analytics data");

  console.log("🎉 Database seeded successfully!");
  console.log(`
📊 Summary:
- Users: 1
- Project Categories: 3
- Blog Categories: 3
- Blog Tags: 4
- Projects: 3
- Blog Posts: 2
- Testimonials: 3
- GitHub Repositories: 2
- Contact Submissions: 2
- Page Views: 100
  `);
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