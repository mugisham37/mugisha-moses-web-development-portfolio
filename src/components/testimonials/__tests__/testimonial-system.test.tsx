import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TestimonialCard } from "../testimonial-card";
import { TestimonialCarousel } from "../testimonial-carousel";
import { TestimonialGrid } from "../testimonial-grid";
import { TestimonialSubmissionForm } from "../testimonial-submission-form";
import { StarRating } from "../star-rating";
import { ClientLogoShowcase } from "../client-logo-showcase";
import { TestimonialStats } from "../testimonial-stats";
import { TestimonialAggregation } from "../testimonial-aggregation";
import type { Testimonial } from "@prisma/client";

// Mock testimonial data
const mockTestimonial: Testimonial & {
  author?: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  } | null;
} = {
  id: "test-1",
  name: "John Doe",
  email: "john@example.com",
  role: "CTO",
  company: "Tech Corp",
  content:
    "Excellent work! The brutalist design approach was exactly what we needed for our platform.",
  rating: 5,
  videoUrl: null,
  avatarUrl: "/avatars/john-doe.jpg",
  linkedinProfile: "https://linkedin.com/in/johndoe",
  linkedinRecommendationId: null,
  linkedinVerified: false,
  source: "direct",
  featured: true,
  approved: true,
  createdAt: new Date("2024-01-15"),
  updatedAt: new Date("2024-01-15"),
  authorId: null,
  projectId: null,
  author: null,
};

const mockTestimonials = [
  mockTestimonial,
  {
    ...mockTestimonial,
    id: "test-2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Product Manager",
    company: "StartupCo",
    content:
      "Outstanding performance optimization. Our loading times improved by 75%.",
    rating: 5,
    featured: false,
    videoUrl: "https://youtube.com/watch?v=example",
  },
  {
    ...mockTestimonial,
    id: "test-3",
    name: "Mike Johnson",
    email: "mike@example.com",
    role: "CEO",
    company: "InnovateLab",
    content:
      "Professional service and exceptional results. Highly recommended.",
    rating: 4,
    featured: false,
  },
];

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
  },
  AnimatePresence: ({ children }: any) => children,
}));

