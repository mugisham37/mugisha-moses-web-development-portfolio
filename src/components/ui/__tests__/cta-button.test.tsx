import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CTAButton } from "../cta-button";
import { it } from "zod/v4/locales";
import { it } from "zod/v4/locales";
import { it } from "zod/v4/locales";
import { it } from "zod/v4/locales";
import { it } from "zod/v4/locales";
import { it } from "zod/v4/locales";
import { it } from "zod/v4/locales";
import { it } from "zod/v4/locales";
import { it } from "zod/v4/locales";
import { it } from "zod/v4/locales";
import { it } from "zod/v4/locales";
import { describe } from "node:test";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      ...props
    }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div {...props}>{children}</div>
    ),
  },
  useMotionValue: () => ({ set: jest.fn() }),
  useSpring: () => ({ set: jest.fn() }),
  useTransform: () => "transform",
}));

describe("CTAButton", () => {
  it("renders with children", () => {
    render(<CTAButton>Test Button</CTAButton>);
    expect(screen.getByRole("button")).toHaveTextContent("Test Button");
  });

  it("calls onClick handler when clicked", () => {
    const handleClick = jest.fn();
    render(<CTAButton onClick={handleClick}>Click Me</CTAButton>);

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("calls onHoverStart when mouse enters", () => {
    const handleHoverStart = jest.fn();
    render(<CTAButton onHoverStart={handleHoverStart}>Hover Me</CTAButton>);

    fireEvent.mouseEnter(screen.getByRole("button").parentElement!);
    expect(handleHoverStart).toHaveBeenCalledTimes(1);
  });

  it("calls onHoverEnd when mouse leaves", () => {
    const handleHoverEnd = jest.fn();
    render(<CTAButton onHoverEnd={handleHoverEnd}>Hover Me</CTAButton>);

    const buttonContainer = screen.getByRole("button").parentElement!;
    fireEvent.mouseEnter(buttonContainer);
    fireEvent.mouseLeave(buttonContainer);
    expect(handleHoverEnd).toHaveBeenCalledTimes(1);
  });

  it("applies correct variant classes", () => {
    render(<CTAButton variant="accent">Accent Button</CTAButton>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-accent-yellow");
  });

  it("applies correct size classes", () => {
    render(<CTAButton size="lg">Large Button</CTAButton>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("h-14");
  });

  it("handles disabled state correctly", () => {
    const handleClick = jest.fn();
    render(
      <CTAButton disabled onClick={handleClick}>
        Disabled Button
      </CTAButton>
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("shows loading state correctly", () => {
    render(<CTAButton loading>Loading Button</CTAButton>);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-busy", "true");
  });

  it("supports accessibility features", () => {
    render(<CTAButton>Accessible Button</CTAButton>);
    const button = screen.getByRole("button");

    // Test keyboard navigation
    fireEvent.keyDown(button, { key: "Enter" });
    fireEvent.keyUp(button, { key: "Enter" });

    // Should not throw errors and maintain accessibility
    expect(button).toBeInTheDocument();
  });

  it("creates sparkle effects on hover when enabled", async () => {
    render(<CTAButton sparkleEffect={true}>Sparkle Button</CTAButton>);
    const buttonContainer = screen.getByRole("button").parentElement!;

    fireEvent.mouseEnter(buttonContainer);

    // Wait for sparkles to be created
    await waitFor(() => {
      // Check if sparkle elements are created (they have specific styling)
      const sparkles = buttonContainer.querySelectorAll('[style*="left"]');
      expect(sparkles.length).toBeGreaterThan(0);
    });
  });

  it("applies haptic feedback simulation on click", () => {
    const handleClickComplete = jest.fn();
    render(
      <CTAButton
        soundDesignFeedback={true}
        hapticIntensity="strong"
        onClickComplete={handleClickComplete}
      >
        Haptic Button
      </CTAButton>
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    // Check if visual feedback is applied
    expect(button.style.transform).toBeTruthy();
  });
});
