import { render, screen, waitFor } from "@testing-library/react";
import { AnimatedCounter } from "../animated-counter";
import { renderWithProviders } from "@/lib/test-utils/component-test-utils";

// Mock Framer Motion
jest.mock("framer-motion", () => ({
  motion: {
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  useInView: () => true,
  useMotionValue: () => ({ set: jest.fn(), get: () => 0 }),
  useTransform: () => ({ get: () => 0 }),
  animate: jest.fn(),
}));

describe("AnimatedCounter Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with initial value", () => {
    render(<AnimatedCounter end={100} />);

    const counter = screen.getByText("0");
    expect(counter).toBeInTheDocument();
  });

  it("displays the target value after animation", async () => {
    render(<AnimatedCounter end={100} duration={0.1} />);

    // Wait for animation to complete
    await waitFor(
      () => {
        expect(screen.getByText("100")).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });

  it("handles decimal values", async () => {
    render(<AnimatedCounter end={99.5} duration={0.1} />);

    await waitFor(() => {
      expect(screen.getByText("99.5")).toBeInTheDocument();
    });
  });

  it("applies custom formatting", async () => {
    const formatter = (value: number) => `$${value.toFixed(2)}`;
    render(<AnimatedCounter end={1000} duration={0.1} formatter={formatter} />);

    await waitFor(() => {
      expect(screen.getByText("$1000.00")).toBeInTheDocument();
    });
  });

  it("handles prefix and suffix", async () => {
    render(<AnimatedCounter end={50} duration={0.1} prefix="+" suffix="%" />);

    await waitFor(() => {
      expect(screen.getByText("+50%")).toBeInTheDocument();
    });
  });

  it("respects delay prop", () => {
    render(<AnimatedCounter end={100} delay={1} />);

    // Should still show initial value during delay
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("handles large numbers", async () => {
    render(<AnimatedCounter end={1000000} duration={0.1} />);

    await waitFor(() => {
      expect(screen.getByText("1000000")).toBeInTheDocument();
    });
  });

  it("handles negative numbers", async () => {
    render(<AnimatedCounter end={-50} duration={0.1} />);

    await waitFor(() => {
      expect(screen.getByText("-50")).toBeInTheDocument();
    });
  });

  it("applies custom className", () => {
    render(<AnimatedCounter end={100} className="custom-counter" />);

    const counter = screen.getByText("0");
    expect(counter).toHaveClass("custom-counter");
  });

  it("calls onComplete callback when animation finishes", async () => {
    const onComplete = jest.fn();
    render(
      <AnimatedCounter end={100} duration={0.1} onComplete={onComplete} />
    );

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledWith(100);
    });
  });

  it("handles zero as end value", async () => {
    render(<AnimatedCounter end={0} duration={0.1} />);

    await waitFor(() => {
      expect(screen.getByText("0")).toBeInTheDocument();
    });
  });

  it("starts from custom start value", async () => {
    render(<AnimatedCounter start={50} end={100} duration={0.1} />);

    // Should start from 50
    expect(screen.getByText("50")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("100")).toBeInTheDocument();
    });
  });

  it("handles easing functions", async () => {
    render(<AnimatedCounter end={100} duration={0.1} ease="easeInOut" />);

    await waitFor(() => {
      expect(screen.getByText("100")).toBeInTheDocument();
    });
  });

  it("preserves accessibility", () => {
    render(
      <AnimatedCounter end={100} aria-label="Project count" role="status" />
    );

    const counter = screen.getByRole("status");
    expect(counter).toHaveAttribute("aria-label", "Project count");
  });

  it("handles rapid value changes", async () => {
    const { rerender } = render(<AnimatedCounter end={50} duration={0.1} />);

    // Change the end value quickly
    rerender(<AnimatedCounter end={100} duration={0.1} />);

    await waitFor(() => {
      expect(screen.getByText("100")).toBeInTheDocument();
    });
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

    render(<AnimatedCounter end={100} />);

    // Should immediately show end value with reduced motion
    expect(screen.getByText("100")).toBeInTheDocument();
  });
});
