import { render, screen, fireEvent } from "@testing-library/react";
import { Card, CardHeader, CardContent, CardFooter } from "../card";
import { renderWithProviders } from "@/lib/test-utils/component-test-utils";

describe("Card Components", () => {
  describe("Card", () => {
    it("renders with default props", () => {
      render(<Card>Card content</Card>);

      const card = screen.getByText("Card content");
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass("border-2", "border-white", "bg-black");
    });

    it("renders different variants correctly", () => {
      const { rerender } = render(<Card variant="default">Default</Card>);
      expect(screen.getByText("Default")).toHaveClass(
        "bg-black",
        "border-white"
      );

      rerender(<Card variant="elevated">Elevated</Card>);
      expect(screen.getByText("Elevated")).toHaveClass("shadow-brutal");

      rerender(<Card variant="interactive">Interactive</Card>);
      expect(screen.getByText("Interactive")).toHaveClass("cursor-pointer");

      rerender(<Card variant="accent">Accent</Card>);
      expect(screen.getByText("Accent")).toHaveClass("border-yellow-400");
    });

    it("applies different padding sizes", () => {
      const { rerender } = render(<Card padding="none">No padding</Card>);
      expect(screen.getByText("No padding")).toHaveClass("p-0");

      rerender(<Card padding="sm">Small padding</Card>);
      expect(screen.getByText("Small padding")).toHaveClass("p-3");

      rerender(<Card padding="md">Medium padding</Card>);
      expect(screen.getByText("Medium padding")).toHaveClass("p-6");

      rerender(<Card padding="lg">Large padding</Card>);
      expect(screen.getByText("Large padding")).toHaveClass("p-8");
    });

    it("handles hover effects", () => {
      const { rerender } = render(<Card hover="lift">Lift hover</Card>);
      expect(screen.getByText("Lift hover")).toHaveClass(
        "hover:translate-y-[-4px]"
      );

      rerender(<Card hover="glow">Glow hover</Card>);
      expect(screen.getByText("Glow hover")).toHaveClass("hover:shadow-glow");

      rerender(<Card hover="invert">Invert hover</Card>);
      expect(screen.getByText("Invert hover")).toHaveClass(
        "hover:bg-white",
        "hover:text-black"
      );
    });

    it("handles interactive states", () => {
      const handleClick = jest.fn();
      render(
        <Card variant="interactive" onClick={handleClick}>
          Interactive card
        </Card>
      );

      const card = screen.getByText("Interactive card");
      fireEvent.click(card);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("applies custom className", () => {
      render(<Card className="custom-class">Custom</Card>);

      const card = screen.getByText("Custom");
      expect(card).toHaveClass("custom-class");
    });

    it("has proper accessibility for interactive cards", () => {
      render(
        <Card variant="interactive" role="button" tabIndex={0}>
          Interactive card
        </Card>
      );

      const card = screen.getByRole("button");
      expect(card).toHaveAttribute("tabIndex", "0");
    });
  });

  describe("CardHeader", () => {
    it("renders header content", () => {
      render(
        <Card>
          <CardHeader>Header content</CardHeader>
        </Card>
      );

      const header = screen.getByText("Header content");
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass("border-b-2", "border-white", "pb-4", "mb-4");
    });

    it("applies custom className", () => {
      render(
        <Card>
          <CardHeader className="custom-header">Header</CardHeader>
        </Card>
      );

      const header = screen.getByText("Header");
      expect(header).toHaveClass("custom-header");
    });
  });

  describe("CardContent", () => {
    it("renders content", () => {
      render(
        <Card>
          <CardContent>Content here</CardContent>
        </Card>
      );

      const content = screen.getByText("Content here");
      expect(content).toBeInTheDocument();
      expect(content).toHaveClass("flex-1");
    });

    it("applies custom className", () => {
      render(
        <Card>
          <CardContent className="custom-content">Content</CardContent>
        </Card>
      );

      const content = screen.getByText("Content");
      expect(content).toHaveClass("custom-content");
    });
  });

  describe("CardFooter", () => {
    it("renders footer content", () => {
      render(
        <Card>
          <CardFooter>Footer content</CardFooter>
        </Card>
      );

      const footer = screen.getByText("Footer content");
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass("border-t-2", "border-white", "pt-4", "mt-4");
    });

    it("applies custom className", () => {
      render(
        <Card>
          <CardFooter className="custom-footer">Footer</CardFooter>
        </Card>
      );

      const footer = screen.getByText("Footer");
      expect(footer).toHaveClass("custom-footer");
    });
  });

  describe("Complete Card Structure", () => {
    it("renders full card with all sections", () => {
      render(
        <Card>
          <CardHeader>Card Title</CardHeader>
          <CardContent>Card body content goes here</CardContent>
          <CardFooter>Card footer</CardFooter>
        </Card>
      );

      expect(screen.getByText("Card Title")).toBeInTheDocument();
      expect(
        screen.getByText("Card body content goes here")
      ).toBeInTheDocument();
      expect(screen.getByText("Card footer")).toBeInTheDocument();
    });

    it("maintains proper structure and spacing", () => {
      render(
        <Card padding="md">
          <CardHeader>Header</CardHeader>
          <CardContent>Content</CardContent>
          <CardFooter>Footer</CardFooter>
        </Card>
      );

      const card = screen.getByText("Header").closest("div");
      expect(card).toHaveClass("p-6");

      const header = screen.getByText("Header");
      expect(header).toHaveClass("pb-4", "mb-4");

      const footer = screen.getByText("Footer");
      expect(footer).toHaveClass("pt-4", "mt-4");
    });
  });
});
