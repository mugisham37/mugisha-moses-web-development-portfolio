import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";

// Mock Prisma client for testing
export const mockDb = mockDeep<PrismaClient>();

// Test database utilities
export class TestDatabaseUtils {
  private static testDb: PrismaClient;

  static async setup(): Promise<void> {
    // Initialize test database connection
    this.testDb = new PrismaClient({
      datasources: {
        db: {
          url: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL,
        },
      },
    });

    // Connect to test database
    await this.testDb.$connect();
  }

  static async teardown(): Promise<void> {
    if (this.testDb) {
      await this.testDb.$disconnect();
    }
  }

  static async reset(): Promise<void> {
    if (!this.testDb) {
      throw new Error("Test database not initialized. Call setup() first.");
    }

    // Clean all tables in reverse dependency order
    const tablenames = await this.testDb.$queryRaw<
      Array<{ tablename: string }>
    >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

    const tables = tablenames
      .map(({ tablename }) => tablename)
      .filter((name) => name !== "_prisma_migrations")
      .map((name) => `"public"."${name}"`)
      .join(", ");

    try {
      await this.testDb.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
    } catch (error) {
      console.log({ error });
    }
  }

  static getTestDb(): PrismaClient {
    if (!this.testDb) {
      throw new Error("Test database not initialized. Call setup() first.");
    }
    return this.testDb;
  }

  static resetMocks(): void {
    mockReset(mockDb);
  }
}

// Mock data generators
export class MockDataGenerators {
  static generateUser(overrides: Partial<any> = {}) {
    return {
      id: `user_${Math.random().toString(36).substr(2, 9)}`,
      email: `test${Math.random().toString(36).substr(2, 5)}@example.com`,
      name: "Test User",
      role: "USER" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };
  }

  static generateProject(overrides: Partial<any> = {}) {
    const slug = `test-project-${Math.random().toString(36).substr(2, 9)}`;
    return {
      id: `project_${Math.random().toString(36).substr(2, 9)}`,
      title: "Test Project",
      slug,
      description: "A test project for unit testing",
      content: "This is test content for the project.",
      technologies: ["React", "TypeScript", "Next.js"],
      githubUrl: `https://github.com/test/${slug}`,
      liveUrl: `https://${slug}.vercel.app`,
      status: "ACTIVE" as const,
      featured: false,
      thumbnail: null,
      images: [],
      videoUrl: null,
      viewCount: 0,
      likeCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: new Date(),
      authorId: "test-user-id",
      ...overrides,
    };
  }

  static generateBlogPost(overrides: Partial<any> = {}) {
    const slug = `test-blog-post-${Math.random().toString(36).substr(2, 9)}`;
    return {
      id: `post_${Math.random().toString(36).substr(2, 9)}`,
      title: "Test Blog Post",
      slug,
      excerpt: "This is a test blog post excerpt.",
      content: "# Test Blog Post\n\nThis is test content for the blog post.",
      metaTitle: "Test Blog Post - Meta Title",
      metaDescription: "Test blog post meta description",
      ogImage: null,
      status: "PUBLISHED" as const,
      featured: false,
      publishedAt: new Date(),
      viewCount: 0,
      readingTime: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: "test-user-id",
      ...overrides,
    };
  }

  static generateTestimonial(overrides: Partial<any> = {}) {
    return {
      id: `testimonial_${Math.random().toString(36).substr(2, 9)}`,
      name: "Test Client",
      role: "CEO",
      company: "Test Company Inc.",
      content: "This is a test testimonial content.",
      rating: 5,
      videoUrl: null,
      avatarUrl: null,
      featured: false,
      approved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: "test-user-id",
      projectId: null,
      ...overrides,
    };
  }

  static generateGitHubRepository(overrides: Partial<any> = {}) {
    const name = `test-repo-${Math.random().toString(36).substr(2, 9)}`;
    return {
      id: `repo_${Math.random().toString(36).substr(2, 9)}`,
      githubId: Math.floor(Math.random() * 1000000),
      name,
      fullName: `testuser/${name}`,
      description: "A test repository",
      language: "TypeScript",
      starCount: Math.floor(Math.random() * 100),
      forkCount: Math.floor(Math.random() * 20),
      watcherCount: Math.floor(Math.random() * 50),
      htmlUrl: `https://github.com/testuser/${name}`,
      cloneUrl: `https://github.com/testuser/${name}.git`,
      isPrivate: false,
      isFork: false,
      isArchived: false,
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
      pushedAt: new Date(),
      lastSyncAt: new Date(),
      ...overrides,
    };
  }

  static generateContactSubmission(overrides: Partial<any> = {}) {
    return {
      id: `contact_${Math.random().toString(36).substr(2, 9)}`,
      name: "Test Contact",
      email: `contact${Math.random().toString(36).substr(2, 5)}@example.com`,
      subject: "Test Subject",
      message: "This is a test contact message.",
      type: "GENERAL" as const,
      projectType: null,
      budget: null,
      timeline: null,
      status: "NEW" as const,
      responded: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };
  }

  static generatePageView(overrides: Partial<any> = {}) {
    const paths = ["/", "/projects", "/blog", "/contact", "/about"];
    const countries = ["US", "CA", "GB", "DE", "FR"];
    
    return {
      id: `pageview_${Math.random().toString(36).substr(2, 9)}`,
      path: paths[Math.floor(Math.random() * paths.length)],
      userAgent: "Mozilla/5.0 (Test Browser)",
      referer: "https://google.com",
      country: countries[Math.floor(Math.random() * countries.length)],
      city: "Test City",
      sessionId: `session_${Math.random().toString(36).substr(2, 9)}`,
      userId: null,
      createdAt: new Date(),
      ...overrides,
    };
  }

