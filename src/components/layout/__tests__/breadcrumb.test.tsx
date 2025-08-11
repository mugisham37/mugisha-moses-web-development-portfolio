import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { Breadcrumb, PageHeader } from "../breadcrumb";

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    li: ({ children, ...props }: any) => <li {...props}>{children}</li>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

describe("Breadcrumb", () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue("/projects/web-development");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders breadcrumbs from provided items", () => {
    const items = [
      { label: "Home", href: "/" },
      { label: "Projects", href: "/projects" },
      {
        label: "Web Development",
        href: "/projects/web-development",
        isCurrentPage: true,
      },
    ];

    render(<Breadcrumb items={items} />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("Web Development")).toBeInTheDocument();
  });

  it("generates breadcrumbs from pathname when no items provided", () => {
    mockUsePathname.mockReturnValue("/projects/web-development");

    render(<Breadcrumb />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("Web Development")).toBeInTheDocument();
  });

  it("does not render on home page without explicit items", () => {
    mockUsePathname.mockReturnValue("/");

    const { container } = render(<Breadcrumb />);

    expect(container.firstChild).toBeNull();
  });

  it("hides home breadcrumb when showHome is false", () => {
    const items = [
      { label: "Home", href: "/" },
      { label: "Projects", href: "/projects", isCurrentPage: true },
    ];

    render(<Breadcrumb items={items} showHome={false} />);

    expect(screen.queryByText("Home")).not.toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
  });

  it("marks current page with aria-current", () => {
    const items = [
      { label: "Home", href: "/" },
      { label: "Projects", href: "/projects", isCurrentPage: true },
    ];

    render(<Breadcrumb items={items} />);

    const currentPageElement = screen.getByText("Projects");
    expect(currentPageElement).toHaveAttribute("aria-current", "page");
  });
});

describe("PageHeader", () => {
  it("renders title and description", () => {
    render(
      <PageHeader
        title="Projects"
        description="Explore my latest work and achievements"
      />
    );

    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(
      screen.getByText("Explore my latest work and achievements")
    ).toBeInTheDocument();
  });

  it("renders breadcrumbs by default", () => {
    mockUsePathname.mockReturnValue("/projects");

    render(<PageHeader title="Projects" />);

    // Should render breadcrumbs
    expect(
      screen.getByRole("navigation", { name: "Breadcrumb navigation" })
    ).toBeInTheDocument();
  });

  it("hides breadcrumbs when showBreadcrumbs is false", () => {
    render(<PageHeader title="Projects" showBreadcrumbs={false} />);

    expect(
      screen.queryByRole("navigation", { name: "Breadcrumb navigation" })
    ).not.toBeInTheDocument();
  });

  it("renders custom breadcrumb items", () => {
    const breadcrumbItems = [
      { label: "Home", href: "/" },
      { label: "Custom", href: "/custom", isCurrentPage: true },
    ];

    render(<PageHeader title="Projects" breadcrumbItems={breadcrumbItems} />);

    expect(screen.getByText("Custom")).toBeInTheDocument();
  });

  it("renders children content", () => {
    render(
      <PageHeader title="Projects">
        <button>Custom Action</button>
      </PageHeader>
    );

    expect(screen.getByText("Custom Action")).toBeInTheDocument();
  });
});
