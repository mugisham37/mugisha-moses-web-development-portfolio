import { render, screen } from "@testing-library/react";
import { Typography } from "../typography";

describe("Typography Component", () => {
  it("renders with default props", () => {
    render(<Typography>Default text</Typography>);
    
    const text = screen.getByText("Default text");
    expect(text).toBeInTheDocument();
    expect(text.tagName).toBe("P");
    expect(text).toHaveClass("text-white", "font-mono");
  });

  it("renders different variants with correct HTML tags", () => {
    const { rerender } = render(<Typography variant="display">Display</Typography>);
    expect(screen.getByText("Display").tagName).toBe("H1");
    expect(screen.getByText("Display")).toHaveClass("text-6xl", "font-bold", "uppercase");

    rerender(<Typography variant="h1">Heading 1</Typography>);
    expect(screen.getByText("Heading 1").tagName).toBe("H1");
    expect(screen.getByText("Heading 1")).toHaveClass("text-5xl", "font-bold", "uppercase");

    rerender(<Typography variant="h2">Heading 2</Typography>);
    expect(screen.getByText("Heading 2").tagName).toBe("H2");
    expect(screen.getByText("Heading 2")).toHaveClass("text-4xl", "font-bold", "uppercase");

    rerender(<Typography variant="h3">Heading 3</Typography>);
    expect(screen.getByText("Heading 3").tagName).toBe("H3");
    expect(screen.getByText("Heading 3")).toHaveClass("text-3xl", "font-bold", "uppercase");

    rerender(<Typography variant="h4">Heading 4</Typography>);
    expect(screen.getByText("Heading 4").tagName).toBe("H4");
    expect(screen.getByText("Heading 4")).toHaveClass("text-2xl", "font-bold", "uppercase");

    rerender(<Typography variant="body">Body text</Typography>);
    expect(screen.getByText("Body text").tagName).toBe("P");
    expect(screen.getByText("Body text")).toHaveClass("text-base");

    rerender(<Typography variant="caption">Caption text</Typography>);
    expect(screen.getByText("Caption text").tagName).toBe("SPAN");
    expect(screen.getByText("Caption text")).toHaveClass("text-sm", "opacity-75");

    rerender(<Typography variant="code">Code text</Typography>);
    expect(screen.getByText("Code text").tagName).toBe("CODE");
    expect(screen.getByText("Code text")).toHaveClass("bg-gray-800", "px-2", "py-1", "rounded");
  });

  it("applies different font weights", () => {
    const { rerender } = render(<Typography weight="normal">Normal weight</Typography>);
    expect(screen.getByText("Normal weight")).toHaveClass("font-normal");

    rerender(<Typography weight="bold">Bold weight</Typography>);
    expect(screen.getByText("Bold weight")).toHaveClass("font-bold");
  });

  it("applies text transformations", () => {
    const { rerender } = render(<Typography transform="none">No transform</Typography>);
    expect(screen.getByText("No transform")).toHaveClass("normal-case");

    rerender(<Typography transform="uppercase">Uppercase</Typography>);
    expect(screen.getByText("Uppercase")).toHaveClass("uppercase");

    rerender(<Typography transform="lowercase">Lowercase</Typography>);
    expect(screen.getByText("Lowercase")).toHaveClass("lowercase");
  });

  it("applies letter spacing", () => {
    const { rerender } = render(<Typography spacing="tight">Tight spacing</Typography>);
    expect(screen.getByText("Tight spacing")).toHaveClass("tracking-tight");

    rerender(<Typography spacing="normal">Normal spacing</Typography>);
    expect(screen.getByText("Normal spacing")).toHaveClass("tracking-normal");

    rerender(<Typography spacing="wide">Wide spacing</Typography>);
    expect(screen.getByText("Wide spacing")).toHaveClass("tracking-wide");
  });

  it("applies custom className", () => {
    render(<Typography className="custom-class">Custom</Typography>);
    
    const text = screen.getByText("Custom");
    expect(text).toHaveClass("custom-class");
  });

  it("renders as different HTML elements when specified", () => {
    render(<Typography as="span">Span element</Typography>);
    
    const text = screen.getByText("Span element");
    expect(text.tagName).toBe("SPAN");
  });

  it("combines multiple style props correctly", () => {
    render(
      <Typography 
        variant="h2" 
        weight="normal" 
        transform="lowercase" 
        spacing="wide"
      >
        Combined styles
      </Typography>
    );
    
    const text = screen.getByText("Combined styles");
    expect(text).toHaveClass("text-4xl", "font-normal", "lowercase", "tracking-wide");
    expect(text.tagName).toBe("H2");
  });

  it("handles nested content", () => {
    render(
      <Typography variant="body">
        Text with <strong>bold</strong> and <em>italic</em> content
      </Typography>
    );
    
    expect(screen.getByText("Text with")).toBeInTheDocument();
    expect(screen.getByText("bold")).toBeInTheDocument();
    expect(screen.getByText("italic")).toBeInTheDocument();
  });

  it("maintains accessibility with proper heading hierarchy", () => {
    render(
      <div>
        <Typography variant="h1">Main Title</Typography>
        <Typography variant="h2">Section Title</Typography>
        <Typography variant="h3">Subsection Title</Typography>
        <Typography variant="body">Body content</Typography>
      </div>
    );
    
    const h1 = screen.getByRole("heading", { level: 1 });
    const h2 = screen.getByRole("heading", { level: 2 });
    const h3 = screen.getByRole("heading", { level: 3 });
    
    expect(h1).toHaveTextContent("Main Title");
    expect(h2).toHaveTextContent("Section Title");
    expect(h3).toHaveTextContent("Subsection Title");
  });

  it("applies brutalist design system colors", () => {
    const { rerender } = render(<Typography>Default text</Typography>);
    expect(screen.getByText("Default text")).toHaveClass("text-white");

    rerender(<Typography className="text-black">Black text</Typography>);
    expect(screen.getByText("Black text")).toHaveClass("text-black");

    rerender(<Typography className="text-yellow-400">Yellow text</Typography>);
    expect(screen.getByText("Yellow text")).toHaveClass("text-yellow-400");
  });

  it("uses monospace font family", () => {
    render(<Typography>Monospace text</Typography>);
    
    const text = screen.getByText("Monospace text");
    expect(text).toHaveClass("font-mono");
  });
});