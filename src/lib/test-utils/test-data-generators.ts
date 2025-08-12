import { faker } from "@faker-js/faker";

/**
 * Comprehensive test data generators for all application entities
 */
export class TestDataGenerators {
  /**
   * Generate realistic user data
   */
  static generateUser(overrides: Partial<any> = {}) {
    return {
      id: faker.string.uuid(),
      email: faker.internet.email(),
      name: faker.person.fullName(),
      role: faker.helpers.arrayElement(["USER", "ADMIN"]),
      image: faker.image.avatar(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      ...overrides,
    };
  }

  /**
   * Generate realistic project data
   */
  static generateProject(overrides: Partial<any> = {}) {
    const title = faker.hacker.phrase();
    const slug = faker.helpers.slugify(title).toLowerCase();

    return {
      id: faker.string.uuid(),
      title,
      slug,
      description: faker.lorem.paragraph(),
      content: faker.lorem.paragraphs(3, "\n\n"),
      technologies: faker.helpers.arrayElements(
        [
          "React",
          "TypeScript",
          "Next.js",
          "Node.js",
          "Python",
          "PostgreSQL",
          "MongoDB",
          "Docker",
          "AWS",
          "Vercel",
          "Tailwind CSS",
          "Prisma",
          "GraphQL",
          "REST API",
          "Jest",
          "Playwright",
          "Storybook",
        ],
        { min: 2, max: 6 }
      ),
      githubUrl: faker.internet.url(),
      liveUrl: faker.internet.url(),
      status: faker.helpers.arrayElement([
        "DRAFT",
        "ACTIVE",
        "ARCHIVED",
        "FEATURED",
      ]),
      featured: faker.datatype.boolean(),
      thumbnail: faker.image.url({ width: 800, height: 600 }),
      images: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () =>
        faker.image.url({ width: 1200, height: 800 })
      ),
      videoUrl: faker.helpers.maybe(() => faker.internet.url(), {
        probability: 0.3,
      }),
      viewCount: faker.number.int({ min: 0, max: 10000 }),
      likeCount: faker.number.int({ min: 0, max: 500 }),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      publishedAt: faker.date.past(),
      authorId: faker.string.uuid(),
      ...overrides,
    };
  }

  /**
   * Generate realistic blog post data
   */
  static generateBlogPost(overrides: Partial<any> = {}) {
    const title = faker.lorem.sentence();
    const slug = faker.helpers.slugify(title).toLowerCase();

    return {
      id: faker.string.uuid(),
      title,
      slug,
      excerpt: faker.lorem.paragraph(),
      content: this.generateMarkdownContent(),
      metaTitle: `${title} | Blog`,
      metaDescription: faker.lorem.sentence(),
      ogImage: faker.image.url({ width: 1200, height: 630 }),
      status: faker.helpers.arrayElement([
        "DRAFT",
        "PUBLISHED",
        "SCHEDULED",
        "ARCHIVED",
      ]),
      featured: faker.datatype.boolean(),
      publishedAt: faker.date.past(),
      viewCount: faker.number.int({ min: 0, max: 5000 }),
      readingTime: faker.number.int({ min: 1, max: 15 }),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      authorId: faker.string.uuid(),
      ...overrides,
    };
  }

  /**
   * Generate realistic testimonial data
   */
  static generateTestimonial(overrides: Partial<any> = {}) {
    return {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      role: faker.person.jobTitle(),
      company: faker.company.name(),
      content: faker.lorem.paragraph(),
      rating: faker.number.int({ min: 4, max: 5 }),
      videoUrl: faker.helpers.maybe(() => faker.internet.url(), {
        probability: 0.2,
      }),
      avatarUrl: faker.image.avatar(),
      featured: faker.datatype.boolean(),
      approved: true,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      authorId: faker.helpers.maybe(() => faker.string.uuid(), {
        probability: 0.7,
      }),
      projectId: faker.helpers.maybe(() => faker.string.uuid(), {
        probability: 0.5,
      }),
      ...overrides,
    };
  }

