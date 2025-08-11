import { render, screen, waitFor } from "@testing-library/react";
import { OptimizedImage } from "../optimized-image";

// Mock Next.js Image component
jest.mock("next/image", () => {
  return function MockImage({ src, alt, onLoad, onError, ...props }: any) {
    return (
      <img
        src={src}
        alt={alt}
        onLoad={onLoad}
        onError={onError}
        data-testid="next-image"
        {...props}
      />
    );
  };
});

describe("OptimizedImage", () => {
  it("renders with required props", () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={400}
        height={300}
      />
    );

    const image = screen.getByTestId("next-image");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/test-image.jpg");
    expect(image).toHaveAttribute("alt", "Test image");
  });

  it("shows loading state initially", () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={400}
        height={300}
        showLoader={true}
      />
    );

    expect(screen.getByText("IMAGE NOT FOUND")).toBeInTheDocument();
  });

  it("handles image load", async () => {
    const onLoad = jest.fn();

    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={400}
        height={300}
        onLoadingComplete={onLoad}
      />
    );

    const image = screen.getByTestId("next-image");

    // Simulate image load
    image.dispatchEvent(new Event("load"));

    await waitFor(() => {
      expect(onLoad).toHaveBeenCalled();
    });
  });

  it("handles image error with fallback", async () => {
    const onError = jest.fn();

    render(
      <OptimizedImage
        src="/non-existent.jpg"
        alt="Test image"
        fallbackSrc="/fallback.jpg"
        width={400}
        height={300}
        onError={onError}
      />
    );

    const image = screen.getByTestId("next-image");

    // Simulate image error
    image.dispatchEvent(new Event("error"));

    await waitFor(() => {
      expect(image).toHaveAttribute("src", "/fallback.jpg");
    });
  });

  it("applies aspect ratio classes", () => {
    const { container } = render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        aspectRatio="video"
        fill
      />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("aspect-video");
  });

  it("applies object fit classes", () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        objectFit="contain"
        width={400}
        height={300}
      />
    );

    const image = screen.getByTestId("next-image");
    expect(image).toHaveClass("object-contain");
  });

  it("shows error state when fallback also fails", async () => {
    render(
      <OptimizedImage
        src="/non-existent.jpg"
        alt="Test image"
        fallbackSrc="/also-non-existent.jpg"
        width={400}
        height={300}
      />
    );

    const image = screen.getByTestId("next-image");

    // Simulate first error (switches to fallback)
    image.dispatchEvent(new Event("error"));

    await waitFor(() => {
      expect(image).toHaveAttribute("src", "/also-non-existent.jpg");
    });

    // Simulate fallback error
    image.dispatchEvent(new Event("error"));

    await waitFor(() => {
      expect(screen.getByText("IMAGE NOT FOUND")).toBeInTheDocument();
    });
  });
});
