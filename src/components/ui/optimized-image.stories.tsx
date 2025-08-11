import type { Meta, StoryObj } from "@storybook/react";
import { OptimizedImage } from "./optimized-image";

const meta: Meta<typeof OptimizedImage> = {
  title: "UI/OptimizedImage",
  component: OptimizedImage,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    aspectRatio: {
      control: "select",
      options: ["square", "video", "portrait", "landscape", "auto"],
    },
    objectFit: {
      control: "select",
      options: ["cover", "contain", "fill", "none", "scale-down"],
    },
    quality: {
      control: { type: "range", min: 1, max: 100, step: 1 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: "/images/placeholder.svg",
    alt: "Default optimized image",
    width: 400,
    height: 300,
  },
};

export const WithAspectRatio: Story = {
  args: {
    src: "/images/placeholder.svg",
    alt: "Image with aspect ratio",
    aspectRatio: "video",
    containerClassName: "w-96",
  },
};

export const Square: Story = {
  args: {
    src: "/images/placeholder.svg",
    alt: "Square image",
    aspectRatio: "square",
    containerClassName: "w-64",
  },
};

export const Portrait: Story = {
  args: {
    src: "/images/placeholder.svg",
    alt: "Portrait image",
    aspectRatio: "portrait",
    containerClassName: "w-64",
  },
};

export const WithFallback: Story = {
  args: {
    src: "/non-existent-image.jpg",
    alt: "Image with fallback",
    fallbackSrc: "/images/placeholder.svg",
    width: 400,
    height: 300,
  },
};

export const HighQuality: Story = {
  args: {
    src: "/images/placeholder.svg",
    alt: "High quality image",
    quality: 95,
    priority: true,
    width: 400,
    height: 300,
  },
};

export const Loading: Story = {
  args: {
    src: "/images/placeholder.svg",
    alt: "Loading image",
    showLoader: true,
    width: 400,
    height: 300,
  },
  parameters: {
    docs: {
      description: {
        story: "Shows loading state while image loads",
      },
    },
  },
};

export const Fill: Story = {
  args: {
    src: "/images/placeholder.svg",
    alt: "Fill image",
    fill: true,
    aspectRatio: "video",
    containerClassName: "w-96 h-64",
  },
  parameters: {
    docs: {
      description: {
        story: "Image fills the container using Next.js fill prop",
      },
    },
  },
};