  /**
   * Generate realistic GitHub repository data
   */
  static generateGitHubRepository(overrides: Partial<any> = {}) {
    const name = faker.hacker.noun().toLowerCase().replace(/\s+/g, "-");
    const owner = faker.internet.userName().toLowerCase();

    return {
      id: faker.string.uuid(),
      githubId: faker.number.int({ min: 1, max: 999999999 }),
      name,
      fullName: `${owner}/${name}`,
      description: faker.hacker.phrase(),
      language: faker.helpers.arrayElement([
        "TypeScript",
        "JavaScript",
        "Python",
        "Java",
        "Go",
        "Rust",
        "C++",
        "PHP",
      ]),
      starCount: faker.number.int({ min: 0, max: 1000 }),
      forkCount: faker.number.int({ min: 0, max: 100 }),
      watcherCount: faker.number.int({ min: 0, max: 200 }),
      htmlUrl: `https://github.com/${owner}/${name}`,
      cloneUrl: `https://github.com/${owner}/${name}.git`,
      isPrivate: faker.datatype.boolean(),
      isFork: faker.datatype.boolean(),
      isArchived: faker.datatype.boolean(),
      createdAt: faker.date.past({ years: 3 }),
      updatedAt: faker.date.recent(),
      pushedAt: faker.date.recent(),
      lastSyncAt: faker.date.recent(),
      ...overrides,
    };
  }

  /**
   * Generate realistic contact submission data
   */
  static generateContactSubmission(overrides: Partial<any> = {}) {
    const type = faker.helpers.arrayElement([
      "GENERAL",
      "PROJECT_INQUIRY",
      "CONSULTATION",
      "COLLABORATION",
      "SUPPORT",
    ]);

    return {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      subject: faker.lorem.sentence(),
      message: faker.lorem.paragraphs(2),
      type,
      projectType:
        type === "PROJECT_INQUIRY"
          ? faker.helpers.arrayElement([
              "Website",
              "Web Application",
              "Mobile App",
              "E-commerce",
              "API",
              "Other",
            ])
          : null,
      budget:
        type === "PROJECT_INQUIRY"
          ? faker.helpers.arrayElement([
              "$5,000 - $10,000",
              "$10,000 - $25,000",
              "$25,000 - $50,000",
              "$50,000+",
            ])
          : null,
      timeline:
        type === "PROJECT_INQUIRY"
          ? faker.helpers.arrayElement([
              "1-2 months",
              "3-4 months",
              "6+ months",
              "Flexible",
            ])
          : null,
      status: faker.helpers.arrayElement([
        "NEW",
        "IN_PROGRESS",
        "RESPONDED",
        "CLOSED",
      ]),
      responded: faker.datatype.boolean(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      ...overrides,
    };
  }

  /**
   * Generate realistic page view analytics data
   */
  static generatePageView(overrides: Partial<any> = {}) {
    const paths = [
      "/",
      "/projects",
      "/blog",
      "/contact",
      "/services",
      "/about",
      "/projects/portfolio-website",
      "/blog/react-best-practices",
    ];

    return {
      id: faker.string.uuid(),
      path: faker.helpers.arrayElement(paths),
      userAgent: faker.internet.userAgent(),
      referer: faker.helpers.maybe(() => faker.internet.url(), {
        probability: 0.7,
      }),
      country: faker.location.countryCode(),
      city: faker.location.city(),
      sessionId: faker.string.uuid(),
      userId: faker.helpers.maybe(() => faker.string.uuid(), {
        probability: 0.3,
      }),
      createdAt: faker.date.recent(),
      ...overrides,
    };
  }

  /**
   * Generate realistic project category data
   */
  static generateProjectCategory(overrides: Partial<any> = {}) {
    const name = faker.helpers.arrayElement([
      "Web Development",
      "Mobile Apps",
      "E-commerce",
      "APIs",
      "DevOps",
      "UI/UX",
    ]);
    const slug = faker.helpers.slugify(name).toLowerCase();

    return {
      id: faker.string.uuid(),
      name,
      slug,
      description: faker.lorem.sentence(),
      color: faker.internet.color(),
      ...overrides,
    };
  }

  /**
   * Generate realistic blog category data
   */
  static generateBlogCategory(overrides: Partial<any> = {}) {
    const name = faker.helpers.arrayElement([
      "Web Development",
      "JavaScript",
      "React",
      "TypeScript",
      "DevOps",
      "Career",
    ]);
    const slug = faker.helpers.slugify(name).toLowerCase();

    return {
      id: faker.string.uuid(),
      name,
      slug,
      description: faker.lorem.sentence(),
      color: faker.internet.color(),
      ...overrides,
    };
  }

  /**
   * Generate realistic blog tag data
   */
  static generateBlogTag(overrides: Partial<any> = {}) {
    const name = faker.helpers.arrayElement([
      "react",
      "typescript",
      "nextjs",
      "testing",
      "performance",
      "accessibility",
    ]);

    return {
      id: faker.string.uuid(),
      name,
      slug: name,
      ...overrides,
    };
  }

  /**
   * Generate GitHub contribution data
   */
  static generateGitHubContributions(overrides: Partial<any> = {}) {
    const weeks = [];
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);

    for (let week = 0; week < 52; week++) {
      const contributionDays = [];
      for (let day = 0; day < 7; day++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + week * 7 + day);

        contributionDays.push({
          contributionCount: faker.number.int({ min: 0, max: 10 }),
          date: date.toISOString().split("T")[0],
          contributionLevel: faker.helpers.arrayElement([
            "NONE",
            "FIRST_QUARTILE",
            "SECOND_QUARTILE",
            "THIRD_QUARTILE",
            "FOURTH_QUARTILE",
          ]),
        });
      }

      weeks.push({
        contributionDays,
        firstDay: contributionDays[0].date,
      });
    }

