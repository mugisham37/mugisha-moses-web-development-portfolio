import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MainFooter } from "../footer";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
}));

describe("MainFooter", () => {
  it("renders footer with all sections", () => {
    render(<MainFooter />);

    // Check brand section
    expect(screen.getByText("Developer Name")).toBeInTheDocument();

    // Check navigation section
    expect(screen.getByText("Navigation")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();

    // Check connect section
    expect(screen.getByText("Connect")).toBeInTheDocument();
    expect(screen.getByText("GitHub")).toBeInTheDocument();
    expect(screen.getByText("LinkedIn")).toBeInTheDocument();

    // Check newsletter section
    expect(screen.getByText("Stay Updated")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("your@email.com")).toBeInTheDocument();
  });

  it("handles newsletter subscription", async () => {
    render(<MainFooter />);

    const emailInput = screen.getByPlaceholderText("your@email.com");
    const subscribeButton = screen.getByText("Subscribe");

    // Enter email
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    // Submit form
    fireEvent.click(subscribeButton);

    // Check loading state
    expect(screen.getByText("Subscribing...")).toBeInTheDocument();

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText("Successfully subscribed!")).toBeInTheDocument();
    });
  });

  it("renders copyright with current year", () => {
    render(<MainFooter />);

    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(`© ${currentYear} Developer Name. All rights reserved.`)
    ).toBeInTheDocument();
  });

  it("renders back to top button", () => {
    render(<MainFooter />);

    const backToTopButton = screen.getByText("↑ Top");
    expect(backToTopButton).toBeInTheDocument();
  });

  it("handles back to top click", () => {
    // Mock window.scrollTo
    const mockScrollTo = jest.fn();
    Object.defineProperty(window, "scrollTo", {
      value: mockScrollTo,
      writable: true,
    });

    render(<MainFooter />);

    const backToTopButton = screen.getByText("↑ Top");
    fireEvent.click(backToTopButton);

    expect(mockScrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("renders social links with correct attributes", () => {
    render(<MainFooter />);

    const githubLink = screen.getByText("GitHub").closest("a");
    const linkedinLink = screen.getByText("LinkedIn").closest("a");

    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");

    expect(linkedinLink).toHaveAttribute("target", "_blank");
    expect(linkedinLink).toHaveAttribute("rel", "noopener noreferrer");
  });
});
