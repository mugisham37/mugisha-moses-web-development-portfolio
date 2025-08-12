import React from "react";
import { render, RenderOptions, RenderResult } from "@testing-library/react";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Next.js Image component
jest.mock("next/image", () => {
  return function MockImage({ src, alt, onLoad, onError, ...props }: any) {
    return (
      <img
        src={src}
        alt={alt}
        onLoad={onLoad}
        onError={onError}
        data-testid="next-image"
        {...props}
      />
    );
  };
});

// Mock Framer Motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    button: ({ children, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
    section: ({ children, ...props }: any) => (
      <section {...props}>{children}</section>
    ),
    header: ({ children, ...props }: any) => (
      <header {...props}>{children}</header>
    ),
    nav: ({ children, ...props }: any) => <nav {...props}>{children}</nav>,
    main: ({ children, ...props }: any) => <main {...props}>{children}</main>,
    footer: ({ children, ...props }: any) => (
      <footer {...props}>{children}</footer>
    ),
    article: ({ children, ...props }: any) => (
      <article {...props}>{children}</article>
    ),
    aside: ({ children, ...props }: any) => (
      <aside {...props}>{children}</aside>
    ),
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    h3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
    img: ({ children, ...props }: any) => <img {...props}>{children}</img>,
    canvas: ({ children, ...props }: any) => (
      <canvas {...props}>{children}</canvas>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useInView: () => true,
  useMotionValue: () => ({ set: jest.fn(), get: () => 0 }),
  useTransform: () => ({ get: () => 0 }),
  useAnimation: () => ({
    start: jest.fn(),
    stop: jest.fn(),
    set: jest.fn(),
  }),
  useSpring: () => ({ get: () => 0 }),
  animate: jest.fn(),
}));

// Mock Three.js
jest.mock("three", () => ({
  Scene: jest.fn(() => ({
    add: jest.fn(),
    remove: jest.fn(),
  })),
  PerspectiveCamera: jest.fn(),
  WebGLRenderer: jest.fn(() => ({
    setSize: jest.fn(),
    render: jest.fn(),
    domElement: document.createElement("canvas"),
  })),
  Mesh: jest.fn(),
  BoxGeometry: jest.fn(),
  MeshBasicMaterial: jest.fn(),
  Color: jest.fn(),
}));

// Mock React Three Fiber
jest.mock("@react-three/fiber", () => ({
  Canvas: ({ children }: any) => (
    <canvas data-testid="three-canvas">{children}</canvas>
  ),
  useFrame: () => null,
  useThree: () => ({
    scene: {},
    camera: {},
    gl: {},
  }),
}));

// Mock React Three Drei
jest.mock("@react-three/drei", () => ({
  OrbitControls: () => null,
  Box: () => <mesh data-testid="three-box" />,
  Sphere: () => <mesh data-testid="three-sphere" />,
  Plane: () => <mesh data-testid="three-plane" />,
}));

// Mock Resend
jest.mock("resend", () => ({
  Resend: jest.fn(() => ({
    emails: {
      send: jest.fn().mockResolvedValue({ id: "test-email-id" }),
    },
  })),
}));

// Mock Uploadthing
jest.mock("@uploadthing/react", () => ({
  useUploadThing: () => ({
    startUpload: jest.fn(),
    isUploading: false,
    permittedFileInfo: {},
  }),
  generateUploadButton: () => () => <button>Upload</button>,
  generateUploadDropzone: () => () => <div>Dropzone</div>,
}));

// Test providers wrapper
interface ProvidersProps {
  children: React.ReactNode;
  session?: Session | null;
  theme?: "light" | "dark";
}

const TestProviders: React.FC<ProvidersProps> = ({
  children,
  session = null,
  theme = "light",
}) => {
  return (
    <SessionProvider session={session}>
      <ThemeProvider defaultTheme={theme} storageKey="test-theme">
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
};

// Custom render function
interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  session?: Session | null;
  theme?: "light" | "dark";
}