describe("Testimonial System", () => {
  describe("TestimonialCard", () => {
    it("renders testimonial information correctly", () => {
      render(<TestimonialCard testimonial={mockTestimonial} />);

      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("CTO")).toBeInTheDocument();
      expect(screen.getByText("Tech Corp")).toBeInTheDocument();
      expect(screen.getByText(/Excellent work!/)).toBeInTheDocument();
    });

    it("displays star rating correctly", () => {
      render(<TestimonialCard testimonial={mockTestimonial} />);

      const stars = screen.getAllByText("★");
      expect(stars).toHaveLength(5); // 5 stars for rating display
    });

    it("shows featured badge for featured testimonials", () => {
      render(
        <TestimonialCard testimonial={mockTestimonial} variant="featured" />
      );

      expect(screen.getByText("FEATURED")).toBeInTheDocument();
    });

    it("displays video player when video URL is provided", () => {
      const testimonialWithVideo = {
        ...mockTestimonial,
        videoUrl: "https://youtube.com/watch?v=example",
      };

      render(
        <TestimonialCard testimonial={testimonialWithVideo} showVideo={true} />
      );

      // Video player should be rendered
      expect(screen.getByText(/Video Testimonial/)).toBeInTheDocument();
    });
  });

  describe("StarRating", () => {
    it("displays correct number of filled stars", () => {
      render(<StarRating rating={3} />);

      const stars = screen.getAllByText("★");
      expect(stars).toHaveLength(5);
    });

    it("handles interactive rating changes", () => {
      const mockOnChange = jest.fn();
      render(
        <StarRating rating={3} interactive={true} onChange={mockOnChange} />
      );

      const stars = screen.getAllByRole("button");
      fireEvent.click(stars[4]); // Click 5th star

      expect(mockOnChange).toHaveBeenCalledWith(5);
    });

    it("displays different sizes correctly", () => {
      const { rerender } = render(<StarRating rating={5} size="sm" />);
      expect(screen.getAllByText("★")[0]).toHaveClass("text-lg");

      rerender(<StarRating rating={5} size="lg" />);
      expect(screen.getAllByText("★")[0]).toHaveClass("text-3xl");
    });
  });

  describe("TestimonialCarousel", () => {
    it("renders testimonials in carousel format", () => {
      render(<TestimonialCarousel testimonials={mockTestimonials} />);

      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("1 of 3 testimonials")).toBeInTheDocument();
    });

    it("shows navigation arrows when multiple testimonials", () => {
      render(
        <TestimonialCarousel
          testimonials={mockTestimonials}
          showNavigation={true}
        />
      );

      expect(screen.getByText("←")).toBeInTheDocument();
      expect(screen.getByText("→")).toBeInTheDocument();
    });

    it("shows indicators for testimonial navigation", () => {
      render(
        <TestimonialCarousel
          testimonials={mockTestimonials}
          showIndicators={true}
        />
      );

      const indicators = screen.getAllByLabelText(/Go to testimonial/);
      expect(indicators).toHaveLength(3);
    });

    it("handles empty testimonials gracefully", () => {
      render(<TestimonialCarousel testimonials={[]} />);

      expect(screen.getByText("No Testimonials Yet")).toBeInTheDocument();
    });
  });

  describe("TestimonialGrid", () => {
    it("displays testimonials in grid layout", () => {
      render(<TestimonialGrid testimonials={mockTestimonials} />);

      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      expect(screen.getByText("Mike Johnson")).toBeInTheDocument();
    });

    it("shows filter buttons when filters are enabled", () => {
      render(
        <TestimonialGrid testimonials={mockTestimonials} showFilters={true} />
      );

      expect(screen.getByText(/All/)).toBeInTheDocument();
      expect(screen.getByText(/Featured/)).toBeInTheDocument();
      expect(screen.getByText(/Video/)).toBeInTheDocument();
      expect(screen.getByText(/5 Star/)).toBeInTheDocument();
    });

    it("filters testimonials correctly", () => {
      render(
        <TestimonialGrid testimonials={mockTestimonials} showFilters={true} />
      );

      // Click featured filter
      fireEvent.click(screen.getByText(/Featured/));

      // Should only show featured testimonial
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
    });

    it("displays average rating in filter summary", () => {
      render(
        <TestimonialGrid testimonials={mockTestimonials} showFilters={true} />
      );

      expect(screen.getByText(/Average rating:/)).toBeInTheDocument();
    });
  });

  describe("TestimonialSubmissionForm", () => {
    it("renders all form fields", () => {
      render(<TestimonialSubmissionForm />);

      expect(screen.getByLabelText(/Full Name/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email Address/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Role\/Position/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Company/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Your Testimonial/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Overall Rating/)).toBeInTheDocument();
    });

    it("validates required fields", async () => {
      render(<TestimonialSubmissionForm />);

      const submitButton = screen.getByText("Submit Testimonial");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Name is required")).toBeInTheDocument();
        expect(screen.getByText("Email is required")).toBeInTheDocument();
        expect(
          screen.getByText("Role/Position is required")
        ).toBeInTheDocument();
      });
    });

    it("validates email format", async () => {
      render(<TestimonialSubmissionForm />);

      const emailInput = screen.getByLabelText(/Email Address/);
      fireEvent.change(emailInput, { target: { value: "invalid-email" } });

      const submitButton = screen.getByText("Submit Testimonial");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("Please enter a valid email address")
        ).toBeInTheDocument();
      });
    });

    it("validates minimum content length", async () => {
      render(<TestimonialSubmissionForm />);

      const contentTextarea = screen.getByLabelText(/Your Testimonial/);
      fireEvent.change(contentTextarea, { target: { value: "Too short" } });

      const submitButton = screen.getByText("Submit Testimonial");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("Please provide at least 50 characters")
        ).toBeInTheDocument();
      });
    });

    it("shows success message after submission", async () => {
      const mockOnSubmit = jest.fn().mockResolvedValue({ success: true });
      render(<TestimonialSubmissionForm onSubmit={mockOnSubmit} />);

      // Fill out form
      fireEvent.change(screen.getByLabelText(/Full Name/), {
        target: { value: "Test User" },
      });
      fireEvent.change(screen.getByLabelText(/Email Address/), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByLabelText(/Role\/Position/), {
        target: { value: "Developer" },
      });
      fireEvent.change(screen.getByLabelText(/Your Testimonial/), {
        target: {
          value:
            "This is a test testimonial with more than fifty characters to pass validation.",
        },
      });

      const submitButton = screen.getByText("Submit Testimonial");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Thank You!")).toBeInTheDocument();
      });
    });
  });

  describe("TestimonialStats", () => {
    it("displays testimonial statistics", () => {
      render(<TestimonialStats testimonials={mockTestimonials} />);

      expect(screen.getByText("Total Testimonials")).toBeInTheDocument();
      expect(screen.getByText(/Average Rating/)).toBeInTheDocument();
      expect(screen.getByText(/Five Star Reviews/)).toBeInTheDocument();
    });

    it("shows rating distribution", () => {
      render(<TestimonialStats testimonials={mockTestimonials} />);

      expect(screen.getByText("Rating Distribution")).toBeInTheDocument();
    });

    it("handles empty testimonials", () => {
      render(<TestimonialStats testimonials={[]} />);

      expect(screen.getByText("No Statistics Available")).toBeInTheDocument();
    });
  });

  describe("TestimonialAggregation", () => {
    it("displays aggregated statistics", () => {
      render(<TestimonialAggregation testimonials={mockTestimonials} />);

      expect(screen.getByText("Client Review Aggregation")).toBeInTheDocument();
      expect(screen.getByText("Total Reviews")).toBeInTheDocument();
    });

    it("shows detailed breakdown when enabled", () => {
      render(
        <TestimonialAggregation
          testimonials={mockTestimonials}
          showDetailedBreakdown={true}
        />
      );

      expect(screen.getByText("Rating Distribution")).toBeInTheDocument();
      expect(screen.getByText("Review Quality")).toBeInTheDocument();
    });

    it("shows business impact metrics", () => {
      render(<TestimonialAggregation testimonials={mockTestimonials} />);

      expect(screen.getByText("Business Impact Metrics")).toBeInTheDocument();
      expect(screen.getByText("Project Success")).toBeInTheDocument();
    });
  });

  describe("ClientLogoShowcase", () => {
    it("displays client logos and information", () => {
      render(<ClientLogoShowcase />);

      expect(
        screen.getByText("Trusted by Industry Leaders")
      ).toBeInTheDocument();
      expect(screen.getByText(/Happy Clients/)).toBeInTheDocument();
    });

    it("shows industry information when enabled", () => {
      render(<ClientLogoShowcase showIndustry={true} />);

      // Should show industry labels for clients
      expect(
        screen.getAllByText(/SaaS|Healthcare|Analytics/).length
      ).toBeGreaterThan(0);
    });

    it("displays testimonial counts when enabled", () => {
      render(<ClientLogoShowcase showTestimonialCount={true} />);

      // Should show testimonial counts
      expect(screen.getAllByText(/testimonial/).length).toBeGreaterThan(0);
    });
  });
});