  static generateProjectCategory(overrides: Partial<any> = {}) {
    const name = `Test Category ${Math.random().toString(36).substr(2, 5)}`;
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    
    return {
      id: `category_${Math.random().toString(36).substr(2, 9)}`,
      name,
      slug,
      description: `Description for ${name}`,
      color: "#FFFF00",
      ...overrides,
    };
  }

  static generateBlogCategory(overrides: Partial<any> = {}) {
    const name = `Test Blog Category ${Math.random().toString(36).substr(2, 5)}`;
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    
    return {
      id: `blog_category_${Math.random().toString(36).substr(2, 9)}`,
      name,
      slug,
      description: `Description for ${name}`,
      color: "#00FFFF",
      ...overrides,
    };
  }

  static generateBlogTag(overrides: Partial<any> = {}) {
    const name = `test-tag-${Math.random().toString(36).substr(2, 5)}`;
    
    return {
      id: `tag_${Math.random().toString(36).substr(2, 9)}`,
      name,
      slug: name,
      ...overrides,
    };
  }

  // Generate multiple items
  static generateUsers(count: number, overrides: Partial<any> = {}) {
    return Array.from({ length: count }, () => this.generateUser(overrides));
  }

  static generateProjects(count: number, overrides: Partial<any> = {}) {
    return Array.from({ length: count }, () => this.generateProject(overrides));
  }

  static generateBlogPosts(count: number, overrides: Partial<any> = {}) {
    return Array.from({ length: count }, () => this.generateBlogPost(overrides));
  }

  static generateTestimonials(count: number, overrides: Partial<any> = {}) {
    return Array.from({ length: count }, () => this.generateTestimonial(overrides));
  }

  static generatePageViews(count: number, overrides: Partial<any> = {}) {
    return Array.from({ length: count }, () => this.generatePageView(overrides));
  }
}

// Database seeding utilities for tests
export class TestSeeder {
  private db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  async seedUser(data?: Partial<any>) {
    const userData = MockDataGenerators.generateUser(data);
    return this.db.user.create({ data: userData });
  }

  async seedProject(data?: Partial<any>) {
    // Ensure we have a user first
    const user = await this.db.user.findFirst() || await this.seedUser();
    const projectData = MockDataGenerators.generateProject({
      authorId: user.id,
      ...data,
    });
    return this.db.project.create({ data: projectData });
  }

  async seedBlogPost(data?: Partial<any>) {
    // Ensure we have a user first
    const user = await this.db.user.findFirst() || await this.seedUser();
    const postData = MockDataGenerators.generateBlogPost({
      authorId: user.id,
      ...data,
    });
    return this.db.blogPost.create({ data: postData });
  }

  async seedTestimonial(data?: Partial<any>) {
    const user = await this.db.user.findFirst() || await this.seedUser();
    const testimonialData = MockDataGenerators.generateTestimonial({
      authorId: user.id,
      ...data,
    });
    return this.db.testimonial.create({ data: testimonialData });
  }

  async seedGitHubRepository(data?: Partial<any>) {
    const repoData = MockDataGenerators.generateGitHubRepository(data);
    return this.db.gitHubRepository.create({ data: repoData });
  }

  async seedContactSubmission(data?: Partial<any>) {
    const contactData = MockDataGenerators.generateContactSubmission(data);
    return this.db.contactSubmission.create({ data: contactData });
  }

  async seedPageView(data?: Partial<any>) {
    const pageViewData = MockDataGenerators.generatePageView(data);
    return this.db.pageView.create({ data: pageViewData });
  }

  async seedBasicData() {
    const user = await this.seedUser({ role: "ADMIN" });
    const project = await this.seedProject({ authorId: user.id, featured: true });
    const blogPost = await this.seedBlogPost({ authorId: user.id, featured: true });
    const testimonial = await this.seedTestimonial({ authorId: user.id, featured: true });
    const repository = await this.seedGitHubRepository();
    const contact = await this.seedContactSubmission();

    return {
      user,
      project,
      blogPost,
      testimonial,
      repository,
      contact,
    };
  }
}

// Jest setup helpers
export function setupTestDatabase() {
  beforeAll(async () => {
    await TestDatabaseUtils.setup();
  });

  afterAll(async () => {
    await TestDatabaseUtils.teardown();
  });

  beforeEach(async () => {
    await TestDatabaseUtils.reset();
    TestDatabaseUtils.resetMocks();
  });
}

// Mock implementations for common queries
export const mockQueries = {
  projects: {
    getAll: jest.fn(),
    getBySlug: jest.fn(),
    getFeatured: jest.fn(),
    incrementViewCount: jest.fn(),
    getPopular: jest.fn(),
  },
  blog: {
    getAll: jest.fn(),
    getBySlug: jest.fn(),
    getFeatured: jest.fn(),
    incrementViewCount: jest.fn(),
    search: jest.fn(),
  },
  github: {
    getAllRepositories: jest.fn(),
    getTopRepositories: jest.fn(),
    updateRepository: jest.fn(),
    getContributionStats: jest.fn(),
  },
  analytics: {
    recordPageView: jest.fn(),
    getPageViews: jest.fn(),
    getPopularPages: jest.fn(),
    getVisitorStats: jest.fn(),
  },
  testimonials: {
    getFeatured: jest.fn(),
    getAll: jest.fn(),
  },
  contacts: {
    create: jest.fn(),
    getAll: jest.fn(),
    markAsResponded: jest.fn(),
  },
};

export function resetMockQueries() {
  Object.values(mockQueries).forEach((queryGroup) => {
    Object.values(queryGroup).forEach((mockFn) => {
      if (jest.isMockFunction(mockFn)) {
        mockFn.mockReset();
      }
    });
  });
}