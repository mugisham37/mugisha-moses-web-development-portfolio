import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrutalistSpinner } from "../loading-animations";
import { BrutalistHover } from "../hover-effects";
import { EnhancedScrollReveal } from "../enhanced-scroll-reveal";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useInView: () => true,
  useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
  useTransform: () => ({ get: () => 0 }),
  useSpring: () => ({ get: () => 0 }),
  useMotionValue: () => ({ get: () => 0, set: () => {} }),
  useVelocity: () => ({ get: () => 0 }),
  useAnimationFrame: () => {},
  useAnimation: () => ({ start: () => Promise.resolve() }),
}));

describe("Animation Components", () => {
  test("BrutalistSpinner renders correctly", () => {
    render(<BrutalistSpinner />);
    const spinner = document.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  test("BrutalistHover renders children", () => {
    render(
      <BrutalistHover>
        <div>Test Content</div>
      </BrutalistHover>
    );
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  test("EnhancedScrollReveal renders children", () => {
    render(
      <EnhancedScrollReveal>
        <div>Scroll Content</div>
      </EnhancedScrollReveal>
    );
    expect(screen.getByText("Scroll Content")).toBeInTheDocument();
  });
});