    const totalContributions = weeks.reduce(
      (total, week) =>
        total +
        week.contributionDays.reduce(
          (weekTotal, day) => weekTotal + day.contributionCount,
          0
        ),
      0
    );

    return {
      totalContributions,
      weeks,
      contributionCalendar: weeks.flatMap((week) => week.contributionDays),
      longestStreak: faker.number.int({ min: 5, max: 100 }),
      currentStreak: faker.number.int({ min: 0, max: 30 }),
      ...overrides,
    };
  }

  /**
   * Generate service data
   */
  static generateService(overrides: Partial<any> = {}) {
    const name = faker.helpers.arrayElement([
      "Web Development",
      "Mobile App Development",
      "API Development",
      "DevOps Consulting",
      "Technical Consulting",
      "Code Review",
    ]);
    const slug = faker.helpers.slugify(name).toLowerCase();

    return {
      id: faker.string.uuid(),
      name,
      slug,
      description: faker.lorem.paragraph(),
      features: Array.from(
        { length: faker.number.int({ min: 3, max: 8 }) },
        () => faker.lorem.sentence()
      ),
      pricing: {
        starting: faker.number.int({ min: 1000, max: 10000 }),
        currency: "USD",
        period: faker.helpers.arrayElement(["project", "month", "hour"]),
      },
      deliverables: Array.from(
        { length: faker.number.int({ min: 2, max: 5 }) },
        () => faker.lorem.sentence()
      ),
      timeline: faker.helpers.arrayElement([
        "1-2 weeks",
        "2-4 weeks",
        "1-2 months",
        "2-3 months",
      ]),
      ...overrides,
    };
  }

  /**
   * Generate newsletter subscription data
   */
  static generateNewsletterSubscription(overrides: Partial<any> = {}) {
    return {
      id: faker.string.uuid(),
      email: faker.internet.email(),
      status: faker.helpers.arrayElement(["ACTIVE", "UNSUBSCRIBED", "BOUNCED"]),
      source: faker.helpers.arrayElement([
        "blog",
        "homepage",
        "contact",
        "project",
      ]),
      subscribedAt: faker.date.past(),
      unsubscribedAt: faker.helpers.maybe(() => faker.date.recent(), {
        probability: 0.1,
      }),
      ...overrides,
    };
  }

  /**
   * Generate realistic markdown content for blog posts
   */
  private static generateMarkdownContent(): string {
    const sections = [
      `# ${faker.lorem.sentence()}\n\n${faker.lorem.paragraphs(2)}\n\n`,
      `## ${faker.lorem.sentence()}\n\n${faker.lorem.paragraph()}\n\n`,
      `### ${faker.lorem.sentence()}\n\n${faker.lorem.paragraph()}\n\n`,
      "```typescript\n" +
        "const example = {\n" +
        `  name: "${faker.hacker.noun()}",\n` +
        `  value: ${faker.number.int({ min: 1, max: 100 })},\n` +
        `  active: ${faker.datatype.boolean()}\n` +
        "};\n" +
        "```\n\n",
      `> ${faker.lorem.sentence()}\n\n`,
      `- ${faker.lorem.sentence()}\n` +
        `- ${faker.lorem.sentence()}\n` +
        `- ${faker.lorem.sentence()}\n\n`,
      `[${faker.lorem.words(2)}](${faker.internet.url()})\n\n`,
    ];

    return faker.helpers.arrayElements(sections, { min: 4, max: 8 }).join("");
  }

  /**
   * Generate multiple items of any type
   */
  static generateMultiple<T>(
    generator: (overrides?: Partial<T>) => T,
    count: number,
    overrides: Partial<T> = {}
  ): T[] {
    return Array.from({ length: count }, () => generator(overrides));
  }

  /**
   * Generate realistic API response structure
   */
  static generateApiResponse<T>(
    data: T | T[],
    success = true,
    pagination?: {
      page: number;
      limit: number;
      total: number;
    }
  ) {
    const response: any = {
      success,
      data,
      timestamp: new Date().toISOString(),
    };

    if (!success) {
      response.error = faker.lorem.sentence();
      response.code = faker.helpers.arrayElement([
        "VALIDATION_ERROR",
        "NOT_FOUND",
        "UNAUTHORIZED",
        "SERVER_ERROR",
      ]);
    }

    if (pagination) {
      response.pagination = pagination;
      response.page = pagination.page;
      response.limit = pagination.limit;
      response.total = pagination.total;
      response.totalPages = Math.ceil(pagination.total / pagination.limit);
    }

    return response;
  }

  /**
   * Generate realistic form validation errors
   */
  static generateValidationErrors(fields: string[]) {
    return fields.map((field) => ({
      field,
      message: `${field} ${faker.helpers.arrayElement([
        "is required",
        "must be a valid email",
        "must be at least 3 characters",
        "contains invalid characters",
      ])}`,
      code: faker.helpers.arrayElement([
        "REQUIRED",
        "INVALID_FORMAT",
        "TOO_SHORT",
        "INVALID_CHARACTERS",
      ]),
    }));
  }

  /**
   * Generate realistic analytics data
   */
  static generateAnalyticsData(overrides: Partial<any> = {}) {
    return {
      pageViews: faker.number.int({ min: 1000, max: 50000 }),
      uniqueVisitors: faker.number.int({ min: 500, max: 25000 }),
      bounceRate: faker.number.float({ min: 0.2, max: 0.8, fractionDigits: 2 }),
      avgSessionDuration: faker.number.int({ min: 60, max: 600 }),
      topPages: Array.from({ length: 5 }, () => ({
        path: faker.helpers.arrayElement([
          "/",
          "/projects",
          "/blog",
          "/contact",
        ]),
        views: faker.number.int({ min: 100, max: 5000 }),
        uniqueViews: faker.number.int({ min: 50, max: 2500 }),
      })),
      topReferrers: Array.from({ length: 5 }, () => ({
        domain: faker.internet.domainName(),
        visits: faker.number.int({ min: 10, max: 1000 }),
      })),
      deviceTypes: {
        desktop: faker.number.float({ min: 0.4, max: 0.7, fractionDigits: 2 }),
        mobile: faker.number.float({ min: 0.2, max: 0.5, fractionDigits: 2 }),
        tablet: faker.number.float({ min: 0.05, max: 0.15, fractionDigits: 2 }),
      },
      ...overrides,
    };
  }

  /**
   * Generate realistic error scenarios for testing
   */
  static generateErrorScenarios() {
    return [
      {
        name: "Network Error",
        error: new Error("Network request failed"),
        status: 0,
        response: null,
      },
      {
        name: "Server Error",
        error: new Error("Internal server error"),
        status: 500,
        response: { error: "Internal server error", code: "SERVER_ERROR" },
      },
      {
        name: "Not Found",
        error: new Error("Resource not found"),
        status: 404,
        response: { error: "Resource not found", code: "NOT_FOUND" },
      },
      {
        name: "Unauthorized",
        error: new Error("Unauthorized access"),
        status: 401,
        response: { error: "Unauthorized access", code: "UNAUTHORIZED" },
      },
      {
        name: "Rate Limited",
        error: new Error("Too many requests"),
        status: 429,
        response: {
          error: "Too many requests",
          code: "RATE_LIMITED",
          retryAfter: 60,
        },
      },
      {
        name: "Validation Error",
        error: new Error("Validation failed"),
        status: 400,
        response: {
          error: "Validation failed",
          code: "VALIDATION_ERROR",
          errors: this.generateValidationErrors(["name", "email"]),
        },
      },
    ];
  }
}

export default TestDataGenerators;
