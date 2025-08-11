const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seedBlogData() {
  try {
    console.log("🌱 Seeding blog data...");

    // Create blog categories
    const categories = await Promise.all([
      prisma.blogCategory.upsert({
        where: { slug: "web-development" },
        update: {},
        create: {
          name: "Web Development",
          slug: "web-development",
          description:
            "Articles about modern web development techniques and best practices",
          color: "#FFFF00",
        },
      }),
      prisma.blogCategory.upsert({
        where: { slug: "javascript" },
        update: {},
        create: {
          name: "JavaScript",
          slug: "javascript",
          description: "Deep dives into JavaScript and its ecosystem",
          color: "#FEF08A",
        },
      }),
      prisma.blogCategory.upsert({
        where: { slug: "react" },
        update: {},
        create: {
          name: "React",
          slug: "react",
          description: "React development tips, tricks, and tutorials",
          color: "#EAB308",
        },
      }),
    ]);

    // Create blog tags
    const tags = await Promise.all([
      prisma.blogTag.upsert({
        where: { slug: "nextjs" },
        update: {},
        create: { name: "Next.js", slug: "nextjs" },
      }),
      prisma.blogTag.upsert({
        where: { slug: "typescript" },
        update: {},
        create: { name: "TypeScript", slug: "typescript" },
      }),
      prisma.blogTag.upsert({
        where: { slug: "tailwind" },
        update: {},
        create: { name: "Tailwind CSS", slug: "tailwind" },
      }),
      prisma.blogTag.upsert({
        where: { slug: "performance" },
        update: {},
        create: { name: "Performance", slug: "performance" },
      }),
      prisma.blogTag.upsert({
        where: { slug: "tutorial" },
        update: {},
        create: { name: "Tutorial", slug: "tutorial" },
      }),
    ]);

    // Get or create admin user
    let adminUser = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });

    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          email: "admin@localhost",
          name: "Admin User",
          role: "ADMIN",
        },
      });
    }

    // Create sample blog posts
    const samplePosts = [
      {
        title: "Building Modern Web Applications with Next.js 14",
        slug: "building-modern-web-applications-nextjs-14",
        excerpt:
          "Explore the latest features in Next.js 14 and learn how to build performant, scalable web applications with the App Router.",
        content: `# Building Modern Web Applications with Next.js 14

Next.js 14 introduces several groundbreaking features that revolutionize how we build web applications. In this comprehensive guide, we'll explore the App Router, Server Components, and performance optimizations.

## What's New in Next.js 14

The latest version of Next.js brings significant improvements:

- **App Router**: A new paradigm for routing and layouts
- **Server Components**: Render components on the server for better performance
- **Streaming**: Progressive loading of page content
- **Improved TypeScript support**: Better type inference and error messages

## Getting Started

To create a new Next.js 14 project:

\`\`\`bash
npx create-next-app@latest my-app --typescript --tailwind --eslint
cd my-app
npm run dev
\`\`\`

## Server Components vs Client Components

One of the most important concepts in Next.js 14 is understanding when to use Server Components versus Client Components.

### Server Components

Server Components run on the server and are great for:
- Data fetching
- Accessing backend resources
- Keeping sensitive information secure
- Reducing client-side JavaScript bundle size

\`\`\`tsx
// This is a Server Component by default
async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await fetchPost(params.slug);
  
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
\`\`\`

### Client Components

Client Components run in the browser and are needed for:
- Interactive elements
- Event handlers
- Browser-only APIs
- State management

\`\`\`tsx
'use client';

import { useState } from 'react';

function InteractiveButton() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}
\`\`\`

## Performance Optimizations

Next.js 14 includes several performance improvements out of the box:

1. **Automatic code splitting**: Only load the JavaScript needed for each page
2. **Image optimization**: Automatic WebP conversion and lazy loading
3. **Font optimization**: Automatic font loading optimization
4. **Bundle analysis**: Built-in tools to analyze your bundle size

## Conclusion

Next.js 14 represents a major step forward in web development. The App Router and Server Components provide a powerful foundation for building modern, performant applications.

Start experimenting with these features today and see how they can improve your development experience and application performance.`,
        status: "PUBLISHED",
        featured: true,
        publishedAt: new Date("2024-01-15"),
        readingTime: 8,
        categoryIds: [categories[0].id, categories[2].id],
        tagIds: [tags[0].id, tags[1].id, tags[4].id],
      },
      {
        title: "Mastering TypeScript: Advanced Patterns and Best Practices",
        slug: "mastering-typescript-advanced-patterns-best-practices",
        excerpt:
          "Dive deep into advanced TypeScript patterns, utility types, and best practices for building type-safe applications.",
        content: `# Mastering TypeScript: Advanced Patterns and Best Practices

TypeScript has become an essential tool for modern JavaScript development. In this article, we'll explore advanced patterns and best practices that will take your TypeScript skills to the next level.

## Advanced Type Patterns

### Conditional Types

Conditional types allow you to create types that depend on a condition:

\`\`\`typescript
type ApiResponse<T> = T extends string
  ? { message: T }
  : { data: T };

type StringResponse = ApiResponse<string>; // { message: string }
type DataResponse = ApiResponse<User>; // { data: User }
\`\`\`

### Mapped Types

Mapped types let you create new types by transforming properties of existing types:

\`\`\`typescript
type Optional<T> = {
  [K in keyof T]?: T[K];
};

type RequiredUser = {
  id: string;
  name: string;
  email: string;
};

type OptionalUser = Optional<RequiredUser>;
// { id?: string; name?: string; email?: string; }
\`\`\`

## Utility Types

TypeScript provides several built-in utility types:

### Pick and Omit

\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

type PublicUser = Pick<User, 'id' | 'name' | 'email'>;
type UserWithoutPassword = Omit<User, 'password'>;
\`\`\`

### Record

\`\`\`typescript
type Theme = 'light' | 'dark';
type ThemeConfig = Record<Theme, { background: string; text: string }>;

const themes: ThemeConfig = {
  light: { background: '#ffffff', text: '#000000' },
  dark: { background: '#000000', text: '#ffffff' },
};
\`\`\`

## Best Practices

1. **Use strict mode**: Always enable strict TypeScript settings
2. **Prefer interfaces over types**: Use interfaces for object shapes
3. **Use const assertions**: Prevent type widening with \`as const\`
4. **Leverage type guards**: Create custom type guards for runtime type checking

## Conclusion

These advanced TypeScript patterns will help you write more robust, maintainable code. Practice these concepts and gradually incorporate them into your projects.`,
        status: "PUBLISHED",
        featured: false,
        publishedAt: new Date("2024-01-10"),
        readingTime: 6,
        categoryIds: [categories[1].id],
        tagIds: [tags[1].id, tags[4].id],
      },
      {
        title: "Optimizing Web Performance: A Complete Guide",
        slug: "optimizing-web-performance-complete-guide",
        excerpt:
          "Learn essential techniques for optimizing web performance, from Core Web Vitals to advanced optimization strategies.",
        content: `# Optimizing Web Performance: A Complete Guide

Web performance is crucial for user experience and SEO. In this comprehensive guide, we'll cover everything you need to know about optimizing your web applications.

## Core Web Vitals

Google's Core Web Vitals are essential metrics for measuring user experience:

### Largest Contentful Paint (LCP)
- **Target**: < 2.5 seconds
- **Measures**: Loading performance
- **Optimization**: Optimize images, use CDN, minimize render-blocking resources

### First Input Delay (FID)
- **Target**: < 100 milliseconds  
- **Measures**: Interactivity
- **Optimization**: Minimize JavaScript execution time, use web workers

### Cumulative Layout Shift (CLS)
- **Target**: < 0.1
- **Measures**: Visual stability
- **Optimization**: Set dimensions for images and videos, avoid dynamic content insertion

## Image Optimization

Images often account for the majority of page weight:

\`\`\`html
<!-- Use modern formats -->
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description" loading="lazy">
</picture>
\`\`\`

## JavaScript Optimization

### Code Splitting

\`\`\`javascript
// Dynamic imports for code splitting
const LazyComponent = lazy(() => import('./LazyComponent'));

// Route-based splitting
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
\`\`\`

### Tree Shaking

Ensure your bundler can eliminate unused code:

\`\`\`javascript
// Good: Import only what you need
import { debounce } from 'lodash-es';

// Bad: Imports entire library
import _ from 'lodash';
\`\`\`

## CSS Optimization

### Critical CSS

Inline critical CSS and load non-critical CSS asynchronously:

\`\`\`html
<style>
  /* Critical CSS inlined */
  .header { /* styles */ }
</style>

<link rel="preload" href="non-critical.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
\`\`\`

## Monitoring Performance

Use tools to monitor and measure performance:

1. **Lighthouse**: Automated auditing
2. **WebPageTest**: Detailed performance analysis  
3. **Chrome DevTools**: Real-time debugging
4. **Real User Monitoring (RUM)**: Production performance data

## Conclusion

Performance optimization is an ongoing process. Start with measuring your current performance, identify bottlenecks, and apply these techniques systematically.

Remember: premature optimization is the root of all evil, but ignoring performance is worse.`,
        status: "PUBLISHED",
        featured: true,
        publishedAt: new Date("2024-01-05"),
        readingTime: 10,
        categoryIds: [categories[0].id],
        tagIds: [tags[3].id, tags[4].id],
      },
    ];

    // Create blog posts
    for (const postData of samplePosts) {
      const { categoryIds, tagIds, ...postFields } = postData;

      const post = await prisma.blogPost.upsert({
        where: { slug: postData.slug },
        update: {},
        create: {
          ...postFields,
          authorId: adminUser.id,
          categories: {
            connect: categoryIds.map((id) => ({ id })),
          },
          tags: {
            connect: tagIds.map((id) => ({ id })),
          },
        },
      });

      console.log(`✅ Created blog post: ${post.title}`);
    }

    console.log("🎉 Blog data seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding blog data:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  seedBlogData();
}

module.exports = { seedBlogData };
