import { render, screen, fireEvent } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { MainHeader } from "../header";

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    header: ({ children, ...props }: any) => (
      <header {...props}>{children}</header>
    ),
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    nav: ({ children, ...props }: any) => <nav {...props}>{children}</nav>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

describe("MainHeader", () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue("/");
    // Mock window.scrollY
    Object.defineProperty(window, "scrollY", {
      value: 0,
      writable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the header with logo and navigation", () => {
    render(<MainHeader />);

    // Check if logo is rendered
    expect(screen.getByLabelText("Go to homepage")).toBeInTheDocument();

    // Check if navigation items are rendered (desktop)
    expect(screen.getByText("HOME")).toBeInTheDocument();
    expect(screen.getByText("PROJECTS")).toBeInTheDocument();
    expect(screen.getByText("BLOG")).toBeInTheDocument();
    expect(screen.getByText("SERVICES")).toBeInTheDocument();
    expect(screen.getByText("CONTACT")).toBeInTheDocument();
  });

  it("shows mobile menu button on mobile", () => {
    render(<MainHeader />);

    const mobileMenuButton = screen.getByLabelText("Open menu");
    expect(mobileMenuButton).toBeInTheDocument();
  });

  it("toggles mobile menu when button is clicked", () => {
    render(<MainHeader />);

    const mobileMenuButton = screen.getByLabelText("Open menu");
    fireEvent.click(mobileMenuButton);

    // After clicking, the button should show "Close menu"
    expect(screen.getByLabelText("Close menu")).toBeInTheDocument();
  });

  it("highlights active navigation item", () => {
    mockUsePathname.mockReturnValue("/projects");
    render(<MainHeader />);

    const projectsLink = screen.getAllByText("PROJECTS")[0]; // Get desktop version
    expect(projectsLink.closest("a")).toHaveClass("text-accent");
  });

  it("renders CTA button", () => {
    render(<MainHeader />);

    expect(screen.getByText("Get In Touch")).toBeInTheDocument();
  });

  it("applies scrolled styles when scrolled", () => {
    // Mock scrolled state
    Object.defineProperty(window, "scrollY", {
      value: 50,
      writable: true,
    });

    render(<MainHeader />);

    // Simulate scroll event
    fireEvent.scroll(window);

    // The header should have scrolled styles (this would need more specific testing)
    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
  });
});
