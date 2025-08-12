import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Header } from "../header";
import {
  renderWithProviders,
  mockComponentData,
} from "@/lib/test-utils/component-test-utils";

// Mock next/navigation
const mockPush = jest.fn();
const mockPathname = "/";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => mockPathname,
  useSearchParams: () => new URLSearchParams(),
}));

describe("Header Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders header with logo and navigation", () => {
    renderWithProviders(<Header />);

    // Check logo
    const logo = screen.getByText("BRUTALIST.DEV");
    expect(logo).toBeInTheDocument();
    expect(logo.closest("a")).toHaveAttribute("href", "/");

    // Check main navigation
    expect(screen.getByText("PROJECTS")).toBeInTheDocument();
    expect(screen.getByText("BLOG")).toBeInTheDocument();
    expect(screen.getByText("SERVICES")).toBeInTheDocument();
    expect(screen.getByText("CONTACT")).toBeInTheDocument();
  });

  it("highlights active navigation item", () => {
    renderWithProviders(<Header />);

    const homeLink = screen.getByText("HOME").closest("a");
    expect(homeLink).toHaveClass("text-yellow-400");
  });

  it("renders mobile menu toggle", () => {
    renderWithProviders(<Header />);

    const mobileToggle = screen.getByTestId("mobile-menu-toggle");
    expect(mobileToggle).toBeInTheDocument();
    expect(mobileToggle).toHaveAttribute("aria-label", "Toggle mobile menu");
  });

  it("opens and closes mobile menu", async () => {
    renderWithProviders(<Header />);

    const mobileToggle = screen.getByTestId("mobile-menu-toggle");
    const mobileMenu = screen.getByTestId("mobile-menu");

    // Menu should be closed initially
    expect(mobileMenu).toHaveClass("translate-x-full");

    // Open menu
    fireEvent.click(mobileToggle);
    await waitFor(() => {
      expect(mobileMenu).toHaveClass("translate-x-0");
    });

    // Close menu
    fireEvent.click(mobileToggle);
    await waitFor(() => {
      expect(mobileMenu).toHaveClass("translate-x-full");
    });
  });

  it("closes mobile menu when clicking outside", async () => {
    renderWithProviders(<Header />);

    const mobileToggle = screen.getByTestId("mobile-menu-toggle");
    const mobileMenu = screen.getByTestId("mobile-menu");

    // Open menu
    fireEvent.click(mobileToggle);
    await waitFor(() => {
      expect(mobileMenu).toHaveClass("translate-x-0");
    });

    // Click outside
    fireEvent.click(document.body);
    await waitFor(() => {
      expect(mobileMenu).toHaveClass("translate-x-full");
    });
  });

  it("closes mobile menu when pressing Escape", async () => {
    renderWithProviders(<Header />);

    const mobileToggle = screen.getByTestId("mobile-menu-toggle");
    const mobileMenu = screen.getByTestId("mobile-menu");

    // Open menu
    fireEvent.click(mobileToggle);
    await waitFor(() => {
      expect(mobileMenu).toHaveClass("translate-x-0");
    });

    // Press Escape
    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => {
      expect(mobileMenu).toHaveClass("translate-x-full");
    });
  });

  it("shows theme toggle", () => {
    renderWithProviders(<Header />);

    const themeToggle = screen.getByTestId("theme-toggle");
    expect(themeToggle).toBeInTheDocument();
  });

  it("applies scroll-based styling", () => {
    renderWithProviders(<Header />);

    const header = screen.getByRole("banner");

    // Simulate scroll
    Object.defineProperty(window, "scrollY", { value: 100, writable: true });
    fireEvent.scroll(window);

    // Header should have scrolled class
    expect(header).toHaveClass("bg-black/90", "backdrop-blur-sm");
  });

  it("handles navigation clicks", () => {
    renderWithProviders(<Header />);

    const projectsLink = screen.getByText("PROJECTS").closest("a");
    expect(projectsLink).toHaveAttribute("href", "/projects");

    const blogLink = screen.getByText("BLOG").closest("a");
    expect(blogLink).toHaveAttribute("href", "/blog");

    const servicesLink = screen.getByText("SERVICES").closest("a");
    expect(servicesLink).toHaveAttribute("href", "/services");

    const contactLink = screen.getByText("CONTACT").closest("a");
    expect(contactLink).toHaveAttribute("href", "/contact");
  });

  it("shows user menu when authenticated", () => {
    renderWithProviders(<Header />, {
      session: mockComponentData.session,
    });

    const userMenu = screen.getByTestId("user-menu");
    expect(userMenu).toBeInTheDocument();

    const userAvatar = screen.getByAltText("User avatar");
    expect(userAvatar).toBeInTheDocument();
  });

  it("shows admin link for admin users", () => {
    renderWithProviders(<Header />, {
      session: {
        ...mockComponentData.session,
        user: {
          ...mockComponentData.session.user,
          role: "ADMIN",
        },
      },
    });

    const adminLink = screen.getByText("ADMIN");
    expect(adminLink).toBeInTheDocument();
    expect(adminLink.closest("a")).toHaveAttribute("href", "/admin");
  });

  it("handles keyboard navigation", () => {
    renderWithProviders(<Header />);

    const logo = screen.getByText("BRUTALIST.DEV").closest("a");
    const projectsLink = screen.getByText("PROJECTS").closest("a");

    // Tab navigation
    logo?.focus();
    expect(logo).toHaveFocus();

    fireEvent.keyDown(logo!, { key: "Tab" });
    expect(projectsLink).toHaveFocus();
  });

  it("maintains accessibility", () => {
    renderWithProviders(<Header />);

    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();

    const nav = screen.getByRole("navigation");
    expect(nav).toBeInTheDocument();

    const mobileToggle = screen.getByTestId("mobile-menu-toggle");
    expect(mobileToggle).toHaveAttribute("aria-expanded", "false");
    expect(mobileToggle).toHaveAttribute("aria-controls", "mobile-menu");
  });

  it("updates mobile menu aria-expanded state", async () => {
    renderWithProviders(<Header />);

    const mobileToggle = screen.getByTestId("mobile-menu-toggle");

    // Initially closed
    expect(mobileToggle).toHaveAttribute("aria-expanded", "false");

    // Open menu
    fireEvent.click(mobileToggle);
    await waitFor(() => {
      expect(mobileToggle).toHaveAttribute("aria-expanded", "true");
    });
  });

  it("handles responsive breakpoints", () => {
    renderWithProviders(<Header />);

    // Desktop navigation should be visible
    const desktopNav = screen.getByTestId("desktop-nav");
    expect(desktopNav).toHaveClass("hidden", "md:flex");

    // Mobile toggle should be visible on mobile
    const mobileToggle = screen.getByTestId("mobile-menu-toggle");
    expect(mobileToggle).toHaveClass("md:hidden");
  });

  it("preserves scroll position when menu opens", async () => {
    renderWithProviders(<Header />);

    // Set initial scroll position
    Object.defineProperty(window, "scrollY", { value: 200, writable: true });

    const mobileToggle = screen.getByTestId("mobile-menu-toggle");
    fireEvent.click(mobileToggle);

    // Scroll position should be preserved
    expect(window.scrollY).toBe(200);
  });

  it("shows loading state during navigation", async () => {
    renderWithProviders(<Header />);

    const projectsLink = screen.getByText("PROJECTS").closest("a");
    fireEvent.click(projectsLink!);

    // Should show loading indicator
    await waitFor(() => {
      const loadingIndicator = screen.queryByTestId("nav-loading");
      expect(loadingIndicator).toBeInTheDocument();
    });
  });

  it("handles logo click navigation", () => {
    renderWithProviders(<Header />);

    const logo = screen.getByText("BRUTALIST.DEV").closest("a");
    expect(logo).toHaveAttribute("href", "/");
  });

  it("applies brutalist design system styles", () => {
    renderWithProviders(<Header />);

    const header = screen.getByRole("banner");
    expect(header).toHaveClass("border-b-2", "border-white");

    const logo = screen.getByText("BRUTALIST.DEV");
    expect(logo).toHaveClass("font-mono", "font-bold", "uppercase");
  });
});
