import { 
  ProjectQueries, 
  BlogQueries, 
  GitHubQueries, 
  AnalyticsQueries,
  TestimonialQueries,
  ContactQueries,
  DatabaseUtils 
} from '../db-utils';
import { 
  TestDatabaseUtils, 
  TestSeeder, 
  MockDataGenerators,
  setupTestDatabase 
} from '../test-utils/db-test-utils';

// Setup test database
setupTestDatabase();

describe('Database Utilities', () => {
  let testSeeder: TestSeeder;

  beforeEach(async () => {
    const testDb = TestDatabaseUtils.getTestDb();
    testSeeder = new TestSeeder(testDb);
  });

  describe('ProjectQueries', () => {
    it('should get all projects with relations', async () => {
      // Seed test data
      const user = await testSeeder.seedUser({ role: 'ADMIN' });
      await testSeeder.seedProject({ 
        authorId: user.id, 
        featured: true,
        status: 'ACTIVE',
        publishedAt: new Date()
      });

      const projects = await ProjectQueries.getAll({ includeRelations: true });

      expect(projects).toHaveLength(1);
      expect(projects[0]).toHaveProperty('author');
      expect(projects[0]).toHaveProperty('categories');
      expect(projects[0]).toHaveProperty('analytics');
      expect(projects[0].author.id).toBe(user.id);
    });

    it('should get project by slug', async () => {
      const user = await testSeeder.seedUser();
      const project = await testSeeder.seedProject({ 
        authorId: user.id,
        slug: 'test-project-slug',
        publishedAt: new Date()
      });

      const foundProject = await ProjectQueries.getBySlug('test-project-slug');

      expect(foundProject).toBeTruthy();
      expect(foundProject?.id).toBe(project.id);
      expect(foundProject?.slug).toBe('test-project-slug');
    });

    it('should get featured projects', async () => {
      const user = await testSeeder.seedUser();
      
      // Create featured and non-featured projects
      await testSeeder.seedProject({ 
        authorId: user.id, 
        featured: true,
        publishedAt: new Date()
      });
      await testSeeder.seedProject({ 
        authorId: user.id, 
        featured: false,
        publishedAt: new Date()
      });

      const featuredProjects = await ProjectQueries.getFeatured();

      expect(featuredProjects).toHaveLength(1);
      expect(featuredProjects[0].featured).toBe(true);
    });

    it('should increment view count and create analytics', async () => {
      const user = await testSeeder.seedUser();
      const project = await testSeeder.seedProject({ 
        authorId: user.id,
        viewCount: 0
      });

      await ProjectQueries.incrementViewCount(project.id);

      const testDb = TestDatabaseUtils.getTestDb();
      const updatedProject = await testDb.project.findUnique({
        where: { id: project.id }
      });
      const analytics = await testDb.projectAnalytics.findMany({
        where: { projectId: project.id }
      });

      expect(updatedProject?.viewCount).toBe(1);
      expect(analytics).toHaveLength(1);
      expect(analytics[0].event).toBe('view');
    });
  });

  describe('BlogQueries', () => {
    it('should get all blog posts with filters', async () => {
      const user = await testSeeder.seedUser();
      
      // Create published and draft posts
      await testSeeder.seedBlogPost({ 
        authorId: user.id, 
        status: 'PUBLISHED',
        publishedAt: new Date()
      });
      await testSeeder.seedBlogPost({ 
        authorId: user.id, 
        status: 'DRAFT',
        publishedAt: null
      });

      const publishedPosts = await BlogQueries.getAll({ status: 'PUBLISHED' });

      expect(publishedPosts).toHaveLength(1);
      expect(publishedPosts[0].status).toBe('PUBLISHED');
    });

    it('should search blog posts', async () => {
      const user = await testSeeder.seedUser();
      await testSeeder.seedBlogPost({ 
        authorId: user.id,
        title: 'React Testing Guide',
        content: 'This is about React testing',
        publishedAt: new Date()
      });
      await testSeeder.seedBlogPost({ 
        authorId: user.id,
        title: 'Vue.js Tutorial',
        content: 'This is about Vue.js',
        publishedAt: new Date()
      });

      const searchResults = await BlogQueries.search('React');

      expect(searchResults).toHaveLength(1);
      expect(searchResults[0].title).toContain('React');
    });
  });

  describe('GitHubQueries', () => {
    it('should get all repositories with contributions', async () => {
      await testSeeder.seedGitHubRepository({
        name: 'test-repo',
        starCount: 50
      });

      const repositories = await GitHubQueries.getAllRepositories();

      expect(repositories).toHaveLength(1);
      expect(repositories[0].name).toBe('test-repo');
      expect(repositories[0]).toHaveProperty('contributions');
    });

    it('should get top repositories by stars', async () => {
      await testSeeder.seedGitHubRepository({ starCount: 100 });
      await testSeeder.seedGitHubRepository({ starCount: 50 });
      await testSeeder.seedGitHubRepository({ starCount: 200 });

      const topRepos = await GitHubQueries.getTopRepositories(2);

      expect(topRepos).toHaveLength(2);
      expect(topRepos[0].starCount).toBe(200);
      expect(topRepos[1].starCount).toBe(100);
    });

    it('should update repository data', async () => {
      const githubId = 123456;
      const initialData = {
        githubId,
        name: 'initial-repo',
        fullName: 'user/initial-repo',
        starCount: 10,
        htmlUrl: 'https://github.com/user/initial-repo',
        cloneUrl: 'https://github.com/user/initial-repo.git',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // First update (create)
      await GitHubQueries.updateRepository(githubId, initialData);

      // Second update (update existing)
      await GitHubQueries.updateRepository(githubId, {
        starCount: 20,
        name: 'updated-repo'
      });

      const testDb = TestDatabaseUtils.getTestDb();
      const repo = await testDb.gitHubRepository.findUnique({
        where: { githubId }
      });

      expect(repo?.starCount).toBe(20);
      expect(repo?.name).toBe('updated-repo');
    });
  });

  describe('AnalyticsQueries', () => {
    it('should record page view', async () => {
      const pageViewData = {
        path: '/test-page',
        sessionId: 'test-session-123',
        userAgent: 'Test Browser',
        country: 'US'
      };

      await AnalyticsQueries.recordPageView(pageViewData);

      const testDb = TestDatabaseUtils.getTestDb();
      const pageViews = await testDb.pageView.findMany({
        where: { path: '/test-page' }
      });

      expect(pageViews).toHaveLength(1);
      expect(pageViews[0].sessionId).toBe('test-session-123');
    });

    it('should get popular pages', async () => {
      // Create multiple page views
      await testSeeder.seedPageView({ path: '/popular-page' });
      await testSeeder.seedPageView({ path: '/popular-page' });
      await testSeeder.seedPageView({ path: '/less-popular' });

      const popularPages = await AnalyticsQueries.getPopularPages(5);

      expect(popularPages).toHaveLength(2);
      expect(popularPages[0].path).toBe('/popular-page');
      expect(popularPages[0]._count.path).toBe(2);
    });

    it('should get visitor stats', async () => {
      // Create page views from different sessions
      await testSeeder.seedPageView({ sessionId: 'session-1' });
      await testSeeder.seedPageView({ sessionId: 'session-2' });
      await testSeeder.seedPageView({ sessionId: 'session-1' }); // Same session

      const stats = await AnalyticsQueries.getVisitorStats(30);

      expect(stats.totalViews).toBe(3);
      expect(stats.uniqueVisitors).toBe(2);
    });
  });

  describe('TestimonialQueries', () => {
    it('should get featured testimonials', async () => {
      const user = await testSeeder.seedUser();
      
      await testSeeder.seedTestimonial({ 
        authorId: user.id,
        featured: true,
        approved: true
      });
      await testSeeder.seedTestimonial({ 
        authorId: user.id,
        featured: false,
        approved: true
      });

      const featured = await TestimonialQueries.getFeatured();

      expect(featured).toHaveLength(1);
      expect(featured[0].featured).toBe(true);
    });
  });

  describe('ContactQueries', () => {
    it('should create contact submission', async () => {
      const contactData = MockDataGenerators.generateContactSubmission({
        name: 'Test Contact',
        email: 'test@example.com',
        type: 'PROJECT_INQUIRY'
      });

      const contact = await ContactQueries.create(contactData);

      expect(contact.name).toBe('Test Contact');
      expect(contact.email).toBe('test@example.com');
      expect(contact.type).toBe('PROJECT_INQUIRY');
    });

    it('should mark contact as responded', async () => {
      const contact = await testSeeder.seedContactSubmission({
        responded: false,
        status: 'NEW'
      });

      await ContactQueries.markAsResponded(contact.id);

      const testDb = TestDatabaseUtils.getTestDb();
      const updatedContact = await testDb.contactSubmission.findUnique({
        where: { id: contact.id }
      });

      expect(updatedContact?.responded).toBe(true);
      expect(updatedContact?.status).toBe('RESPONDED');
    });
  });

  describe('DatabaseUtils', () => {
    it('should perform health check', async () => {
      const isHealthy = await DatabaseUtils.healthCheck();
      expect(isHealthy).toBe(true);
    });

    it('should get database stats', async () => {
      // Seed some data
      const user = await testSeeder.seedUser();
      await testSeeder.seedProject({ authorId: user.id, publishedAt: new Date() });
      await testSeeder.seedBlogPost({ authorId: user.id, publishedAt: new Date() });
      await testSeeder.seedTestimonial({ authorId: user.id, approved: true });

      const stats = await DatabaseUtils.getStats();

      expect(stats.projects).toBe(1);
      expect(stats.blogPosts).toBe(1);
      expect(stats.testimonials).toBe(1);
    });
  });
});