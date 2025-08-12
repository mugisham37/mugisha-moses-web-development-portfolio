import { NextRequest } from "next/server";
import { GET, POST, PUT, DELETE } from "../projects/route";
import {
  TestDatabaseUtils,
  MockDataGenerators,
  TestSeeder,
} from "@/lib/test-utils/db-test-utils";

// Mock authentication
jest.mock("@/lib/auth", () => ({
  getServerSession: jest.fn(),
}));

// Mock database
jest.mock("@/lib/db", () => ({
  db: {
    project: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  },
}));

import { getServerSession } from "@/lib/auth";
import { db } from "@/lib/db";

const mockGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>;
const mockDb = db as jest.Mocked<typeof db>;

describe("/api/projects", () => {
  let testSeeder: TestSeeder;

  beforeAll(async () => {
    await TestDatabaseUtils.setup();
    testSeeder = new TestSeeder(TestDatabaseUtils.getTestDb());
  });

  afterAll(async () => {
    await TestDatabaseUtils.teardown();
  });

  beforeEach(async () => {
    await TestDatabaseUtils.reset();
    jest.clearAllMocks();
  });

  describe("GET /api/projects", () => {
    it("returns paginated projects", async () => {
      const mockProjects = MockDataGenerators.generateProjects(5);
      mockDb.project.findMany.mockResolvedValue(mockProjects);
      mockDb.project.count.mockResolvedValue(5);

      const request = new NextRequest("http://localhost:3000/api/projects");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(5);
      expect(data.total).toBe(5);
      expect(data.page).toBe(1);
      expect(data.limit).toBe(10);
    });

    it("handles pagination parameters", async () => {
      const mockProjects = MockDataGenerators.generateProjects(3);
      mockDb.project.findMany.mockResolvedValue(mockProjects);
      mockDb.project.count.mockResolvedValue(15);

      const request = new NextRequest(
        "http://localhost:3000/api/projects?page=2&limit=3"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(mockDb.project.findMany).toHaveBeenCalledWith({
        skip: 3,
        take: 3,
        orderBy: { createdAt: "desc" },
        where: { status: "ACTIVE" },
        include: expect.any(Object),
      });

      expect(data.page).toBe(2);
      expect(data.limit).toBe(3);
    });

    it("filters by technology", async () => {
      const mockProjects = MockDataGenerators.generateProjects(2);
      mockDb.project.findMany.mockResolvedValue(mockProjects);
      mockDb.project.count.mockResolvedValue(2);

      const request = new NextRequest(
        "http://localhost:3000/api/projects?technology=React"
      );
      await GET(request);

      expect(mockDb.project.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { createdAt: "desc" },
        where: {
          status: "ACTIVE",
          technologies: { has: "React" },
        },
        include: expect.any(Object),
      });
    });

    it("filters by featured status", async () => {
      const mockProjects = MockDataGenerators.generateProjects(2, {
        featured: true,
      });
      mockDb.project.findMany.mockResolvedValue(mockProjects);
      mockDb.project.count.mockResolvedValue(2);

      const request = new NextRequest(
        "http://localhost:3000/api/projects?featured=true"
      );
      await GET(request);

      expect(mockDb.project.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { createdAt: "desc" },
        where: {
          status: "ACTIVE",
          featured: true,
        },
        include: expect.any(Object),
      });
    });

    it("searches projects by title and description", async () => {
      const mockProjects = MockDataGenerators.generateProjects(1);
      mockDb.project.findMany.mockResolvedValue(mockProjects);
      mockDb.project.count.mockResolvedValue(1);

      const request = new NextRequest(
        "http://localhost:3000/api/projects?search=portfolio"
      );
      await GET(request);

      expect(mockDb.project.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { createdAt: "desc" },
        where: {
          status: "ACTIVE",
          OR: [
            { title: { contains: "portfolio", mode: "insensitive" } },
            { description: { contains: "portfolio", mode: "insensitive" } },
          ],
        },
        include: expect.any(Object),
      });
    });

    it("handles database errors gracefully", async () => {
      mockDb.project.findMany.mockRejectedValue(new Error("Database error"));

      const request = new NextRequest("http://localhost:3000/api/projects");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Failed to fetch projects");
    });

    it("validates pagination limits", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/projects?limit=200"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("limit");
    });
  });

  describe("POST /api/projects", () => {
    it("creates a new project with admin authentication", async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: "admin-id", role: "ADMIN" },
      } as any);

      const newProject = MockDataGenerators.generateProject();
      mockDb.project.create.mockResolvedValue(newProject);

      const request = new NextRequest("http://localhost:3000/api/projects", {
        method: "POST",
        body: JSON.stringify({
          title: "New Project",
          description: "A new test project",
          technologies: ["React", "TypeScript"],
          githubUrl: "https://github.com/test/project",
          liveUrl: "https://project.vercel.app",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.title).toBe("New Project");
      expect(mockDb.project.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: "New Project",
          description: "A new test project",
          technologies: ["React", "TypeScript"],
          authorId: "admin-id",
        }),
      });
    });

    it("rejects unauthorized requests", async () => {
      mockGetServerSession.mockResolvedValue(null);

      const request = new NextRequest("http://localhost:3000/api/projects", {
        method: "POST",
        body: JSON.stringify({ title: "Unauthorized Project" }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Unauthorized");
    });

    it("rejects non-admin users", async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: "user-id", role: "USER" },
      } as any);

      const request = new NextRequest("http://localhost:3000/api/projects", {
        method: "POST",
        body: JSON.stringify({ title: "User Project" }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Forbidden");
    });

    it("validates required fields", async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: "admin-id", role: "ADMIN" },
      } as any);

      const request = new NextRequest("http://localhost:3000/api/projects", {
        method: "POST",
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("title");
    });

    it("generates slug from title", async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: "admin-id", role: "ADMIN" },
      } as any);

      const newProject = MockDataGenerators.generateProject({
        slug: "my-awesome-project",
      });
      mockDb.project.create.mockResolvedValue(newProject);

      const request = new NextRequest("http://localhost:3000/api/projects", {
        method: "POST",
        body: JSON.stringify({
          title: "My Awesome Project",
          description: "Description",
          technologies: ["React"],
        }),
      });

      await POST(request);

      expect(mockDb.project.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          slug: "my-awesome-project",
        }),
      });
    });

    it("handles duplicate slug errors", async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: "admin-id", role: "ADMIN" },
      } as any);

      mockDb.project.create.mockRejectedValue({
        code: "P2002",
        meta: { target: ["slug"] },
      });

      const request = new NextRequest("http://localhost:3000/api/projects", {
        method: "POST",
        body: JSON.stringify({
          title: "Duplicate Project",
          description: "Description",
          technologies: ["React"],
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("slug");
    });
  });

  describe("PUT /api/projects", () => {
    it("updates existing project with admin authentication", async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: "admin-id", role: "ADMIN" },
      } as any);

      const existingProject = MockDataGenerators.generateProject({
        id: "project-1",
      });
      const updatedProject = { ...existingProject, title: "Updated Project" };

      mockDb.project.findUnique.mockResolvedValue(existingProject);
      mockDb.project.update.mockResolvedValue(updatedProject);

      const request = new NextRequest("http://localhost:3000/api/projects", {
        method: "PUT",
        body: JSON.stringify({
          id: "project-1",
          title: "Updated Project",
        }),
      });

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.title).toBe("Updated Project");
    });

    it("returns 404 for non-existent project", async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: "admin-id", role: "ADMIN" },
      } as any);

      mockDb.project.findUnique.mockResolvedValue(null);

      const request = new NextRequest("http://localhost:3000/api/projects", {
        method: "PUT",
        body: JSON.stringify({
          id: "non-existent",
          title: "Updated Project",
        }),
      });

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Project not found");
    });
  });

  describe("DELETE /api/projects", () => {
    it("deletes project with admin authentication", async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: "admin-id", role: "ADMIN" },
      } as any);

      const existingProject = MockDataGenerators.generateProject({
        id: "project-1",
      });
      mockDb.project.findUnique.mockResolvedValue(existingProject);
      mockDb.project.delete.mockResolvedValue(existingProject);

      const request = new NextRequest(
        "http://localhost:3000/api/projects?id=project-1",
        {
          method: "DELETE",
        }
      );

      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe("Project deleted successfully");
    });

    it("returns 404 for non-existent project", async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: "admin-id", role: "ADMIN" },
      } as any);

      mockDb.project.findUnique.mockResolvedValue(null);

      const request = new NextRequest(
        "http://localhost:3000/api/projects?id=non-existent",
        {
          method: "DELETE",
        }
      );

      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Project not found");
    });
  });
});
