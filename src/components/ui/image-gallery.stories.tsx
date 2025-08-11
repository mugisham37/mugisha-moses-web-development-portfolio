import type { Meta, StoryObj } from "@storybook/react";
import { ImageGallery } from "./image-gallery";

const meta: Meta<typeof ImageGallery> = {
  title: "UI/ImageGallery",
  component: ImageGallery,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    autoPlayInterval: {
      control: { type: "range", min: 1000, max: 10000, step: 500 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleImages = [
  {
    src: "/images/placeholder.svg",
    alt: "Sample image 1",
    caption: "First sample image",
  },
  {
    src: "/images/placeholder.svg",
    alt: "Sample image 2",
    caption: "Second sample image",
  },
  {
    src: "/images/placeholder.svg",
    alt: "Sample image 3",
    caption: "Third sample image",
  },
  {
    src: "/images/placeholder.svg",
    alt: "Sample image 4",
    caption: "Fourth sample image",
  },
];

export const Default: Story = {
  args: {
    images: sampleImages,
    title: "Sample Gallery",
    className: "w-96",
  },
};

export const WithoutThumbnails: Story = {
  args: {
    images: sampleImages,
    title: "Gallery without thumbnails",
    showThumbnails: false,
    className: "w-96",
  },
};

export const WithoutControls: Story = {
  args: {
    images: sampleImages,
    title: "Gallery without controls",
    showControls: false,
    className: "w-96",
  },
};

export const AutoPlay: Story = {
  args: {
    images: sampleImages,
    title: "Auto-playing gallery",
    autoPlay: true,
    autoPlayInterval: 2000,
    className: "w-96",
  },
};

export const SingleImage: Story = {
  args: {
    images: [sampleImages[0]],
    title: "Single image gallery",
    className: "w-96",
  },
};

export const ManyImages: Story = {
  args: {
    images: [
      ...sampleImages,
      ...sampleImages.map((img, i) => ({
        ...img,
        alt: `${img.alt} (duplicate ${i + 1})`,
        caption: `${img.caption} (duplicate ${i + 1})`,
      })),
    ],
    title: "Gallery with many images",
    className: "w-96",
  },
};

export const KeyboardNavigation: Story = {
  args: {
    images: sampleImages,
    title: "Keyboard navigation enabled",
    enableKeyboard: true,
    className: "w-96",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use arrow keys to navigate, space to play/pause, escape to close lightbox",
      },
    },
  },
};

export const SwipeNavigation: Story = {
  args: {
    images: sampleImages,
    title: "Swipe navigation enabled",
    enableSwipe: true,
    className: "w-96",
  },
  parameters: {
    docs: {
      description: {
        story: "Swipe left/right on touch devices to navigate",
      },
    },
  },
};
