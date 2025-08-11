import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ImageGallery } from "../image-gallery";

// Mock Framer Motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock Next.js Image component
jest.mock("next/image", () => {
  return function MockImage({ src, alt, onClick, ...props }: any) {
    return (
      <img
        src={src}
        alt={alt}
        onClick={onClick}
        data-testid="gallery-image"
        {...props}
      />
    );
  };
});

const sampleImages = [
  {
    src: "/image1.jpg",
    alt: "Image 1",
    caption: "First image",
  },
  {
    src: "/image2.jpg",
    alt: "Image 2",
    caption: "Second image",
  },
  {
    src: "/image3.jpg",
    alt: "Image 3",
    caption: "Third image",
  },
];

describe("ImageGallery", () => {
  it("renders with images", () => {
    render(<ImageGallery images={sampleImages} />);

    const images = screen.getAllByTestId("gallery-image");
    expect(images).toHaveLength(sampleImages.length + 1); // Main image + thumbnails
  });

  it("shows image counter", () => {
    render(<ImageGallery images={sampleImages} />);

    expect(screen.getByText("1 / 3")).toBeInTheDocument();
  });

  it("navigates to next image", () => {
    render(<ImageGallery images={sampleImages} />);

    const nextButton = screen.getByRole("button", { name: /next image/i });
    fireEvent.click(nextButton);

    expect(screen.getByText("2 / 3")).toBeInTheDocument();
  });

  it("navigates to previous image", () => {
    render(<ImageGallery images={sampleImages} />);

    // Go to next first
    const nextButton = screen.getByRole("button", { name: /next image/i });
    fireEvent.click(nextButton);

    // Then go back
    const prevButton = screen.getByRole("button", { name: /previous image/i });
    fireEvent.click(prevButton);

    expect(screen.getByText("1 / 3")).toBeInTheDocument();
  });

  it("wraps around when navigating", () => {
    render(<ImageGallery images={sampleImages} />);

    // Go to previous from first image (should wrap to last)
    const prevButton = screen.getByRole("button", { name: /previous image/i });
    fireEvent.click(prevButton);

    expect(screen.getByText("3 / 3")).toBeInTheDocument();
  });

  it("shows thumbnails when enabled", () => {
    render(<ImageGallery images={sampleImages} showThumbnails={true} />);

    const thumbnails = screen.getAllByRole("button");
    // Should have navigation buttons + thumbnail buttons + play/pause + lightbox
    expect(thumbnails.length).toBeGreaterThan(5);
  });

  it("hides thumbnails when disabled", () => {
    render(<ImageGallery images={sampleImages} showThumbnails={false} />);

    // Should only have navigation and control buttons, no thumbnail buttons
    const thumbnails = screen.queryAllByRole("button");
    expect(thumbnails.length).toBeLessThan(6);
  });

  it("toggles autoplay", () => {
    render(<ImageGallery images={sampleImages} />);

    const playButton = screen.getByRole("button", { name: /play slideshow/i });
    fireEvent.click(playButton);

    expect(
      screen.getByRole("button", { name: /pause slideshow/i })
    ).toBeInTheDocument();
  });

  it("opens lightbox when main image is clicked", () => {
    render(<ImageGallery images={sampleImages} />);

    const mainImage = screen.getAllByTestId("gallery-image")[0];
    fireEvent.click(mainImage);

    // Lightbox should be open (check for close button)
    expect(
      screen.getByRole("button", { name: /close lightbox/i })
    ).toBeInTheDocument();
  });

  it("calls onImageChange when image changes", () => {
    const onImageChange = jest.fn();
    render(
      <ImageGallery images={sampleImages} onImageChange={onImageChange} />
    );

    const nextButton = screen.getByRole("button", { name: /next image/i });
    fireEvent.click(nextButton);

    expect(onImageChange).toHaveBeenCalledWith(1);
  });

  it("handles empty images array", () => {
    render(<ImageGallery images={[]} />);

    // Should not render anything
    expect(screen.queryByTestId("gallery-image")).not.toBeInTheDocument();
  });

  it("handles single image", () => {
    render(<ImageGallery images={[sampleImages[0]]} />);

    expect(screen.getByText("1 / 1")).toBeInTheDocument();

    // Navigation buttons should not be present for single image
    expect(
      screen.queryByRole("button", { name: /next image/i })
    ).not.toBeInTheDocument();
  });

  it("supports keyboard navigation", async () => {
    render(<ImageGallery images={sampleImages} enableKeyboard={true} />);

    // Simulate arrow key press
    fireEvent.keyDown(window, { key: "ArrowRight" });

    await waitFor(() => {
      expect(screen.getByText("2 / 3")).toBeInTheDocument();
    });
  });

  it("closes lightbox with escape key", async () => {
    render(<ImageGallery images={sampleImages} enableKeyboard={true} />);

    // Open lightbox
    const mainImage = screen.getAllByTestId("gallery-image")[0];
    fireEvent.click(mainImage);

    // Close with escape
    fireEvent.keyDown(window, { key: "Escape" });

    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: /close lightbox/i })
      ).not.toBeInTheDocument();
    });
  });
});