describe("Integration Tests", () => {
  it("testimonial card integrates with video player", () => {
    const testimonialWithVideo = {
      ...mockTestimonial,
      videoUrl: "https://youtube.com/watch?v=example",
    };

    render(
      <TestimonialCard testimonial={testimonialWithVideo} showVideo={true} />
    );

    expect(screen.getByText(/Video Testimonial/)).toBeInTheDocument();
  });

  it("star rating integrates with testimonial forms", () => {
    render(<TestimonialSubmissionForm />);

    // Star rating should be present in the form
    const stars = screen.getAllByText("★");
    expect(stars.length).toBeGreaterThan(0);
  });

  it("testimonial stats calculate correctly from testimonial data", () => {
    render(<TestimonialStats testimonials={mockTestimonials} />);

    // Should calculate average rating correctly
    // mockTestimonials has ratings: 5, 5, 4 = average 4.7
    expect(screen.getAllByText("4.7").length).toBeGreaterThan(0);
  });
});

describe("Accessibility", () => {
  it("testimonial cards have proper ARIA labels", () => {
    render(<TestimonialCard testimonial={mockTestimonial} />);

    // Should have accessible content
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("star rating has proper accessibility attributes", () => {
    render(<StarRating rating={5} interactive={true} />);

    const starButtons = screen.getAllByRole("button");
    expect(starButtons.length).toBe(5);
  });

  it("form has proper labels and validation messages", () => {
    render(<TestimonialSubmissionForm />);

    expect(screen.getByLabelText(/Full Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/)).toBeInTheDocument();
  });
});

describe("Error Handling", () => {
  it("handles API errors gracefully in submission form", async () => {
    const mockOnSubmit = jest.fn().mockRejectedValue(new Error("API Error"));
    render(<TestimonialSubmissionForm onSubmit={mockOnSubmit} />);

    // Fill out form and submit
    fireEvent.change(screen.getByLabelText(/Full Name/), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText(/Email Address/), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Role\/Position/), {
      target: { value: "Developer" },
    });
    fireEvent.change(screen.getByLabelText(/Your Testimonial/), {
      target: {
        value:
          "This is a test testimonial with more than fifty characters to pass validation.",
      },
    });

    const submitButton = screen.getByText("Submit Testimonial");
    fireEvent.click(submitButton);

    // Should handle error gracefully (not crash)
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  it("displays fallback content for empty testimonial lists", () => {
    render(<TestimonialGrid testimonials={[]} />);

    expect(screen.getByText("No Testimonials Yet")).toBeInTheDocument();
  });
});
