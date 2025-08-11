import { render, screen } from "@testing-library/react";
import { TestimonialCard } from "../testimonial-card";

const mockTestimonial = {
  id: "test-1",
  name: "John Doe",
  role: "CEO",
  company: "Test Company",
  content: "This is a test testimonial content that should be displayed.",
  rating: 5,
  videoUrl: null,
  avatarUrl: null,
  featured: false,
  approved: true,
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
  authorId: null,
  email: "john@test.com",
  author: null,
};

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe("TestimonialCard", () => {
  it("renders testimonial content correctly", () => {
    render(<TestimonialCard testimonial={mockTestimonial} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("CEO")).toBeInTheDocument();
    expect(screen.getByText("Test Company")).toBeInTheDocument();
    expect(
      screen.getByText(
        '"This is a test testimonial content that should be displayed."'
      )
    ).toBeInTheDocument();
  });

  it("displays star rating", () => {
    render(<TestimonialCard testimonial={mockTestimonial} />);

    const stars = screen.getAllByText("★");
    expect(stars).toHaveLength(5);

    // All stars should be filled for 5-star rating
    stars.forEach((star) => {
      expect(star).toHaveClass("text-brutalist-yellow");
    });
  });

  it("shows featured badge for featured testimonials", () => {
    const featuredTestimonial = { ...mockTestimonial, featured: true };
    render(
      <TestimonialCard testimonial={featuredTestimonial} variant="featured" />
    );

    expect(screen.getByText("FEATURED")).toBeInTheDocument();
  });

  it("renders compact variant correctly", () => {
    render(<TestimonialCard testimonial={mockTestimonial} variant="compact" />);

    // Should still show all content but with different styling
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(
      screen.getByText(
        '"This is a test testimonial content that should be displayed."'
      )
    ).toBeInTheDocument();
  });

  it("shows avatar placeholder when no avatar URL", () => {
    render(<TestimonialCard testimonial={mockTestimonial} />);

    expect(screen.getByText("👤")).toBeInTheDocument();
  });

  it("renders avatar image when URL provided", () => {
    const testimonialWithAvatar = {
      ...mockTestimonial,
      avatarUrl: "/test-avatar.jpg",
    };

    render(<TestimonialCard testimonial={testimonialWithAvatar} />);

    const avatar = screen.getByAltText("John Doe");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute("src", "/test-avatar.jpg");
  });

  it("shows LinkedIn verification for connected clients", () => {
    const testimonialWithAuthor = {
      ...mockTestimonial,
      author: {
        id: "user-1",
        name: "John Doe",
        email: "john@test.com",
        image: null,
      },
    };

    render(<TestimonialCard testimonial={testimonialWithAuthor} />);

    expect(
      screen.getByText("Verified client • LinkedIn connected")
    ).toBeInTheDocument();
  });

  it("handles testimonial without company", () => {
    const testimonialNoCompany = { ...mockTestimonial, company: null };
    render(<TestimonialCard testimonial={testimonialNoCompany} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("CEO")).toBeInTheDocument();
    expect(screen.queryByText("Test Company")).not.toBeInTheDocument();
  });
});
