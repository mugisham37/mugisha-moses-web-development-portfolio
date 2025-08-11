import type { Meta, StoryObj } from "@storybook/react";
import { StarRating } from "./star-rating";

const meta: Meta<typeof StarRating> = {
  title: "Components/Testimonials/StarRating",
  component: StarRating,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A star rating component that can display and optionally allow interaction with ratings.",
      },
    },
  },
  argTypes: {
    rating: {
      control: { type: "range", min: 0, max: 5, step: 0.5 },
      description: "The current rating value",
    },
    maxRating: {
      control: { type: "number", min: 1, max: 10 },
      description: "Maximum number of stars",
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
      description: "Size of the stars",
    },
    interactive: {
      control: { type: "boolean" },
      description: "Whether the rating can be changed by clicking",
    },
  },
};

export default meta;
type Story = StoryObj<typeof StarRating>;

export const Default: Story = {
  args: {
    rating: 4,
    maxRating: 5,
    size: "md",
    interactive: false,
  },
};

export const Interactive: Story = {
  args: {
    rating: 3,
    maxRating: 5,
    size: "md",
    interactive: true,
    onChange: (rating) => console.log("Rating changed to:", rating),
  },
};

export const SmallSize: Story = {
  args: {
    rating: 5,
    size: "sm",
  },
};

export const LargeSize: Story = {
  args: {
    rating: 4.5,
    size: "lg",
  },
};

export const CustomMaxRating: Story = {
  args: {
    rating: 7,
    maxRating: 10,
    size: "md",
  },
};

export const ZeroRating: Story = {
  args: {
    rating: 0,
    maxRating: 5,
    size: "md",
  },
};

export const PartialRating: Story = {
  args: {
    rating: 3.5,
    maxRating: 5,
    size: "md",
  },
};

export const InteractiveLarge: Story = {
  args: {
    rating: 2,
    maxRating: 5,
    size: "lg",
    interactive: true,
    onChange: (rating) => console.log("Rating changed to:", rating),
  },
};