export function renderWithProviders(
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
): RenderResult {
  const { session, theme, ...renderOptions } = options;

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <TestProviders session={session} theme={theme}>
      {children}
    </TestProviders>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Mock data generators for components
export const mockComponentData = {
  user: {
    id: "test-user-id",
    name: "Test User",
    email: "test@example.com",
    image: "/test-avatar.jpg",
  },

  session: {
    user: {
      id: "test-user-id",
      name: "Test User",
      email: "test@example.com",
      image: "/test-avatar.jpg",
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  },

  project: {
    id: "test-project-id",
    title: "Test Project",
    slug: "test-project",
    description: "A test project for unit testing",
    content: "This is test content for the project.",
    technologies: ["React", "TypeScript", "Next.js"],
    githubUrl: "https://github.com/test/project",
    liveUrl: "https://test-project.vercel.app",
    status: "ACTIVE" as const,
    featured: true,
    thumbnail: "/test-thumbnail.jpg",
    images: ["/test-image-1.jpg", "/test-image-2.jpg"],
    viewCount: 100,
    likeCount: 25,
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
  },

  blogPost: {
    id: "test-blog-post-id",
    title: "Test Blog Post",
    slug: "test-blog-post",
    excerpt: "This is a test blog post excerpt.",
    content: "# Test Blog Post\n\nThis is test content.",
    status: "PUBLISHED" as const,
    featured: true,
    publishedAt: new Date(),
    viewCount: 50,
    readingTime: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  testimonial: {
    id: "test-testimonial-id",
    name: "Test Client",
    role: "CEO",
    company: "Test Company Inc.",
    content: "This is a test testimonial content.",
    rating: 5,
    featured: true,
    approved: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  githubRepository: {
    id: "test-repo-id",
    name: "test-repo",
    fullName: "testuser/test-repo",
    description: "A test repository",
    language: "TypeScript",
    starCount: 50,
    forkCount: 10,
    watcherCount: 25,
    htmlUrl: "https://github.com/testuser/test-repo",
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  contactSubmission: {
    id: "test-contact-id",
    name: "Test Contact",
    email: "contact@example.com",
    subject: "Test Subject",
    message: "This is a test contact message.",
    type: "GENERAL" as const,
    status: "NEW" as const,
    responded: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

// Mock API responses
export const mockApiResponses = {
  projects: {
    getAll: {
      success: true,
      data: [mockComponentData.project],
      total: 1,
      page: 1,
      limit: 10,
    },
    getBySlug: {
      success: true,
      data: mockComponentData.project,
    },
  },

  blog: {
    getAll: {
      success: true,
      data: [mockComponentData.blogPost],
      total: 1,
      page: 1,
      limit: 10,
    },
    getBySlug: {
      success: true,
      data: mockComponentData.blogPost,
    },
  },

  github: {
    repositories: {
      success: true,
      data: [mockComponentData.githubRepository],
    },
    contributions: {
      success: true,
      data: {
        totalContributions: 365,
        weeks: [],
        longestStreak: 30,
        currentStreak: 5,
      },
    },
  },

  contact: {
    submit: {
      success: true,
      message: "Message sent successfully",
    },
  },

  testimonials: {
    getAll: {
      success: true,
      data: [mockComponentData.testimonial],
    },
  },
};

// Utility functions for testing
export const testUtils = {
  // Wait for animations to complete
  waitForAnimation: (duration = 300) =>
    new Promise((resolve) => setTimeout(resolve, duration)),

  // Mock intersection observer
  mockIntersectionObserver: () => {
    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    });
    window.IntersectionObserver = mockIntersectionObserver;
    return mockIntersectionObserver;
  },

  // Mock resize observer
  mockResizeObserver: () => {
    const mockResizeObserver = jest.fn();
    mockResizeObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    });
    window.ResizeObserver = mockResizeObserver;
    return mockResizeObserver;
  },

  // Mock match media
  mockMatchMedia: (matches = false) => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  },

  // Mock local storage
  mockLocalStorage: () => {
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
    });
    return localStorageMock;
  },

  // Mock fetch
  mockFetch: (response: any, status = 200) => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(response),
      text: () => Promise.resolve(JSON.stringify(response)),
    });
  },

  // Create mock event
  createMockEvent: (type: string, properties: Record<string, any> = {}) => ({
    type,
    preventDefault: jest.fn(),
    stopPropagation: jest.fn(),
    target: { value: "" },
    currentTarget: { value: "" },
    ...properties,
  }),

  // Assert accessibility
  assertAccessibility: async (container: HTMLElement) => {
    // Check for basic accessibility requirements
    const images = container.querySelectorAll("img");
    images.forEach((img) => {
      expect(img).toHaveAttribute("alt");
    });

    const buttons = container.querySelectorAll("button");
    buttons.forEach((button) => {
      expect(button).toHaveAttribute("type");
    });

    const inputs = container.querySelectorAll("input");
    inputs.forEach((input) => {
      const id = input.getAttribute("id");
      if (id) {
        const label = container.querySelector(`label[for="${id}"]`);
        const ariaLabel = input.getAttribute("aria-label");
        const ariaLabelledBy = input.getAttribute("aria-labelledby");

        expect(label || ariaLabel || ariaLabelledBy).toBeTruthy();
      }
    });
  },
};

// Export everything for easy importing
export * from "@testing-library/react";
export { renderWithProviders as render };
export { mockComponentData, mockApiResponses, testUtils };
