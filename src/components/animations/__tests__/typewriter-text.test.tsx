import { render, screen, waitFor } from "@testing-library/react";
import { TypewriterText } from "../typewriter-text";
import { renderWithProviders } from "@/lib/test-utils/component-test-utils";

describe("TypewriterText Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("renders with initial empty state", () => {
    render(<TypewriterText text="Hello World" />);

    const container = screen.getByTestId("typewriter-text");
    expect(container).toBeInTheDocument();
    expect(container).toHaveTextContent("");
  });

  it("types out text character by character", async () => {
    render(<TypewriterText text="Hello" speed={50} />);

    // Fast forward through typing animation
    jest.advanceTimersByTime(50);
    expect(screen.getByTestId("typewriter-text")).toHaveTextContent("H");

    jest.advanceTimersByTime(50);
    expect(screen.getByTestId("typewriter-text")).toHaveTextContent("He");

    jest.advanceTimersByTime(50);
    expect(screen.getByTestId("typewriter-text")).toHaveTextContent("Hel");

    jest.advanceTimersByTime(50);
    expect(screen.getByTestId("typewriter-text")).toHaveTextContent("Hell");

    jest.advanceTimersByTime(50);
    expect(screen.getByTestId("typewriter-text")).toHaveTextContent("Hello");
  });

  it("handles multiple texts with loop", async () => {
    render(
      <TypewriterText
        texts={["Hello", "World"]}
        speed={50}
        deleteSpeed={25}
        loop={true}
        pauseDuration={100}
      />
    );

    // Type "Hello"
    jest.advanceTimersByTime(250); // 5 chars * 50ms
    expect(screen.getByTestId("typewriter-text")).toHaveTextContent("Hello");

    // Pause
    jest.advanceTimersByTime(100);

    // Delete "Hello"
    jest.advanceTimersByTime(125); // 5 chars * 25ms
    expect(screen.getByTestId("typewriter-text")).toHaveTextContent("");

    // Type "World"
    jest.advanceTimersByTime(250); // 5 chars * 50ms
    expect(screen.getByTestId("typewriter-text")).toHaveTextContent("World");
  });

  it("shows cursor when enabled", () => {
    render(<TypewriterText text="Hello" showCursor={true} />);

    const cursor = screen.getByTestId("typewriter-cursor");
    expect(cursor).toBeInTheDocument();
    expect(cursor).toHaveClass("animate-pulse");
  });

  it("hides cursor when disabled", () => {
    render(<TypewriterText text="Hello" showCursor={false} />);

    expect(screen.queryByTestId("typewriter-cursor")).not.toBeInTheDocument();
  });

  it("applies custom cursor character", () => {
    render(<TypewriterText text="Hello" showCursor={true} cursor="█" />);

    const cursor = screen.getByTestId("typewriter-cursor");
    expect(cursor).toHaveTextContent("█");
  });

  it("respects delay before starting", () => {
    render(<TypewriterText text="Hello" speed={50} delay={200} />);

    // Should not start typing during delay
    jest.advanceTimersByTime(100);
    expect(screen.getByTestId("typewriter-text")).toHaveTextContent("");

    // Should start after delay
    jest.advanceTimersByTime(150); // Total 250ms (200 delay + 50 first char)
    expect(screen.getByTestId("typewriter-text")).toHaveTextContent("H");
  });

  it("calls onComplete when typing finishes", () => {
    const onComplete = jest.fn();
    render(<TypewriterText text="Hi" speed={50} onComplete={onComplete} />);

    jest.advanceTimersByTime(100); // 2 chars * 50ms

    expect(onComplete).toHaveBeenCalledWith("Hi");
  });

  it("calls onType for each character", () => {
    const onType = jest.fn();
    render(<TypewriterText text="Hi" speed={50} onType={onType} />);

    jest.advanceTimersByTime(50);
    expect(onType).toHaveBeenCalledWith("H", 0);

    jest.advanceTimersByTime(50);
    expect(onType).toHaveBeenCalledWith("i", 1);
  });

  it("handles empty text gracefully", () => {
    render(<TypewriterText text="" />);

    const container = screen.getByTestId("typewriter-text");
    expect(container).toHaveTextContent("");
  });

  it("handles special characters", async () => {
    render(<TypewriterText text="Hello! @#$%" speed={10} />);

    jest.advanceTimersByTime(100); // 10 chars * 10ms
    expect(screen.getByTestId("typewriter-text")).toHaveTextContent(
      "Hello! @#$%"
    );
  });

  it("applies custom className", () => {
    render(<TypewriterText text="Hello" className="custom-typewriter" />);

    const container = screen.getByTestId("typewriter-text");
    expect(container).toHaveClass("custom-typewriter");
  });

  it("stops loop when loop is false", () => {
    render(
      <TypewriterText
        texts={["Hello", "World"]}
        speed={50}
        deleteSpeed={25}
        loop={false}
        pauseDuration={100}
      />
    );

    // Complete first cycle
    jest.advanceTimersByTime(1000); // Enough time for full cycle

    // Should stop at "World" and not continue
    expect(screen.getByTestId("typewriter-text")).toHaveTextContent("World");
  });

  it("handles single text without deletion", () => {
    render(<TypewriterText text="Hello World" speed={50} />);

    jest.advanceTimersByTime(550); // 11 chars * 50ms
    expect(screen.getByTestId("typewriter-text")).toHaveTextContent(
      "Hello World"
    );

    // Should not delete since it's a single text
    jest.advanceTimersByTime(1000);
    expect(screen.getByTestId("typewriter-text")).toHaveTextContent(
      "Hello World"
    );
  });

  it("preserves text formatting", () => {
    render(
      <TypewriterText
        text="Hello World"
        speed={10}
        className="font-bold text-yellow-400"
      />
    );

    const container = screen.getByTestId("typewriter-text");
    expect(container).toHaveClass("text-yellow-400", "font-bold");
  });

  it("handles rapid text changes", () => {
    const { rerender } = render(<TypewriterText text="Hello" speed={50} />);

    jest.advanceTimersByTime(100); // Partial typing

    // Change text mid-animation
    rerender(<TypewriterText text="Goodbye" speed={50} />);

    // Should restart with new text
    jest.advanceTimersByTime(350); // 7 chars * 50ms
    expect(screen.getByTestId("typewriter-text")).toHaveTextContent("Goodbye");
  });

  it("respects reduced motion preferences", () => {
    // Mock reduced motion preference
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: query === "(prefers-reduced-motion: reduce)",
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    render(<TypewriterText text="Hello World" />);

    // Should immediately show full text with reduced motion
    expect(screen.getByTestId("typewriter-text")).toHaveTextContent(
      "Hello World"
    );
  });

  it("maintains accessibility", () => {
    render(
      <TypewriterText
        text="Hello World"
        aria-label="Animated greeting"
        role="status"
      />
    );

    const container = screen.getByTestId("typewriter-text");
    expect(container).toHaveAttribute("aria-label", "Animated greeting");
    expect(container).toHaveAttribute("role", "status");
  });
});
