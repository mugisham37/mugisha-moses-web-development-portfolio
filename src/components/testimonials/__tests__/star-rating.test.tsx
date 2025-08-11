import { render, screen, fireEvent } from "@testing-library/react";
import { StarRating } from "../star-rating";

describe("StarRating", () => {
  it("renders correct number of stars", () => {
    render(<StarRating rating={3} />);
    const stars = screen.getAllByText("★");
    expect(stars).toHaveLength(5); // Default maxRating is 5
  });

  it("displays correct rating visually", () => {
    render(<StarRating rating={3} />);
    const stars = screen.getAllByText("★");

    // First 3 stars should be filled (yellow)
    expect(stars[0]).toHaveClass("text-brutalist-yellow");
    expect(stars[1]).toHaveClass("text-brutalist-yellow");
    expect(stars[2]).toHaveClass("text-brutalist-yellow");

    // Last 2 stars should be empty (gray)
    expect(stars[3]).toHaveClass("text-gray-600");
    expect(stars[4]).toHaveClass("text-gray-600");
  });

  it("handles interactive mode", () => {
    const mockOnChange = jest.fn();
    render(
      <StarRating rating={2} interactive={true} onChange={mockOnChange} />
    );

    const stars = screen.getAllByText("★");
    fireEvent.click(stars[3]); // Click 4th star (rating 4)

    expect(mockOnChange).toHaveBeenCalledWith(4);
  });

  it("shows hover effects in interactive mode", () => {
    const mockOnChange = jest.fn();
    render(
      <StarRating rating={2} interactive={true} onChange={mockOnChange} />
    );

    const stars = screen.getAllByText("★");
    fireEvent.mouseEnter(stars[3]); // Hover 4th star

    // Should show hover rating
    expect(stars[3]).toHaveClass("text-brutalist-yellow");
  });

  it("respects custom maxRating", () => {
    render(<StarRating rating={3} maxRating={10} />);
    const stars = screen.getAllByText("★");
    expect(stars).toHaveLength(10);
  });

  it("applies size classes correctly", () => {
    const { rerender } = render(<StarRating rating={3} size="sm" />);
    let stars = screen.getAllByText("★");
    expect(stars[0]).toHaveClass("text-lg");

    rerender(<StarRating rating={3} size="md" />);
    stars = screen.getAllByText("★");
    expect(stars[0]).toHaveClass("text-2xl");

    rerender(<StarRating rating={3} size="lg" />);
    stars = screen.getAllByText("★");
    expect(stars[0]).toHaveClass("text-3xl");
  });

  it("is not interactive by default", () => {
    render(<StarRating rating={3} />);
    const stars = screen.getAllByText("★");

    expect(stars[0]).toHaveClass("cursor-default");
    expect(stars[0]).not.toHaveClass("cursor-pointer");
  });
});
