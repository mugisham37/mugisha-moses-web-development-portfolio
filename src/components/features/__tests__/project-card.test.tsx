import { render, screen } from "@testing-library/react";
import { ProjectCard } from "../project-card";
import { ProjectWithRelations } from "@/lib/types";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

// Mock next/link
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const mockProject: ProjectWithRelations = {
  id: "1",
  title: "Test Project",
  slug: "test-project",
  description: "This is a test project description",
  content: "Test content",
  technologies: ["React", "TypeScript", "Next.js"],
  githubUrl: "https://github.com/test/project",
  liveUrl: "https://test-project.com",
  status: "ACTIVE",
  featured: true,
  thumbnail: "/test-thumbnail.jpg",
  images: ["/test-image-1.jpg", "/test-image-2.jpg"],
  videoUrl: "https://youtube.com/test",
  viewCount: 100,
  likeCount: 25,
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
  publishedAt: new Date("2024-01-01"),
  categories: [
    {
      id: "cat1",
      name: "Web Development",
      slug: "web-development",
      description: "Web development projects",
      color: "#FFFF00",
    },
  ],
  author: {
    id: "author1",
    name: "Test Author",
    email: "test@example.com",
  },
  analytics: [],
};

describe("ProjectCard", () => {
  it("renders project information correctly", () => {
    render(<ProjectCard project={mockProject} />);

    expect(screen.getByText("Test Project")).toBeInTheDocument();
    expect(
      screen.getByText("This is a test project description")
    ).toBeInTheDocument();
    expect(screen.getByText("FEATURED")).toBeInTheDocument();
    expect(screen.getByText("WEB DEVELOPMENT")).toBeInTheDocument();
    expect(screen.getByText("REACT")).toBeInTheDocument();
    expect(screen.getByText("TYPESCRIPT")).toBeInTheDocument();
    expect(screen.getByText("NEXT.JS")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument(); // view count
    expect(screen.getByText("25")).toBeInTheDocument(); // like count
  });

  it("renders action buttons when URLs are provided", () => {
    render(<ProjectCard project={mockProject} />);

    expect(screen.getByText("LIVE")).toBeInTheDocument();
    expect(screen.getByText("CODE")).toBeInTheDocument();
  });

  it("does not render action buttons when URLs are not provided", () => {
    const projectWithoutUrls = {
      ...mockProject,
      githubUrl: undefined,
      liveUrl: undefined,
    };

    render(<ProjectCard project={projectWithoutUrls} />);

    expect(screen.queryByText("LIVE")).not.toBeInTheDocument();
    expect(screen.queryByText("CODE")).not.toBeInTheDocument();
  });

  it("renders compact variant correctly", () => {
    render(<ProjectCard project={mockProject} variant="compact" />);

    expect(screen.getByText("Test Project")).toBeInTheDocument();
    // In compact mode, fewer technologies should be shown
    expect(screen.getByText("REACT")).toBeInTheDocument();
  });

  it("hides metrics when showMetrics is false", () => {
    render(<ProjectCard project={mockProject} showMetrics={false} />);

    expect(screen.queryByText("100")).not.toBeInTheDocument();
    expect(screen.queryByText("25")).not.toBeInTheDocument();
  });

  it("hides categories when showCategories is false", () => {
    render(<ProjectCard project={mockProject} showCategories={false} />);

    expect(screen.queryByText("WEB DEVELOPMENT")).not.toBeInTheDocument();
  });
});
